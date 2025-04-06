"use client";

import React, { useState } from "react";
import Link from "next/link"; // If you're using Next.js, otherwise use <a>
import { Home, Users, Settings, User, ShoppingCart, DollarSign, Bell } from "lucide-react";

const Sidebar = () => {
  const [sidenav, setSidenav] = useState(true);
  const [openMenu, setOpenMenu] = useState(null); // Track which menu is open

  const menuItems = [
    {
      name: "Dashboard",
      subItems: ["Overview", "Stats", "Performance"],
      link: ["/Admin/DashBoard", "/dashboard/stats", "/dashboard/performance"],
    },
    {
      name: "Offres",
      subItems: ["Nouveaux Offres", "Tous les Offres"],
      link: ["/Admin/OffresPage", "/Admin/OffresPage"],
    },
    {
      name: "Reports",
      subItems: ["Sales", "Expenses", "Revenue"],
      // link: ["/reports/sales", "/reports/expenses", "/reports/revenue"],
    },
    {
      name: "Messages",
      subItems: ["Inbox", "Sent", "Archived"],
      // link: ["/messages/inbox", "/messages/sent", "/messages/archived"],
    },
  ];

  const toggleSubMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index); // Toggle submenu open/close
  };

  return (
    <div className="h-[100%] flex font-poppins antialiased">
      {/* Sidebar */}
      {sidenav && (
        <div className="bg-gradient-to-b from-teal-600 to-teal-800 text-white top-0 left-0 h-full shadow-lg px-4 py-6 w-64 transition-transform duration-300 ease-in-out">
          <div className="space-y-8">
            {/* Logo */}
            <div className="text-center">
              <h1 className="text-3xl font-bold">
                Dash<span className="text-teal-300">Board</span>
              </h1>
            </div>

            {/* Profile Section */}
            <div id="profile" className="text-center">
              <img
                src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                alt="Avatar user"
                className="w-20 h-20 rounded-full mx-auto border-4 border-teal-400"
              />
              <h2 className="mt-2 text-lg font-semibold">Eduard Pantazi</h2>
              <p className="text-sm text-teal-200">Administrator</p>
            </div>

            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-full px-4 py-2 text-gray-700 focus:outline-none"
                placeholder="Search..."
              />
              <button className="absolute right-3 top-2">
                <svg
                  className="w-6 h-6 text-teal-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Menu Items with Sub-items */}
            <div id="menu" className="space-y-4">
              {menuItems.map((menu, index) => (
                <div key={menu.name}>
                  {/* Menu Item */}
                  <div
                    onClick={() => toggleSubMenu(index)}
                    className="flex justify-between items-center cursor-pointer py-2 px-4 text-lg font-medium bg-teal-700 hover:bg-teal-500 hover:text-white rounded-lg transition duration-200"
                  >
                    <span>{menu.name}</span>
                    <svg
                      className={`w-5 h-5 transform ${
                        openMenu === index ? "rotate-180" : ""
                      } transition-transform`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>

                  {/* Sub-items */}
                  {openMenu === index && (
                    <div className="space-y-2 mt-2 ml-6">
                      {menu.subItems.map((subItem, subIndex) => (
                        <Link
                          href={menu.link?.[subIndex] || "#"}
                          key={subItem}
                          className="block text-sm text-teal-200 hover:text-white hover:underline"
                        >
                          {subItem}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
    </div>
  );
};

export default Dashboard;
