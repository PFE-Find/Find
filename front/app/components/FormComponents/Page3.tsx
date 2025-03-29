'use client';

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import "../../globals.css";

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../MapComponent1'), {
  ssr: false, // Disable SSR for this component
});


export default function Example({data , updateFields}) {
  const [progress, setProgress] = useState(15);
  const [location, setLocation] = useState("Tunisia");
  const [position, setPosition] = useState<[number, number]>([36.8065, 10.1815]); // Default: Tunis

  const handlePositionChange = (newPosition: [number, number]) => {
    setPosition(newPosition);
    updateFields({ ...data, position: newPosition }); // Update parent data
  };

  return (
    <div>
    <div className="flex flex-col bg-white overflow-y-auto h-[660px]">
      {/* Main Content */}
      <div className="flex-1 flex-col place-content-center container mx-auto text-black ">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Où se situe votre bien ?        </h2>
        <h2 className="text-md  text-center mb-10 w-70">
          Votre adresse est uniquement partagée avec l'acheteur une fois la transaction confirmée.
        </h2>

        {/* Input Field for Location */}

        <div className="flex justify-center items-center w-full">

        <MapComponent position={position} setPosition={handlePositionChange} />

        </div>

      </div>


    </div>
    </div>
  );
}
