import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Home, Users, CreditCard, ArrowUpRight, ArrowDownRight, MapPin } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { getDashboard, getAdminAgencies } from '@/services/admin';
import type { AdminDashboard, Agency } from '@/services/types';
import { formatPrice } from '@/lib/utils';

const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>([]);

  useEffect(() => {
    getDashboard().then(setData).catch(() => {});
    getAdminAgencies().then(setAgencies).catch(() => {});
  }, []);

  const total = data ? data.properties_by_type.reduce((s, t) => s + t.count, 0) : 0;

  const kpis = [
    { icon: Building, label: 'Agences', value: data?.total_agencies?.toString() || '0', change: '—', up: true, color: 'bg-blue-500' },
    { icon: Home, label: 'Biens publiés', value: data?.total_properties?.toString() || '0', change: '—', up: true, color: 'bg-orange-500' },
    { icon: Users, label: 'Utilisateurs', value: data?.total_messages?.toString() || '0', change: '—', up: true, color: 'bg-green-500' },
    { icon: CreditCard, label: 'Abonnements actifs', value: data?.active_subscriptions?.toString() || '0', change: '—', up: true, color: 'bg-purple-500' },
  ];

  const monthlyViews = [40, 65, 50, 80, 70, 95, 85, 100, 75, 90, 60, 88];

  return (
    <AdminLayout title="Vue d'ensemble" subtitle="Tableau de bord administrateur Habyora">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${k.color} flex items-center justify-center`}><Icon className="w-6 h-6 text-white" /></div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${k.up ? 'text-green-500' : 'text-red-500'}`}>
                  {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {k.change}
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{k.value}</div>
              <div className="text-sm text-slate-400">{k.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Vues totales — 12 mois</h2>
          <div className="flex items-end gap-2 h-56">
            {monthlyViews.map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">{months.map((m) => <span key={m}>{m}</span>)}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Répartition des biens</h2>
          <div className="space-y-4">
            {(data?.properties_by_type || []).map((t: { type: string; count: number }) => (
              <div key={t.type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-300">{t.type}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{t.count} ({total > 0 ? Math.round((t.count / total) * 100) : 0}%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full ${t.type === 'Appartement' ? 'bg-orange-500' : t.type === 'Villa' ? 'bg-blue-500' : t.type === 'Bureau' ? 'bg-green-500' : t.type === 'Terrain' ? 'bg-purple-500' : 'bg-rose-500'} rounded-full`} style={{ width: `${total > 0 ? (t.count / total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total</span>
              <span className="font-bold text-slate-900 dark:text-white">{total} biens</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white">Derniers biens publiés</h2>
            <Link to="/admin/biens" className="text-sm text-orange-500 font-semibold">Tout voir</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-3 font-medium">Bien</th>
                  <th className="pb-3 font-medium">Agence</th>
                  <th className="pb-3 font-medium">Prix</th>
                  <th className="pb-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {(data?.latest_properties || []).map((p: any) => (
                  <tr key={p.id} className="border-b border-slate-50 dark:border-slate-800/50">
                    <td className="py-3 flex items-center gap-3">
                      <img src={p.images?.[0] || '/placeholder.svg'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-slate-800 dark:text-slate-100 truncate max-w-[200px]">{p.title}</span>
                    </td>
                    <td className="py-3 text-slate-500">{p.agency?.name || '—'}</td>
                    <td className="py-3 text-orange-500 font-semibold whitespace-nowrap">{formatPrice(p.price, p.transaction)}</td>
                    <td className="py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.moderation === 'Approuvé' ? 'bg-green-100 dark:bg-green-500/10 text-green-600' : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600'}`}>{p.moderation}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Agences</h2>
          <div className="space-y-4">
            {agencies.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                  {a.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'AG'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">{a.name}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="w-3 h-3" /> {a.city}</div>
                </div>
                <span className="text-xs font-medium text-slate-400">{a.properties_count || 0} biens</span>
              </div>
            ))}
          </div>
          <Link to="/admin/agences" className="block mt-4 text-center text-sm text-orange-500 font-semibold py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">Voir toutes les agences</Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
