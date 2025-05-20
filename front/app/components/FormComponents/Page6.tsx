'use client';

import { useState, useEffect, useMemo } from "react";
import Image from 'next/image';

type EquipmentPageProps = {
  equipements: string[];
  updateFields: (fields: Partial<{ equipements: string[] }>) => void;
};

export default function Page6({ equipements, updateFields }: EquipmentPageProps) {
  const propertyTypes = useMemo(() => [
    { id: 1, name: "Eau potable", icon: "/assets/icons/water.png", type: "general", description: "Accès à l'eau potable sur le terrain" },
    { id: 2, name: "Système d'irrigation", icon: "/assets/icons/irrigation.png", type: "general", description: "Système d'arrosage installé" },
    { id: 3, name: "Électricité", icon: "/assets/icons/electricity.png", type: "general", description: "Alimentation électrique disponible" },
    { id: 4, name: "Accès à la route principale", icon: "/assets/icons/road.png", type: "general", description: "Route goudronnée accessible" },
    { id: 5, name: "Abri pour matériel", icon: "/assets/icons/storage.png", type: "general", description: "Espace couvert pour outils" },
    { id: 6, name: "Zone de stockage", icon: "/assets/icons/warehouse.png", type: "general", description: "Entrepôt ou espace de stockage" },
    { id: 7, name: "Puits d'eau", icon: "/assets/icons/well.png", type: "general", description: "Source d'eau souterraine" },
    { id: 8, name: "Espace pour animaux", icon: "/assets/icons/animals.png", type: "general", description: "Enclos ou bâtiments d'élevage" },
    { id: 9, name: "Système solaire", icon: "/assets/icons/solar-energy.png", type: "general", description: "Panneaux solaires installés" },
    { id: 10, name: "Zone de cultures", icon: "/assets/icons/farming.png", type: "general", description: "Espaces aménagés pour cultures" },
    { id: 11, name: "Système d'alarme", icon: "/assets/icons/alarm.png", type: "securite", description: "Alarme de sécurité" },
    { id: 12, name: "Clôture", icon: "/assets/icons/fence.png", type: "securite", description: "Clôture de protection" },
    { id: 13, name: "Vidéosurveillance", icon: "/assets/icons/camera.png", type: "securite", description: "Caméras de surveillance" },
    { id: 14, name: "Éclairage", icon: "/assets/icons/outdoor-lighting.png", type: "securite", description: "Éclairage extérieur" },
  ], []);

  const [selected, setSelected] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize selection from props
  useEffect(() => {
    setIsMounted(true);
    
    const initialSelected = equipements.map((item) => {
      const type = propertyTypes.find((p) => p.name === item);
      return type ? type.id : null;
    }).filter((id) => id !== null) as number[];
    
    setSelected(initialSelected);

    return () => setIsMounted(false);
  }, [equipements, propertyTypes]);

  function toggleSelection(name: string, id: number) {
    const updatedSelected = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];

    setSelected(updatedSelected);

    const updatedEquipements = updatedSelected.map(
      (selectedId) => propertyTypes.find((type) => type.id === selectedId)?.name || ""
    );
    updateFields({ equipements: updatedEquipements });
  }

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
      <div className="pt-16 pb-8 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Équipements disponibles
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sélectionnez les équipements présents sur votre propriété
        </p>
      </div>

      {/* Equipment Sections */}
      {[
        { title: 'Équipements généraux', type: 'general' },
        { title: 'Équipements de sécurité', type: 'securite' },
      ].map((section, index) => (
        <div key={index} className="px-4 pb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            {section.title}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {propertyTypes
              .filter((type) => type.type === section.type)
              .map((type) => (
                <div
                  key={type.id}
                  onClick={() => toggleSelection(type.name, type.id)}
                  className={`relative cursor-pointer rounded-xl overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105 group
                    ${selected.includes(type.id) ? 'ring-4 ring-green-500 bg-green-50' : 'bg-white hover:shadow-lg'}`}
                >
                  <div className="p-6 flex flex-col items-center">
                    <div className="relative w-16 h-16 mb-4">
                      <Image
                        src={type.icon}
                        alt={type.name}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 text-center 
                      ${selected.includes(type.id) ? 'text-green-700' : 'text-gray-800'}`}>
                      {type.name}
                    </h3>
                    <p className="text-sm text-gray-500 text-center">
                      {type.description}
                    </p>
                  </div>
                  
                  {/* Selection indicator */}
                  {selected.includes(type.id) && (
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
      ))}

      {/* Footer Note */}
      <div className="px-4 pb-8 text-center">
        <p className="text-gray-500 text-sm">
          Vous pourrez ajouter d'autres équipements après la publication
        </p>
      </div>
    </div>
  );
}