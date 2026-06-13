import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, Globe, Wallet } from 'lucide-react';

const types = ['Tous', 'Appartement', 'Villa', 'Terrain', 'Bureau', 'Immeuble'];
const cities = ['Toutes', 'Abidjan', 'Grand-Bassam'];

const SearchBar: React.FC = () => {
  const nav = useNavigate();
  const [city, setCity] = useState('Toutes');
  const [type, setType] = useState('Tous');
  const [budget, setBudget] = useState('');

  const search = () => {
    const params = new URLSearchParams();
    if (city !== 'Toutes') params.set('city', city);
    if (type !== 'Tous') params.set('type', type);
    if (budget) params.set('max', budget);
    nav(`/biens?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-full shadow-2xl p-2 md:p-2 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2">
      <div className="flex items-center gap-2 px-4 py-2.5">
        <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
        <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none">
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2 px-4 py-2.5 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700">
        <Building className="w-5 h-5 text-orange-500 shrink-0" />
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none">
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2 px-4 py-2.5 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700">
        <Wallet className="w-5 h-5 text-orange-500 shrink-0" />
        <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget max (FCFA)" className="w-full bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none" />
      </div>
      <button onClick={search} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl md:rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all">
        <Search className="w-5 h-5" /> Rechercher
      </button>
    </div>
  );
};

export default SearchBar;
