from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai
import numpy as np
from functools import lru_cache
import re
import os
from dotenv import load_dotenv

# Load environment variables from .env.local file
load_dotenv('.env.local')

# ------ Settings ------------------------------------------------------
# Replace with your Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your-gemini-api-key-here")
GEMINI_MODEL = "gemini-1.5-flash"  # or "gemini-1.5-pro" for more capable model

MONGO_URL = "mongodb://localhost:27017/"
DB_NAME = "PostsDB"
COLLECTION = "posts"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
TOP_K = 5

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# ------ App setup ----------------------------------------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"]
)

class Message(BaseModel):
    message: str

# ------ Embedding & DB init ------------------------------------------
@lru_cache(maxsize=1)
def get_embedder():
    return SentenceTransformer(EMBEDDING_MODEL)

@lru_cache(maxsize=1)
def get_db_connection():
    client = MongoClient(MONGO_URL)
    offers_col = client[DB_NAME][COLLECTION]
    offers = list(offers_col.find())
    print(offers)
    print(client)
    offer_snippets = [
        f"{o.get('propertyType', 'Property')} in {o.get('placeName', 'Unknown')} for "
        f"{o.get('prix', 'N/A')} TND. Features: {', '.join(o.get('equipements', [])) or 'none'}."
        for o in offers
    ]
    
    # Pre-compute embeddings
    embedder = get_embedder()
    offer_embeds = embedder.encode(offer_snippets)
    
    return offers, offer_snippets, offer_embeds

# ------ Helpers --------------------------------------------------------------
def intent_is_property_request(text: str) -> bool:
    """AI-powered intent detection using Gemini"""
    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        
        prompt = f"""
        Analyze the following user message and determine if they are asking for property recommendations, searches, or real estate help.

        User message: "{text}"

        Return ONLY "YES" if the user is asking about:
        - Finding/searching for properties, houses, apartments, land
        - Property recommendations or suggestions
        - Real estate advice or help
        - Buying, renting, or locating properties

        Return ONLY "NO" if the user is asking about:
        - General questions unrelated to property search
        - Greetings or casual conversation
        - Other topics

        Response (YES or NO):
        """
        
        response = model.generate_content(prompt)
        result = response.text.strip().upper()
        
        print(f"Intent detection for '{text}': {result}")
        return result == "YES"
        
    except Exception as e:
        print(f"Error in AI intent detection: {e}")
        # Fallback to simple keyword detection
        return simple_keyword_intent_check(text)

def simple_keyword_intent_check(text: str) -> bool:
    """Fallback simple intent detection"""
    property_keywords = [
        'property', 'properties', 'house', 'houses', 'apartment', 'apartments', 
        'flat', 'flats', 'land', 'real estate', 'home', 'homes',
        'propriété', 'propriétés', 'maison', 'maisons', 'appartement', 'appartements',
        'terrain', 'immobilier'
    ]
    
    intent_keywords = [
        'find', 'search', 'looking', 'recommend', 'suggest', 'show', 'need', 'want',
        'buy', 'rent', 'purchase', 'locate', 'help',
        'trouver', 'chercher', 'recherche', 'recommander', 'suggérer', 'montrer',
        'besoin', 'veux', 'acheter', 'louer', 'aide'
    ]
    
    text_lower = text.lower()
    
    # Check if text contains both property and intent keywords
    has_property = any(keyword in text_lower for keyword in property_keywords)
    has_intent = any(keyword in text_lower for keyword in intent_keywords)
    
    # Also check for direct property questions
    direct_patterns = [
        'what properties', 'any properties', 'show properties',
        'quelles propriétés', 'des propriétés', 'montrez propriétés'
    ]
    
    has_direct = any(pattern in text_lower for pattern in direct_patterns)
    
    result = (has_property and has_intent) or has_direct
    print(f"Fallback intent check for '{text}': {result}")
    return result

def vector_search(query: str, k=TOP_K):
    offers, offer_snippets, offer_embeds = get_db_connection()
    embedder = get_embedder()
    
    q_embed = embedder.encode([query])
    sims = cosine_similarity(q_embed, offer_embeds)
    idxs = np.argsort(sims[0])[-k:][::-1]
    
    return [offers[i] for i in idxs], [offer_snippets[i] for i in idxs]

def ask_gemini(prompt: str) -> str:
    """Send prompt to Gemini API and get response"""
    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error contacting Gemini API: {str(e)}")

# ------ Conversation State --------------------------------------------
class ConversationState:
    def __init__(self):
        self.state = {}

    def get_state(self, user_id):
        if user_id not in self.state:
            self.state[user_id] = {"history": []}
        return self.state[user_id]

    def add_message(self, user_id, role, content):
        if user_id not in self.state:
            self.state[user_id] = {"history": []}
        self.state[user_id]["history"].append({"role": role, "content": content})
        # Keep last 10 messages for context
        self.state[user_id]["history"] = self.state[user_id]["history"][-10:]

conversation_state = ConversationState()

# ------ Endpoint ------------------------------------------------------------
@app.post("/generate")
async def generate(msg: Message, request: Request):
    user_id = request.client.host
    user_text = msg.message.strip()
    
    if not user_text:
        raise HTTPException(400, "Empty message")

    # Get conversation state
    state = conversation_state.get_state(user_id)
    conversation_state.add_message(user_id, "user", user_text)

    # Check if the user is asking for property recommendations
    if intent_is_property_request(user_text):
        # Get relevant properties
        selected_offers, selected_snippets = vector_search(user_text)
        
        # Format the offers into a numbered list
        summary_lines = "\n".join(
            f"{i + 1}. {snippet}" for i, snippet in enumerate(selected_snippets)
        )
        print("okay roger that ")
        # Generate recommendation
        prompt = (
            f"You are a real-estate assistant. The user is asking: \"{user_text}\"\n\n"
            f"Here are the most relevant properties:\n{summary_lines}\n\n"
            "Write a friendly, concise recommendation highlighting these options. Be conversational and helpful."
        )
        
        response = ask_gemini(prompt)
    else:
        # For regular conversation
        print("didnt detect anything ")
        history = state["history"]
        conversation_context = "\n".join([f"{'User' if msg['role'] == 'user' else 'Assistant'}: {msg['content']}" 
                                        for msg in history[-6:]])
        
        prompt = (
            "You are a friendly assistant for a real estate company. Have a natural conversation with the user. "
            "Do NOT recommend properties unless explicitly asked. Be helpful with general questions.\n\n"
            f"Conversation history:\n{conversation_context}\n\n"
            "Provide a friendly response."
        )
        
        response = ask_gemini(prompt)
    
    conversation_state.add_message(user_id, "assistant", response)
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)