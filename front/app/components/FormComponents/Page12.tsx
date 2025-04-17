'use client';

import { useState } from 'react';
import { HeartIcon, CheckCircleIcon, CalendarIcon, DocumentTextIcon, StarIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';



export default function ListingPreview({ data, updateFields }) {
    const savedImages = JSON.parse(localStorage.getItem('uploadedPhotos') || '[]');
    const firstImage = savedImages.length > 0 ? savedImages[0] : filteredOffers[0].image;
    const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const toggleFavorite = (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
        },
        hover: { 
            y: -5,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }
    };

    const imageHoverVariants = {
        hover: { scale: 1.05 }
    };

    return (
        <div className="flex flex-col bg-gray-50  overflow-y-auto h-[700px]">
            {/* Main Content */}
            <div className="flex-1 flex justify-center items-start px-4 py-12">
                <div className="max-w-7xl w-full">
                    {/* Header Section */}
                    <div className="mb-12 text-center">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl font-bold text-gray-900 mb-4"
                        >
                            Vérifiez votre annonce
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-lg text-gray-600 max-w-2xl mx-auto"
                        >
                            Enfin, choisissez les conditions de vente, définissez votre prix et mettez votre annonce en ligne.
                        </motion.p>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Property Card - Redesigned */}
                        <motion.div 
                            key={1}
                            initial="hidden"
                            animate="visible"
                           
                            variants={cardVariants}
                            className="relative lg:col-span-1"
                            
                        >
                            <div className=" flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <motion.img
                                        className="w-full h-full object-cover"
                                        src={firstImage}
                                        alt="Property"
                                        loading="lazy"
                                        variants={imageHoverVariants}
                                    />
                                    
                                    
                                    
                                    {/* Rating */}
                                    {data.propertyType === "Material" && (
                                        <div className="absolute bottom-4 left-4 flex items-center bg-black/80 text-white text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                                            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                                            {data.etat}/10
                                        </div>
                                    )}
                                    
                                   
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-900 truncate">
                                            {data.titre || "Titre non spécifié"}
                                        </h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 capitalize">
                                            {data.propertyType || "Type non spécifié"}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-gray-600 text-sm mb-3">
                                        <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                                        <span className="truncate">
                                            {data.placeName || "Localisation non spécifiée"}
                                        </span>
                                    </div>

                                    

                                    <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                        {data.propertyType === "Land"  && (
                                                <div className="bg-gray-50 p-2 rounded-lg">
                                                    <p className="text-xs text-gray-500">Superficie</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {data.Superficie} {data.unit}
                                                    </p>
                                                </div>
                                            )}
                                            {data.propertyType === "Land"  && (
                                                <div className="bg-gray-50 p-2 rounded-lg">
                                                    <p className="text-xs text-gray-500">Équipements</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {data.equipements.length}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Prix</p>
                                            <h4 className="text-xl font-bold text-blue-600">
                                                {data.prix || "N/A"} TND
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Details Section */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* ... (keep your existing details sections) ... */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                                        <DocumentTextIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Description complète
                                    </h3>
                                </div>
                                <div className="prose prose-sm max-w-none text-gray-600 pl-11">
                                    {data.description ? (
                                        <p>{data.description}</p>
                                    ) : (
                                        <p className="text-gray-400 italic">Aucune description fournie</p>
                                    )}
                                </div>
                            </motion.div>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="p-2 rounded-full bg-teal-100 text-teal-600 mr-3">
                                        <CheckCircleIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Confirmez les informations
                                    </h3>
                                </div>
                                <p className="text-gray-600 pl-11">
                                    Avant la publication, vérifiez que toutes les informations sont exactes et conformes. 
                                    Nous pourrons vous demander une vérification d'identité ou des documents supplémentaires 
                                    selon les exigences locales. Certaines régions nécessitent un enregistrement auprès des 
                                    autorités compétentes.
                                </p>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                                        <CalendarIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Configurez vos disponibilités
                                    </h3>
                                </div>
                                <p className="text-gray-600 pl-11">
                                    Définissez les créneaux pour les visites ou réservations. Vous pouvez choisir des 
                                    périodes spécifiques ou une disponibilité permanente. Ces informations aideront les 
                                    acheteurs à organiser leur planning.
                                    <span className="block mt-2 text-sm bg-yellow-50 text-yellow-700 p-2 rounded">
                                        Votre annonce sera visible 24 heures après publication pour une diffusion optimale.
                                    </span>
                                </p>
                            </motion.div>

                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}