// app/page.tsx
'use client';

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheck, FiMapPin, FiShield, FiTrendingUp, FiHeadphones, FiBarChart2, FiEye } from "react-icons/fi";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import dynamic from 'next/dynamic'; 
import Image from 'next/image';
import OffreSearch from "../components/Search";
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash'; 
import { useSession } from "next-auth/react";

const Offres = dynamic(() => import("@/app/components/Home/OffreSection"), {
  loading: () => <p>Loading Offers...</p>,
  ssr: false,
});

const Comments = dynamic(() => import("./comments"), {
    ssr: false, 
    loading: () => <p>Loading Comments...</p>, 
});

const ChatBot = dynamic(() => import("../components/Chat/Chatbot"), {
  ssr: false, 
  loading: () => <p>Loading ChatBot...</p>, 
});


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


export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [priceRange, setPriceRange] = useState<[number | null, number | null]>([null, null]);
  const [surfaceRange, setSurfaceRange] = useState<[number | null, number | null]>([null, null]);
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [surfaceFilterEnabled, setSurfaceFilterEnabled] = useState(false);
   const { data: session } = useSession();

  const router = useRouter();

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      router.push(`/OffrePage?search=${encodeURIComponent(query)}`); 
    }, 300), 
    [router]
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    router.push(`/OffrePage?category=${encodeURIComponent(category)}`); 
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
    if (filters.locationFilter) params.append('location', encodeURIComponent(filters.locationFilter)); 
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

  const features = [
    {
      icon: <FiMapPin className="w-6 h-6 text-teal-600" />,
      title: "Trouvez les meilleures opportunités",
      description: "Explorez notre sélection de terres agricoles et d'équipements de haute qualité, mis à jour régulièrement."
    },
   
  ];

  const cards = [
    {
      image: "/assets/home1.jpg",
      sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      title: "Publiez votre annonce en quelques clics",
      description: "Ajoutez facilement une annonce avec une description détaillée, des photos et un prix."
    },
    
  ];

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
        <div className="max-w-full mx-auto text-center">
          <motion.h1
            variants={item}
            className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6"
          >
            Facilitons ensemble le commerce <br />
            <span className="text-teal-600">Agricole</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Finder propose une plateforme intelligente pour faciliter l'achat et la vente de terres agricoles.
          </motion.p>

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
      </motion.section>

      {/* Offers Section (Dynamically Loaded) */}
      <div className="bg-white">
        <Offres />
      </div>

      <motion.div variants={item} className="text-center mb-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-16">
          Pourquoi choisir <span className="text-teal-600">Find</span> ?
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Une plateforme complète pour tous vos besoins agricoles
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-12">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative rounded-xl overflow-hidden shadow-xl h-[500px]"
        >
          <Image
            src="/assets/home_1.jpeg"
            alt="Agriculture en Tunisie"
            fill
            className="object-cover"
            priority // Use priority for LCP image
            quality={75} // Adjust quality as needed
          />
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
            Connectez-vous aux meilleures terres agricoles de Tunisie
          </h2>

          <div className="space-y-4">
            {[
              {
                icon: <FiCheck className="text-teal-500 mt-1 mr-3 flex-shrink-0" />,
                text: "Plateforme intelligente pour l'achat/vente de terres"
              },
              // ... other features
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.4 }}
                viewport={{ once: true }}
                className="flex items-start"
              >
                {item.icon}
                <p className="text-gray-600 text-lg">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <Link href="/offres" passHref>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-all text-lg"
              >
                Commencer maintenant
                <FiArrowRight className="inline ml-2" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-teal-600 py-16 text-white"
      >
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à transformer votre expérience agricole ?</h2>
          <p className="text-lg mb-8">Rejoignez des milliers d'agriculteurs et d'investisseurs qui font confiance à Find</p>
          {session ? (
  // Show these when user is logged in
  <div className="flex flex-col sm:flex-row justify-center gap-4">
    <Link href="/profile">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-3 bg-white text-teal-600 rounded-lg font-medium hover:bg-gray-100 transition-all"
      >
        Mon Tableau de Bord
      </motion.button>
    </Link>
    <Link href="/FormPages">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-teal-700 transition-all"
      >
        Publier une Annonce
      </motion.button>
    </Link>
  </div>
) : (
  // Show these when user is not logged in
  <div className="flex flex-col sm:flex-row justify-center gap-4">
    <Link href="/signup">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-3 bg-white text-teal-600 rounded-lg font-medium hover:bg-gray-100 transition-all"
      >
        S'inscrire gratuitement
      </motion.button>
    </Link>
    <Link href="/aboutUs">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-teal-700 transition-all"
      >
        À propos
      </motion.button>
    </Link>
  </div>
)}
          {/* <div className="flex flex-col sm:flex-row justify-center gap-4">

            <Link href="/inscription">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-teal-600 rounded-lg font-medium hover:bg-gray-100 transition-all"
              >
                S'inscrire gratuitement
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-teal-700 transition-all"
              >
                Nous contacter
              </motion.button>
            </Link>
          </div> */}
        </div>
      </motion.section>

      {/* Comments Section (Dynamically Loaded) */}
      <div className="p-5 m-5">
        <Comments />
      </div>

      <Footer />

      {/* ChatBot (Dynamically Loaded) */}
      <ChatBot />
    </div>
  );
}