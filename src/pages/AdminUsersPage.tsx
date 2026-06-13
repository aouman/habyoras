import React, { useState } from 'react';
import { Search, Shield, User, CheckCircle2, XCircle, Mail, Calendar } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import SimplePagination from '@/components/SimplePagination';

const PER_PAGE = 6;

const fakeUsers = Array.from({ length: 24 }, (_, i) => ({
  id: `u${i + 1}`,
  name: ['Kouassi Jean', 'Diallo Aminata', 'Touré Moussa', 'Koné Fatou', 'Bamba Souleymane', 'Cissé Mariam', 'Yao David', 'Gbagbo Esther', 'N\'Guessan Franck', 'Soro Awa', 'Traoré Adama', 'Koffi Rachel', 'Zadi Olivier', 'Akissi Béatrice', 'Konaté Yacouba', 'Fofana Kadiatou'][i % 16],
  email: `user${i + 1}@email.ci`,
  role: i < 3 ? 'admin' : i < 8 ? 'agence' : 'utilisateur',
  joined: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  active: i !== 5 && i !== 12,
}));

const roleLabels: Record<string, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'bg-purple-100 dark:bg-purple-500/10 text-purple-600' },
  agence: { label: 'Agence', color: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600' },
  utilisateur: { label: 'Utilisateur', color: 'bg-slate-100 dark:bg-slate-500/10 text-slate-600' },
};

const AdminUsersPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'admin' | 'agence' | 'utilisateur'>('all');
  const [page, setPage] = useState(1);

  const filtered = fakeUsers.filter((u) => {
    const match = u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
    if (filter === 'all') return match;
    return match && u.role === filter;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const changePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminLayout title="Utilisateurs" subtitle={`${fakeUsers.length} utilisateurs inscrits`}>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Rechercher un utilisateur..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          {([{ label: 'Tous', value: 'all' }, { label: 'Admins', value: 'admin' }, { label: 'Agences', value: 'agence' }, { label: 'Utilisateurs', value: 'utilisateur' }] as const).map((f) => (
            <button key={f.value} onClick={() => { setFilter(f.value); setPage(1); }} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${filter === f.value ? 'bg-orange-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <th className="p-4 font-medium">Utilisateur</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Rôle</th>
                <th className="p-4 font-medium">Inscrit le</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((u) => {
                const role = roleLabels[u.role];
                return (
                  <tr key={u.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                          {u.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Mail className="w-3.5 h-3.5" /> {u.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${role.color}`}>
                        {u.role === 'admin' && <Shield className="w-3 h-3 inline mr-1" />}
                        {u.role === 'agence' && <User className="w-3 h-3 inline mr-1" />}
                        {role.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(u.joined).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="p-4">
                      {u.active ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Actif</span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 text-xs font-medium"><XCircle className="w-3.5 h-3.5" /> Banni</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Éditer</button>
                        <button className={`px-3 py-1.5 rounded-lg text-xs font-medium text-white ${u.active ? 'bg-red-500' : 'bg-green-500'}`}>{u.active ? 'Bannir' : 'Réactiver'}</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-slate-400 py-12">Aucun utilisateur trouvé.</p>}
      </div>

      <SimplePagination page={page} total={filtered.length} perPage={PER_PAGE} onPageChange={changePage} />
    </AdminLayout>
  );
};

export default AdminUsersPage;
