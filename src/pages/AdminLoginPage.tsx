import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminLoginPage: React.FC = () => {
  const nav = useNavigate();
  const { signInAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signInAdmin(email, password);
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    nav('/admin');
  };

  const input = "w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-orange-500";

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <div className="hidden lg:flex w-1/2 relative">
        <img src="https://d64gsuwffb70l.cloudfront.net/6a298ce466ef5459cefcfc68_1781108040781_abab7a12.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-orange-900/30 flex flex-col justify-end p-12">
          <h2 className="text-3xl font-extrabold text-white mb-3">Administration Habyora</h2>
          <p className="text-slate-200 max-w-md">Accédez au panneau d'administration pour gérer les biens, agences et utilisateurs de la plateforme.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src="/habyoras.png" alt="Habyora" className="h-11 w-auto" />
            <span className="text-xl font-extrabold text-white">Admin</span>
          </Link>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">Connexion administrateur</h1>
          <p className="text-slate-400 text-sm mb-6">Accédez au tableau de bord d'administration</p>

          {error && (
            <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email administrateur" className={input} />
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" className={input} />
            </div>

            <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 disabled:opacity-60">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              Se connecter
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            <Link to="/" className="text-orange-500 font-semibold">Retour au site</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
