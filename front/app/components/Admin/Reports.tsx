import React, { useEffect, useState, useMemo, useCallback } from 'react';
import SidBar from './SideBar';
import Navbar from './NavBar';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiExternalLink, FiRefreshCw, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import reportService from '@/app/services/Report';

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
    reports?: Report[];
    isLoading?: boolean;
    error?: string | null;
    onRefresh?: () => void;
    onDelete?: (reportId: string) => void;
}

const Reports: React.FC<ReportProps> = React.memo(({
    reports: initialReports = [],
    isLoading: initialLoading = false,
    error: initialError = null,
    onRefresh: externalRefresh,
    onDelete: externalDelete
}) => {
    // State management
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [reports, setReports] = useState<Report[]>(initialReports);
    const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
    const [error, setError] = useState<string | null>(initialError);

    // Memoized data processing
    const filteredReports = useMemo(() => {
        return reports.filter((report) => {
            const matchesCategory = selectedCategory === 'all' || report.reason[0] === selectedCategory;
            const matchesSearch = report.reason[0].toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 report.text.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [reports, searchQuery, selectedCategory]);

    const groupedReports = useMemo(() => {
        return filteredReports.reduce((acc: Record<string, Report[]>, report) => {
            if (!acc[report.OffreId]) {
                acc[report.OffreId] = [];
            }
            acc[report.OffreId].push(report);
            return acc;
        }, {});
    }, [filteredReports]);

    // API calls
    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await reportService.getReports();
            setReports(data);
        } catch(error) {
            console.error('Erreur lors de la récupération des signalements:', error);
            setError('Erreur lors de la récupération des signalements');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteReport = useCallback(async (id: string) => {
        try {
            await reportService.deleteReport(id);
            setReports(prev => prev.filter(report => report._id !== id));
            if (externalDelete) externalDelete(id);
        } catch (error) {
            console.error('Erreur lors de la suppression du signalement:', error);
            alert('Erreur lors de la suppression du signalement!');
        }
    }, [externalDelete]);

    const refreshReports = useCallback(() => {
        fetchReports();
        if (externalRefresh) externalRefresh();
    }, [externalRefresh, fetchReports]);

    // Effects
    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05, // Reduced stagger for better performance
                when: 'beforeChildren'
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 10 }, // Reduced y value for smoother animation
        visible: {
            opacity: 1,
            y: 0,
            transition: { 
                duration: 0.2, // Faster animation
                ease: "easeOut"
            }
        }
    };

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { 
                duration: 0.3 // Faster fade in
            } 
        }
    };

    // Render helpers
    const renderReportItem = useCallback((report: Report) => (
        <motion.div
            key={report._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-red-50 rounded-lg border border-red-100 mb-2"
        >
            <div className="flex justify-between items-start mb-1">
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        report.status === 'resolved' 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                    }`}>
                        {report.status === 'resolved' ? 'Résolu' : 'En attente'}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 capitalize">
                        {report.reason}
                    </span>
                </div>
                <button
                    onClick={() => deleteReport(report._id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                    aria-label="Supprimer le signalement"
                >
                    <FiTrash2 size={14} />
                </button>
            </div>
            <p className="text-sm text-gray-700 mb-1">{report.text}</p>
            <p className="text-xs text-gray-400">
                {format(new Date(report.date), 'PPPp', { locale: fr })}
            </p>
        </motion.div>
    ), [deleteReport]);

    const renderOfferCard = useCallback(([offreId, reportsForOffre]: [string, Report[]]) => (
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
                    {reportsForOffre.map(renderReportItem)}
                </div>

                <div className="mt-2 flex items-center text-sm text-red-500">
                    <FiAlertTriangle size={14} className="mr-1" />
                    <span>{reportsForOffre.length} signalement{reportsForOffre.length > 1 ? 's' : ''}</span>
                </div>
            </div>
        </motion.div>
    ), [renderReportItem]);

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
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestion des Signalements</h1>
                        <button
                            onClick={refreshReports}
                            className="p-2 rounded-full bg-white shadow hover:shadow-md transition-shadow"
                            aria-label="Rafraîchir les signalements"
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
                            placeholder="Rechercher des signalements..."
                            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Reports List */}
                    <div className="rounded-lg shadow-sm bg-white overflow-hidden">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold px-4 py-3">
                            <div className="flex items-center">
                                <FiAlertTriangle className="mr-2" size={16} />
                                <span>Signalements groupés par offre</span>
                            </div>
                        </div>

                        <div className="p-4">
                            {isLoading ? (
                                <div className="py-12 flex justify-center items-center">
                                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : Object.entries(groupedReports).length > 0 ? (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 gap-4"
                                >
                                    <AnimatePresence>
                                        {Object.entries(groupedReports).map(renderOfferCard)}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <div className="py-8 text-center text-gray-500">
                                    Aucun signalement trouvé
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
});

Reports.displayName = 'Reports';
export default Reports;