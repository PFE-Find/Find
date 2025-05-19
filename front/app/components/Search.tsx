"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, Filter, RefreshCw, Check, DollarSign, Ruler, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OffreSearchProps {
    onSearch: (query: string) => void;
    onCategoryChange: (category: string) => void;
    selectedCategory: string;
    onFiltersApply: (filters: any) => void;
    resetFilters: () => void;
    filtersApplied: boolean;
    priceRange: [number | null, number | null];
    setPriceRange: React.Dispatch<React.SetStateAction<[number | null, number | null]>>;
    surfaceRange: [number | null, number | null];
    setSurfaceRange: React.Dispatch<React.SetStateAction<[number | null, number | null]>>;
    locationFilter: string;
    setLocationFilter: React.Dispatch<React.SetStateAction<string>>;
    surfaceFilterEnabled: boolean;
    setSurfaceFilterEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const OffreSearch: React.FC<OffreSearchProps> = ({
    onSearch,
    onCategoryChange,
    selectedCategory,
    onFiltersApply,
    resetFilters,
    filtersApplied,
    priceRange,
    setPriceRange,
    surfaceRange,
    setSurfaceRange,
    locationFilter,
    setLocationFilter,
    surfaceFilterEnabled,
    setSurfaceFilterEnabled
}) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSuggestions(["Terrain agricole", "Matériel neuf", "Autre suggestion"]);

        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        setShowSuggestions(value.length > 0);
        onSearch(value);
    };

    const selectSuggestion = (suggestion: string) => {
        setSearchQuery(suggestion);
        onSearch(suggestion);
        setShowSuggestions(false);
    };

    const applyFilters = () => {
        onFiltersApply({ priceRange, surfaceRange, locationFilter, surfaceFilterEnabled });
        setShowFilters(false);
    };

    const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? null : Number(e.target.value);
        setPriceRange([value, priceRange[1]]);
    };

    const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? null : Number(e.target.value);
        setPriceRange([priceRange[0], value]);
    };

    const handleSurfaceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? null : Number(e.target.value);
        setSurfaceRange([value, surfaceRange[1]]);
    };

    const handleSurfaceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? null : Number(e.target.value);
        setSurfaceRange([surfaceRange[0], value]);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const filterPanelVariants = {
        hidden: { 
            opacity: 0,
            height: 0,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            height: "auto",
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            height: 0,
            scale: 0.95,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    const filterItemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const suggestionItemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.2
            }
        })
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center p-4 sm:p-8 md:p-16"
        >
            <div className="w-full max-w-4xl relative" ref={searchRef}>
                <motion.div 
                    whileHover={{ scale: 1.005 }}
                    className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg sm:shadow-xl overflow-hidden"
                >
                    <div className="flex items-center px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700">
                        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3" />
                        <motion.input
                            type="search"
                            id="property-search"
                            className="flex-grow bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base md:text-lg"
                            placeholder="Rechercher des terrains, matériels..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={() => setShowSuggestions(true)}
                            required
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowFilters(!showFilters)}
                            className={`ml-2 sm:ml-4 px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center transition-colors text-sm sm:text-base ${showFilters ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        >
                            <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Filtres</span>
                        </motion.button>
                    </div>

                    {/* Suggestions de recherche */}
                    <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white dark:bg-gray-800 shadow-lg rounded-b-xl overflow-hidden"
                            >
                                <ul className="py-1 sm:py-2">
                                    {suggestions
                                        .filter(suggestion =>
                                            suggestion.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .slice(0, 5)
                                        .map((suggestion, index) => (
                                            <motion.li
                                                key={index}
                                                custom={index}
                                                initial="hidden"
                                                animate="visible"
                                                variants={suggestionItemVariants}
                                                className="px-4 py-1 sm:px-6 sm:py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                                onClick={() => selectSuggestion(suggestion)}
                                            >
                                                <div className="flex items-center">
                                                    <Search className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-2 sm:mr-3" />
                                                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{suggestion}</span>
                                                </div>
                                            </motion.li>
                                        ))
                                    }
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Panneau de filtres avancés */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={filterPanelVariants}
                            className="mt-3 sm:mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                            <div className="p-4 sm:p-6">
                                {/* En-tête */}
                                <motion.div 
                                    variants={filterItemVariants}
                                    className="flex justify-between items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-700"
                                >
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <motion.div 
                                            whileHover={{ rotate: 15 }}
                                            className="p-1 sm:p-2 rounded-lg bg-green-50 dark:bg-gray-700"
                                        >
                                            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                                        </motion.div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Filtres</h3>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={resetFilters}
                                        className="flex items-center text-xs sm:text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                                    >
                                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                        Réinitialiser
                                    </motion.button>
                                </motion.div>

                                {/* Grille de filtres */}
                                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                                    {/* Plage de prix */}
                                    <motion.div 
                                        variants={filterItemVariants}
                                        className="space-y-2 sm:space-y-4"
                                    >
                                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                                            <motion.div 
                                                animate={{ rotate: [0, 10, 0] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="mr-2"
                                            >
                                                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                                            </motion.div>
                                            <span className="text-sm sm:text-base font-medium">Plage de prix (TND)</span>
                                        </div>

                                        <div className="flex items-center space-x-2 sm:space-x-4">
                                            <div className="flex-1">
                                                <label className="block text-xs sm:text-sm text-gray-500 mb-1">Minimum</label>
                                                <motion.div whileHover={{ scale: 1.01 }}>
                                                    <input
                                                        type="number"
                                                        value={priceRange[0] === null ? '' : priceRange[0]}
                                                        onChange={handlePriceMinChange}
                                                        className="w-full px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                                                        placeholder="Min"
                                                        min="0"
                                                    />
                                                </motion.div>
                                            </div>

                                            <motion.div 
                                                animate={{ x: [-2, 2, -2] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                className="flex items-center justify-center pt-4 sm:pt-5"
                                            >
                                                <span className="text-gray-400 text-sm">—</span>
                                            </motion.div>

                                            <div className="flex-1">
                                                <label className="block text-xs sm:text-sm text-gray-500 mb-1">Maximum</label>
                                                <motion.div whileHover={{ scale: 1.01 }}>
                                                    <input
                                                        type="number"
                                                        value={priceRange[1] === null ? '' : priceRange[1]}
                                                        onChange={handlePriceMaxChange}
                                                        className="w-full px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                                                        placeholder="Max"
                                                        min={priceRange[0] !== null ? priceRange[0] + 1 : undefined}
                                                    />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Superficie - Conditionnel */}
                                    {selectedCategory !== "Material" && (
                                        <motion.div 
                                            variants={filterItemVariants}
                                            className="space-y-2 sm:space-y-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                                    <motion.div 
                                                        whileHover={{ rotate: 90 }}
                                                        transition={{ type: "spring" }}
                                                        className="mr-2"
                                                    >
                                                        <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                                                    </motion.div>
                                                    <span className="text-sm sm:text-base font-medium">Superficie (m²)</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={surfaceFilterEnabled}
                                                        onChange={() => setSurfaceFilterEnabled(!surfaceFilterEnabled)}
                                                    />
                                                    <motion.div 
                                                        whileTap={{ scale: 0.9 }}
                                                        className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 transition-colors"
                                                    >
                                                        <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 sm:h-5 sm:w-5 transition-transform ${surfaceFilterEnabled ? 'translate-x-4 sm:translate-x-5' : ''}`}></div>
                                                    </motion.div>
                                                </label>
                                            </div>

                                            <AnimatePresence>
                                                {surfaceFilterEnabled && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="space-y-2 sm:space-y-4"
                                                    >
                                                        <div className="flex items-center space-x-2 sm:space-x-4">
                                                            <div className="flex-1">
                                                                <label className="block text-xs sm:text-sm text-gray-500 mb-1">Minimum</label>
                                                                <motion.div whileHover={{ scale: 1.01 }}>
                                                                    <input
                                                                        type="number"
                                                                        value={surfaceRange[0] === null ? '' : surfaceRange[0]}
                                                                        onChange={handleSurfaceMinChange}
                                                                        className="w-full px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                                                                        placeholder="Min"
                                                                        min="0"
                                                                    />
                                                                </motion.div>
                                                            </div>

                                                            <motion.div 
                                                                animate={{ x: [-2, 2, -2] }}
                                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                                className="flex items-center justify-center pt-4 sm:pt-5"
                                                            >
                                                                <span className="text-gray-400 text-sm">—</span>
                                                            </motion.div>

                                                            <div className="flex-1">
                                                                <label className="block text-xs sm:text-sm text-gray-500 mb-1">Maximum</label>
                                                                <motion.div whileHover={{ scale: 1.01 }}>
                                                                    <input
                                                                        type="number"
                                                                        value={surfaceRange[1] === null ? '' : surfaceRange[1]}
                                                                        onChange={handleSurfaceMaxChange}
                                                                        className="w-full px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                                                                        placeholder="Max"
                                                                        min={surfaceRange[0] !== null ? surfaceRange[0] + 1 : undefined}
                                                                    />
                                                                </motion.div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    )}

                                    {/* Localisation */}
                                    <motion.div 
                                        variants={filterItemVariants}
                                        className="space-y-2 sm:space-y-4"
                                    >
                                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                                            <motion.div 
                                                whileHover={{ scale: 1.2 }}
                                                className="mr-2"
                                            >
                                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                                            </motion.div>
                                            <span className="text-sm sm:text-base font-medium">Localisation</span>
                                        </div>
                                        <motion.div whileHover={{ scale: 1.01 }}>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={locationFilter}
                                                    onChange={(e) => setLocationFilter(e.target.value)}
                                                    placeholder="Ville, région..."
                                                    className="block w-full pl-9 sm:pl-10 pr-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                                                />
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </div>

                                {/* Bouton Appliquer */}
                                <motion.div 
                                    variants={filterItemVariants}
                                    className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700"
                                >
                                    <motion.button
                                        whileHover={{ 
                                            scale: 1.02,
                                            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={applyFilters}
                                        className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-sm sm:text-base"
                                    >
                                        <motion.div 
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="flex items-center justify-center"
                                        >
                                            <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 inline" />
                                            Appliquer les filtres
                                        </motion.div>
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default OffreSearch;