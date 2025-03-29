'use client';

import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { useMultistepForm } from "./useMultistepForm";
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
import Page13 from "../components/FormComponents/Page13";
import eventService from "../services/Post";

const stepsLabels = [
    "Décrivez votre bien",
    "Mettez en valeur votre bien",
    "Finalisez et publiez"
];
type FormData = {
    titre: string;
    description: string;
    price: string;
    Superficie: string;
    unit: string;
    idVendeur: string;
    statut: string;
    dateCreation: string;
    FavorieStatut: string;
    localisation: string;
    equipements: string[];
    etat: string;
    photos: string[];
    propertyType: string;
    position: [number, number];
};

const INITIAL_DATA: FormData = {
    titre: "",
    Superficie: "",
    unit:"",
    propertyType: "",
    description: "",
    price: "",
    idVendeur: "",
    statut: "",
    dateCreation: "",
    FavorieStatut: "",
    localisation: "",
    equipements: [],
    etat: "",
    photos: [],
    position: [0, 0]
};


export default function FormPages() {
    const router = useRouter();
    const [data, setData] = useState(INITIAL_DATA);
    const [errors, setErrors] = useState<string[]>([]); // To store validation errors

    useEffect(() => {
        localStorage.removeItem('uploadedPhotos');
        localStorage.removeItem('selectedEquipment');
    }, []);

    function updateFields(fields: Partial<FormData>) {
        setData((prev) => ({ ...prev, ...fields }));
    }

    async function submitFields() {
        try {
            await eventService.addEvent(data);
            alert("Event added successfully!");
        } catch (error) {
            console.error("Error adding event:", error);
        }
    }
    const getStepClass = (stepGroupIndex: number) => {
        if (stepGroupIndex === 0 && currentStepIndex <= 3) return "text-green-600 border-green-600";
        if (stepGroupIndex === 1 && currentStepIndex >= 4 && currentStepIndex <= 9) return "text-green-600 border-green-600";
        if (stepGroupIndex === 2 && currentStepIndex >= 10) return "text-green-600 border-green-600";
        return "text-gray-400 border-gray-400"; // Default gray for inactive steps
    };


    const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } = useMultistepForm([
        <Page1 key="page1" />,
        <Page2 key="page2" propertyType={data.propertyType} updateFields={updateFields} />,
        <Page3 key="page3" data={data} updateFields={updateFields} />,
        ...(data.propertyType !== "Matériel agricole" ? [
            <Page4 key="page4" data={data} updateFields={updateFields} />
        ] : [
            <Page13 key="page13" data={data} updateFields={updateFields} />
        ]),
        <Page5 key="page5" />,
        <Page8 key="page8" titre={data.titre} updateFields={updateFields} />,
        <Page7 key="page7" data={data} updateFields={updateFields} />,
        <Page6 key="page6" equipements={data.equipements} updateFields={updateFields} />,// selectedequipment page
        <Page10 key="page10" data={data} updateFields={updateFields} />,
        <Page11 key="page11" />,
        <Page9 key="page9" data={data} updateFields={updateFields} />,
        <Page12 key="page12" data={data} updateFields={updateFields} />,
    ]);

    // Validation rules for each step
    const validationRules: Record<number, (data: FormData) => string[]> = {
        1: (data) => {
            const errors = [];
            if (!data.propertyType) errors.push("Veuillez spécifier le type de propriété.");
            return errors;
        },
        3: (data) => {
            const errors = [];
            if (data.propertyType !== "Matériel agricole" && !data.Superficie) {
                errors.push("Veuillez indiquer la superficie du votre bien.");
            }
            else if(data.propertyType == "Matériel agricole" && !data.etat){
                errors.push("Veuillez indiquer l'etat du votre bien.");
            }
            return errors;
        },
        5: (data) => {
            const errors = [];
            if (!data.titre) errors.push("Le titre de l'annonce est obligatoire.");
            return errors;
        },
        6: (data) => {
            const errors = [];
            if (data.photos.length < 5) errors.push("Veuillez ajouter au moins 5 photos pour compléter votre annonce.");
            return errors;
        },
        8: (data) => {
            const errors = [];
            if (!data.description) errors.push("Merci d'ajouter une description détaillée de votre bien.");
            return errors;
        },
        10: (data) => {
            const errors = [];
            if (!data.price) errors.push("Veuillez indiquer le prix de vente ou de location.");
            return errors;
        },
        // Add more validation rules for other steps as needed
    };

    // Validate the current step
    function validateCurrentStep(): boolean {
        const validate = validationRules[currentStepIndex];
        if (!validate) return true; // No validation for this step

        const stepErrors = validate(data);
        setErrors(stepErrors);

        return stepErrors.length === 0; // Return true if no errors
    }

    function handleNext(e: FormEvent) {
        console.log(data);

        e.preventDefault();

        if (validateCurrentStep()) {
            next(); // Proceed to the next step if validation passes
        }
    }
    // Calculate progress percentage based on step index
    const progress = (currentStepIndex / (steps.length - 1)) * 100;
    function onSubmit(e: FormEvent) {
        e.preventDefault()
        next()

    }

    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <div className="flex items-center justify-between w-full">
                <ol className="flex items-center justify-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white  shadow-xs dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                    {stepsLabels.map((label, index) => (
                        <li key={index} className={`flex items-center ${getStepClass(index)}`}>
                            <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${getStepClass(index)}`}>
                                {index + 1}
                            </span>
                            {label}
                            {index !== stepsLabels.length - 1 && (
                                <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4" />
                                </svg>
                            )}
                        </li>
                    ))}
                </ol>


                <button
                    className="p-4 m-5 px-4 py-2 border rounded-lg text-green-600 border-green-600 hover:bg-green-100"
                    onClick={() => router.push("/")}
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



            <form onSubmit={handleNext}>
                {/* Footer */}
                <div className="px-10 py-4 flex justify-between items-center bg-white border-t border-gray-200">
                    <button
                        onClick={back}
                        className="text-gray-600 underline hover:text-green-600"
                        type="button"
                    >
                        {!isFirstStep && "Retour"}
                    </button>

                    {!isLastStep ? (
                        <button
                            type="submit"
                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                        >
                            {isFirstStep ? "Commencer" : "Continuer"}
                        </button>
                    ) : (
                        <button
                            onClick={submitFields}
                            type="button"
                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                        >
                            Submit
                        </button>
                    )}
                </div>
                <div>
                    {/* Progress Indicator */}
                    <div className="absolute top-0 left-0 flex justify-center items-center m-6">
                        {currentStepIndex + 1}
                    </div>
                    {errors.length > 0 && (
                        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 text-yellow-800  bg-yellow-100 dark:bg-gray-800 dark:text-yellow-300 px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500 animate-slide-down">
                            {errors.map((error, index) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    )}

                </div>
            </form>

        </div>

    );
}