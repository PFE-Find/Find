import React, { useState, useEffect } from "react";

const MapEmbed = () => {
    const [searchTerm, setSearchTerm] = useState(""); // To store the search term
    const [loading, setLoading] = useState(false); // For loading state
    const [error, setError] = useState(""); // To store error message
    const [suggestions, setSuggestions] = useState([]); // For storing autocomplete suggestions
    const [modalIsOpen, setModalIsOpen] = useState(false); // For managing modal visibility

    const googleMapsApiKey = 'AIzaSyBwuWweetgIP1ZiyM-ttW0a6ARGdrkvij8'; // Replace with your Google Maps API key
    const [mapUrl, setMapUrl] = useState('https://www.google.com/maps/embed/v1/place?q=Bizerte,+Tunisie&key=' + googleMapsApiKey); // Default map URL

    // Function to search for a country and update map
    const searchCountry = async () => {
        setLoading(true);
        setError(""); // Reset error

        try {
            const countryName = searchTerm.trim();

            if (!countryName) {
                setError("Please enter a valid country name.");
                setLoading(false);
                return;
            }

            // Construct Google Maps URL for the country
            const encodedCountryName = encodeURIComponent(countryName); // Encode the search term to handle special characters/spaces
            const newMapUrl = `https://www.google.com/maps/embed/v1/place?q=${encodedCountryName}&key=${googleMapsApiKey}`;
            setMapUrl(newMapUrl); // Update the map URL dynamically

        } catch (err) {
            setError("Failed to load map. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch autocomplete suggestions from the backend API
    const fetchSuggestions = async (query: string) => {
        if (query.trim() === "") {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`/api/fetchSuggestions?query=${query}`);
            const data = await response.json();
            if (data.error) {
                console.error(data.error);
                return;
            }
            setSuggestions(data);
            setModalIsOpen(true); // Open modal when suggestions are available
        } catch (err) {
            console.error("Error fetching autocomplete suggestions:", err);
        }
    };

    // Handle input change for autocomplete
    const handleInputChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setSearchTerm(value);
        fetchSuggestions(value); // Fetch suggestions when the input changes
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: any) => {
        setSearchTerm(suggestion); // Set the selected suggestion as the search term
        setSuggestions([]); // Clear the suggestions after selection
        setModalIsOpen(false); // Close the modal
        searchCountry(); // Trigger the search for the selected country
    };

    useEffect(() => {
        // Clean up suggestions when the component is unmounted or searchTerm changes
        return () => setSuggestions([]);
    }, []);

    return (
        <div className="flex flex-col items-center space-y-4" style={{ width: '100%' }}>
            {/* Search Input */}
            <div className="flex-1 flex-col items-center w-full max-w-lg">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Enter country name..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        className="w-full p-4 pr-36 text-sm text-gray-900 border border-gray-300 rounded-3xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        required
                    />
                    
                    <button
                        onClick={searchCountry}
                        disabled={loading}
                        className="absolute end-1.5 bottom-1.5 inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-green-700 rounded-3xl border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-blue-700 dark:focus:ring-green-800"
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

            </div>

            {/* Suggestions Modal */}
            {modalIsOpen && suggestions.length > 0 && (
                <div className="absolute top-16 left-0 w-full max-w-lg bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <ul>
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="cursor-pointer p-2 hover:bg-gray-200"
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Map */}
            <div style={{ overflow: "hidden", resize: "none", maxWidth: "100%", width: "500px", height: "500px" }}>
                <div id="my-map-display" style={{ height: "100%", width: "100%", maxWidth: "100%" }}>
                    <iframe
                        style={{ height: "100%", width: "100%", border: "0" }}
                        frameBorder="0"
                        id="map-iframe"
                        src={mapUrl} // Use the dynamically updated map URL
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default MapEmbed;
