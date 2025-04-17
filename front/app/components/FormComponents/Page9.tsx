'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CurrencyDollarIcon, ChevronDownIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

type PricePageProps = {
  data: {
    prix: number | null;
    unit: string;
  };
  updateFields: (fields: { prix: number | null; unit: string }) => void;
};

const currencyUnits = [
  { value: 'DT', label: 'Dinar Tunisien (DT)' },
  // { value: 'EUR', label: 'Euros (€)' },
  // { value: 'USD', label: 'Dollars ($)' },
];

export default function PriceForm({ data, updateFields }: PricePageProps) {
  const [price, setPrice] = useState<string>(data.prix?.toString() || '');
  const [unit, setUnit] = useState<string>(data.unit || 'DT');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    const valid = price !== '' && !isNaN(Number(price)) && Number(price) > 0;
    setIsValid(valid);
    if (valid) {
      setShowConfirmation(true);
      const timer = setTimeout(() => setShowConfirmation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [price, unit]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setPrice(value);
      updateFields({ 
        prix: value === '' ? null : parseFloat(value),
        unit 
      });
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnit = e.target.value;
    setUnit(selectedUnit);
    updateFields({ 
      prix: price === '' ? null : parseFloat(price),
      unit: selectedUnit 
    });
  };

  const formattedPrice = price === '' ? '' : 
    new Intl.NumberFormat('fr-TN').format(parseFloat(price));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col bg-gradient-to-b from-gray-50 to-white overflow-y-auto h-[700px]"
    >
      <div className="flex flex-col items-center justify-center container mx-auto px-4 py-20 md:py-12">
        <motion.div 
          className="w-full max-w-2xl text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-50 text-green-600">
            <CurrencyDollarIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fixez le prix de votre bien
          </h1>
          <p className="text-lg text-gray-600">
            Un prix juste et compétitif augmente vos chances de vente
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
              <label htmlFor="property-price" className="block text-sm font-medium text-gray-700">
                Prix de vente
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
                  <p>Conseils pour un bon prix :</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Consultez les prix du marché</li>
                    <li>Prenez en compte l'état et les équipements</li>
                    <li>Pensez à la localisation</li>
                    <li>Laissez une marge de négociation</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all duration-200">
                <input
                  id="property-price"
                  type="text"
                  inputMode="numeric"
                  value={formattedPrice}
                  onChange={handlePriceChange}
                  className="py-4 px-4 w-full text-xl text-gray-900 bg-white border-none focus:outline-none"
                  placeholder="0,00"
                />
                <div className="relative pr-4">
                  <select
                    
                    onChange={handleUnitChange}
                    className="appearance-none py-4 pl-2 pr-8 bg-transparent text-gray-700 focus:outline-none cursor-pointer"
                  >
                    {currencyUnits.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.value}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showConfirmation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex items-center justify-center p-3 mt-4 text-sm text-green-700 bg-green-50 rounded-lg"
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                <span>Prix enregistré avec succès</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-gray-500">
              Vous pourrez ajuster ce prix après la publication si nécessaire
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}