'use client';
import Nav from "@/app/components/Nav";
import Footer from "../components/Footer";
import "../styles/Profile.css";
import { useSession, updateSession } from 'next-auth/react';
import OffresSection from "./OffreSection";
import { useEffect, useState } from "react";
import eventService from "../services/Offres";
import UserService from "../services/User";
import { FiUser, FiEdit2, FiSave, FiX, FiPlus, FiAlertCircle, FiLock, FiPhone, FiMail } from "react-icons/fi";
import { toast } from 'react-toastify';

export default function Profile() {
    const { data: session, update } = useSession();
    const [offres, setOffres] = useState<any[]>([]);
    const [offres2, setOffres2] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(session?.user?.name || '');
    const [editedEmail, setEditedEmail] = useState(session?.user?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(session?.user?.phone || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState(session?.user?.image || '');

    const id_user = session?.user?._id || session?.user?.user?._id;
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);

    useEffect(() => {
        async function fetchOffres() {
            if (session?.user?._id) {
                const offres2 = await eventService.getAllOffresByUserId(session.user._id);
                setOffres2(offres2);
            }
        }
        async function fetchOffres2() {
            if (session?.user?._id) {
                const offres = await eventService.getAllOffresByUserId2(session.user._id);
                setOffres(offres);
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
            setPhoneNumber(userData.phone || '');
            setPreviewImage(userData.image || '');
            setIsPhoneVerified(userData.phoneVerified || false);
        }
    }, [session]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const validatePassword = () => {
        const errors = [];
        if (newPassword.length < 8) {
            errors.push("Le mot de passe doit contenir au moins 8 caractères");
        }
        if (!/[A-Z]/.test(newPassword)) {
            errors.push("Le mot de passe doit contenir au moins une majuscule");
        }
        if (!/[0-9]/.test(newPassword)) {
            errors.push("Le mot de passe doit contenir au moins un chiffre");
        }
        if (newPassword !== confirmPassword) {
            errors.push("Les mots de passe ne correspondent pas");
        }
        setPasswordErrors(errors);
        return errors.length === 0;
    };

    const handleSendVerification = async () => {
        try {
            toast.success("Code de vérification envoyé à votre téléphone");
            setShowVerification(true);
        } catch (error) {
            toast.error("Erreur lors de l'envoi du code de vérification");
        }
    };

    const handleVerifyPhone = async () => {
        try {
            setIsPhoneVerified(true);
            setShowVerification(false);
            toast.success("Numéro de téléphone vérifié avec succès");
            await update();
        } catch (error) {
            toast.error("Code de vérification incorrect");
        }
    };

    const handleSave = async () => {
        try {
            const user = session?.user?.user || session?.user;

            if (!user) {
                console.error('No user session found');
                return;
            }

            const updatedUserData: any = {
                name: editedName,
                email: editedEmail,
                phone: phoneNumber,
            };

            if (selectedImage) {
                updatedUserData.image = selectedImage;
            }

            const updatedUser = await UserService.UpadetUser(user._id, updatedUserData);

            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: updatedUser.name || editedName,
                    email: updatedUser.email || editedEmail,
                    phone: phoneNumber,
                    image: updatedUser.image || previewImage,
                }
            });

            setPreviewImage(updatedUser.image || previewImage);
            toast.success('Profil mis à jour avec succès');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Erreur lors de la mise à jour du profil');
        }
    };

    const handlePasswordChange = async () => {
        if (!validatePassword()) return;

        try {
            const user = session?.user?.user || session?.user;
            if (!user) {
                console.error('No user session found');
                return;
            }

            await UserService.changePassword(user._id, {
                currentPassword,
                newPassword
            });

            toast.success('Mot de passe changé avec succès');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordErrors([]);
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Erreur lors du changement de mot de passe');
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
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Nav />
            <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col xl:flex-row gap-6">
                    {/* Left Side - Profile Card */}
                    <div className="w-full xl:w-1/3 xl:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                            <div className="p-4 sm:p-6 flex flex-col items-center">
                                {/* Profile Photo (Editable) */}
                                <div className="relative group mb-4 sm:mb-6">
                                    <label className="cursor-pointer group">
                                        {previewImage ? (
                                            <div className="relative">
                                                <img
                                                    src={previewImage?.startsWith('/uploads') 
                                                        ? `http://localhost:3001${previewImage}`
                                                        : previewImage}
                                                    className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-full border-4 ${isEditing ? 'border-blue-300' : 'border-white'
                                                        } shadow-lg transition-all duration-300 ${isEditing ? 'ring-2 ring-blue-500' : ''
                                                        }`}
                                                    alt="Profile"
                                                    onError={(e) => {
                                                        const img = e.target as HTMLImageElement;
                                                        img.style.display = 'none';
                                                        const fallbackContainer = document.createElement('div');
                                                        fallbackContainer.className = `w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-2 ${isEditing ? 'border-blue-500' : 'border-green-200'
                                                            } bg-gray-100 flex items-center justify-center relative`;
                                                        const userIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                                                        userIcon.setAttribute('viewBox', '0 0 24 24');
                                                        userIcon.setAttribute('fill', 'none');
                                                        userIcon.setAttribute('stroke', 'currentColor');
                                                        userIcon.setAttribute('stroke-width', '2');
                                                        userIcon.setAttribute('stroke-linecap', 'round');
                                                        userIcon.setAttribute('stroke-linejoin', 'round');
                                                        userIcon.classList.add('w-16', 'h-16', 'sm:w-20', 'sm:h-20', 'text-gray-400');
                                                        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                                                        path.setAttribute('d', 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2');
                                                        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                                                        circle.setAttribute('cx', '12');
                                                        circle.setAttribute('cy', '7');
                                                        circle.setAttribute('r', '4');
                                                        userIcon.appendChild(path);
                                                        userIcon.appendChild(circle);
                                                        fallbackContainer.appendChild(userIcon);
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
                                            <div className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-2 ${isEditing ? 'border-blue-500' : 'border-green-200'
                                                } bg-gray-100 flex items-center justify-center relative transition-all duration-300 ${isEditing ? 'ring-2 ring-blue-500' : ''
                                                }`}>
                                                <FiUser className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" />
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

                                {/* Profile Summary */}
                                <div className="text-center w-full">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 truncate max-w-full">{session?.user?.name}</h2>
                                    <p className="text-gray-600 mb-2 flex items-center justify-center gap-2 truncate max-w-full">
                                        <FiMail className="text-gray-400 flex-shrink-0" /> 
                                        <span className="truncate">{session?.user?.email}</span>
                                    </p>
                                    {phoneNumber && (
                                        <p className="text-gray-600 mb-2 flex items-center justify-center gap-2 truncate max-w-full">
                                            <FiPhone className="text-gray-400 flex-shrink-0" /> 
                                            <span className="truncate">{phoneNumber}</span>
                                            {isPhoneVerified && (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex-shrink-0">
                                                    Vérifié
                                                </span>
                                            )}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500 mb-4">
                                        Membre depuis: {formatDate(session?.user?.createdAt || '')}
                                    </p>
                                </div>

                                {/* Edit Profile Button */}
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`w-full mt-4 sm:mt-6 px-4 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all hover:shadow-md ${
                                        isEditing 
                                            ? 'bg-gray-500 text-white hover:bg-gray-600'
                                            : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                    }`}
                                >
                                    <FiEdit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    {isEditing ? 'Annuler' : 'Modifier le profil'}
                                </button>
                            </div>
                        </div>

                        {/* Verification Status */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-4 sm:mt-6">
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                                    <span className="bg-blue-100 p-1.5 rounded-full">
                                        <img src="/assets/verif.png" width={16} height={16} alt="Verified" />
                                    </span>
                                    Vérifications
                                </h3>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                                        <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 flex-shrink-0">
                                            <img src="/assets/verif.png" width={16} height={16} alt="Verified" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">Email vérifiée</p>
                                            <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                                        </div>
                                    </div>
                                    {isPhoneVerified ? (
                                        <div className="flex items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                                            <div className="bg-green-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 flex-shrink-0">
                                                <img src="/assets/verif.png" width={16} height={16} alt="Verified" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">Téléphone vérifié</p>
                                                <p className="text-xs text-gray-500 truncate">{phoneNumber}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                                            <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 flex-shrink-0">
                                                <FiPhone className="text-yellow-600 w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">Téléphone non vérifié</p>
                                                {phoneNumber ? (
                                                    <p className="text-xs text-gray-500 truncate">{phoneNumber}</p>
                                                ) : (
                                                    <p className="text-xs text-gray-500 truncate">Aucun numéro ajouté</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Profile Editing Section */}
                    <div className="w-full xl:w-2/3 xl:w-3/4 space-y-4 sm:space-y-6">
                        {isEditing ? (
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 sm:p-6">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 pb-3 sm:pb-4 border-b border-gray-200">
                                        Modifier les informations du profil
                                    </h1>

                                    <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                                        {/* Personal Information Section */}
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Informations personnelles</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        value={editedName}
                                                        onChange={(e) => setEditedName(e.target.value)}
                                                        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                                                    <input
                                                        id="email"
                                                        type="email"
                                                        value={editedEmail}
                                                        onChange={(e) => setEditedEmail(e.target.value)}
                                                        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Phone Number Section */}
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Numéro de téléphone</h3>
                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                                <div className="flex-1">
                                                    <input
                                                        type="tel"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                                                        placeholder="+33 6 12 34 56 78"
                                                    />
                                                </div>
                                                {phoneNumber && !isPhoneVerified && (
                                                    <button
                                                        onClick={handleSendVerification}
                                                        className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap text-sm sm:text-base"
                                                    >
                                                        Vérifier le numéro
                                                    </button>
                                                )}
                                            </div>
                                            {showVerification && (
                                                <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                                                    <h4 className="text-sm font-medium text-blue-800 mb-1 sm:mb-2">Vérification du téléphone</h4>
                                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                                        <input
                                                            type="text"
                                                            value={verificationCode}
                                                            onChange={(e) => setVerificationCode(e.target.value)}
                                                            className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-blue-200 rounded-lg text-sm sm:text-base"
                                                            placeholder="Code de vérification"
                                                        />
                                                        <button
                                                            onClick={handleVerifyPhone}
                                                            className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap text-sm sm:text-base"
                                                        >
                                                            Confirmer le code
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Change Password Section */}
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Changer le mot de passe</h3>
                                            <div className="space-y-2 sm:space-y-3">
                                                <div>
                                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                                                    <input
                                                        id="currentPassword"
                                                        type="password"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                                                    <input
                                                        id="newPassword"
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                                                    <input
                                                        id="confirmPassword"
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                                                    />
                                                </div>
                                                {passwordErrors.length > 0 && (
                                                    <div className="p-2 sm:p-3 bg-red-50 rounded-lg text-red-600 text-xs sm:text-sm">
                                                        <ul className="list-disc pl-4 sm:pl-5">
                                                            {passwordErrors.map((error, index) => (
                                                                <li key={index}>{error}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={handlePasswordChange}
                                                    className="w-full bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm sm:text-base"
                                                    disabled={!currentPassword || !newPassword || !confirmPassword || passwordErrors.length > 0}
                                                >
                                                    Changer le mot de passe
                                                </button>
                                            </div>
                                        </div>

                                        {/* Save/Cancel Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                                            <button
                                                onClick={handleSave}
                                                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium transition-all hover:shadow-md text-sm sm:text-base"
                                            >
                                                Enregistrer
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium transition-all hover:shadow-md text-sm sm:text-base"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {/* Annonces Sections */}
                        <div className="space-y-4 sm:space-y-6">
                            {/* Pending Offers Section */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                            Annonces en attente
                                        </h3>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                                            {offres.length} en attente
                                        </span>
                                    </div>
                                    <div className="items-center justify-center">
                                        {offres.length > 0 ? (
                                            <OffresSection offres={offres} />
                                        ) : (
                                            <div className="w-full max-w-md py-12 px-4 text-center">
                                                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-50 mb-4">
                                                    <FiPlus className="h-10 w-10 text-blue-500" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900">Pas d'annonces en attente</h3>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Commencez par créer une nouvelle annonce pour la voir apparaître ici.
                                                </p>
                                                <div className="mt-6">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                                                        Nouvelle annonce
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Published Offers Section */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                            Annonces publiées
                                        </h3>
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                                            {offres2.length} publiées
                                        </span>
                                    </div>
                                    <div className=" justify-center">
                                        {offres2.length > 0 ? (
                                            <OffresSection offres={offres2} />
                                        ) : (
                                            <div className="w-full max-w-md py-12 px-4 text-center">
                                                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-50 mb-4">
                                                    <FiAlertCircle className="h-10 w-10 text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900">Aucune annonce publiée</h3>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Vous n'avez pas encore publié d'annonces sur la plateforme.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}