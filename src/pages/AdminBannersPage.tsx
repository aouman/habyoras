import React, { useState, useEffect } from 'react';
import { Image, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import api from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

interface Banner {
  id: number;
  title: string;
  image_url: string;
  positions: string[];
  link_url: string | null;
  start_date: string | null;
  end_date: string | null;
  active: boolean;
  sort_order: number;
}

const ALL_POSITIONS = [
  { value: 'home_horizontal', label: 'Accueil - Bandeau horizontal' },
  { value: 'home_compact', label: 'Accueil - Mini bannière' },
  { value: 'sidebar_vertical', label: 'Page biens - Sidebar vertical' },
  { value: 'sidebar_compact', label: 'Sidebar compact' },
  { value: 'detail_sidebar', label: 'Page détail - Sidebar' },
];

const emptyForm = { title: '', image_url: '', positions: [] as string[], link_url: '', start_date: '', end_date: '', active: true, sort_order: 0 };

const AdminBannersPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetch = () => {
    api.get('admin/banners').then(({ data }) => setBanners(data)).catch(() => {});
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      title: b.title, image_url: b.image_url, positions: b.positions || [],
      link_url: b.link_url || '', start_date: b.start_date || '',
      end_date: b.end_date || '', active: b.active, sort_order: b.sort_order,
    });
    setShowForm(true);
  };

  const togglePosition = (pos: string) => {
    setForm((f) => ({
      ...f,
      positions: f.positions.includes(pos)
        ? f.positions.filter((p) => p !== pos)
        : [...f.positions, pos],
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.positions.length === 0) {
      toast({ title: 'Erreur', variant: 'destructive', description: 'Sélectionnez au moins une position.' });
      return;
    }
    try {
      const payload = {
        ...form,
        link_url: form.link_url || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      };
      if (editing) {
        await api.put(`admin/banners/${editing.id}`, payload);
        toast({ title: 'Bannière modifiée' });
      } else {
        await api.post('admin/banners', payload);
        toast({ title: 'Bannière créée' });
      }
      setShowForm(false);
      fetch();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.end_date?.[0] || 'Erreur';
      toast({ title: 'Erreur', variant: 'destructive', description: msg });
    }
  };

  const toggleActive = async (b: Banner) => {
    try {
      await api.put(`admin/banners/${b.id}`, { ...b, active: !b.active, positions: b.positions, start_date: b.start_date, end_date: b.end_date });
      fetch();
    } catch { toast({ title: 'Erreur', variant: 'destructive' }); }
  };

  const isExpired = (b: Banner) => b.end_date && new Date(b.end_date) < new Date();

  const input = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm";

  return (
    <>
      <AdminLayout title="Bannières publicitaires" subtitle="Gérez les espaces publicitaires du site">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-400">{banners.length} bannière(s)</p>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm"><Plus className="w-4 h-4" /> Ajouter une bannière</button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">{editing ? 'Modifier' : 'Nouvelle'} bannière</h3>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Titre</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Promoteurs immobiliers" className={input} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">URL de l'image</label>
                <input required value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://exemple.com/banniere.jpg" className={input} />
                {form.image_url && (
                  <img src={form.image_url} alt="aperçu" className="mt-2 h-24 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Positions (choix multiple)</label>
                <div className="grid grid-cols-1 gap-2">
                  {ALL_POSITIONS.map((p) => (
                    <label key={p.value} className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                      <input type="checkbox" checked={form.positions.includes(p.value)} onChange={() => togglePosition(p.value)} className="accent-orange-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-200">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Lien de destination</label>
                <input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="https://annonceur.com" className={input} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Début de diffusion</label>
                  <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className={input} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Fin de diffusion</label>
                  <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className={input} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Ordre d'affichage</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={input} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Active</label>
                  <button type="button" onClick={() => setForm({ ...form, active: !form.active })} className={`w-11 h-6 rounded-full transition-colors relative ${form.active ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${form.active ? 'left-[22px]' : 'left-[2px]'}`} />
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm">Enregistrer</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">Annuler</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          {banners.length === 0 ? (
            <p className="text-center text-slate-400 py-12">Aucune bannière.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {banners.map((b) => {
                const expired = isExpired(b);
                return (
                  <div key={b.id} className={`p-5 flex items-center gap-4 ${!b.active || expired ? 'opacity-50' : ''}`}>
                    <img src={b.image_url} alt={b.title} className="w-20 h-14 rounded-xl object-cover border border-slate-100 dark:border-slate-700 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white">{b.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap gap-1">
                        {(b.positions || []).map((p) => {
                          const label = ALL_POSITIONS.find((ap) => ap.value === p)?.label.split(' – ')[1] || p;
                          return <span key={p} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">{label}</span>;
                        })}
                        {b.link_url && <> • <a href={b.link_url} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">lien</a></>}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Ordre: {b.sort_order}
                        {b.start_date && <> • Du {b.start_date}</>}
                        {b.end_date && <> au {b.end_date}</>}
                        {expired && <span className="text-red-500 ml-1">(Expirée)</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => toggleActive(b)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title={b.active ? 'Désactiver' : 'Activer'}>
                        {b.active ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-slate-400" />}
                      </button>
                      <button onClick={() => openEdit(b)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteId(b.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AdminLayout>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la bannière</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              if (!deleteId) return;
              try {
                await api.delete(`admin/banners/${deleteId}`);
                toast({ title: 'Bannière supprimée' });
                fetch();
              } catch { toast({ title: 'Erreur', variant: 'destructive' }); }
              setDeleteId(null);
            }} className="rounded-xl bg-red-500 hover:bg-red-600 text-white">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminBannersPage;
