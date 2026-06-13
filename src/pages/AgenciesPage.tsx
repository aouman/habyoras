import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Building2, ChevronRight } from 'lucide-react';
import PageShell from '@/components/PageShell';
import SimplePagination from '@/components/SimplePagination';
import { getAgencies } from '@/services/agencies';
import type { Agency } from '@/services/types';

const PER_PAGE = 6;

const AgenciesPage: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAgencies().then(setAgencies).catch(() => {});
  }, []);

  const paginated = agencies.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const changePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageShell>
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">Nos agences partenaires</h1>
          <p className="text-slate-300">Des professionnels de confiance à votre service</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((a) => (
            <Link key={a.id} to={`/agence/${a.id}`} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-extrabold text-xl shrink-0">
                  {a.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'AG'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{a.name}</h3>
                  <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400"><MapPin className="w-4 h-4" /> {a.city}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300"><Star className="w-4 h-4 fill-orange-400 text-orange-400" /> {a.verified ? 'Vérifiée' : 'Standard'}</span>
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300"><Building2 className="w-4 h-4" /> {a.properties_count || 0} biens</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">{a.description}</p>
              <div className="w-full mt-4 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors text-center flex items-center justify-center gap-1 group-hover:gap-2">
                Voir le profil <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        <SimplePagination page={page} total={agencies.length} perPage={PER_PAGE} onPageChange={changePage} />
      </div>
    </PageShell>
  );
};

export default AgenciesPage;
