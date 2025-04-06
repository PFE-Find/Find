"use client";

import React from "react";
import SidBar from "./SideBar";
import Navbar from "./NavBar";
import { Home, Users, Settings, User, ShoppingCart, DollarSign, Bell, Search, LogIn, UserPlus, Table } from "lucide-react";




const Dashboard: React.FC = () => {
  return (
    <div className=" flex min-h-screen bg-gray-100">
      <SidBar />


      {/* Main Content */}
      <main className="flex-1 p-8  overflow-y-auto h-[900px]">

        <Navbar />

        {/* Stats Cards */}
        <div className="mt-28 grid grid-cols-4 gap-6 ">
          {[
            {
              title: "Today's Money",
              value: "$53k",
              change: "+55% than last week",
              icon: <DollarSign className="w-8 h-8 text-green-500" />,
            },
            {
              title: "Today's Users",
              value: "2,300",
              change: "+3% than last month",
              icon: <Users className="w-8 h-8 text-blue-500" />,
            },
            {
              title: "New Clients",
              value: "3,462",
              change: "-2% than yesterday",
              icon: <Users className="w-8 h-8 text-red-500" />,
            },
            {
              title: "Sales",
              value: "$103,430",
              change: "+5% than yesterday",
              icon: <ShoppingCart className="w-8 h-8 text-purple-500" />,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition"
            >
              <div className="flex items-center space-x-4">
                <div>{stat.icon}</div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.title}</div>
                </div>
              </div>
              <div
                className={`mt-4 text-sm ${stat.change.includes("-") ? "text-red-500" : "text-green-500"
                  }`}
              >
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          {["Website View", "Daily Sales", "Completed Tasks"].map((chart, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-lg rounded-lg flex flex-col justify-between hover:shadow-xl transition"
            >
              <div className="text-lg font-semibold">{chart}</div>
              <div className="mt-6 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">[Chart Placeholder]</span>
              </div>
              <div className="mt-4 text-sm text-gray-500">Updated just now</div>
            </div>
          ))}

        </div>
        
      </main>
    </div>
  );
};

export default Dashboard;