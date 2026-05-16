import React, { useEffect, useState } from 'react';
import { Search, Check, X, Eye, Download, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const InscriptionsPage: React.FC = () => {
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [selectedInsc, setSelectedInsc] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejetModalOpen, setIsRejetModalOpen] = useState(false);
  const [motifRejet, setMotifRejet] = useState('');

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

  const handleAction = async (id: number, action: 'valider' | 'rejeter') => {
    try {
      if (action === 'valider') {
        await api.patch(`/admin/inscriptions/${id}/valider`);
        fetchInscriptions();
      } else {
        setSelectedInsc(inscriptions.find(i => i.id === id));
        setIsRejetModalOpen(true);
      }
    } catch (err) {
      alert("Erreur lors de l'action");
    }
  };

  const submitRejet = async () => {
    try {
      await api.patch(`/admin/inscriptions/${selectedInsc.id}/rejeter`, motifRejet, {
        headers: { 'Content-Type': 'text/plain' }
      });
      setIsRejetModalOpen(false);
      setMotifRejet('');
      fetchInscriptions();
    } catch (err) {
      alert("Erreur lors du rejet");
    }
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
      try {
          const response = await api.get(`/api/exports/inscriptions/${format}`, { responseType: 'blob' });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `inscriptions.${format === 'excel' ? 'xlsx' : 'pdf'}`);
          document.body.appendChild(link);
          link.click();
      } catch (err) {
          alert("Erreur lors de l'exportation");
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
            <button 
                onClick={() => handleExport('excel')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors font-medium">
              <Download className="w-4 h-4" />
              <span>Excel</span>
            </button>
            <button 
                onClick={() => handleExport('pdf')}
                className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors font-medium">
              <Download className="w-4 h-4" />
              <span>PDF</span>
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
                      <button 
                        onClick={() => { setSelectedInsc(insc); setIsDetailModalOpen(true); }}
                        className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
                      >
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

      {/* Detail Modal */}
      {isDetailModalOpen && selectedInsc && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
                <div className="bg-blue-600 h-2 w-full" />
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Détail Inscription</h2>
                        <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Étudiant</span>
                            <span className="font-semibold text-slate-800">{selectedInsc.etudiantPrenom} {selectedInsc.etudiantNom}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Abonnement</span>
                            <span className="font-semibold text-slate-800">{selectedInsc.typeAbonnement}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Ligne</span>
                            <span className="font-semibold text-slate-800">{selectedInsc.ligneNom || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Statut</span>
                            <span className="font-semibold text-slate-800">{selectedInsc.statut}</span>
                        </div>
                        {selectedInsc.motifRejet && (
                            <div className="bg-rose-50 p-3 rounded-xl">
                                <p className="text-xs font-bold text-rose-600 uppercase mb-1">Motif du rejet</p>
                                <p className="text-sm text-rose-700">{selectedInsc.motifRejet}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejetModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="bg-rose-600 h-2 w-full" />
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Motif du Rejet</h2>
                    <textarea 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none h-32 mb-6"
                        placeholder="Saisissez la raison du rejet..."
                        value={motifRejet}
                        onChange={(e) => setMotifRejet(e.target.value)}
                    />
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => setIsRejetModalOpen(false)}
                            className="px-6 py-2 text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors font-semibold"
                        >
                            Annuler
                        </button>
                        <button 
                            onClick={submitRejet}
                            disabled={!motifRejet.trim()}
                            className="px-6 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all font-semibold shadow-md shadow-rose-200 disabled:opacity-50"
                        >
                            Confirmer le rejet
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default InscriptionsPage;
