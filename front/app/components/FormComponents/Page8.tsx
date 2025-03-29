'use client';

import { ChangeEvent } from 'react';
import "../../globals.css";

type FormData = {
    titre: string;
};

type UserFormProps = FormData & {
    updateFields: (fields: Partial<FormData>) => void;
};

export default function Example({
    titre,
    updateFields,
}: UserFormProps) {
    
    // Ensure titre is always a string
    const safeTitre = titre ?? ""; 

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value.slice(0, 32);
        updateFields({ titre: newValue });
    };

    return (
        <div className="flex flex-col bg-white">
            {/* Main Content */}
            <div className="flex flex-col items-center justify-center container mx-auto mt-32">
                <h2 className="text-2xl font-semibold text-center mb-2">
                    À présent, donnez un titre à votre annonce (ex. : terrain agricole, matériel agricole, ferme)
                </h2>
                <h2 className="text-md text-center mb-10 max-w-lg">
                    Les titres courts et précis sont généralement les plus efficaces. N'hésitez pas, vous pourrez toujours le modifier plus tard.
                </h2>

                <div className="flex flex-col items-center w-full max-w-[700px]">
                    <textarea
                        id="message"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Écrivez votre titre ici..."
                        value={safeTitre} // Always a string
                        onChange={handleChange}
                        maxLength={32}
                    ></textarea>
                    <p className="text-gray-500 text-sm mt-2">{safeTitre.length}/32 caractères</p>
                </div>
            </div>
        </div>
    );
}
