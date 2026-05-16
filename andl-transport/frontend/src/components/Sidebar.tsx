import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Bus, MapPin, School, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

interface SidebarProps {
  isAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin }) => {
  const { logout, user } = useAuth();

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/admin/etudiants', icon: Users, label: 'Étudiants' },
    { to: '/admin/inscriptions', icon: Bus, label: 'Inscriptions' },
    { to: '/admin/paiements', icon: CreditCard, label: 'Paiements' },
    { to: '/admin/transport', icon: MapPin, label: 'Transport' },
    { to: '/admin/bus-chauffeurs', icon: Bus, label: 'Bus & Chauffeurs' },
    { to: '/admin/etablissements', icon: School, label: 'Établissements' },
    { to: '/admin/tarifs', icon: CreditCard, label: 'Tarifs' },
    { to: '/admin/scanner', icon: MapPin, label: 'Scanner QR' },
  ];

  const studentLinks = [
    { to: '/etudiant/dashboard', icon: LayoutDashboard, label: 'Mon Espace' },
    { to: '/etudiant/inscription', icon: Bus, label: 'Nouvelle Inscription' },
    { to: '/etudiant/badge', icon: CreditCard, label: 'Mon Badge' },
    { to: '/etudiant/paiements', icon: CreditCard, label: 'Mes Paiements' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
          <Bus className="w-6 h-6" />
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">A.N.D.L</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto pt-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
              isActive 
                ? "bg-blue-50 text-blue-600 shadow-sm" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            )}
          >
            <link.icon className={cn(
              "w-5 h-5 transition-transform",
              "group-hover:scale-110"
            )} />
            <span className="font-medium">{link.label}</span>
            <ChevronRight className={cn(
              "w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all",
              "group-hover:opacity-40 group-hover:translate-x-0"
            )} />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-50">
        <div className="bg-slate-50 rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Session</p>
          <p className="text-sm font-bold text-slate-700 truncate">{user?.prenom} {user?.nom}</p>
          <p className="text-xs text-slate-500">{user?.role === 'ADMIN' ? 'Administrateur' : 'Étudiant'}</p>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
