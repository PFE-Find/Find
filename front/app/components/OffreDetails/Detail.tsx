'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from "react";
import { Report } from "@/app/models/Report";
import reportService from "@/app/services/Report";
import { Comment } from "@/app/models/Comment";
import CommentService from "@/app/services/Comment";
import UserService from "@/app/services/User";
import { format } from 'date-fns';
import {
  FiFlag, FiMessageSquare, FiStar, FiCheckCircle,
  FiCalendar, FiMapPin, FiDollarSign, FiChevronRight,
  FiX
} from 'react-icons/fi';
import { FaLeaf, FaShieldAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import Map from "./Maps";
import Conversation from "../Chat/conversation";
import messageService from "@/app/services/Message";

interface Offre {
  offre: {
    id: string;
    titre: string;
    description: string;
    prix: string;
    Superficie: string;
    unit: string;
    id_user: string;
    placeName: string;
    localisation: [number, number];
    equipements: string[];
    etat: string;
    photos: string[];
    propertyType: string;
    propertyId: number | null;
    createdAt: string;
  };
}

interface User {
  user: {
    email: string;
    name: string;
    image: string;
    id: string;
  };
}

export default function Detail({ offre }: Offre) {
  // Existing state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();
  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const ws = useRef<WebSocket | null>(null);

  const currentUserId = session?.user?.user?._id || session?.user?._id || null;

  console.log("Current User ID:", currentUserId);
  console.log("Session:", session);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const data = await UserService.getUserById(offre.id_user);
        setUser(data);
        console.log("id", data?._id);

        // In a real app, you'd get the current user ID from your auth system

      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [offre.id_user]);



  // WebSocket setup
  useEffect(() => {
    if (!currentUserId) return;

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    ws.current = new WebSocket(`${socketUrl}?userId=${currentUserId}`);

    ws.current.onopen = () => console.log('WebSocket connected');

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

    };

    ws.current.onerror = (error) => console.error('WebSocket error:', error);
    ws.current.onclose = () => console.log('WebSocket disconnected');

    return () => {
      ws.current?.close();
      ws.current = null;
    };
  }, [currentUserId]);

  const handleContactOwner = async () => {
    console.log("currentUserId", currentUserId);

    if (!currentUserId) {
      alert('Please log in to contact the owner');
      return;
    }

    setIsLoading(true);
    try {
      const conversation = await messageService.getConversation(currentUserId, offre.id_user);
      setMessages(conversation);

      const ownerUser = {
        _id: offre.id_user,
        name: user?.name || "Property Owner",
        role: "owner",
        image: user?.image,
        lastMessage: conversation.length > 0 ? conversation[conversation.length - 1].text : undefined,
        unreadCount: 0,
        online: false
      };

      setUsers([ownerUser]);
      setShowChat(true);
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Convertir l'état en nombre d'étoiles (1-5)
  const etatStars = Math.min(5, Math.max(1, Math.floor(parseInt(offre.etat) / 20)));

  enum Status {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected",
  }

  const submitReport = async (data: Report) => {
    try {
      
      await reportService.addReport(data);
      alert('Report added successfully!');
    } catch (error) {
      console.error('Error adding report:', error);
      console.log(data);
      
      alert('error added successfully!');
    }
  };

  const submitComment = async (params: Comment) => {
    try {
      await CommentService.addComment(params);
      alert("Comment submitted successfully");
    } catch (error) {
      console.log("Error adding your comment! " + error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const report: Report = {
      text: description,
      userId: currentUserId,
      postId: offre._id,
      reason: reportReason,
      status: Status.Pending,
    };
    console.log(report);
    
    submitReport(report);
    setReportReason('');
    setDescription('');
    setIsModalOpen(false);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const comment: Comment = {
      userId: user.id,
      postId: offre.id,
      text: comments
    };
    submitComment(comment);
    setComments('');
  };

  const reportReasons = [
    "spam",
    "offensive content",
    "misinformation",
    "harassment",
    "inappropriate language",
  ];

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    exit: { opacity: 0, y: -10 }
  };

  const renderEquipmentBadge = (equipment: string) => {
    const icons: Record<string, JSX.Element> = {
      'eau': <FiCheckCircle className="text-blue-500 mr-1" />,
      'électricité': <FiCheckCircle className="text-yellow-500 mr-1" />,
      'accès': <FiCheckCircle className="text-green-500 mr-1" />,
      'clôture': <FiCheckCircle className="text-gray-500 mr-1" />,
    };

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mr-2 mb-2"
      >
        {icons[equipment.toLowerCase()] || <FiCheckCircle className="text-gray-500 mr-1" />}
        {equipment}
      </motion.div>
    );
  };

  const calculateYearsSince = (dateString: string) => {
    try {
      const createdAt = new Date(dateString);
      const now = new Date();
      let years = now.getFullYear() - createdAt.getFullYear();

      const monthDiff = now.getMonth() - createdAt.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < createdAt.getDate())) {
        years--;
      }

      return years > 0 ? years : 1;
    } catch (error) {
      console.error("Erreur de calcul de date:", error);
      return 1;
    }
  };

  return (
    <div className="bg-gray-50 mx-auto max-w-[80%] relative">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
      >
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{offre.titre}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <FiMapPin className="mr-1" />
            <span>{offre.placeName || "Localisation non spécifiée"}</span>
          </div>
        </div>
      </motion.div>

      <div className="container py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-16 h-16 rounded-full object-cover border-2 border-green-100"
                    src={user?.image?.startsWith('/uploads')
                      ? `http://localhost:3001${user.image}`
                      : user?.image || '/default-profile.png'}
                    alt="Profile"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{user?.name || "Propriétaire"}</h2>
                    <p className="text-gray-600">Propriétaire du l'offre</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-700 mb-3">À propos du propriétaire</h3>
                  <p className="text-gray-600">
                    {user?.createdAt ? (
                      <>
                        Membre depuis {calculateYearsSince(user.createdAt)} {calculateYearsSince(user.createdAt) === 1 ? 'an' : 'ans'}.
                        {user?.specialization && ` Spécialisé dans ${user.specialization}.`}
                      </>
                    ) : (
                      "Informations sur le propriétaire non disponibles"
                    )}
                  </p>
                </div>
              </motion.div>
            )}

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {['description', 'features', 'location'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center transition-colors ${activeTab === tab
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      {tab === 'description' && 'Description'}
                      {tab === 'features' && 'Caractéristiques'}
                      {tab === 'location' && 'Localisation'}
                      {activeTab === tab && <FiChevronRight className="ml-1" />}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {activeTab === 'description' && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Description</h3>
                        <p className="text-gray-600 leading-relaxed">
                          {offre.description}
                        </p>
                      </div>
                    )}
                    {activeTab === 'features' && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Caractéristiques</h3>

                        {offre.propertyType === 'land' ? (
                          <>
                            <div className="mb-6">
                              <h4 className="font-medium text-gray-700 mb-2">Superficie</h4>
                              <p className="text-lg">{offre.Superficie} {offre.unit}</p>
                            </div>

                            {offre.equipements && offre.equipements.length > 0 && (
                              <>
                                <h4 className="font-medium text-gray-700 mb-2">Équipements disponibles</h4>
                                <div className="flex flex-wrap mb-6">
                                  {offre.equipements.map((equip, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: index * 0.1 }}
                                    >
                                      {renderEquipmentBadge(equip)}
                                    </motion.div>
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {offre.etat && offre.etat !== "0" && (
                              <div className="mb-6">
                                <h4 className="font-medium text-gray-700 mb-2">État</h4>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <FiStar
                                      key={i}
                                      className={`${i < etatStars ? 'text-yellow-400' : 'text-gray-300'} w-5 h-5`}
                                    />
                                  ))}
                                  <span className="ml-2 text-gray-600">{offre.etat}/100</span>
                                </div>
                              </div>)}

                            {offre.equipements?.length > 0 && (
                              <>
                                <h4 className="font-medium text-gray-700 mb-2">Équipements inclus</h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                                  {offre.equipements.map((equip, index) => (
                                    <motion.li
                                      key={index}
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="flex items-center"
                                    >
                                      <FiCheckCircle className="text-green-500 mr-2" />
                                      <span>{equip}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    {activeTab === 'location' && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Localisation précise</h4>
                        <div className="h-full bg-gray-200 rounded-lg overflow-hidden">
                          <Map localisation={offre.localisation} />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FiMessageSquare className="mr-2" /> Commentaires
              </h3>

              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="mb-4">
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    rows={4}
                    placeholder="Partagez votre expérience..."
                    required
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Publier un commentaire
                </motion.button>
              </form>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md sticky top-6 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                <div className=" border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {offre.Superficie && offre.Superficie !== "0" && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                        <p className="text-m text-gray-500 dark:text-gray-400">Superficie</p>
                        <p className="font-bold text-xl  text-gray-900 dark:text-white">
                          {offre.Superficie} {offre.unit}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-m text-gray-500 dark:text-gray-400">Prix</p>
                    <h4 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {offre.prix} TND
                    </h4>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCalendar />
                    <span>Disponible depuis {format(new Date(offre.createdAt), 'dd/MM/yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMapPin />
                    <span>{offre.placeName || "Localisation non spécifiée"}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContactOwner}
                  className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Contacter le propriétaire
                </motion.button>

                <div className="text-center pt-2">
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
                  >
                    <FiFlag className="text-red-400" />
                    <span>Signaler cette annonce</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Signaler cette annonce</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Raison du signalement</label>
                    <div className="space-y-2">
                      {reportReasons.map((reason) => (
                        <motion.div
                          key={reason}
                          whileHover={{ x: 5 }}
                          className="flex items-center"
                        >
                          <input
                            type="radio"
                            id={reason}
                            name="reportReason"
                            value={reason}
                            checked={reportReason === reason}
                            onChange={(e) => setReportReason(e.target.value)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                            required
                          />
                          <label htmlFor={reason} className="ml-3 block text-sm text-gray-700 capitalize">
                            {reason}
                          </label>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Détails supplémentaires
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Veuillez décrire le problème..."
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      Envoyer le signalement
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Overlay */}
      {/* Chat Overlay */}
<AnimatePresence>
  {showChat && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-md h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 shadow-2xl"
      >
        {/* Close Button - Positioned absolutely at the top left of the chat panel */}
        <button
          onClick={() => setShowChat(false)}
          className="absolute left-4 top-4 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <FiX size={20} />
        </button>
        
        {/* Conversation */}
        <div className="flex-1 overflow-hidden pt-12"> {/* Added padding-top for the close button */}
          {users.length > 0 && (
            <Conversation
              selectedUser={users[0]}
              messages={messages}
              isLoading={isLoading}
              currentUserId={currentUserId}
              ws={ws.current}
              setMessages={setMessages}
              setUsers={setUsers}
              users={users}
            />
          )}
        </div>

        {/* Subtle Branding */}
        <div className="px-4 py-2 text-center text-xs text-gray-400 border-t border-gray-100">
          Messages sécurisés • {new Date().getFullYear()}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}