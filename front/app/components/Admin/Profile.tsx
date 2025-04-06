"use client";

import React from "react";
import { Facebook, Twitter, Instagram, MessageCircle, Settings, AppWindow } from "lucide-react";
import SidBar from "./SideBar";
import Navbar from "./NavBar";

const UserProfilePage = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <SidBar />

            {/* Main Content */}
            <main className="flex-1 p-8">
                {/* Navbar */}
                <Navbar />

                {/* Content */}
                <div className="mt-28 ">
                    {/* Main Profile Container */}
                    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gray-800 h-40"></div>

                        {/* User Details Section */}
                        <div className="relative -mt-16 px-6 pb-6">
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                {/* User Info */}
                                <div className="flex items-center gap-6">
                                    <img
                                        src="/default-avatar.jpg"
                                        alt="User Avatar"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Richard Davis</h2>
                                        <p className="text-gray-500">CEO / Co-Founder</p>
                                    </div>
                                    <div className="flex gap-4 ml-auto">
                                        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
                                            <AppWindow className="w-5 h-5 inline-block" /> App
                                        </button>
                                        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
                                            <MessageCircle className="w-5 h-5 inline-block" /> Message
                                        </button>
                                        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
                                            <Settings className="w-5 h-5 inline-block" /> Settings
                                        </button>
                                    </div>
                                </div>

                                {/* Section Split */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                                    {/* Platform Settings */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Platform Settings</h3>
                                        <div className="mt-4">
                                            <h4 className="text-sm font-semibold text-gray-500">ACCOUNT</h4>
                                            <div className="mt-2 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label>Email me when someone follows me</label>
                                                    <input type="checkbox" className="toggle-checkbox" />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <label>Email me when someone answers on my post</label>
                                                    <input type="checkbox" className="toggle-checkbox" />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <label>Email me when someone mentions me</label>
                                                    <input type="checkbox" className="toggle-checkbox" />
                                                </div>
                                            </div>

                                            <h4 className="text-sm font-semibold text-gray-500 mt-6">APPLICATION</h4>
                                            <div className="mt-2 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label>New launches and projects</label>
                                                    <input type="checkbox" className="toggle-checkbox" />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <label>Monthly product updates</label>
                                                    <input type="checkbox" className="toggle-checkbox" />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <label>Subscribe to newsletter</label>
                                                    <input type="checkbox" className="toggle-checkbox" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Information */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Profile Information</h3>
                                        <p className="mt-2 text-gray-500 text-sm">
                                            Hi, I'm Alec Thompson. Decisions: If you can't decide, the answer is no. If
                                            two equally difficult paths, choose the one more painful in the short term
                                            (pain avoidance is creating an illusion of equality).
                                        </p>
                                        <div className="mt-4 space-y-3 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-600">First Name:</span>
                                                <span>Alec M. Thompson</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-600">Mobile:</span>
                                                <span>(44) 123 1234 123</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-600">Email:</span>
                                                <span>alecthompson@mail.com</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-600">Location:</span>
                                                <span>USA</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-4">
                                                <a href="#" className="text-blue-500">
                                                    <Facebook />
                                                </a>
                                                <a href="#" className="text-blue-400">
                                                    <Twitter />
                                                </a>
                                                <a href="#" className="text-pink-500">
                                                    <Instagram />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contacts */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Contacts</h3>
                                        <ul className="mt-4 space-y-4">
                                            {[
                                                { name: "Sophie B.", message: "Hi! I need more information...", avatar: "/default-avatar.jpg" },
                                                { name: "Alexander", message: "Awesome work, can you...", avatar: "/default-avatar.jpg" },
                                                { name: "Ivanna", message: "About files I can...", avatar: "/default-avatar.jpg" },
                                                { name: "Peterson", message: "Have a great afternoon...", avatar: "/default-avatar.jpg" },
                                                { name: "Bruce Mars", message: "Hi! I need more information...", avatar: "/default-avatar.jpg" },
                                            ].map((contact, index) => (
                                                <li key={index} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={contact.avatar}
                                                            alt={contact.name}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-800">
                                                                {contact.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-500">{contact.message}</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-blue-500 text-sm font-semibold">Reply</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfilePage;