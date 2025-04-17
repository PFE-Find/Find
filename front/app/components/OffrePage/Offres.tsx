"use client";

import { useEffect, useState, useRef } from "react";
import { Heart, ArrowRight, Search, X, SlidersHorizontal, MapPin, DollarSign, Ruler } from "lucide-react";
import Link from "next/link";
import eventService from "../../services/Offres";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiMapPin, FiStar } from "react-icons/fi";

export default function Offres() {
    const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [offres, setOffres] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [visibleCount, setVisibleCount] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    // Advanced filters
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [surfaceRange, setSurfaceRange] = useState<[number, number]>([0, 10000]);
    const [locationFilter, setLocationFilter] = useState<string>("");

    const toggleFavorite = (id: string) => {
        setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        async function fetchOffres() {
            try {
                const data = await eventService.getOffres1();
                setOffres(data);
                // Generate search suggestions from titles and property types
                const titles = data.map(offer => offer.titre);
                const types = [...new Set(data.map(offer => offer.propertyType))];
                setSuggestions([...titles, ...types, "Terrain agricole", "Matériel neuf"]);
            } catch (error) {
                console.error("Error fetching offres:", error);
            }
        }
        fetchOffres();

        // Close suggestions when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter offers based on all criteria
    const filteredOffers = offres.filter((offer) => {
        const matchesCategory = selectedCategory === "all" || offer.propertyType === selectedCategory;
        const matchesSearch = offer.titre?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = offer.prix >= priceRange[0] && offer.prix <= priceRange[1];

        // Only apply surface filter if:
        // 1. Category is not "Material" AND 
        // 2. The offer has a Superficie property
        const matchesSurface =
            (selectedCategory !== "Material" && offer.Superficie !== undefined)
                ? offer.Superficie >= surfaceRange[0] && offer.Superficie <= surfaceRange[1]
                : true;

        const matchesLocation = !locationFilter ||
            (offer.localisation && offer.localisation.join(" ").toLowerCase().includes(locationFilter.toLowerCase()));

        return matchesCategory && matchesSearch && matchesPrice && matchesSurface && matchesLocation;
    });

    // Split into rows for responsive grid
    const rows = [];
    for (let i = 0; i < filteredOffers.length; i += 7) {
        rows.push(filteredOffers.slice(i, i + 7));
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setShowSuggestions(e.target.value.length > 0);
    };

    const selectSuggestion = (suggestion: string) => {
        setSearchQuery(suggestion);
        setShowSuggestions(false);
    };

    const resetFilters = () => {
        setPriceRange([0, 1000000]);
        setSurfaceRange([0, 10000]);
        setLocationFilter("");
        setSearchQuery("");
        setSelectedCategory("all");
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
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-full mx-auto">
                {/* Enhanced Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center mb-16"
                >
                    <div className="w-full max-w-4xl relative" ref={searchRef}>
                        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                            <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <Search className="w-5 h-5 text-gray-400 mr-3" />
                                <input
                                    type="search"
                                    id="property-search"
                                    className="flex-grow bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-lg"
                                    placeholder="Rechercher des terrains, matériels ou vendeurs..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => setShowSuggestions(true)}
                                    required
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="ml-2 p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`ml-4 px-4 py-2 rounded-lg flex items-center transition-colors ${showFilters ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                >
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    Filtres
                                </button>
                            </div>

                            {/* Search Suggestions */}
                            <AnimatePresence>
                                {showSuggestions && suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-white dark:bg-gray-800 shadow-lg rounded-b-xl overflow-hidden"
                                    >
                                        <ul className="py-2">
                                            {suggestions
                                                .filter(suggestion =>
                                                    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
                                                )
                                                .slice(0, 5)
                                                .map((suggestion, index) => (
                                                    <motion.li
                                                        key={index}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                                        onClick={() => selectSuggestion(suggestion)}
                                                    >
                                                        <div className="flex items-center">
                                                            <Search className="w-4 h-4 text-gray-400 mr-3" />
                                                            <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                                                        </div>
                                                    </motion.li>
                                                ))
                                            }
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Advanced Filters Panel */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtres avancés</h3>
                                        <button
                                            onClick={resetFilters}
                                            className="text-sm text-green-600 dark:text-green-400 hover:underline"
                                        >
                                            Réinitialiser
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Price Range Filter */}
                                        <div className="space-y-4">
                                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                                <DollarSign className="w-4 h-4 mr-2" />
                                                <span>Fourchette de prix (TND)</span>
                                            </div>
                                            <div className="flex items-center justify-between space-x-4">
                                                <input
                                                    type="number"
                                                    value={priceRange[0]}
                                                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                                                    placeholder="Min"
                                                />
                                                <span className="text-gray-500">à</span>
                                                <input
                                                    type="number"
                                                    value={priceRange[1]}
                                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000])}
                                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                                                    placeholder="Max"
                                                />
                                            </div>
                                            <div className="relative py-2">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1000000"
                                                    step="10000"
                                                    value={priceRange[0]}
                                                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                                    className="absolute w-full h-1 bg-gray-200 dark:bg-gray-600 appearance-none pointer-events-none"
                                                    style={{ zIndex: 3 }}
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1000000"
                                                    step="10000"
                                                    value={priceRange[1]}
                                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                                    className="absolute w-full h-1 bg-gray-200 dark:bg-gray-600 appearance-none pointer-events-none"
                                                    style={{ zIndex: 4 }}
                                                />
                                                <div className="relative h-1 bg-gray-300 dark:bg-gray-500 rounded-full">
                                                    <div
                                                        className="absolute h-1 bg-green-500 rounded-full"
                                                        style={{
                                                            left: `${(priceRange[0] / 1000000) * 100}%`,
                                                            width: `${((priceRange[1] - priceRange[0]) / 1000000) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Surface Area Filter - Conditionally rendered */}
                                        {selectedCategory !== "Material" && (
                                            <div className="space-y-4">
                                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                                    <Ruler className="w-4 h-4 mr-2" />
                                                    <span>Superficie (m²)</span>
                                                </div>
                                                <div className="flex items-center justify-between space-x-4">
                                                    <input
                                                        type="number"
                                                        value={surfaceRange[0]}
                                                        onChange={(e) => setSurfaceRange([parseInt(e.target.value) || 0, surfaceRange[1]])}
                                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                                                        placeholder="Min"
                                                    />
                                                    <span className="text-gray-500">à</span>
                                                    <input
                                                        type="number"
                                                        value={surfaceRange[1]}
                                                        onChange={(e) => setSurfaceRange([surfaceRange[0], parseInt(e.target.value) || 10000])}
                                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                                                        placeholder="Max"
                                                    />
                                                </div>
                                                <div className="relative py-2">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="10000"
                                                        step="100"
                                                        value={surfaceRange[0]}
                                                        onChange={(e) => setSurfaceRange([parseInt(e.target.value), surfaceRange[1]])}
                                                        className="absolute w-full h-1 bg-gray-200 dark:bg-gray-600 appearance-none pointer-events-none"
                                                        style={{ zIndex: 3 }}
                                                    />
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="10000"
                                                        step="100"
                                                        value={surfaceRange[1]}
                                                        onChange={(e) => setSurfaceRange([surfaceRange[0], parseInt(e.target.value)])}
                                                        className="absolute w-full h-1 bg-gray-200 dark:bg-gray-600 appearance-none pointer-events-none"
                                                        style={{ zIndex: 4 }}
                                                    />
                                                    <div className="relative h-1 bg-gray-300 dark:bg-gray-500 rounded-full">
                                                        <div
                                                            className="absolute h-1 bg-green-500 rounded-full"
                                                            style={{
                                                                left: `${(surfaceRange[0] / 10000) * 100}%`,
                                                                width: `${((surfaceRange[1] - surfaceRange[0]) / 10000) * 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Location Filter */}
                                        <div className="space-y-2">
                                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                <span>Localisation</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={locationFilter}
                                                onChange={(e) => setLocationFilter(e.target.value)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                                                placeholder="Ville, région..."
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Category Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex justify-center items-center mb-12 space-x-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                >
                    <button
                        onClick={() => setSelectedCategory("Land")}
                        className={`flex flex-col items-center text-center space-y-2 p-2 rounded-lg transition-colors ${selectedCategory === "Land" ? 'bg-green-50 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <img
                            className="w-10 h-10 object-cover"
                            src="/assets/icons/location.png"
                            alt="Terrain"
                        />
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                            Terrain
                        </h5>
                    </button>

                    <div className="h-10 w-0.5 bg-gray-200 dark:bg-gray-600"></div>

                    <button
                        onClick={() => setSelectedCategory("Material")}
                        className={`flex flex-col items-center text-center space-y-2 p-2 rounded-lg transition-colors ${selectedCategory === "Material" ? 'bg-green-50 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <img
                            className="w-10 h-10 object-cover"
                            src="/assets/icons/machine.png"
                            alt="Matériel"
                        />
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                            Matériel
                        </h5>
                    </button>

                    <div className="h-10 w-0.5 bg-gray-200 dark:bg-gray-600"></div>

                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`flex flex-col items-center text-center p-2 rounded-lg transition-colors ${selectedCategory === "all" ? 'bg-green-50 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <img
                            className="w-8 h-8 object-cover"
                            src="/assets/icons/select-all.png"
                            alt="Tous"
                        />
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                            Tous
                        </h5>
                    </button>
                </motion.div>

                {/* Results Count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    
                    className="mb-6 text-gray-700 dark:text-gray-300"
                >
                    {filteredOffers.length} {filteredOffers.length === 1 ? 'offre trouvée' : 'offres trouvées'}
                </motion.div>

                {/* Offers Grid */}
                <div className="space-y-8">
                    {rows.slice(0, visibleCount).map((row, rowIndex) => (
                        <motion.div
                            key={rowIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
                            className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6"
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
                                className="relative  w-full flex-shrink-0"
                                onMouseEnter={() => setHoveredCard(offre._id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <Link href={`/OffreDetail/${offre._id}`} prefetch={false} className="block h-full">
                                        <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                                            {/* Image Container */}
                                            <div className="relative h-[200px] overflow-hidden">
                                                <motion.img
                                                    className="w-full h-full object-cover"
                                                    src={offre.images?.[0]?.path || "/default-property.jpg"}
                                                    alt={offre.titre}
                                                    loading="lazy"
                                                    variants={imageHoverVariants}
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
                                                            Promu
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Favorite Button */}
                                                <button
                                                    onClick={(e) => toggleFavorite(offre._id, e)}
                                                    className={`absolute top-4 right-4 p-2 rounded-full transition-all ${favorites[offre._id]
                                                            ? 'text-red-500 bg-white/90 shadow-sm'
                                                            : 'text-gray-400 bg-white/80 hover:text-red-500'
                                                        }`}
                                                >
                                                    <FiHeart className={`w-5 h-5 ${favorites[offre._id] ? 'fill-current' : ''}`} />
                                                </button>

                                                

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
                                                            </div>)}
                                                            {/* Rating */}
                                                {offre.etat && offre.etat !== "0" && (
                                                    <div className="absolute bottom-4 left-4 flex items-center bg-black/50 text-white text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                        <FiStar className="text-yellow-400 mr-1" />
                                                        {offre.etat}/10
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

                {/* Show More Button */}
                {visibleCount < rows.length && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mt-12"
                    >
                        <button
                            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-all shadow-lg hover:shadow-xl"
                            onClick={() => setVisibleCount((prev) => prev + 1)}
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