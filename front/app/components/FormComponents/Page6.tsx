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
    <div className="flex flex-col min-h-screen bg-white p-4 md:p-8">
      {/* Top Section */}
      <div className="flex justify-end">
        <button className="px-4 py-2 border rounded-lg text-green-600 border-green-600 hover:bg-green-100">
          Quitter
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col space-y-10">
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
      <div className="px-4 md:px-10 py-4 flex justify-between items-center">
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
