'use client';

import { useState } from "react";

export default function Detail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Report submitted:", { reportReason, description });
    // Here you can integrate an API call or further processing.
    setReportReason('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="container mx-auto flex flex-col gap-8 p-6 bg-white rounded-lg shadow-md mb-10">
        {/* Section Utilisateur & Avis */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profil & Avis */}
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <img className="w-20 h-20 rounded-full object-cover" src="/assets/wessim.png" alt="Neil image" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Ahmed Mohsen</h2>
                <p className="text-sm text-gray-500">Le propriétaire du terrain</p>
                <p className="text-sm text-gray-500">Membre depuis 3 ans</p>
              </div>
            </div>

            {/* Avis */}
            <hr className="my-4 border-gray-300" />
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start gap-3 mb-4">
                <img src="https://img.icons8.com/ios/50/000000/star.png" className="w-6 h-6" alt="Star" />
                <div>
                  <p className="font-semibold text-gray-800">
                    Très bien noté par les voyageurs du pays suivant : <span className="text-black">Tunis</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    100 % des voyageurs de ce pays (Tunis) ont donné une évaluation globale de 
                    5 étoiles à ce logement au cours de l'année passée.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Infos & Prix */}
          <div className="w-full md:w-1/3 p-4 bg-gray-100 rounded-lg shadow">
            <div className="grid grid-cols-2 text-gray-700">
              <div className="border-b p-2">
                <p className="text-sm font-semibold text-green-600">Date d'ajout</p>
                <p className="text-sm">11/02/2025</p>
              </div>
              <div className="border-b p-2">
                <p className="text-sm font-semibold text-green-600">Lieu</p>
                <p className="text-sm">Bizerte Menzel Abderrahmane</p>
              </div>
              <div className="p-2 col-span-2">
                <p className="text-sm font-semibold text-green-600">Prix</p>
                <p className="text-lg font-semibold">250000 DNT</p>
              </div>
            </div>

            {/* Contact & Signalement */}
            <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
              Contacter le prestataire
            </button>
            <div className="mt-3 text-center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(true);
                }}
                className="text-sm text-gray-500 hover:underline flex items-center justify-center gap-1"
              >
                <span>🚩</span> Signaler cette annonce
              </a>
            </div>
          </div>
        </div>

        {/* Nouvelle Section en dessous */}
        <div className="w-full">
          <hr className="border-gray-300" />
          <p className="mt-4 text-gray-700">
            Menzel Abderrahmane, située sur la rive nord du lac de Bizerte, est une ville qui allie traditions agricoles et développement industriel.
            Historiquement, la région est connue pour ses activités agricoles, notamment l’exploitation de fermes familiales dédiées à la culture de diverses céréales, 
            de légumes et à l’élevage. Ces dernières années, la ville a connu une transformation notable avec l’établissement du Technopôle Agroalimentaire de Bizerte 
            (AGRO’TECH) sur une superficie de 45 hectares à Menzel Abderrahmane. Ce pôle se concentre sur la recherche, l’innovation, le développement technologique, 
            la formation...
          </p>

          {/* Ce que propose ce logement */}
          <hr className="my-4 border-gray-300" />
          <h3 className="text-lg font-semibold text-gray-800">Ce que propose ce logement</h3>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img src="https://img.icons8.com/ios/50/000000/sprout.png" className="w-6 h-6" alt="Feature Icon" />
              <p className="text-gray-700">Cette terre est adaptée à toutes les saisons.</p>
            </div>
            <div className="flex items-center gap-2">
              <img src="https://img.icons8.com/ios/50/000000/approval.png" className="w-6 h-6" alt="Feature Icon" />
              <p className="text-gray-700">Cette terre est validée par l'État.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isModalOpen && (
        <div
          id="report-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow-sm">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">Signaler l'annonce</h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal Body */}
              <form className="p-4" onSubmit={handleSubmit}>
                <fieldset className="mb-4">
                  <legend className="block mb-2 text-sm font-medium text-gray-900">Raison du signalement:</legend>
                  <div className="space-y-2">
                    {[
                      "spam",
                      "offensive content",
                      "misinformation",
                      "harassment",
                      "inappropriate language",
                    ].map((reason) => (
                      <div key={reason} className="flex items-center">
                        <input
                          id={reason}
                          type="radio"
                          name="reportReason"
                          value={reason}
                          checked={reportReason === reason}
                          onChange={(e) => setReportReason(e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          required
                        />
                        <label htmlFor={reason} className="ml-2 text-sm font-medium text-gray-900 capitalize">
                          {reason}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <div className="mb-4">
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ajoutez des détails supplémentaires..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="text-white bg-green-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Envoyer le signalement
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
