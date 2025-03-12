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
      <div className="flex-1 flex-col place-content-center container mx-auto ">
        <h2 className="text-2xl font-semibold text-center mb-2">
        Où se situe votre bien ?        </h2>
        <h2 className="text-md  text-center mb-10 w-70">
        Votre adresse est uniquement partagée avec l'acheteur une fois la transaction confirmée.
        </h2>

         {/* Input Field for Location */}
         <div className="flex justify-center items-center w-full">
      <input
        type="text"
        placeholder="Saisissez votre adresse ...."
        value={location}
        onChange={handleInputChange}
        className="w-[500px] px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
      /></div>
        <div className="flex justify-center items-center w-full">
        <iframe
          className="rounded-lg shadow-lg"
          width="500"
          height="500"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodeURIComponent(
            location
          )}&t=p&z=9&ie=UTF8&iwloc=B&output=embed`}
        ></iframe>
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
