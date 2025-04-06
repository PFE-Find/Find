"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import eventService from "../../services/Offres";

export default function Offres() {
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [offres, setOffres] = useState<any[]>([]); // Define your data structure if known

  const scrollItemsPerRow = 3; // Number of cards to scroll
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchOffres() {
      try {
        const data = await eventService.getOffres1();
        setOffres(data);
        console.log("Fetched offres:", data);
      } catch (error) {
        console.error("Error fetching offres:", error);
      }
    }
    fetchOffres();
  }, []);

  const filteredOffers =
    selectedCategory === "all"
      ? offres
      : offres.filter((offer) => offer.propertyType === selectedCategory);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollDistance = 350;
      const scrollDuration = 1000; // adjust this value to change the scrolling speed
      const startTime = performance.now();
      const startScrollLeft = scrollContainerRef.current.scrollLeft;

      function animateScroll() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = elapsed / scrollDuration;
        const newScrollLeft = startScrollLeft - scrollDistance * progress;

        if (progress < 1) {
          scrollContainerRef.current.scrollLeft = newScrollLeft;
          requestAnimationFrame(animateScroll);
        } else {
          scrollContainerRef.current.scrollLeft = startScrollLeft - scrollDistance;
        }
      }

      animateScroll();
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollDistance = 350;
      const scrollDuration = 1000; // adjust this value to change the scrolling speed
      const startTime = performance.now();
      const startScrollLeft = scrollContainerRef.current.scrollLeft;

      function animateScroll() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = elapsed / scrollDuration;
        const newScrollLeft = startScrollLeft + scrollDistance * progress;

        if (progress < 1) {
          scrollContainerRef.current.scrollLeft = newScrollLeft;
          requestAnimationFrame(animateScroll);
        } else {
          scrollContainerRef.current.scrollLeft = startScrollLeft + scrollDistance;
        }
      }

      animateScroll();
    }
  };

  return (
    <div>
      <div className="relative flex items-center   shadow-xl mx-auto max-w-screen-2xl">
        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute bg-gray-400 left-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 p-2 rounded-full shadow-lg z-10"
        >
          <span className="text-lg">←</span>
        </button>

        {/* Scrollable Content */}
        <div ref={scrollContainerRef} className="overflow-x-hidden  w-full py-4">
          <div className="flex space-x-4">
            {filteredOffers.map((offre) => (
              <div key={offre._id} className="relative w-[350px]  flex-shrink-0 ">
                <Link key={offre._id} href={`/OffreDetail/${offre._id}`} prefetch={false}>

                  <div className="shadow-lg h-[350px] bg-white border border-gray-200  dark:bg-gray-800 dark:border-gray-700 p-4 hover:bg-gray-100 transition">

                    <img
                      className="rounded-xl w-full h-52 object-cover"
                      src={offre.images?.[0]?.path || "/default-image.jpg"} // Default image if none exists
                      alt={offre.titre}
                    />


                    {/* Title Badge */}
                    <div className="absolute w-50 top-5 left-5 bg-white text-gray-900 dark:bg-gray-700 dark:text-white px-3 py-1 rounded-lg text-xs font-bold shadow">
                      {offre.titre}
                    </div>

                    {/* Offer Details */}
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 dark:text-gray-400">
                        {offre.Superficie} {offre.unit}
                      </p>
                      {offre.etat && offre.etat !== 0 && (
                        <p className="text-sm text-gray-700 dark:text-gray-400">{offre.etat}/10</p>
                      )}
                      <p className="text-sm text-gray-700 dark:text-gray-400">{offre.propertyType}</p>

                      <h5 className="mt-2 text-sm font-bold text-gray-900 dark:text-white">
                        {offre.prix} TND
                      </h5>

                    </div>
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