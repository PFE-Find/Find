'use client';

import { useState } from 'react';

const propertyTypes = [
  { id: 1, name: "Terrain agricole", icon: "/assets/icons/terrain-a-vendre.png" },
  { id: 2, name: "Matériel agricole", icon: "/assets/icons/machine-a-grue.png" },
  { id: 3, name: "Ferme", icon: "/assets/icons/field.png" },
  { id: 4, name: "Terrain résidentiel", icon: "/assets/icons/broche-de-localisation.png" },
];

export default function Example() {
  const [progress, setProgress] = useState(15); // Initial progress at 15%
  const [selected, setSelected] = useState<number | null>(null); // Selected property type

  return (
    <div className="flex flex-col bg-white overflow-hidden">
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 mt-32">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Parmi les propositions suivantes, laquelle décrit le mieux votre bien ?
        </h2>

        {/* Property Type Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full px-4">
          {propertyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelected(type.id)}
              className={`flex flex-col items-center justify-center p-4 border rounded-lg transition duration-200 
                ${selected === type.id ? "border-green-600 bg-green-100" : "border-gray-400 hover:bg-gray-100"}`}
            >
              <img src={type.icon} alt={type.name} className="w-12 h-12 mb-2" />
              <span className="text-sm text-center">{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      
    </div>
  );
}