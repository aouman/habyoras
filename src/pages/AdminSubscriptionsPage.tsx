import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, CreditCard, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { getSubscriptions } from '@/services/subscriptions';
import type { Subscription } from '@/services/types';

const plans = [
  { name: 'Basic', price: '0 FCFA', color: 'bg-slate-500', maxProps: 5, features: ['5 biens maximum', 'Notifications', 'Support standard'] },
  { name: 'Premium', price: '50 000 FCFA/an', color: 'bg-orange-500', maxProps: 15, features: ['15 biens maximum', 'Statistiques avancées', 'Support prioritaire', 'Mise en avant'] },
  { name: 'Gold', price: '120 000 FCFA/an', color: 'bg-yellow-500', maxProps: 999, features: ['Biens illimités', 'Statistiques avancées', 'Support dédié 24/7', 'Mise en avant illimitée', 'Account manager'] },
];

const AdminSubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');

  useEffect(() => {
    getSubscriptions().then(setSubscriptions).catch(() => {});
  }, []);

  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const revenue = activeSubs.reduce((acc, s) => {
    if (s.plan === 'Premium') return acc + 50000;
    if (s.plan === 'Gold') return acc + 120000;
    return acc;
  }, 0);

  const filtered = subscriptions.filter((s) => {
    if (filter === 'active') return s.status === 'active';
    if (filter === 'expired') return s.status === 'expired';
    return true;
  });

  return (
    <AdminLayout title="Abonnements" subtitle="Gérez les plans et abonnements des agences">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 mb-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center"><CreditCard className="w-7 h-7" /></div>
          <div>
            <div className="font-bold text-lg">Revenus récurrents mensuels</div>
            <div className="text-orange-50 text-sm">Basé sur les abonnements actifs</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold">{revenue.toLocaleString('fr-FR')} FCFA</div>
          <div className="text-orange-50 text-sm flex items-center gap-1 justify-end"><TrendingUp className="w-4 h-4" /> {activeSubs.length} abonnements actifs</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {plans.map((plan) => (
          <div key={plan.name} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${plan.color} flex items-center justify-center mb-3`}><CreditCard className="w-5 h-5 text-white" /></div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{plan.name}</h3>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{plan.price}</p>
            <p className="text-sm text-slate-400 mb-3">{plan.maxProps === 999 ? 'Biens illimités' : `Jusqu'à ${plan.maxProps} biens`}</p>
            <div className="space-y-2">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> {f}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {([{ label: 'Tous', value: 'all' }, { label: 'Actifs', value: 'active' }, { label: 'Expirés', value: 'expired' }] as const).map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${filter === f.value ? 'bg-orange-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <th className="p-4 font-medium">Agence</th>
                <th className="p-4 font-medium">Plan</th>
                <th className="p-4 font-medium">Début</th>
                <th className="p-4 font-medium">Fin</th>
                <th className="p-4 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const plan = plans.find(p => p.name === s.plan);
                return (
                  <tr key={s.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-100">{s.agency?.name || '—'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${plan?.color || 'bg-slate-500'}`}>{s.plan}</span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{new Date(s.start_date).toLocaleDateString('fr-FR')}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{s.end_date ? new Date(s.end_date).toLocaleDateString('fr-FR') : '—'}</td>
                    <td className="p-4">
                      {s.status === 'active' ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Actif</span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 text-xs font-medium"><XCircle className="w-3.5 h-3.5" /> Expiré</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-slate-400 py-8">Aucun abonnement trouvé.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminSubscriptionsPage;
