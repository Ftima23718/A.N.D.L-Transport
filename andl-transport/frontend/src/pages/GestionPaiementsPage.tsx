import React, { useEffect, useState } from 'react';
import { Search, Plus, Download, Check, X, AlertCircle } from 'lucide-react';
import api from '../services/api';

const GestionPaiementsPage: React.FC = () => {
    const [paiements, setPaiements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [newPaiement, setNewPaiement] = useState({ inscriptionId: '', montant: '', methodePaiement: 'ESPECES' });
    const [inscriptions, setInscriptions] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const [pRes, iRes] = await Promise.all([
                api.get('/paiements'),
                api.get('/admin/inscriptions')
            ]);
            setPaiements(pRes.data.content || pRes.data || []);
            setInscriptions((iRes.data.content || iRes.data || []).filter((i: any) => i.statut === 'VALIDEE'));
        } catch (err) {
            console.error('Erreur chargement données', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddPaiement = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/paiements', newPaiement);
            setIsPayModalOpen(false);
            setNewPaiement({ inscriptionId: '', montant: '', methodePaiement: 'ESPECES' });
            fetchData();
        } catch (err) {
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleExport = async (format: 'excel' | 'pdf') => {
        try {
            const response = await api.get(`/exports/paiements/${format}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `paiements.${format === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert("Erreur lors de l'exportation");
        }
    };

    const filtered = paiements.filter(p =>
        `${p.inscription?.etudiant?.prenom} ${p.inscription?.etudiant?.nom} ${p.id}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Gestion des Paiements</h1>
                    <p className="text-slate-500">Enregistrez les paiements manuels et suivez les transactions</p>
                </div>
                <button 
                    onClick={() => setIsPayModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5" />
                    <span>Enregistrer un Paiement</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un paiement ou étudiant..."
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
                                <th className="px-6 py-4">Transaction</th>
                                <th className="px-6 py-4">Étudiant</th>
                                <th className="px-6 py-4">Montant</th>
                                <th className="px-6 py-4">Méthode</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Chargement...</td></tr>
                            ) : filtered.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold text-slate-700">ORD-{(p.id * 1234).toString().slice(0, 6)}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-medium">Auto-generated ID: {p.id}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center text-xs font-bold uppercase">
                                                {p.inscription?.etudiant?.prenom[0]}{p.inscription?.etudiant?.nom[0]}
                                            </div>
                                            <p className="text-sm font-semibold text-slate-600">{p.inscription?.etudiant?.prenom} {p.inscription?.etudiant?.nom}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold text-blue-600">{p.montant} DH</p>
                                    </td>
                                    <td className="px-6 py-5 uppercase text-[10px] font-bold text-slate-500">
                                        {p.methodePaiement}
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm text-slate-600">{new Date(p.datePaiement || Date.now()).toLocaleDateString('fr-MA')}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide inline-flex items-center gap-1.5 ${
                                            p.statut === 'PAYE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {p.statut === 'PAYE' ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                            {p.statut}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pay Modal */}
            {isPayModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
                        <div className="bg-blue-600 h-2 w-full" />
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Enregistrer un Paiement</h2>
                                <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleAddPaiement} className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600">Étudiant (Inscription validée)</span>
                                    <select 
                                        required
                                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newPaiement.inscriptionId}
                                        onChange={e => setNewPaiement({...newPaiement, inscriptionId: e.target.value})}
                                    >
                                        <option value="">Sélectionner un étudiant...</option>
                                        {inscriptions.map(i => (
                                            <option key={i.id} value={i.id}>{i.etudiantPrenom} {i.etudiantNom} - {i.typeAbonnement}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600">Montant (DH)</span>
                                    <input 
                                        type="number" 
                                        required
                                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newPaiement.montant}
                                        onChange={e => setNewPaiement({...newPaiement, montant: e.target.value})}
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600">Méthode de Paiement</span>
                                    <select 
                                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newPaiement.methodePaiement}
                                        onChange={e => setNewPaiement({...newPaiement, methodePaiement: e.target.value})}
                                    >
                                        <option value="ESPECES">Espèces</option>
                                        <option value="VIRMENT">Virement</option>
                                        <option value="CHEQUE">Chèque</option>
                                    </select>
                                </label>
                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-md shadow-blue-200"
                                    >
                                        Confirmer le Paiement
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionPaiementsPage;
