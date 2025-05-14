'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiBell, FiTrash2, FiClock } from 'react-icons/fi';
import Navbar from "../components/Nav";
import Footer from "../components/Footer";
import NotifService from "../services/Notification"
import { useSession } from 'next-auth/react';
import UserService from "@/app/services/User";

interface Notification {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
  user?: {
    name: string;
    image: string;
  };
}

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

export default function Notification() {
  const [users, setUsers] = useState<User[]>([]);
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.user?._id || session?.user?._id;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null);
  const notificationsEndRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  // WebSocket setup
  useEffect(() => {
    if (!currentUserId) return;

    ws.current = new WebSocket(`ws://localhost:3001?userId=${currentUserId}`);

    const handleWebSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'NEW_NOTIFICATION':
          handleNewNotification(data.notification);
          break;
        case 'NOTIFICATION_READ':
          handleNotificationRead(data.notificationId);
          break;
        case 'ALL_NOTIFICATIONS_READ':
          handleNotificationDeleted(data.notificationId);
          break;
          case 'NOTIFICATION_DELETED':
          handleNotificationDeleted(data.notificationId);
          break;
        default:
          console.log('Type de message inconnu:', data.type);
      }
    };

    if (ws.current) {
      ws.current.onmessage = handleWebSocketMessage;

      return () => {
        if (ws.current) {
          ws.current.onmessage = null;
          ws.current.close();
        }
      };
    }
  }, [currentUserId]);

  useEffect(() => {
    const fetchNotifications = async () => {
  if (!currentUserId) return;

  try {
    setLoading(true);
    const mockNotifications = await NotifService.getNotifications(currentUserId);
    const notifsWithUsers = await Promise.all(
      mockNotifications
        .sort((a: Notification, b: Notification) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map(async (notif: Notification) => {
          try {
            const user = await UserService.getUserById(notif.senderId);
            return {
              ...notif,
              user: {
                name: user.name,
                image: user.image?.startsWith('/uploads')
                  ? `http://localhost:3001${user.image}`
                  : user.image || '/default-profile.png'
              }
            };
          } catch (error) {
            console.error(`Erreur lors de la récupération de l'utilisateur ${notif.senderId}:`, error);
            return {
              ...notif,
              user: {
                name: `Utilisateur ${notif.senderId.slice(0, 4)}`,
                image: '/default-profile.png'
              }
            };
          }
        })
    );
    setNotifications(notifsWithUsers);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
  } finally {
    setLoading(false);
  }
};

    fetchNotifications();
  }, [currentUserId]);

  const handleNewNotification = useCallback(async (notification: Notification) => {
    try {
      if (notifications.some(n => n._id === notification._id)) {
        return;
      }

      const user = await UserService.getUserById(notification.senderId);
      
      const newNotificationWithUser = {
        ...notification,
        user: {
          name: user?.name || `Utilisateur ${notification.senderId.slice(0, 4)}`,
          image: user?.image?.startsWith('/uploads')
            ? `http://localhost:3001${user.image}`
            : user?.image || '/default-profile.png'
        }
      };

      setNotifications(prev => [newNotificationWithUser, ...prev]);

      if (typeof window !== 'undefined' && window.Notification?.permission === 'granted') {
        new window.Notification(newNotificationWithUser.user.name, {
          body: newNotificationWithUser.text,
          icon: newNotificationWithUser.user.image
        });
      }
    } catch (error) {
      console.error("Erreur lors du traitement de la nouvelle notification:", error);
      const fallbackNotification = {
        ...notification,
        user: {
          name: `Utilisateur ${notification.senderId.slice(0, 4)}`,
          image: '/default-profile.png'
        }
      };
      setNotifications(prev => [fallbackNotification, ...prev]);
    }
  }, [notifications]);

  const handleNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notif =>
      notif._id === notificationId ? { ...notif, isRead: true } : notif
    ));
  }, []);

  const handleNotificationDeleted = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
  }, []);

  const markAsRead = (id: string) => {
    if (!ws.current) return;

    setNotifications(prev => prev.map(notif =>
      notif._id === id ? { ...notif, isRead: true } : notif
    ));

    ws.current.send(JSON.stringify({
      type: 'MARK_NOTIFICATION_READ',
      notificationId: id
    }));
  };

  const markAllAsRead = () => {
    if (!ws.current) return;

    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));

    ws.current.send(JSON.stringify({
      type: 'MARK_ALL_NOTIFICATIONS_READ'
    }));
  };

  const deleteNotification = (id: string) => {
    if (!ws.current) return;

    ws.current.send(JSON.stringify({
      type: 'DELETE_NOTIFICATION',
      notificationId: id
    }));

    setShowDeleteConfirmation(null);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} heures`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FiBell className="text-blue-600 dark:text-blue-300 text-xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
            </div>
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <FiBell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Aucune notification</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Vous êtes à jour !</p>
              </div>
            ) : (
              <AnimatePresence>
                {notifications.map(notification => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className={`transition-all duration-200 transform hover:shadow-md w-full p-4 rounded-xl ${notification.isRead
                        ? 'bg-white dark:bg-gray-700'
                        : 'bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-500'
                      }`}
                  >
                    <div className="flex items-start">
                      {notification.user?.image ? (
                        <img
                          className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-white dark:border-gray-600"
                          src={notification.user.image}
                          alt={notification.user.name}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full mr-4 bg-blue-500 flex items-center justify-center text-white font-medium border-2 border-white dark:border-gray-600">
                          {notification.user?.name?.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className={`text-md font-semibold ${notification.isRead
                              ? 'text-gray-700 dark:text-gray-300'
                              : 'text-gray-900 dark:text-white'
                            }`}>
                            {notification.user?.name}
                          </p>
                          <div className="flex space-x-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <FiClock className="mr-1" size={12} />
                              {formatTime(notification.createdAt)}
                            </span>
                            <button
                              onClick={() => setShowDeleteConfirmation(notification._id)}
                              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                              aria-label="Supprimer la notification"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className={`mt-2 text-sm ${notification.isRead
                            ? 'text-gray-600 dark:text-gray-400'
                            : 'text-gray-800 dark:text-gray-200'
                          }`}>
                          {notification.text}
                        </p>
                        <div className="mt-3 flex space-x-3">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-md text-blue-700 dark:text-blue-200 transition-colors"
                            >
                              Marquer comme lu
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={notificationsEndRef} />
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <AnimatePresence>
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full overflow-hidden shadow-xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Confirmation de suppression
                  </h3>
                  <button
                    onClick={() => setShowDeleteConfirmation(null)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    aria-label="Fermer"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Êtes-vous sûr de vouloir supprimer cette notification ?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirmation(null)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => deleteNotification(showDeleteConfirmation)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}