import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, MapPin, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import SimplePagination from '@/components/SimplePagination';
import { getMyProperties, deleteProperty, updateProperty } from '@/services/properties';
import type { Property, PaginatedResponse } from '@/services/types';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

const PER_PAGE = 6;

type SaleStatus = 'Actif' | 'En pause' | 'Loué' | 'Vendu';

const statusColors: Record<SaleStatus, string> = {
  'Actif': 'bg-green-500 text-white',
  'En pause': 'bg-slate-500 text-white',
  'Loué': 'bg-blue-500 text-white',
  'Vendu': 'bg-purple-500 text-white',
};

const MyPropertiesPage: React.FC = () => {
  const [result, setResult] = useState<PaginatedResponse<Property> | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'Vente' | 'Location'>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyProperties(page);
      setResult(data);
    } catch { setResult(null); } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { setPage(1); }, [query, filter]);
  useEffect(() => { fetch(); }, [fetch]);

  const items = result?.data || [];
  const filtered = items.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) &&
    (filter === 'all' || p.transaction === filter)
  );

  const handleDelete = async (id: number) => {
    try {
      await deleteProperty(id);
      toast({ title: 'Bien supprimé', description: 'Le bien a été retiré de vos annonces.' });
      fetch();
    } catch { toast({ title: 'Erreur', variant: 'destructive', description: 'Suppression impossible.' }); }
  };

  const toggleStatus = async (id: number, current: string) => {
    try {
      const newStatus = current === 'Actif' ? 'En pause' : 'Actif';
      await updateProperty(id, { status: newStatus } as any);
      fetch();
    } catch { toast({ title: 'Erreur', variant: 'destructive' }); }
  };

  const changeSaleStatus = async (id: number, current: string, target: SaleStatus) => {
    try {
      const newStatus = current === target ? 'Actif' : target;
      await updateProperty(id, { status: newStatus } as any);
      fetch();
    } catch { toast({ title: 'Erreur', variant: 'destructive' }); }
  };

  const changePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <DashboardLayout title="Mes biens" subtitle={`${result?.total || 0} biens`}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Rechercher un bien..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'Vente', 'Location'] as const).map((f) => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${filter === f ? 'bg-orange-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                {f === 'all' ? 'Tous' : f}
              </button>
            ))}
            <Link to="/dashboard/ajouter" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm"><Plus className="w-4 h-4" /> Ajouter</Link>
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
        ) : filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-12">Aucun bien trouvé.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                  <Link to={`/bien/${p.id}`}>
                    <div className="relative">
                      <img src={p.images?.[0] || '/placeholder.svg'} alt={p.title} className="w-full h-44 object-cover" />
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[p.status as SaleStatus] || 'bg-green-500 text-white'}`}>{p.status || 'Actif'}</span>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-700">{p.transaction}</span>
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/bien/${p.id}`} className="hover:text-orange-500 transition-colors">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate">{p.title}</h3>
                    </Link>
                    <p className="flex items-center gap-1 text-xs text-slate-400 mt-1"><MapPin className="w-3 h-3" /> {p.commune}, {p.city}</p>
                    <Link to={`/bien/${p.id}`} className="text-orange-500 font-extrabold mt-2 block">{formatPrice(p.price, p.transaction)}</Link>
                    <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {p.views.toLocaleString('fr-FR')} vues</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleStatus(p.id, p.status)} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">{p.status === 'Actif' ? 'Mettre en pause' : 'Activer'}</button>
                        <Link to={`/dashboard/modifier/${p.id}`} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><Pencil className="w-4 h-4" /></Link>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                      {(['Loué', 'Vendu'] as SaleStatus[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => changeSaleStatus(p.id, p.status, s)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${p.status === s ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                        >
                          {s === 'Loué' ? 'Loué' : 'Vendu'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <SimplePagination page={page} total={result?.total || 0} perPage={PER_PAGE} onPageChange={changePage} />
          </>
        )}
      </DashboardLayout>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2"><AlertTriangle className="w-6 h-6 text-red-500" /><AlertDialogTitle className="text-lg">Confirmer la suppression</AlertDialogTitle></div>
            <AlertDialogDescription className="text-sm text-slate-500">
              Êtes-vous sûr de vouloir supprimer ce bien ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) handleDelete(deleteId); setDeleteId(null); }} className="rounded-xl bg-red-500 hover:bg-red-600 text-white">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyPropertiesPage;
