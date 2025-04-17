'use client'
import React, { useState, useMemo, useCallback } from 'react'
import SidBar from './SideBar'
import Navbar from './NavBar'
import Link from 'next/link'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiChevronDown, FiExternalLink, FiRefreshCw, FiEdit, FiTrash2 } from 'react-icons/fi'

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
    role: string
    avatar?: string
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

    // Memoize filtered users to prevent unnecessary recalculations
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesRole = 
                selectedRole === 'all' || user.role === selectedRole
            const matchesSearch = 
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesRole && matchesSearch
        })
    }, [users, searchQuery, selectedRole])

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
                    {/* Header Section */}
                    <motion.div variants={fadeIn} className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">User Management</h1>
                        <motion.button
                            onClick={onRefresh}
                            whileHover={{ rotate: 360 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-white shadow-md"
                            aria-label="Refresh users"
                            disabled={isLoading}
                        >
                            <FiRefreshCw className={`text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
                        </motion.button>
                    </motion.div>

                    {/* Error Display */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 mb-6 text-red-600 bg-red-50 rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Filters Section */}
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
                                placeholder="Search by name or email..."
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="relative w-full md:w-48">
                            <select
                                value={selectedRole}
                                onChange={handleRoleChange}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 cursor-pointer"
                                disabled={isLoading}
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <FiChevronDown className="text-gray-400" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Users Table */}
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
                                Users Table ({filteredUsers.length})
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
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROLE</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JOINED</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
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
                                                        className="border-b hover:bg-gray-50 transition-all duration-200"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <motion.div
                                                                whileHover={{ scale: 1.05 }}
                                                                className="w-12 h-12 rounded-full overflow-hidden shadow-md"
                                                            >
                                                                <img
                                                                    src={user.avatar || "/default-avatar.png"}
                                                                    alt={user.name}
                                                                    className="w-full h-full object-cover"
                                                                    loading="lazy"
                                                                />
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
                                                            <div className="text-sm text-gray-500 capitalize">
                                                                {user.role}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {/* <div className="text-sm text-gray-500">
                                                                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                                                            </div> */}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <motion.span
                                                                whileHover={{ scale: 1.05 }}
                                                                className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center ${
                                                                    user.status === 'active'
                                                                        ? "bg-green-100 text-green-800"
                                                                        : user.status === 'inactive'
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-red-100 text-red-800"
                                                                }`}
                                                            >
                                                                {/* {user.status.charAt(0).toUpperCase() + user.status.slice(1)} */}
                                                            </motion.span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3">
                                                            <motion.button
                                                                onClick={() => onEdit(user._id)}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                aria-label="Edit user"
                                                            >
                                                                <FiEdit />
                                                            </motion.button>
                                                            <motion.button
                                                                onClick={() => onDelete(user._id)}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="text-red-600 hover:text-red-800"
                                                                aria-label="Delete user"
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
                                                                No users found. Try adjusting your filters or search query.
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
    )
}

export default UsersTable