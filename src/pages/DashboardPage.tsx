import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Eye, Phone, Wallet, ArrowUpRight, Plus, LogOut, Moon, Sun } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { getMyProperties } from '@/services/properties';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/theme-provider';
import { formatPrice } from '@/lib/utils';
import type { Property } from '@/services/types';

const DashboardPage: React.FC = () => {
  const [myProps, setMyProps] = useState<Property[]>([]);
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    getMyProperties(1).then((res) => setMyProps(res.data.slice(0, 6))).catch(() => {});
  }, []);

  const stats = [
    { icon: Building, label: 'Biens publiés', value: myProps.length.toString(), change: '—', color: 'bg-blue-500' },
    { icon: Eye, label: 'Vues ce mois', value: myProps.reduce((s, p) => s + p.views, 0).toLocaleString('fr-FR'), change: '—', color: 'bg-orange-500' },
    { icon: Phone, label: 'Contacts reçus', value: '0', change: '—', color: 'bg-green-500' },
    { icon: Wallet, label: 'Abonnement', value: 'Gratuit', change: '—', color: 'bg-purple-500' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar />
      <div className="flex-1 min-w-0">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Tableau de bord</h1>
            <p className="text-sm text-slate-400">Bienvenue, {user?.name || 'votre agence'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/dashboard/ajouter" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold text-sm"><Plus className="w-4 h-4" /> Ajouter</Link>
            <button onClick={() => signOut()} title="Déconnexion" className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><LogOut className="w-5 h-5" /></button>
          </div>
        </header>

        <div className="p-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 mb-6 text-white flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center font-extrabold text-xl">
              {(user?.name || 'A').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-lg">{user?.name || 'Mon agence'}</div>
              <div className="text-orange-50 text-sm">{user?.city || "Côte d'Ivoire"} • {user?.verified ? 'Agence vérifiée' : 'Agence'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center`}><Icon className="w-6 h-6 text-white" /></div>
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-green-500"><ArrowUpRight className="w-3 h-3" /> {s.change}</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</div>
                  <div className="text-sm text-slate-400">{s.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">Performance des vues</h2>
              <div className="flex items-end gap-2 h-48">
                {[40, 65, 50, 80, 70, 95, 85, 100, 75, 90, 60, 88].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'].map((m) => <span key={m}>{m}</span>)}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">Top biens</h2>
              <div className="space-y-4">
                {myProps.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <img src={p.images?.[0] || '/placeholder.svg'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">{p.title}</div>
                      <div className="text-xs text-slate-400">{p.views.toLocaleString('fr-FR')} vues</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 dark:text-white">Mes biens récents</h2>
              <Link to="/dashboard/biens" className="text-sm text-orange-500 font-semibold">Tout voir</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-3 font-medium">Bien</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Prix</th>
                    <th className="pb-3 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {myProps.map((p) => (
                    <tr key={p.id} className="border-b border-slate-50 dark:border-slate-800/50">
                      <td className="py-3 flex items-center gap-3"><img src={p.images?.[0] || '/placeholder.svg'} alt="" className="w-10 h-10 rounded-lg object-cover" /> <span className="font-medium text-slate-800 dark:text-slate-100">{p.title}</span></td>
                      <td className="py-3 text-slate-500">{p.type}</td>
                      <td className="py-3 text-orange-500 font-semibold">{formatPrice(p.price, p.transaction)}</td>
                      <td className="py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.status === 'Actif' ? 'bg-green-100 dark:bg-green-500/10 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>{p.status || 'Actif'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
