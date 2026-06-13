import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/services/api';

interface BannerData {
  id: number;
  title: string;
  image_url: string;
  link_url: string | null;
  active: boolean;
}

interface BannerAdProps {
  position: 'home_horizontal' | 'home_compact' | 'sidebar_vertical' | 'sidebar_compact' | 'detail_sidebar';
}

const BannerAd: React.FC<BannerAdProps> = ({ position }) => {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    api.get('banners', { params: { position } })
      .then(({ data }) => setBanners(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [position]);

  const isCompact = position === 'home_compact' || position === 'sidebar_compact' || position === 'detail_sidebar';
  const isVertical = position === 'sidebar_vertical';
  const slideInterval = 5000;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    if (paused) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(next, slideInterval);
    return () => clearInterval(timerRef.current);
  }, [banners.length, paused, next]);

  if (banners.length === 0) return null;

  const b = banners[current];

  const navDots = banners.length > 1 && (
    <div className="flex justify-center gap-1.5 mt-2">
      {banners.map((_, i) => (
        <button key={i} onClick={() => setCurrent(i)}
          className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-orange-500 w-5' : 'bg-slate-300 dark:bg-slate-600'}`}
        />
      ))}
    </div>
  );

  const navArrows = banners.length > 1 && (
    <>
      <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow z-10"><ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-200" /></button>
      <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow z-10"><ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-200" /></button>
    </>
  );

  if (isCompact) {
    return (
      <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {banners.map((banner, i) => (
          <a key={banner.id} href={banner.link_url || '#'} target="_blank" rel="noopener noreferrer"
            className={`relative block overflow-hidden rounded-lg aspect-[3/1] group ${i === current ? 'block' : 'hidden'}`}>
            <img src={banner.image_url} alt={banner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg" />
            <div className="absolute inset-0 flex items-end p-3">
              <div className="text-white font-bold text-sm drop-shadow-lg">{banner.title}</div>
            </div>
            {navArrows}
          </a>
        ))}
        {navDots}
      </div>
    );
  }

  if (isVertical) {
    return (
      <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {banners.map((banner, i) => (
          <a key={banner.id} href={banner.link_url || '#'} target="_blank" rel="noopener noreferrer"
            className={`block rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all group relative ${i === current ? 'block' : 'hidden'}`}>
            <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-white font-bold text-sm drop-shadow-lg">{banner.title}</div>
              </div>
            </div>
            {navArrows}
          </a>
        ))}
        {navDots}
      </div>
    );
  }

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {banners.map((banner, i) => (
        <a key={banner.id} href={banner.link_url || '#'} target="_blank" rel="noopener noreferrer"
          className={`block rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all group relative ${i === current ? 'block' : 'hidden'}`}>
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 min-h-[90px]">
            <img src={banner.image_url} alt={banner.title} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500" />
            <div className="relative z-10 flex items-center justify-between w-full px-6 py-5">
              <div className="text-white font-bold text-base">{banner.title}</div>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold group-hover:bg-white/30 transition-colors">
                Voir <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          {navArrows}
        </a>
      ))}
      {navDots}
    </div>
  );
};

export default BannerAd;
