import React, { useState, useEffect } from 'react';
import { Tag, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import api from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

interface Coupon {
  id: number;
  code: string;
  discount_percent: number | null;
  discount_amount: number | null;
  applicable_plans: string[] | null;
  max_uses: number;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
}

const ALL_PLANS = ['Premium', 'Gold'];

const emptyForm = { code: '', discount_type: 'percent' as 'percent' | 'amount', discount_percent: '', discount_amount: '', applicable_plans: [] as string[], max_uses: 0, valid_from: '', valid_until: '', active: true };

const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetch = () => {
    api.get('admin/coupons').then(({ data }) => setCoupons(data));
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      discount_type: c.discount_percent ? 'percent' : 'amount',
      discount_percent: c.discount_percent?.toString() || '',
      discount_amount: c.discount_amount?.toString() || '',
      applicable_plans: c.applicable_plans || [],
      max_uses: c.max_uses,
      valid_from: c.valid_from || '',
      valid_until: c.valid_until || '',
      active: c.active,
    });
    setShowForm(true);
  };

  const togglePlan = (p: string) => {
    setForm((f) => ({
      ...f,
      applicable_plans: f.applicable_plans.includes(p) ? f.applicable_plans.filter((x) => x !== p) : [...f.applicable_plans, p],
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Record<string, any> = {
        code: form.code.toUpperCase(),
        discount_percent: form.discount_type === 'percent' ? Number(form.discount_percent) : null,
        discount_amount: form.discount_type === 'amount' ? Number(form.discount_amount) : null,
        applicable_plans: form.applicable_plans.length > 0 ? form.applicable_plans : null,
        max_uses: Number(form.max_uses),
        valid_from: form.valid_from || null,
        valid_until: form.valid_until || null,
        active: form.active,
      };
      if (editing) {
        await api.put(`admin/coupons/${editing.id}`, payload);
        toast({ title: 'Coupon modifié' });
      } else {
        await api.post('admin/coupons', payload);
        toast({ title: 'Coupon créé' });
      }
      setShowForm(false);
      fetch();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.code?.[0] || 'Erreur';
      toast({ title: 'Erreur', variant: 'destructive', description: msg });
    }
  };

  const input = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm";

  return (
    <>
      <AdminLayout title="Codes promo" subtitle="Créez et gérez les coupons de réduction">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-400">{coupons.length} coupon(s)</p>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm"><Plus className="w-4 h-4" /> Ajouter un coupon</button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">{editing ? 'Modifier' : 'Nouveau'} coupon</h3>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Code promo</label>
                <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="PROMO20" className={input} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Type de réduction</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setForm({ ...form, discount_type: 'percent' })} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${form.discount_type === 'percent' ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>Pourcentage (%)</button>
                  <button type="button" onClick={() => setForm({ ...form, discount_type: 'amount' })} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${form.discount_type === 'amount' ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>Montant fixe (XOF)</button>
                </div>
              </div>
              {form.discount_type === 'percent' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Pourcentage de réduction</label>
                  <input required type="number" min="1" max="100" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} placeholder="20" className={input} />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Montant de réduction (XOF)</label>
                  <input required type="number" min="1" value={form.discount_amount} onChange={(e) => setForm({ ...form, discount_amount: e.target.value })} placeholder="10000" className={input} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Plans concernés (optionnel, vide = tous)</label>
                <div className="flex gap-3">
                  {ALL_PLANS.map((p) => (
                    <label key={p} className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                      <input type="checkbox" checked={form.applicable_plans.includes(p)} onChange={() => togglePlan(p)} className="accent-orange-500" />
                      <span className="text-sm">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Utilisations max (0 = illimité)</label>
                <input type="number" min="0" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} className={input} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Valide du</label>
                  <input type="date" value={form.valid_from} onChange={(e) => setForm({ ...form, valid_from: e.target.value })} className={input} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Valide au</label>
                  <input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} className={input} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Actif</label>
                <button type="button" onClick={() => setForm({ ...form, active: !form.active })} className={`w-11 h-6 rounded-full transition-colors relative ${form.active ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${form.active ? 'left-[22px]' : 'left-[2px]'}`} />
                </button>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm">Enregistrer</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">Annuler</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          {coupons.length === 0 ? (
            <p className="text-center text-slate-400 py-12">Aucun coupon.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {coupons.map((c) => {
                const expired = c.valid_until && new Date(c.valid_until) < new Date();
                const exhausted = c.max_uses > 0 && c.used_count >= c.max_uses;
                const disabled = !c.active || expired || exhausted;
                return (
                  <div key={c.id} className={`p-5 flex items-center gap-4 ${disabled ? 'opacity-50' : ''}`}>
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center shrink-0"><Tag className="w-5 h-5 text-orange-500" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white">{c.code}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {c.discount_percent ? `-${c.discount_percent}%` : `-${Number(c.discount_amount).toLocaleString()} XOF`}
                        {c.applicable_plans && c.applicable_plans.length > 0 && ` • ${c.applicable_plans.join(', ')}`}
                        {c.max_uses > 0 && ` • ${c.used_count}/${c.max_uses} utilisations`}
                        {c.valid_until && ` • Jusqu'au ${c.valid_until}`}
                        {expired && <span className="text-red-500 ml-1">(Expiré)</span>}
                        {exhausted && <span className="text-red-500 ml-1">(Épuisé)</span>}
                      </div>
                    </div>
                    <button onClick={() => api.put(`admin/coupons/${c.id}`, { ...c, active: !c.active, applicable_plans: c.applicable_plans }).then(fetch).catch(() => {})} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title={c.active ? 'Désactiver' : 'Activer'}>
                      {c.active ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-slate-400" />}
                    </button>
                    <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(c.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500"><Trash2 className="w-4 h-4" /></button>
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
            <AlertDialogTitle>Supprimer le coupon</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              if (!deleteId) return;
              try { await api.delete(`admin/coupons/${deleteId}`); toast({ title: 'Coupon supprimé' }); fetch(); } catch { toast({ title: 'Erreur', variant: 'destructive' }); }
              setDeleteId(null);
            }} className="rounded-xl bg-red-500 hover:bg-red-600 text-white">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminCouponsPage;
