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
  PlusCircle,
  Menu,
  X,
  
} from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [sidenav, setSidenav] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidenav(false);
      } else {
        setSidenav(true);
      }
    };
    interface MenuItem {
  name: string;
  icon: React.ReactNode;
  link?: string; 
  
}


    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    {
      name: "Tableau de bord",
      icon: <LayoutDashboard className="w-5 h-5" />,
      subItems: [
        { name: "Aperçu", link: "/Admin/DashBoard" },
        { name: "Commentaires", link: "/Admin/Comment" },
        { name: "Signalements", link: "/Admin/Reports" }
      ]
    },
    {
      name: "Offres",
      icon: <Star className="w-5 h-5" />,
      subItems: [
        { name: "Nouvelles offres", link: "/Admin/NewOffres" },
        { name: "Toutes les offres", link: "/Admin/OffresPage" },
        { name: "Créer une offre", link: "/Admin/CreateOffre", icon: <PlusCircle className="w-4 h-4 ml-1" /> }
      ]
    },
    {
      name: "Clients",
      icon: <Users className="w-5 h-5" />,
      subItems: [
        { name: "Liste des utilisateurs", link: "/Admin/UsersPage" },
      ]
    },
  ];

  const toggleSubMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const isActive = (link: string) => {
    return pathname === link;
  };

  const toggleSidebar = () => {
    setSidenav(!sidenav);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className={`fixed z-50 md:hidden top-4 left-4 p-2 rounded-lg bg-teal-700 text-white`}
      >
        {sidenav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out 
          ${sidenav ? 'w-[320px]' : 'w-20'} 
          bg-gradient-to-b from-teal-700 to-teal-900 shadow-xl
          ${isMobile && !sidenav ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Conteneur principal */}
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Section Logo */}
          <div className={`flex items-center justify-center py-6 transition-all ${sidenav ? 'px-4' : 'px-2'} border-b border-teal-600`}>
            {sidenav ? (
              <h1 className="text-2xl font-bold whitespace-nowrap">
                <span className="text-white">Panneau</span>
                <span className="text-teal-300">d'Admin</span>
              </h1>
            ) : (
              <div className="text-2xl font-bold text-white">PA</div>
            )}
          </div>

          {/* Section Profil */}
          {session ? (
            <div className={`flex flex-col items-center py-4 border-b border-teal-600 transition-all ${sidenav ? 'px-4' : 'px-2'}`}>
              <div className="relative">
                <img
                  className="w-16 h-16 rounded-full object-cover border-2 border-teal-200"
                  src={
                    session.user?.image
                      ? session.user.image.startsWith('/uploads')
                        ? `http://localhost:3001${session.user.image}`
                        : session.user.image
                      : '/default-avatar.png'
                  }
                  alt="Photo de profil"
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
          ) : null}

          {/* Menu de navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-3">
              {menuItems.map((menu) => (
                <li key={menu.name}>
                  {menu.subItems ? (
                    <>
                      <button
                        onClick={() => toggleSubMenu(menu.name)}
                        className={`flex items-center w-full p-3 rounded-lg transition-all ${openMenu === menu.name ? 'bg-teal-600/50 text-white' : 'hover:bg-teal-600/30 text-teal-100'}`}
                      >
                        <span className="text-teal-200">{menu.icon}</span>
                        {sidenav && (
                          <>
                            <span className="ml-3 text-sm font-medium">{menu.name}</span>
                            <span className="ml-auto">
                              {openMenu === menu.name ? 
                                <ChevronUp className="w-4 h-4 text-teal-200" /> : 
                                <ChevronDown className="w-4 h-4 text-teal-200" />}
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
                                className={`flex items-center p-2 text-sm rounded-lg transition-all ${isActive(subItem.link) ? 'bg-teal-500/30 text-white font-medium' : 'text-teal-200 hover:bg-teal-600/20'}`}
                                onClick={() => isMobile && setSidenav(false)}
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
                    <div/>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Bouton de déconnexion */}
          {session && (
            <div className="p-4 border-t border-teal-600">
              <button 
                onClick={() => signOut()}
                className="w-full flex items-center justify-center p-2 rounded-lg bg-teal-600/30 hover:bg-teal-600/50 text-teal-100 transition-all"
              >
                {sidenav ? (
                  <span className="text-sm font-medium">Déconnexion</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidenav, setSidenav] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${sidenav ? 'md:ml-64' : 'md:ml-20'} p-6`}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;