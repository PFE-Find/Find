"use client"; // Ensures this runs only in the browser

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});
export default function MapComponent({ position, setPosition }) {
  const ClickHandler = ({ setPosition }: { setPosition: (pos: [number, number]) => void }) => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        console.log(position);
         // Update state with clicked coordinates
      },
    });
    return null;
  };


  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCountry = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null); // Reset error state

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0]; // Get first result
        setPosition([parseFloat(lat), parseFloat(lon)]);

      } else {
        setError("Country not found. Try again!");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setError("Error fetching location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4" style={{ width: '100%' }}>
      {/* Search Input */}
      <div className="flex flex-col items-center w-full max-w-lg">
        <input
          type="text"
          placeholder="Enter country name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
        />
        <button
          onClick={searchCountry}
          disabled={loading}
          className="mt-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>

      {/* Map */}
      <div className="w-full max-w-xl h-[400px] rounded-lg shadow-lg overflow-hidden">
        <MapContainer center={position} zoom={6} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <ClickHandler setPosition={setPosition} />
          <Marker position={position} />
        </MapContainer>
      </div>
    </div>
  );


}