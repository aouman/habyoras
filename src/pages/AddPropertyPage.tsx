import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Check, ImagePlus, Save, Map } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createProperty, updateProperty, getProperty } from '@/services/properties';
import DashboardSidebar from '@/components/DashboardSidebar';
import { toast } from '@/hooks/use-toast';

const allAmenities = [
  'Climatisation', 'Wifi haut débit', 'Cuisine équipée', 'Eau chaude',
  'Ascenseur', 'Sécurité 24h/24', 'Balcon', 'Groupe électrogène',
  'Piscine', 'Jardin paysagé', 'Garage', 'Terrasse', 'Buanderie',
  'Forage / eau', 'Fibre optique', 'Salle de réunion', 'Parking',
  'Espace détente', 'Local technique',
];

const AddPropertyPage: React.FC = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loadingProperty, setLoadingProperty] = useState(isEdit);
  const [images, setImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [form, setForm] = useState({
    title: '', type: 'Appartement', transaction: 'Vente', price: '',
    city: 'Abidjan', commune: 'Cocody', country: "Côte d'Ivoire",
    surface: '', bedrooms: '', bathrooms: '', parking: '', description: '',
    googleMapsLink: '',
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    getProperty(Number(id)).then((p) => {
      setForm({
        title: p.title || '',
        type: p.type,
        transaction: p.transaction,
        price: String(p.price),
        city: p.city,
        commune: p.commune,
        country: p.country || "Côte d'Ivoire",
        surface: p.surface ? String(p.surface) : '',
        bedrooms: p.bedrooms ? String(p.bedrooms) : '',
        bathrooms: p.bathrooms ? String(p.bathrooms) : '',
        parking: p.parking ? String(p.parking) : '',
        description: p.description || '',
        googleMapsLink: p.google_maps_link || '',
      });
      setSelectedAmenities(p.amenities || []);
      setImages(p.images || []);
      setIsDraft(p.draft || false);
    }).catch(() => {
      toast({ title: 'Erreur', variant: 'destructive', description: 'Impossible de charger le bien.' });
      nav('/dashboard/biens');
    }).finally(() => setLoadingProperty(false));
  }, [id]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls]);
  };

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        type: form.type,
        transaction: form.transaction,
        price: Number(form.price),
        city: form.city,
        commune: form.commune,
        country: form.country,
        surface: form.surface ? Number(form.surface) : undefined,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        parking: form.parking ? Number(form.parking) : undefined,
        description: form.description || undefined,
        google_maps_link: form.googleMapsLink || undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
        images: images.length > 0 ? images : undefined,
      };

      if (isEdit) {
        await updateProperty(Number(id), payload);
        toast({ title: 'Bien modifié', description: 'Votre annonce a été mise à jour.' });
        nav('/dashboard/biens');
      } else {
        await createProperty(payload);
        setSubmitted(true);
        setTimeout(() => nav('/dashboard/biens'), 1800);
      }
    } catch (err: any) {
      toast({ title: 'Erreur', variant: 'destructive', description: err.response?.data?.message || 'Impossible de publier le bien.' });
    } finally {
      setSubmitting(false);
    }
  };

  const saveDraft = async () => {
    try {
      const payload = {
        title: form.title || 'Brouillon',
        type: form.type,
        transaction: form.transaction,
        price: Number(form.price) || 0,
        city: form.city,
        commune: form.commune,
        draft: true,
      };
      if (isEdit) {
        await updateProperty(Number(id), payload);
        toast({ title: 'Brouillon mis à jour' });
      } else {
        await createProperty(payload);
        toast({ title: 'Brouillon sauvegardé' });
      }
      nav('/dashboard/brouillons');
    } catch {
      toast({ title: 'Erreur', variant: 'destructive', description: 'Impossible de sauvegarder le brouillon.' });
    }
  };

  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const input = "w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-orange-500";

  if (loadingProperty) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        <DashboardSidebar />
        <div className="flex-1 p-6"><div className="animate-pulse space-y-4 max-w-3xl"><div className="h-8 bg-slate-200 rounded w-1/3" /><div className="h-4 bg-slate-200 rounded w-1/4" /><div className="h-96 bg-slate-200 rounded-2xl" /></div></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar />
      <div className="flex-1 min-w-0 p-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">{isEdit ? 'Modifier le bien' : 'Ajouter un bien'}</h1>
        <p className="text-sm text-slate-400 mb-6">{isEdit ? 'Modifiez les informations de votre annonce' : 'Remplissez les informations de votre annonce'}</p>

        {submitted ? (
          <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-100 dark:border-slate-800 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center mb-4"><Check className="w-8 h-8 text-green-500" /></div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Bien publié avec succès !</h2>
            <p className="text-slate-400">Redirection vers le tableau de bord...</p>
          </div>
        ) : (
          <form onSubmit={publish} className="max-w-3xl bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Photos du bien</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3.5 h-3.5 text-white" /></button>
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors">
                  <ImagePlus className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs text-slate-400">Ajouter</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Titre de l'annonce</label>
              <input required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Ex: Villa moderne avec piscine" className={input} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Type de bien</label>
                <select value={form.type} onChange={(e) => set('type', e.target.value)} className={input}>
                  {['Appartement', 'Villa', 'Terrain', 'Bureau', 'Immeuble'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Transaction</label>
                <select value={form.transaction} onChange={(e) => set('transaction', e.target.value)} className={input}>
                  {['Vente', 'Location'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Prix (FCFA)</label>
                <input required type="number" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="0" className={input} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Surface (m²)</label>
                <input type="number" value={form.surface} onChange={(e) => set('surface', e.target.value)} placeholder="0" className={input} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Chambres</label>
                <input type="number" value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} placeholder="0" className={input} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Salles de bain</label>
                <input type="number" value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} placeholder="0" className={input} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Ville</label>
                <select value={form.city} onChange={(e) => set('city', e.target.value)} className={input}>
                  {['Abidjan', 'Grand-Bassam'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Commune / Quartier</label>
                <select value={form.commune} onChange={(e) => set('commune', e.target.value)} className={input}>
                  {['Cocody', 'Plateau', 'Marcory', 'Yopougon', 'Bingerville', 'Grand-Bassam'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Parking</label>
                <input type="number" value={form.parking} onChange={(e) => set('parking', e.target.value)} placeholder="0" className={input} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                <Map className="w-4 h-4 inline mr-1" /> Lien Google Maps
              </label>
              <input value={form.googleMapsLink} onChange={(e) => set('googleMapsLink', e.target.value)} placeholder="https://maps.google.com/..." className={input} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Commodités &amp; équipements</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allAmenities.map((a) => (
                  <label
                    key={a}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm cursor-pointer border transition-colors ${selectedAmenities.includes(a) ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'}`}
                  >
                    <input type="checkbox" checked={selectedAmenities.includes(a)} onChange={() => toggleAmenity(a)} className="rounded text-orange-500 focus:ring-orange-500" />
                    {a}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Description</label>
              <ReactQuill theme="snow" value={form.description} onChange={(v) => set('description', v)} placeholder="Décrivez votre bien..." className="bg-white dark:bg-slate-800 rounded-xl mb-2 [&_.ql-editor]:min-h-[200px]" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 disabled:opacity-50">
                <Upload className="w-5 h-5" /> {submitting ? 'Enregistrement...' : isEdit && isDraft ? 'Publier le bien' : isEdit ? 'Enregistrer les modifications' : 'Publier le bien'}
              </button>
              <button type="button" onClick={saveDraft} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                <Save className="w-5 h-5" /> Enregistrer au brouillon
              </button>
              <button type="button" onClick={() => nav('/dashboard')} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">Annuler</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddPropertyPage;
