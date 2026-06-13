import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, LogOut, Moon, Sun } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = ({ title, subtitle, children }) => {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
            <p className="text-sm text-slate-400">{subtitle || 'Super Admin'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => signOut()} title="Déconnexion" className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><LogOut className="w-5 h-5" /></button>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
