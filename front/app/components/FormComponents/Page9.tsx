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
    <div className="flex flex-col bg-white">
     

      {/* Main Content */}
      <div className="flex-1 flex-col place-content-center container mx-auto mt-32">
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

      
    </div>
  );
}
