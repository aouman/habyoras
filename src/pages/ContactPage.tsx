import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, ExternalLink } from 'lucide-react';
import PageShell from '@/components/PageShell';
import api from '@/services/api';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('contact', { name, email, phone: phone || undefined, message });
      setDone(true);
    } catch {
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  const input = "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-orange-500";

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Devenir agence partenaire</h1>
          <p className="text-slate-500 dark:text-slate-400">Laissez-nous vos coordonnées et recevez le lien d'inscription par email.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              { icon: MapPin, t: 'Adresse', v: 'Boulevard de la République, Plateau, Abidjan' },
              { icon: Phone, t: 'Téléphone', v: '+225 07 00 00 00 00' },
              { icon: Mail, t: 'Email', v: 'contact@habyora.ci' },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.t} className="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center"><Icon className="w-6 h-6 text-orange-500" /></div>
                  <div>
                    <div className="text-sm text-slate-400">{c.t}</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-100">{c.v}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
            {done ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center mb-4"><Check className="w-8 h-8 text-green-500" /></div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Merci !</h3>
                <p className="text-slate-400 text-sm mt-1 mb-4">Vérifiez vos emails pour le lien d'inscription.</p>
                <a href="/auth?register=1" className="inline-flex items-center gap-1.5 text-orange-500 font-semibold text-sm hover:underline">
                  <ExternalLink className="w-4 h-4" /> Accéder à l'inscription
                </a>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" className={input} />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre email" className={input} />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone (optionnel)" className={input} />
                <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Parlez-nous de votre agence (ville, type de biens, ...)" className={input} />
                <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 disabled:opacity-50">
                  {loading ? 'Envoi...' : <><Send className="w-5 h-5" /> Recevoir le lien d'inscription</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default ContactPage;
