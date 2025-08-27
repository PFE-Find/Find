import React, { useEffect, useState, useMemo, useCallback } from 'react';
import SidBar from './SideBar';
import Navbar from './NavBar';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiExternalLink, FiRefreshCw, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import CommentService from '@/app/services/Comment';

interface Comment {
    _id: string;
    OffreId: string;
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

const Comments: React.FC<CommentProps> = React.memo(({
    comments: initialComments = [],
    isLoading: initialLoading = false,
    error: initialError = null,
    onRefresh: externalRefresh,
    onDelete: externalDelete
}) => {
    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [comments, setComments] = useState(initialComments);
    const [isLoading, setIsLoading] = useState(initialLoading);
    const [error, setError] = useState(initialError);

    // Memoized data processing
    const filteredComments = useMemo(() => {
        return comments.filter(comment => {
            const matchesStatus = selectedStatus === 'all' || comment.status === selectedStatus;
            const matchesSearch = comment.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 (comment.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
            return matchesStatus && matchesSearch;
        });
    }, [comments, searchQuery, selectedStatus]);

    const groupedComments = useMemo(() => {
        return filteredComments.reduce((acc: Record<string, Comment[]>, comment) => {
            if (!acc[comment.OffreId]) acc[comment.OffreId] = [];
            acc[comment.OffreId].push(comment);
            return acc;
        }, {});
    }, [filteredComments]);

    // API calls
    const fetchComments = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await CommentService.getComments();
            setComments(data);
        } catch(error) {
            console.error('Error fetching comments:', error);
            setError('Error fetching comments');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteComment = useCallback(async (id: string) => {
        try {
            await CommentService.deleteComment(id);
            setComments(prev => prev.filter(comment => comment._id !== id));
            if (externalDelete) externalDelete(id);
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Error deleting comment!');
        }
    }, [externalDelete]);

    const refreshComments = useCallback(() => {
        fetchComments();
        if (externalRefresh) externalRefresh();
    }, [externalRefresh, fetchComments]);

    // Effects
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // Animation variants (simplified)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    // Render functions
    const renderCommentItem = useCallback((comment: Comment) => (
        <div key={comment._id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 mb-2">
            <div className="flex justify-between items-start mb-1">
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        comment.status === 'active' ? "bg-green-100 text-green-800" : 
                        comment.status === 'pending' ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                    }`}>
                        {comment.status === 'active' ? 'Actif' : 
                         comment.status === 'pending' ? 'En attente' : 'Supprimé'}
                    </span>
                </div>
                <button
                    onClick={() => deleteComment(comment._id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    aria-label="Delete comment"
                >
                    <FiTrash2 size={14} />
                </button>
            </div>
            
            {comment.user && (
                <p className="text-sm font-medium text-gray-700 mb-1">
                    Par: {comment.user.username} ({comment.user.email})
                </p>
            )}
            <p className="text-sm text-gray-600 mb-1">{comment.text}</p>
            <p className="text-xs text-gray-400">
                {format(new Date(comment.date), 'PPPp', { locale: fr })}
            </p>
        </div>
    ), [deleteComment]);

    const renderOfferCard = useCallback(([offreId, commentsForOffre]: [string, Comment[]]) => (
        <motion.div
            key={offreId}
            variants={cardVariants}
            className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4"
        >
            <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-semibold text-gray-800 truncate">
                        Offre ID: {offreId}
                    </h3>
                    <Link
                        href={`/components/Admin/Detail/${offreId}`}
                        prefetch={false}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        target="_blank"
                    >
                        <FiExternalLink size={14} className="ml-1" />
                    </Link>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {commentsForOffre.map(renderCommentItem)}
                </div>

                <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FiMessageSquare size={14} className="mr-1" />
                    <span>{commentsForOffre.length} commentaire{commentsForOffre.length > 1 ? 's' : ''}</span>
                </div>
            </div>
        </motion.div>
    ), [renderCommentItem]);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <SidBar children={undefined} />
            <main className="flex-1 p-4 md:p-6 overflow-hidden">
                <Navbar />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="mt-28"
                >
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestion des Commentaires</h1>
                        <button
                            onClick={refreshComments}
                            className="p-2 rounded-full bg-white shadow hover:shadow-md transition-shadow"
                            aria-label="Refresh comments"
                        >
                            <FiRefreshCw className={`text-blue-600 ${isLoading ? 'animate-spin' : ''}`} size={18} />
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 mb-4 text-red-600 bg-red-50 rounded-lg border border-red-100 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Search Input */}
                    <div className=" mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" size={16} />
                        </div>
                        <input
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                            placeholder="Rechercher des commentaires..."
                            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Comments List */}
                    <div className="rounded-lg shadow-sm bg-white overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-4 py-3">
                            <div className="flex items-center">
                                <span className="mr-2">💬</span>
                                <span>Commentaires groupés par offre</span>
                            </div>
                        </div>

                        <div className="p-4">
                            {isLoading ? (
                                <div className="py-12 flex justify-center items-center">
                                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : Object.entries(groupedComments).length > 0 ? (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={containerVariants}
                                    className="grid grid-cols-1 gap-4"
                                >
                                    <AnimatePresence>
                                        {Object.entries(groupedComments).map(renderOfferCard)}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <div className="py-8 text-center text-gray-500">
                                    Aucun commentaire trouvé
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
});

Comments.displayName = 'Comments';
export default Comments;