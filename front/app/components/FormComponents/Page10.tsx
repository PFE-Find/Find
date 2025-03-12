'use client';

import { useState, ChangeEvent } from 'react';
import "../../globals.css";

export default function Example() {
    const [progress, setProgress] = useState(15);
    const [text, setText] = useState("");

    const handleChange =  (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (event.target.value.length <= 500) {
            setText(event.target.value);
        }
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
            <div className="flex-1 flex-col place-content-center container mx-auto">
                <h2 className="text-2xl font-semibold text-center mb-2">
                    Créez votre description
                </h2>
                <h2 className="text-md text-center mb-10 w-70">
                    Racontez ce qui rend votre bien unique.
                </h2>

                <div className="flex flex-col items-center justify-center w-[700px] container mx-auto">
                    <textarea 
                        id="message" 
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Write your thoughts here..."
                        value={text}
                        onChange={handleChange}
                        maxLength={500}
                    ></textarea>
                    <p className="text-gray-500 text-sm mt-2">{text.length}/500 caractères</p>
                </div>
            </div>

            {/* Range Input for Progress */}
            <div className="w-full mt-6">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
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
        </div>
    );
}
