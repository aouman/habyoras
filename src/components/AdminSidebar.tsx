import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building, Users, Home, CreditCard, Settings, LogOut, Megaphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const items = [
  { label: 'Vue d\'ensemble', to: '/admin', icon: LayoutDashboard },
  { label: 'Agences', to: '/admin/agences', icon: Building },
  { label: 'Utilisateurs', to: '/admin/utilisateurs', icon: Users },
  { label: 'Biens', to: '/admin/biens', icon: Home },
  { label: 'Abonnements', to: '/admin/abonnements', icon: CreditCard },
  { label: 'Notifications', to: '/admin/notifications', icon: Megaphone },
  { label: 'Paramètres', to: '/admin/parametres', icon: Settings },
];

const AdminSidebar: React.FC = () => {
  const loc = useLocation();
  const { user, signOut } = useAuth();
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-slate-900 text-slate-300 min-h-screen p-4">
      <Link to="/" className="flex items-center gap-2 px-3 py-4 mb-2">
        <img src="/habyoras.png" alt="Habyora" className="h-10 w-auto" />
        <span className="text-xs font-normal text-orange-400">Admin</span>
      </Link>
      <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl bg-slate-800/60">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
          {(user?.name || 'A').slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white truncate">{user?.name || 'Super Admin'}</div>
          <div className="text-xs text-slate-400 truncate">Administrateur</div>
        </div>
      </div>
      <nav className="space-y-1 flex-1">
        {items.map((i) => {
          const Icon = i.icon;
          const active = loc.pathname === i.to;
          return (
            <Link key={i.label} to={i.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-orange-500 text-white' : 'hover:bg-slate-800'}`}>
              <Icon className="w-5 h-5" /> {i.label}
            </Link>
          );
        })}
      </nav>
      <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mb-2">
        <LayoutDashboard className="w-5 h-5" /> Interface agence
      </Link>
      <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
        <LogOut className="w-5 h-5" /> Déconnexion
      </button>
    </aside>
  );
};

export default AdminSidebar;
