import React, { useEffect, useState } from "react";
import SidBar from "./SideBar";
import Navbar from "./NavBar";
import Link from "next/link";
import eventService from "../../services/Offres";
import { format } from 'date-fns';

const Offres: React.FC = () => {
    const [offres, setOffres] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    useEffect(() => {
        async function fetchOffres() {
            try {
                const data = await eventService.getOffres2();
                setOffres(data);
                console.log("Fetched offres:", data);
            } catch (error) {
                console.error("Error fetching offres:", error);
            }
        }
        fetchOffres();
    }, []);

    const filteredOffers = offres.filter((offer) => {
        const matchesCategory =
            selectedCategory === "all" || offer.propertyType === selectedCategory;
        const matchesSearch = offer.titre
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex min-h-screen bg-gray-50">
            <SidBar />

            {/* Main Content */}
            <main className="flex-1 p-8">
                <Navbar />
                <div className="mt-28 ">
                    {/* Filters */}
                   
                    
                    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                    <div
                        className="p-4 overflow-hidden w-[56px] h-[56] hover:w-[270px] bg-[#4070f4] shadow-[2px_2px_20px_rgba(0,0,0,0.08)] rounded-full flex group items-center hover:duration-300 duration-300"
                    >
                        <div className="flex items-center justify-center fill-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="Isolation_Mode"
                                data-name="Isolation Mode"
                                viewBox="0 0 24 24"
                                width="22"
                                height="22"
                            >
                                <path
                                    d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z"
                                ></path>
                            </svg>
                        </div>
                        <input
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        placeholder="Search offers..."
                            type="text"
                            className="outline-none text-[20px] bg-transparent w-full text-white font-normal px-4"
                        />
                    </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="all">All Categories</option>
                            <option value="category1">Category 1</option>
                            <option value="category2">Category 2</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl shadow-lg bg-white">
                        <div className="px-6 py-4 bg-gray-800 text-white font-semibold text-lg">
                            Offers Table
                        </div>
                        <div className="overflow-y-auto h-[594px]">
                            <table className=" min-w-full text-left text-sm text-gray-700">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">IMAGE</th>
                                        <th className="px-6 py-4 font-medium">TITLE</th>
                                        <th className="px-6 py-4 font-medium">CATEGORY</th>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium">STATUS</th>
                                        <th className="px-6 py-4 font-medium">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOffers.map((offre) => (
                                        <tr
                                            key={offre._id}
                                            className="border-b hover:bg-gray-100 transition"
                                        >
                                            <td className="px-6 py-4">
                                                <img
                                                    src={offre.images?.[0]?.path || "/default-image.jpg"}
                                                    alt={offre.titre}
                                                    className="w-20 h-16 object-cover rounded-lg shadow-sm"
                                                />
                                            </td>
                                            <td className="px-6 py-4">{offre.titre}</td>
                                            <td className="px-6 py-4">{offre.propertyType}</td>
                                            <td className="px-6 py-4">{format(new Date(offre.createdAt), 'yyyy-MM-dd | HH:mm')}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${offre.status === "accepted"
                                                        ? "bg-green-100 text-green-800"
                                                        : offre.status === "rejected"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {offre.status || "Pending"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-blue-500 font-medium">
                                                <Link
                                                    href={`/components/Admin/DetailOffre/${offre._id}`}
                                                    prefetch={false}
                                                >
                                                    Consulter
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredOffers.length === 0 && (
                            <div className="py-6 text-center text-gray-500">
                                No offers found. Try adjusting your filters or search query.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Offres;