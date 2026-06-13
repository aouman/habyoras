import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Check } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sms, setSms] = useState(true);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('https://famous.ai/api/crm/6a298ce466ef5459cefcfc68/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone: phone || undefined,
          sms_opt_in: sms,
          source: 'footer-signup',
          tags: ['newsletter', 'habyora'],
        }),
      });
    } catch (_) {}
    setDone(true);
    setEmail('');
    setPhone('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/habyoras.png" alt="Habyora" className="h-11 w-auto" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">La plateforme immobilière de référence en Côte d'Ivoire. Trouvez, louez ou achetez votre bien en toute confiance.</p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-orange-500 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Explorer</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/biens" className="hover:text-orange-500">Vos logements</Link></li>
              <li><Link to="/agences" className="hover:text-orange-500">Agences</Link></li>
              <li><Link to="/tarifs" className="hover:text-orange-500">Tarifs</Link></li>
              <li><Link to="/dashboard" className="hover:text-orange-500">Espace agence</Link></li>
              <li><Link to="/admin/login" className="hover:text-orange-500">Administration</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-500" /> Plateau, Abidjan</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-orange-500" /> +225 07 00 00 00 00</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-orange-500" /> contact@habyora.ci</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            {done ? (
              <div className="flex items-center gap-2 text-orange-400 text-sm"><Check className="w-4 h-4" /> Merci, vous êtes inscrit !</div>
            ) : (
              <form onSubmit={submit} className="space-y-2.5">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre email" className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone (optionnel)" className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500" />
                <label className="flex items-start gap-2 text-xs text-slate-400">
                  <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} className="mt-0.5 accent-orange-500" />
                  Recevez nos offres par SMS. Msg & data rates may apply. Reply STOP to unsubscribe.
                </label>
                <button type="submit" className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">S'inscrire</button>
              </form>
            )}
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Habyora. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
