import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Check, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

const OPERATORS = [
  { value: 'MTN', label: 'MTN Money', bg: 'bg-yellow-400', text: 'text-yellow-900', logo: 'M' },
  { value: 'Orange', label: 'Orange Money', bg: 'bg-orange-500', text: 'text-white', logo: 'O' },
  { value: 'Moov', label: 'Moov Money', bg: 'bg-red-500', text: 'text-white', logo: 'M' },
  { value: 'Wave', label: 'Wave', bg: 'bg-blue-500', text: 'text-white', logo: 'W' },
];

const plans: Record<string, { label: string; price: string }> = {
  Premium: { label: 'Premium', price: '50 000 FCFA/an' },
  Gold: { label: 'Gold', price: '120 000 FCFA/an' },
};

const PaymentPage: React.FC = () => {
  const { plan } = useParams<{ plan: string }>();
  const nav = useNavigate();
  const { user } = useAuth();
  const [method, setMethod] = useState<'card' | 'mobile_money'>('card');
  const [operator, setOperator] = useState('MTN');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const planInfo = plan ? plans[plan] : null;

  if (!planInfo || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Plan invalide ou utilisateur non connecté.</p>
          <a href="/tarifs" className="text-orange-500 font-semibold">Voir les offres</a>
        </div>
      </div>
    );
  }

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Record<string, any> = {
        plan,
        method,
      };

      if (method === 'mobile_money') {
        payload.mobile_operator = operator;
        payload.phone = phone;
      } else {
        payload.card_number = cardNumber.replace(/\s/g, '');
        payload.card_expiry = cardExpiry;
        payload.card_cvv = cardCvv;
      }

      const { data } = await api.post('payment/init', payload);
      await api.post(`payment/${data.payment.id}/confirm`);
      setSuccess(true);
    } catch (err: any) {
      toast({ title: 'Erreur de paiement', variant: 'destructive', description: err.response?.data?.message || 'Le paiement a échoué.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center mb-5"><Check className="w-8 h-8 text-green-500" /></div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Paiement réussi !</h2>
          <p className="text-slate-500 mb-6">Votre abonnement <strong>{planInfo.label}</strong> est désormais actif.</p>
          <button onClick={() => nav('/dashboard')} className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold">Accéder au tableau de bord</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-start justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        <button onClick={() => nav('/tarifs')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-orange-500 mb-6"><ArrowLeft className="w-4 h-4" /> Retour aux offres</button>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Moyen de paiement</h2>
            <p className="text-sm text-slate-400 mb-5">Choisissez votre mode de paiement sécurisé</p>

            <div className="flex gap-3 mb-6">
              <button type="button" onClick={() => setMethod('card')} className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${method === 'card' ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                <CreditCard className={`w-6 h-6 ${method === 'card' ? 'text-orange-500' : 'text-slate-400'}`} />
                <span className={`text-xs font-semibold ${method === 'card' ? 'text-orange-600' : 'text-slate-500'}`}>Carte bancaire</span>
              </button>
              <button type="button" onClick={() => setMethod('mobile_money')} className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${method === 'mobile_money' ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                <Smartphone className={`w-6 h-6 ${method === 'mobile_money' ? 'text-orange-500' : 'text-slate-400'}`} />
                <span className={`text-xs font-semibold ${method === 'mobile_money' ? 'text-orange-600' : 'text-slate-500'}`}>Mobile Money</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {method === 'card' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Numéro de carte</label>
                    <input required value={cardNumber} onChange={(e) => setCardNumber(formatCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Date d'expiration</label>
                      <input required value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} placeholder="MM/AA" maxLength={5} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">CVV</label>
                      <input required value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="123" maxLength={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Opérateur</label>
                    <div className="grid grid-cols-4 gap-2">
                      {OPERATORS.map((o) => (
                        <button type="button" key={o.value} onClick={() => setOperator(o.value)} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all ${operator === o.value ? 'ring-2 ring-orange-500' : ''} ${o.bg} ${o.text}`}>
                          <span className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-base font-black">{o.logo}</span>
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Numéro de téléphone</label>
                    <input required value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))} placeholder="+225 01 02 03 04 05" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                  </div>
                </>
              )}

              <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Paiement en cours...</> : <><Lock className="w-5 h-5" /> Payer {planInfo.price}</>}
              </button>
              <p className="text-xs text-center text-slate-400">Paiement sécurisé • Vos informations sont cryptées</p>
            </form>
          </div>

          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 h-fit">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Récapitulatif</h3>
            <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white mb-4">
              <div className="text-sm text-orange-100">Plan choisi</div>
              <div className="text-2xl font-extrabold">{planInfo.label}</div>
              <div className="text-lg font-bold mt-1">{planInfo.price}</div>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Paiement unique</li>
              <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Accès immédiat</li>
              <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Renouvellement automatique</li>
              <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Annulation à tout moment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
