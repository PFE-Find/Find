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

      // Find the other user's ID (not the current user)
      const otherUserId = senderId === currentUserId ? receiverId : senderId;

      // Find the user in the list
      const userToUpdateIndex = prevUsers.findIndex(user => user._id === otherUserId);

      if (userToUpdateIndex === -1) {
        // User not found in the list, return the previous state
        return prevUsers;
      }

      // Create a new array with the updated user
      const updatedUsers = [...prevUsers];
      updatedUsers[userToUpdateIndex] = {
        ...updatedUsers[userToUpdateIndex],
        lastMessage: newMessage.text,
        lastMessageTime: newMessage.createdAt,
      };

      // Store the last conversation user in localStorage and ref
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
    ws.current.onerror = (error) => console.error('WebSocket error:', error);
    ws.current.onclose = () => console.log('WebSocket disconnected');

    if (ws.current) {
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'NEW_MESSAGE':
            // Update the message list
            setMessages(prevMessages => [...prevMessages, data.message]);

            // Update the user list
            updateUserList(data.message);
            
            // Update last conversation user in real-time
            const otherUserId = data.message.senderId === currentUserId 
              ? data.message.receiverId 
              : data.message.senderId;
            if (typeof window !== 'undefined') {
              localStorage.setItem('lastConversationUser', otherUserId);
              lastConversationUserRef.current = otherUserId;
            }
            break;
          // Handle other WebSocket message types
          default:
            break;
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
        
        // Try to select the last conversation user if it exists
        if (lastConversationUserRef.current) {
          const lastUser = data.find(user => user._id === lastConversationUserRef.current);
          if (lastUser) {
            await handleConversation(lastUser._id);
            return;
          }
        }
        
        // Otherwise select the first user if available
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

    setUsers(prevUsers => prevUsers.map(user => 
      user._id === userId ? { ...user, unreadCount: 0 } : user
    ));

    // Find and set the selected user from the users array
    const user = users.find(u => u._id === userId);
    if (user) {
      setSelectedUser(user);
    }
    
    // Store the last conversation user
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
      sm: 'w-10 h-10',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };

    return (
      <div className={`relative ${sizeClasses[size]}`}>
        {user.image ? (
          <img
            className="w-16 h-16 rounded-full object-cover border-2 border-teal-100"
            src={user.image.startsWith('/uploads') 
              ? `http://localhost:3001${user.image}`
              : user.image}
            alt="Profile"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';

              // Create fallback container
              const fallbackContainer = document.createElement('div');
              fallbackContainer.className = 'w-16 h-16 rounded-full border-2 border-teal-100 bg-gray-100 flex items-center justify-center';

              // Create user icon
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
          <div className="w-16 h-16 rounded-full border-2 border-teal-100 bg-gray-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
        {user.unreadCount ? (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow">
            {user.unreadCount}
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      <section className="relative bg-gradient-to-b from-teal-600 to-white pt-20 px-4 h-screen">
        <section className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl h-[calc(100vh-120px)] flex items-center justify-center py-16 overflow-hidden">
          <div className="w-full h-full max-w-7xl bg-white shadow-xl rounded-2xl flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-full md:w-1/3 border-r p-4 flex flex-col bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
                <div className="relative">
                  <button
                    className="flex items-center gap-1 px-3 py-1 bg-white rounded-full shadow-sm text-sm hover:bg-gray-100 transition-colors"
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
              <div className="relative mb-6">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border-0 bg-white rounded-full shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Users list */}
              <div className="flex-1 overflow-y-auto space-y-2" style={{ maxHeight: 'calc(100% - 120px)' }}>
                {isLoading && filteredUsers.length === 0 ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <FiMessageSquare className="mx-auto text-2xl mb-2" />
                    <p>No conversations found</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.div
                      key={user._id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all ${
                        selectedUser?._id === user._id
                          ? 'bg-teal-100 border border-teal-200'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                      onClick={() => handleConversation(user._id)}
                    >
                      <UserAvatar user={user} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="font-bold text-gray-800 truncate">
                            {user.name}
                          </p>
                          {user.lastMessageTime && (
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                              {formatRelativeTime(user.lastMessageTime)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {user.lastMessage || 'No messages'}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 hidden md:flex">
              {selectedUser ? (
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
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                  <FiMessageSquare className="text-5xl mb-4" />
                  <p className="text-lg">Select a conversation</p>
                  <p className="text-sm mt-2 text-gray-500">
                    or start a new discussion
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}