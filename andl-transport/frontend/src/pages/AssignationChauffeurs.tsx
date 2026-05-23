import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Clock, Bus, AlertCircle, Save, CheckCircle } from 'lucide-react';
import api from '../services/api';

const AssignationChauffeurs: React.FC = () => {
  const [trajets, setTrajets] = useState<any[]>([]);
  const [chauffeurs, setChauffeurs] = useState<any[]>([]);
  const [bus, setBus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<number | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<{ [trajetId: number]: { chauffeurId: string; busId: string } }>({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [t, c, b] = await Promise.all([
          api.get('/transport/trajets'),
          api.get('/transport/chauffeurs'),
          api.get('/transport/bus'),
        ]);
        setTrajets(t.data || []);
        setChauffeurs(c.data || []);
        setBus(b.data || []);
        // Pre-fill existing assignments
        const init: any = {};
        (t.data || []).forEach((tr: any) => {
          init[tr.id] = { chauffeurId: tr.chauffeurId?.toString() || '', busId: tr.busId?.toString() || '' };
        });
        setAssignments(init);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleAssign = async (trajetId: number) => {
    const assignment = assignments[trajetId];
    if (!assignment?.chauffeurId || !assignment?.busId) {
      alert('Sélectionnez un chauffeur et un bus');
      return;
    }
    setSaving(trajetId);
    try {
      await api.put(`/transport/trajets/${trajetId}/assigner`, {
        chauffeurId: Number(assignment.chauffeurId),
        busId: Number(assignment.busId),
      });
      setSaved(trajetId);
      setTimeout(() => setSaved(null), 2500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur assignation');
    } finally {
      setSaving(null);
    }
  };

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

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Assignation des Chauffeurs</h1>
        <p className="text-slate-500 mt-1">Assignez un chauffeur et un bus à chaque rchla</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
          <UserCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-slate-800">Liste des rchlas</h2>
          <span className="ml-auto bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">{trajets.length} rchlas</span>
        </div>

        <div className="divide-y divide-slate-50">
          {trajets.length === 0 ? (
            <p className="text-center text-slate-400 py-12">Aucune rchla trouvée</p>
          ) : trajets.map((trajet: any, i: number) => (
            <motion.div
              key={trajet.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-6 flex flex-col md:flex-row md:items-center gap-4"
            >
              {/* Trajet info */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{trajet.heureDepart} → {trajet.heureArrivee}</p>
                  <p className="text-xs text-slate-500">{trajet.ligneNom || `Ligne #${trajet.ligneId}`} · {trajet.joursSemaine}</p>
                </div>
              </div>

              {/* Chauffeur select */}
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Chauffeur</label>
                <select
                  value={assignments[trajet.id]?.chauffeurId || ''}
                  onChange={e => setAssignments(prev => ({ ...prev, [trajet.id]: { ...prev[trajet.id], chauffeurId: e.target.value } }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50"
                >
                  <option value="">— Sélectionner chauffeur —</option>
                  {chauffeurs.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.prenom} {c.nom} · {c.numeroPermis}</option>
                  ))}
                </select>
              </div>

              {/* Bus select */}
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Bus</label>
                <select
                  value={assignments[trajet.id]?.busId || ''}
                  onChange={e => setAssignments(prev => ({ ...prev, [trajet.id]: { ...prev[trajet.id], busId: e.target.value } }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50"
                >
                  <option value="">— Sélectionner bus —</option>
                  {bus.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.immatriculation} · {b.capacite} places</option>
                  ))}
                </select>
              </div>

              {/* Save button */}
              <button
                onClick={() => handleAssign(trajet.id)}
                disabled={saving === trajet.id}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  saved === trajet.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {saved === trajet.id ? (
                  <><CheckCircle className="w-4 h-4" /> Sauvegardé</>
                ) : saving === trajet.id ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> En cours...</>
                ) : (
                  <><Save className="w-4 h-4" /> Assigner</>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignationChauffeurs;