'use client';
import Nav from "@/app/components/Nav"
import Footer from "../components/Footer"
import "../styles/Profile.css";
import { useSession } from 'next-auth/react';
import OffresSection from "./OffreSection"
import { useEffect, useState } from "react";
import eventService from "../services/Offres";
import { FiUser } from "react-icons/fi";

export default function Profile() {
    const { data: session, status } = useSession();
    const [offres, setOffres] = useState<any[]>([]);
    const [offres2, setOffres2] = useState<any[]>([]);

    useEffect(() => {
        async function fetchOffres() {
            if (session?.user?.id) {
                try {
                    
                    const offres2 = await eventService.getAllOffresByUserId(session.user.id);
                    setOffres2(offres2);
                    console.log("Fetched offres:", offres);
                } catch (error) {
                    console.error("Error fetching offres:", error);
                }
            }
        }
        async function fetchOffres2() {
            if (session?.user?.id) {
                try {
                    console.log("Fetching offres for user ID:", session.user.id);
                    const offres = await eventService.getAllOffresByUserId2(session.user.id);
                    setOffres(offres);
                    
                    console.log("Fetched offres2:", offres);
                } catch (error) {
                    console.error("Error fetching offres2:", error);
                }
            }
        }
        fetchOffres2();
        fetchOffres();
    }, [session]);
      
    return (
        <div className="bg-gray-50 min-h-screen">
            <Nav />
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side - Profile Card */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                            <div className="p-6 flex flex-col items-center">
                            {session?.user?.image ? (
                                <img 
                                    src={session?.user?.image} 
                                    width={200} 
                                    height={200}
                                    className="rounded-full border-4 border-white shadow-lg mb-4"
                                    alt="Profile"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }} 
                                />
                                
                            ) : (
                                <div 
                                className="w-[200] h-[200] rounded-full border-2 border-green-200 bg-gray-100 flex items-center justify-center">
                                  <FiUser  className="w-[100] h-[100] text-gray-400" />
                                </div>
                              )}

                                <h2 className="text-2xl font-bold text-gray-800">{session?.user?.name}</h2>
                                <p className="text-gray-600 mb-4">{session?.user?.email}</p>
                                
                                <div className="grid grid-cols-3 gap-4 text-center w-full mt-4">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-2xl font-bold text-blue-600">13</p>
                                        <p className="text-sm text-gray-500">Évaluations</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="text-2xl font-bold text-green-600">4.65</p>
                                        <p className="text-sm text-gray-500">Note globale</p>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                        <p className="text-2xl font-bold text-purple-600">7</p>
                                        <p className="text-sm text-gray-500">Mois d'expérience</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Vérifications</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <div className="bg-green-100 p-2 rounded-full mr-3">
                                            <img src="/assets/verif.png" width={20} height={20} alt="Verified" />
                                        </div>
                                        <span className="text-gray-600">{session?.user?.email}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="bg-green-100 p-2 rounded-full mr-3">
                                            <img src="/assets/verif.png" width={20} height={20} alt="Verified" />
                                        </div>
                                        <span className="text-gray-600">Numéro de téléphone</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-gray-800 pb-4 border-b border-gray-200">
                                    Informations sur {session?.user?.name}
                                </h1>
                                
                                <h3 className="text-xl font-bold text-gray-800 mt-6 mb-4">Commentaires</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {offres.map((post) => (
                                        <div key={post.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-500">{post.date}</span>
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                    {post.category}
                                                </span>
                                            </div>
                                            <h4 className="font-semibold text-lg text-gray-800 mb-2">{post.title}</h4>
                                            <p className="text-gray-600 text-sm line-clamp-3">{post.description}</p>
                                            <div className="flex items-center mt-4">
                                                <img 
                                                    src="/assets/profile.png" 
                                                    alt="Author" 
                                                    className="w-8 h-8 rounded-full mr-2" 
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">Akram Zaabi</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Annonces Sections */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-800">
                                            Annonces en attente d'approbation
                                        </h3>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                            {offres.length} en attente
                                        </span>
                                    </div>
                                    <OffresSection offres={offres} />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-800">
                                            Annonces publiées
                                        </h3>
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                            {offres2.length} publiées
                                        </span>
                                    </div>
                                    <OffresSection offres={offres2} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}