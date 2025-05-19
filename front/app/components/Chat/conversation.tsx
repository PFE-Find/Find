import React, { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
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
  FiEdit2,
  FiTrash2,
  FiX,
  FiArrowLeft,
} from 'react-icons/fi';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import messageService from '../../services/Message';
import { Message, User } from './Chat';

interface ConversationProps {
  selectedUser: User;
  messages: Message[];
  isLoading: boolean;
  currentUserId: string;
  ws: WebSocket;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  users: User[];
  onBack?: () => void;
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
  ws,
  setMessages,
  setUsers,
  users,
  onBack,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageText, setEditMessageText] = useState('');
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showEmojiPickerForEdit, setShowEmojiPickerForEdit] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiPickerEditRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 },
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (emojiPickerEditRef.current && !emojiPickerEditRef.current.contains(event.target as Node)) {
        setShowEmojiPickerForEdit(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
   
   
    
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when conversation changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedUser]);

  // WebSocket message handler
  useEffect(() => {
    if (!ws) return;

    const handleWebSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      switch (data.type) {

        case 'NEW_MESSAGE':
          // Always use the current selectedUser from state, not from closure
          const currentSelectedUser = selectedUser;
         
          

          if (data.message.senderId ==  currentSelectedUser._id || data.message.receiverId ==  currentSelectedUser._id) {
            handleNewMessage(data.message);
          }
          break;

        case 'MESSAGE_READ':
          handleMessageRead(data.senderId, data.receiverId);
          break;
        case 'MESSAGE_UPDATED':
          handleMessageUpdated(data.message);
          break;
        case 'MESSAGE_DELETED':
          handleMessageDeleted(data.messageId);
          break;
        case 'USER_STATUS':
          handleUserStatus(data.userId, data.isOnline);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    };

    ws.onmessage = handleWebSocketMessage;

    return () => {
      ws.onmessage = null;
    };
  }, [ws,selectedUser]);





  const handleNewMessage = useCallback((message: Message) => {


    setMessages(prev => [...prev, message]);


    setUsers(prevUsers => prevUsers.map(user => {
      if (user._id === message.senderId || user._id === message.receiverId) {
        const isCurrentConversation = selectedUser._id === message.senderId ||
          selectedUser._id === message.receiverId;
        const isReceiver = user._id === message.receiverId;

        return {
          ...user,
          lastMessage: message.text,
          lastMessageTime: message.createdAt,
          unreadCount: isReceiver && !isCurrentConversation
            ? (user.unreadCount || 0) + 1
            : user.unreadCount || 0,
        };
      }
      return user;
    }));
  }, [selectedUser, currentUserId, setMessages, setUsers]);

  const handleMessageRead = useCallback((senderId: string, receiverId: string) => {
    if (receiverId !== currentUserId) return;
  }, [currentUserId, setMessages]);

  const handleMessageUpdated = useCallback((message: Message) => {
    setMessages(prev => prev.map(msg => msg._id === message._id ? message : msg));

    setUsers(prevUsers => prevUsers.map(user => {
      if ((user._id === message.senderId || user._id === message.receiverId) &&
        user.lastMessageTime === message.createdAt) {
        return { ...user, lastMessage: message.text };
      }
      return user;
    }));
  }, [setMessages, setUsers]);

  const handleMessageDeleted = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg._id !== messageId));

    if (messages.length > 0 && messages[messages.length - 1]?._id === messageId) {
      setUsers(prevUsers => prevUsers.map(user => {
        const lastMsg = messages
          .filter(m => (m.senderId === user._id || m.receiverId === user._id) && m._id !== messageId)
          .pop();

        return lastMsg
          ? { ...user, lastMessage: lastMsg.text, lastMessageTime: lastMsg.createdAt }
          : user;
      }));
    }
  }, [messages, setMessages, setUsers]);

  const handleUserStatus = useCallback((userId: string, isOnline: boolean) => {
    setUsers(prevUsers => prevUsers.map(user =>
      user._id === userId ? { ...user, online: isOnline } : user
    ));
  }, [setUsers]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !currentUserId || !ws) return;

    const newMsg = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      text: newMessage,
    };
    const newNotification = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      text: newMessage,
    };

    setNewMessage('');
    setShowEmojiPicker(false);

    try {
      ws.send(JSON.stringify({
        type: 'NEW_NOTIFICATION',
        notification: newNotification,
      }));
      ws.send(JSON.stringify({
        type: 'NEW_MESSAGE',
        message: newMsg,
      }));


      setUsers(prevUsers => prevUsers.map(user =>
        user._id === selectedUser._id
          ? {
            ...user,
            lastMessage: newMessage,
            lastMessageTime: new Date().toISOString(),
          }
          : user
      ));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!currentUserId || !selectedUser || !ws) return;

    try {
      ws.send(JSON.stringify({
        type: 'DELETE_MESSAGE',
        messageId,
      }));


      setMessages(prev => prev.filter(msg => msg._id !== messageId));

      if (messages.length > 0 && messages[messages.length - 1]?._id === messageId) {
        setUsers(prevUsers => prevUsers.map(user =>
          user._id === selectedUser._id
            ? {
              ...user,
              lastMessage: messages.length > 1 ? messages[messages.length - 2].text : 'No message',
              lastMessageTime: messages.length > 1 ? messages[messages.length - 2].createdAt : undefined,
            }
            : user
        ));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setMessageToDelete(null);
    }
  };
  // Update last conversation user in real-time


  const startEditing = (message: Message) => {
    setEditingMessageId(message._id);
    setEditMessageText(message.text);
    setShowEmojiPickerForEdit(false);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditMessageText('');
  };

  const saveEditedMessage = async () => {
    if (!editingMessageId || !editMessageText.trim() || !ws) return;

    try {
      ws.send(JSON.stringify({
        type: 'UPDATE_MESSAGE',
        messageId: editingMessageId,
        text: editMessageText,
      }));

      await messageService.updateMessage(editingMessageId, editMessageText);
      setMessages(prev => prev.map(msg =>
        msg._id === editingMessageId
          ? { ...msg, text: editMessageText, isEdited: true }
          : msg
      ));

      if (messages.length > 0 && messages[messages.length - 1]._id === editingMessageId) {
        setUsers(prevUsers => prevUsers.map(user =>
          user._id === selectedUser._id
            ? {
              ...user,
              lastMessage: editMessageText,
              lastMessageTime: new Date().toISOString(),
            }
            : user
        ));
      }

      cancelEditing();
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onEmojiClickForEdit = (emojiData: EmojiClickData) => {
    setEditMessageText(prev => prev + emojiData.emoji);
  };

  const MessageMenu = ({
    message,
    onEdit,
    onDelete,
  }: {
    message: Message;
    onEdit: () => void;
    onDelete: () => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Message options"
        >
          <FiMoreVertical size={16} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100"
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiEdit2 className="mr-2" /> Edit
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiTrash2 className="mr-2" /> Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-gray-200 bg-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-2 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="relative">
            <img
              className="w-10 h-10 rounded-full object-cover border-2 border-teal-100"
              src={selectedUser.image?.startsWith('/uploads')
                ? `http://localhost:3001${selectedUser.image}`
                : selectedUser.image || '/default-profile.png'}
              alt={selectedUser.name}
            />
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${selectedUser.online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{selectedUser.name}</h2>
            <p className="text-xs text-gray-500">
              {selectedUser.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-colors">
            <FiSearch className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-colors">
            <FiMoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-400">
            <FiMessageSquare className="text-4xl mb-2" />
            <p>Start a new conversation</p>
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
                  className={`flex ${msg.senderId === currentUserId
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
                      <div className="flex justify-between items-center mt-2">
                        <div className="relative">
                          <button
                            onClick={() => setShowEmojiPickerForEdit(!showEmojiPickerForEdit)}
                            className="p-1 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <FiSmile />
                          </button>
                          {showEmojiPickerForEdit && (
                            <div ref={emojiPickerEditRef} className="absolute bottom-10 left-0 z-50">
                              <EmojiPicker onEmojiClick={onEmojiClickForEdit} width={300} height={350} />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={cancelEditing}
                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveEditedMessage}
                            className="px-3 py-1 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative group ${msg.senderId === currentUserId
                          ? 'bg-teal-500 text-white'
                          : 'bg-white shadow'
                        }`}
                    >
                      <p className="text-sm break-words">{msg.text}</p>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center">
                          <p
                            className={`text-xs ${msg.senderId === currentUserId
                                ? 'text-teal-100'
                                : 'text-gray-400'
                              }`}
                          >
                            {formatTime(msg.createdAt)}
                          </p>
                          {msg.isEdited && (
                            <span className="text-xs text-gray-400 ml-1">
                              (edited)
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
                            <MessageMenu
                              message={msg}
                              onEdit={() => startEditing(msg)}
                              onDelete={() => setMessageToDelete(msg)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white relative">
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-16 left-4 z-50">
            <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={350} />
          </div>
        )}
        <div className="flex items-center gap-2">

          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiSmile />
            </button>
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
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

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {messageToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Delete message
                  </h3>
                  <button
                    onClick={() => setMessageToDelete(null)}
                    className="text-gray-400 hover:text-gray-500"
                    aria-label="Close"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this message? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setMessageToDelete(null)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(messageToDelete._id)}
                    className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Conversation;