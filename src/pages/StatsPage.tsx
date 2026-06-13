import React, { useState, useEffect } from 'react';
import { Eye, Phone, Building, Home, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { getMyStats, type AgencyStats } from '@/services/stats';

const periods = ['7 jours', '30 jours', '12 mois'];

const periodData: Record<string, { values: number[]; labels: string[] }> = {
  '7 jours': { values: [30, 55, 45, 70, 85, 50, 60], labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] },
  '30 jours': { values: [40, 65, 50, 80, 70, 95, 85, 100, 75, 90, 60, 88, 72, 55, 68, 92, 78, 84, 62, 96, 74, 66, 88, 79, 91, 69, 73, 85, 77, 81], labels: [] },
  '12 mois': { values: [40, 65, 50, 80, 70, 95, 85, 100, 75, 90, 60, 88], labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'] },
};

const StatsPage: React.FC = () => {
  const [period, setPeriod] = useState('12 mois');
  const [stats, setStats] = useState<AgencyStats | null>(null);

  useEffect(() => {
    getMyStats().then(setStats).catch(() => {});
  }, []);

  const formatNumber = (n: number) => n.toLocaleString('fr-FR');

  return (
    <DashboardLayout title="Statistiques" subtitle="Analysez la performance de vos annonces">
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1">
          {periods.map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-1.5 rounded-lg text-sm font-medium ${period === p ? 'bg-orange-500 text-white' : 'text-slate-500'}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-blue-500 flex items-center justify-center"><Eye className="w-6 h-6 text-white" /></div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{formatNumber(stats?.total_views || 0)}</div>
          <div className="text-sm text-slate-400">Vues totales</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-green-500 flex items-center justify-center"><Phone className="w-6 h-6 text-white" /></div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{formatNumber(stats?.total_messages || 0)}</div>
          <div className="text-sm text-slate-400">Contacts reçus</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-rose-500 flex items-center justify-center"><Home className="w-6 h-6 text-white" /></div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats?.available || 0}</div>
          <div className="text-sm text-slate-400">Biens actifs</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-purple-500 flex items-center justify-center"><CheckCircle className="w-6 h-6 text-white" /></div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats?.total_properties || 0}</div>
          <div className="text-sm text-slate-400">Total biens publiés</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Évolution des vues — {period}</h2>
          <div className="flex items-end gap-1.5 h-56">
            {periodData[period].values.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{h}</span>
                <div className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-lg transition-all hover:opacity-80 cursor-pointer" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
          {periodData[period].labels.length > 0 && (
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              {periodData[period].labels.map((m, i) => {
                const step = Math.max(1, Math.floor(periodData[period].labels.length / 12));
                return i % step === 0 ? <span key={i}>{m}</span> : <span key={i} />;
              })}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Aperçu rapide</h2>
          <div className="space-y-4">
            {[
              { label: 'Biens actifs', value: stats?.available ?? 0, color: 'bg-green-500' },
              { label: 'En attente', value: stats?.pending ?? 0, color: 'bg-amber-500' },
              { label: 'Loués / Vendus', value: stats?.sold ?? 0, color: 'bg-blue-500' },
            ].map((i) => {
              const max = Math.max(stats?.total_properties || 1, 1);
              return (
                <div key={i.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-300">{i.label}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{i.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full ${i.color} rounded-full transition-all`} style={{ width: `${(i.value / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Building className="w-5 h-5 text-orange-500" />
          <h2 className="font-bold text-slate-900 dark:text-white">Biens les plus consultés</h2>
        </div>
        <div className="space-y-3">
          {stats?.top_properties && stats.top_properties.length > 0 ? (
            stats.top_properties.map((p, i) => {
              const pct = stats.total_views > 0 ? Math.round((p.views / Math.max(...stats.top_properties.map((x) => x.views))) * 100) : 0;
              return (
                <div key={p.id} className="flex items-center gap-4">
                  <span className="w-6 text-slate-400 font-bold">{i + 1}</span>
                  <img src={p.images?.[0] || '/placeholder.svg'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">{p.title}</div>
                    <div className="h-1.5 mt-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{p.views.toLocaleString('fr-FR')} vues</span>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-slate-400">Aucune donnée pour le moment.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StatsPage;
