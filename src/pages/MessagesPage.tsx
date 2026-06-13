import React, { useState, useEffect } from 'react';
import { Search, Phone } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { getMyMessages, markMessageRead } from '@/services/messages';
import type { Message } from '@/services/types';

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getMyMessages(1).then((res) => {
      setMessages(res.data);
      if (res.data.length > 0) setActiveId(res.data[0].id);
    }).catch(() => {});
  }, []);

  const filtered = messages.filter((m) =>
    (m.name || '').toLowerCase().includes(query.toLowerCase())
  );

  const active = messages.find((m) => m.id === activeId);

  const selectConv = async (id: number) => {
    setActiveId(id);
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.read) {
      try {
        await markMessageRead(id);
        setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
      } catch {}
    }
  };

  return (
    <DashboardLayout title="Messages" subtitle="Échangez avec vos prospects">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-180px)]">
        <div className="border-r border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher..." className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none" />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.map((m) => (
              <button key={m.id} onClick={() => selectConv(m.id)} className={`w-full text-left flex items-center gap-3 p-4 border-b border-slate-50 dark:border-slate-800/50 ${activeId === m.id ? 'bg-orange-50 dark:bg-orange-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                    {(m.name || 'A').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">{m.name || 'Anonyme'}</span>
                    <span className="text-xs text-slate-400">{new Date(m.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{m.message}</p>
                </div>
                {!m.read && <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
              </button>
            ))}
            {filtered.length === 0 && <p className="text-center text-slate-400 py-8 text-sm">Aucun message.</p>}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col">
          {active ? (
            <>
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                    {(active.name || 'A').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{active.name || 'Anonyme'}</div>
                    <div className="text-xs text-slate-400">{active.property?.title ? `Au sujet de : ${active.property.title}` : ''}</div>
                  </div>
                </div>
                {(active.phone || active.email) && (
                  <div className="flex gap-2">
                    {active.phone && <a href={`tel:${active.phone}`} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><Phone className="w-5 h-5" /></a>}
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50 dark:bg-slate-950/50">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm border border-slate-100 dark:border-slate-700 text-sm">
                  <p>{active.message}</p>
                  {(active.email || active.phone) && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400 space-y-0.5">
                      {active.email && <div>Email : {active.email}</div>}
                      {active.phone && <div>Tél : {active.phone}</div>}
                    </div>
                  )}
                  <span className="block text-[10px] mt-1 text-slate-400">{new Date(active.created_at).toLocaleString('fr-FR')}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">Sélectionnez un message</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
