'use client';

import { ChangeEvent, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertCircle } from 'lucide-react';
import "../../globals.css";
import leoProfanity from 'leo-profanity';
type FormData = {
    titre: string;
};

type UserFormProps = FormData & {
    updateFields: (fields: Partial<FormData>) => void;
};





export default function TitleForm({
    titre = "",
    updateFields,
}: UserFormProps) {
    const [isFocused, setIsFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [characterCount, setCharacterCount] = useState(titre.length);
  const [isProfane, setIsProfane] = useState(false);

  // Load both French + English profanity lists once
  useEffect(() => {
    const fr = leoProfanity.getDictionary('fr');
    const en = leoProfanity.getDictionary('en');
    leoProfanity.loadDictionary([...new Set([...fr, ...en])]);
  }, []);

  // Keep character count up to date
  useEffect(() => {
    setCharacterCount(titre.length);
  }, [titre]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value.slice(0, 80);

    // Check directly on the newValue
    const containsProfanity = leoProfanity.check(newValue);
    setIsProfane(containsProfanity);

    if (containsProfanity) {
      // Block it: clear the field and warn
      updateFields({ titre: "" });
      alert('⚠️ Langage inapproprié détecté !');
    } else {
      // Safe to update
      updateFields({ titre: newValue });
    }
  };

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={variants}
            className="flex flex-col  bg-gradient-to-b from-gray-50 to-white"
        >
            {/* Main Content */}
            <div className="flex flex-col items-center justify-center container mx-auto px-4 py-20 md:py-32">
                <motion.div 
                    className="w-full max-w-2xl text-center mb-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Donnez un titre accrocheur à votre annonce
                    </h1>
                    <p className="text-lg text-gray-600">
                        Un bon titre augmente la visibilité de votre annonce. Soyez concis et descriptif.
                    </p>
                </motion.div>

                <motion.div 
                    className="w-full max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="relative mb-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="annonce-title" className="block text-sm font-medium text-gray-700 mb-1">
                                Titre de l'annonce
                                <button 
                                    type="button" 
                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                    onClick={() => setShowTooltip(!showTooltip)}
                                >
                                    <Info className="w-4 h-4 inline" />
                                </button>
                            </label>
                            <span className={`text-xs ${characterCount === 80 ? 'text-red-500' : 'text-gray-500'}`}>
                                {characterCount}/80
                            </span>
                        </div>

                        <AnimatePresence>
                            {showTooltip && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute z-10 w-full p-3 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg shadow-lg"
                                >
                                    <p>Exemples de bons titres :</p>
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        <li>"Terrain agricole 5ha - Nord Tunis"</li>
                                        <li>"Tracteur John Deere 2020 - 200h"</li>
                                        <li>"Ferme laitière avec équipement complet"</li>
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.div 
                        className={`relative transition-all duration-200 ${isFocused ? 'ring-2 ring-green-500' : ''}`}
                        whileHover={{ scale: 1.005 }}
                    >
                        <textarea
                            id="annonce-title"
                            rows={3}
                            className={`block p-4 w-full text-lg text-gray-900 bg-white rounded-xl border ${isFocused ? 'border-green-500' : 'border-gray-300'} shadow-sm focus:outline-none transition-all duration-200 resize-none`}
                            placeholder="Ex: Terrain agricole 5ha avec source d'eau..."
                            value={titre}
                            onChange={handleChange}
                            maxLength={80}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                    </motion.div>

                    {characterCount === 80 && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center mt-2 text-sm text-red-500"
                        >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            <span>Vous avez atteint la limite de caractères</span>
                        </motion.div>
                    )}

                    <motion.div 
                        className="mt-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}