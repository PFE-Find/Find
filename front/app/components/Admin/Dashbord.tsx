"use client";

import React, { useEffect, useState } from "react";
import SidBar from "./SideBar";
import Navbar from "./NavBar";
import {
  Users,
  ShoppingCart,
} from "lucide-react";

import Offres from "@/app/services/Offres";
import userService from "@/app/services/User";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const Dashboard: React.FC = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [materialsCount, setMaterialsCount] = useState<number>(0);
  const [landsCount, setLandsCount] = useState<number>(0);
  const [placeChartData, setPlaceChartData] = useState<any>(null);
  const [userBarData, setUserBarData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const fetchedOffers = await Offres.getOffres();
      const fetchedUsers = await userService.getUsers();
      const fetchedMaterials = await Offres.getMaterials();
      const fetchedLands = await Offres.getLands();

      setOffers(fetchedOffers);
      setUsers(fetchedUsers);
      setMaterialsCount(fetchedMaterials);
      setLandsCount(fetchedLands);
    } catch (err) {
      console.error("Error loading data", err);
      setError("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!offers.length) return;

    const placeCounts: Record<string, number> = {};
    offers.forEach((offer: any) => {
      const place = offer.placeName;
      placeCounts[place] = (placeCounts[place] || 0) + 1;
    });

    setPlaceChartData({
      labels: Object.keys(placeCounts),
      datasets: [
        {
          label: "Offers by Place",
          data: Object.values(placeCounts),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    });
  }, [offers]);

  // Monthly user registration bar chart
  useEffect(() => {
    if (!users.length) return;

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    const monthlyCounts = Array(12).fill(0);
    users.forEach((user: any) => {
      const month = new Date(user.createdAt).getMonth();
      monthlyCounts[month]++;
    });

    setUserBarData({
      labels: months,
      datasets: [
        {
          label: "User Registrations by Month",
          data: monthlyCounts,
          backgroundColor: months.map((_, i) => [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
            "#E7E9ED", "#00A86B", "#8E44AD", "#E67E22", "#2ECC71", "#F1C40F",
          ][i]),
        },
      ],
    });
  }, [users]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidBar />

      <main className="flex-1 p-8 overflow-y-auto h-[900px]">
        <Navbar />

        {/* Stats Cards */}
        <div className="mt-28 grid grid-cols-4 gap-6">
          {[
            {
              title: "Today's Materials",
              value: materialsCount,
              change: "+55% than last week",
              icon: <img src="/assets/icons/tractor.png" alt="Materials" />,
            },
            {
              title: "Today's Users",
              value: users.length,
              change: "+3% than last month",
              icon: <Users className="w-8 h-8 text-blue-500" />,
            },
            {
              title: "Land Scapes",
              value: landsCount,
              change: "-2% than yesterday",
              icon: <img src="/assets/icons/landscape.png" alt="Lands" className="w-8 h-8" />,
            },
            {
              title: "Offers",
              value: offers.length,
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
                className={`mt-4 text-sm ${
                  stat.change.includes("-") ? "text-red-500" : "text-green-500"
                }`}
              >
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          {/* Pie Chart */}
          <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition">
            <div className="text-lg font-semibold">Offers per Place</div>
            <div className="mt-6 flex items-center justify-center h-[300px]">
              {placeChartData ? (
                <div style={{ width: "250px", height: "250px" }}>
                  <Pie data={placeChartData} />
                </div>
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-500">Updated just now</div>
          </div>

          {/* Bar Chart */}
          <div className="col-span-2 p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition">
            <div className="text-lg font-semibold">User Registrations per Month</div>
            <div className="mt-6 h-[300px] flex items-center justify-center">
              {userBarData ? (
                <Bar
                  data={userBarData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { precision: 0 },
                      },
                    },
                  }}
                />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-500">Updated just now</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
