'use client';

import { ChangeEvent, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertCircle, PenLine } from 'lucide-react';

type DescriptionPageProps = {
  data: { description?: string };
  updateFields: (fields: { description: string }) => void;
};

export default function DescriptionEditor({ data, updateFields }: DescriptionPageProps) {
    const [text, setText] = useState<string>(data.description || "");
    const [isFocused, setIsFocused] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const characterLimit = 500;

    useEffect(() => {
        updateFields({ description: text });
    }, [text, updateFields]);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value.slice(0, characterLimit);
        setText(newValue);
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
            className="flex flex-col bg-gradient-to-b from-gray-50 to-white overflow-y-auto h-[700px]"
        >
            {/* Main Content */}
            <div className="flex flex-col items-center justify-center container mx-auto px-4  md:py-12">
                <motion.div 
                    className="w-full max-w-3xl text-center mb-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-50 text-green-600">
                        <PenLine className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Décrivez votre bien en détail
                    </h1>
                    <p className="text-lg text-gray-600">
                        Une description complète aide les acheteurs à mieux comprendre votre propriété.
                    </p>
                </motion.div>

                <motion.div 
                    className="w-full max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="relative mb-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="property-description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description détaillée
                                <button 
                                    type="button" 
                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowTips(!showTips)}
                                >
                                    <Info className="w-4 h-4 inline" />
                                </button>
                            </label>
                            <span className={`text-xs ${text.length === characterLimit ? 'text-red-500' : 'text-gray-500'}`}>
                                {text.length}/{characterLimit}
                            </span>
                        </div>

                        <AnimatePresence>
                            {showTips && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute z-10 w-full p-3 mt-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg shadow-lg"
                                >
                                    <p className="font-medium">Conseils pour une bonne description :</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li>Mentionnez les caractéristiques principales</li>
                                        <li>Décrivez l'état et les équipements disponibles</li>
                                        <li>Précisez la localisation et l'accessibilité</li>
                                        <li>Ajoutez des détails sur l'historique du bien</li>
                                        <li>Soyez honnête et transparent</li>
                                    </ul>
                                    <p className="mt-2 italic">Exemple: "Terrain agricole de 5 hectares situé à..."</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.div 
                        className={`relative transition-all duration-200 ${isFocused ? 'ring-2 ring-green-500' : ''}`}
                        whileHover={{ scale: 1.005 }}
                    >
                        <textarea
                            id="property-description"
                            rows={8}
                            className={`block p-4 w-full text-base text-gray-900 bg-white rounded-xl border ${isFocused ? 'border-green-500' : 'border-gray-300'} shadow-sm focus:outline-none transition-all duration-200 resize-none`}
                            placeholder="Décrivez votre bien en détail (caractéristiques, équipements, localisation, etc.)..."
                            value={text}
                            onChange={handleChange}
                            maxLength={characterLimit}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                    </motion.div>

                    {text.length === characterLimit && (
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
                        <p className="text-sm text-gray-500">
                            Une bonne description peut augmenter l'intérêt pour votre bien de 40%
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}