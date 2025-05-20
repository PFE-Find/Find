'use client';

import { ChangeEvent, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertCircle, XCircle } from 'lucide-react';
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
    const [profanityError, setProfanityError] = useState<string | null>(null);
    const [lastValidValue, setLastValidValue] = useState("");

    useEffect(() => {
        async function loadDictionaries() {
            const fr = leoProfanity.getDictionary('fr');
            const en = leoProfanity.getDictionary('en');

            // Fetch Arabic profanity list. Replace this with your actual source.
            const arResponse = await fetch('/api/arabic-profanity'); // Example API endpoint
            const ar = await arResponse.json();


            leoProfanity.loadDictionary([...new Set([...fr, ...en, ...ar])]);
            setLastValidValue(titre);
        }
        loadDictionaries();
    }, []);

    useEffect(() => {
        setCharacterCount(titre.length);
    }, [titre]);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value.slice(0, 80);
        updateFields({ titre: newValue });
    };

    const handleBlur = () => {
        setIsFocused(false);

        if (titre.trim() && leoProfanity.check(titre)) {
            setProfanityError("Le langage inapproprié n'est pas autorisé");
            updateFields({ titre: lastValidValue });
        } else {
            setProfanityError(null);
            setLastValidValue(titre);
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

    const closeError = () => {
        setProfanityError(null);
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            className="flex flex-col bg-gradient-to-b from-gray-50 to-white"
        >
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
                    <AnimatePresence>
                        {profanityError && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">
                                            {profanityError}
                                        </p>
                                    </div>
                                    <div className="ml-auto pl-3">
                                        <div className="-mx-1.5 -my-1.5">
                                            <button
                                                type="button"
                                                onClick={closeError}
                                                className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                <span className="sr-only">Fermer</span>
                                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>


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
                        className={`relative transition-all duration-200 ${isFocused ? 'ring-2 ring-green-500' : ''} ${profanityError ? 'ring-2 ring-red-500' : ''}`}
                        whileHover={{ scale: 1.005 }}
                    >
                        <textarea
                            id="annonce-title"
                            rows={3}
                            className={`block p-4 w-full text-lg text-gray-900 bg-white rounded-xl border ${isFocused ? 'border-green-500' : 'border-gray-300'} ${profanityError ? 'border-red-500' : ''} shadow-sm focus:outline-none transition-all duration-200 resize-none`}
                            placeholder="Ex: Terrain agricole 5ha avec source d'eau..."
                            value={titre}
                            onChange={handleChange}
                            maxLength={80}
                            onFocus={() => setIsFocused(true)}
                            onBlur={handleBlur}
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
                </motion.div>
            </div>
        </motion.div>
    );
}