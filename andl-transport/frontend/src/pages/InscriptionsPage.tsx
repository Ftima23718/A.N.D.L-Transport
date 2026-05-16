import React, { useEffect, useState } from 'react';
import { Search, Check, X, Eye, Download, AlertTriangle, Filter } from 'lucide-react';
import api from '../services/api';

const InscriptionsPage: React.FC = () => {
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchInscriptions = async () => {
    try {
      const response = await api.get('/admin/inscriptions');
      setInscriptions(response.data.content || response.data || []);
    } catch (err) {
      console.error('Erreur chargement inscriptions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInscriptions();
  }, []);

  const handleAction = async (id: number, action: 'valider' | 'rejeter', motif?: string) => {
    try {
      if (action === 'valider') {
        await api.patch(`/admin/inscriptions/${id}/valider`);
      } else {
        await api.patch(`/admin/inscriptions/${id}/rejeter`, { motif: motif || 'Refusé' });
      }
      fetchInscriptions();
    } catch (err) {
      alert("Erreur lors de l'action");
    }
  };

  const filtered = inscriptions.filter(i =>
    `${i.etudiantPrenom || ''} ${i.etudiantNom || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestion des Inscriptions</h1>
          <p className="text-slate-500">Validez les demandes d'abonnement et gérez les flux</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors font-medium">
              <Filter className="w-4 h-4" />
              <span>Filtrer</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors font-medium">
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Étudiant</th>
                <th className="px-6 py-4">Détails Abonnement</th>
                <th className="px-6 py-4">Date Demande</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Chargement...
                  </td>
                </tr>
              )}
              {!loading && filtered.map((insc) => (
                <tr key={insc.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                        {(insc.etudiantPrenom?.[0] || '?')}{(insc.etudiantNom?.[0] || '?')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{insc.etudiantPrenom} {insc.etudiantNom}</p>
                        <p className="text-xs text-slate-400">ID: #{insc.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-slate-600">{insc.typeAbonnement}</p>
                    <p className="text-xs text-slate-400">{insc.ligneNom || 'Ligne non spécifiée'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-600">
                      {insc.dateCreation ? new Date(insc.dateCreation).toLocaleDateString('fr-MA') : '-'}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide inline-flex items-center gap-1.5 ${
                      insc.statut === 'VALIDEE' ? 'bg-emerald-100 text-emerald-700' :
                      insc.statut === 'REJETEE' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {insc.statut === 'VALIDEE' && <Check className="w-3 h-3" />}
                      {insc.statut === 'REJETEE' && <X className="w-3 h-3" />}
                      {insc.statut === 'EN_ATTENTE' && <AlertTriangle className="w-3 h-3" />}
                      {insc.statut}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      {insc.statut === 'EN_ATTENTE' && (
                        <>
                          <button
                            onClick={() => handleAction(insc.id, 'valider')}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors shadow-sm"
                            title="Valider"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(insc.id, 'rejeter')}
                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors shadow-sm"
                            title="Rejeter"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors shadow-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    Aucune inscription trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InscriptionsPage;
