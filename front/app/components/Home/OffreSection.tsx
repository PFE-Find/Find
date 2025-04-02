

"use client";

import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

const offresData = [
  { id: 1, title: "Terrain à Bizerte", size: "5 hectares", type: "Agricole", price: "250 000 TND", image: "/assets/photo.jpg", category: "Terrain" },
  { id: 2, title: "Terrain à Tunis", size: "3 hectares", type: "Résidentiel", price: "500 000 TND", image: "/assets/photo2.jpg", category: "Terrain" },
  { id: 3, title: "Ferme à Nabeul", size: "10 hectares", type: "Agricole", price: "1 000 000 TND", image: "/assets/photo3.jpg", category: "Terrain" },
  { id: 4, title: "Terrain à Sousse", size: "2 hectares", type: "Commercial", price: "600 000 TND", image: "/assets/photo4.jpg", category: "Terrain" },
  { id: 5, title: "Terrain à Sfax", size: "4 hectares", type: "Industriel", price: "750 000 TND", image: "/assets/photo6.jpg", category: "Terrain" },
  { id: 6, title: "Terrain à Gabès", size: "5 hectares", type: "Agricole", price: "350 000 TND", image: "/assets/photo7.jpg", category: "Terrain" },
  { id: 7, title: "Terrain à Mahdia", size: "6 hectares", type: "Touristique", price: "900 000 TND", image: "/assets/photo.jpg", category: "Terrain" },
  { id: 8, title: "Terrain à Djerba", size: "8 hectares", type: "Résidentiel", price: "1 200 000 TND", image: "/assets/photo2.jpg", category: "Terrain" },
  { id: 9, title: "Ferme à Nabeul", size: "10 hectares", type: "Agricole", price: "1 000 000 TND", image: "/assets/photo3.jpg", category: "Terrain" },
  { id: 10, title: "Terrain à Sousse", size: "2 hectares", type: "Commercial", price: "600 000 TND", image: "/assets/photo4.jpg", category: "Terrain" },
  { id: 11, title: "Terrain à Sfax", size: "4 hectares", type: "Industriel", price: "750 000 TND", image: "/assets/photo6.jpg", category: "Terrain" },
  { id: 12, title: "Terrain à Gabès", size: "5 hectares", type: "Agricole", price: "350 000 TND", image: "/assets/photo7.jpg", category: "Terrain" },
  // Add more offers here...

  // Matériel Offers (New Category)
  { id: 13, title: "Tracteur John Deere", size: "150 HP", type: "Agricole", price: "120 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  { id: 14, title: "Moissonneuse-batteuse Case IH", size: "400 HP", type: "Agricole", price: "250 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  { id: 15, title: "Générateur électrique Diesel", size: "50 kVA", type: "Énergie", price: "30 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  { id: 16, title: "Pelle hydraulique Caterpillar", size: "25 tons", type: "Construction", price: "180 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  { id: 17, title: "Chariot élévateur Toyota", size: "3 tons", type: "Logistique", price: "40 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  { id: 18, title: "Compresseur d'air Atlas Copco", size: "200 CFM", type: "Industrie", price: "50 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  { id: 19, title: "Coffret de soudure Lincoln Electric", size: "300A", type: "Industrie", price: "15 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  { id: 20, title: "Générateur solaire SunPower", size: "5 kW", type: "Énergie", price: "25 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  // More Matériel Offers...
  { id: 21, title: "Terrain à Bizerte", size: "5 hectares", type: "Agricole", price: "250 000 TND", image: "/assets/photo.jpg", category: "Terrain" },
  { id: 22, title: "Terrain à Tunis", size: "3 hectares", type: "Résidentiel", price: "500 000 TND", image: "/assets/photo2.jpg", category: "Terrain" },
  { id: 23, title: "Ferme à Nabeul", size: "10 hectares", type: "Agricole", price: "1 000 000 TND", image: "/assets/photo3.jpg", category: "Terrain" },
  { id: 24, title: "Terrain à Sousse", size: "2 hectares", type: "Commercial", price: "600 000 TND", image: "/assets/photo4.jpg", category: "Terrain" },
  { id: 25, title: "Terrain à Sfax", size: "4 hectares", type: "Industriel", price: "750 000 TND", image: "/assets/photo6.jpg", category: "Terrain" },
  { id: 26, title: "Terrain à Gabès", size: "5 hectares", type: "Agricole", price: "350 000 TND", image: "/assets/photo7.jpg", category: "Terrain" },
  { id: 27, title: "Terrain à Mahdia", size: "6 hectares", type: "Touristique", price: "900 000 TND", image: "/assets/photo.jpg", category: "Terrain" },
  { id: 28, title: "Terrain à Djerba", size: "8 hectares", type: "Résidentiel", price: "1 200 000 TND", image: "/assets/photo2.jpg", category: "Terrain" },
  { id: 29, title: "Ferme à Nabeul", size: "10 hectares", type: "Agricole", price: "1 000 000 TND", image: "/assets/photo3.jpg", category: "Terrain" },
  { id: 30, title: "Terrain à Sousse", size: "2 hectares", type: "Commercial", price: "600 000 TND", image: "/assets/photo4.jpg", category: "Terrain" },
  { id: 31, title: "Terrain à Sfax", size: "4 hectares", type: "Industriel", price: "750 000 TND", image: "/assets/photo6.jpg", category: "Terrain" },
  { id: 32, title: "Terrain à Gabès", size: "5 hectares", type: "Agricole", price: "350 000 TND", image: "/assets/photo7.jpg", category: "Terrain" },
  // Add more offers here...

  // Matériel Offers (New Category)
  { id: 33, title: "Tracteur John Deere", size: "150 HP", type: "Agricole", price: "120 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  { id: 34, title: "Moissonneuse-batteuse Case IH", size: "400 HP", type: "Agricole", price: "250 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  { id: 35, title: "Générateur électrique Diesel", size: "50 kVA", type: "Énergie", price: "30 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  { id: 36, title: "Pelle hydraulique Caterpillar", size: "25 tons", type: "Construction", price: "180 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  { id: 37, title: "Chariot élévateur Toyota", size: "3 tons", type: "Logistique", price: "40 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  { id: 38, title: "Compresseur d'air Atlas Copco", size: "200 CFM", type: "Industrie", price: "50 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  { id: 39, title: "Coffret de soudure Lincoln Electric", size: "300A", type: "Industrie", price: "15 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  { id: 240, title: "Générateur solaire SunPower", size: "5 kW", type: "Énergie", price: "25 000 TND", image: "/assets/photo.jpg", category: "Matériel" },
  // More Matériel Offers...
  { id: 41, title: "Terrain à Bizerte", size: "5 hectares", type: "Agricole", price: "250 000 TND", image: "/assets/photo.jpg", category: "Terrain" },
  { id: 42, title: "Terrain à Tunis", size: "3 hectares", type: "Résidentiel", price: "500 000 TND", image: "/assets/photo2.jpg", category: "Terrain" },
  { id: 43, title: "Ferme à Nabeul", size: "10 hectares", type: "Agricole", price: "1 000 000 TND", image: "/assets/photo3.jpg", category: "Terrain" },
  { id: 44, title: "Terrain à Sousse", size: "2 hectares", type: "Commercial", price: "600 000 TND", image: "/assets/photo4.jpg", category: "Terrain" },
  { id: 45, title: "Terrain à Sfax", size: "4 hectares", type: "Industriel", price: "750 000 TND", image: "/assets/photo6.jpg", category: "Terrain" },
  { id: 46, title: "Terrain à Gabès", size: "5 hectares", type: "Agricole", price: "350 000 TND", image: "/assets/photo7.jpg", category: "Terrain" },
  { id: 47, title: "Terrain à Mahdia", size: "6 hectares", type: "Touristique", price: "900 000 TND", image: "/assets/photo.jpg", category: "Terrain" },
  { id: 48, title: "Terrain à Djerba", size: "8 hectares", type: "Résidentiel", price: "1 200 000 TND", image: "/assets/photo2.jpg", category: "Terrain" },
  { id: 49, title: "Ferme à Nabeul", size: "10 hectares", type: "Agricole", price: "1 000 000 TND", image: "/assets/photo3.jpg", category: "Terrain" },
  { id: 50, title: "Terrain à Sousse", size: "2 hectares", type: "Commercial", price: "600 000 TND", image: "/assets/photo4.jpg", category: "Terrain" },
  { id: 51, title: "Terrain à Sfax", size: "4 hectares", type: "Industriel", price: "750 000 TND", image: "/assets/photo6.jpg", category: "Terrain" },
  { id: 52, title: "Terrain à Gabès", size: "5 hectares", type: "Agricole", price: "350 000 TND", image: "/assets/photo7.jpg", category: "Terrain" },
  // Add more offers here...

  // Matériel Offers (New Category)
 
];

export default function Offres() {
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [scrollIndex, setScrollIndex] = useState(0);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredOffers =
    selectedCategory === "all"
      ? offresData
      : offresData.filter((offer) => offer.category === selectedCategory);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    setScrollIndex((prev) => Math.max(0, prev - 3));
  };

  const scrollRight = () => {
    const maxIndex = Math.ceil(filteredOffers.length / 7) - 1;
    setScrollIndex((prev) => Math.min(maxIndex, prev + 3));
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollIndex * 224, // Adjust for item width + margin (220px + 4px)
        behavior: "smooth",
      });
    }
  }, [scrollIndex]);

  return (
    <div>
      {/* <h2 className="text-4xl font-serif  text-center mb-16">
        Avec <span style={{ color: 'oklch(0.596 0.145 163.225)' }}>Find</span>, achetez et vendez en toute simplicité
      </h2> */}

      <div className="relative flex items-center border-2 border-gray-200 shadow-xl mx-auto max-w-screen-2xl ">

        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 p-2 rounded-full shadow-lg z-10"
        >
          <span className="text-lg">←</span>
        </button>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-hidden w-full py-4"
        >
          <div className="flex space-x-4">
            {filteredOffers.map((offre) => (
              <div key={offre.id} className="relative w-[250px] flex-shrink-0">
                <div className="shadow-xl bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 p-4">
                  <a href="#">
                    <img
                      className="rounded-xl w-full h-40 object-cover"
                      src={offre.image}
                      alt={offre.title}
                    />
                  </a>

                  {/* Title Badge */}
                  <div className="absolute w-50 top-5 left-5 bg-white text-gray-900 dark:bg-gray-700 dark:text-white px-3 py-1 rounded-lg text-xs font-bold shadow">
                    {offre.title}
                  </div>



                  {/* Offer Details */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {offre.size}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {offre.type}
                    </p>
                    <a href="#">
                      <h5 className="mt-2 text-sm font-bold text-gray-900 dark:text-white">
                        {offre.price}
                      </h5>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 p-2 rounded-full shadow-lg z-10"
        >
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
}
