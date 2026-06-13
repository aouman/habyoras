import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, ExternalLink, Check, Percent, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

const plans: Record<string, { label: string; price: number }> = {
  Premium: { label: 'Premium', price: 50000 },
  Gold: { label: 'Gold', price: 120000 },
};

const PaymentPage: React.FC = () => {
  const { plan } = useParams<{ plan: string }>();
  const nav = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ id: number; code: string; discount_percent?: number; discount_amount?: number } | null>(null);
  const [discountedAmount, setDiscountedAmount] = useState<number | null>(null);
  const [validating, setValidating] = useState(false);
  const [couponError, setCouponError] = useState('');

  const planInfo = plan ? plans[plan] : null;
  const basePrice = planInfo?.price ?? 0;
  const finalPrice = discountedAmount ?? basePrice;
  const hasDiscount = discountedAmount !== null && discountedAmount < basePrice;

  useEffect(() => {
    setAppliedCoupon(null);
    setDiscountedAmount(null);
    setCouponCode('');
    setCouponError('');
  }, [plan]);

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

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidating(true);
    setCouponError('');
    try {
      const { data } = await api.post('coupons/validate', { code: couponCode.trim(), plan });
      setAppliedCoupon(data.coupon);
      setDiscountedAmount(data.discounted_amount);
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Code invalide.');
      setAppliedCoupon(null);
      setDiscountedAmount(null);
    } finally {
      setValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountedAmount(null);
    setCouponCode('');
    setCouponError('');
  };

  const handlePay = async () => {
    setSubmitting(true);
    try {
      const payload: Record<string, any> = { plan };
      if (appliedCoupon) payload.coupon_code = appliedCoupon.code;
      const { data } = await api.post('payment/init', payload);
      window.location.href = data.checkout_url;
    } catch (err: any) {
      toast({ title: 'Erreur', variant: 'destructive', description: err.response?.data?.message || 'Impossible d\'initier le paiement.' });
      setSubmitting(false);
    }
  };

  const input = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-start justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <button onClick={() => nav('/tarifs')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-orange-500 mb-6"><ArrowLeft className="w-4 h-4" /> Retour aux offres</button>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Paiement sécurisé</h2>
          <p className="text-sm text-slate-400 mb-6">Vous allez être redirigé vers la plateforme de paiement sécurisée <strong>GeniusPay</strong>.</p>

          {/* Coupon code */}
          <div className="mb-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Code promo</label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">{appliedCoupon.code}</span>
                  <span className="text-xs text-green-500">
                    {appliedCoupon.discount_percent ? `-${appliedCoupon.discount_percent}%` : `-${Number(appliedCoupon.discount_amount).toLocaleString()} XOF`}
                  </span>
                </div>
                <button onClick={removeCoupon} className="p-1 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/20"><X className="w-4 h-4 text-green-500" /></button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && validateCoupon()} placeholder="Ex: PROMO20" className={input} />
                <button onClick={validateCoupon} disabled={validating || !couponCode.trim()} className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-sm font-semibold disabled:opacity-50 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                  {validating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Appliquer'}
                </button>
              </div>
            )}
            {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
          </div>

          {/* Pricing */}
          <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white mb-6">
            <div className="text-sm text-orange-100">Plan choisi</div>
            <div className="text-2xl font-extrabold">{planInfo.label}</div>
            {hasDiscount ? (
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg line-through text-orange-200">{basePrice.toLocaleString()} FCFA</span>
                <span className="text-xl font-bold">{finalPrice.toLocaleString()} FCFA</span>
              </div>
            ) : (
              <div className="text-lg font-bold mt-1">{basePrice.toLocaleString()} FCFA</div>
            )}
          </div>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Paiement par Mobile Money ou Carte bancaire</li>
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Accès immédiat après confirmation</li>
          </ul>

          <button onClick={handlePay} disabled={submitting} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Redirection...</> : <><ExternalLink className="w-5 h-5" /> Payer {finalPrice.toLocaleString()} FCFA</>}
          </button>
          <p className="text-xs text-center text-slate-400 mt-3">Paiement sécurisé • Wave, Orange Money, MTN, Moov, Cartes</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
