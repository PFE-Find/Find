'use client';

import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect, useMemo, useCallback } from "react";
import { useMultistepForm } from "./useMultistepForm";
import dynamic from 'next/dynamic';
import eventService from "../services/Offres";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";


// Chargement dynamique des composants pour améliorer les performances
const Page1 = dynamic(() => import("../components/FormComponents/Page1"), { loading: () => <Loader /> });
const Page2 = dynamic(() => import("../components/FormComponents/Page2"), { loading: () => <Loader /> });
const Page3 = dynamic(() => import("../components/FormComponents/Page3"), { loading: () => <Loader /> });
const Page4 = dynamic(() => import("../components/FormComponents/Page4"), { loading: () => <Loader /> });
const Page5 = dynamic(() => import("../components/FormComponents/Page5"), { loading: () => <Loader /> });
const Page6 = dynamic(() => import("../components/FormComponents/Page6"), { loading: () => <Loader /> });
const Page7 = dynamic(() => import("../components/FormComponents/Page7"), { loading: () => <Loader /> });
const Page8 = dynamic(() => import("../components/FormComponents/Page8"), { loading: () => <Loader /> });
const Page9 = dynamic(() => import("../components/FormComponents/Page9"), { loading: () => <Loader /> });
const Page10 = dynamic(() => import("../components/FormComponents/Page10"), { loading: () => <Loader /> });
const Page11 = dynamic(() => import("../components/FormComponents/Page11"), { loading: () => <Loader /> });
const Page12 = dynamic(() => import("../components/FormComponents/Page12"), { loading: () => <Loader /> });
const Page13 = dynamic(() => import("../components/FormComponents/Page13"), { loading: () => <Loader /> });

const stepsLabels = [
    "Décrivez votre bien",
    "Mettez en valeur votre bien",
    "Finalisez et publiez"
];

type FormData = {
    titre: string;
    description: string;
    prix: string;
    Superficie: string;
    unit: string;
    id_user: string;
    placeName: string;
    localisation: [number, number];
    equipements: string[];
    etat: string;
    photos: string[];
    propertyType: string;
    propertyId: number | null;
};

const INITIAL_DATA: FormData = {
    titre: "",
    Superficie: "",
    unit: "",
    propertyType: "",
    propertyId: null,
    description: "",
    prix: "",
    id_user: "",
    placeName: "Tunis, Tunisia",
    localisation: [36.8065, 10.1815],
    equipements: [],
    etat: "",
    photos: [],
};
export const Loader = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
export default function FormPages() {
    const router = useRouter();
    const [data, setData] = useState<FormData>(INITIAL_DATA);
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: session, status } = useSession();

    // Optimisation: Utilisation de useMemo pour éviter les recalculs inutiles
    const memoizedStepsLabels = useMemo(() => stepsLabels, []);
    const currentUserId = session?.user?.user?._id || session?.user?._id || null;
    useEffect(() => {
        if (currentUserId) {
            setData(prevData => ({
                ...prevData,
                id_user: currentUserId,
            }));
        }
    }, [session]);

    useEffect(() => {
        localStorage.removeItem('uploadedPhotos');
        localStorage.removeItem('selectedEquipment');
    }, []);

    const updateFields = useCallback((fields: Partial<FormData>) => {
        setData(prev => ({ ...prev, ...fields }));
    }, []);
// components/Loader.tsx

    const submitFields = useCallback(async () => {
        setIsSubmitting(true);
        try {
            await eventService.addOffre(data);
            
            await Swal.fire({
                title: "Succès !",
                text: "Offre ajoutée avec succès !",
                icon: "success",
                confirmButtonText: "Aller au profil",
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                    popup: "bg-white shadow-lg rounded-lg",
                    title: "text-lg font-bold text-gray-800",
                    confirmButton: "bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
                }
            });

            router.push("/profile");
        } catch (error) {
            console.error("Error adding event:", error);
            Swal.fire({
                title: "Erreur",
                text: "Une erreur est survenue lors de l'ajout de l'offre.",
                icon: "error",
                confirmButtonText: "Réessayer",
                customClass: {
                    popup: "bg-white shadow-lg rounded-lg",
                    title: "text-lg font-bold text-red-600",
                    confirmButton: "bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [data, router]);

    const getStepClass = useCallback((stepGroupIndex: number, currentStepIndex: number) => {
        if (stepGroupIndex === 0 && currentStepIndex <= 3) return "text-green-600 border-green-600";
        if (stepGroupIndex === 1 && currentStepIndex >= 4 && currentStepIndex <= 8) return "text-green-600 border-green-600";
        if (stepGroupIndex === 2 && currentStepIndex >= 9) return "text-green-600 border-green-600";
        return "text-gray-400 border-gray-400";
    }, []);

    // Optimisation: Construction dynamique des validateCurrentStep avec useMemo
    const pages = useMemo(() => {
        const basePages = [
            <Page1 key="page1" />,
            <Page2 key="page2" propertyType={data.propertyType} propertyId={data.propertyId} updateFields={updateFields} />,
            <Page3 key="page3" data={data} updateFields={updateFields} />,
            ...(data.propertyType !== "Material" 
                ? [<Page4 key="page4" data={data} updateFields={updateFields} />] 
                : [<Page13 key="page13" data={data} updateFields={updateFields} />]
            ),
            <Page5 key="page5" />,
            <Page8 key="page8" titre={data.titre} updateFields={updateFields} />,
            <Page7 key="page7" data={data} updateFields={updateFields} />,
        ];

        if (data.propertyType !== "Material") {
            basePages.push(<Page6 key="page6" equipements={data.equipements} updateFields={updateFields} />);
        }

        basePages.push(
            <Page10 key="page10" data={data} updateFields={updateFields} />,
            <Page11 key="page11" />,
            <Page9 key="page9" data={data} updateFields={updateFields} />,
            <Page12 key="page12" data={data} updateFields={updateFields} />
        );

        return basePages;
    }, [data, updateFields]);

    const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } = useMultistepForm(pages);

    const validationRules = useMemo(() => {
        const rules: Record<number, (data: FormData) => string[]> = {};
        let stepIndex = 1;

        rules[stepIndex++] = (data) => {
            const errors = [];
            if (!data.propertyType) errors.push("Veuillez spécifier le type de propriété.");
            return errors;
        };

        stepIndex++; // Skip Page2

        rules[stepIndex++] = (data) => {
            const errors = [];
            if (data.propertyType !== "Material" && !data.Superficie) {
                errors.push("Veuillez indiquer la superficie de votre bien.");
            } else if (data.propertyType === "Material" && !data.etat) {
                errors.push("Veuillez indiquer l'état de votre bien.");
            }
            return errors;
        };

        stepIndex++; // Skip Page4/Page13

        rules[stepIndex++] = (data) => {
            const errors = [];
            if (!data.titre) errors.push("Le titre de l'annonce est obligatoire.");
            return errors;
        };

        rules[stepIndex++] = (data) => {
            const errors = [];
            if (data.photos.length < 5) {
                errors.push("Veuillez ajouter au moins 5 photos pour compléter votre annonce.");
            }
            return errors;
        };

        if (data.propertyType !== "Material") {
            rules[stepIndex++] = (data) => {
                const errors = [];
                if (!data.equipements || data.equipements.length === 0) {
                    errors.push("Veuillez sélectionner au moins un équipement.");
                }
                return errors;
            };
        }

        rules[stepIndex++] = (data) => {
            const errors = [];
            if (!data.description) {
                errors.push("Merci d'ajouter une description détaillée de votre bien.");
            }
            return errors;
        };

        stepIndex++;

        rules[stepIndex++] = (data) => {
            const errors = [];
            if (!data.prix) {
                errors.push("Veuillez indiquer le prix de vente.");
            }
            return errors;
        };

        return rules;
    }, [data.propertyType]);

    const validateCurrentStep = useCallback((): boolean => {
        const validate = validationRules[currentStepIndex];
        if (!validate) return true;

        const stepErrors = validate(data);
        setErrors(stepErrors);

        return stepErrors.length === 0;
    }, [currentStepIndex, data, validationRules]);

    const handleNext = useCallback((e: FormEvent) => {
        e.preventDefault();
        if (validateCurrentStep()) {
            next();
        }
    }, [next, validateCurrentStep]);

    const progress = useMemo(() => (currentStepIndex / (steps.length - 1)) * 100, [currentStepIndex, steps.length]);

    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
        <div className="flex items-center justify-between w-full">
            <ol className="flex items-center justify-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white  shadow-xs dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                {stepsLabels.map((label, index) => (
                    <li key={index} className={`flex items-center ${getStepClass(index, currentStepIndex)}`}>
                    <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${getStepClass(index, currentStepIndex)}`}>
                        {index + 1}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                    {index !== memoizedStepsLabels.length - 1 && (
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
        

            {/* Contenu principal */}
            <main className="flex-1 ">
                {step}
            </main>

            {/* Pied de page avec navigation */}
            <form onSubmit={handleNext} className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="w-full  pb-2 p-5">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                <div className="px-4 py-4 flex justify-between items-center max-w-[80%] mx-auto">
                    <button
                        onClick={back}
                        disabled={isFirstStep}
                        className={`px-4 py-2 text-gray-600 rounded-lg ${isFirstStep ? 'opacity-0' : 'hover:text-green-600 hover:bg-gray-50'}`}
                        type="button"
                    >
                        Retour
                    </button>

                    {!isLastStep ? (
                        <button
                            type="submit"
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            {isFirstStep ? "Commencer" : "Continuer"}
                        </button>
                    ) : (
                        <button
                            onClick={submitFields}
                            disabled={isSubmitting}
                            type="button"
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Publication...
                                </span>
                            ) : "Publier l'annonce"}
                        </button>
                    )}
                </div>
            </form>

            {/* Affichage des erreurs */}
            {errors.length > 0 && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 text-yellow-800 bg-yellow-100 px-6 py-3 rounded-lg shadow-lg animate-fade-in">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            {errors.map((error, index) => (
                                <p key={index} className="text-sm">{error}</p>
                            ))}
                        </div>
                    </div>
                </div>
            )}
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
        </div>
    );
}