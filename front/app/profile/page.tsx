'use client';
import Nav from "@/app/components/Nav";
import Footer from "../components/Footer";
import "../styles/Profile.css";
import { useSession, updateSession } from 'next-auth/react'; // Import updateSession
import OffresSection from "./OffreSection";
import { useEffect, useState } from "react";
import eventService from "../services/Offres";
import UserService from "../services/User";
import { FiUser, FiEdit2, FiSave, FiX, FiPlus, FiAlertCircle } from "react-icons/fi";
import { log } from "console";

export default function Profile() {
    const { data: session, update,status } = useSession();


    const [offres, setOffres] = useState<any[]>([]);
    const [offres2, setOffres2] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(session?.user?.name || '');
    const [editedEmail, setEditedEmail] = useState(session?.user?.email || '');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState(session?.user?.image || '');
    console.log(previewImage);
    
    
    useEffect(() => {
        async function fetchOffres() {
            if (session?.user?.id) {
                try {
                    const offres2 = await eventService.getAllOffresByUserId(session.user.id);
                    setOffres2(offres2);
                } catch (error) {
                    console.error("Error fetching offres:", error);
                }
            }
        }
        async function fetchOffres2() {
            if (session?.user?.id) {
                try {
                    const offres = await eventService.getAllOffresByUserId2(session.user.id);
                    setOffres(offres);
                } catch (error) {
                    console.error("Error fetching offres2:", error);
                }
            }
        }
        fetchOffres2();
        fetchOffres();
    }, [session]);

    useEffect(() => {
        const userData = session?.user?.user || session?.user;

        if (userData) {
            setEditedName(userData.name || '');
            setEditedEmail(userData.email || '');
            setPreviewImage(userData.image || '');

        }
    }, [session]);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }


    };




    const handleSave = async () => {
        try {
            const user = session?.user?.user || session?.user;
            console.log(user);
            
            if (!user) {
                console.error('No user session found');
                return;
            }

            // Create a JSON object for the update
            const updatedUserData = {
                name: editedName,
                email: editedEmail,
            };

            if (selectedImage) {
                updatedUserData.image = selectedImage;
            }

            // 1. Update user in the database
            const updatedUser = await UserService.UpadetUser(user._id, updatedUserData);

            // 2. Update the NextAuth.js session
            await update();
            updateSession(async ({ session }) => {
                return {
                    ...session,
                    user: {
                        ...session.user,
                        name: updatedUser.name || editedName,
                        email: updatedUser.email || editedEmail,
                        image: updatedUser.image || previewImage,
                    },
                };
            });

            // 3. Update local state
            setPreviewImage(updatedUser.image || previewImage);

            console.log('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            // Add error handling UI here
        }
    };

    const formatDate = (dateString: string | Date) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Nav />
            <div className="container mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Side - Profile Card */}
                    <div className="min-w-[400px] space-y-6">
                        <div className="bg-white min-w-[00px] rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                            <div className="p-6 flex flex-col items-center">
                                <div className="relative group mb-6">
                                    <label className="cursor-pointer group">
                                        {previewImage ? (
                                            <div className="relative">
                                                <img
                                                   src={previewImage?.startsWith('/uploads') 
                                                    ? `http://localhost:3001${previewImage}`
                                                    : previewImage}
                                                    className={`w-[200px] h-[200px] object-cover rounded-full border-4 ${isEditing ? 'border-blue-300' : 'border-white'
                                                        } shadow-lg transition-all duration-300 ${isEditing ? 'ring-2 ring-blue-500' : ''
                                                        }`}
                                                    alt="Profile"
                                                    onError={(e) => {
                                                        const img = e.target as HTMLImageElement;
                                                        img.style.display = 'none';

                                                        // Create fallback container
                                                        const fallbackContainer = document.createElement('div');
                                                        fallbackContainer.className = `w-[200px] h-[200px] rounded-full border-2 ${isEditing ? 'border-blue-500' : 'border-green-200'
                                                            } bg-gray-100 flex items-center justify-center relative`;

                                                        // Create user icon
                                                        const userIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                                                        userIcon.setAttribute('viewBox', '0 0 24 24');
                                                        userIcon.setAttribute('fill', 'none');
                                                        userIcon.setAttribute('stroke', 'currentColor');
                                                        userIcon.setAttribute('stroke-width', '2');
                                                        userIcon.setAttribute('stroke-linecap', 'round');
                                                        userIcon.setAttribute('stroke-linejoin', 'round');
                                                        userIcon.classList.add('w-[100px]', 'h-[100px]', 'text-gray-400');

                                                        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                                                        path.setAttribute('d', 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2');

                                                        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                                                        circle.setAttribute('cx', '12');
                                                        circle.setAttribute('cy', '7');
                                                        circle.setAttribute('r', '4');

                                                        userIcon.appendChild(path);
                                                        userIcon.appendChild(circle);
                                                        fallbackContainer.appendChild(userIcon);

                                                        // Add edit overlay if needed
                                                        if (isEditing) {
                                                            const editOverlay = document.createElement('div');
                                                            editOverlay.className = 'absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-full';

                                                            const editText = document.createElement('span');
                                                            editText.className = 'text-white font-medium text-sm';
                                                            editText.textContent = 'Changer la photo';

                                                            editOverlay.appendChild(editText);
                                                            fallbackContainer.appendChild(editOverlay);
                                                        }

                                                        img.parentNode?.insertBefore(fallbackContainer, img);
                                                    }}
                                                />
                                                {isEditing && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <span className="text-white font-medium text-sm">Changer la photo</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className={`w-[200px] h-[200px] rounded-full border-2 ${isEditing ? 'border-blue-500' : 'border-green-200'
                                                } bg-gray-100 flex items-center justify-center relative transition-all duration-300 ${isEditing ? 'ring-2 ring-blue-500' : ''
                                                }`}>
                                                <FiUser className="w-[100px] h-[100px] text-gray-400" />
                                                {isEditing && (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <span className="text-gray-700 font-medium text-sm">Ajouter une photo</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {isEditing && (
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        )}
                                    </label>
                                </div>

                                {isEditing ? (
                                    <div className="w-full space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Votre nom"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={editedEmail}
                                                onChange={(e) => setEditedEmail(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Votre email"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {(() => {
                                            const userData = session?.user?.user || session?.user;

                                            return userData ? (
                                                <>
                                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{userData.name}</h2>
                                                    <p className="text-gray-600 mb-2">{userData.email}</p>
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        Membre depuis: {formatDate(userData.createdAt || '')}
                                                    </p>
                                                </>
                                            ) : null;
                                        })()}
                                    </>

                                )}

                                <div className="flex gap-3 mt-6 w-full">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all hover:shadow-md"
                                            >
                                                <FiSave className="w-5 h-5" /> Enregistrer
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all hover:shadow-md"
                                            >
                                                <FiX className="w-5 h-5" /> Annuler
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all hover:shadow-md"
                                        >
                                            <FiEdit2 className="w-5 h-5" /> Modifier le profil
                                        </button>
                                    )}
                                </div>

                                {/* Stats Section */}
                                <div className="mt-8 w-full">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h3>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-100">
                                            <p className="text-2xl font-bold text-blue-600">13</p>
                                            <p className="text-xs text-gray-600">Évaluations</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-100">
                                            <p className="text-2xl font-bold text-green-600">4.65</p>
                                            <p className="text-xs text-gray-600">Note globale</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-100">
                                            <p className="text-2xl font-bold text-purple-600">7</p>
                                            <p className="text-xs text-gray-600">Mois d'expérience</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Verification Section */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="bg-blue-100 p-1.5 rounded-full">
                                        <img src="/assets/verif.png" width={16} height={16} alt="Verified" />
                                    </span>
                                    Vérifications
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                                            <img src="/assets/verif.png" width={16} height={16} alt="Verified" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Email vérifiée</p>
                                            <p className="text-xs text-gray-500">{session?.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                                            <img src="/assets/verif.png" width={16} height={16} alt="Verified" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Téléphone vérifié</p>
                                            <p className="text-xs text-gray-500">+33 6 12 34 56 78</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="lg:w-[60%]  space-y-6">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-gray-800 pb-4 border-b border-gray-200">
                                    Informations sur {session?.user?.name}
                                </h1>

                                <h3 className="text-xl font-bold text-gray-800 mt-6 mb-4">Commentaires</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {offres.length > 0 ? (
                                        offres.map((post) => (
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
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                                            <FiAlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                                            <h4 className="text-lg font-medium text-gray-600">Aucun commentaire trouvé</h4>
                                            <p className="text-gray-500 mt-2">Vous n'avez pas encore reçu de commentaires</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Annonces Sections */}
                        <div className="space-y-6">
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
                                    {offres.length > 0 ? (
                                        <OffresSection offres={offres} />
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-lg">
                                            <FiPlus className="w-12 h-12 text-gray-400 mb-4" />
                                            <h4 className="text-lg font-medium text-gray-600">Aucune annonce en attente</h4>
                                            <p className="text-gray-500 mt-2">Vous n'avez pas d'annonces en attente d'approbation</p>
                                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                                Créer une annonce
                                            </button>
                                        </div>
                                    )}
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
                                    {offres2.length > 0 ? (
                                        <OffresSection offres={offres2} />
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-lg">
                                            <FiAlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                                            <h4 className="text-lg font-medium text-gray-600">Aucune annonce publiée</h4>
                                            <p className="text-gray-500 mt-2">Vous n'avez pas encore publié d'annonces</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}