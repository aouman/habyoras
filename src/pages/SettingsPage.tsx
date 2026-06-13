import React, { useState, useEffect, useRef } from 'react';
import { User, Bell, Lock, CreditCard, Save, Camera, Phone, MessageCircle, Users, Copy, Check, Trash2, RefreshCw } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/services/agencies';
import { changePassword } from '@/services/auth';
import { getCollaborators, generateInviteCode, removeCollaborator } from '@/services/collaborators';
import type { Collaborator } from '@/services/collaborators';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

const tabs = [
  { id: 'profile', label: 'Profil agence', icon: User },
  { id: 'collaborators', label: 'Collaborateurs', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Sécurité', icon: Lock },
  { id: 'billing', label: 'Abonnement', icon: CreditCard },
];

const SettingsPage: React.FC = () => {
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    name: '', email: '', city: '', phone_call: '', phone_whatsapp: '', description: '', logo: '',
  });
  const [notif, setNotif] = useState({ messages: true, contacts: true, newsletter: false, marketing: false });
  const [pw, setPw] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [maxCollab, setMaxCollab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '', email: user.email || '', city: user.city || '',
        phone_call: user.phone_call || '', phone_whatsapp: user.phone_whatsapp || '',
        description: user.description || '', logo: user.logo || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (tab === 'collaborators') fetchData();
  }, [tab]);

  const fetchData = async () => {
    try {
      const list = await getCollaborators();
      setCollaborators(Array.isArray(list) ? list : []);
    } catch { setCollaborators([]); }
  };

  const handleGenerate = async () => {
    try {
      const res = await generateInviteCode();
      setInviteLink(res.invite_link);
      setInviteCode(res.invite_code);
      setMaxCollab(res.max_collaborators);
      toast({ title: 'Lien d\'invitation généré' });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur';
      toast({ title: 'Erreur', variant: 'destructive', description: msg });
    }
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let logoUrl = form.logo;
      if (logoFile) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(logoFile);
        });
        logoUrl = base64;
      }
      const updated = await updateProfile({
        name: form.name, city: form.city, phone_call: form.phone_call,
        phone_whatsapp: form.phone_whatsapp, description: form.description,
        logo: logoUrl || undefined,
      });
      toast({ title: 'Modifications enregistrées' });
      setLogoFile(null);
      setLogoPreview(null);
      setUser(updated as any);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.logo?.[0] || 'Erreur';
      toast({ title: 'Erreur', variant: 'destructive', description: msg });
    }
  };

  const saveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword(pw.current_password, pw.new_password, pw.new_password_confirmation);
      toast({ title: 'Mot de passe mis à jour' });
      setPw({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err: any) {
      const msg = err.response?.data?.errors?.current_password?.[0] || err.response?.data?.message || 'Erreur';
      toast({ title: 'Erreur', variant: 'destructive', description: msg });
    }
  };

  const currentLogo = logoPreview || form.logo || null;
  const initials = (user?.name || 'A').slice(0, 2).toUpperCase();

  return (
    <>
      <DashboardLayout title="Paramètres" subtitle="Gérez votre compte et vos préférences">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-100 dark:border-slate-800 h-fit">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-1 ${tab === t.id ? 'bg-orange-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  <Icon className="w-5 h-5" /> {t.label}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
            {tab === 'profile' && (
              <form onSubmit={save} className="space-y-5">
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">Profil de l'agence</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {currentLogo ? (
                      <img src={currentLogo} alt="" className="w-20 h-20 rounded-2xl object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-extrabold text-2xl">{initials}</div>
                    )}
                    <button type="button" onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"><Camera className="w-4 h-4" /></button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{form.name || 'Mon agence'}</div>
                    <div className="text-sm text-slate-400">{user?.verified ? 'Agence vérifiée' : 'Agence'}</div>
                    <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-orange-500 font-semibold mt-1 hover:underline">Changer le logo</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nom de l'agence" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field label="Email" type="email" value={form.email} onChange={() => {}} />
                  <Field label="Ville" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
                  <Field label="Téléphone (appel)" value={form.phone_call} onChange={(v) => setForm({ ...form, phone_call: v })} placeholder="+225 ..." icon={Phone} />
                  <Field label="Téléphone (WhatsApp)" value={form.phone_whatsapp} onChange={(v) => setForm({ ...form, phone_whatsapp: v })} placeholder="+225 ..." icon={MessageCircle} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Description</label>
                  <ReactQuill theme="snow" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="Présentez votre agence..." className="bg-white dark:bg-slate-800 rounded-xl mb-2 [&_.ql-editor]:min-h-[120px]" />
                </div>
                <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm"><Save className="w-4 h-4" /> Enregistrer</button>
              </form>
            )}

            {tab === 'collaborators' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">Collaborateurs</h2>
                    <p className="text-sm text-slate-400">{collaborators.length} / {maxCollab} utilisés</p>
                  </div>
                  <button onClick={handleGenerate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm">
                    <RefreshCw className="w-4 h-4" /> {inviteLink ? 'Régénérer' : 'Générer'} le lien
                  </button>
                </div>

                {inviteLink && (
                  <div className="bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-4">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Lien d'invitation unique à partager :</p>
                    <div className="flex items-center gap-2">
                      <input readOnly value={inviteLink} className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-600" />
                      <button onClick={() => { navigator.clipboard.writeText(inviteLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold">
                        {copied ? <><Check className="w-4 h-4" /> Copié</> : <><Copy className="w-4 h-4" /> Copier</>}
                      </button>
                    </div>
                  </div>
                )}

                {!inviteLink && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Cliquez sur "Générer le lien" pour obtenir un lien d'invitation unique à partager avec vos collaborateurs.</p>
                  </div>
                )}

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {collaborators.length === 0 ? (
                    <p className="text-center text-slate-400 py-8 text-sm">Aucun collaborateur pour le moment.</p>
                  ) : (
                    collaborators.map((c) => (
                      <div key={c.id} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                            {(c.name || '?').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-slate-900 dark:text-white">{c.name}</div>
                            <div className="text-xs text-slate-400">{c.email}</div>
                          </div>
                        </div>
                        <button onClick={() => setDeleteId(c.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" title="Retirer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {tab === 'notifications' && (
              <form onSubmit={(e) => { e.preventDefault(); toast({ title: 'Préférences enregistrées' }); }} className="space-y-5">
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">Notifications</h2>
                {([
                  ['messages', 'Nouveaux messages', 'Recevez une alerte à chaque nouveau message.'],
                  ['contacts', 'Demandes de contact', 'Soyez notifié des demandes de visite et contacts.'],
                  ['newsletter', 'Newsletter Habyora', 'Conseils immobiliers et actualités du marché.'],
                  ['marketing', 'Offres marketing', 'Promotions sur les abonnements et services.'],
                ] as const).map(([key, title, desc]) => (
                  <label key={key} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{title}</div>
                      <div className="text-sm text-slate-400">{desc}</div>
                    </div>
                    <button type="button" onClick={() => setNotif({ ...notif, [key]: !notif[key] })} className={`w-11 h-6 rounded-full transition-colors relative ${notif[key] ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: notif[key] ? '22px' : '2px' }} />
                    </button>
                  </label>
                ))}
                <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm"><Save className="w-4 h-4" /> Enregistrer</button>
              </form>
            )}

            {tab === 'security' && (
              <form onSubmit={saveSecurity} className="space-y-5">
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">Sécurité</h2>
                <Field label="Mot de passe actuel" type="password" value={pw.current_password} onChange={(v) => setPw({ ...pw, current_password: v })} placeholder="••••••••" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nouveau mot de passe" type="password" value={pw.new_password} onChange={(v) => setPw({ ...pw, new_password: v })} placeholder="••••••••" />
                  <Field label="Confirmer" type="password" value={pw.new_password_confirmation} onChange={(v) => setPw({ ...pw, new_password_confirmation: v })} placeholder="••••••••" />
                </div>
                <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm"><Save className="w-4 h-4" /> Mettre à jour</button>
              </form>
            )}

            {tab === 'billing' && (
              <div className="space-y-5">
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">Abonnement</h2>
                <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-orange-100">Plan actuel</div>
                      <div className="text-2xl font-extrabold">Gold</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold">120 000 F</div>
                      <div className="text-sm text-orange-100">/ an</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-orange-50">18 / 25 biens publiés • Renouvellement le 10 juillet 2026</div>
                </div>
                <a href="/tarifs" className="inline-block px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm">Changer de plan</a>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer le collaborateur</AlertDialogTitle>
            <AlertDialogDescription>Ce collaborateur n'aura plus accès à votre espace.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              if (!deleteId) return;
              try {
                await removeCollaborator(deleteId);
                toast({ title: 'Collaborateur retiré' });
                fetchData();
              } catch { toast({ title: 'Erreur', variant: 'destructive' }); }
              setDeleteId(null);
            }} className="rounded-xl bg-red-500 hover:bg-red-600 text-white">Retirer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; icon?: React.FC<{ className?: string }> }> = ({ label, value, onChange, type = 'text', placeholder, icon: Icon }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white ${Icon ? 'pl-10' : ''}`} />
    </div>
  </div>
);

export default SettingsPage;
