'use client';

import { useState, ChangeEvent } from 'react';
import "../../globals.css";



export default function Example() {
    const [progress, setProgress] = useState(15);
    const [text, setText] = useState("");

    const handleChange =  (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (event.target.value.length <= 32) {
            setText(event.target.value);
        }
    };

    return (
        <div className="flex flex-col bg-white">
            

            {/* Main Content */}
            <div className="flex-1 flex-col place-content-center container mx-auto mt-32">
                <h2 className="text-2xl font-semibold text-center mb-2">
                    À présent, donnez un titre à votre annonce (ex. : terrain agricole, matériel agricole, ferme)
                </h2>
                <h2 className="text-md text-center mb-10 w-70">
                    Les titres courts et précis sont généralement les plus efficaces. N'hésitez pas, vous pourrez toujours le modifier plus tard.
                </h2>

                <div className="flex flex-col items-center justify-center w-[700px] container mx-auto">
                    <textarea 
                        id="message" 
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Write your thoughts here..."
                        value={text}
                        onChange={handleChange}
                        maxLength={32}
                    ></textarea>
                    <p className="text-gray-500 text-sm mt-2">{text.length}/32 caractères</p>
                </div>
            </div>

            
        </div>
    );
}
