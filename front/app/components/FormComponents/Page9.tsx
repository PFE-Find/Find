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

export default function Example({ data, updateFields }) {
  const [prix, setprix] = useState(data.prix);
  const [unit, setUnit] = useState(data.unit);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setprix(value);
    updateFields({ ...data, prix: value === "" ? null : parseFloat(value) });
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnit = e.target.value;
    setUnit(selectedUnit);
    updateFields({ ...data, unit: selectedUnit });
  };

  return (

    <div className="flex flex-col bg-white">
      <div className="flex-1 flex justify-center items-center mt-32 text-black">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Le prix final du votre bien</h2>
          <h2 className="text-md mb-10 text-black">
            Vous y êtes presque ! Veuillez entrer le prix final de votre bien et revoir toutes les informations avant la soumission. Assurez-vous que tout est correct, car ces détails seront visibles par les acheteurs potentiels.
          </h2>
          {/* Centering the Cards */}
          <div className="flex justify-center items-center w-full">
            <form className="max-w-sm mx-auto">
              <label className="block mb-2 text-xl font-bold text-gray-900 dark:text-white">Prix :</label>
              <div className="flex space-x-2">
                <input
                  required
                  type="number"
                  id="number-input"
                  value={prix}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="000 000 000"
                />
                <select
                  value={unit}
                  onChange={handleUnitChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                >
                  <option value="DT">DT</option>
                  {/* <option value="ha">ha</option> */}
                </select>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
