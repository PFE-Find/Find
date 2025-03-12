'use client';
import '../styles/Nav.css';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SignIn from "@/app/components/SignIn";
import { Dialog } from '@material-tailwind/react';
import { useRouter } from 'next/navigation';


export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();


  return (
    <nav className="bg-white border-gray-200 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 relative">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="/assets/logo.png" alt="Flowbite Logo" width={50} height={50} style={{ borderRadius: '15px' }} />
          <span id="logo_span" className=" self-center text-2xl font-semibold whitespace-nowrap dark:text-green">Find</span>
        </Link>
        {isLoggedIn ? (
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <img className="w-16 h-16 rounded-full object-cover" src="/assets/wessim.png" alt="user photo" width={32} height={32} />
            </button>
            {dropdownOpen && (
              <div className="z-50 absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600 top-full">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
                </div>
                <ul className="py-2">
                  <li><Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">Dashboard</Link></li>
                  <li><Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">Settings</Link></li>
                  <li><Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">Earnings</Link></li>
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
        <div className={`${menuOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`}>
          <ul className="flex flex-col md:flex-row font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:mt-0 md:border-0 md:bg-white ">
            <li><Link href="/" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-green-700">Home</Link></li>
            <li><Link href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 dark:text-black">About</Link></li>
            <li><Link href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 dark:text-black">Pricing</Link></li>
            <li><Link href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 dark:text-black">Services</Link></li>
            <li><Link href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 dark:text-black">Contact</Link></li>
          </ul>
        </div>
      </div>


    </nav>
  );
}
