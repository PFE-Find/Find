'use client';

import { useState, useRef, useEffect } from "react";
import { Send, X, Bot, User, MessageSquare } from 'lucide-react';

// Define message type for TypeScript
type Message = {
  text: string;
  sender: "user" | "bot";
  loading?: boolean;
  error?: boolean;
};

const ChatBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Bonjour ! Je suis l'assistant Find. Comment puis-je vous aider ?", sender: "bot" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
const [hasHydrated, setHasHydrated] = useState(false);
  // Load messages from localStorage on component mount
  useEffect(() => {
    const loadMessages = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedMessages = localStorage.getItem('chatMessages');
          if (savedMessages) {
            const parsedMessages = JSON.parse(savedMessages);
            if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
              setMessages(parsedMessages);
            } else {
              // Set initial message if no history exists
              setMessages([{ text: "Bonjour ! Je suis l'assistant Find. Comment puis-je vous aider ?", sender: "bot" }]);
            }
          } else {
            // Set initial message if no history exists
            setMessages([{ text: "Bonjour ! Je suis l'assistant Find. Comment puis-je vous aider ?", sender: "bot" }]);
          }
          setHasHydrated(true);
        }
      } catch (e) {
        console.error("Failed to load messages", e);
        setMessages([{ text: "Bonjour ! Je suis l'assistant Find. Comment puis-je vous aider ?", sender: "bot" }]);
        setHasHydrated(true);
      }
    };

    loadMessages();
  }, []);

  // Save messages to localStorage whenever they change AND on unmount
  useEffect(() => {
    if (!hasHydrated) return; // Don't save before hydration
    
    const saveMessages = () => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('chatMessages', JSON.stringify(messages));
        }
      } catch (e) {
        console.error("Failed to save messages", e);
      }
    };

    saveMessages();

    return () => {
      // Cleanup - save on unmount
      saveMessages();
    };
  }, [messages, hasHydrated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const clearConversation = () => {
    const confirmation = confirm("Voulez-vous vraiment effacer toute la conversation ?");
    if (confirmation) {
      const initialMessage = { text: "Bonjour ! Je suis l'assistant Find. Comment puis-je vous aider ?", sender: "bot" };
      setMessages([initialMessage]);
    }
  };

  async function sendMessage() {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = { text: userInput, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      setMessages(prev => [...prev, { text: "", sender: "bot", loading: true }]);

      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      const botReply = data.response;

      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          text: botReply,
          sender: "bot",
          loading: false
        };
        return newMessages;
      });

    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          text: "Désolé, une erreur s'est produite. Veuillez réessayer.",
          sender: "bot",
          error: true
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Custom Teal Chat Button */}
      <button
        onClick={toggleChat}
        className="group relative cursor-pointer outline-none border-none rounded-full flex flex-row items-center justify-center h-12 w-12 hover:!w-[120px] transition-all duration-[0.75s] before:content-[''] before:absolute before:w-full before:h-full before:inset-0 before:bg-[linear-gradient(130deg,#0d9488,#14b8a6_33%,#2dd4bf)] before:ring-4 before:ring-offset-4 before:ring-[#14b8a6] before:rounded-full before:transition before:duration-300 before:ring-offset-[#fff] hover:before:scale-105 active:before:scale-95 text-white"
        aria-label={isChatOpen ? "Fermer le chat" : "Ouvrir le chat"}
      >
        <MessageSquare
          className="absolute left-2 group-hover:left-1.5 group-active:left-[10px] duration-300 transition-[left] z-10 w-6 h-6 text-white"
          strokeWidth="2"
        />
        <span
          className="absolute right-1.5 text-[15px] font-semibold [--w:calc(100%-48px)] w-[--w] max-w-[--w] overflow-hidden flex items-center justify-end -z-[1] group-hover:z-[9] pointer-events-none select-none opacity-0 group-hover:opacity-100 text-transparent group-hover:text-inherit group-active:right-2 transition-all duration-[2s] group-hover:duration-300 group-active:scale-[0.85]"
        >
          Assistant
        </span>
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-white shadow-xl rounded-lg overflow-hidden flex flex-col border border-teal-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <h2 className="font-semibold text-lg">Find Assistant</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={clearConversation}
                className="p-1 text-xs hover:bg-teal-700 transition-colors rounded"
                aria-label="Effacer la conversation"
                title="Effacer la conversation"
              >
                Effacer
              </button>
              <button 
                onClick={toggleChat}
                className="p-1 rounded-full hover:bg-teal-700 transition-colors"
                aria-label="Fermer le chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-teal-50 max-h-96">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${msg.sender === "user" ?
                    "bg-teal-600 text-white rounded-br-none" :
                    "bg-white text-gray-800 border border-teal-100 rounded-bl-none shadow-sm"}`}
                >
                  {msg.loading ? (
                    <div className="flex space-x-2 py-1">
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce delay-200"></div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-teal-200 p-3 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Tapez votre message..."
                className="flex-1 px-4 py-2 border border-teal-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !userInput.trim()}
                className={`p-2 rounded-full ${isLoading || !userInput.trim() ?
                  'bg-teal-200 text-teal-500 cursor-not-allowed' :
                  'bg-teal-600 text-white hover:bg-teal-700'}`}
                aria-label="Envoyer le message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-teal-600 mt-2 text-center">
              Find Assistant - Assistance 24/7
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;