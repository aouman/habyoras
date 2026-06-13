import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentErrorPage: React.FC = () => {
  const nav = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-5"><XCircle className="w-8 h-8 text-red-500" /></div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Paiement échoué</h2>
        <p className="text-slate-500 mb-6">Le paiement n'a pas abouti. Vous pouvez réessayer.</p>
        <button onClick={() => nav('/tarifs')} className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold">Réessayer</button>
      </div>
    </div>
  );
};

export default PaymentErrorPage;
