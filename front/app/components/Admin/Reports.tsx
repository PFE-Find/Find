import React, { useEffect, useState } from 'react'
import SidBar from './SideBar'
import Navbar from './NavBar'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiChevronDown, FiExternalLink, FiRefreshCw, FiTrash2 } from 'react-icons/fi'
import reportService from '@/app/services/Report'

interface Report {
    _id: string;
    postId: string;
    userId: string;
    text: string;
    reason: string;
    status: string;
    OffreId: string;
    date: Date;
}

interface ReportProps {
    reports: Report[]
    isLoading: boolean
    error: string | null
    onRefresh: () => void
    onDelete: (reportId: string) => void
}

const Reports: React.FC<ReportProps> = ({
    reports,
    isLoading,
    error,
    onRefresh,
    onDelete
}) => {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedReport, setSelectedReport] = useState<string>('')
    const [Reports, setReports] = useState<any>(reports)

    const filteredReports = Reports.filter((report) => {
        const matchesCategory = selectedCategory === 'all' || report.reason[0] === selectedCategory
        const matchesSearch = report.reason[0].toLowerCase().includes(searchQuery.toLowerCase()) || 
                             report.text.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const handleDeleteReport = ((id: string) => {
        setSelectedReport(id)
        deleteReport(selectedReport)
    })

    const fetchReports = async () => {
        try {
            const data = await reportService.getReports()
            setReports(data)  
        } catch(error) {
            console.error('Erreur lors de la récupération des signalements:', error)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [])

    const deleteReport = async (data: any) => {
        try {
            await reportService.deleteReport(data)
            alert('Signalement supprimé avec succès!')
            fetchReports() // Rafraîchir la liste après suppression
        } catch (error) {
            console.error('Erreur lors de la suppression du signalement:', error)
            alert('Erreur lors de la suppression du signalement!')
        }
    }

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
            <SidBar />
            <main className="flex-1 p-6 md:p-8 overflow-hidden">
                <Navbar />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="mt-28"
                >
                    <motion.div variants={fadeIn} className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestion des Signalements</h1>
                        <motion.button
                            onClick={onRefresh}
                            whileHover={{ rotate: 360 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                            aria-label="Rafraîchir les signalements"
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
                                placeholder="Rechercher des signalements..."
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                            />
                        </div>

                        <div className="w-full md:w-48 relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 cursor-pointer hover:border-gray-400"
                            >
                                <option value="all">Toutes catégories</option>
                                <option value="spam">Spam</option>
                                <option value="misinformation">Désinformation</option>
                                <option value="harassment">Harcèlement</option>
                                <option value="inappropriate language">Langage inapproprié</option>
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
                                <span className="mr-2">📋</span>
                                Liste des Signalements
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
                                        {filteredReports.map((report) => (
                                            <motion.div
                                                key={report._id}
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
                                                                report.status === 'resolved' 
                                                                    ? "bg-green-100 text-green-800" 
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                        >
                                                            {report.status === 'resolved' ? 'Résolu' : 'En attente'}
                                                        </motion.span>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleDeleteReport(report._id)}
                                                            className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                                                            aria-label="Supprimer le signalement"
                                                        >
                                                            <FiTrash2 />
                                                        </motion.button>
                                                    </div>

                                                    <div className="mb-4">
                                                        <h3 className="text-lg font-semibold text-gray-800 capitalize mb-1">
                                                            {report.reason}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mb-2 line-clamp-3">
                                                            {report.text}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {format(new Date(report.date), 'PPPp', { locale: fr })}
                                                        </p>
                                                    </div>

                                                    <motion.div
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="mt-4"
                                                    >
                                                        <Link
                                                            href={`/components/Admin/DetailReport/${report._id}`}
                                                            prefetch={false}
                                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium group"
                                                        >
                                                            Voir les détails 
                                                            <FiExternalLink className="ml-1 transition-transform group-hover:translate-x-0.5" />
                                                        </Link>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}

                            {filteredReports.length === 0 && !isLoading && (
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
                                            Aucun signalement trouvé. Essayez d'ajuster vos filtres ou votre recherche.
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

export default Reports