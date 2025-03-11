'use client';

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Images() {
    const images = [
        "/assets/photo.jpg",
        "/assets/photo2.jpg",
        "/assets/photo3.jpg",
        "/assets/photo4.jpg",
    ];
    const [mainImage, setMainImage] = useState(images[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="p-4">
            <p className="container mx-auto text-3 xl text-gray-700 font-bold dark:text-gray-400 mt-5 mb-5">Magnifique farm  à bizerte Menzel  abd rahmen</p>
            <div className="container mx-auto flex flex-wrap md:flex-nowrap gap-4">
                {/* Main Image */}
                
                <div className="w-full md:w-2/3">
                    <img src={mainImage} alt="Main" className="w-full h-[592px] rounded-lg shadow-md object-cover" />
                </div>
                {/* Thumbnails */}
                <div className="w-full md:w-1/3 flex flex-col gap-2 relative">
                    {images.slice(1, 4).map((img, index) => (
                        <div key={index} className="relative">
                            <img
                                src={img}
                                alt={`Thumbnail ${index}`}
                                className="w-full h-48 object-cover rounded-md cursor-pointer opacity-75 hover:opacity-100 transition"
                                onClick={() => setMainImage(img)}
                            />
                            {/* Button over the last image */}
                            {index === images.slice(1, 4).length - 1 && (
                                <button
                                    className="absolute inset-0 bg-black bg-opacity-50 text-white text-center rounded-md flex items-center justify-center font-medium"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Afficher toutes les photos
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <p className="container mx-auto text-3 xl text-gray-700 font-bold dark:text-gray-400 mt-5 mb-5">Magnifique farm  à bizerte Menzel  abd rahmen</p>


            {/* Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
                    <button className="absolute top-2 right-2 p-2" onClick={() => setIsModalOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                    <div className="flex items-center justify-center">
                        <button className="p-2" onClick={prevImage}>
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        <img src={images[currentIndex]} alt="Modal" className="w-full h-[500px] object-cover rounded-md" />
                        <button className="p-2" onClick={nextImage}>
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
