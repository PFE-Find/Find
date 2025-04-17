'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiSettings, FiDollarSign, FiPlus, FiLogOut } from 'react-icons/fi';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tout Les Offres', href: '/OffrePage' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' }
  ];

  const userDropdownItems = [
    { icon: <FiUser className="mr-2" />, name: 'Dashboard', href: '/Admin/DashBoard' },
    { icon: <FiSettings className="mr-2" />, name: 'Settings', href: '/profile' },
    { icon: <FiDollarSign className="mr-2" />, name: 'Earnings', href: '/' },
    { icon: <FiPlus className="mr-2" />, name: 'Add Offre', href: '/FormPages' }
  ];

  return (
    <nav className="bg-white bg-opacity-90 shadow-sm w-full sticky top-0 z-50 backdrop-blur-sm p-4">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-700 hover:text-teal-600 transition-colors font-medium text-lg"
              >
                {link.name}
              </Link>
            ))}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/FormPages")}
              className="ml-4 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center"
            >
              <FiPlus className="mr-2" />
              Create new
            </motion.button>
          </div>

          {/* User/Auth Controls */}
          <div className="flex items-center">
            {session ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  {session.user?.image ? (
                    <img
                      className="w-16 h-16 rounded-full object-cover border-2 border-green-100"
                      src={session.user.image}
                      alt="User profile"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full border-2 border-green-100 bg-gray-100 flex items-center justify-center">
                      <FiUser className="w-8 h-8 text-gray-500" />
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
                  onClick={() => router.push('/signin')}
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

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden ml-4 p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none"
            >
              {menuOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiOutlineMenuAlt3 className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <button
                onClick={() => {
                  router.push("/FormPages");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-teal-600 hover:bg-teal-700"
              >
                <FiPlus className="mr-2" />
                Create new
              </button>

              {!session && (
                <div className="pt-4 pb-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      router.push('/login');
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      router.push('/signup');
                      setMenuOpen(false);
                    }}
                    className="w-full mt-2 px-3 py-2 rounded-md text-base font-medium text-white bg-teal-600 hover:bg-green-700"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}