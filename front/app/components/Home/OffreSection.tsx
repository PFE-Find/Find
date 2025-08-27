"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiHeart, FiArrowLeft, FiArrowRight, FiStar, FiMapPin, FiPlay } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import eventService from "../../services/Offres";

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
}

export default function Offres() {
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [offres, setOffres] = useState<Offre[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchOffres() {
      try {
        const data = await eventService.getOffres1();
        setOffres(data);

      } catch (error) {
        console.error("Error fetching offres:", error);
      }
    }
    fetchOffres();
  }, []);

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
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

  const filteredOffers = selectedCategory === "all"
    ? offres
    : offres.filter((offer) => offer.propertyType === selectedCategory);

  // Animation variants
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
    <section className="py-4 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-full mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Découvrez nos offres</h2>
          <p className="text-gray-600 dark:text-gray-400">Trouvez la propriété parfaite pour vos besoins</p>
        </div>

        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-gray-700"
            aria-label="Scroll left"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>

          {/* Updated scroll container with hidden scrollbar */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto pb-8 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',  // For Firefox
              msOverflowStyle: 'none'   // For IE/Edge
            }}
          >
            {/* Hide scrollbar for WebKit browsers */}
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <div className="flex space-x-6 w-max px-1">
              <AnimatePresence>
                {filteredOffers.map((offre, index) => (
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
                    <Link href={`/OffreDetail/${offre._id}`} prefetch={false} className="block h-full">
                      <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                        {/* Image Container */}
                        <div className="relative h-64 overflow-hidden">
                          <motion.img
                            className="w-full h-full object-cover"
                            src={offre.images?.[0]?.path || "/default-property.jpg"}
                            alt={offre.titre}
                            loading="lazy"
                            variants={imageHoverVariants}
                          />

                          {/* Favorite Button */}
                          {/* <button
                            onClick={(e) => toggleFavorite(offre._id, e)}
                            className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
                              favorites[offre._id] 
                                ? 'text-red-500 bg-white/90 shadow-sm' 
                                : 'text-gray-400 bg-white/80 hover:text-red-500'
                            }`}
                          >
                            <FiHeart className={`w-5 h-5 ${favorites[offre._id] ? 'fill-current' : ''}`} />
                          </button> */}


                          {/* Hover Overlay */}
                          <AnimatePresence>
                            {hoveredCard === offre._id && (
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
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
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
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row justify-center gap-4"
      >
        <Link href="/OffrePage">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-8 py-4 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-all"
          >
            Explorer les offres
            <FiArrowRight className="ml-2" />
          </motion.button>
        </Link>

        <a
          href="https://youtu.be/UriEPXTApa0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-8 py-4 border border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-all"
          >
            <FiPlay className="mr-2" />
            Voir la démo
          </motion.button>
        </a>

      </motion.div>
    </section>
  );
}