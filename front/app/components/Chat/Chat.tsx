'use client';

import React, { useState } from "react";

const ChatUI = () => {
  const currentUserId = 1; // Example: Assume the logged-in user has ID 1

  const [users, setUsers] = useState([
    { id: 2, name: "wessim saidani", role: "le propriétaire du terrain | Membre depuis 3 ans", avatar: "/assets/wessim.png" },
    { id: 3, name: "akram zaabi", role: "Agent immobilier | Membre depuis 2 ans", avatar: "/assets/akram.jpg" },
  ]);

  const [selectedUser, setSelectedUser] = useState(users[0]);

  const [messages, setMessages] = useState([
    { id: 1, senderId: 2, receiverId: 1, text: "I'm fine thank you, how are you?", time: "11:05 AM" },
    { id: 2, senderId: 1, receiverId: 2, text: "Whats up wiss !!!", time: "11:06 AM" },
    { id: 3, senderId: 3, receiverId: 1, text: "Keep up the good work", time: "11:07 AM" },
    { id: 4, senderId: 1, receiverId: 2, text: "We'll schedule a meeting later !!", time: "11:08 AM" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const newMsg = {
      id: messages.length + 1,
      senderId: currentUserId,
      receiverId: selectedUser.id,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="h-[814px] flex items-center justify-center bg-gray-100">
      <div className="w-3/4 h-5/6 bg-white shadow-lg rounded-lg flex">
        {/* Sidebar */}
        <div className="w-1/3 border-r p-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <div className="flex gap-2 mt-2">
            <button className="bg-black text-white px-3 py-1 rounded">Tous</button>
            <button className="bg-gray-200 px-3 py-1 rounded">Non lus</button>
          </div>
          <div className="mt-4">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-2 p-2 cursor-pointer rounded-lg ${selectedUser.id === user.id ? "bg-gray-300" : ""}`}
                onClick={() => setSelectedUser(user)}
              >
                <img className="w-10 h-10 rounded-full" src={user.avatar} alt={user.name} />
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center gap-2">
            <img className="w-14 h-14 rounded-full object-cover" src={selectedUser.avatar} alt={selectedUser.name} />
            <div>
              <h3 className="font-bold">{selectedUser.name}</h3>
              <p className="text-sm text-gray-500">{selectedUser.role}</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages
              .filter((msg) =>
                (msg.senderId === currentUserId && msg.receiverId === selectedUser.id) ||
                (msg.senderId === selectedUser.id && msg.receiverId === currentUserId)
              )
              .map((msg) => (
                <div key={msg.id} className={`mb-4 ${msg.senderId === currentUserId ? "text-right" : "text-left"}`}>
                  <p className="text-xs text-gray-500">{msg.time}</p>
                  <div
                    className={`p-2 rounded-lg inline-block ${
                      msg.senderId === currentUserId ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t flex items-center">
            <input
              type="text"
              placeholder="Entrez un message ......."
              className="flex-1 p-2 border rounded-lg"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessage} className="ml-2 bg-gray-200 p-2 rounded-full">➤</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;