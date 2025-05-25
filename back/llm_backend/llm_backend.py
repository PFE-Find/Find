from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import requests
import numpy as np
from functools import lru_cache
import re

# command to run the llm in docker file  

# docker run --rm --gpus=all -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama 

# ------ Settings ------------------------------------------------------
OLLAMA_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "gemma3:4b"
MONGO_URL = "mongodb://localhost:27017/"
DB_NAME = "PostsDB"
COLLECTION = "posts"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
TOP_K = 5

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
    """More precise intent detection using regex patterns"""
    patterns = [
        r'\b(?:recommend|suggest|find|looking\s+for|search\s+for)\b.*\b(?:property|land|house|apartment|flat|real\s+estate)\b',
        r'\b(?:property|land|house|apartment|flat)\b.*\b(?:recommend|suggest|find)\b',
        r'\bhelp\s+(?:me|us)\s+(?:find|buy|rent|locate)\b',
        r'\bwhat\s+properties\b',
        r'\bbest\s+(?:property|land|house|apartment|flat)\b'
    ]
    fr_patterns = [
        r'\b(?:recommander|suggérer|trouver|cherche|recherche)\b.*\b(?:propriété|terrain|maison|appartement|immobilier)\b',
        r'\b(?:propriété|terrain|maison|appartement)\b.*\b(?:recommander|suggérer|trouver)\b',
        r'\baide\s*(?:moi|nous)\s*(?:trouver|acheter|louer|localiser)\b',
        r'\bquelles?\s+(?:propriétés|maisons|appartements)\b',
        r'\bmeilleur(?:e)?s?\s+(?:propriété|terrain|maison|appartement)\b',
        r'\b(?:je\s+veux|j\'ai\s+besoin\s+d\')\s+(?:trouver|acheter|louer)\b'
    ]
    
    
  
    return any(re.search(pattern, text.lower()) for pattern in en_patterns + fr_patterns)

def vector_search(query: str, k=TOP_K):
    offers, offer_snippets, offer_embeds = get_db_connection()
    embedder = get_embedder()
    
    q_embed = embedder.encode([query])
    sims = cosine_similarity(q_embed, offer_embeds)
    idxs = np.argsort(sims[0])[-k:][::-1]
    
    return [offers[i] for i in idxs], [offer_snippets[i] for i in idxs]

def ask_llm(prompt: str) -> str:
    payload = {
        "model": OLLAMA_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "stream": False
    }
    try:
        resp = requests.post(OLLAMA_URL, json=payload, timeout=60)
        resp.raise_for_status()
        return resp.json().get("message", {}).get("content", "").strip()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error contacting LLM: {str(e)}")

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
        
        response = ask_llm(prompt)
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
        
        response = ask_llm(prompt)
    
    conversation_state.add_message(user_id, "assistant", response)
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)