import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Users, TrendingUp } from 'lucide-react';
import PageShell from '@/components/PageShell';
import SearchBar from '@/components/SearchBar';
import Categories from '@/components/Categories';
import PropertyCard from '@/components/PropertyCard';
import BannerAd from '@/components/BannerAd';
import { getProperties } from '@/services/properties';
import { getAgencies } from '@/services/agencies';
import type { Property, Agency } from '@/services/types';

const hero = 'https://d64gsuwffb70l.cloudfront.net/6a298ce466ef5459cefcfc68_1781108040781_abab7a12.png';

const AppLayout: React.FC = () => {
  const [recent, setRecent] = useState<Property[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);

  useEffect(() => {
    getProperties({ page: 1 }).then((res) => setRecent(res.data.slice(0, 8))).catch(() => {});
    getAgencies().then(setAgencies).catch(() => {});
  }, []);

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={hero} alt="Habyora" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-orange-900/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 md:pt-32 md:pb-36">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-sm font-medium mb-5 backdrop-blur-sm">
              {recent.length > 0 ? `${recent.length}+ biens disponibles` : 'bien disponible'}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Trouvez votre futur logement sur <span className="text-orange-500">HABYORA</span>
            </h1>
            <p className="mt-5 text-lg text-slate-200 max-w-xl">
              Des milliers d'appartements, villas et terrains à Abidjan, Grand-Bassam et partout en Côte d'Ivoire.
            </p>
          </div>
        </div>
      </section>

      {/* Search bar */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-16">
        <SearchBar />
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, n: '2 400+', l: 'Biens disponibles' },
            { icon: Users, n: '120+', l: 'Agences partenaires' },
            { icon: ShieldCheck, n: '100%', l: 'Annonces vérifiées' },
            { icon: Star, n: '4.8/5', l: 'Satisfaction client' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.n}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{s.l}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Categories />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BannerAd position="home_horizontal" />
      </div>

      {/* Recent */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Biens récents</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Les dernières annonces ajoutées sur Habyora</p>
          </div>
          <Link to="/biens" className="hidden md:flex items-center gap-1 text-orange-500 font-semibold hover:gap-2 transition-all">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recent.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <BannerAd position="home_compact" />
      </div>

      {/* Agencies */}
      <section className="bg-white dark:bg-slate-900 py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Agences partenaires</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Elles nous font confiance</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {agencies.slice(0, 6).map((a) => (
              <Link key={a.id} to={`/agences`} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-extrabold text-lg mb-3">
                  {a.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'AG'}
                </div>
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{a.name}</div>
                <div className="text-xs text-slate-400 mt-1">{a.properties_count || 0} biens</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Ce que disent nos clients</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: 'Awa Koné', r: "J'ai trouvé mon appartement à Cocody en moins d'une semaine. Service impeccable !", c: 'Locataire à Cocody' },
            { n: 'Jean-Marc Diomandé', r: "Plateforme très professionnelle, les agences sont sérieuses et réactives.", c: 'Acheteur à Bingerville' },
            { n: 'Fatou Bamba', r: "Interface moderne et facile à utiliser. Je recommande vivement Habyora.", c: 'Investisseuse' },
          ].map((t, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />)}</div>
              <p className="text-slate-600 dark:text-slate-300 mb-4">"{t.r}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">{t.n[0]}</div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-sm">{t.n}</div>
                  <div className="text-xs text-slate-400">{t.c}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-10 md:p-14 text-center text-white relative overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Vous êtes une agence ?</h2>
          <p className="text-orange-50 max-w-xl mx-auto mb-6">Publiez vos biens sur Habyora et touchez des milliers d'acheteurs et locataires chaque jour.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-orange-600 font-bold hover:bg-orange-50 transition-colors">
            Découvrir nos offres <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
};

export default AppLayout;
