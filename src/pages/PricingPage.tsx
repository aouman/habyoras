import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/contexts/AuthContext';

const plans = [
  { name: 'Basic', price: 0, popular: false, limit: '5 biens maximum', features: ['1 compte agence', '5 biens maximum', 'Photos illimitées', 'Profil agence', 'Statistiques de base', 'Support par email'] },
  { name: 'Premium', price: 50000, popular: true, limit: '15 biens maximum', features: ['1 compte agence', '15 biens maximum', 'Photos illimitées', 'Profil agence vérifié', 'Badge "Premium"', 'Mise en avant de biens', 'Statistiques avancées', 'Support prioritaire', 'Messagerie clients activée'] },
  { name: 'Gold', price: 120000, popular: false, limit: 'Biens illimités', features: ['1 compte agence', 'Biens illimités', 'Photos illimitées', 'Profil agence certifié', 'Badge "Gold"', 'Mise en avant illimitée', 'Statistiques complètes', 'Support dédié 24/7', 'Messagerie clients activée', 'Account manager dédié'] },
];

const PricingPage: React.FC = () => {
  const nav = useNavigate();
  const { user } = useAuth();

  const handleSelect = (name: string) => {
    if (name === 'Basic') {
      nav('/auth?register=1');
    } else {
      nav(`/paiement/${name}`);
    }
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">Des offres pour chaque agence</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">Choisissez le plan qui correspond à vos ambitions. Sans engagement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((p) => (
            <div key={p.name} className={`relative rounded-3xl p-8 border-2 transition-all ${p.popular ? 'border-orange-500 bg-white dark:bg-slate-800 shadow-2xl md:scale-105' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-1 rounded-full bg-orange-500 text-white text-xs font-bold">
                  <Star className="w-3 h-3 fill-white" /> POPULAIRE
                </span>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{p.name}</h3>
              <p className="text-sm text-slate-400 mt-1">{p.limit}</p>
              <div className="mt-5 mb-6">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{p.price === 0 ? 'Gratuit' : new Intl.NumberFormat('fr-FR').format(p.price)}</span>
                  {p.price > 0 && <span className="text-slate-400 text-sm"> FCFA/an</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-5 h-5 text-orange-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleSelect(p.name)} className="w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:from-orange-600 hover:to-orange-700">
                {p.price === 0 ? 'S\'inscrire gratuitement' : 'Souscrire'}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-sm text-slate-400">Paiement sécurisé par carte bancaire ou Mobile Money (MTN, Orange, Moov).</div>
      </div>
    </PageShell>
  );
};

export default PricingPage;
