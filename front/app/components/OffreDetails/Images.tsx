"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageObject {
    path: string;
}

interface ImagesProps {
    images: ImageObject[];
    titre: string;
}

export default function Images({ images, titre }: ImagesProps) {
    if (!images || images.length === 0) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">Aucune image disponible</p>
            </div>
        );
    }

    const [mainImage, setMainImage] = useState(images[0].path);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="p-4 max-w-full md:max-w-[80%] mx-auto">
            {/* Main Image - Mobile First */}
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                {/* Main Image */}
                <div className="w-full lg:w-2/3 relative group">
                    <img 
                        src={mainImage} 
                        alt={titre} 
                        className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl shadow-lg object-cover transition-all duration-300 hover:shadow-xl cursor-pointer"
                        onClick={() => {
                            setCurrentIndex(images.findIndex(img => img.path === mainImage));
                            setIsModalOpen(true);
                        }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl"></div>
                </div>
                
                {/* Thumbnails - Stack vertically on mobile */}
                <div className="w-full lg:w-1/3 h-auto md:h-[600px] grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 md:gap-3">
                    {images.slice(0, 4).map((img, index) => (
                        <div 
                            key={index} 
                            className={`relative rounded-lg overflow-hidden transition-all duration-200 ${mainImage === img.path ? 'ring-2 md:ring-4 ring-blue-500' : ''}`}
                        >
                            <img
                                src={img.path}
                                alt={`Thumbnail ${index}`}
                                className={`w-full h-full object-cover cursor-pointer transition-all duration-200 ${mainImage === img.path ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
                                onClick={() => setMainImage(img.path)}
                            />
                            
                            {/* Button for last thumbnail */}
                            {index === 3 && images.length > 4 && (
                                <button
                                    className="absolute inset-0 bg-black bg-opacity-40 text-white flex items-center justify-center font-medium hover:bg-opacity-50 transition-all text-sm md:text-lg"
                                    onClick={() => {
                                        setCurrentIndex(0);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    +{images.length - 4} photos
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Modal - Responsive */}
            <Dialog 
                open={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            >
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
                
                <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                    <button 
                        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-1 sm:p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-md"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 dark:text-gray-100" />
                    </button>
                    
                    <div className="flex items-center justify-between h-full">
                        <button 
                            className="p-2 sm:p-4 z-10 text-gray-900 dark:text-gray-100 hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>
                        
                        <div className="flex-1 flex items-center justify-center h-full">
                            <img 
                                src={images[currentIndex].path} 
                                alt={`Slide ${currentIndex}`} 
                                className="max-w-full max-h-[80vh] object-contain p-2 sm:p-4"
                            />
                        </div>
                        
                        <button 
                            className="p-2 sm:p-4 z-10 text-gray-900 dark:text-gray-100 hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all"
                            onClick={nextImage}
                        >
                            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>
                    </div>
                    
                    <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center space-x-1 sm:space-x-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${currentIndex === idx ? 'bg-blue-600 sm:w-6' : 'bg-gray-300 dark:bg-gray-600'}`}
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`Aller à l'image ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </Dialog>
        </div>
    );
}