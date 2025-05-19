'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import messageService from '../../services/Message';
import { useSession } from 'next-auth/react';
import {
  FiSearch,
  FiMessageSquare,
  FiMoreVertical,
  FiUser,
  FiX,
  FiArrowLeft,
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Conversation from './conversation';

export interface User {
  _id: string;
  name: string;
  role: string;
  image?: string;
  lastMessage?: string;
  unreadCount?: number;
  lastMessageTime?: string;
  online?: boolean;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
  isEdited?: boolean;
}

export default function ChatPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();
  const currentUserId = session?.user?.user?._id || session?.user?._id || null;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const lastConversationUserRef = useRef<string | null>(null);

  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: fr,
    });
  };

  // Get the last user from localStorage on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lastUser = localStorage.getItem('lastConversationUser');
      if (lastUser) {
        lastConversationUserRef.current = lastUser;
      }
    }
  }, []);

  const updateUserList = useCallback((newMessage: Message) => {
    setUsers(prevUsers => {
      const senderId = newMessage.senderId;
      const receiverId = newMessage.receiverId;
      const otherUserId = senderId === currentUserId ? receiverId : senderId;

      const userToUpdateIndex = prevUsers.findIndex(user => user._id === otherUserId);
      if (userToUpdateIndex === -1) return prevUsers;

      const updatedUsers = [...prevUsers];
      updatedUsers[userToUpdateIndex] = {
        ...updatedUsers[userToUpdateIndex],
        lastMessage: newMessage.text,
        lastMessageTime: newMessage.createdAt,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('lastConversationUser', otherUserId);
        lastConversationUserRef.current = otherUserId;
      }

      return updatedUsers;
    });
  }, [currentUserId, setUsers]);

  // WebSocket setup
  useEffect(() => {
    if (!currentUserId) return;

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    ws.current = new WebSocket(`${socketUrl}?userId=${currentUserId}`);

    ws.current.onopen = () => console.log('WebSocket connected');
    
    ws.current.onclose = () => console.log('WebSocket disconnected');

    if (ws.current) {
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'NEW_MESSAGE') {
          setMessages(prev => [...prev, data.message]);
          updateUserList(data.message);
          const otherUserId = data.message.senderId === currentUserId 
            ? data.message.receiverId 
            : data.message.senderId;
          if (typeof window !== 'undefined') {
            localStorage.setItem('lastConversationUser', otherUserId);
            lastConversationUserRef.current = otherUserId;
          }
        }
      };
    }

    return () => {
      ws.current?.close();
      ws.current = null;
    };
  }, [currentUserId, updateUserList]);

  // Data fetching
  useEffect(() => {
    const fetchUsersConversations = async () => {
      if (!currentUserId) return;
      setIsLoading(true);
      
      try {
        const data = await messageService.getUsersConversations(currentUserId);
        setUsers(data);
        
        if (lastConversationUserRef.current) {
          const lastUser = data.find(user => user._id === lastConversationUserRef.current);
          if (lastUser) {
            await handleConversation(lastUser._id);
            return;
          }
        }
        
        if (data.length > 0) {
          await handleConversation(data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersConversations();
  }, [currentUserId]);

  const handleConversation = async (userId: string) => {
    if (!currentUserId) return;

    setIsLoading(true);
    try {
      const conversation = await messageService.getConversation(currentUserId, userId);
      setMessages(conversation);
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, unreadCount: 0 } : user
      ));
      
      const user = users.find(u => u._id === userId);
      if (user) {
        setSelectedUser(user);
        setShowConversation(true);
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastConversationUser', userId);
        lastConversationUserRef.current = userId;
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const UserAvatar = ({ user, size = 'md' }: { user: User, size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12'
    };

    return (
      <div className={`relative ${sizeClasses[size]}`}>
        {user.image ? (
          <img
            className={`${sizeClasses[size]} rounded-full object-cover border-2 border-teal-100`}
            src={user.image.startsWith('/uploads') 
              ? `http://localhost:3001${user.image}`
              : user.image}
            alt="Profile"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
              const fallbackContainer = document.createElement('div');
              fallbackContainer.className = `${sizeClasses[size]} rounded-full border-2 border-teal-100 bg-gray-100 flex items-center justify-center`;
              const userIcon = document.createElement('div');
              userIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              `;
              fallbackContainer.appendChild(userIcon);
              img.parentNode?.insertBefore(fallbackContainer, img);
            }}
          />
        ) : (
          <div className={`${sizeClasses[size]} rounded-full border-2 border-teal-100 bg-gray-100 flex items-center justify-center`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        )}
        {user.online && (
          <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
        {user.unreadCount ? (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center shadow">
            {user.unreadCount}
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      <section className="relative bg-gradient-to-b from-teal-600 to-white pt-16 sm:pt-20 px-0 sm:px-4 h-screen">
        <section className="bg-white bg-opacity-80 backdrop-blur-sm rounded-none sm:rounded-2xl h-[calc(100vh-64px)] sm:h-[calc(100vh-120px)] flex items-center justify-center py-0 sm:py-16 overflow-hidden">
          <div className="w-full h-full bg-white shadow-none sm:shadow-xl rounded-none sm:rounded-2xl flex overflow-hidden">
            {/* Sidebar - Hidden on mobile when conversation is open */}
            <AnimatePresence>
              {(!showConversation || window.innerWidth >= 768) && (
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`w-full md:w-1/3 border-r p-2 sm:p-4 flex flex-col bg-gray-50 ${showConversation ? 'hidden md:flex' : 'flex'}`}
                >
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Messages</h2>
                    <div className="relative">
                      <button
                        className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-white rounded-full shadow-sm text-sm hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                      >
                        <FiMoreVertical className="text-gray-500" />
                      </button>
                      <AnimatePresence>
                        {isMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100"
                          >
                            <div className="py-1">
                              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                <FiUser className="mr-2" /> New conversation
                              </button>
                              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                <FiMessageSquare className="mr-2" /> Settings
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Search bar */}
                  <div className="relative mb-4 sm:mb-6">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-9 pr-4 py-2 border-0 bg-white rounded-full shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all text-sm sm:text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Users list */}
                  <div className="flex-1 overflow-y-auto space-y-1 sm:space-y-2" style={{ maxHeight: 'calc(100% - 100px)' }}>
                    {isLoading && filteredUsers.length === 0 ? (
                      <div className="flex justify-center items-center h-20">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-teal-500"></div>
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <FiMessageSquare className="mx-auto text-xl sm:text-2xl mb-2" />
                        <p className="text-sm sm:text-base">No conversations</p>
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <motion.div
                          key={user._id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 cursor-pointer rounded-lg sm:rounded-xl transition-all ${
                            selectedUser?._id === user._id
                              ? 'bg-teal-100 border border-teal-200'
                              : 'bg-white hover:bg-gray-100'
                          }`}
                          onClick={() => handleConversation(user._id)}
                        >
                          <UserAvatar user={user} size="md" />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <p className="font-medium sm:font-bold text-sm sm:text-base text-gray-800 truncate">
                                {user.name}
                              </p>
                              {user.lastMessageTime && (
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-1 sm:ml-2">
                                  {formatRelativeTime(user.lastMessageTime)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                              {user.lastMessage || 'No messages'}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat area - Full screen on mobile when conversation is selected */}
            <AnimatePresence>
              {(showConversation || window.innerWidth >= 768) && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`flex-1 ${!showConversation ? 'hidden md:flex' : 'flex'}`}
                >
                  {selectedUser ? (
                    <div className="flex flex-col h-full w-full">
                      {/* Mobile header with back button */}
                      <div className="md:hidden flex items-center p-3 border-b bg-white">
                        <button 
                          onClick={() => setShowConversation(false)}
                          className="mr-2 p-1 rounded-full hover:bg-gray-100"
                        >
                          <FiArrowLeft className="text-lg" />
                        </button>
                        <div className="flex items-center">
                          <UserAvatar user={selectedUser} size="sm" />
                          <div className="ml-2">
                            <p className="font-medium text-gray-800">{selectedUser.name}</p>
                            <p className="text-xs text-gray-500">
                              {selectedUser.online ? 'Online' : 'Offline'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Conversation
                        selectedUser={selectedUser}
                        messages={messages}
                        isLoading={isLoading}
                        currentUserId={currentUserId}
                        ws={ws.current}
                        setMessages={setMessages}
                        setUsers={setUsers}
                        users={users}
                        updateUserList={updateUserList}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                      <FiMessageSquare className="text-3xl sm:text-5xl mb-3 sm:mb-4" />
                      <p className="text-base sm:text-lg">Select a conversation</p>
                      <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-gray-500">
                        or start a new discussion
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </section>
    </div>
  );
}