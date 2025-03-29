import React, { useState, useEffect } from "react";

export default function Page13({ data, updateFields }) {
    const [etat, setEtat] = useState(data.etat || 0); // Initialize from data
    const [unit, setUnit] = useState(data.unit || "");
    const [rating, setRating] = useState(data.etat || 0); // Persistent Rating

    useEffect(() => {
        setRating(data.etat || 0); // Restore rating when coming back
    }, [data.etat]);

    const handleClick = (value: number) => {
        setRating(value);
        setEtat(value);
        updateFields({ ...data, etat: value }); // Save to parent
    };

    return (
        <div className="flex flex-col items-center mt-40">
            <h2 className="text-lg font-bold mb-4">Évaluez l'état de votre bien</h2>
            <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                    
                        key={value}
                        onClick={() => handleClick(value)}
                        className={`px-6 py-4 rounded-md ${rating === value ? "bg-green-500 text-white" : "bg-gray-200"}`}
                    >
                        {value}
                    </button>
                ))}
            </div>
            <p className="mt-2 text-gray-600">Votre note: {rating}</p>
        </div>
    );
}
