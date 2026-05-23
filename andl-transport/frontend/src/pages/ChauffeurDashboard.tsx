import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Bus, AlertCircle, Users } from 'lucide-react';
import api from '../services/api';

const JOURS_ORDRE = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const ProgrammeRechlatChauffeur: React.FC = () => {
  const [programme, setProgramme] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jourSelectionne, setJourSelectionne] = useState<string>('Tous');

  useEffect(() => {
    api.get('/chauffeur/mon-programme')
      .then(res => setProgramme(res.data || []))
      .catch(err => setError(err.response?.data?.message || 'Erreur chargement'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
    </div>
  );

  const trajFiltres = jourSelectionne === 'Tous'
    ? programme
    : programme.filter((t: any) =>
        t.joursSemaine?.toLowerCase().includes(jourSelectionne.toLowerCase()) ||
        t.joursSemaine?.toLowerCase().includes('tous')
      );

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Programme des Rchlas</h1>
        <p className="text-slate-500 mt-1">Tous vos horaires de la semaine</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5" />
          <p className="text-rose-700 text-sm">{error}</p>
        </div>
      )}

      {/* Filtre jours */}
      <div className="flex gap-2 flex-wrap">
        {['Tous', ...JOURS_ORDRE].map(jour => (
          <button key={jour} onClick={() => setJourSelectionne(jour)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              jourSelectionne === jour
                ? 'bg-amber-600 text-white shadow-md shadow-amber-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-50'
            }`}>
            {jour}
          </button>
        ))}
      </div>

      {/* Summary bar */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-6">
        <div className="flex items-center gap-2 text-amber-800">
          <Calendar className="w-5 h-5" />
          <span className="font-bold">{trajFiltres.length} rchla{trajFiltres.length > 1 ? 's' : ''}</span>
          {jourSelectionne !== 'Tous' && <span className="text-amber-600">ce {jourSelectionne}</span>}
        </div>
      </div>

      {/* Trajets cards */}
      {trajFiltres.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Aucune rchla pour ce jour</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trajFiltres.map((t: any) => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{t.heureDepart} → {t.heureArrivee}</p>
                    <p className="text-xs text-amber-600 font-semibold">{t.joursSemaine}</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
              </div>
              <div className="space-y-2 border-t border-slate-50 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{t.ligneNom || `Ligne #${t.ligneId}`}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Bus className="w-4 h-4 text-slate-400" />
                  <span>{t.busImmatriculation || 'Bus non assigné'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{t.placesDisponibles} places disponibles</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgrammeRechlatChauffeur;