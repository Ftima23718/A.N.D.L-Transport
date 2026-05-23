import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Route, Bus, Users, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../services/api';

const ResponsableDashboard: React.FC = () => {
  const [lignes, setLignes] = useState<any[]>([]);
  const [trajets, setTrajets] = useState<any[]>([]);
  const [chauffeurs, setChauffeurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lignesRes, trajetsRes, chauffeursRes] = await Promise.all([
          api.get('/transport/lignes'),
          api.get('/transport/trajets'),
          api.get('/transport/chauffeurs'),
        ]);
        setLignes(lignesRes.data || []);
        setTrajets(trajetsRes.data || []);
        setChauffeurs(chauffeursRes.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur chargement données');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex gap-3">
      <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5" />
      <p className="text-rose-700">{error}</p>
    </div>
  );

  const stats = [
    { label: 'Lignes actives', value: lignes.length, icon: Route, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Rchlas programmées', value: trajets.length, icon: Clock, color: 'bg-blue-50 text-blue-600' },
    { label: 'Chauffeurs', value: chauffeurs.length, icon: Users, color: 'bg-amber-50 text-amber-600' },
    { label: 'Bus en service', value: trajets.filter((t: any) => t.busId).length, icon: Bus, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Tableau de bord — Responsable Transport</h1>
        <p className="text-slate-500 mt-1">Vue d'ensemble des lignes, horaires et chauffeurs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Lignes table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-800">Aperçu des lignes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Ligne</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nb Rchlas</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {lignes.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">Aucune ligne trouvée</td></tr>
              ) : lignes.map((ligne: any) => {
                const nbTrajets = trajets.filter((t: any) => t.ligneId === ligne.id || t.ligneNom === ligne.nom).length;
                return (
                  <tr key={ligne.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm">
                        {ligne.nom}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{ligne.description || '—'}</td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">{nbTrajets}</td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResponsableDashboard;