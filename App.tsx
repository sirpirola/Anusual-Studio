
import React, { useState, useMemo } from 'react';
import { User, UserRole, Post, Client, Todo } from './types';
import { mockAgencyUser, mockClientUser, mockClients, mockPosts } from './services/mockData';
import { Layout } from './components/Layout';
import { PostCreator } from './components/PostCreator';

interface AgencyMember {
  name: string;
  role: string;
  email: string;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [agencyMembers, setAgencyMembers] = useState<AgencyMember[]>([
    { name: 'Andrea Boss', role: 'Creative Director', email: 'a.boss@anusual.com' },
    { name: 'Elena Social', role: 'Account Manager', email: 'e.social@anusual.com' },
    { name: 'Marco Dev', role: 'Technical Lead', email: 'm.dev@anusual.com' }
  ]);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Modal states
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '', email: '' });
  const [newClient, setNewClient] = useState({ name: '', industry: '' });

  const [todos, setTodos] = useState<Todo[]>([
    { id: 't1', clientId: '1', task: 'Approvare set grafiche Gennaio', completed: false, assignedTo: UserRole.CLIENT },
    { id: 't2', clientId: '1', task: 'Configurazione API Facebook Business', completed: true, assignedTo: UserRole.AGENCY },
    { id: 't3', clientId: '2', task: 'Revisione copy TikTok promo', completed: false, assignedTo: UserRole.AGENCY },
  ]);
  const [showCreator, setShowCreator] = useState(false);

  const activeClient = useMemo(() => {
    if (currentUser?.role === UserRole.CLIENT) {
        return clients.find(c => c.id === currentUser.clientId) || null;
    }
    return clients.find(c => c.id === activeClientId) || null;
  }, [currentUser, activeClientId, clients]);

  const filteredPosts = useMemo(() => 
    activeClient ? posts.filter(p => p.clientId === activeClient.id) : posts
  , [posts, activeClient]);

  const filteredTodos = useMemo(() => 
    activeClient ? todos.filter(t => t.clientId === activeClient.id) : todos
  , [todos, activeClient]);

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    setActiveClientId(null);
    setEmail('');
    setPassword('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);

    if (email.toLowerCase().includes('anusual.com')) {
      setCurrentUser(mockAgencyUser);
      setActiveClientId(null);
    } else if (email.length > 3) {
      setCurrentUser(mockClientUser);
      if (mockClientUser.clientId) setActiveClientId(mockClientUser.clientId);
    } else {
      setLoginError(true);
    }
  };

  const handleSavePost = (newPost: Omit<Post, 'id'>) => {
    const post: Post = { ...newPost, id: Math.random().toString(36).substr(2, 9) };
    setPosts(prev => [post, ...prev]);
    setShowCreator(false);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;
    setAgencyMembers(prev => [...prev, newMember]);
    setNewMember({ name: '', role: '', email: '' });
    setShowMemberModal(false);
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;
    const client: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: newClient.name,
      industry: newClient.industry || 'General',
      logo: `https://picsum.photos/seed/${newClient.name}/100/100`,
      activePosts: 0,
      platforms: ['instagram', 'facebook']
    };
    setClients(prev => [...prev, client]);
    setNewClient({ name: '', industry: '' });
    setShowClientModal(false);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#171717] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-mint/5 blur-[120px] rounded-full"></div>
        <div className="max-w-sm w-full glass-dark p-12 rounded-2xl text-center space-y-10 relative z-10 border border-white/5">
          <img 
            src="https://static.wixstatic.com/media/6bebeb_af6ef406ff5b41b1b66210a58fb32782~mv2.png/v1/fill/w_443,h_86,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo%20anusual%20header%20sito%20vert%20bianco.png" 
            alt="Anusual Studio" 
            className="w-40 mx-auto"
          />
          <div className="space-y-1">
            <h1 className="text-xl font-light tracking-[0.2em] uppercase text-white">Anusual Studio</h1>
            <p className="text-white/30 text-[9px] font-bold tracking-[0.3em] uppercase">Management Portal</p>
          </div>
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@azienda.it" className="w-full p-4 bg-white/5 border border-white/5 rounded-lg text-xs font-light text-white focus:border-mint/50 outline-none transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full p-4 bg-white/5 border border-white/5 rounded-lg text-xs font-light text-white focus:border-mint/50 outline-none transition-all" required />
            </div>
            {loginError && <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest text-center">Credenziali non valide</p>}
            <button type="submit" className="w-full py-4 btn-mint rounded-lg text-[10px] uppercase tracking-[0.2em] mt-4">Entra</button>
          </form>
          <p className="text-[8px] font-light text-white/10 uppercase tracking-widest">© ANUSUAL SRL</p>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      user={currentUser} 
      clients={clients}
      activeClient={activeClient}
      onClientSwitch={(id) => setActiveClientId(id === 'global' ? null : id)}
      onLogout={handleLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === 'dashboard' && (
        <div className="space-y-14 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-12">
            <div className="space-y-1">
              <p className="text-mint font-bold text-[9px] uppercase tracking-[0.4em] mb-2">{activeClient ? 'Account Overview' : 'Agency Control'}</p>
              <h2 className="text-5xl font-light tracking-tight uppercase">{activeClient ? activeClient.name : 'Global Dashboard'}</h2>
            </div>
            {activeClient && (
              <button onClick={() => setShowCreator(true)} className="px-10 py-4 btn-mint rounded-lg text-[10px] uppercase tracking-widest">Nuovo Post</button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/5 p-8 rounded-xl">
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-6">{activeClient ? 'Contenuti Mese' : 'Post Totali Agenzia'}</p>
              <p className="text-5xl font-light tracking-tighter text-mint">{filteredPosts.length}</p>
            </div>
            <div className="bg-white/5 border border-white/5 p-8 rounded-xl">
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-6">{activeClient ? 'Channels' : 'Brand Attivi'}</p>
              {activeClient ? (
                <div className="flex flex-wrap gap-2">
                  {activeClient.platforms.map(p => (
                    <span key={p} className="text-[8px] font-bold bg-white/5 text-white/60 px-3 py-1.5 rounded border border-white/5 uppercase tracking-widest">{p}</span>
                  ))}
                </div>
              ) : (
                <p className="text-5xl font-light tracking-tighter text-white">{clients.length}</p>
              )}
            </div>
            <div className="bg-white/5 border border-white/5 p-8 rounded-xl">
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-6">Azioni Aperte</p>
              <p className="text-5xl font-light tracking-tighter text-white/20">{filteredTodos.filter(t => !t.completed).length}</p>
            </div>
          </div>

          {!activeClient && (
            <div className="space-y-8">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/50">Partner Portfolio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clients.map(client => (
                  <div key={client.id} onClick={() => setActiveClientId(client.id)} className="p-8 bg-white/5 rounded-xl border border-white/5 hover:border-mint/30 transition-all cursor-pointer flex justify-between items-center group">
                    <div className="flex items-center space-x-6">
                      <img src={client.logo} className="w-12 h-12 rounded-lg opacity-40 group-hover:opacity-100 transition-opacity" alt={client.name} />
                      <div>
                        <p className="text-sm font-light uppercase tracking-wider group-hover:text-mint">{client.name}</p>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{client.industry}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white/40">{client.activePosts} Post</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeClient && (
            <div className="glass-dark rounded-2xl p-10">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-white/50">Recenti & Prossimi</h3>
              <div className="space-y-6">
                {filteredPosts.slice(0, 4).map(post => (
                  <div key={post.id} className="flex items-center space-x-8 pb-6 border-b border-white/5 last:border-0 group">
                    <div className="w-20 h-20 rounded bg-white/5 overflow-hidden">
                      <img src={post.mediaUrl} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt={post.title} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-bold text-mint uppercase mb-1 tracking-widest">{new Date(post.scheduledDate).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}</p>
                      <h4 className="font-light text-2xl uppercase tracking-tight">{post.title}</h4>
                    </div>
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">{post.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'performance' && !activeClient && (
        <div className="space-y-12 animate-in fade-in duration-700">
           <div className="border-b border-white/5 pb-10">
              <p className="text-mint font-bold text-[9px] uppercase tracking-[0.4em] mb-2">Internal Management</p>
              <h2 className="text-5xl font-light tracking-tight uppercase">Team & Partners</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Membri Agency Staff</h3>
                  <button onClick={() => setShowMemberModal(true)} className="text-[9px] font-bold text-mint uppercase tracking-widest hover:underline">+ Aggiungi</button>
                </div>
                <div className="space-y-2">
                  {agencyMembers.map(member => (
                    <div key={member.email} className="p-6 bg-white/5 rounded-xl flex items-center justify-between border border-transparent hover:border-white/5 transition-all">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded bg-mint/10 flex items-center justify-center font-bold text-mint">{member.name[0]}</div>
                        <div>
                          <p className="text-xs uppercase font-light tracking-wider">{member.name}</p>
                          <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{member.role}</p>
                        </div>
                      </div>
                      <p className="text-[8px] font-bold text-white/10">{member.email}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Configurazione Brand</h3>
                    <button onClick={() => setShowClientModal(true)} className="text-[9px] font-bold text-mint uppercase tracking-widest hover:underline">+ Nuovo Brand</button>
                 </div>
                 <div className="glass-dark p-8 rounded-2xl border border-white/5 space-y-4">
                    <p className="text-[10px] font-light text-white/40 leading-relaxed uppercase tracking-widest">
                      In questa sezione puoi gestire i permessi API per ogni canale social dei tuoi partner e definire i livelli di accesso per gli utenti client.
                    </p>
                    <div className="pt-4 space-y-2">
                      <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase tracking-widest border-b border-white/5 pb-2">
                        <span>Servizio API</span>
                        <span>Stato</span>
                      </div>
                      <div className="flex justify-between text-[9px] py-1">
                        <span className="font-light text-white/60">Meta Graph API</span>
                        <span className="text-mint">Operational</span>
                      </div>
                      <div className="flex justify-between text-[9px] py-1">
                        <span className="font-light text-white/60">TikTok Business API</span>
                        <span className="text-mint">Operational</span>
                      </div>
                      <div className="flex justify-between text-[9px] py-1">
                        <span className="font-light text-white/60">LinkedIn Marketing API</span>
                        <span className="text-red-500/50">Re-auth required</span>
                      </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-[#171717]/95 backdrop-blur-xl flex items-center justify-center p-4 z-[100] animate-in fade-in">
          <div className="glass-dark border border-white/10 p-10 rounded-3xl w-full max-w-md space-y-8">
            <h3 className="text-xl font-light uppercase tracking-widest text-white">Nuovo Membro Team</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <input 
                placeholder="Nome Completo" 
                className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-xs text-white"
                value={newMember.name}
                onChange={e => setNewMember({...newMember, name: e.target.value})}
                required 
              />
              <input 
                placeholder="Ruolo (es. Social Media Manager)" 
                className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-xs text-white"
                value={newMember.role}
                onChange={e => setNewMember({...newMember, role: e.target.value})}
              />
              <input 
                placeholder="Email" 
                type="email"
                className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-xs text-white"
                value={newMember.email}
                onChange={e => setNewMember({...newMember, email: e.target.value})}
                required 
              />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowMemberModal(false)} className="flex-1 py-4 text-[9px] uppercase font-bold text-white/40">Annulla</button>
                <button type="submit" className="flex-1 py-4 btn-mint rounded-xl text-[9px] uppercase font-bold">Aggiungi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Modal */}
      {showClientModal && (
        <div className="fixed inset-0 bg-[#171717]/95 backdrop-blur-xl flex items-center justify-center p-4 z-[100] animate-in fade-in">
          <div className="glass-dark border border-white/10 p-10 rounded-3xl w-full max-w-md space-y-8">
            <h3 className="text-xl font-light uppercase tracking-widest text-white">Nuovo Partner Brand</h3>
            <form onSubmit={handleAddClient} className="space-y-4">
              <input 
                placeholder="Nome Brand" 
                className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-xs text-white"
                value={newClient.name}
                onChange={e => setNewClient({...newClient, name: e.target.value})}
                required 
              />
              <input 
                placeholder="Settore (es. Luxury, Food)" 
                className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-xs text-white"
                value={newClient.industry}
                onChange={e => setNewClient({...newClient, industry: e.target.value})}
              />
              <div className="p-4 bg-white/5 rounded-xl text-[9px] text-white/30 uppercase tracking-widest">
                Il logo verrà generato automaticamente
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowClientModal(false)} className="flex-1 py-4 text-[9px] uppercase font-bold text-white/40">Annulla</button>
                <button type="submit" className="flex-1 py-4 btn-mint rounded-xl text-[9px] uppercase font-bold">Crea Brand</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(activeTab === 'calendar' || activeTab === 'todos') && (
        <div className="text-center py-20 animate-in fade-in">
          {activeClient ? (
            <p className="text-white/20 uppercase text-[10px] tracking-widest">Sezione in caricamento per {activeClient.name}...</p>
          ) : (
            <div className="space-y-6">
              <p className="text-white/20 uppercase text-[10px] tracking-widest">Seleziona un Brand per vedere il Calendario o i Task specifici</p>
              <div className="flex justify-center gap-3">
                {clients.map(c => (
                  <button key={c.id} onClick={() => setActiveClientId(c.id)} className="px-6 py-3 bg-white/5 border border-white/5 rounded text-[9px] font-bold uppercase tracking-widest hover:border-mint transition-all">
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showCreator && (
        <PostCreator clients={clients} initialClientId={activeClient?.id} onSave={handleSavePost} onClose={() => setShowCreator(false)} />
      )}
    </Layout>
  );
};

export default App;
