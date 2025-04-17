'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

type SurfacePageProps = {
  data: {
    Superficie: number | null;
    unit: string;
  };
  updateFields: (fields: { Superficie: number | null; unit: string }) => void;
};

const surfaceUnits = [
  { value: 'm²', label: 'Mètres carrés (m²)' },
  { value: 'Hectar', label: 'Hectares (ha)' },
  { value: 'Are', label: 'Ares (a)' }
];

export default function SurfaceForm({ data, updateFields }: SurfacePageProps) {
  const [surface, setSurface] = useState<string>(data.Superficie?.toString() || '');
  const [unit, setUnit] = useState<string>(data.unit || 'm²');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    const valid = surface !== '' && !isNaN(Number(surface)) && Number(surface) > 0;
    setIsValid(valid);
  }, [surface]);

  const handleSurfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setSurface(value);
      updateFields({ 
        Superficie: value === '' ? null : parseFloat(value),
        unit 
      });
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnit = e.target.value;
    setUnit(selectedUnit);
    updateFields({ 
      Superficie: surface === '' ? null : parseFloat(surface),
      unit: selectedUnit 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col bg-gradient-to-b from-gray-50 to-white  overflow-y-auto h-[660px]"
    >
      <div className="flex flex-col items-center justify-center container mx-auto px-4 py-20 md:py-22">
        <motion.div 
          className="w-full max-w-2xl text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-50 text-green-600">
            <UserIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Superficie de votre bien
          </h1>
          <p className="text-lg text-gray-600">
            Une mesure précise aide les acheteurs à mieux évaluer votre propriété
          </p>
        </motion.div>

        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="property-surface" className="block text-sm font-medium text-gray-700">
                Surface totale
                <button 
                  type="button" 
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <InformationCircleIcon className="w-4 h-4 inline" />
                </button>
              </label>
            </div>

            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-3 p-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg shadow-lg"
                >
                  <p>Comment mesurer votre surface :</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Utilisez un mètre ruban ou un télémètre laser</li>
                    <li>Pour les terrains, consultez le cadastre</li>
                    <li>1 hectare = 10 000 m²</li>
                    <li>1 are = 100 m²</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  id="property-surface"
                  type="text"
                  inputMode="decimal"
                  value={surface}
                  onChange={handleSurfaceChange}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Ex: 120"
                />
              </div>
              <div className="w-32 relative">
                <select
                  value={unit}
                  onChange={handleUnitChange}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white appearance-none transition-all"
                >
                  {surfaceUnits.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.value}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-gray-500">
              Vous pourrez préciser des surfaces partielles (bâtiments, terres cultivables...) plus tard
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}