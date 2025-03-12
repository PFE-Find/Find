'use client';

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import "../../globals.css";

const propertyTypes = [
  { id: 1, name: "Terrain agricole", icon: "/assets/icons/terrain-a-vendre.png" },
  { id: 2, name: "Matériel agricole", icon: "/assets/icons/machine-a-grue.png" },
  { id: 3, name: "Ferme", icon: "/assets/icons/field.png" },
  { id: 4, name: "Terrain résidentiel", icon: "/assets/icons/broche-de-localisation.png" },
];

export default function Example() {
  const [progress, setProgress] = useState(15); 
  const [selected, setSelected] = useState<number | null>(null); 

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Section */}
      <div className="p-4 m-5">
        <button className="px-4 py-2 border rounded-lg text-green-600 border-green-600 hover:bg-green-100 float-right">
          Quitter
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex-col place-content-center container mx-auto ">
        <h2 className="text-2xl font-semibold text-center mb-10">
        Passons maintenant à la description de votre bien
        </h2>

        {/* Centering the Cards */}
        <div className="md:grid-cols-4 gap-6 flex flex-row flex justify-center">
          {propertyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelected(type.id)}
              className={`flex flex-col items-center justify-center p-4 border rounded-lg transition duration-200 w-40 h-32 
                ${selected === type.id ? "border-green-600 bg-green-100" : "border-gray-400 hover:bg-gray-100"}`}
            >
              <img src={type.icon} alt={type.name} className="w-12 h-12 mb-2" />
              <span className="text-sm">{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Range Input for Progress */}
      <div className="w-full mt-6">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, rgb(163, 165, 168) ${progress}%, rgb(219, 222, 228) ${progress}%)`,
          }}
          readOnly
        />
      </div>

      {/* Footer */}
      <div className="px-10 py-4 flex justify-between items-center">
        <a href="#" className="text-gray-600 underline hover:text-green-600">
          Retour
        </a>
        <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
          Commencer
        </button>
      </div>
    </div>
  );
}
