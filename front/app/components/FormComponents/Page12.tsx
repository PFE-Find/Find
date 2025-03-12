'use client';

import { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import "../../globals.css";

const filteredOffers = [
    { id: 1, title: "Offre 1", image: "/assets/photo.jpg", size: "100m²", type: "Terrain agricole", price: "10,000 TND" },

];

export default function Example() {
    const [progress, setProgress] = useState(15);
    const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
    const index = 0; // Static index for now, you can make it dynamic

    const toggleFavorite = (id: number) => {
        setFavorites((prevFavorites) => ({
            ...prevFavorites,
            [id]: !prevFavorites[id],
        }));
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Top Section */}
            <div className="p-4 m-5">
                <button className="px-4 py-2 border rounded-lg text-green-600 border-green-600 hover:bg-green-100 float-right">
                    Quitter
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex justify-center items-center px-10 py-8 ">
                <div className="grid grid-flow-row grid-cols-1 gap-4 h-full">
                    <div className="row-span-2 col-span-2">
                        <h2 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-green-600">
                            Vérifiez votre annonce
                        </h2>
                        <p className="mt-5 font-light text-gray-500 md:text-lg dark:text-gray-400">
                            Enfin, choisissez les conditions de vente, définissez votre prix et mettez votre annonce en ligne.
                        </p>
                    </div>
                    <div className='flex flex-row'>

                        <div className="basis-1/3">
                            {filteredOffers.length > 0 ? (
                                <div className="shadow-xl relative bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4">
                                    <a href="#">
                                        <img className="shadow-xl rounded-xl w-full h-80 object-cover" src={filteredOffers[0].image} alt={filteredOffers[0].title} />
                                    </a>

                                    {/* Title Badge */}
                                    <div className="shadow-xl w-36 absolute top-5 left-5 bg-white text-gray-900 dark:bg-gray-700 dark:text-white px-3 py-1 rounded-lg text-xs font-bold shadow overflow-hidden text-ellipsis whitespace-nowrap max-h-9">
                                        {filteredOffers[0].title}
                                    </div>



                                    {/* Offer Details */}
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-700 dark:text-gray-400">{filteredOffers[0].size}</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-400">{filteredOffers[0].type}</p>
                                        <a href="#">
                                            <h5 className="mt-2 text-sm font-bold text-gray-900 dark:text-white">{filteredOffers[0].price}</h5>
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">Aucune offre disponible.</p>
                            )}


                        </div>

                        <div className="basis-2/3 ml-4">
                            <div className="flex flex-col bg-white ">
                                <div className="max-w-2xl mx-auto">
                                    {/* Section Title */}
                                    <h2 className="text-xl font-extrabold text-gray-900 ">Et ensuite ?</h2>

                                    {/* Step 1 */}
                                    <div className="">
                                        <h3 className="text-md font-semibold text-gray-900 mb-2">
                                            Confirmez les informations avant de publier votre annonce
                                        </h3>
                                        <p className="text-gray-600">
                                            Avant la mise en ligne de votre annonce, nous devons nous assurer que toutes les informations
                                            fournies sont correctes et conformes aux exigences en vigueur. Nous vous informerons si votre
                                            identité doit être vérifiée ou si des documents supplémentaires sont requis. Selon votre localisation,
                                            un enregistrement auprès des autorités locales pourrait être nécessaire.
                                        </p>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="">
                                        <h3 className="text-md font-semibold text-gray-900 mb-2">
                                            Configurez vos disponibilités
                                        </h3>
                                        <p className="text-gray-600">
                                            Définissez les créneaux durant lesquels votre bien sera disponible pour consultation ou réservation.
                                            Vous pouvez choisir des périodes spécifiques ou une disponibilité permanente. Une fois configurées,
                                            ces informations permettront aux acheteurs potentiels de mieux organiser leurs démarches.
                                            <strong> Note :</strong> Votre annonce sera visible 24 heures après sa publication pour une diffusion optimale.
                                        </p>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="">
                                        <h3 className="text-md font-semibold text-gray-900 mb-2">
                                            Ajustez vos paramètres
                                        </h3>
                                        <p className="text-gray-600">
                                            Personnalisez les conditions de vente en fonction de vos besoins. Fixez les modalités de paiement,
                                            ajoutez des options de négociation et précisez les garanties offertes. Pensez également à indiquer
                                            les restrictions légales, les frais supplémentaires éventuels et toute information importante pour
                                            les futurs acquéreurs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Range Input for Progress */}
            <div className="w-full mt-6">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    className="w-full h-4 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, rgb(163, 165, 168) ${progress}%, rgb(219, 222, 228) ${progress}%)`,
                    }}
                    readOnly
                />
            </div>

            {/* Footer */}
            <div className="px-10 py-4 flex justify-between items-center">
                <a href="#" className="text-gray-600 underline hover:text-green-600">
                    Retour
                </a>
                <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
                    Commencer
                </button>
            </div>
        </div >
    );
}
