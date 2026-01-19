
import React, { useState } from 'react';
import { Platform, Post, Client } from '../types';

interface PostCreatorProps {
  clients: Client[];
  initialClientId?: string;
  onSave: (post: Omit<Post, 'id'>) => void;
  onClose: () => void;
}

export const PostCreator: React.FC<PostCreatorProps> = ({ clients, initialClientId, onSave, onClose }) => {
  const [clientId, setClientId] = useState(initialClientId || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const togglePlatform = (p: Platform) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !title || !content || !date || platforms.length === 0) return;
    
    onSave({
      clientId,
      title,
      content,
      scheduledDate: new Date(date).toISOString(),
      platforms,
      status: 'scheduled',
      mediaUrl: `https://picsum.photos/seed/${Math.random()}/800/400`
    });
  };

  return (
    <div className="fixed inset-0 bg-[#171717]/95 backdrop-blur-2xl flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#121212] rounded-[50px] border border-white/10 w-full max-w-3xl overflow-hidden shadow-2xl relative">
        <div className="px-12 py-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <p className="text-mint font-black text-[9px] uppercase tracking-[0.4em] mb-1">Editor</p>
            <h2 className="text-3xl font-black tracking-tighter uppercase text-white">Nuova Programmazione</h2>
          </div>
          <button onClick={onClose} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition text-white">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Partner Selezionato</label>
              <select 
                value={clientId} 
                onChange={(e) => setClientId(e.target.value)}
                className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-mint transition appearance-none"
                required
                disabled={!!initialClientId}
              >
                <option value="" className="bg-[#171717]">Scegli Partner...</option>
                {clients.map(c => <option key={c.id} value={c.id} className="bg-[#171717]">{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Data & Ora Pubblicazione</label>
              <input 
                type="datetime-local" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-mint transition inv-scheme"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Nome Campagna</label>
            <input 
              type="text" 
              placeholder="Inserisci un titolo evocativo..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-mint transition"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Copy & Storytelling</label>
            <textarea 
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-mint transition resize-none"
              placeholder="Inserisci il testo della pubblicazione..."
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Multichannel Distribution</label>
            <div className="flex flex-wrap gap-4">
              {(['facebook', 'instagram', 'linkedin', 'tiktok'] as Platform[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-8 py-3 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${platforms.includes(p) ? 'bg-mint text-[#171717] border-mint shadow-[0_0_20px_rgba(0,255,151,0.2)]' : 'bg-transparent text-white/20 border-white/5 hover:border-white/10'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-8 space-x-6 border-t border-white/5">
            <button type="button" onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition">Annulla</button>
            <button type="submit" className="px-12 py-5 btn-mint rounded-2xl text-[11px] uppercase tracking-widest shadow-xl">Conferma & Sincronizza</button>
          </div>
        </form>
      </div>
    </div>
  );
};
