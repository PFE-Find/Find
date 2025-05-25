// app/OffrePage/Offres.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Heart, ArrowRight, Search, X, SlidersHorizontal, MapPin, DollarSign, Ruler, Filter, RefreshCw, Check } from "lucide-react";
import Link from "next/link";
import eventService from "../../services/Offres";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiMapPin, FiStar } from "react-icons/fi";
import OffreSearch from "../Search";
import Image from 'next/image'; // Import next/image

export default function Offres() {
    const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [offres, setOffres] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [priceRange, setPriceRange] = useState<[number | null, number | null]>([null, null]);
    const [surfaceRange, setSurfaceRange] = useState<[number | null, number | null]>([null, null]);
    const [locationFilter, setLocationFilter] = useState<string>("");
    const [surfaceFilterEnabled, setSurfaceFilterEnabled] = useState(false);
    const [visibleLines, setVisibleLines] = useState(3);

    const toggleFavorite = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        async function fetchOffres() {
            try {
                const data = await eventService.getOffres1();
                setOffres(shuffleArray(data));
            } catch (error) {
                console.error("Erreur lors de la récupération des offres:", error);
            }
        }
        fetchOffres();
    }, []);

    const filteredOffers = offres.filter((offer) => {
        const matchesCategory = selectedCategory === "all" || offer.propertyType === selectedCategory;
        const matchesSearch = searchQuery === "" ||
            (offer.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (offer.placeName && offer.placeName.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesPrice = !filtersApplied || (
            (priceRange[0] === null || offer.prix >= priceRange[0]) &&
            (priceRange[1] === null || offer.prix <= priceRange[1])
        );

        const matchesLocation = !filtersApplied ||
            !locationFilter ||
            (offer.placeName && offer.placeName.toLowerCase().includes(locationFilter.toLowerCase()));

        const matchesSurface = !filtersApplied ||
            !surfaceFilterEnabled ||
            (selectedCategory !== "Material" &&
                offer.Superficie !== undefined &&
                (surfaceRange[0] === null || offer.Superficie >= surfaceRange[0]) &&
                (surfaceRange[1] === null || offer.Superficie <= surfaceRange[1]));

        return matchesCategory && matchesSearch && matchesPrice && matchesLocation && matchesSurface;
    });

    const rows = [];
    for (let i = 0; i < filteredOffers.length; i += 6) {
        rows.push(filteredOffers.slice(i, i + 6));
    }

    const totalLines = rows.length;
    const visibleRows = rows.slice(0, visibleLines);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const applyFilters = (filters: any) => {
        setPriceRange(filters.priceRange);
        setSurfaceRange(filters.surfaceRange);
        setLocationFilter(filters.locationFilter);
        setSurfaceFilterEnabled(filters.surfaceFilterEnabled);
        setFiltersApplied(true);
        setVisibleLines(3);
        setOffres(prev => shuffleArray([...prev]));
    };

    const resetFilters = () => {
        setPriceRange([null, null]);
        setSurfaceRange([null, null]);
        setLocationFilter("");
        setSearchQuery("");
        setSelectedCategory("all");
        setFiltersApplied(false);
        setSurfaceFilterEnabled(false);
        setVisibleLines(3);
        setOffres(prev => shuffleArray([...prev]));
    };

    function shuffleArray<T>(array: T[]): T[] {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        if (category === "Material") {
            setSurfaceFilterEnabled(false);
        }
        setVisibleLines(3);
    };

    const imageHoverVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.3 }
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

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-full mx-auto">
                {/* Improved Search Section */}
                <div className="bg-gradient-to-b from-teal-600 to-white">
                    <OffreSearch
                        onSearch={handleSearch}
                        onCategoryChange={handleCategoryChange}
                        selectedCategory={selectedCategory}
                        onFiltersApply={applyFilters}
                        resetFilters={resetFilters}
                        filtersApplied={filtersApplied}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        surfaceRange={surfaceRange}
                        setSurfaceRange={setSurfaceRange}
                        locationFilter={locationFilter}
                        setLocationFilter={setLocationFilter}
                        surfaceFilterEnabled={surfaceFilterEnabled}
                        setSurfaceFilterEnabled={setSurfaceFilterEnabled}
                    />
                </div>

                {/* Category Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex justify-center items-center mb-12 space-x-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                >
                    <button
                        onClick={() => handleCategoryChange("Land")}
                        className={`flex flex-col items-center text-center space-y-2 p-2 rounded-lg transition-colors ${selectedCategory === "Land" ? 'bg-green-50 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <img
                            className="w-10 h-10 object-cover"
                            src="/assets/icons/location.png"
                            alt="Terrain"
                        />
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                            Terrains
                        </h5>
                    </button>

                    <div className="h-10 w-0.5 bg-gray-200 dark:bg-gray-600"></div>

                    <button
                        onClick={() => handleCategoryChange("Material")}
                        className={`flex flex-col items-center text-center space-y-2 p-2 rounded-lg transition-colors ${selectedCategory === "Material" ? 'bg-green-50 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <img
                            className="w-10 h-10 object-cover"
                            src="/assets/icons/machine.png"
                            alt="Matériel"
                        />
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                            Matériels
                        </h5>
                    </button>

                    <div className="h-10 w-0.5 bg-gray-200 dark:bg-gray-600"></div>

                    <button
                        onClick={() => handleCategoryChange("all")}
                        className={`flex flex-col items-center text-center p-2 rounded-lg transition-colors ${selectedCategory === "all" ? 'bg-green-50 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <img
                            className="w-8 h-8 object-cover"
                            src="/assets/icons/select-all.png"
                            alt="Tous"
                        />
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                            Toutes catégories
                        </h5>
                    </button>
                </motion.div>

                {/* Number of Results */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 text-gray-700 dark:text-gray-300 sm:px-6 lg:px-8"
                >
                    {filteredOffers.length} {filteredOffers.length === 1 ? 'offre trouvée' : 'offres trouvées'}
                    {filtersApplied && (
                        <button
                            onClick={resetFilters}
                            className="ml-4 text-sm text-green-600 dark:text-green-400 hover:underline"
                        >
                            Réinitialiser les filtres
                        </button>
                    )}
                </motion.div>

                {/* Offers Grid */}
                <div className="space-y-8 sm:px-6 lg:px-8 mb-16">
                    {visibleRows.map((row, rowIndex) => (
                        <motion.div
                            key={rowIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6"
                        >
                            {row.map((offre, index) => (
                                <motion.div
                                    key={offre._id}
                                    custom={index}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    variants={cardVariants}
                                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                                    className="relative w-full flex-shrink-0"
                                    onMouseEnter={() => setHoveredCard(offre._id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <Link href={`/OffreDetail/${offre._id}`} prefetch={false} className="block h-full">
                                        <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                                            {/* Image Container */}
                                            <div className="relative h-[200px] overflow-hidden">
                                                <Image
                                                    src={offre.images?.[0]?.path || "/default-property.jpg"}
                                                    alt={offre.titre}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    priority={rowIndex === 0 && index === 0} // Prioritize the first image
                                                    quality={75}
                                                />

                                                {/* Badges */}
                                                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                                                    {offre.isNew && (
                                                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                                            Nouveau
                                                        </span>
                                                    )}
                                                    {offre.isPromoted && (
                                                        <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                                            En vedette
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Favorite Button */}
                                                {/* <button
                                                    onClick={(e) => toggleFavorite(offre._id, e)}
                                                    className={`absolute top-4 right-4 p-2 rounded-full transition-all ${favorites[offre._id]
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
                        </motion.div>
                    ))}
                </div>

                {/* "Show More" Button */}
                {visibleLines < totalLines && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mt-12"
                    >
                        <button
                            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-all shadow-lg hover:shadow-xl"
                            onClick={() => setVisibleLines(prev => Math.min(prev + 4, totalLines))}
                        >
                            Afficher plus d'offres
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}