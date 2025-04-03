"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import eventService from "../../services/Offres";
import router from "next/router";

export default function Offres() {
    const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
    const [visibleCount, setVisibleCount] = useState(5);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [offres, setOffres] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const toggleFavorite = (id: number) => {
        setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    };

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

    // Filter offers based on selected category and search query
    const filteredOffers = offres.filter((offer) => {
        const matchesCategory =
            selectedCategory === "all" || offer.propertyType === selectedCategory;
        const matchesSearch = offer.titre
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Splitting the offers into rows of 7 cards
    const rows = [];
    for (let i = 0; i < filteredOffers.length; i += 7) {
        rows.push(filteredOffers.slice(i, i + 7));
    }

    return (
        <div>
            <div className="flex flex-col divide-y-4 divide-y-reverse divide-gray-200">
                <div>
                    <form
                        className="max-w-md mx-auto shadow-xl rounded-3xl mt-20"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                            Search
                        </label>
                        <div className="relative">
                            <input
                                type="search"
                                id="default-search"
                                className="w-full p-4 pr-36 text-sm text-gray-900 border border-gray-300 rounded-3xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Recherche rapide de terres, équipements ou vendeurs"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="absolute end-1.5 bottom-1.5 inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-green-700 rounded-3xl border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-blue-700 dark:focus:ring-green-800"
                            >
                                <svg
                                    className="w-4 h-4 me-2"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                                Rechercher
                            </button>
                        </div>
                    </form>
                </div>
                <div className="mt-20 "></div>
            </div>
            {/* Category Selection */}
            <div className="flex justify-center items-center mt-5 mb-5 space-x-4">
                <a
                    href="#"
                    onClick={() => setSelectedCategory("Land")}
                    className="flex flex-col items-center text-center space-y-2"
                >
                    <img
                        className="w-10 h-10 object-cover"
                        src="/assets/icons/location.png"
                        alt="Terrain"
                    />
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                        Terrain
                    </h5>
                </a>

                <div className="h-10 w-0.5 bg-gray-400 dark:bg-gray-600"></div>

                <a
                    href="#"
                    onClick={() => setSelectedCategory("Material")}
                    className="flex flex-col items-center text-center space-y-2"
                >
                    <img
                        className="w-10 h-10 object-cover"
                        src="/assets/icons/machine.png"
                        alt="Matériel"
                    />
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                        Matériel
                    </h5>
                </a>

                <div className="h-10 w-0.5 bg-gray-400 dark:bg-gray-600"></div>

                <a
                    href="#"
                    onClick={() => setSelectedCategory("all")}
                    className="flex flex-col items-center text-center"
                >
                    <img
                        className="w-6 h-6 object-cover"
                        src="/assets/icons/select-all.png"
                        alt="All"
                    />
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                        Tous
                    </h5>
                </a>
            </div>
            {rows.slice(0, visibleCount).map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-4"
                >
                    {row.map((offre) => (
                        <Link
                            key={offre._id}
                            href={`/OffreDetail/${offre._id}`}
                            prefetch={false}
                        >
                            <div className="shadow-xl relative bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4 max-w-xs">
                                <img
                                    className="shadow-xl rounded-xl w-full h-40 object-cover"
                                    src={
                                        offre.images?.[0]?.path ||
                                        "/default-image.jpg"
                                    }
                                    alt={offre.titre}
                                />
                                {/* Title Badge */}
                                <div className="shadow-xl w-36 absolute top-5 left-5 bg-white text-gray-900 dark:bg-gray-700 dark:text-white px-3 py-1 rounded-lg text-xs font-bold shadow overflow-hidden text-ellipsis whitespace-nowrap max-h-9">
                                    {offre.titre}
                                </div>

                                {/* Favorite Button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent navigating when clicking the favorite button
                                        toggleFavorite(offre.id);
                                    }}
                                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                                >
                                    <Heart
                                        className={`w-5 h-5 ${
                                            favorites[offre.id]
                                                ? "text-red-500 fill-red-500"
                                                : "text-gray-400"
                                        }`}
                                    />
                                </button>

                                {/* Offer Details */}
                                <div className="mt-4">
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        {offre.Superficie} {offre.unit}
                                    </p>
                                    {offre.etat && offre.etat !== 0 && (
                                        <p className="text-sm text-gray-700 dark:text-gray-400">
                                            {offre.etat}/10 Etat
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        {offre.propertyType}
                                    </p>
                                    <h5 className="mt-2 text-sm font-bold text-gray-900 dark:text-white">
                                        {offre.prix} TND
                                    </h5>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ))}

            {/* Show More Button */}
            {visibleCount < rows.length && (
                <div className="text-center m-4">
                    <h5 className="mt-2 text-md font-bold text-gray-900 dark:text-white m-5">
                        Poursuivez l'exploration plus
                    </h5>
                    <button
                        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600"
                        onClick={() => setVisibleCount((prev) => prev + 5)}
                    >
                        Afficher plus
                    </button>
                </div>
            )}
        </div>
    );
}