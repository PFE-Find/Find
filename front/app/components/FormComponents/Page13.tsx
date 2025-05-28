'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, HomeModernIcon } from '@heroicons/react/24/solid';

type ConditionPageProps = {
  data: {
    etat: string;
  };
  updateFields: (fields: { etat: string }) => void;
};

const conditionLabels = [
  "Très mauvais état",
  "Mauvais état",
  "État médiocre",
  "État passable",
  "État correct",
  "Bon état",
  "Très bon état",
  "État neuf",
  "Parfait état",
  "Comme neuf"
];

export default function ConditionForm({ data, updateFields }: ConditionPageProps) {
  const [rating, setRating] = useState<any>(data.etat || 0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  useEffect(() => {
    if (rating > 0) {
      setShowConfirmation(true);
      const timer = setTimeout(() => setShowConfirmation(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [rating]);

  const handleRating = (value: any) => {
    setRating(value);
    updateFields({ etat: value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col bg-gradient-to-b from-gray-50 to-white  overflow-y-auto h-[700px]"
    >
      <div className="flex flex-col items-center justify-center container mx-auto px-4 py-10 md:py-22">
        <motion.div 
          className="w-full max-w-2xl text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-50 text-green-600">
            <HomeModernIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            État du bien
          </h1>
          <p className="text-lg text-gray-600">
            Évaluez honnêtement l'état général de votre propriété
          </p>
        </motion.div>

        <motion.div 
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Comment évaluez-vous l'état de votre bien ?
              </h2>
              <p className="text-gray-500">
                Sélectionnez une note entre 1 (très mauvais) et 10 (parfait état)
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleRating(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200
                      ${(hoveredRating || rating) >= value 
                        ? 'bg-green-100 text-green-600 border-2 border-green-500' 
                        : 'bg-gray-100 text-gray-500 border-2 border-gray-300'}
                      ${value === rating ? '!bg-green-500 !text-white !border-green-500 scale-110' : ''}
                      hover:scale-105 hover:shadow-md`}
                  >
                    {value}
                  </button>
                ))}
              </div>

              <div className="h-12 flex items-center justify-center mb-6">
                <p className="text-gray-700 font-medium text-center">
                  {rating > 0 ? conditionLabels[rating - 1] : "Sélectionnez une note"}
                </p>
              </div>

              <div className="w-full max-w-lg bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">Conseil :</span>
                  <span>
                    Soyez objectif pour éviter les désaccords avec les acheteurs
                  </span>
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
                <StarIcon className="w-5 h-5 mr-2 text-green-600" />
                <span>Note enregistrée : {rating}/10</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}