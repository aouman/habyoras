import React, { useState, useEffect } from 'react';
import { Megaphone, Send, X, Play, Trash2, Loader2, Users, Building2, CreditCard } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { getAdminNotifications, createNotification, toggleNotification, deleteNotification, getAgencies } from '@/services/notifications';
import type { Notification } from '@/services/notifications';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

const TARGETS = [
  { value: 'all', label: 'Toutes les agences', icon: Users },
  { value: 'agency', label: 'Agence spécifique', icon: Building2 },
  { value: 'plan', label: 'Par plan', icon: CreditCard },
];

const AdminNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [msg, setMsg] = useState('');
  const [targetType, setTargetType] = useState('all');
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [agencies, setAgencies] = useState<{ id: number; name: string }[]>([]);
  const [sending, setSending] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetch = () => {
    getAdminNotifications().then(setNotifications).catch(() => {});
    getAgencies().then(setAgencies).catch(() => {});
  };

  useEffect(() => { fetch(); }, []);

  const send = async () => {
    if (!msg.trim()) return;
    setSending(true);
    try {
      await createNotification(msg, targetType, targetIdentifier || undefined);
      toast({ title: 'Notification envoyée' });
      setMsg('');
      fetch();
    } catch {
      toast({ title: 'Erreur', variant: 'destructive', description: 'Impossible d\'envoyer.' });
    } finally { setSending(false); }
  };

  const targetLabel = (n: Notification) => {
    if (n.target_type === 'all') return 'Toutes les agences';
    if (n.target_type === 'agency') return `Agence #${n.target_identifier}`;
    if (n.target_type === 'plan') return `Plan ${n.target_identifier}`;
    return '';
  };

  return (
    <>
      <AdminLayout title="Notifications" subtitle="Gérez les messages envoyés aux agences">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center"><Megaphone className="w-5 h-5 text-white" /></div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Nouvelle notification</h2>
              <p className="text-sm text-slate-400">Choisissez la cible et rédigez votre message.</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {TARGETS.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.value} onClick={() => { setTargetType(t.value); setTargetIdentifier(''); }} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${targetType === t.value ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  <Icon className="w-4 h-4" /> {t.label}
                </button>
              );
            })}
          </div>

          {targetType === 'agency' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Sélectionner une agence</label>
              <select value={targetIdentifier} onChange={(e) => setTargetIdentifier(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                <option value="">Choisir...</option>
                {agencies.map((a) => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
              </select>
            </div>
          )}

          {targetType === 'plan' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Sélectionner un plan</label>
              <select value={targetIdentifier} onChange={(e) => setTargetIdentifier(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                <option value="">Choisir...</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Gold">Gold</option>
              </select>
            </div>
          )}

          <div className="flex gap-3">
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Écrivez votre message..."
              rows={2}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-orange-500 resize-none"
            />
            <button onClick={send} disabled={!msg.trim() || sending || (targetType !== 'all' && !targetIdentifier)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm disabled:opacity-50">
              <Send className="w-4 h-4" /> {sending ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-white">Notifications envoyées ({notifications.length})</h2>
          </div>
          {notifications.length === 0 ? (
            <p className="text-center text-slate-400 py-10">Aucune notification envoyée.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.map((n) => (
                <div key={n.id} className={`p-5 flex items-start gap-4 ${!n.active ? 'opacity-50' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.active ? 'bg-orange-100 dark:bg-orange-500/10' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <Megaphone className={`w-5 h-5 ${n.active ? 'text-orange-500' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 dark:text-slate-100">{n.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{targetLabel(n)}</span>
                      <span className="text-xs text-slate-400">{new Date(n.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      {!n.active && <span className="text-xs text-slate-400">• Désactivée</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={async () => {
                        try {
                          await toggleNotification(n.id);
                          fetch();
                          toast({ title: n.active ? 'Notification désactivée' : 'Notification activée' });
                        } catch { toast({ title: 'Erreur', variant: 'destructive' }); }
                      }}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                      title={n.active ? 'Désactiver' : 'Activer'}
                    >
                      {n.active ? <X className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setDeleteId(n.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" title="Supprimer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>Cette notification sera définitivement supprimée.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              if (!deleteId) return;
              try {
                await deleteNotification(deleteId);
                toast({ title: 'Notification supprimée' });
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

export default AdminNotificationsPage;
