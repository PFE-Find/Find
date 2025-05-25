"use client";
import React, { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SidBar from "../../SideBar";
import Navbar from "../../NavBar";
import eventService from "../../../../services/Offres";
import UserService from "../../../../services/User";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import Map from "../../../OffreDetails/Maps";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import {
  FiInfo, FiDollarSign, FiMaximize2, FiLayers,
  FiMapPin, FiImage, FiMessageSquare, FiCheckCircle,
  FiCalendar, FiStar, FiChevronRight, FiFlag
} from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { X, ChevronLeft, ChevronRight, MessageCircle, Settings } from "lucide-react";
import { FaLeaf, FaShieldAlt } from 'react-icons/fa';
import { useSession } from "next-auth/react";

const Details: React.FC = () => {
  const [offre, setOffre] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchDetails() {
      try {
        setIsLoading(true);
        if (id) {
          const data = await eventService.getOffre(id as string);
          setOffre(data);
          // Fetch user data if available
          if (data.id_user) {
            const userData = await UserService.getUserById(data.id_user);
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  const openModalAtIndex = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    if (offre.images) {
      setCurrentIndex((prev) => (prev + 1) % offre.images.length);
    }
  };

  const prevImage = () => {
    if (offre.images) {
      setCurrentIndex((prev) => (prev - 1 + offre.images.length) % offre.images.length);
    }
  };

  const handleAccept = async () => {
    try {
      await eventService.updateStatut(id as string);
      Swal.fire({
        title: 'Offre acceptée !',
        text: 'La mise à jour a été effectuée avec succès.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      router.push("/Admin/OffresPage");
    } catch (error) {
      console.error("Error updating statut:", error);
      Swal.fire({
        title: 'Erreur lors de l\'acceptation',
        text: 'Une erreur est survenue lors de la mise à jour.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };
const handleDelete = async () => {
  try {
    await eventService.deleteOffre(id as string);
    Swal.fire({
      title: 'Suppression réussie !',
      text: 'L\'offre a été supprimée avec succès.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    router.push("/Admin/OffresPage");
  } catch (error) {
    console.error("Error deleting offre:", error);
    Swal.fire({
      title: 'Échec de la suppression',
      text: 'Une erreur est survenue lors de la suppression de l\'offre.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};

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

  if (!offre) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidBar children={undefined} />
        <main className="flex-1 p-8">
          <Navbar />
          <div className="mt-28 text-center text-gray-500">
            Loading details...
          </div>
        </main>
      </div>
    );
  }

  // Convert state to star rating (1-5)
  const etatStars = offre.etat ? Math.min(5, Math.max(1, Math.floor(parseInt(offre.etat) / 20))) : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidBar children={undefined} />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Navbar />

        {/* Action Buttons - Fixed Position */}
        <div className="fixed right-[150px] top-14 z-10 flex gap-4">
          <motion.button
            onClick={handleAccept}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Accepter
          </motion.button>
          <motion.button
            onClick={handleDelete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Refuser
          </motion.button>
        </div>


        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-32"
        >
          {/* User Profile Section */}
          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden mb-8"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Information du propriétaire</h3>

                <div className="flex flex-col md:flex-row items-start gap-6">
                  <motion.div whileHover={{ scale: 1.02 }} className="shrink-0">
                    

                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-16 h-16 rounded-full object-cover border-2 border-green-100"
                        src={
                          user?.image
                            ? user.image.startsWith('/uploads')
                              ? `http://localhost:3001${user.image}`
                              : user.image
                            : '/default-avatar.png' // Fallback image
                        }
                        alt="Profile"
                      />

                  
                  </motion.div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-gray-500 mb-4">Membre depuis {format(new Date(user.createdAt || new Date()), 'yyyy')}</p>

                    <div className="flex flex-wrap gap-4 mt-6">
                      


                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* Title Section */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="mb-8 bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center mb-4">
              <FiInfo className="text-gray-700 mr-2 text-xl" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Détails de l'offre</h2>

            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {offre.titre || "Aucune titre disponible"}
            </h1>
            {offre.placeName && (
              <p className="mt-4 text-gray-600 flex items-center">
                <FiMapPin className="mr-2" />
                {offre.placeName}
              </p>
            )}
            <div className="mt-4 flex items-center text-gray-500">
              <FiCalendar className="mr-2" />
              <span>Publié le {format(new Date(offre.createdAt), 'dd/MM/yyyy')}</span>
            </div>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                <div className="bg-blue-50 p-3 rounded-full mr-4">
                  <FiDollarSign className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 font-medium">Prix</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {offre.prix ? `${offre.prix} TND` : "N/A"}
                  </p>
                </div>
              </div>

              {offre.propertyType === "Land" && offre.Superficie && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
                >
                  <div className="bg-emerald-50 p-3 rounded-full mr-4">
                    <FiMaximize2 className="text-emerald-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 font-medium">Superficie</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {offre.Superficie} {offre.unit}
                    </p>
                  </div>
                </motion.div>
              )}

              {offre.propertyType === "Material" && offre.etat && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
                >
                  <div className="bg-purple-50 p-3 rounded-full mr-4">
                    <FiLayers className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 font-medium">État</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`${i < etatStars ? 'text-yellow-400' : 'text-gray-300'} w-5 h-5`}
                        />
                      ))}
                      <span className="ml-2 text-gray-600">{offre.etat}/10</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Tabs Section */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {['description', 'gallery', 'location'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center transition-colors ${activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {tab === 'description' && 'Description'}
                    {tab === 'gallery' && 'Galerie'}
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
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Description détaillée</h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {offre.description || "Aucune description disponible."}
                      </p>

                      {offre.equipements && offre.equipements.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold text-gray-800 mb-3">Équipements & Caractéristiques</h4>
                          <div className="flex flex-wrap">
                            {offre.equipements.map((equip: string, index: number) => (
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
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'gallery' && offre.images && offre.images.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-6">Galerie photo</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {offre.images.map((image: any, index: number) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            className="relative aspect-square w-full h-52 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden cursor-pointer"
                            onClick={() => openModalAtIndex(index)}
                          >
                            <Image
                              src={image.path}
                              alt={`Photo ${index + 1}`}
                              fill
                              className="object-cover"
                              quality={75}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'location' && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Localisation</h3>
                      {offre.placeName && (
                        <p className="mb-4 text-gray-600 flex items-center">
                          <FiMapPin className="mr-2" />
                          {offre.placeName}
                        </p>
                      )}
                      <div className="h-96 bg-gray-100 rounded-xl overflow-hidden">
                        <Map localisation={offre.localisation} />
                      </div>

                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>


        </motion.div>

        {/* Image Modal */}
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white p-2 rounded-xl shadow-2xl max-w-4xl w-full mx-4"
          >
            <button
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="relative h-[80vh]">
              {offre.images && (
                <>
                  <Image
                    src={offre.images[currentIndex].path}
                    alt={`Photo ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    quality={100}
                  />

                  {offre.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>

                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="w-6 h-6 text-white" />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </Dialog>
      </main>
    </div>
  );
};

export default Details;