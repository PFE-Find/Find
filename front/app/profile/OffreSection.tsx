"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { FiHeart, FiArrowLeft, FiArrowRight, FiStar, FiMapPin, FiTrash2, FiEdit, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import eventService from "../services/Offres";

interface Offre {
  _id: string;
  titre: string;
  description: string;
  prix: string;
  Superficie: string;
  unit: string;
  id_user: string;
  localisation: [number, number];
  placeName: string[];
  equipements: string[];
  etat: string;
  images?: { path: string }[];
  propertyType: string;
  propertyId: number | null;
  isNew?: boolean;
  isPromoted?: boolean;
}

interface OffresSectionProps {
  offres: Offre[];
  title?: string;
  subtitle?: string;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string) => void;
}

export default function Offres({
  offres: initialOffres,
  title = "Découvrez nos offres",
  subtitle = "Trouvez la propriété parfaite pour vos besoins",
  onDelete,
  onUpdate
}: OffresSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [offres, setOffres] = useState<Offre[]>(initialOffres);
  const [isLoading, setIsLoading] = useState(false);

  

  const openDeleteConfirmation = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOfferToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteModal(false);
    setOfferToDelete(null);
  };

  const handleDelete = async () => {
    if (!offerToDelete) return;
    
    
    try {
      await eventService.deleteOffre(offerToDelete);
      
      setOffres(prevOffres => prevOffres.filter(offre => offre._id !== offerToDelete));
      closeDeleteConfirmation();
     
      
    } catch (error: any) {
      console.error('Error deleting offer:', error);
     
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpdate = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/update-offre/${id}`);
    if (onUpdate) onUpdate(id);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === "left"
        ? scrollLeft - clientWidth * 0.8
        : scrollLeft + clientWidth * 0.8;

      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const imageHoverVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
<AnimatePresence>
  {showDeleteModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className=" inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/20 p-6 border-b border-red-100 dark:border-red-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300">
              <FiTrash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirmer la suppression</h3>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">Action irréversible</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Êtes-vous sûr de vouloir supprimer définitivement cette offre ? 
            <span className="block mt-2 text-sm text-gray-500 dark:text-gray-400">
              Toutes les données associées seront perdues et cette action ne peut pas être annulée.
            </span>
          </p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={closeDeleteConfirmation}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              disabled={isDeleting !== null}
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
              disabled={isDeleting !== null}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Suppression...
                </>
              ) : (
                "Supprimer définitivement"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      {/* Main Content */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="relative group">
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-gray-700"
              aria-label="Scroll left"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>

            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto pb-8 scrollbar-hide"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="flex space-x-6 w-max px-1">
                  <AnimatePresence>
                    {offres.map((offre, index) => (
                      <motion.div
                        key={offre._id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        variants={cardVariants}
                        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                        className="relative w-[360px] flex-shrink-0"
                        onMouseEnter={() => setHoveredCard(offre._id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                          {/* Image Container */}
                          <div className="relative h-64 overflow-hidden">
                            <Link href={`/OffreDetail/${offre._id}`} prefetch={false} className="block h-full w-full">
                              <motion.img
                                className="w-full h-full object-cover"
                                src={offre.images?.[0]?.path || "/default-property.jpg"}
                                alt={offre.titre}
                                loading="lazy"
                                variants={imageHoverVariants}
                              />
                            </Link>
                            
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
                              {offre.isNew && (
                                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                  Nouveau
                                </span>
                              )}
                              {offre.isPromoted && (
                                <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                  Promu
                                </span>
                              )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex flex-col space-y-2 z-20">
                              {/* Show edit/delete buttons if user is owner or admin */}
                              {session?.user?._id === offre.id_user && (
                                <>
                                  <button
                                    onClick={() => router.push(`/UpdateForm/${offre._id}`)}
                                    className="p-2 rounded-full bg-white/80 text-blue-500 hover:bg-white/90 hover:text-blue-600 transition-all"
                                    title="Modifier"
                                  >
                                    <FiEdit className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={(e) => openDeleteConfirmation(offre._id, e)}
                                    className="p-2 rounded-full bg-white/80 text-red-500 hover:bg-white/90 hover:text-red-600 transition-all"
                                    title="Supprimer"
                                    disabled={isDeleting === offre._id}
                                  >
                                    {isDeleting === offre._id ? (
                                      <span className="loading-spinner"></span>
                                    ) : (
                                      <FiTrash2 className="w-5 h-5" />
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                            
                            {/* Rating */}
                            {offre.etat && offre.etat !== "0" && (
                              <div className="absolute bottom-4 left-4 flex items-center bg-black/80 text-white text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm z-10">
                                <FiStar className="text-yellow-400 mr-1" />
                                {offre.etat}/10
                              </div>
                            )}
                            
                            {/* Hover Overlay */}
                            <AnimatePresence>
                              {hoveredCard === offre._id && (
                                <Link href={`/OffreDetail/${offre._id}`} prefetch={false} className="block h-full w-full">
                                  <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/20 flex items-center justify-center"
                                  >
                                    <motion.span
                                      initial={{ scale: 0.8 }}
                                      animate={{ scale: 1 }}
                                      className="bg-white text-gray-900 font-medium px-4 py-2 rounded-full shadow-lg"
                                    >
                                      Voir les détails
                                    </motion.span>
                                  </motion.div>
                                </Link>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Content */}
                          <div className="p-6 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                                {offre.titre}
                              </h3>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-100 capitalize">
                                {offre.propertyType}
                              </span>
                            </div>

                            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                              <FiMapPin className="mr-1.5 flex-shrink-0" />
                              <span className="truncate">
                                {offre.placeName || "Localisation non spécifiée"}
                              </span>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                {offre.Superficie && offre.Superficie !== "0" && (
                                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Superficie</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                      {offre.Superficie} {offre.unit}
                                    </p>
                                  </div>
                                )}
                                {offre.equipements?.length > 0 && (
                                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Équipements</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                      {offre.equipements.length}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Prix</p>
                                <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                  {offre.prix} TND
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-gray-700"
              aria-label="Scroll right"
            >
              <FiArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}