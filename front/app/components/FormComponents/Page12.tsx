'use client';

import { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import "../../globals.css";

const filteredOffers = [
    { id: 1, title: "Offre 1", image: "/assets/photo.jpg", size: "100m²", type: "Terrain agricole", price: "10,000 TND" },

];

export default function Example({ data, updateFields })  {
    const savedImages = JSON.parse(localStorage.getItem('uploadedPhotos') || '[]'); // Parse saved images
    const firstImage = savedImages.length > 0 ? savedImages[0] : filteredOffers[0].image; // Use first uploaded image or default

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
        <div className="flex flex-col bg-white overflow-y-auto h-[660px]">
            
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
                    <div className='flex flex-row w-[1200px]'>

                        <div className="basis-1/3">
                            
                                <div className="shadow-xl relative bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4">
                                    <a href="#">
                                        <img className="shadow-xl rounded-xl w-full h-80 object-cover" src={firstImage}
                                            alt="Uploaded photo" />
                                    </a>

                                    {/* Title Badge */}
                                    <div className="shadow-xl w-36 absolute top-5 left-5 bg-white text-gray-900 dark:bg-gray-700 dark:text-white px-3 py-1 rounded-lg text-xs font-bold shadow overflow-hidden text-ellipsis whitespace-nowrap max-h-9">
                                        {data.titre}
                                    </div>



                                    {/* Offer Details */}
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-700 dark:text-gray-400">{data.Superficie}{data.unit}</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-400">{data.propertyType}</p>
                                        <a href="#">
                                            <h5 className="mt-2 text-sm font-bold text-gray-900 dark:text-white">{data.price} DT</h5>
                                        </a>
                                    </div>
                                </div>
                            


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
                                            votre description
                                        </h3>
                                        <p className="text-gray-600">
                                        {data.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            
        </div >
    );
}
