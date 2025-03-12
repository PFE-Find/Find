'use client';

import Link from "next/link";

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
  const [location, setLocation] = useState("Tunisia");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Section */}
      <div className="p-4 m-5">
        <button className="px-4 py-2 border rounded-lg text-green-600 border-green-600 hover:bg-green-100 float-right">
          Quitter
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center px-10 py-8 container mx-auto ">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 h-full ">
          <div className="col-span-2 md:mt-0">
          <p className="mb-3 mt-5  font-light text-gray-500 md:text-lg dark:text-gray-400">
          Étape 3</p>            
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-green-600">
            Terminez et publiez            </h2>
            <p className="mb-3 mt-5  font-light text-gray-500 md:text-lg dark:text-gray-400">
            Enfin, choisissez les conditions de vente, définissez votre prix et mettez votre annonce en ligne.
            </p>            
            
          </div>
          <img
            className=" h-[400px] w-[600px] object-cover rounded-xl shadow-xl dark:bg-gray-800"
            src="/assets/formulair1.png"
            alt="dashboard image"
            
          />
          </div>
          </div>

      {/* Range Input for Progress */}
      <div className="w-full mt-6">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          className="w-full h-4 rounded-lg appearance-none cursor-pointer"
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
