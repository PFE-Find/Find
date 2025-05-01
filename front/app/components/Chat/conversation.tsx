import React, { KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPaperclip,
  FiSmile,
  FiSend,
  FiSearch,
  FiMoreVertical,
  FiCheck,
  FiCheckCircle,
  FiMessageSquare,
} from 'react-icons/fi';
import { Message, User } from './Page'; // adjust the import path if needed

interface ConversationProps {
  selectedUser: User;
  messages: Message[];
  isLoading: boolean;
  currentUserId: string;
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: () => void;
  editingMessageId: string | null;
  editMessageText: string;
  setEditMessageText: (value: string) => void;
  startEditing: (message: Message) => void;
  cancelEditing: () => void;
  saveEditedMessage: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Conversation: React.FC<ConversationProps> = ({
  selectedUser,
  messages,
  isLoading,
  currentUserId,
  newMessage,
  setNewMessage,
  handleSendMessage,
  editingMessageId,
  editMessageText,
  setEditMessageText,
  startEditing,
  cancelEditing,
  saveEditedMessage,
  messagesEndRef,
}) => {
  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <div className="flex-1 flex flex-col" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center gap-3 bg-white">
        <div className="relative">
          <img
            className="w-10 h-10 rounded-full object-cover border-2 border-teal-100 shadow"
            src={selectedUser.image || 'https://via.placeholder.com/150'}
            alt={selectedUser.name}
          />
          {selectedUser.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{selectedUser.name}</h3>
          <p className="text-sm text-gray-500">
            {selectedUser.online ? 'En ligne' : selectedUser.role}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-colors">
            <FiSearch />
          </button>
          <button className="p-2 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-colors">
            <FiMoreVertical />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ maxHeight: 'calc(100% - 120px)' }}>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-400">
            <FiMessageSquare className="text-4xl mb-2" />
            <p>Commencez une nouvelle conversation</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={messageVariants}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    msg.senderId === currentUserId
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  {editingMessageId === msg._id ? (
                    <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-3 border border-teal-200">
                      <textarea
                        value={editMessageText}
                        onChange={(e) => setEditMessageText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                        rows={3}
                        autoFocus
                        onKeyDown={(e: KeyboardEvent) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            saveEditedMessage();
                          }
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={saveEditedMessage}
                          className="px-3 py-1 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative group ${
                        msg.senderId === currentUserId
                          ? 'bg-teal-500 text-white'
                          : 'bg-white shadow'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.text}</p>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center">
                          <p
                            className={`text-xs ${
                              msg.senderId === currentUserId
                                ? 'text-teal-100'
                                : 'text-gray-400'
                            }`}
                          >
                            {formatTime(msg.createdAt)}
                          </p>
                          {msg.isEdited && (
                            <span className="text-xs text-gray-400 ml-1">
                              (modifié)
                            </span>
                          )}
                        </div>
                        {msg.senderId === currentUserId && (
                          <div className="flex items-center">
                            {msg.isRead ? (
                              <FiCheckCircle
                                className="text-teal-200 ml-1"
                                size={14}
                              />
                            ) : (
                              <FiCheck
                                className="text-teal-200 ml-1"
                                size={14}
                              />
                            )}
                          </div>
                        )}
                      </div>
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-colors">
            <FiPaperclip />
          </button>
          <button className="p-2 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-colors">
            <FiSmile />
          </button>
          <input
            type="text"
            placeholder="Écrivez un message..."
            className="flex-1 p-3 border-0 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
          />
          <button
            onClick={handleSendMessage}
            className="p-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center justify-center"
            disabled={!newMessage.trim() || isLoading}
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;