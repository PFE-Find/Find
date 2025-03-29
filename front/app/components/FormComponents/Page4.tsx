'use client';

import { useEffect, useState } from 'react';
import "../../globals.css";

export default function Page2({ data, updateFields }) {
  
  const [Superficie, setSuperficie ] = useState(data.Superficie );
  const [unit, setUnit] = useState(data.unit || "m²");
  useEffect(() => {
    if (!data.unit) {
      updateFields({ ...data, unit: "m²" });
    }
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSuperficie (value);
    updateFields({ ...data, Superficie : value === "" ? null : parseFloat(value) });
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
          <h2 className="text-2xl font-semibold mb-2">Donnez les informations principales sur votre bien</h2>
          <h2 className="text-md mb-10 text-black">
            Vous pourrez ajouter plus de détails plus tard, comme les équipements spécifiques.
          </h2>

          <div className="flex justify-center items-center w-full">
            <form className="max-w-sm mx-auto">
              <label className="block mb-2 text-xl font-bold text-gray-900 dark:text-white">Superficie :</label>
              <div className="flex space-x-2">
                <input
                  required
                  type="number"
                  id="number-input"
                  value={Superficie}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="000 000 000"
                />
                <select
                  value={unit}
                  onChange={handleUnitChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                >
                  <option value="m²">m²</option>
                  <option value="Hectar">Hectar</option>
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
