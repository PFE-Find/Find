'use client'; // Ensures this runs only in the browser

import React, { useState, useEffect } from "react";
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
  const [suggestions, setSuggestions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState<[number, number]>(position || [51.505, -0.09]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (position) {
      setCurrentPosition(position);
    }
  }, [position]);

  const ClickHandler = ({ setPosition }: { setPosition: (pos: [number, number]) => void }) => {
    useMapEvents({
      click(e) {
        const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
        setPosition(newPos);
        setCurrentPosition(newPos);
      },
    });
    return null;
  };

  const searchCountry = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPos);
        setCurrentPosition(newPos);
        setSearchTerm(""); // Clear search term after selection
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

  const handleSuggestionClick = (suggestion: any) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    setModalIsOpen(false);
    searchCountry();
  };

  const handleInputChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSuggestions(value);
  };

  const fetchSuggestions = async (query: string) => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await response.json();

      if (data.length === 0) {
        setSuggestions([]);
      } else {
        setSuggestions(data.map((item: any) => item.display_name));
        setModalIsOpen(true);
      }
    } catch (err) {
      console.error("Error fetching autocomplete suggestions:", err);
    }
  };

  return (
    <div className="flex w-full" style={{ width: '100%' }}>
      {/* Map */}
      <div className="w-1/2 h-[400px] rounded-lg shadow-lg overflow-hidden relative flex-grow">
        <MapContainer center={currentPosition} zoom={6} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <ClickHandler setPosition={setPosition} />
          <Marker position={currentPosition} />
        </MapContainer>
      </div>

      {/* Search and Dropdown */}
      <div className="w-1/2 h-full flex flex-col items-center space-y-4">
        <div className="relative w-[80%] ">
          <input
            type="text"
            placeholder="Enter country name..."
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full p-4 pr-36 text-sm text-gray-900 border border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            required
          />
          <button
            onClick={searchCountry}
            disabled={loading}
            className="absolute right-1.5 bottom-1.5 inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-green-700 rounded-3xl border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-blue-700 dark:focus:ring-green-800"
          >
            <svg
              className="w-4 h-4 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            Rechercher
          </button>
        </div>

        {error && <p className="mt-2 text-red-500">{error}</p>}

        {/* Dropdown */}
        {modalIsOpen && (
          <div className="top-[310px] bg-white shadow-lg w-[80%] border">
            <ul className="max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}