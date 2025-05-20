'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';

type FormData = {
  propertyType: string;
  propertyId: number | null;
};

type UserFormProps = FormData & {
  updateFields: (fields: Partial<FormData>) => void;
};

export default function PropertyTypeSelector({
  propertyType,
  propertyId,
  updateFields,
}: UserFormProps) {
  const [selectedId, setSelectedId] = useState<number | null>(propertyId);
  const [isMounted, setIsMounted] = useState(false);

  // Memoize property types to prevent unnecessary recalculations
  const propertyTypes = useMemo(() => [
    { 
      id: 1, 
      type: "Land", 
      name: "Terrain agricole", 
      icon: "/assets/icons/terrain-a-vendre.png",
      description: "Terrains cultivables ou à usage agricole" 
    },
    { 
      id: 2, 
      type: "Material", 
      name: "Matériel agricole", 
      icon: "/assets/icons/machine-a-grue.png",
      description: "Machines et équipements pour l'agriculture" 
    },
    { 
      id: 3, 
      type: "Land", 
      name: "Ferme", 
      icon: "/assets/icons/field.png",
      description: "Exploitations agricoles complètes" 
    },
    { 
      id: 4, 
      type: "Land", 
      name: "Terrain résidentiel", 
      icon: "/assets/icons/broche-de-localisation.png",
      description: "Terrains constructibles en zone rurale" 
    },
  ], []);

  // Initialize selection and component mount state
  useEffect(() => {
    setIsMounted(true);
    
    if (propertyId) {
      setSelectedId(propertyId);
    } else if (propertyType) {
      const selectedProperty = propertyTypes.find(type => type.type === propertyType);
      if (selectedProperty) {
        setSelectedId(selectedProperty.id);
      }
    }

    return () => setIsMounted(false);
  }, [propertyType, propertyId, propertyTypes]);

  // Handle property selection
  const handleSelect = (type: string, id: number) => {
    setSelectedId(id);
    updateFields({ 
      propertyType: type, 
      propertyId: id 
    });
  };

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 overflow-y-auto h-[700px]">
      {/* Header */}
      <div className="pt-24 pb-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Quel type de bien souhaitez-vous proposer ?
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sélectionnez la catégorie qui correspond le mieux à votre propriété
        </p>
      </div>

      {/* Property Cards Grid */}
      <div className="flex-1 px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {propertyTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleSelect(type.type, type.id)}
              className={`relative cursor-pointer rounded-xl overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105 group
                ${selectedId === type.id ? 'ring-4 ring-green-500 bg-green-50' : 'bg-white hover:shadow-lg'}`}
            >
              <div className="p-6 flex flex-col items-center">
                <div className="relative w-20 h-20 mb-4">
                  <Image
                    src={type.icon}
                    alt={type.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <h3 className={`text-lg font-semibold mb-2 text-center 
                  ${selectedId === type.id ? 'text-green-700' : 'text-gray-800'}`}>
                  {type.name}
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  {type.description}
                </p>
              </div>
              
              {/* Selection indicator */}
              {selectedId === type.id && (
                <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Guidance */}
      <div className=" text-center ">
        <p className="text-gray-500 text-sm ">
          Cliquez sur une option pour continuer
        </p>
      </div>
    </div>
  );
}