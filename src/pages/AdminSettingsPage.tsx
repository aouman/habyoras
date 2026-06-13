import React, { useState } from 'react';
import { Save, Globe, Bell, Shield, Palette, Key } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { toast } from '@/hooks/use-toast';

const AdminSettingsPage: React.FC = () => {
  const [siteName, setSiteName] = useState('Habyora');
  const [siteDesc, setSiteDesc] = useState('Plateforme immobilière en Côte d\'Ivoire');
  const [contactEmail, setContactEmail] = useState('contact@habiora.ci');
  const [maintenance, setMaintenance] = useState(false);

  const save = () => {
    toast({ title: 'Paramètres sauvegardés', description: 'Les modifications ont été enregistrées avec succès.' });
  };

  return (
    <AdminLayout title="Paramètres" subtitle="Configuration générale de la plateforme">
      <div className="max-w-3xl">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center"><Globe className="w-5 h-5 text-white" /></div>
            <h2 className="font-bold text-slate-900 dark:text-white">Informations générales</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom du site</label>
              <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <input value={siteDesc} onChange={(e) => setSiteDesc(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email de contact</label>
              <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center"><Bell className="w-5 h-5 text-white" /></div>
            <h2 className="font-bold text-slate-900 dark:text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            {['Nouvelle inscription agence', 'Bien signalé par un utilisateur', 'Abonnement arrivant à expiration', 'Nouveau message de contact'].map((item) => (
              <label key={item} className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                <input type="checkbox" defaultChecked className="rounded text-orange-500 focus:ring-orange-500" />
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
            <h2 className="font-bold text-slate-900 dark:text-white">Maintenance</h2>
          </div>
          <label className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mode maintenance</span>
              <p className="text-xs text-slate-400">Les visiteurs verront une page de maintenance</p>
            </div>
            <button onClick={() => setMaintenance(!maintenance)} className={`w-12 h-6 rounded-full transition-colors ${maintenance ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${maintenance ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </label>
        </div>

        <button onClick={save} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors">
          <Save className="w-4 h-4" /> Enregistrer les modifications
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
