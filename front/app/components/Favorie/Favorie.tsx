"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

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
];

export default function Favorie() {
    const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
    const [visibleCount, setVisibleCount] = useState(5);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const toggleFavorite = (id: number) => {
        setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Splitting the offers into rows of 7 cards
    const rows = [];
    for (let i = 0; i < offresData.length; i += 7) {
        rows.push(offresData.slice(i, i + 7));
    }

    // Filter offers based on selected category
    const filteredOffers = selectedCategory === "all"
        ? offresData
        : offresData.filter((offer) => offer.category === selectedCategory);

    return (
        <div>
            {/* Category Selection */}
            <div className="flex justify-center items-center mt-5 space-x-4">
                <a
                    href="#"
                    onClick={() => setSelectedCategory("Terrain")}
                    className="flex flex-col items-center text-center space-y-2"
                >
                    <img className="w-10 h-10 object-cover" src="/assets/icons/location.png" alt="Terrain" />
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white">Terrain</h5>
                </a>

                <div className="h-10 w-0.5 bg-gray-400 dark:bg-gray-600"></div>

                <a
                    href="#"
                    onClick={() => setSelectedCategory("Matériel")}
                    className="flex flex-col items-center text-center space-y-2"
                >
                    <img className="w-10 h-10 object-cover" src="/assets/icons/machine.png" alt="Matériel" />
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white">Matériel</h5>
                </a>

                <div className="h-10 w-0.5 bg-gray-400 dark:bg-gray-600"></div>

                {/* Default display all items */}
                <a
                    href="#"
                    onClick={() => setSelectedCategory("all")}
                    className="flex flex-col items-center text-center"
                >
                    <img className="w-6 h-6 object-cover" src="/assets/icons/select-all.png" alt="All" />
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white">Tous</h5>
                </a>
            </div>

            {/* Grid Layout */}
            <div className="p-4">
                {rows.slice(0, visibleCount).map((row, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-4">
                        {filteredOffers.slice(index * 7, (index + 1) * 7).map((offre) => (
                            <div key={offre.id} className="shadow-xl relative bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4 max-w-xs">
                                <a href="#">
                                    <img className="shadow-xl rounded-xl w-full h-40 object-cover" src={offre.image} alt={offre.title} />
                                </a>

                                {/* Title Badge */}
                                <div className="shadow-xl w-36 absolute top-5 left-5 bg-white text-gray-900 dark:bg-gray-700 dark:text-white px-3 py-1 rounded-lg text-xs font-bold shadow overflow-hidden text-ellipsis whitespace-nowrap max-h-9">
                                    {offre.title}
                                </div>


                                {/* Favorite Button */}
                                <button
                                    onClick={() => toggleFavorite(offre.id)}
                                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                                >
                                    <Heart className={`w-5 h-5 ${favorites[offre.id] ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
                                </button>

                                {/* Offer Details */}
                                <div className="mt-4">
                                    <p className="text-sm text-gray-700 dark:text-gray-400">{offre.size}</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">{offre.type}</p>
                                    <a href="#">
                                        <h5 className="mt-2 text-sm font-bold text-gray-900 dark:text-white">{offre.price}</h5>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Show More Button */}
            {visibleCount < rows.length && (
                <div className="text-center m-4">
                    <h5 className="mt-2 text-md font-bold text-gray-900 dark:text-white m-5">Poursuivez l'exploration plus</h5>
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
