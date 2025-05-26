'use client';

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useState, useCallback, useEffect } from 'react';
import "../../globals.css";

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../MapComponent'), {
  ssr: false,
});

export default function Example({ data, updateFields } : any) {
  const defaultLocation = {
    coordinates: [36.8065, 10.1815], // Default: Tunis
    placeName: "Tunis, Tunisia"
  };

  const [position, setPosition] = useState(defaultLocation);

useEffect(() => {
  if (data?.localisation) {
    setPosition({ coordinates: data.localisation, placeName: data.placeName });
  }
}, [data]);

  const handlePositionChange = useCallback((newPosition: any) => {
    setPosition(newPosition);
    console.log("Position updated:", newPosition);
    updateFields({ ...data, localisation: newPosition.coordinates, placeName: newPosition.placeName });
  }, [data, updateFields]);

  return (
    <div>
      <div className="flex flex-col bg-white overflow-y-auto h-[700px]">
        <div className="flex-1 flex-col place-content-center container mx-auto text-black ">
          <h2 className="text-2xl font-semibold text-center mb-2">
            Où se situe votre bien ?
          </h2>
          <h2 className="text-md text-center w-70">
          Sélectionnez Votre adresse.
          </h2>

          <div className="flex justify-center items-center w-full">
            <MapComponent
              position={position}
              setPosition={handlePositionChange}
              zoom={12} // Add a default zoom level
            />
          </div>
        </div>
      </div>
    </div>
  );
}