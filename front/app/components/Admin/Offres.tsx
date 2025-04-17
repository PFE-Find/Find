import React, { useState } from 'react'
import SidBar from './SideBar'
import Navbar from './NavBar'
import Link from 'next/link'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiChevronDown, FiExternalLink, FiRefreshCw } from 'react-icons/fi'
import { Offer } from '../../types/Offer'

interface OffresProps {
    offres: Offer[]
    isLoading: boolean
    error: string | null
    onRefresh: () => void
}

const Offres: React.FC<OffresProps> = ({
    offres,
    isLoading,
    error,
    onRefresh
}) => {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    const filteredOffers = offres.filter((offer) => {
        const matchesCategory =
            selectedCategory === 'all' || offer.propertyType === selectedCategory
        const matchesSearch = offer.titre
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

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
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Offers Management</h1>
                        <motion.button
                            onClick={onRefresh}
                            whileHover={{ rotate: 360 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-white shadow-md"
                            aria-label="Refresh offers"
                        >
                            <FiRefreshCw className={`text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
                        </motion.button>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 mb-6 text-red-600 bg-red-50 rounded-lg"
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
                                placeholder="Search offers..."
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>

                        <div className="relative w-full md:w-48">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 cursor-pointer"
                            >
                                <option value="all">All Categories</option>
                                <option value="land">Land</option>
                                <option value="farm">Farm</option>
                                <option value="property">Property</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <FiChevronDown className="text-gray-400" />
                            </div>
                        </div>
                    </motion.div>

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
                                Offers Table
                            </motion.div>
                        </div>

                        {isLoading ? (
                            <div className="py-16 flex justify-center items-center">
                                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="overflow-y-auto max-h-[594px]">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMAGE</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITLE</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CATEGORY</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <AnimatePresence>
                                            {filteredOffers.map((offre) => (
                                                <motion.tr
                                                    key={offre._id}
                                                    variants={rowVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit={{ opacity: 0 }}
                                                    whileHover={{ scale: 1.01 }}
                                                    className="border-b hover:bg-gray-50 transition-all duration-200"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <motion.div
                                                            whileHover={{ scale: 1.05 }}
                                                            className="w-20 h-16 rounded-lg overflow-hidden shadow-md"
                                                        >
                                                            <img
                                                                src={offre.images?.[0]?.path || "/default-image.jpg"}
                                                                alt={offre.titre}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </motion.div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{offre.titre}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500 capitalize">{offre.propertyType}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {format(new Date(offre.createdAt), 'MMM dd, yyyy | hh:mm a')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <motion.span
                                                            whileHover={{ scale: 1.05 }}
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center ${offre.statut === true
                                                                    ? "bg-green-100 text-green-800"
                                                                    :  "bg-yellow-100 text-yellow-800"
                                                                         
                                                                }`}
                                                        >
                                                            {offre.statut === true ? "Accepted" :  "Pending"}
                                                        </motion.span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <motion.div
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Link
                                                                href={`/components/Admin/DetailOffre/${offre._id}`}
                                                                prefetch={false}
                                                                className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                                                            >
                                                                View <FiExternalLink className="ml-1" />
                                                            </Link>
                                                        </motion.div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>

                                {filteredOffers.length === 0 && !isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-12 text-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className="inline-block p-6 bg-gray-100 rounded-xl"
                                        >
                                            <div className="text-gray-500 text-lg">
                                                No offers found. Try adjusting your filters or search query.
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </main>
        </motion.div>
    )
}

export default Offres