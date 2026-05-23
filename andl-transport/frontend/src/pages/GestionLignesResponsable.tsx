import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Route, Plus, Clock, MapPin, ChevronDown, ChevronUp, AlertCircle, Save, Trash2 } from 'lucide-react';
import api from '../services/api';

const GestionLignesResponsable: React.FC = () => {
  const [lignes, setLignes] = useState<any[]>([]);
  const [trajets, setTrajets] = useState<any[]>([]);
  const [arrets, setArrets] = useState<any[]>([]);
  const [expandedLigne, setExpandedLigne] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddTrajet, setShowAddTrajet] = useState<number | null>(null);
  const [newTrajet, setNewTrajet] = useState({ heureDepart: '', heureArrivee: '', joursSemaine: '', placesDisponibles: 30 });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [l, t, a] = await Promise.all([
        api.get('/transport/lignes'),
        api.get('/transport/trajets'),
        api.get('/transport/arrets'),
      ]);
      setLignes(l.data || []);
      setTrajets(t.data || []);
      setArrets(a.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrajet = async (ligneId: number) => {
    try {
      await api.post('/transport/trajets', { ...newTrajet, ligneId });
      setShowAddTrajet(null);
      setNewTrajet({ heureDepart: '', heureArrivee: '', joursSemaine: '', placesDisponibles: 30 });
      fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur ajout trajet');
    }
  };

  const handleDeleteTrajet = async (trajetId: number) => {
    if (!confirm('Supprimer ce trajet?')) return;
    try {
      await api.delete(`/transport/trajets/${trajetId}`);
      fetchAll();
    } catch (err: any) {
      alert('Erreur suppression');
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

  const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Lignes & Horaires</h1>
        <p className="text-slate-500 mt-1">Gérez les trajets et les horaires de chaque ligne</p>
      </div>

      <div className="space-y-4">
        {lignes.map((ligne: any, i: number) => {
          const ligneArrets = arrets.filter((a: any) => a.ligneId === ligne.id || a.ligneNom === ligne.nom);
          const ligneTrajets = trajets.filter((t: any) => t.ligneId === ligne.id || t.ligneNom === ligne.nom);
          const isOpen = expandedLigne === ligne.id;

          return (
            <motion.div
              key={ligne.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedLigne(isOpen ? null : ligne.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Route className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 text-lg">{ligne.nom}</p>
                    <p className="text-sm text-slate-500">{ligne.description || 'Aucune description'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{ligneTrajets.length} rchlas</span>
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">{ligneArrets.length} arrêts</span>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="border-t border-slate-50 p-6 space-y-6">
                  {/* Arrêts */}
                  {ligneArrets.length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Arrêts
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ligneArrets.map((a: any) => (
                          <span key={a.id} className="bg-slate-100 text-slate-700 text-sm px-3 py-1 rounded-full">
                            {a.nom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trajets */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Horaires des rchlas
                      </p>
                      <button
                        onClick={() => setShowAddTrajet(showAddTrajet === ligne.id ? null : ligne.id)}
                        className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        <Plus className="w-4 h-4" /> Ajouter horaire
                      </button>
                    </div>

                    {showAddTrajet === ligne.id && (
                      <div className="bg-emerald-50 rounded-xl p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 block">Heure départ</label>
                          <input type="time" value={newTrajet.heureDepart}
                            onChange={e => setNewTrajet({ ...newTrajet, heureDepart: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 block">Heure arrivée</label>
                          <input type="time" value={newTrajet.heureArrivee}
                            onChange={e => setNewTrajet({ ...newTrajet, heureArrivee: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 block">Jours</label>
                          <select value={newTrajet.joursSemaine}
                            onChange={e => setNewTrajet({ ...newTrajet, joursSemaine: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300">
                            <option value="">Choisir...</option>
                            {JOURS.map(j => <option key={j} value={j}>{j}</option>)}
                            <option value="Lundi-Vendredi">Lundi–Vendredi</option>
                            <option value="Tous les jours">Tous les jours</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 block">Places</label>
                          <input type="number" value={newTrajet.placesDisponibles}
                            onChange={e => setNewTrajet({ ...newTrajet, placesDisponibles: Number(e.target.value) })}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                        </div>
                        <div className="col-span-2 md:col-span-4 flex justify-end gap-2">
                          <button onClick={() => setShowAddTrajet(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
                          <button onClick={() => handleAddTrajet(ligne.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700">
                            <Save className="w-4 h-4" /> Enregistrer
                          </button>
                        </div>
                      </div>
                    )}

                    {ligneTrajets.length === 0 ? (
                      <p className="text-slate-400 text-sm py-4 text-center">Aucun horaire programmé pour cette ligne</p>
                    ) : (
                      <div className="space-y-2">
                        {ligneTrajets.map((t: any) => (
                          <div key={t.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-4">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="font-bold text-slate-800">{t.heureDepart} → {t.heureArrivee}</span>
                              <span className="text-sm text-slate-500">{t.joursSemaine}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">{t.placesDisponibles} places</span>
                              <button onClick={() => handleDeleteTrajet(t.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GestionLignesResponsable;