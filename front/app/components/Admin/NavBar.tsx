"use client";

import React, { useState } from "react";
import SidBar from "./SideBar";
import Link from "next/link";
import { Home, Users, Settings, User, ShoppingCart, DollarSign, Bell, Search, LogIn, UserPlus, Table } from "lucide-react";
import { useRouter } from 'next/navigation';



const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn] = useState(true);
    const [showLogin, setShowLogin] = useState(false);
    const router = useRouter();
  return (
    <div className="grid bg-opacity-80 bg-white shadow-md fixed w-[83%] rounded-lg ">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Dashboard</span>
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
          
          
          
          {isLoggedIn ? (
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <img className="w-14 h-14 rounded-full object-cover" src="/assets/wessim.png" alt="user photo" width={8} height={8} />
            </button>
            {dropdownOpen && (
              <div className="z-50 absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600 top-full">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
                </div>
                <ul className="py-2">
                <li><Link href="/" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">Home</Link></li>
                  
                  <li><Link href="/profile" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">Settings</Link></li>
                  <li><Link href="/" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">Earnings</Link></li>
                  <li><Link href="/FormPages" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">Add Offre</Link></li>

                  <li><Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">Sign out</Link></li>
                </ul>
              </div>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              onClick={() => setShowLogin(true)}
              className="text-sm bg-white text-black border border-black px-4 py-2 rounded-md mr-3 hover:bg-black hover:text-white hover:border-transparent"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="text-sm bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Register
            </button>
          </div>
        )}
            
          
          
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;