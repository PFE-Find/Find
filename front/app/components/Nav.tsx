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
  const router = useRouter();
  const { data: session } = useSession();


  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Explorer', href: '/OffrePage' },
    { name: 'àpropos', href: '/aboutUs' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/Chat' }
  ];

  const userDropdownItems = [
    ...(session?.user?.role === 1 || session?.user?.role === 2 ? [
      {
        icon: <FiUser className="mr-2" />,
        name: 'Tableau de bord',
        href: '/Admin/DashBoard'
      }
    ] : []),
    { icon: <FiSettings className="mr-2" />, name: 'Paramètres', href: '/profile' },
    { icon: <FiDollarSign className="mr-2" />, name: 'Revenus', href: '/' },
    { icon: <FiPlus className="mr-2" />, name: 'Ajouter une offre', href: '/FormPages' }
  ];

  const handleNewOfferClick = () => {
    if (!session) {
      router.push('/signin');
    } else {
      router.push('/FormPages');
    }
    setMenuOpen(false);
  };

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && !(event.target as HTMLElement).closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);


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

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`relative px-3 py-2 text-gray-700 hover:text-teal-600 transition-colors font-medium ${router.pathname === link.href
                  ? 'text-teal-600 font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-teal-600'
                  : ''
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <motion.button
              
              whileTap={{ scale: 0.98 }}
              onClick={handleNewOfferClick}
              className="w-full flex items-center justify-center px-3 py-2 mt-2 bg-gradient-to-r from-teal-400 to-teal-700 text-white rounded-md shadow-sm"
            >
              <FiPlus className="mr-2" />
              Nouvelle offre
            </motion.button>
          </div>

          {/* Contrôles utilisateur/connexion */}
          <div className="flex items-center">
            {session ? (
              <div className="relative ml-4 user-dropdown">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  {session?.user?.image ? (
                    <img
                      className="w-16 h-16 rounded-full object-cover border-2 border-teal-100"
                      src={
                        session.user.image.startsWith('/uploads/')
                          ? `http://your-backend-domain${session.user.image}`
                          : session.user.image
                      }
                      alt="Profile"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';

                        // Create fallback container
                        const fallbackContainer = document.createElement('div');
                        fallbackContainer.className = 'w-16 h-16 rounded-full border-2 border-teal-100 bg-gray-100 flex items-center justify-center';

                        // Create user icon
                        const userIcon = document.createElement('div');
                        userIcon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        `;
                        fallbackContainer.appendChild(userIcon);
                        img.parentNode?.insertBefore(fallbackContainer, img);
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full border-2 border-teal-100 bg-gray-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                      </div>

                      {userDropdownItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      ))}

                      <button
                        onClick={() => signOut()}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 transition-colors border-t border-gray-100"
                      >
                        <FiLogOut className="mr-2" />
                        Déconnexion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/signin')}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Connexion
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/signup')}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                >
                  Inscription
                </motion.button>
              </div>
            )}

            {/* Bouton menu mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden ml-4 p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100 focus:outline-none transition-colors"
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

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${router.pathname === link.href
                    ? 'text-teal-600 bg-teal-50'
                    : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <button
                onClick={handleNewOfferClick}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-teal-600 hover:bg-teal-700 mt-2"
              >
                <FiPlus className="mr-2" />
                Ajouter une offre
              </button>

              {!session && (
                <div className="pt-4 pb-2 border-t border-gray-200 space-y-2">
                  <button
                    onClick={() => {
                      router.push('/signin');
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => {
                      router.push('/signup');
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-md text-base font-medium text-white bg-teal-600 hover:bg-teal-700"
                  >
                    Inscription
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