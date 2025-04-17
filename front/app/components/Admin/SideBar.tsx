"use client";
import { useSession, signOut } from 'next-auth/react';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Home, 
  Users, 
  Settings, 
  User, 
  ShoppingCart, 
  DollarSign, 
  Bell,
  ChevronDown,
  ChevronUp,
  Search,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Star,
  PlusCircle
} from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [sidenav, setSidenav] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
   const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      subItems: [
        { name: "Overview", link: "/Admin/DashBoard" },
        { name: "Stats", link: "/dashboard/stats" },
        { name: "Performance", link: "/dashboard/performance" }
      ]
    },
    {
      name: "Offres",
      icon: <Star className="w-5 h-5" />,
      subItems: [
        { name: "Nouveaux Offres", link: "/Admin/NewOffres" },
        { name: "Tous les Offres", link: "/Admin/OffresPage" },
        { name: "Créer Offre", link: "/Admin/CreateOffre", icon: <PlusCircle className="w-4 h-4 ml-1" /> }
      ]
    },
    {
      name: "Clients",
      icon: <Users className="w-5 h-5" />,
      subItems: [
        { name: "Liste Utilisateur", link: "/Admin/UsersPage" },
        { name: "Messages", link: "/Admin/Messages" }
      ]
    },
    {
      name: "Transactions",
      icon: <DollarSign className="w-5 h-5" />,
      subItems: [
        { name: "Historique", link: "/Admin/Transactions" },
        { name: "Rapports", link: "/Admin/Reports" }
      ]
    },
    {
      name: "Paramètres",
      icon: <Settings className="w-5 h-5" />,
      link: "/Admin/Settings"
    }
  ];

  const toggleSubMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const isActive = (link: string) => {
    return pathname === link;
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out ${sidenav ? 'w-[320px]' : 'w-20'}`}>
      {/* Sidebar Container */}
      <div className={`flex flex-col h-full bg-gradient-to-b from-teal-700 to-teal-900 text-white shadow-xl overflow-hidden`}>
        {/* Logo Section */}
        <div className={`flex items-center justify-center py-6 transition-all ${sidenav ? 'px-4' : 'px-2'}`}>
          {sidenav ? (
            <h1 className="text-2xl font-bold whitespace-nowrap">
              <span className="text-white">Admin</span>
              <span className="text-teal-300">Panel</span>
            </h1>
          ) : (
            <div className="text-2xl font-bold">AP</div>
          )}
        </div>

        {/* Profile Section */}
        {session ? (
        <div className={`flex flex-col items-center py-4 border-b border-teal-600 transition-all ${sidenav ? 'px-4' : 'px-2'}`}>
          <div className="relative">
            <img
              src={session.user?.image || '/default-avatar.png'}
              alt="Avatar user"
              className="w-12 h-12 rounded-full border-2 border-teal-400 object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-teal-700"></span>
          </div>
          {sidenav && (
            <div className="text-center mt-3">
              <h2 className="text-sm font-semibold">{session.user?.name}</h2>
              <p className="text-xs text-teal-200">Administrateur</p>
            </div>
          )}
        </div>
): (<div>test</div> )}
        {/* Search Box - Only visible when expanded */}
        {sidenav && (
          <div className="px-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-300" />
              <input
                type="text"
                className="w-full bg-teal-800 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-teal-400"
                placeholder="Rechercher..."
              />
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto pb-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((menu) => (
              <li key={menu.name}>
                {menu.subItems ? (
                  <>
                    <button
                      onClick={() => toggleSubMenu(menu.name)}
                      className={`flex items-center w-full p-3 rounded-lg transition-all ${openMenu === menu.name ? 'bg-teal-600/50' : 'hover:bg-teal-600/30'}`}
                    >
                      <span className="text-teal-200">{menu.icon}</span>
                      {sidenav && (
                        <>
                          <span className="ml-3 text-sm font-medium">{menu.name}</span>
                          <span className="ml-auto">
                            {openMenu === menu.name ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </span>
                        </>
                      )}
                    </button>
                    
                    {openMenu === menu.name && sidenav && (
                      <ul className="ml-2 mt-1 space-y-1 pl-7">
                        {menu.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.link}
                              className={`flex items-center p-2 text-xs rounded-lg transition-all ${isActive(subItem.link) ? 'bg-teal-500/30 text-white' : 'text-teal-200 hover:bg-teal-600/20'}`}
                            >
                              {subItem.name}
                              {subItem.icon && <span className="ml-auto">{subItem.icon}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={menu.link || "#"}
                    className={`flex items-center p-3 rounded-lg transition-all ${isActive(menu.link || "") ? 'bg-teal-600/50' : 'hover:bg-teal-600/30'}`}
                  >
                    <span className="text-teal-200">{menu.icon}</span>
                    {sidenav && <span className="ml-3 text-sm font-medium">{menu.name}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t border-teal-600">
          <button
            onClick={() => setSidenav(!sidenav)}
            className="flex items-center justify-center w-full p-2 rounded-lg bg-teal-600/30 hover:bg-teal-500/40 transition-colors"
          >
            {sidenav ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="ml-2 text-sm">Réduire</span>
              </>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;