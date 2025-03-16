'use client';

import { useState } from 'react';
import "../../globals.css";

const propertyTypes = [
  { id: 1, name: "Terrain agricole", icon: "/assets/icons/terrain-a-vendre.png" },
  { id: 2, name: "Matériel agricole", icon: "/assets/icons/machine-a-grue.png" },
  { id: 3, name: "Ferme", icon: "/assets/icons/field.png" },
  { id: 4, name: "Terrain résidentiel", icon: "/assets/icons/broche-de-localisation.png" },
  { id: 5, name: "Terrain agricole", icon: "/assets/icons/terrain-a-vendre.png" },
  { id: 6, name: "Matériel agricole", icon: "/assets/icons/machine-a-grue.png" },
  { id: 7, name: "Ferme", icon: "/assets/icons/field.png" },
  { id: 8, name: "Terrain résidentiel", icon: "/assets/icons/broche-de-localisation.png" },
  
];

export default function Example() {
  const [progress, setProgress] = useState(60);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-col bg-white p-4 md:p-8">
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col ">
        {['Indiquez les équipements disponibles sur votre bien', 'Équipements de sécurité disponibles ?'].map((title, index) => (
          <div key={index} className="container mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-3">{title}</h2>
            <p className="text-gray-600 mb-6">Vous pourrez ajouter d'autres équipements une fois votre annonce publiée.</p>
            
            {/* Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-center">
              {propertyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelected(type.id)}
                  className={`flex flex-col items-center justify-center p-4 border rounded-lg transition duration-200 w-full sm:w-40 h-32 mx-auto
                    ${selected === type.id ? "border-green-600 bg-green-100" : "border-gray-400 hover:bg-gray-100"}`}
                >
                  <img src={type.icon} alt={type.name} className="w-12 h-12 mb-2" />
                  <span className="text-sm text-center">{type.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
}
