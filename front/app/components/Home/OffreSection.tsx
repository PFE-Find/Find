"use client";

import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import eventService from "../../services/Offres"


// Assuming you're fetching data from your backend endpoint
const fetchOffresData = async () => {
  const response = await fetch("/api/items"); // Replace with your actual API endpoint
  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return response.json();
};


export default function Offres() {
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [scrollIndex, setScrollIndex] = useState(0);
  const [offres, setOffres] = useState<any[]>([]); // You can specify a more specific type here based on your data

  useEffect(() => {
    async function fetchOffres() {
      try {
        const data = await eventService.getOffres();
        setOffres(data);
        console.log("Fetched offres:", data);
      } catch (error) {
        console.error("Error fetching offres:", error);
      }
    }
    fetchOffres();
  }, []);



  const filteredOffers = selectedCategory === "all"
    ? offres
    : offres.filter((offer) => offer.propertyType === selectedCategory);

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
      <div className="relative flex items-center border-2 border-gray-200 shadow-xl mx-auto max-w-screen-2xl">
        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 p-2 rounded-full shadow-lg z-10"
        >
          <span className="text-lg">←</span>
        </button>

        {/* Scrollable Content */}
        <div ref={scrollContainerRef} className="overflow-x-hidden w-full py-4">
          <div className="flex space-x-4">
            {filteredOffers.map((offre) => (
              <div key={offre._id} className="relative w-[250px] flex-shrink-0">
                <Link key={offre._id} href={`/OffreDetail/${offre._id}`} prefetch={false}>
                <div className="shadow-xl bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 p-4">
                  <a href="#">
                    <img
                      className="rounded-xl w-full h-40 object-cover"
                      src={offre.images?.[0]?.path || "/default-image.jpg"} // Default image if none exists
                      alt={offre.titre}
                    />
                  </a>

                  {/* Title Badge */}
                  <div className="absolute w-50 top-5 left-5 bg-white text-gray-900 dark:bg-gray-700 dark:text-white px-3 py-1 rounded-lg text-xs font-bold shadow">
                    {offre.titre}
                  </div>

                  {/* Offer Details */}
                  <div className="mt-4">
                  <p className="text-sm text-gray-700 dark:text-gray-400">{offre.Superficie} {offre.unit}</p>
                                    {offre.etat && offre.etat !== 0 && (
                                        <p className="text-sm text-gray-700 dark:text-gray-400">{offre.etat}/10</p>
                    )}
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {offre.propertyType}
                    </p>
                    <a href="#">
                      <h5 className="mt-2 text-sm font-bold text-gray-900 dark:text-white">
                        {offre.prix} TND
                      </h5>
                    </a>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(offre._id)}
                    className="absolute top-2 right-2 text-red-500"
                  >
                    <Heart className={`h-6 w-6 ${favorites[offre._id] ? "fill-red-500" : ""}`} />
                  </button>
                </div>
                </Link>
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
