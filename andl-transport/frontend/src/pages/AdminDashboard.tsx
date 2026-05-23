import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Bus, Clock, TrendingUp, TrendingDown, Check, X, Calendar, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../services/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, inscRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/inscriptions?size=5')
        ]);
        setStats(statsRes.data);
        setInscriptions(inscRes.data.content || []);
      } catch (err) {
        console.error('Erreur chargement dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const trendsData = Object.entries(stats?.inscriptionsParMois || { Jan: 0, Feb: 0, Mar: 0 }).map(([name, value]) => ({ name, value }));

  const revenueData = Object.entries(stats?.revenusParMois || { Jan: 0, Feb: 0, Mar: 0 }).map(([name, value]) => ({ name, value }));

  const statCards = [
    { label: 'Total Étudiants', value: stats?.totalEtudiants || 0, icon: Users, color: 'blue', trend: '+12%', sub: 'Nouveaux ce mois' },
    { label: 'Abonnements Actifs', value: stats?.inscriptionsValidees || 0, icon: Bus, color: 'emerald', trend: '+5%', sub: 'En circulation' },
    { label: 'Revenus Totaux', value: `${(stats?.totalMontantEncaisse || 0).toLocaleString()} DH`, icon: Wallet, color: 'orange', trend: '+18%', sub: 'Collectés' },
    { label: 'Demandes en Attente', value: stats?.inscriptionsEnAttente || 0, icon: Clock, color: 'rose', trend: '-2%', sub: 'À traiter' },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-medium">Préparation de vos statistiques...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Focus Dashboard</h1>
        <p className="text-slate-500 mt-1 font-medium">Analyse en temps réel de l'activité A.N.D.L Transport</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150`} />
            <div className="flex items-start justify-between relative z-10">
              <div className={`p-4 rounded-2xl bg-slate-50 text-${stat.color}-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.trend.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
              <p className="text-3xl font-black text-slate-800 mt-1">{stat.value}</p>
              <p className="text-[10px] text-slate-400 mt-2 font-semibold italic">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Évolution des Inscriptions</h2>
              <p className="text-sm text-slate-400 font-medium">Tendances des 12 derniers mois</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <Calendar className="w-4 h-4" />
                Année 2024
              </span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendsData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '15px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-800">Revenus mensuels</h2>
            <p className="text-sm text-slate-400 font-medium">Analyse des encaissements</p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 10}}
                  contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#f59e0b" radius={[10, 10, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 bg-amber-50 p-4 rounded-2xl border border-amber-100">
             <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 uppercase">Croissance mensuelle</span>
                <span className="text-lg font-black text-amber-800">+14.2%</span>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Dernières Inscriptions</h2>
              <p className="text-sm text-slate-400 font-medium">Demandes récentes à traiter</p>
            </div>
            <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-100">Voir tout</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Identité Étudiant</th>
                  <th className="px-8 py-5">Abonnement</th>
                  <th className="px-8 py-5">Date & Heure</th>
                  <th className="px-8 py-5">Statut</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inscriptions.map((insc) => (
                  <tr key={insc.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 font-black text-sm shadow-sm transition-transform group-hover:scale-110">
                          {insc.etudiantPrenom?.[0] || '?'}{insc.etudiantNom?.[0] || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-700">{insc.etudiantPrenom} {insc.etudiantNom}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID #{insc.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                         <span className="text-sm text-slate-600 font-bold">{insc.typeAbonnement}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-xs text-slate-500 font-bold">{new Date(insc.dateCreation || Date.now()).toLocaleDateString()}</p>
                       <p className="text-[10px] text-slate-400 font-medium">{new Date(insc.dateCreation || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-2 ${
                        insc.statut === 'VALIDEE' ? 'bg-emerald-100 text-emerald-700' :
                        insc.statut === 'EN_ATTENTE' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {insc.statut === 'VALIDEE' ? <Check className="w-3 h-3" /> : (insc.statut === 'REJETEE' ? <X className="w-3 h-3" /> : <Clock className="w-3 h-3" />)}
                        {insc.statut}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                          <Check className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
