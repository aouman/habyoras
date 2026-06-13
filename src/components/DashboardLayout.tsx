import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LogOut, Moon, Sun, X, Megaphone } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/contexts/AuthContext';
import { getNotifications } from '@/services/notifications';

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ title, subtitle, children }) => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [notif, setNotif] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    getNotifications().then((list) => {
      if (list.length > 0) setNotif(list[0].message);
    }).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar />
      <div className="flex-1 min-w-0">
        {notif && !dismissed && (
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 flex items-center gap-3 text-sm">
            <Megaphone className="w-5 h-5 shrink-0" />
            <p className="flex-1">{notif}</p>
            <button onClick={() => setDismissed(true)} className="p-1 rounded-full hover:bg-white/20"><X className="w-4 h-4" /></button>
          </div>
        )}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
            <p className="text-sm text-slate-400">{subtitle || `Bienvenue, ${user?.name || 'votre agence'}`}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/dashboard/ajouter" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold text-sm"><Plus className="w-4 h-4" /> Ajouter</Link>
            <button onClick={() => signOut()} title="Déconnexion" className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><LogOut className="w-5 h-5" /></button>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
