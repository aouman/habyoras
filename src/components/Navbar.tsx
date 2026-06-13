import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, Building2, Plus, LogOut, LayoutDashboard } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/contexts/AuthContext';

const links = [
  { label: 'Accueil', to: '/' },
  { label: 'Vos logements', to: '/biens' },
  { label: 'Agences', to: '/agences' },
  { label: 'Contact', to: '/contact' },
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    nav('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/habyoras.png" alt="Habyora" className="h-16 w-auto bg-white rounded-lg p-1 shadow-sm" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  (loc.pathname === l.to.split('?')[0] && l.to !== '/') || (l.to === '/' && loc.pathname === '/')
                    ? 'text-orange-500'
                    : 'text-slate-600 dark:text-slate-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user ? (
              <>
                <Link to="/dashboard" className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> {user?.name || 'Mon espace'}
                </Link>
                <button onClick={handleSignOut} className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Building2 className="w-4 h-4" /> Connexion
                </Link>
                <Link to="/dashboard/ajouter" className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all">
                  <Plus className="w-4 h-4" /> Publier un bien
                </Link>
              </>
            )}
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300">
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 font-medium">
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">{user?.name || 'Mon espace'}</Link>
              <button onClick={handleSignOut} className="w-full text-left px-4 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/auth" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">Connexion</Link>
              <Link to="/dashboard/ajouter" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-lg text-center text-white bg-orange-500 font-semibold">Publier un bien</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
