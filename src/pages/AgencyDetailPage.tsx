import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Phone, MessageCircle, Mail, Building2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import PropertyCard from '@/components/PropertyCard';
import SimplePagination from '@/components/SimplePagination';
import { getAgency } from '@/services/agencies';
import type { Agency, Property } from '@/services/types';

const PER_PAGE = 6;

const AgencyDetailPage: React.FC = () => {
  const { id } = useParams();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getAgency(Number(id)).then(setAgency).catch(() => setAgency(null)).finally(() => setLoading(false));
  }, [id]);

  const allProperties: Property[] = agency?.properties || [];
  const paginated = allProperties.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) {
    return (
      <PageShell>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="animate-pulse space-y-4"><div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mx-auto" /><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mx-auto" /></div>
        </div>
      </PageShell>
    );
  }

  if (!agency) {
    return (
      <PageShell>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-slate-500 mb-4">Agence introuvable.</p>
          <Link to="/agences" className="text-orange-500 font-semibold">Toutes les agences</Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/agences" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-orange-500 mb-6"><ArrowLeft className="w-4 h-4" /> Toutes les agences</Link>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 md:p-10 text-white mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {agency.logo ? (
              <img src={agency.logo} alt={agency.name} className="w-20 h-20 rounded-2xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
                {(agency.name || 'AG').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold">{agency.name}</h1>
              <p className="text-orange-100 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" /> {agency.city || 'Abidjan'}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="flex items-center gap-1 text-sm text-white/80"><Star className="w-4 h-4 fill-white/80" /> {agency.verified ? 'Agence vérifiée' : 'Agence'}</span>
                <span className="flex items-center gap-1 text-sm text-white/80"><Building2 className="w-4 h-4" /> {agency.properties_count || allProperties.length} biens publiés</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {agency.description && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">À propos</h2>
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: agency.description }} />
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Biens publiés ({allProperties.length})</h2>
              {allProperties.length === 0 ? (
                <p className="text-slate-400">Aucun bien publié pour le moment.</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {paginated.map((p) => <PropertyCard key={p.id} property={p} />)}
                  </div>
                  <SimplePagination page={page} total={allProperties.length} perPage={PER_PAGE} onPageChange={setPage} />
                </>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Contact</h3>
              <div className="space-y-3">
                {agency.phone_call && (
                  <a href={`tel:+225${agency.phone_call}`} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 hover:text-orange-500 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                    <Phone className="w-5 h-5 text-orange-500" />
                    <div><div className="font-semibold text-slate-900 dark:text-white text-sm">Appeler</div><div className="text-xs">{agency.phone_call}</div></div>
                  </a>
                )}
                {agency.phone_whatsapp && (
                  <a href={`https://wa.me/225${agency.phone_whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 hover:text-green-500 p-3 rounded-xl bg-green-50 dark:bg-green-500/10">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    <div><div className="font-semibold text-slate-900 dark:text-white text-sm">WhatsApp</div><div className="text-xs">{agency.phone_whatsapp}</div></div>
                  </a>
                )}
                <a href={`mailto:${agency.email}`} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 hover:text-orange-500 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <div><div className="font-semibold text-slate-900 dark:text-white text-sm">Email</div><div className="text-xs break-all">{agency.email}</div></div>
                </a>
              </div>
            </div>

            {agency.verified && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1"><CheckCircle2 className="w-5 h-5" /><span className="font-bold">Agence vérifiée</span></div>
                <p className="text-sm text-white/80">Cette agence a été vérifiée par nos équipes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default AgencyDetailPage;
