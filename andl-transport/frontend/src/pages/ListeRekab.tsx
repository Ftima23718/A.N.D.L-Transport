import React, { useEffect, useState } from 'react';
import { Users, MapPin, Search, QrCode, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

const ListeRekab: React.FC = () => {
  const [rekab, setRekab] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/chauffeur/mes-rekab')
      .then(res => setRekab(res.data || []))
      .catch(err => setError(err.response?.data?.message || 'Erreur chargement'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
    </div>
  );

  const filteredRekab = rekab.filter(r =>
    `${r.nom} ${r.prenom} ${r.numeroEtudiant}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Liste des Rkab</h1>
        <p className="text-slate-500 mt-1">Tous les étudiants abonnés sur votre ligne</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5" />
          <p className="text-rose-700 text-sm">{error}</p>
        </div>
      )}

      {/* Stats + Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2 flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Chercher par nom, prénom ou numéro..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm text-slate-700 bg-transparent"
          />
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-emerald-800">{rekab.length} rkab total</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex items-center gap-3">
          <Users className="w-5 h-5 text-amber-600" />
          <h2 className="font-bold text-slate-800">Rkab sur ma ligne</h2>
          <span className="ml-auto text-sm text-slate-400">{filteredRekab.length} résultats</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">#</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Étudiant</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">N° Étudiant</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Arrêt</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Badge</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRekab.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    {search ? 'Aucun résultat trouvé' : 'Aucun rkab sur votre ligne'}
                  </td>
                </tr>
              ) : filteredRekab.map((r: any, i: number) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-400 text-sm font-mono">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 font-bold text-sm">
                        {r.prenom?.[0]}{r.nom?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{r.prenom} {r.nom}</p>
                        <p className="text-xs text-slate-400">{r.email || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{r.numeroEtudiant}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-slate-600 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {r.arretNom || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-slate-600 text-sm">
                      <QrCode className="w-3.5 h-3.5 text-slate-400" />
                      {r.badgeValide ? 'Actif' : 'Inactif'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {r.inscriptionValidee ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
                        <CheckCircle className="w-3.5 h-3.5" /> Validé
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full w-fit">
                        <XCircle className="w-3.5 h-3.5" /> En attente
                      </span>
                    )}
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

export default ListeRekab;