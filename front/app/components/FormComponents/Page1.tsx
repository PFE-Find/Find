'use client';

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

export default function Example() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Section */}
      <div className="p-4 m-5">
        <button className="px-4 py-2 border rounded-lg text-green-600 border-green-600 hover:bg-green-100 float-right">
          Quitter
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center px-10 py-8 container mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-full ">
          {/* Left Column - Title */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-center md:text-left leading-tight">
              Commencer sur <br /> Find, c'est simple !
            </h1>
          </div>

          {/* Right Column - Steps */}
          <div className="space-y-8 ">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center  border-b-2 border-gray-500 p-5">
                <div className="flex-shrink-0 mr-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">{step}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {step === 1 && "Décrivez votre bien"}
                    {step === 2 && "Mettez en valeur votre bien"}
                    {step === 3 && "Finalisez et publiez"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step === 1 && "Terrain, matériel ou équipements ? Indiquez la localisation, superficie ou état."}
                    {step === 2 && "Photos, titre et description. Nous vous aidons à attirer plus d’acheteurs."}
                    {step === 3 && "Fixez un prix et mettez votre annonce en ligne. Acheteurs et investisseurs vous contactent directement !"}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-6">
                  <img
                    src={`/assets/photo${step}.jpg`}
                    alt={`Étape ${step}`}
                    className="w-40 h-28 rounded-lg object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-10 py-4 border-t flex justify-between items-center">
        <a href="#" className="text-gray-600 underline hover:text-green-600">
          Retour
        </a>
        <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
          Commencer
        </button>
      </div>
    </div>
  );
}