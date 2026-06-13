import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import PageShell from '@/components/PageShell';
import PropertyCard from '@/components/PropertyCard';
import SimplePagination from '@/components/SimplePagination';
import BannerAd from '@/components/BannerAd';
import { getProperties } from '@/services/properties';
import type { Property, PaginatedResponse } from '@/services/types';

const types = ['Tous', 'Appartement', 'Villa', 'Terrain', 'Bureau', 'Immeuble'];
const cities = ['Toutes', 'Abidjan', 'Grand-Bassam'];

const ListingsPage: React.FC = () => {
  const [params] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [city, setCity] = useState('Toutes');
  const [type, setType] = useState('Tous');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [beds, setBeds] = useState(0);
  const [trans, setTrans] = useState('Tous');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedResponse<Property> | null>(null);

  useEffect(() => {
    if (params.get('type')) setType(params.get('type')!);
    if (params.get('city')) setCity(params.get('city')!);
    if (params.get('t')) setTrans(params.get('t')!);
    if (params.get('max')) setMax(params.get('max')!);
  }, [params]);

  useEffect(() => { setPage(1); }, [q, city, type, min, max, beds, trans]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProperties({
        type: type !== 'Tous' ? type : undefined,
        transaction: trans !== 'Tous' ? trans : undefined,
        city: city !== 'Toutes' ? city : undefined,
        min: min ? Number(min) : undefined,
        max: max ? Number(max) : undefined,
        beds: beds || undefined,
        q: q || undefined,
        page,
      });
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [q, city, type, min, max, beds, trans, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const reset = () => { setQ(''); setCity('Toutes'); setType('Tous'); setMin(''); setMax(''); setBeds(0); setTrans('Tous'); setPage(1); };

  const changePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const Filters = (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Transaction</label>
        <div className="grid grid-cols-3 gap-2">
          {['Tous', 'Location', 'Vente'].map((t) => (
            <button key={t} onClick={() => setTrans(t)} className={`py-2 rounded-lg text-sm font-medium transition-colors ${trans === t ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{t}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Ville</label>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none">
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Type de bien</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none">
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Prix (FCFA)</label>
        <div className="flex gap-2">
          <input type="number" value={min} onChange={(e) => setMin(e.target.value)} placeholder="Min" className="w-full px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none" />
          <input type="number" value={max} onChange={(e) => setMax(e.target.value)} placeholder="Max" className="w-full px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Chambres min.</label>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((b) => (
            <button key={b} onClick={() => setBeds(b)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${beds === b ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{b === 0 ? 'Tous' : `${b}+`}</button>
          ))}
        </div>
      </div>
      <button onClick={reset} className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Réinitialiser</button>
    </div>
  );

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Vos logements</h1>
          <p className="text-slate-500 dark:text-slate-400">{result?.total ?? 0} bien(s) trouvé(s)</p>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700 shadow-sm">
            <Search className="w-5 h-5 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher par titre ou quartier..." className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none" />
          </div>
          <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl bg-orange-500 text-white font-medium">
            <SlidersHorizontal className="w-5 h-5" /> Filtres
          </button>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2"><SlidersHorizontal className="w-5 h-5 text-orange-500" /> Filtres</h3>
              {Filters}
              <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
                <BannerAd position="sidebar_vertical" />
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-pulse">
                    <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-700" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !result || result.data.length === 0 ? (
              <div className="text-center py-20 text-slate-400">Aucun bien ne correspond à votre recherche.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {result.data.map((p) => <PropertyCard key={p.id} property={p} />)}
                </div>
                <SimplePagination page={result.current_page} total={result.total} perPage={result.per_page} onPageChange={changePage} />
              </>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="relative ml-auto w-80 max-w-[85%] bg-white dark:bg-slate-900 h-full p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 dark:text-white">Filtres</h3>
              <button onClick={() => setShowFilters(false)}><X className="w-6 h-6 text-slate-500" /></button>
            </div>
            {Filters}
            <button onClick={() => setShowFilters(false)} className="w-full mt-6 py-3 rounded-lg bg-orange-500 text-white font-semibold">Voir {result?.total ?? 0} résultats</button>
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default ListingsPage;
