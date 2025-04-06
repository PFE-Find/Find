"use client";

import React from "react";
import SidBar from "./SideBar";
import Link from "next/link";
import { Home, Users, Settings, User, ShoppingCart, DollarSign, Bell, Search, LogIn, UserPlus, Table } from "lucide-react";


const Navbar: React.FC = () => {
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
          
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"  >
          <Link href="/Admin/Profile">
            <User className="w-5 h-5 text-gray-600" />
            </Link>
          </button>
          
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;