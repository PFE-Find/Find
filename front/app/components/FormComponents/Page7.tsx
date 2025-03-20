'use client';

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import "../../globals.css";



export default function Example({data ,  updateFields}) {
    const [progress, setProgress] = useState(15);
    const [base64Images, setBase64Images] = useState<string[]>([]);

    function handleUpdatePhotos( base64Results :  string[] )
    {
        setBase64Images(base64Results) ;  
        console.log(base64Results);
        
        updateFields({...data , photos : base64Results}); 
    }

    const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const selectedFiles = Array.from(files);
            const promises = selectedFiles.map(fileToBase64); // Convert all files to Base64
            Promise.all(promises).then((base64Results) => handleUpdatePhotos(base64Results));
        }
    };
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };
    


    return (
        <div className="flex flex-col bg-white">


            {/* Main Content */}
            <div className="flex-1 flex-col place-content-center container mx-auto mt-32">
                <h2 className="text-2xl font-semibold text-center mb-2">
                    Ajoutez quelques photos de votre ferme                    </h2>
                <h2 className="text-md  text-center mb-10 w-70">
                    Pour commencer, vous aurez besoin de 5 photos. Vous pourrez en ajouter d'autres ou faire des modifications plus tard.
                </h2>


                <div className="flex items-center justify-center w-[700px] container mx-auto">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" type="file" multiple onChange={onFileSelected} className="hidden" />
                    </label>
                </div>

            </div>


        </div>
    );
}
