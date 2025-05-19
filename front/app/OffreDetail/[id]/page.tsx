"use client"; // Ensure this is at the top

import Navbar from "../../components/Nav";
import OffreSearch from "../../components/Search"; // Changed import to OffreSearch
import OffreImages from "../../components/OffreDetails/Images";
import Detail from "../../components/OffreDetails/Detail";
import Maps from "../../components/OffreDetails/Maps";
import ChatBot from "../../components/Chat/Chatbot";
import Footer from "@/app/components/Footer";
import { useEffect, useState } from "react";
import eventService from "../../services/Offres";
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function OffreDetail() {
    const { id } = useParams();
    const offreId = Array.isArray(id) ? id[0] : id;

    const [offre, setOffre] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [priceRange, setPriceRange] = useState<[number | null, number | null]>([null, null]);
    const [surfaceRange, setSurfaceRange] = useState<[number | null, number | null]>([null, null]);
    const [locationFilter, setLocationFilter] = useState<string>("");
    const [surfaceFilterEnabled, setSurfaceFilterEnabled] = useState(false);

    const router = useRouter(); // Initialize useRouter

    useEffect(() => {
        if (!offreId) return;

        const fetchOffre = async () => {
            try {
                const data = await eventService.getOffre(offreId);
                setOffre(data);

            } catch (error) {
                console.error("Error fetching offer:", error);
            }
        };

        fetchOffre();
    }, [offreId]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // Redirect to the Offres page with the search query
        router.push(`/OffrePage?search=${query}`);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        // Redirect to the Offres page with the category
        router.push(`/OffrePage?category=${category}`);
    };

    const applyFilters = (filters: any) => {
        setPriceRange(filters.priceRange);
        setSurfaceRange(filters.surfaceRange);
        setLocationFilter(filters.locationFilter);
        setSurfaceFilterEnabled(filters.surfaceFilterEnabled);
        setFiltersApplied(true);
        // Construct a URL with all the filter parameters
        const params = new URLSearchParams();
        if (filters.priceRange[0] !== null) params.append('priceMin', filters.priceRange[0].toString());
        if (filters.priceRange[1] !== null) params.append('priceMax', filters.priceRange[1].toString());
        if (filters.surfaceRange[0] !== null) params.append('surfaceMin', filters.surfaceRange[0].toString());
        if (filters.surfaceRange[1] !== null) params.append('surfaceMax', filters.surfaceRange[1].toString());
        if (filters.locationFilter) params.append('location', filters.locationFilter);
        if (filters.surfaceFilterEnabled) params.append('surfaceEnabled', 'true');
        router.push(`/OffrePage?${params.toString()}`);
    };

    const resetFilters = () => {
        setPriceRange([null, null]);
        setSurfaceRange([null, null]);
        setLocationFilter("");
        setSearchQuery("");
        setSelectedCategory("all");
        setFiltersApplied(false);
        setSurfaceFilterEnabled(false);
        router.push('/OffrePage'); // Redirect to Offres page without any filters
    };

    return (
        <>
        <Navbar />
        <section className=" min-h-screen">
            <div className=" bg-gradient-to-b from-teal-600 to-white ">
            <OffreSearch // Use OffreSearch component
                onSearch={handleSearch}
                onCategoryChange={handleCategoryChange}
                selectedCategory={selectedCategory}
                onFiltersApply={applyFilters}
                resetFilters={resetFilters}
                filtersApplied={filtersApplied}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                surfaceRange={surfaceRange}
                setSurfaceRange={setSurfaceRange}
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
                surfaceFilterEnabled={surfaceFilterEnabled}
                setSurfaceFilterEnabled={setSurfaceFilterEnabled}
            /></div>
            {/* <div className="overflow-y-auto h-[1200px]"> */}
            {offre ? (
                <>
                    <OffreImages images={offre.images} titre={offre.titre} />
                    <Detail offre={offre} /> {/* Pass entire offre object to Detail */}
                    {/* {offre.localisation && <Maps localisation={offre.localisation} />} Ensure localisation exists */}
                </>
            ) : (
                <p>Loading images...</p>
            )}

            {/* <ChatBot /> */}
            <Footer />
            {/* </div> */}
        </section></>

    );
}