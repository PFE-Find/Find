"use client";

import React, { useState } from "react";
import SidBar from "./SideBar";
import Link from "next/link";
import { Home, Users, Settings, User, ShoppingCart, DollarSign, Bell, Search, LogIn, UserPlus, Table } from "lucide-react";
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from "framer-motion";

import { useSession, signOut } from 'next-auth/react';
import { FiDollarSign, FiLogOut, FiPlus, FiSettings, FiUser } from "react-icons/fi";


const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const userDropdownItems = [
    { icon: <FiUser className="mr-2" />, name: 'Home', href: '/' },
    { icon: <FiSettings className="mr-2" />, name: 'Settings', href: '/profile' },
    { icon: <FiDollarSign className="mr-2" />, name: 'Earnings', href: '/' },
    { icon: <FiPlus className="mr-2" />, name: 'Add Offre', href: '/FormPages' }
  ];
  return (
    <div className="grid bg-opacity-80 bg-white shadow-md fixed w-[83%] rounded-lg ">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Home</span>
          <span className="text-sm text-gray-500">/</span>
          <span className="text-sm text-gray-700 font-semibold">Home</span>
        </div>

        {/* Search and Actions */}

        <div className="flex items-center space-x-4">

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 text-sm border rounded-md shadow-sm w-64 focus:outline-none focus:ring focus:ring-gray-200"
            />
          </div>

          {/* Icons */}

          {/* User/Auth Controls */}
          <div className="flex items-center">
            {session ? (
              <div className="relative ml-8 mr-8">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    className="w-16 h-16 rounded-full object-cover border-2 border-green-100"
                    src={session.user?.image || '/default-avatar.png'}
                    alt="User profile"
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                      </div>

                      {userDropdownItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      ))}

                      <button
                        onClick={() => signOut()}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiLogOut className="mr-2" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/signup')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Register
                </motion.button>
              </div>
            )}
           
          </div>




        </div>
      </div>
    </div>
  );
};

export default Navbar;