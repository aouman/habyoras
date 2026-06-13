import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Eye, CheckCircle2, XCircle, Trash2, Building } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import SimplePagination from '@/components/SimplePagination';
import { getAdminProperties, moderateProperty, deleteProperty } from '@/services/properties';
import type { Property, PaginatedResponse } from '@/services/types';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const AdminPropertiesPage: React.FC = () => {
  const [result, setResult] = useState<PaginatedResponse<Property> | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'reported'>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page };
      if (filter === 'approved') params.moderation = 'Approuvé';
      else if (filter === 'pending') params.moderation = 'En attente';
      else if (filter === 'reported') params.reported = true;
      if (query) params.q = query;
      const data = await getAdminProperties(params);
      setResult(data);
    } catch { setResult(null); } finally { setLoading(false); }
  }, [query, filter, page]);

  useEffect(() => { setPage(1); }, [query, filter]);
  useEffect(() => { fetch(); }, [fetch]);

  const handleModerate = async (id: number, moderation: 'En attente' | 'Approuvé') => {
    try {
      await moderateProperty(id, moderation);
      toast({ title: moderation === 'Approuvé' ? 'Bien approuvé' : 'Bien mis en attente', description: `Le bien a été ${moderation === 'Approuvé' ? 'approuvé' : 'mis en attente'}.` });
      fetch();
    } catch { toast({ title: 'Erreur', variant: 'destructive', description: 'Action impossible.' }); }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProperty(id);
      toast({ title: 'Bien supprimé', description: 'Le bien a été supprimé de la plateforme.' });
      fetch();
    } catch { toast({ title: 'Erreur', variant: 'destructive', description: 'Suppression impossible.' }); }
  };

  const changePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminLayout title="Biens" subtitle="Modérez les annonces publiées">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un bien..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          {([{ label: 'Tous', value: 'all' }, { label: 'Approuvés', value: 'approved' }, { label: 'En attente', value: 'pending' }, { label: 'Signalés', value: 'reported' }] as const).map((f) => (
            <button key={f.value} onClick={() => { setFilter(f.value); setPage(1); }} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${filter === f.value ? 'bg-orange-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-pulse">
              <div className="h-44 bg-slate-200 dark:bg-slate-700" />
              <div className="p-4 space-y-3"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" /><div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" /></div>
            </div>
          ))}
        </div>
      ) : !result || result.data.length === 0 ? (
        <p className="text-center text-slate-400 py-12">Aucun bien trouvé.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {result.data.map((p) => (
              <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="relative">
                  <img src={p.images?.[0] || '/placeholder.svg'} alt={p.title} className="w-full h-44 object-cover" />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${p.moderation === 'Approuvé' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>{p.moderation}</span>
                  {p.reported && <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">Signalé</span>}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{p.title}</h3>
                  <p className="flex items-center gap-1 text-xs text-slate-400 mt-1"><MapPin className="w-3 h-3" /> {p.commune}, {p.city}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Building className="w-3 h-3" /> {p.agency?.name || '—'}
                  </div>
                  <p className="text-orange-500 font-extrabold mt-2">{formatPrice(p.price, p.transaction)}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {p.views.toLocaleString('fr-FR')} vues</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{p.type}</span>
                    <span>{p.transaction}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    {p.moderation !== 'Approuvé' ? (
                      <button onClick={() => handleModerate(p.id, 'Approuvé')} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-semibold"><CheckCircle2 className="w-3.5 h-3.5" /> Approuver</button>
                    ) : (
                      <button onClick={() => handleModerate(p.id, 'En attente')} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-semibold"><XCircle className="w-3.5 h-3.5" /> Retirer</button>
                    )}
                    <Link to={`/bien/${p.id}`} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"><Eye className="w-3.5 h-3.5" /></Link>
                    <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <SimplePagination page={result.current_page} total={result.total} perPage={result.per_page} onPageChange={changePage} />
        </>
      )}
    </AdminLayout>
  );
};

export default AdminPropertiesPage;
