import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Star, CheckCircle2, XCircle, Eye } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import SimplePagination from '@/components/SimplePagination';
import { getAdminAgencies } from '@/services/admin';
import { toggleAgencyStatus, toggleAgencyVerification } from '@/services/agencies';
import type { Agency } from '@/services/types';
import { toast } from '@/hooks/use-toast';

const PER_PAGE = 5;

const AdminAgenciesPage: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);

  const fetch = useCallback(async () => {
    try {
      const data = await getAdminAgencies();
      setAgencies(data);
    } catch {}
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = agencies.filter((a) => {
    const match = (a.name || '').toLowerCase().includes(query.toLowerCase()) || (a.city || '').toLowerCase().includes(query.toLowerCase());
    if (filter === 'active') return match && a.active;
    if (filter === 'inactive') return match && !a.active;
    return match;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleToggleStatus = async (id: number) => {
    try {
      const updated = await toggleAgencyStatus(id);
      setAgencies((prev) => prev.map((a) => a.id === id ? { ...a, active: updated.active } : a));
      toast({ title: updated.active ? 'Agence activée' : 'Agence suspendue' });
    } catch { toast({ title: 'Erreur', variant: 'destructive' }); }
  };

  const handleToggleVerification = async (id: number) => {
    try {
      const updated = await toggleAgencyVerification(id);
      setAgencies((prev) => prev.map((a) => a.id === id ? { ...a, verified: updated.verified } : a));
      toast({ title: updated.verified ? 'Agence vérifiée' : 'Vérification retirée' });
    } catch { toast({ title: 'Erreur', variant: 'destructive' }); }
  };

  const changePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminLayout title="Agences" subtitle="Gérez les agences partenaires">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Rechercher une agence..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          {([{ label: 'Toutes', value: 'all' }, { label: 'Actives', value: 'active' }, { label: 'Inactives', value: 'inactive' }] as const).map((f) => (
            <button key={f.value} onClick={() => { setFilter(f.value); setPage(1); }} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${filter === f.value ? 'bg-orange-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <th className="p-4 font-medium">Agence</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Téléphone</th>
                <th className="p-4 font-medium">Biens</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium">Vérifié</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((a) => (
                <tr key={a.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                        {a.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'AG'}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{a.name}</div>
                        <div className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="w-3 h-3" /> {a.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{a.email}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{a.phone_call || a.phone_whatsapp || '—'}</td>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-100">{a.properties_count || 0}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${a.active ? 'bg-green-100 dark:bg-green-500/10 text-green-600' : 'bg-red-100 dark:bg-red-500/10 text-red-600'}`}>
                      {a.active ? 'Active' : 'Suspendue'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleToggleVerification(a.id)} title="Basculer vérification">
                      {a.verified ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-slate-300" />}
                    </button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleToggleStatus(a.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${a.active ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}>
                      {a.active ? 'Suspendre' : 'Activer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-slate-400 py-12">Aucune agence trouvée.</p>}
      </div>

      <SimplePagination page={page} total={filtered.length} perPage={PER_PAGE} onPageChange={changePage} />
    </AdminLayout>
  );
};

export default AdminAgenciesPage;
