'use client';

import { useState } from "react";

type EquipmentPageProps = {
  equipements: string[];
  updateFields: (fields: Partial<{ equipements: string[] }>) => void;
};

export default function Page6({ equipements, updateFields }: EquipmentPageProps) {
  const propertyTypes = [
    { id: 1, name: "Eau potable", icon: "/assets/icons/water.png", type: "general" },
    { id: 2, name: "Système d'irrigation", icon: "/assets/icons/irrigation.png", type: "general" },
    { id: 3, name: "Électricité", icon: "/assets/icons/electricity.png", type: "general" },
    { id: 4, name: "Accès à la route principale", icon: "/assets/icons/road.png", type: "general" },
    { id: 5, name: "Abri pour matériel", icon: "/assets/icons/storage.png", type: "general" },
    { id: 6, name: "Zone de stockage", icon: "/assets/icons/warehouse.png", type: "general" },
    { id: 7, name: "Puits d’eau", icon: "/assets/icons/well.png", type: "general" },
    { id: 8, name: "Espace pour animaux", icon: "/assets/icons/animals.png", type: "general" },
    { id: 9, name: "Système de production d'énergie solaire", icon: "/assets/icons/solar-energy.png", type: "general" },
    { id: 10, name: "Zone pour cultures spécifiques", icon: "/assets/icons/farming.png", type: "general" },
    { id: 11, name: "Système d'alarme", icon: "/assets/icons/alarm.png", type: "securite" },
    { id: 12, name: "Clôture de sécurité", icon: "/assets/icons/fence.png", type: "securite" },
    { id: 13, name: "Vidéosurveillance", icon: "/assets/icons/camera.png", type: "securite" },
    { id: 14, name: "Éclairage extérieur", icon: "/assets/icons/outdoor-lighting.png", type: "securite" },
  ];

  const [selected, setSelected] = useState<number[]>(equipements.map((item) => {
    const type = propertyTypes.find((p) => p.name === item);
    return type ? type.id : null;
  }).filter((id) => id !== null) as number[]);

  function choose(name: string, id: number) {
    const updatedSelected = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];

    setSelected(updatedSelected);

    // Update parent state with selected equipment names
    const updatedEquipements = updatedSelected.map(
      (selectedId) =>
        propertyTypes.find((type) => type.id === selectedId)?.name || ""
    );
    updateFields({ equipements: updatedEquipements });
  }

  return (
    <div className="flex flex-col bg-white p-4 md:p-8 overflow-y-auto h-[660px]">
      <div className="flex-1 flex flex-col items-center">
        {[
          { title: 'Indiquez les équipements disponibles sur votre bien', type: 'general' },
          { title: 'Équipements de sécurité disponibles ?', type: 'securite' },
        ].map((section, index) => (
          <div key={index} className="container mx-auto text-center mb-8">
            <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
            <p className="text-gray-600 mb-6">
              Vous pourrez ajouter d'autres équipements une fois votre annonce publiée.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
              {propertyTypes
                .filter((type) => type.type === section.type)
                .map((type) => (
                  <button
                    key={type.id}
                    onClick={() => choose(type.name, type.id)}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition duration-200 w-40 h-32 mx-auto
                      ${
                        selected.includes(type.id)
                          ? "border-green-600 bg-green-100"
                          : "border-gray-400 hover:bg-gray-100"
                      }`}
                  >
                    <img
                      src={type.icon}
                      alt={type.name}
                      className="w-12 h-12 mb-2"
                    />
                    <span className="text-sm text-center">{type.name}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}