import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building, PlusCircle, MessageSquare, BarChart3, CreditCard, Settings, LogOut, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const items = [
  { label: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Mes biens', to: '/dashboard/biens', icon: Building },
  { label: 'Brouillons', to: '/dashboard/brouillons', icon: FileText },
  { label: 'Ajouter un bien', to: '/dashboard/ajouter', icon: PlusCircle },
  { label: 'Messages', to: '/dashboard/messages', icon: MessageSquare },
  { label: 'Statistiques', to: '/dashboard/stats', icon: BarChart3 },
  { label: 'Abonnement', to: '/tarifs', icon: CreditCard },
  { label: 'Paramètres', to: '/dashboard/parametres', icon: Settings },
];

const DashboardSidebar: React.FC = () => {
  const loc = useLocation();
  const { user, signOut } = useAuth();
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-slate-900 text-slate-300 min-h-screen p-4">
      <Link to="/" className="flex items-center gap-2 px-3 py-4 mb-2">
        <img src="/habyoras.png" alt="Habyora" className="h-10 w-auto" />
      </Link>
      <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl bg-slate-800/60">
        {user?.logo ? (
          <img src={user.logo} alt="logo" className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
            {(user?.name || 'A').slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white truncate">{user?.name || 'Mon agence'}</div>
          <div className="text-xs text-slate-400 truncate">{user?.city || 'Côte d\'Ivoire'}</div>
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
      <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white text-sm mb-2">
        <p className="font-bold mb-1">Plan Premium</p>
        <p className="text-orange-50 text-xs mb-3">18/25 biens publiés</p>
        <Link to="/tarifs" className="block text-center py-1.5 rounded-lg bg-white text-orange-600 font-semibold text-xs">Améliorer</Link>
      </div>
      <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
        <LogOut className="w-5 h-5" /> Déconnexion
      </button>
    </aside>
  );
};

export default DashboardSidebar;
