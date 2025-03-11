"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

export default function LocationMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (typeof window !== "undefined" && window.google?.maps) {
                setIsLoaded(true);
                clearInterval(interval);
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Initialize the map once it's loaded
        if (isLoaded && mapRef.current) {
            const map = new google.maps.Map(mapRef.current, {
                center: { lat: 37.237, lng: 9.865 }, // Coordinates for Bizerte
                zoom: 12,
                mapTypeId: "roadmap",
            });

            new google.maps.Marker({
                position: { lat: 37.237, lng: 9.865 },
                map,
                title: "Menzel Abderrahmane",
            });
        }
    }, [isLoaded]);

    return (
        <div className="container mx-auto flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Où se situe le logement</h2>
            <div ref={mapRef} className="w-full h-72 rounded-lg shadow-md bg-gray-200">
                {!isLoaded && <p className="text-center mt-20">Chargement de la carte...</p>}
            </div>

            {/* Load the Google Maps API script dynamically */}
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`}
                strategy="afterInteractive"
                onLoad={() => console.log("Google Maps API loaded successfully")}
            />
        </div>
    );
}
