'use client';
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiPlay, FiCheck, FiMapPin, FiShield, FiTrendingUp, FiHeadphones, FiBarChart2, FiEye } from "react-icons/fi";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import Offres from "@/app/components/Home/OffreSection";
import Image from 'next/image';
import OffreSearch from "../components/Search"; // Import OffreSearch
import { useRouter } from 'next/navigation'; // Import useRouter
import { useState } from 'react';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } }
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -100 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 100 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
};

export default function Home() {
  const features = [
    {
      icon: <FiMapPin className="w-6 h-6 text-teal-600" />,
      title: "Trouvez les meilleures opportunités",
      description: "Explorez notre sélection de terres agricoles et d'équipements de haute qualité, mis à jour régulièrement."
    },
    {
      icon: <FiShield className="w-6 h-6 text-teal-600" />,
      title: "Transaction sécurisée",
      description: "Nous garantissons des transactions sécurisées avec des fournisseurs vérifiés et un processus fiable."
    },
    {
      icon: <FiTrendingUp className="w-6 h-6 text-teal-600" />,
      title: "Gestion simplifiée",
      description: "Plateforme tout-en-un pour gérer vos investissements agricoles : recherche, évaluation et suivi."
    },
    {
      icon: <FiHeadphones className="w-6 h-6 text-teal-600" />,
      title: "Accompagnement personnalisé",
      description: "Bénéficiez d'un accompagnement dédié et d'analyses IA pour maximiser vos investissements."
    }
  ];

  const cards = [
    {
      image: "/assets/home1.jpg",
      title: "Publiez votre annonce en quelques clics",
      description: "Ajoutez facilement une annonce avec une description détaillée, des photos et un prix."
    },
    {
      image: "/assets/home2.jpg",
      title: "Trouvez rapidement des acheteurs ou vendeurs",
      description: "Grâce à notre système de recherche avancé, filtrez les annonces selon vos critères."
    },
    {
      image: "/assets/home4.jpg",
      title: "Discutez directement avec les intéressés",
      description: "Entrez en contact via notre messagerie intégrée pour négocier et obtenir des informations."
    }
  ];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [priceRange, setPriceRange] = useState<[number | null, number | null]>([null, null]);
  const [surfaceRange, setSurfaceRange] = useState<[number | null, number | null]>([null, null]);
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [surfaceFilterEnabled, setSurfaceFilterEnabled] = useState(false);

  const router = useRouter();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/OffrePage?search=${query}`);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    router.push(`/OffrePage?category=${category}`);
  };

  const applyFilters = (filters: any) => {
    setPriceRange(filters.priceRange);
    setSurfaceRange(filters.surfaceRange);
    setLocationFilter(filters.locationFilter);
    setSurfaceFilterEnabled(filters.surfaceFilterEnabled);
    setFiltersApplied(true);

    const params = new URLSearchParams();
    if (filters.priceRange[0] !== null) params.append('priceMin', filters.priceRange[0].toString());
    if (filters.priceRange[1] !== null) params.append('priceMax', filters.priceRange[1].toString());
    if (filters.surfaceRange[0] !== null) params.append('surfaceMin', filters.surfaceRange[0].toString());
    if (filters.surfaceRange[1] !== null) params.append('surfaceMax', filters.surfaceRange[1].toString());
    if (filters.locationFilter) params.append('location', filters.locationFilter);
    if (filters.surfaceFilterEnabled) params.append('surfaceEnabled', 'true');
    router.push(`/OffrePage?${params.toString()}`);
  };

  const resetFilters = () => {
    setPriceRange([null, null]);
    setSurfaceRange([null, null]);
    setLocationFilter("");
    setSearchQuery("");
    setSelectedCategory("all");
    setFiltersApplied(false);
    setSurfaceFilterEnabled(false);
    router.push('/OffrePage');
  };

  return (
    <div className="bg-gray-50">
      <Nav />

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={container}
        className="relative bg-gradient-to-b from-teal-600 to-white pt-20 md:pt-20 px-4"
      >

<motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
        className="py-20 bg-white bg-opacity-70 rounded-xl"
      >
        <div className="max-w-[80%] mx-auto px-4">
          <motion.div variants={item} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Avec <span className="text-teal-600">Find</span>, achetez et vendez en toute simplicité
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une expérience utilisateur intuitive pour toutes vos transactions agricoles
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                variants={scaleUp}
                className=" rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                <img
                  className="w-full h-64 object-cover"
                  src={card.image}
                  alt={card.title}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{card.title}</h3>
                  <p className="text-gray-600">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      </motion.section>
    
      
      
      


      {/* Cards Section */}
      

      {/* Map Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white bg-opacity-70  py-12"
      >
        <div className="max-w-[80%] mx-auto px-4">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              className="w-full h-96"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2637604.364951658!2d8.5619416!3d34.2269715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd8a715b5f857f%3A0xc9d1e9c6971b7d9b!2sTunisie!5e0!3m2!1sfr!2stn!4v1620000000000!5m2!1sfr!2stn"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </motion.section>
      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        variants={container}
        className="py-20 bg-white"
      >
        <div className="max-w-[90%] mx-auto px-4">


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}