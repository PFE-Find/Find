'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

const STEPS = [
  {
    number: 1,
    title: "Décrivez votre bien",
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    description: "Terrain, matériel ou équipements ? Indiquez la localisation, superficie ou état.",
    image: "/assets/photo1.jpg"
  },
  {
    number: 2,
    title: "Mettez en valeur votre bien",
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    description: "Photos, titre et description. Nous vous aidons à attirer plus d'acheteurs.",
    image: "/assets/photo2.jpg"
  },
  {
    number: 3,
    title: "Finalisez et publiez",
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    description: "Fixez un prix et mettez votre annonce en ligne. Acheteurs et investisseurs vous contactent directement !",
    image: "/assets/photo3.jpg"
    
  }
];

export default function Page1() {
  const [progress] = useState(10);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Préchargement des images avec l'API navigateur
    if (typeof window !== 'undefined') {
      STEPS.forEach(step => {
        const img = new window.Image(); // Utilisation de window.Image
        img.src = step.image;
      });
    }

    return () => setIsMounted(false);
  }, []);

  const memoizedSteps = useMemo(() => STEPS, []);

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white overflow-y-auto max-h-[700px] ">
      <div className="flex-1 flex justify-center items-center  md:px-10 md:pt-16 container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full max-w-6xl">
          {/* Left Column - Title avec animation */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center lg:text-left leading-tight bg-gradient-to-r from-teal-900 to-teal-800 bg-clip-text text-transparent">
              Commencer sur <br className="hidden md:block" /> Find, c'est simple !
            </h1>
            
            <p className="text-gray-600 text-center lg:text-left text-lg md:text-xl">
              Notre processus en 3 étapes vous guide pour publier votre annonce rapidement et efficacement.
            </p>
            
            {/* Barre de progression visible uniquement sur mobile */}
            <div className="lg:hidden w-full bg-gray-200 rounded-full h-2.5 mb-8">
              <div 
                className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Right Column - Steps avec lazy loading */}
          <div className="space-y-6 custom-scrollbar px-2">
            {memoizedSteps.map((step) => (
              <div 
                key={step.number}
                className="group flex flex-col md:flex-row items-center border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:border-green-500"
              >
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <span className="text-2xl font-bold text-green-600">{step.number}</span>
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-semibold text-lg md:text-xl mb-2 text-gray-800">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    {step.description}
                  </p>
                </div>
                
                <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-6 w-full md:w-40 h-28 relative overflow-hidden rounded-lg">
                  <Image
                    src={step.image}
                    sizes= "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={`Étape ${step.number}`}
                    width={160}
                    height={112}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    // loading="lazy"
                    quality={75}
                    priority
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS personnalisé pour la scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
}