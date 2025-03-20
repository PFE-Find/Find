'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import Home from "../page";
import Page1 from "../components/FormComponents/Page1";
import Page2 from "../components/FormComponents/Page2";
import Page3 from "../components/FormComponents/Page3";
import Page4 from "../components/FormComponents/Page4";
import Page5 from "../components/FormComponents/Page5";
import Page6 from "../components/FormComponents/Page6";
import Page7 from "../components/FormComponents/Page7";
import Page8 from "../components/FormComponents/Page8";
import Page9 from "../components/FormComponents/Page9";
import Page10 from "../components/FormComponents/Page10";
import Page11 from "../components/FormComponents/Page11";
import Page12 from "../components/FormComponents/Page12";

import { useState } from 'react';
import { useMultistepForm } from "./useMultistepForm";

type FormData = {
    titre: string;
    description: string;
    prix: string;
    idVendeur: string;
    statut: string;
    dateCreation: string;
    FavorieStatut: string;
    localisation: string;
    équipements: string;
    defects: string;
    photos: string[];
    propertyTypes: string;
    position:[number,number];
};

const INITIAL_DATA: FormData = {
    titre: "",
    propertyTypes: "",
    description: "",
    prix: "",
    idVendeur: "",
    statut: "",
    dateCreation: "",
    FavorieStatut: "",
    localisation: "",
    équipements: "",
    defects: "",
    photos: [],
    position:[0,0]
};

export default function FormPages() {
    const router = useRouter(); // Use Next.js router instead of useNavigate
    const [data, setData] = useState(INITIAL_DATA);

    function updateFields(fields: Partial<FormData>) {
        setData(prev => ({ ...prev, ...fields }));
        console.log(data);
        
    }
   
    const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
        useMultistepForm([
            <Page1 key="page1"  />,
            <Page2 key="page2" data={data} updateFields={updateFields} />, //category
            <Page3 key="page3" data={data} updateFields={updateFields} />, // map 
            <Page4 key="page4" data={data} updateFields={updateFields} />, // prix
            <Page5 key="page5" data={data} updateFields={updateFields} />, //pass
            <Page6 key="page6" data={data} updateFields={updateFields} />,
            <Page7 key="page7" data={data} updateFields={updateFields} />,//photos
            <Page8 key="page8" data={data} updateFields={updateFields} />,//title
            <Page9 key="page9" data={data} updateFields={updateFields} />,
            <Page10 key="page10" data={data} updateFields={updateFields} />, // description
            <Page11 key="page11" data={data} updateFields={updateFields} />,
            <Page12 key="page12" data={data} updateFields={updateFields} />,
        ]);
        function debug()
        {
            next() ; 
            console.log(data);
            
        }

    // Calculate progress percentage based on step index
    const progress = (currentStepIndex / (steps.length - 1)) * 100;

    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            {/* Top Section */}
            <div className="p-4 m-5">
                <button
                    className="px-4 py-2 border rounded-lg text-green-600 border-green-600 hover:bg-green-100 float-right"
                    onClick={() => router.push("/")} // Updated navigation
                >
                    Quitter
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {step}
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
                <button onClick={back} className="text-gray-600 underline hover:text-green-600" type="button">
                    {!isFirstStep && "Retour"}
                </button>
                <button
                    onClick={debug}
                    type="button"
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                >
                    {isFirstStep ? "Commencer" : "Continuer"}
                </button>
            </div>

            {/* Progress Indicator */}
            <div className="absolute top-0 left-0 flex justify-center items-center m-10">
                {currentStepIndex + 1}
            </div>
        </div>
    );
}
