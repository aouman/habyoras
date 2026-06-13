import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, MapPin, AlertTriangle, FileText } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import SimplePagination from '@/components/SimplePagination';
import { getDraftProperties, deleteProperty } from '@/services/properties';
import type { Property, PaginatedResponse } from '@/services/types';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

const PER_PAGE = 6;

const DraftPropertiesPage: React.FC = () => {
  const [result, setResult] = useState<PaginatedResponse<Property> | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDraftProperties(page);
      setResult(data);
    } catch { setResult(null); } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { setPage(1); }, [query]);
  useEffect(() => { fetch(); }, [fetch]);

  const items = result?.data || [];
  const filtered = query ? items.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())) : items;

  const handleDelete = async (id: number) => {
    try {
      await deleteProperty(id);
      toast({ title: 'Brouillon supprimé', description: 'Le brouillon a été retiré.' });
      fetch();
    } catch { toast({ title: 'Erreur', variant: 'destructive', description: 'Suppression impossible.' }); }
  };

  const changePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <DashboardLayout title="Brouillons" subtitle={`${result?.total || 0} brouillons`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un brouillon..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
            />
          </div>
          <Link to="/dashboard/ajouter" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm"><Plus className="w-4 h-4" /> Nouveau bien</Link>
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
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">Aucun brouillon trouvé.</p>
            <Link to="/dashboard/ajouter" className="inline-block mt-3 text-orange-500 font-semibold text-sm">Créer un nouveau bien</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="relative">
                    <img src={p.images?.[0] || '/placeholder.svg'} alt={p.title} className="w-full h-44 object-cover opacity-60" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1"><FileText className="w-3 h-3" /> Brouillon</span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-700">{p.transaction}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{p.title}</h3>
                    <p className="flex items-center gap-1 text-xs text-slate-400 mt-1"><MapPin className="w-3 h-3" /> {p.commune || '—'}, {p.city}</p>
                    <p className="text-orange-500 font-extrabold mt-2">{formatPrice(p.price, p.transaction)}</p>
                    <div className="flex items-center justify-end mt-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                      <Link to={`/dashboard/modifier/${p.id}`} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-semibold"><Pencil className="w-3.5 h-3.5" /> Modifier</Link>
                      <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500"><Trash2 className="w-4 h-4" /></button>
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
              Êtes-vous sûr de vouloir supprimer ce brouillon ? Cette action est irréversible.
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

export default DraftPropertiesPage;
