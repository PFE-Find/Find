'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import debounce from "lodash.debounce";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Position {
  coordinates: [number, number];
  placeName: string;
}

interface MapComponentProps {
  position?: Position;
  setPosition: (pos: Position) => void;
  zoom?: number;
  className?: string;
}

const DEFAULT_POSITION: Position = {
  coordinates: [36.8065, 10.1815],
  placeName: "Tunis, Tunisia"
};

const FlyToMarker = ({ position, zoom }: { position: [number, number], zoom?: number }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, zoom || 12, {
        duration: 1, // Faster animation
        easeLinearity: 0.25
      });
    }
  }, [map, position, zoom]);

  return null;
};

const ClickHandler = ({ setPosition }: { setPosition: (pos: Position) => void }) => {
  const map = useMap();
  const [activePosition, setActivePosition] = useState<[number, number] | null>(null);

  const getPlaceName = useCallback(debounce(async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      setPosition({
        coordinates: [lat, lng],
        placeName: response.data.display_name || "Unknown Location",
      });
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setPosition({
        coordinates: [lat, lng],
        placeName: "Selected Location",
      });
    }
  }, 500), []);

  useMapEvents({
    mousemove: (e) => {
      const { lat, lng } = e.latlng;
      setActivePosition([lat, lng]);
    },
    click: (e) => {
      const { lat, lng } = e.latlng;
      getPlaceName(lat, lng);
      map.flyTo([lat, lng], map.getZoom(), {
        duration: 0.5
      });
    },
  });

  // Temporary marker for mouse position
  return activePosition ? <Marker position={activePosition} opacity={0.5} /> : null;
};

export default function EnhancedMapComponent({
  position,
  setPosition,
  zoom = 6,
  className = ""
}: MapComponentProps) {
  const [currentPosition, setCurrentPosition] = useState<Position>(DEFAULT_POSITION);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (position) {
      setCurrentPosition(position);
    } else {
      setCurrentPosition(DEFAULT_POSITION);
      setPosition(DEFAULT_POSITION);
    }
  }, [position, setPosition]);

  const searchLocation = useCallback(debounce(async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1`
      );

      if (response.data.length > 0) {
        const firstResult = response.data[0];
        const newPosition = {
          coordinates: [parseFloat(firstResult.lat), parseFloat(firstResult.lon)],
          placeName: firstResult.display_name
        };
        setPosition(newPosition);
        setCurrentPosition(newPosition);
        setSearchTerm(firstResult.display_name);
      } else {
        setError("Location not found. Try a more specific name.");
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Error during search. Please try again.");
    } finally {
      setLoading(false);
    }
  }, 500), []);

  const fetchSuggestions = useCallback(debounce(async (query: string) => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
      );
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Suggestions error:", err);
    }
  }, 300), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 2) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    const newPosition = {
      coordinates: [parseFloat(suggestion.lat), parseFloat(suggestion.lon)],
      placeName: suggestion.display_name
    };
    setSearchTerm(suggestion.display_name);
    setPosition(newPosition);
    setCurrentPosition(newPosition);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col lg:flex-row w-full h-full gap-4 p-4 bg-gray-50 rounded-xl ${className}`}>
      {/* Map */}
      <div className="w-full lg:w-1/2 h-96 lg:h-[500px] rounded-xl shadow-md overflow-hidden">
        <MapContainer
          center={currentPosition.coordinates}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          className="rounded-xl"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <FlyToMarker position={currentPosition.coordinates} zoom={zoom} />
          <ClickHandler setPosition={setPosition} />
          <Marker position={currentPosition.coordinates} />
        </MapContainer>
      </div>

      {/* Search and information */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-2">Location information</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <div className="mt-1 p-2 bg-gray-50 rounded">{currentPosition.placeName}</div>
          </div>
        </div>

        <div className="relative" ref={searchRef}>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for an address, city, country..."
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => e.key === 'Enter' && searchLocation(searchTerm)}
              className="flex-grow p-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => searchLocation(searchTerm)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={`${suggestion.place_id}-${index}`}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="font-medium">{suggestion.display_name}</div>
                    <div className="text-xs text-gray-500">{suggestion.type}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}