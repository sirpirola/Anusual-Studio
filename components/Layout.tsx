
import React from 'react';
import { User, UserRole, Client } from '../types';

interface LayoutProps {
  user: User;
  clients: Client[];
  activeClient: Client | null;
  onClientSwitch: (clientId: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  user, 
  clients, 
  activeClient, 
  onClientSwitch, 
  onLogout, 
  children,
  activeTab,
  setActiveTab
}) => {
  const logoUrl = "https://static.wixstatic.com/media/6bebeb_af6ef406ff5b41b1b66210a58fb32782~mv2.png/v1/fill/w_443,h_86,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo%20anusual%20header%20sito%20vert%20bianco.png";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#171717] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-80 border-r border-white/5 flex flex-col p-8 space-y-12 z-20 bg-[#121212]">
        <div className="flex flex-col items-start px-2">
          <img 
            src={logoUrl} 
            alt="Anusual Studio" 
            className="h-9 w-auto object-contain mb-4 cursor-pointer"
            onClick={() => onClientSwitch('global')}
          />
          <div className="h-[1px] w-full bg-white/10 mb-4"></div>
          <p className="text-[10px] text-white/30 font-light uppercase tracking-[0.4em]">Agency Management</p>
        </div>

        {/* Client Switcher (Agency Only) */}
        {user.role === UserRole.AGENCY && (
          <div className="space-y-3 px-2">
            <label className="text-[9px] font-bold uppercase tracking-widest text-mint">Seleziona Account</label>
            <div className="relative">
              <select 
                value={activeClient?.id || 'global'}
                onChange={(e) => onClientSwitch(e.target.value)}
                className="w-full p-4 bg-white/5 border border-white/5 rounded-lg text-sm font-light text-white outline-none appearance-none cursor-pointer focus:border-mint/50 transition-all"
              >
                <option value="global" className="bg-[#171717]">TUTTI I PARTNER</option>
                {clients.map(c => <option key={c.id} value={c.id} className="bg-[#171717]">{c.name}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-[10px]">▼</div>
            </div>
          </div>
        )}

        {user.role === UserRole.CLIENT && activeClient && (
          <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-mint/10">
            <img src={activeClient.logo} className="w-10 h-10 rounded-lg object-cover" alt={activeClient.name} />
            <div className="overflow-hidden">
              <span className="font-bold text-xs uppercase tracking-tight block truncate">{activeClient.name}</span>
              <span className="text-[9px] text-mint font-light uppercase tracking-widest">Brand Partner</span>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'calendar', label: 'Calendario', clientOnly: true },
            { id: 'todos', label: 'To-do List', clientOnly: true },
            { id: 'performance', label: activeClient ? 'Report' : 'Management Agency' }
          ].map((item) => {
            // Se è un item solo per i clienti o per un brand specifico, e siamo in visualizzazione globale, non lo nascondiamo ma lo rendiamo inattivo o diverso
            const isDisabled = item.clientOnly && !activeClient;
            return (
              <button 
                key={item.id}
                onClick={() => !isDisabled && setActiveTab(item.id)}
                className={`w-full text-left px-5 py-3.5 rounded-lg transition-all text-[11px] uppercase tracking-[0.15em] ${activeTab === item.id ? 'bg-mint text-[#171717] font-bold' : isDisabled ? 'text-white/5 cursor-not-allowed' : 'text-white/40 hover:text-white hover:bg-white/5 font-light'}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-white/5 px-2">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-[#00FF97] border border-white/10">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold truncate text-white uppercase tracking-wider">{user.name}</p>
              <p className="text-[9px] text-white/20 uppercase tracking-widest font-light">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="text-[9px] text-white/20 hover:text-red-400 transition font-bold uppercase tracking-widest"
          >
            Esci
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-14 overflow-auto bg-[#171717]">
         <div className="max-w-6xl mx-auto">
            {children}
         </div>
      </main>
    </div>
  );
};
