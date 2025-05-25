import React, { useEffect, useState } from 'react'
import SidBar from './SideBar'
import Navbar from './NavBar'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiChevronDown, FiExternalLink, FiRefreshCw, FiTrash2 } from 'react-icons/fi'
import CommentService from '@/app/services/Comment'

interface Comment {
    _id: string;
    postId: string;
    userId: string;
    text: string;
    status: string;
    date: Date;
    user?: {
        username: string;
        email: string;
    };
}

interface CommentProps {
    comments?: Comment[];
    isLoading?: boolean;
    error?: string | null;
    onRefresh?: () => void;
    onDelete?: (commentId: string) => void;
}

const Comments: React.FC<CommentProps> = ({
    comments: initialComments = [],
    isLoading: initialLoading = false,
    error: initialError = null,
    onRefresh: externalRefresh,
    onDelete: externalDelete
}) => {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [selectedStatus, setSelectedStatus] = useState<string>('all')
    const [selectedComment, setSelectedComment] = useState<string>('')
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [isLoading, setIsLoading] = useState<boolean>(initialLoading)
    const [error, setError] = useState<string | null>(initialError)

    const filteredComments = comments.filter((comment) => {
        const matchesStatus = selectedStatus === 'all' || comment.status === selectedStatus
        const matchesSearch = comment.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (comment.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        return matchesStatus && matchesSearch
    })

    const handleDeleteComment = (id: string) => {
        setSelectedComment(id)
        deleteComment(id)
    }

    const fetchComments = async () => {
        setIsLoading(true)
        try {
            const data = await CommentService.getComments()
            setComments(data)  
            setError(null)
        } catch(error) {
            console.error('Erreur lors de la récupération des commentaires:', error)
            setError('Erreur lors de la récupération des commentaires')
        } finally {
            setIsLoading(false)
        }
    }

    const refreshComments = () => {
        fetchComments()
        if (externalRefresh) externalRefresh()
    }

    useEffect(() => {
        fetchComments()
    }, [])

    const deleteComment = async (id: string) => {
        try {
            await CommentService.deleteComment(id)
            alert('Commentaire supprimé avec succès!')
            if (externalDelete) externalDelete(id)
            fetchComments() // Refresh the list after deletion
        } catch (error) {
            console.error('Erreur lors de la suppression du commentaire:', error)
            alert('Erreur lors de la suppression du commentaire!')
        }
    }

    // Animation variants
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

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    }

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    }

    return (
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
                    <motion.div variants={fadeIn} className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestion des Commentaires</h1>
                        <motion.button
                            onClick={refreshComments}
                            whileHover={{ rotate: 360 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                            aria-label="Rafraîchir les commentaires"
                        >
                            <FiRefreshCw className={`text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
                        </motion.button>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 mb-6 text-red-600 bg-red-50 rounded-lg border border-red-100"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.div
                        variants={fadeIn}
                        className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
                    >
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                onChange={(e) => setSearchQuery(e.target.value)}
                                value={searchQuery}
                                placeholder="Rechercher des commentaires..."
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                            />
                        </div>

                        <div className="w-full md:w-48 relative">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 cursor-pointer hover:border-gray-400"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="active">Actif</option>
                                <option value="pending">En attente</option>
                                <option value="deleted">Supprimé</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeIn}
                        className="overflow-hidden rounded-2xl shadow-xl bg-white"
                    >
                        <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold text-lg px-6 py-4 rounded-t-lg">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center"
                            >
                                <span className="mr-2">💬</span>
                                Liste des Commentaires
                            </motion.div>
                        </div>

                        <div className="p-6">
                            {isLoading ? (
                                <div className="py-16 flex justify-center items-center">
                                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="ml-3 text-gray-600">Chargement...</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <AnimatePresence>
                                        {filteredComments.map((comment) => (
                                            <motion.div
                                                key={comment._id}
                                                variants={cardVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit={{ opacity: 0 }}
                                                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-200 hover:border-blue-200"
                                            >
                                                <div className="p-5">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <motion.span
                                                            whileHover={{ scale: 1.05 }}
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center ${
                                                                comment.status === 'active' 
                                                                    ? "bg-green-100 text-green-800" 
                                                                    : comment.status === 'pending'
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {comment.status === 'active' ? 'Actif' : 
                                                             comment.status === 'pending' ? 'En attente' : 'Supprimé'}
                                                        </motion.span>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                                                            aria-label="Supprimer le commentaire"
                                                        >
                                                            <FiTrash2 />
                                                        </motion.button>
                                                    </div>

                                                    <div className="mb-4">
                                                        {comment.user && (
                                                            <p className="text-sm font-medium text-gray-700 mb-1">
                                                                Par: {comment.user.username} ({comment.user.email})
                                                            </p>
                                                        )}
                                                        <p className="text-sm text-gray-500 mb-2 line-clamp-3">
                                                            {comment.text}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {format(new Date(comment.date), 'PPPp', { locale: fr })}
                                                        </p>
                                                    </div>

                                                    <motion.div
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="mt-4"
                                                    >
                                                        <Link
                                                            href={`/post/${comment.postId}`}
                                                            prefetch={false}
                                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium group"
                                                            target="_blank"
                                                        >
                                                            Voir la publication
                                                            <FiExternalLink className="ml-1 transition-transform group-hover:translate-x-0.5" />
                                                        </Link>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}

                            {filteredComments.length === 0 && !isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-12 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="inline-block p-6 bg-gray-50 rounded-xl border border-gray-200"
                                    >
                                        <div className="text-gray-500 text-lg">
                                            Aucun commentaire trouvé. Essayez d'ajuster vos filtres ou votre recherche.
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </motion.div>
    )
}

export default Comments