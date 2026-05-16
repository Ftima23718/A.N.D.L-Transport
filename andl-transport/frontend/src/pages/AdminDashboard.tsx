import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Bus, CreditCard, Clock, TrendingUp, TrendingDown, MoreVertical, Check, X } from 'lucide-react';
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

  const statCards = [
    { label: 'Total Étudiants', value: stats?.totalEtudiants || 0, icon: Users, color: 'blue', trend: '+12%' },
    { label: 'Inscriptions Validées', value: stats?.inscriptionsValidees || 0, icon: Bus, color: 'emerald', trend: '+5%' },
    { label: 'Revenus (DH)', value: stats?.totalMontantEncaisse?.toLocaleString() || 0, icon: CreditCard, color: 'amber', trend: '+18%' },
    { label: 'En Attente', value: stats?.inscriptionsEnAttente || 0, icon: Clock, color: 'rose', trend: '-2%' },
  ];

  if (loading) return <div className="flex items-center justify-center h-96"><p>Chargement du tableau de bord...</p></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">Bienvenue sur le système de gestion A.N.D.L Transport</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inscriptions */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-lg">Inscriptions Récentes</h2>
            <button className="text-blue-600 text-sm font-semibold hover:underline">Voir tout</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Étudiant</th>
                  <th className="px-6 py-4">Abonnement</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inscriptions.map((insc) => (
                  <tr key={insc.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                          {insc.etudiantPrenom[0]}{insc.etudiantNom[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{insc.etudiantPrenom} {insc.etudiantNom}</p>
                          <p className="text-xs text-slate-400">ID: #{insc.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-medium">{insc.typeAbonnement}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        insc.statut === 'VALIDEE' ? 'bg-emerald-50 text-emerald-600' :
                        insc.statut === 'EN_ATTENTE' ? 'bg-amber-50 text-amber-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {insc.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"><Check className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-slate-50 text-slate-400 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-3xl text-white shadow-lg shadow-blue-200">
            <h3 className="font-bold text-xl mb-2 text-white">Gestion Transport</h3>
            <p className="text-blue-100 text-sm mb-6">Optimisez les trajets et validez les nouvelles inscriptions d'un clic.</p>
            <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl shadow-md hover:bg-blue-50 transition-colors">
              Ajouter un Bus
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Établissements Actifs</h3>
            <div className="space-y-4">
              {['Lycée Technique', 'Faculté des Sciences', 'EST Oujda'].map((school) => (
                <div key={school} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-slate-600">{school}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
