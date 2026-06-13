import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Home, Trees, Briefcase, Building2 } from 'lucide-react';

const cats = [
  { name: 'Appartements', type: 'Appartement', icon: Building, color: 'from-blue-500 to-blue-600' },
  { name: 'Villas', type: 'Villa', icon: Home, color: 'from-orange-500 to-orange-600' },
  { name: 'Terrains', type: 'Terrain', icon: Trees, color: 'from-green-500 to-green-600' },
  { name: 'Bureaux', type: 'Bureau', icon: Briefcase, color: 'from-purple-500 to-purple-600' },
  { name: 'Immeubles', type: 'Immeuble', icon: Building2, color: 'from-slate-600 to-slate-800' },
];

const Categories: React.FC = () => {
  const nav = useNavigate();
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Explorez par catégorie</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Trouvez le type de bien qui vous correspond</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cats.map((c) => {
          const Icon = c.icon;
          return (
            <button key={c.type} onClick={() => nav(`/biens?type=${c.type}`)} className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center">
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{c.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
