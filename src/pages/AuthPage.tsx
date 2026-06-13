import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Building2, MapPin, Loader2, AlertCircle, User, Key } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { registerCollaborator } from '@/services/collaborators';

const AuthPage: React.FC = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const inviteCode = params.get('invite_code');

  const { signIn, signInCollaborator, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'collaborator-signup' | 'collaborator-login'>(
    inviteCode ? 'collaborator-signup' : 'login'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [city, setCity] = useState('Abidjan');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCollaboratorLogin, setIsCollaboratorLogin] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'collaborator-signup' && inviteCode) {
        const res = await registerCollaborator(inviteCode, agencyName, email, password, password);
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('auth_role', 'collaborator');
        nav('/dashboard');
        return;
      }

      if (isCollaboratorLogin) {
        const res = await signInCollaborator(email, password);
        if (res.error) { setError(res.error); setLoading(false); return; }
        nav('/dashboard');
        return;
      }

      const res = mode === 'login'
        ? await signIn(email, password)
        : await signUp(agencyName, email, password, city);
      if (res.error) { setError(res.error); setLoading(false); return; }
      nav('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur');
    }

    setLoading(false);
  };

  const input = "w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-orange-500";

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <div className="hidden lg:flex w-1/2 relative">
        <img src="https://d64gsuwffb70l.cloudfront.net/6a298ce466ef5459cefcfc68_1781108040781_abab7a12.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-orange-900/30 flex flex-col justify-end p-12">
          <h2 className="text-3xl font-extrabold text-white mb-3">Espace agence Habyora</h2>
          <p className="text-slate-200 max-w-md">Gérez vos annonces, suivez vos statistiques et développez votre activité immobilière en Côte d'Ivoire.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src="/habyoras.png" alt="Habyora" className="h-11 w-auto" />
          </Link>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
            {mode === 'collaborator-signup' ? 'Rejoindre l\'agence' :
             isCollaboratorLogin ? 'Connexion collaborateur' :
             mode === 'login' ? 'Connexion agence' : 'Créer un compte agence'}
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            {mode === 'collaborator-signup' ? 'Créez votre compte pour accéder au tableau de bord' :
             isCollaboratorLogin ? 'Accédez au tableau de bord de votre agence' :
             mode === 'login' ? 'Accédez à votre tableau de bord' : 'Commencez à publier vos biens'}
          </p>

          {error && (
            <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === 'collaborator-signup' && (
              <>
                <div className="relative">
                  <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input readOnly value={inviteCode || ''} placeholder="Code d'invitation" className={input} />
                </div>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input required value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Votre nom" className={input} />
                </div>
              </>
            )}
            {(mode === 'signup' && !inviteCode) && (
              <>
                <div className="relative">
                  <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input required value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Nom de l'agence" className={input} />
                </div>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select value={city} onChange={(e) => setCity(e.target.value)} className={input}>
                    {['Abidjan', 'Grand-Bassam', 'Bingerville', 'Yamoussoukro'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </>
            )}
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={input} />
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe (min. 6 caractères)" className={input} />
            </div>

            <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 disabled:opacity-60">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {mode === 'collaborator-signup' ? 'Rejoindre l\'agence' :
               isCollaboratorLogin ? 'Se connecter' :
               mode === 'login' ? 'Se connecter' : "Créer mon compte"}
            </button>
          </form>

          {!inviteCode && (
            <div className="text-center space-y-2 mt-6">
              <p className="text-sm text-slate-500">
                {mode === 'login' ? "Pas encore de compte ?" : 'Déjà inscrit ?'}{' '}
                <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="text-orange-500 font-semibold">
                  {mode === 'login' ? "S'inscrire" : 'Se connecter'}
                </button>
              </p>
              <button
                onClick={() => { setIsCollaboratorLogin(!isCollaboratorLogin); setError(''); setMode(isCollaboratorLogin ? 'login' : 'collaborator-login'); }}
                className="text-sm text-slate-400 hover:text-orange-500"
              >
                {isCollaboratorLogin ? "Connexion agence" : "Vous êtes collaborateur ? Connectez-vous ici"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
