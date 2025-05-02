'use client';

import axios from "axios";
import { useState } from "react";

const ChatBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
  
  ]);
  const [userInput, setUserInput] = useState("");

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  async function sendMessage() {
    if (!userInput.trim()) return;
  
    // Add the user's message
    setMessages(prev => [...prev, { text: userInput, sender: "user" }]);
    setUserInput("");
  
    // Show a "Thinking..." message
    setMessages(prev => [...prev, { text: "Thinking...", sender: "bot", loading: true }]);
  
    try {
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
      });
  
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
  
      // Parse the JSON response
      const data = await response.json();
      const botReply = data.response;
  
      // Update the bot message with the real response
      setMessages(prev => {
        const allMessages = [...prev];
        allMessages[allMessages.length - 1] = {
          text: botReply,
          sender: "bot",
          loading: false
        };
        return allMessages;
      });
  
    } catch (error) {
      console.error("Error:", error);
      // Show error message
      setMessages(prev => {
        const allMessages = [...prev];
        allMessages[allMessages.length - 1] = {
          text: "Error: " + error.message,
          sender: "bot",
          error: true
        };
        return allMessages;
      });
    }
  }
  
  return (
    
    <div className="fixed bottom-4 right-4">
      
      <button
        onClick={toggleChat}
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Chat with Admin Bot
      </button>
      {isChatOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-white shadow-md rounded-lg">
          <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
            <p className="text-lg font-semibold">Admin Bot</p>
            <button onClick={toggleChat} className="text-gray-300 hover:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-4 h-80 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
              >
                <p
                  className={`${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  } rounded-lg py-2 px-4 inline-block`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message"
              className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
