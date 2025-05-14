'use client';
import { useEffect, useState } from "react";
import { Comment } from "@/app/models/Comment";
import CommentService from "@/app/services/Comment";
import UserService from "@/app/services/User";
import { FiMessageSquare, FiSend, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import dynamic from 'next/dynamic';

// Import dynamique du composant de dialogue pour le chargement différé
const Dialog = dynamic(() => import('./dialog'), {
  ssr: false,
  loading: () => null
});

interface CommentSectionProps {
  offreId: string;
  currentUserId: string | null;
}

interface CommentWithUser extends Comment {
  user?: {
    name: string;
    image: string;
  };
}

export default function CommentSection({ offreId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const comments = await CommentService.getComment(offreId);
        
        const commentsWithUsers = await Promise.all(
          comments.map(async (comment: Comment) => {
            try {
              const user = await UserService.getUserById(comment.userId);
              return {
                ...comment,
                user: {
                  name: user.name,
                  image: user.image?.startsWith('/uploads') 
                    ? `http://localhost:3001${user.image}`
                    : user.image || '/default-profile.png'
                }
              };
            } catch (error) {
              console.error(`Error fetching user ${comment.userId}:`, error);
              return {
                ...comment,
                user: {
                  name: `User ${comment.userId.slice(0, 4)}`,
                  image: '/default-profile.png'
                }
              };
            }
          })
        );

        setComments(commentsWithUsers);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error("Erreur lors du chargement des commentaires");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComments();
  }, [offreId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await CommentService.addComment({
        userId: currentUserId,
        OffreId: offreId,
        text: newComment
      });
      
      const updatedComments = await CommentService.getComment(offreId);
      
      const updatedCommentsWithUsers = await Promise.all(
        updatedComments.map(async (comment: Comment) => {
          try {
            const user = await UserService.getUserById(comment.userId);
            return {
              ...comment,
              user: {
                name: user.name,
                image: user.image?.startsWith('/uploads') 
                  ? `http://localhost:3001${user.image}`
                  : user.image || '/default-profile.png'
              }
            };
          } catch (error) {
            return {
              ...comment,
              user: {
                name: `User ${comment.userId.slice(0, 4)}`,
                image: '/default-profile.png'
              }
            };
          }
        })
      );
      
      setComments(updatedCommentsWithUsers);
      setNewComment('');
      toast.success("Commentaire publié avec succès!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Erreur lors de la publication du commentaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    
    try {
      await CommentService.deleteComment(commentToDelete);
      setComments(comments.filter(comment => comment._id !== commentToDelete));
      toast.success("Commentaire supprimé avec succès");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Erreur lors de la suppression du commentaire");
    } finally {
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <FiMessageSquare className="mr-2" /> Commentaires ({comments.length})
      </h3>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4 mb-8">
          {comments.map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-gray-50 rounded-lg relative group hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img 
                    src={comment.user?.image || '/default-profile.png'} 
                    alt={comment.user?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-profile.png';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700 truncate">
                      {comment.user?.name || `User ${comment.userId?.slice(-4)}`}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(comment.date || Date.now()).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap break-words">{comment.text}</p>
                </div>
              </div>
              
              {/* Delete button (only show for current user's comments) */}
              {currentUserId === comment.userId && (
                <button
                  onClick={() => openDeleteDialog(comment._id)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors group-hover:opacity-100 opacity-0"
                  aria-label="Supprimer le commentaire"
                >
                  <FiTrash2 size={18} />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          Aucun commentaire pour le moment. Soyez le premier à commenter !
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-6">
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            rows={3}
            placeholder="Partagez votre expérience..."
            required
            disabled={!currentUserId}
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!currentUserId || isSubmitting}
          className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Publication...
            </>
          ) : (
            <>
              <FiSend />
              {currentUserId ? 'Publier un commentaire' : 'Connectez-vous pour commenter'}
            </>
          )}
        </motion.button>
      </form>

      {/* Dialog de confirmation de suppression */}
      <AnimatePresence>
        {deleteDialogOpen && (
          <Dialog
            title="Supprimer le commentaire"
            message="Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible."
            onConfirm={handleDelete}
            onCancel={() => setDeleteDialogOpen(false)}
            confirmText="Supprimer"
            cancelText="Annuler"
            confirmColor="red"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}