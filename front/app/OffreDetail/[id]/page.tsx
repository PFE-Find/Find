"use client"; // Ensure this is at the top

import Navbar from "../../components/Nav";
import Search from "../../components/OffrePage/Search";
import OffreImages from "../../components/OffreDetails/Images";
import Detail from "../../components/OffreDetails/Detail";
import Maps from "../../components/OffreDetails/Maps";
import ChatBot from "../../components/Chat/Chatbot";
import Footer from "@/app/components/Footer";
import { useEffect, useState } from "react";
import eventService from "../../services/Offres";
import { useParams } from 'next/navigation';

export default function OffreDetail() {
    const { id } = useParams();
    const offreId = Array.isArray(id) ? id[0] : id;
    

    const [offre, setOffre] = useState<any>(null);

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

    return (
        <>
            <Navbar />
            
            <Search />
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
            
            <ChatBot />
            <Footer />
            {/* </div> */}
        </>
    );
}
