import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Maximize, Car, Phone, MessageCircle, Star, Share2, Heart, ArrowLeft, CheckCircle2, Send, Building, ChevronRight } from 'lucide-react';
import PageShell from '@/components/PageShell';
import BannerAd from '@/components/BannerAd';
import PropertyCard from '@/components/PropertyCard';
import { getProperty, getProperties } from '@/services/properties';
import { sendMessage } from '@/services/messages';
import { formatPrice } from '@/lib/utils';
import type { Property } from '@/services/types';
import { toast } from '@/hooks/use-toast';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [fav, setFav] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgEmail, setMsgEmail] = useState('');
  const [msgPhone, setMsgPhone] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProperty(Number(id)).then((p) => {
      setProperty(p);
      return getProperties({ type: p.type, page: 1 });
    }).then((res) => {
      setSimilar(res.data.filter((p) => p.id !== Number(id)).slice(0, 4));
    }).catch(() => setProperty(null))
    .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageShell>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="animate-pulse space-y-4"><div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mx-auto" /><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mx-auto" /></div>
        </div>
      </PageShell>
    );
  }

  if (!property) {
    return (
      <PageShell>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-slate-500 mb-4">Bien introuvable.</p>
          <Link to="/biens" className="text-orange-500 font-semibold">Retour aux annonces</Link>
        </div>
      </PageShell>
    );
  }

  const feats = [
    { icon: Maximize, label: 'Surface', value: `${property.surface} m²` },
    { icon: BedDouble, label: 'Chambres', value: property.bedrooms || '—' },
    { icon: Bath, label: 'Salles de bain', value: property.bathrooms || '—' },
    { icon: Car, label: 'Parking', value: property.parking || '—' },
  ];

  const agencyInfo = property.agency;

  const handleSendMessage = async () => {
    if (!msg.trim()) return;
    setSending(true);
    try {
      await sendMessage({
        property_id: property.id,
        agency_id: property.agency_id,
        message: msg,
        email: msgEmail || undefined,
        phone: msgPhone || undefined,
      });
      toast({ title: 'Message envoyé', description: `Votre message a été transmis à ${agencyInfo?.name || "l'agence"}.` });
      setMsg('');
      setMsgEmail('');
      setMsgPhone('');
    } catch {
      toast({ title: 'Erreur', description: 'Impossible d\'envoyer le message.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/biens" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-orange-500 mb-5"><ArrowLeft className="w-4 h-4" /> Retour aux annonces</Link>

        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${property.transaction === 'Location' ? 'bg-blue-600' : 'bg-orange-500'}`}>{property.transaction}</span>
              <span className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300"><Star className="w-4 h-4 fill-orange-400 text-orange-400" /> {property.rating}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{property.title}</h1>
            <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mt-1"><MapPin className="w-4 h-4" /> {property.commune}, {property.city}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFav(!fav)} className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Heart className={`w-5 h-5 ${fav ? 'fill-orange-500 text-orange-500' : 'text-slate-600 dark:text-slate-300'}`} />
            </button>
            <button className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"><Share2 className="w-5 h-5 text-slate-600 dark:text-slate-300" /></button>
          </div>
        </div>

        <div className="mb-8">
          <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
            <img src={property.images?.[active] || '/placeholder.svg'} alt={property.title} className="w-full h-full object-cover transition-all duration-300" />
          </div>
          {property.images && property.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-3">
              {property.images.slice(0, 6).map((img, i) => (
                <button key={i} onClick={() => setActive(i)} className={`rounded-xl overflow-hidden aspect-square border-2 transition-all ${active === i ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Caractéristiques</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {feats.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                      <Icon className="w-6 h-6 text-orange-500" />
                      <div>
                        <div className="text-xs text-slate-400">{f.label}</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{f.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Commodités &amp; équipements</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {property.amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                      <span className="text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Description</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: property.description || '' }} />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Localisation</h2>
              <div className="rounded-xl overflow-hidden aspect-video">
                <iframe
                  title="map"
                  className="w-full h-full"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(property.commune + ' ' + property.city)}&output=embed`}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm sticky top-24">
              <div className="text-3xl font-extrabold text-orange-500 mb-1">{formatPrice(property.price, property.transaction)}</div>
              <p className="text-sm text-slate-400 mb-5">{property.type} • {property.transaction}</p>

              {agencyInfo && (
                <Link
                  to={`/agence/${agencyInfo.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 mb-5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                >
                  {agencyInfo.logo ? (
                    <img src={agencyInfo.logo} alt={agencyInfo.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                      {(agencyInfo.name || 'AG').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">{agencyInfo.name} <Building className="w-3.5 h-3.5 text-orange-500 shrink-0" /></div>
                    <div className="text-xs text-slate-400 flex items-center gap-1"><Star className="w-3 h-3 fill-orange-400 text-orange-400" /> {property.rating} • {agencyInfo.verified ? 'Agence vérifiée' : 'Agence'}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}

              <div className="mb-4 space-y-2">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Envoyer un message à l'agence</label>
                <input
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Votre message..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                />
                <div className="flex gap-2">
                  <input
                    value={msgEmail}
                    onChange={(e) => setMsgEmail(e.target.value)}
                    placeholder="Votre email (optionnel)"
                    type="email"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                  />
                  <input
                    value={msgPhone}
                    onChange={(e) => setMsgPhone(e.target.value)}
                    placeholder="Votre téléphone (optionnel)"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!msg.trim() || sending}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm disabled:opacity-40 transition-colors"
                >
                  <Send className="w-4 h-4" /> {sending ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>

              <a href={`https://wa.me/225${agencyInfo?.phone_whatsapp || '0700000000'}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold mb-2 transition-colors">
                <MessageCircle className="w-5 h-5" /> Contacter sur WhatsApp
              </a>
              <a href={`tel:+225${agencyInfo?.phone_call || '0700000000'}`} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-semibold transition-colors">
                <Phone className="w-5 h-5" /> Appeler l'agence
              </a>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
                <BannerAd position="detail_sidebar" />
              </div>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Biens similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default PropertyDetailPage;
