import React, { useEffect, useState } from 'react';
import { Plus, Download, Check, X, AlertCircle, Eye, FileText, Search, TrendingUp, DollarSign, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

interface Facture {
    id: number;
    numero: string;
    etudiantNom: string;
    etudiantPrenom: string;
    etudiantEmail: string;
    montant: number;
    statut: string;
    dateEmission: string;
    dateEcheance: string;
    datePaiement?: string;
    typeAbonnement: string;
    description?: string;
}

interface Stats {
    totalFactures: number;
    totalEncaisse: number;
    en_attente: number;
    taux_paiement: number;
}

const GestionFacturesPage: React.FC = () => {
    const [factures, setFactures] = useState<Facture[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalFactures: 0,
        totalEncaisse: 0,
        en_attente: 0,
        taux_paiement: 0
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatut, setFilterStatut] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        etudiantId: '',
        montant: '',
        dateEmission: new Date().toISOString().split('T')[0],
        dateEcheance: '',
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [facRes, studRes] = await Promise.all([
                api.get('/factures'),
                api.get('/etudiants')
            ]);
            
            const facList = facRes.data;
            setFactures(facList);
            
            // Calculer les stats
            const totalEncaisse = facList
                .filter((f: any) => f.statut === 'PAYEE')
                .reduce((sum: number, f: any) => sum + f.montant, 0);
            
            const en_attente = facList
                .filter((f: any) => f.statut === 'CREEE' || f.statut === 'EMISE')
                .reduce((sum: number, f: any) => sum + f.montant, 0);
            
            setStats({
                totalFactures: facList.length,
                totalEncaisse: totalEncaisse,
                en_attente: en_attente,
                taux_paiement: facList.length > 0 ? Math.round((facList.filter((f: any) => f.statut === 'PAYEE').length / facList.length) * 100) : 0
            });
            
            setStudents(studRes.data);
        } catch (err) {
            showError('Erreur lors du chargement');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFacture = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/factures', {
                etudiantId: parseInt(formData.etudiantId),
                montant: parseFloat(formData.montant),
                dateEmission: formData.dateEmission,
                dateEcheance: formData.dateEcheance,
                description: formData.description
            });
            showSuccess('Facture créée avec succès');
            setIsModalOpen(false);
            setFormData({
                etudiantId: '',
                montant: '',
                dateEmission: new Date().toISOString().split('T')[0],
                dateEcheance: '',
                description: ''
            });
            await fetchData();
        } catch (err) {
            showError('Erreur lors de la création');
            console.error('Erreur:', err);
        }
    };

    const handlePayerFacture = async (factureId: number, montant: number) => {
        try {
            await api.post(`/factures/${factureId}/payer?montant=${montant}`);
            showSuccess('Paiement enregistré avec succès');
            await fetchData();
        } catch (err) {
            showError('Erreur lors du paiement');
        }
    };

    const handleExport = async (format: 'excel' | 'pdf') => {
        try {
            const response = await api.get(`/exports/factures/${format}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `factures.${format === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            showError('Erreur lors de l\'exportation');
        }
    };

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const showError = (msg: string) => {
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(''), 3000);
    };

    const filtered = factures.filter(f =>
        (f.numero.toLowerCase().includes(search.toLowerCase()) ||
         f.etudiantNom.toLowerCase().includes(search.toLowerCase()) ||
         f.etudiantPrenom.toLowerCase().includes(search.toLowerCase())) &&
        (!filterStatut || f.statut === filterStatut)
    );

    const getStatutColor = (statut: string) => {
        switch(statut) {
            case 'PAYEE': return 'bg-emerald-100 text-emerald-700';
            case 'EMISE': return 'bg-blue-100 text-blue-700';
            case 'CREEE': return 'bg-amber-100 text-amber-700';
            case 'PARTIELLEMENT_PAYEE': return 'bg-orange-100 text-orange-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatutLabel = (statut: string) => {
        switch(statut) {
            case 'PAYEE': return 'Payée';
            case 'EMISE': return 'Émise';
            case 'CREEE': return 'Créée';
            case 'PARTIELLEMENT_PAYEE': return 'Partiellement payée';
            default: return statut;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">Chargement des factures...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800">Gestion des Facturation</h1>
                    <p className="text-slate-500 mt-1 font-medium">Suivi complet des factures et paiements</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5" />
                    <span>Créer Facture</span>
                </motion.button>
            </div>

            {/* Messages */}
            {successMessage && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-semibold flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    {successMessage}
                </motion.div>
            )}
            {errorMessage && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {errorMessage}
                </motion.div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Factures', value: stats.totalFactures, icon: FileText, color: 'blue' },
                    { label: 'Total Encaissé', value: `${stats.totalEncaisse.toLocaleString()} DH`, icon: DollarSign, color: 'emerald' },
                    { label: 'En Attente', value: `${stats.en_attente.toLocaleString()} DH`, icon: Clock, color: 'orange' },
                    { label: 'Taux Paiement', value: `${stats.taux_paiement}%`, icon: TrendingUp, color: 'purple' },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-800 mt-2">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par numéro ou étudiant..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <select
                        value={filterStatut}
                        onChange={(e) => setFilterStatut(e.target.value)}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="CREEE">Créée</option>
                        <option value="EMISE">Émise</option>
                        <option value="PAYEE">Payée</option>
                        <option value="PARTIELLEMENT_PAYEE">Partiellement payée</option>
                    </select>
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleExport('excel')}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors font-medium"
                        >
                            <Download className="w-4 h-4" />
                            Excel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleExport('pdf')}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors font-medium"
                        >
                            <Download className="w-4 h-4" />
                            PDF
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Factures Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Numéro</th>
                                <th className="px-6 py-4">Étudiant</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Montant</th>
                                <th className="px-6 py-4">Échéance</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                        Aucune facture trouvée
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((facture) => (
                                    <motion.tr key={facture.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg font-bold text-sm">{facture.numero}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div>
                                                <p className="font-semibold text-slate-800">{facture.etudiantPrenom} {facture.etudiantNom}</p>
                                                <p className="text-[10px] text-slate-400">{facture.etudiantEmail}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-semibold text-slate-600">{facture.typeAbonnement}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-blue-600">{facture.montant.toLocaleString()} DH</p>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            {new Date(facture.dateEcheance).toLocaleDateString('fr-MA')}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 ${getStatutColor(facture.statut)}`}>
                                                {facture.statut === 'PAYEE' ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                {getStatutLabel(facture.statut)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    onClick={() => {
                                                        setSelectedFacture(facture);
                                                        // Afficher les détails ou permettre le paiement
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </motion.button>
                                                {facture.statut !== 'PAYEE' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        onClick={() => handlePayerFacture(facture.id, facture.montant)}
                                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </motion.button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Créer Facture */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 w-full" />
                        <div className="p-8">
                            <h2 className="text-2xl font-black text-slate-800 mb-6">Créer une Facture</h2>

                            <form onSubmit={handleCreateFacture} className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Étudiant *</span>
                                    <select
                                        required
                                        value={formData.etudiantId}
                                        onChange={(e) => setFormData({ ...formData, etudiantId: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Sélectionner un étudiant</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.prenom} {s.nom}</option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Montant (DH) *</span>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        min="0"
                                        value={formData.montant}
                                        onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="0.00"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Date d'émission</span>
                                    <input
                                        type="date"
                                        value={formData.dateEmission}
                                        onChange={(e) => setFormData({ ...formData, dateEmission: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Date d'échéance</span>
                                    <input
                                        type="date"
                                        value={formData.dateEcheance}
                                        onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Description</span>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-16"
                                        placeholder="Notes..."
                                    />
                                </label>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2 text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors font-semibold"
                                    >
                                        Annuler
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md shadow-blue-200"
                                    >
                                        Créer Facture
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default GestionFacturesPage;
