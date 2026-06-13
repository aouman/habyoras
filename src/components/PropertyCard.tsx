import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, BedDouble, Bath, Maximize, Star } from 'lucide-react';
import type { Property } from '@/services/types';
import { formatPrice } from '@/lib/utils';

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  const [fav, setFav] = useState(false);

  return (
    <Link to={`/bien/${property.id}`} className="group block">
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={property.images?.[0] || '/placeholder.svg'} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${property.transaction === 'Location' ? 'bg-blue-600' : 'bg-orange-500'}`}>
              {property.transaction}
            </span>
            {property.furnished && <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-slate-900/70">Meublé</span>}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); setFav(!fav); }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/80 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart className={`w-5 h-5 ${fav ? 'fill-orange-500 text-orange-500' : 'text-slate-600 dark:text-slate-300'}`} />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">{property.title}</h3>
            <span className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300 shrink-0">
              <Star className="w-4 h-4 fill-orange-400 text-orange-400" /> {property.rating}
            </span>
          </div>
          <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-3">
            <MapPin className="w-4 h-4" /> {property.commune}, {property.city}
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
            {property.bedrooms > 0 && <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" /> {property.bedrooms}</span>}
            {property.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms}</span>}
            <span className="flex items-center gap-1"><Maximize className="w-4 h-4" /> {property.surface}m²</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
            <span className="text-lg font-extrabold text-orange-500">{formatPrice(property.price, property.transaction)}</span>
            <span className="text-xs text-slate-400">{property.agency?.name || '—'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
