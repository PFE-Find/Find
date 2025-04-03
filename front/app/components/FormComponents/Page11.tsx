'use client';

import Link from "next/link";

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import "../../globals.css";




export default function Example() {
  


  return (
    <div className="flex flex-col bg-white">
     

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center px-10 py-8 container mx-auto mt-20">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 h-full ">
          <div className="col-span-2 md:mt-0">
          <p className="mb-3 mt-5  font-light text-gray-500 md:text-lg dark:text-gray-400">
          Étape 3</p>            
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-green-600">
            Terminez et publiez            </h2>
            <p className="mb-3 mt-5  font-light text-gray-500 md:text-lg dark:text-gray-400">
            Enfin, choisissez les conditions de vente, définissez votre prix et mettez votre annonce en ligne.
            </p>            
            
          </div>
          <img
            className=" h-[400px] w-[600px] object-cover rounded-xl shadow-xl dark:bg-gray-800"
            src="/assets/formulair1.png"
            alt="dashboard image"
            
          />
          </div>
          </div>

     
    </div>
  );
}
