import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const [done, setDone] = useState(false);
  const reference = searchParams.get('reference');
  const plan = searchParams.get('plan');

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full mx-4 text-center">
        {!done ? (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Vérification du paiement...</h2>
            <p className="text-sm text-slate-400">Votre abonnement sera activé dans quelques instants.</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center mb-5"><Check className="w-8 h-8 text-green-500" /></div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Paiement réussi !</h2>
            <p className="text-slate-500 mb-2">Votre abonnement <strong>{plan || ''}</strong> est actif.</p>
            {reference && <p className="text-xs text-slate-400 mb-6">Réf: {reference}</p>}
            <button onClick={() => nav('/dashboard')} className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold">Accéder au tableau de bord</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
