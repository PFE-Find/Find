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
    <div className="flex flex-col bg-white ">
      

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center mt-32">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            Donnez les informations principales sur votre bien
          </h2>
          <h2 className="text-md mb-10">
            Vous pourrez ajouter plus de détails plus tard, comme les équipements spécifiques.
          </h2>

          {/* Input Field for Location */}
          <div className="flex justify-center items-center w-full">
            <form className="max-w-sm mx-auto">
              <label className="block mb-5 text-3xl font-bold text-gray-900 dark:text-white">Superficie :</label>
              <input 
                type="number" 
                id="number-input" 
                aria-describedby="helper-text-explanation" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="90210" 
                required 
              />
            </form>
          </div>
        </div>
      </div>
      
    </div>
  );
}