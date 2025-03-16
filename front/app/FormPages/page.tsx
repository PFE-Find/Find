'use client';


import Page1 from "../components/FormComponents/Page3";
import { useState } from 'react';


export default function FormPages() {
const [progress, setProgress] = useState(15); // Initial progress at 15%
    
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
        {/* Top Section */}
        <div className="p-4 m-5">
                <button className="px-4 py-2 border rounded-lg text-green-600 border-green-600 hover:bg-green-100 float-right">
                    Quitter
                </button>
            </div>

      {/* Main Content */}
      <div className="flex-1">
        <Page1 />
      </div>
      {/* Range Input for Progress */}
      <div className="w-full px-10 py-4">
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
      <div className="px-10 py-4 flex justify-between items-center bg-white border-t border-gray-200">
        <a href="#" className="text-gray-600 underline hover:text-green-600">
          Retour
        </a>
        <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
          Commencer
        </button>
      </div>

      {/* Progress Indicator */}
      
      <div className="absolute top-0 left-0 flex justify-center items-center m-10">
        1/2
      </div>
    </div>
  );
}