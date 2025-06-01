"use client";

import React, { useState } from "react";
import SidBar from "./SideBar";
import Link from "next/link";
import { Home, Users, Settings, User, ShoppingCart, DollarSign, Bell, Search, LogIn, UserPlus, Table } from "lucide-react";
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from "framer-motion";
import Image from 'next/image';
import { IMG_URL } from "../../services/URLService";

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
    { name: 'Accueil', href: '/', protected: false },
    { name: 'Paramètres', href: '/profile', protected: false },
    { name: 'Explorer', href: '/OffrePage', protected: false },
    { name: 'Àpropos', href: '/aboutUs', protected: false },
    { name: 'Notifications', href: '/Notification', protected: true },
    { name: 'Contact', href: '/Chat', protected: true }
  ];
  return (
    <div className="grid bg-opacity-80 bg-white shadow-md fixed w-[83%] rounded-lg ">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Breadcrumb */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center"
        >
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/logo.png"
              alt="Find Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="ml-3 text-2xl font-bold text-teal-600">Find</span>
          </Link>
        </motion.div>

        {/* Search and Actions */}

        <div className="flex items-center space-x-4">



          {/* Icons */}

          {/* User/Auth Controls */}
          <div className="flex items-center">
            {session ? (
              <div className="relative ml-8 mr-8">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  {session.user?.image ? (
                    <img
                      className="w-16 h-16 rounded-full object-cover border-2 border-green-100"
                      src={
                        session.user.image.startsWith('/uploads')
                          ? `${IMG_URL}${session.user.image}`
                          : session.user.image
                      }
                      alt="User profile"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-green-100 bg-gray-200 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z"
                        />
                      </svg>
                    </div>
                  )}
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

                          {item.name}
                        </Link>
                      ))}

                      <button
                        onClick={() => signOut()}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiLogOut className="mr-2" />
                        Déconnexion
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