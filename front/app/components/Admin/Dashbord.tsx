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
      console.error("Erreur lors du chargement des données", err);
      setError("Échec du chargement des données du tableau de bord");
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
          label: "Offres par lieu",
          data: Object.values(placeCounts),
          backgroundColor: [
            "#3B82F6", // Bleu
            "#10B981", // Vert émeraude
            "#F59E0B", // Jaune
            "#6366F1", // Violet
            "#EC4899", // Rose
            "#14B8A6", // Turquoise
          ],
        },
      ],
    });
  }, [offers]);

  // Graphique des inscriptions utilisateurs par mois
  useEffect(() => {
    if (!users.length) return;

    const months = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
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
          label: "Inscriptions utilisateurs par mois",
          data: monthlyCounts,
          backgroundColor: "#3B82F6",
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    });
  }, [users]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidBar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Navbar />

        {/* En-tête */}
        <div className="mt-36 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord</h1>
          <p className="text-gray-600">Aperçu des statistiques et performances</p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Matériels aujourd'hui",
              value: materialsCount,
              change: "+55% vs semaine dernière",
              icon: <img src="/assets/icons/tractor.png" alt="Matériels" className="w-10 h-10" />,
              color: "bg-blue-100",
            },
            {
              title: "Utilisateurs",
              value: users.length,
              change: "+3% vs mois dernier",
              icon: <Users className="w-10 h-10 text-blue-600" />,
              color: "bg-green-100",
            },
            {
              title: "Terrains",
              value: landsCount,
              change: "-2% vs hier",
              icon: <img src="/assets/icons/landscape.png" alt="Terrains" className="w-10 h-10" />,
              color: "bg-amber-100",
            },
            {
              title: "Offres",
              value: offers.length,
              change: "+5% vs hier",
              icon: <ShoppingCart className="w-10 h-10 text-purple-600" />,
              color: "bg-purple-100",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md ${stat.color}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className={`text-xs mt-2 ${
                    stat.change.includes("-") ? "text-red-500" : "text-green-500"
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white bg-opacity-50">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Camembert */}
          <div className="lg:col-span-1 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Répartition des offres par lieu</h2>
            <div className="h-64 flex items-center justify-center">
              {placeChartData ? (
                <div className="w-full max-w-xs">
                  <Pie 
                    data={placeChartData} 
                    options={{
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            usePointStyle: true,
                            padding: 16,
                          }
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <p className="text-gray-500">Chargement du graphique...</p>
              )}
            </div>
            <p className="text-xs text-gray-400 text-right mt-2">Mis à jour à l'instant</p>
          </div>

          {/* Barres */}
          <div className="lg:col-span-2 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Inscriptions utilisateurs par mois</h2>
            <div className="h-64">
              {userBarData ? (
                <Bar
                  data={userBarData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: '#1F2937',
                        titleColor: '#F3F4F6',
                        bodyColor: '#F3F4F6',
                        borderColor: '#374151',
                        borderWidth: 1,
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { 
                          precision: 0,
                          stepSize: 1 
                        },
                        grid: {
                          drawBorder: false,
                          color: '#E5E7EB'
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    },
                  }}
                />
              ) : (
                <p className="text-gray-500">Chargement du graphique...</p>
              )}
            </div>
            <p className="text-xs text-gray-400 text-right mt-2">Mis à jour à l'instant</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;