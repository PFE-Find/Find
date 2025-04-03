'use client';

import { useEffect, useState } from 'react';

type FormData = {
  propertyType: string;
  propertyId: number | null;
};

type UserFormProps = FormData & {
  updateFields: (fields: Partial<FormData>) => void;
};

export default function Example({
  propertyType,
  propertyId,
  updateFields,
}: UserFormProps) {
  const [selected, setSelected] = useState<number | null>(propertyId);

  const propertyTypes = [
    { id: 1, type: "Land", name: "Terrain agricole", icon: "/assets/icons/terrain-a-vendre.png" },
    { id: 2, type: "Material", name: "Matériel agricole", icon: "/assets/icons/machine-a-grue.png" },
    { id: 3, type: "Land", name: "Ferme", icon: "/assets/icons/field.png" },
    { id: 4, type: "Land", name: "Terrain résidentiel", icon: "/assets/icons/broche-de-localisation.png" },
  ];

  // Set the initial selected state based on the propertyType and propertyId
  useEffect(() => {
    if (propertyId) {
      setSelected(propertyId);
    } else if (propertyType) {
      const selectedProperty = propertyTypes.find((type) => type.name === propertyType);
      if (selectedProperty) {
        setSelected(selectedProperty.id);
      }
    }
  }, [propertyType, propertyId]);

  function choose(type: string, id: number) {
    setSelected(id);
    updateFields({ propertyType: type, propertyId: id }); // Update parent component state
  }

  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 mt-32 text-black">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Parmi les propositions suivantes, laquelle décrit le mieux votre bien ?
        </h2>

        {/* Property Type Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full px-4">
          {propertyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => choose(type.type, type.id)}
              className={`flex flex-col items-center justify-center p-4 border rounded-lg transition duration-200 
                ${selected === type.id ? "border-green-600 bg-green-100" : "border-gray-400 hover:bg-gray-100"}`}
            >
              <img src={type.icon} alt={type.name} className="w-12 h-12 mb-2" />
              <span className="text-sm text-center">{type.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}