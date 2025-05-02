'use client';

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  KeyboardEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import messageService from '../../services/Message';
import { useSession } from 'next-auth/react';
import {
  FiSend,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiMessageSquare,
  FiMoreVertical,
  FiPaperclip,
  FiSmile,
  FiCheck,
  FiCheckCircle,
  FiX,
  FiUser,
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Conversation from './conversation'; // Adjust the import path as needed

// --- Types ---
export interface User {
  _id: string;
  name: string;
  role: string;
  image: string;
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

// --- MessageMenu Component ---
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
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
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
                <FiEdit2 className="mr-2" /> Modifier
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <FiTrash2 className="mr-2" /> Supprimer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Parent Component ---
export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id as string | undefined;

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageText, setEditMessageText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ws = useRef<WebSocket | null>(null);

  // Scroll to bottom of messages
  // const scrollToBottom = useCallback(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, []);

  // --- WebSocket Setup ---
  useEffect(() => {
    if (!currentUserId) return;
    const socketUrl = 'ws://localhost:3001';
    ws.current = new WebSocket(`${socketUrl}?userId=${currentUserId}`);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current?.close();
      ws.current = null;
    };
  }, [currentUserId]);

  // --- WebSocket Message Handling ---
  const handleWebSocketMessage = useCallback(
    (data: any) => {
      switch (data.type) {
        case 'NEW_MESSAGE':
          handleNewMessage(data.message);
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
    },
    [selectedUser, currentUserId, messages]
  );

  // --- Send Message ---
  const handleSendMessage = async () => {
    if (
      newMessage.trim() === '' ||
      !selectedUser ||
      !currentUserId ||
      !ws.current
    )
      return;

    const newMsg = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      text: newMessage,
    };

    setNewMessage('');

    try {
      ws.current.send(
        JSON.stringify({
          type: 'NEW_MESSAGE',
          message: newMsg,
        })
      );

      // Update last message in users list
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id
            ? {
                ...user,
                lastMessage: newMessage,
                lastMessageTime: new Date().toISOString(),
              }
            : user
        )
      );

      inputRef.current?.focus();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  // --- New Message Handler ---
  const handleNewMessage = useCallback(
    (message: Message) => {
      setMessages((prev) => [...prev, message]);

      setUsers((prevUsers) => {
        const isCurrentConversation =
          selectedUser?._id === message.senderId ||
          selectedUser?._id === message.receiverId;

        return prevUsers.map((user) => {
          if (
            user._id === message.senderId ||
            user._id === message.receiverId
          ) {
            const isReceiver = user._id === message.receiverId;
            return {
              ...user,
              lastMessage: message.text,
              lastMessageTime: message.createdAt,
              unreadCount:
                isReceiver && !isCurrentConversation
                  ? (user.unreadCount || 0) + 1
                  : user.unreadCount || 0,
            };
          }
          return user;
        });
      });

      // Mark as read if current conversation
      if (
        (message.senderId === selectedUser?._id ||
          message.receiverId === selectedUser?._id) &&
        message.receiverId === currentUserId
      ) {
        markMessageAsRead(message._id);
      }
    },
    [selectedUser, currentUserId]
  );

  // --- Message Read Handler ---
  const handleMessageRead = useCallback(
    (senderId: string, receiverId: string) => {
      if (receiverId !== currentUserId) return;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === senderId &&
          msg.receiverId === receiverId &&
          !msg.isRead
            ? { ...msg, isRead: true }
            : msg
        )
      );
    },
    [currentUserId]
  );

  // --- Message Updated Handler ---
  const handleMessageUpdated = useCallback((message: Message) => {
    setMessages((prev) =>
      prev.map((msg) => (msg._id === message._id ? message : msg))
    );

    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (
          (user._id === message.senderId ||
            user._id === message.receiverId) &&
          user.lastMessageTime === message.createdAt
        ) {
          return {
            ...user,
            lastMessage: message.text,
          };
        }
        return user;
      })
    );
  }, []);

  // --- Message Deleted Handler ---
  const handleMessageDeleted = useCallback(
    (messageId: string) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));

      if (
        messages.length > 0 &&
        messages[messages.length - 1]?._id === messageId
      ) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => {
            const lastMsg = messages
              .filter(
                (m) =>
                  (m.senderId === user._id || m.receiverId === user._id) &&
                  m._id !== messageId
              )
              .pop();

            if (lastMsg) {
              return {
                ...user,
                lastMessage: lastMsg.text,
                lastMessageTime: lastMsg.createdAt,
              };
            }
            return user;
          })
        );
      }
    },
    [messages]
  );

  // --- User Status Handler ---
  const handleUserStatus = useCallback(
    (userId: string, isOnline: boolean) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, online: isOnline } : user
        )
      );

      if (selectedUser?._id === userId) {
        setSelectedUser((prev) =>
          prev ? { ...prev, online: isOnline } : null
        );
      }
    },
    [selectedUser]
  );

  // --- Mark Message as Read ---
  const markMessageAsRead = async (messageId: string) => {
    if (!ws.current || !selectedUser || !currentUserId) return;

    try {
      await messageService.markAsRead(currentUserId, selectedUser._id);

      ws.current.send(
        JSON.stringify({
          type: 'MESSAGE_READ',
          senderId: selectedUser._id,
          receiverId: currentUserId,
        })
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === selectedUser._id &&
          msg.receiverId === currentUserId &&
          !msg.isRead
            ? { ...msg, isRead: true }
            : msg
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // --- Fetch Users' Conversations ---
  useEffect(() => {
    async function fetchUsersConversations() {
      if (!currentUserId) return;

      setIsLoading(true);
      try {
        const data = await messageService.getUsersConversations(currentUserId);
        setUsers(data);
        if (data.length > 0) {
          handleConversation(data[0]._id);
        }
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des conversations:',
          error
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsersConversations();
  }, [currentUserId]);

  // --- Conversation Selection Handler ---
  const handleConversation = async (userId: string) => {
    if (!currentUserId) return;

    setIsLoading(true);
    try {
      const conversation = await messageService.getConversation(
        currentUserId,
        userId
      );
      setMessages(conversation);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, unreadCount: 0 } : user
        )
      );

      const user = users.find((u) => u._id === userId);
      setSelectedUser(user || null);

      await markMessageAsRead(userId);
    } catch (error) {
      console.error('Erreur lors de la récupération de la conversation:', error);
    } finally {
      setIsLoading(false);
      // setTimeout(scrollToBottom, 100);
    }
  };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages, scrollToBottom]);

  // --- Delete Message Handler ---
  const handleDeleteMessage = async (messageId: string) => {
    if (!currentUserId || !selectedUser || !ws.current) return;

    try {
      ws.current.send(
        JSON.stringify({
          type: 'DELETE_MESSAGE',
          messageId,
        })
      );

      await messageService.deleteMessage(messageId);

      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));

      if (
        messages.length > 0 &&
        messages[messages.length - 1]?._id === messageId
      ) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id
              ? {
                  ...user,
                  lastMessage:
                    messages.length > 1
                      ? messages[messages.length - 2].text
                      : 'Aucun message',
                  lastMessageTime:
                    messages.length > 1
                      ? messages[messages.length - 2].createdAt
                      : undefined,
                }
              : user
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
    } finally {
      setMessageToDelete(null);
    }
  };

  // --- Message Editing Handlers ---
  const startEditing = (message: Message) => {
    setEditingMessageId(message._id);
    setEditMessageText(message.text);
    inputRef.current?.focus();
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditMessageText('');
  };

  const saveEditedMessage = async () => {
    if (!editingMessageId || !editMessageText.trim() || !ws.current) return;

    try {
      ws.current.send(
        JSON.stringify({
          type: 'UPDATE_MESSAGE',
          messageId: editingMessageId,
          text: editMessageText,
        })
      );

      await messageService.updateMessage(editingMessageId, editMessageText);

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === editingMessageId
            ? { ...msg, text: editMessageText, isEdited: true }
            : msg
        )
      );

      if (
        messages.length > 0 &&
        messages[messages.length - 1]._id === editingMessageId
      ) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser?._id
              ? {
                  ...user,
                  lastMessage: editMessageText,
                  lastMessageTime: new Date().toISOString(),
                }
              : user
          )
        );
      }

      cancelEditing();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du message:', error);
    }
  };

  // --- Users Filter ---
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: fr,
    });
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
                            <FiUser className="mr-2" /> Nouvelle conversation
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            <FiMessageSquare className="mr-2" /> Paramètres
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
                  placeholder="Rechercher une conversation..."
                  className="w-full pl-10 pr-4 py-2 border-0 bg-white rounded-full shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Users list */}
              <div
                className="flex-1 overflow-y-auto space-y-2"
                style={{ maxHeight: 'calc(100% - 120px)' }}
              >
                {isLoading && filteredUsers.length === 0 ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <FiMessageSquare className="mx-auto text-2xl mb-2" />
                    <p>Aucune conversation trouvée</p>
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
                      <div className="relative">
                        <img
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                          src={user.image || 'https://via.placeholder.com/150'}
                          alt={user.name}
                        />
                        {user.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                        {user.unreadCount ? (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow">
                            {user.unreadCount}
                          </span>
                        ) : null}
                      </div>
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
                          {user.lastMessage || 'Aucun message'}
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
                  currentUserId={currentUserId!}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  handleSendMessage={handleSendMessage}
                  editingMessageId={editingMessageId}
                  editMessageText={editMessageText}
                  setEditMessageText={setEditMessageText}
                  startEditing={startEditing}
                  cancelEditing={cancelEditing}
                  saveEditedMessage={saveEditedMessage}
                  messagesEndRef={messagesEndRef}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                  <FiMessageSquare className="text-5xl mb-4" />
                  <p className="text-lg">Sélectionnez une conversation</p>
                  <p className="text-sm mt-2 text-gray-500">
                    ou commencez une nouvelle discussion
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </section>

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
                    Supprimer le message
                  </h3>
                  <button
                    onClick={() => setMessageToDelete(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setMessageToDelete(null)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteMessage(messageToDelete._id)
                    }
                    className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}