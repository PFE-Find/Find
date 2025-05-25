'use client'
import React, { useState, useMemo, useCallback } from 'react'
import SidBar from './SideBar'
import Navbar from './NavBar'
import Link from 'next/link'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiChevronDown, FiExternalLink, FiRefreshCw, FiEdit, FiTrash2, FiUser, FiUserCheck, FiUserX } from 'react-icons/fi'
import { User } from 'lucide-react'
import userService from '@/app/services/User'

interface UsersProps {
    users: User[]
    isLoading: boolean
    error: string | null
    onRefresh: () => void
    onEdit: (userId: string) => void
    onDelete: (userId: string) => void
}

interface User {
    _id: string
    name: string
    email: string
    role: number
    image: string
    createdAt: string
    status: 'active' | 'inactive' | 'suspended'
}

const UsersTable: React.FC<UsersProps> = ({
    users,
    isLoading,
    error,
    onRefresh,
    onEdit,
    onDelete
}) => {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [selectedRole, setSelectedRole] = useState<string>('all')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [userToDelete, setUserToDelete] = useState<string | null>(null)
    const [userToUpdate, setUserToUpdate] = useState<User | null>(null)
    const [selectedRoleUpdate, setSelectedRoleUpdate] = useState<number>(0)
    const [isProcessing, setIsProcessing] = useState(false)

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesRole = selectedRole === 'all' ||
                (selectedRole === '0' && user.role === 0) ||
                (selectedRole === '1' && user.role === 1) ||
                (selectedRole === '2' && user.role === 2)

            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())

            return matchesRole && matchesSearch
        })
    }, [users, searchQuery, selectedRole])

    // Variantes d'animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: 'beforeChildren'
            }
        }
    }

    const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3
            }
        }
    }

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    }

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value)
        },
        []
    )

    const handleRoleChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedRole(e.target.value)
        },
        []
    )

    const openDeleteConfirmation = (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setUserToDelete(id)
        setShowDeleteModal(true)
    }

    const openUpdateModal = (user: User, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setUserToUpdate(user)
        setSelectedRoleUpdate(user.role)
        setShowUpdateModal(true)
    }

    const closeModals = () => {
        setShowDeleteModal(false)
        setShowUpdateModal(false)
        setUserToDelete(null)
        setUserToUpdate(null)
        setIsProcessing(false)
    }

    const handleDelete = async () => {
        if (!userToDelete) return
        setIsProcessing(true)
        
        try {
            await userService.deleteUser(userToDelete)
            onDelete(userToDelete)
            closeModals()
            onRefresh()
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleUpdate = async () => {
        if (!userToUpdate || userToUpdate.role === selectedRoleUpdate) {
            closeModals()
            return
        }
        
        setIsProcessing(true)
        
        try {
            
            
            await userService.updateUserRole(userToUpdate._id, selectedRoleUpdate)
            
            closeModals()
            onRefresh()
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    const getRoleIcon = (role: number) => {
        switch(role) {
            case 1: return <FiUserCheck className="w-5 h-5 text-blue-600" />
            case 2: return <FiUserCheck className="w-5 h-5 text-purple-600" />
            default: return <FiUser className="w-5 h-5 text-gray-600" />
        }
    }

    return (
        <>
            {/* Modal de confirmation de suppression */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                            <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/20 p-6 border-b border-red-100 dark:border-red-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300">
                                        <FiTrash2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirmer la suppression</h3>
                                        <p className="text-sm text-red-600 dark:text-red-300 mt-1">Cette action est irréversible</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ? 
                                    <span className="block mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Toutes les données associées seront perdues et cette action ne peut pas être annulée.
                                    </span>
                                </p>
                                
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeModals}
                                        className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                                        disabled={isProcessing}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Suppression en cours...
                                            </>
                                        ) : (
                                            "Supprimer définitivement"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de mise à jour du rôle */}
            <AnimatePresence>
                {showUpdateModal && userToUpdate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20 p-6 border-b border-blue-100 dark:border-blue-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                                        <FiEdit className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mettre à jour le rôle</h3>
                                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">Modifier les permissions de l'utilisateur</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        {userToUpdate.image ? (
                                            <img
                                                src={userToUpdate.image.startsWith('/uploads')
                                                    ? `http://localhost:3001${userToUpdate.image}`
                                                    : userToUpdate.image}
                                                alt={userToUpdate.name}
                                                className="w-12 h-12 rounded-full object-cover shadow-md"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
                                                <User className="w-5 h-5 text-gray-500" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white">{userToUpdate.name}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{userToUpdate.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mt-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Rôle actuel :
                                            </label>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                {getRoleIcon(userToUpdate.role)}
                                                <span className="font-medium">
                                                    {userToUpdate.role === 0 ? "Utilisateur" :
                                                     userToUpdate.role === 1 ? "Administrateur" :
                                                     "Administrateur limité"}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Nouveau rôle :
                                            </label>
                                            <select
                                                value={selectedRoleUpdate}
                                                onChange={(e) => setSelectedRoleUpdate(Number(e.target.value))}
                                                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 cursor-pointer"
                                            >
                                                <option value={0}>Utilisateur</option>
                                                <option value={1}>Administrateur</option>
                                                <option value={2}>Administrateur limité</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeModals}
                                        className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-7 00 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                                        disabled={isProcessing}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                                        disabled={isProcessing || userToUpdate.role === selectedRoleUpdate}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Mise à jour...
                                            </>
                                        ) : (
                                            "Mettre à jour le rôle"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
            >
                <SidBar children={undefined} />

                <main className="flex-1 p-6 md:p-8 overflow-hidden">
                    <Navbar />

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="mt-28"
                    >
                        {/* Section d'en-tête */}
                        <motion.div variants={fadeIn} className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestion des utilisateurs</h1>
                            <motion.button
                                onClick={onRefresh}
                                whileHover={{ rotate: 360 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-full bg-white shadow-md"
                                aria-label="Rafraîchir les utilisateurs"
                                disabled={isLoading}
                            >
                                <FiRefreshCw className={`text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
                            </motion.button>
                        </motion.div>

                        {/* Affichage des erreurs */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 mb-6 text-red-600 bg-red-50 rounded-lg"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Section des filtres */}
                        <motion.div
                            variants={fadeIn}
                            className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
                        >
                            <div className="relative w-full md:w-96">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="text-gray-400" />
                                </div>
                                <input
                                    onChange={handleSearchChange}
                                    value={searchQuery}
                                    placeholder="Rechercher par nom ou email..."
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="w-full md:w-48">
                                <select
                                    value={selectedRole}
                                    onChange={handleRoleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 cursor-pointer"
                                    disabled={isLoading}
                                >
                                    <option value="all">Tous les rôles</option>
                                    <option value="1">Administrateur</option>
                                    <option value="0">Utilisateur</option>
                                    <option value="2">Administrateur limité</option>
                                </select>
                            </div>
                        </motion.div>

                        {/* Tableau des utilisateurs */}
                        <motion.div
                            variants={fadeIn}
                            className="overflow-hidden rounded-2xl shadow-xl bg-white"
                        >
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold text-lg">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Tableau des utilisateurs ({filteredUsers.length})
                                </motion.div>
                            </div>

                            {isLoading ? (
                                <div className="py-16 flex justify-center items-center">
                                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <div className="overflow-y-auto max-h-[594px]">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AVATAR</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOM</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RÔLE</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE D'INSCRIPTION</th>
                                              
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            <AnimatePresence>
                                                {filteredUsers.length > 0 ? (
                                                    filteredUsers.map((user) => (
                                                        <motion.tr
                                                            key={user._id}
                                                            variants={rowVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit={{ opacity: 0 }}
                                                            whileHover={{ scale: 1.01 }}
                                                            className="border-b hover:bg-gray-100 transition-all duration-200"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <motion.div
                                                                    whileHover={{ scale: 1.05 }}
                                                                    className="w-12 h-12 rounded-full overflow-hidden shadow-md relative"
                                                                >
                                                                    {user.image ? (
                                                                        <img
                                                                            src={user.image.startsWith('/uploads')
                                                                                ? `http://localhost:3001${user.image}`
                                                                                : user.image}
                                                                            alt={user.name}
                                                                            className="w-full h-full object-cover"
                                                                            loading="lazy"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex items-center justify-center w-full h-full bg-gray-200">
                                                                            <User className="w-6 h-6 text-gray-500" />
                                                                        </div>
                                                                    )}
                                                                </motion.div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {user.name}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-500">
                                                                    {user.email}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    {getRoleIcon(user.role)}
                                                                    <span className="text-sm text-gray-500 capitalize">
                                                                        {user.role === 0 ? "Utilisateur" :
                                                                         user.role === 1 ? "Administrateur" :
                                                                         "Administrateur limité"}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-500">
                                                                    {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : "N/A"}
                                                                </div>
                                                            </td>
                                                            
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3">
                                                                <motion.button
                                                                    onClick={(e) => openUpdateModal(user, e)}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                    aria-label="Modifier l'utilisateur"
                                                                >
                                                                    <FiEdit />
                                                                </motion.button>
                                                                <motion.button
                                                                    onClick={(e) => openDeleteConfirmation(user._id, e)}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    className="text-red-600 hover:text-red-800"
                                                                    aria-label="Supprimer l'utilisateur"
                                                                >
                                                                    <FiTrash2 />
                                                                </motion.button>
                                                            </td>
                                                        </motion.tr>
                                                    ))
                                                ) : (
                                                    <motion.tr
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="border-b"
                                                    >
                                                        <td colSpan={7} className="px-6 py-12 text-center">
                                                            <motion.div
                                                                initial={{ scale: 0.9 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ type: "spring", stiffness: 300 }}
                                                                className="inline-block p-6 bg-gray-100 rounded-xl"
                                                            >
                                                                <div className="text-gray-500 text-lg">
                                                                    Aucun utilisateur trouvé. Essayez d'ajuster vos filtres ou votre recherche.
                                                                </div>
                                                            </motion.div>
                                                        </td>
                                                    </motion.tr>
                                                )}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </main>
            </motion.div>
        </>
    )
}

export default UsersTable