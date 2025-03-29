import { useEffect } from 'react';

const useGoogleMaps = (apiKey) => {
  useEffect(() => {
    const scriptId = 'google-maps-api';

    // Check if the script is already loaded
    if (document.getElementById(scriptId)) return;

    // Create a new script element
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script); // Cleanup on unmount
    };
  }, [apiKey]);
};

export default useGoogleMaps;
