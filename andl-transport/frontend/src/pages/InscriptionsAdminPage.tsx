import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, AlertCircle, FileText, User, Calendar, Building2, Bus, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

interface Inscription {
    id: number;
    etudiantNom: string;
    etudiantPrenom: string;
    etudiantEmail: string;
    statut: string;
    typeAbonnement: string;
    dateDebut: string;
    dateFin: string;
    ligneNom?: string;
    etablissementNom?: string;
}

interface Etudiant {
    id: number;
    nom: string;
    prenom: string;
    email: string;
}

interface Ligne {
    id: number;
    nom: string;
}

const InscriptionsManagementPage: React.FC = () => {
    const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
    const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
    const [lignes, setLignes] = useState<Ligne[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInscription, setEditingInscription] = useState<Inscription | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatut, setFilterStatut] = useState<string>('');

    const [formData, setFormData] = useState({
        etudiantId: '',
        ligneId: '',
        typeAbonnement: 'ANNUEL',
        statut: 'EN_ATTENTE',
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [inscRes, etudRes, lignRes] = await Promise.all([
                api.get('/admin/inscriptions'),
                api.get('/etudiants'),
                api.get('/transport/lignes')
            ]);
            
            setInscriptions(inscRes.data.content || inscRes.data || []);
            setEtudiants(etudRes.data);
            setLignes(lignRes.data);
        } catch (err) {
            showError('Erreur lors du chargement');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (inscription?: Inscription) => {
        if (inscription) {
            setEditingInscription(inscription);
            // Pré-remplir les données
        } else {
            setEditingInscription(null);
            setFormData({
                etudiantId: '',
                ligneId: '',
                typeAbonnement: 'ANNUEL',
                statut: 'EN_ATTENTE',
                dateDebut: new Date().toISOString().split('T')[0],
                dateFin: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingInscription(null);
    };

    const validateForm = (): boolean => {
        if (!formData.etudiantId) {
            showError('L\'étudiant est obligatoire');
            return false;
        }
        if (!formData.ligneId) {
            showError('La ligne est obligatoire');
            return false;
        }
        return true;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            if (editingInscription && editingInscription.id) {
                await api.put(`/inscriptions/${editingInscription.id}`, formData);
                showSuccess('Inscription modifiée avec succès');
            } else {
                await api.post('/inscriptions', formData);
                showSuccess('Inscription créée avec succès');
            }
            handleCloseModal();
            await fetchData();
        } catch (err) {
            showError('Erreur lors de l\'enregistrement');
            console.error('Erreur:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette inscription ?')) return;

        try {
            await api.delete(`/inscriptions/${id}`);
            showSuccess('Inscription supprimée avec succès');
            await fetchData();
        } catch (err) {
            showError('Erreur lors de la suppression');
            console.error('Erreur:', err);
        }
    };

    const handleValidateInscription = async (id: number) => {
        try {
            await api.patch(`/inscriptions/${id}/valider`);
            showSuccess('Inscription validée');
            await fetchData();
        } catch (err) {
            showError('Erreur lors de la validation');
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

    const filteredInscriptions = inscriptions.filter(i =>
        (i.etudiantNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
         i.etudiantPrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
         i.etudiantEmail.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filterStatut || i.statut === filterStatut)
    );

    const getStatutColor = (statut: string) => {
        switch(statut) {
            case 'VALIDEE': return 'bg-emerald-100 text-emerald-700';
            case 'EN_ATTENTE': return 'bg-amber-100 text-amber-700';
            case 'REJETEE': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const stats = [
        { label: 'Total Inscriptions', value: inscriptions.length, icon: FileText, color: 'blue' },
        { label: 'Validées', value: inscriptions.filter(i => i.statut === 'VALIDEE').length, icon: Check, color: 'emerald' },
        { label: 'En attente', value: inscriptions.filter(i => i.statut === 'EN_ATTENTE').length, icon: Clock, color: 'orange' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">Chargement des inscriptions...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800">Gestion des Inscriptions</h1>
                    <p className="text-slate-500 mt-1 font-medium">Gérez les inscriptions des étudiants</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nouvelle Inscription</span>
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

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{stat.label}</p>
                        <p className="text-3xl font-black text-slate-800 mt-2">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <select
                    value={filterStatut}
                    onChange={(e) => setFilterStatut(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="">Tous les statuts</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="VALIDEE">Validée</option>
                    <option value="REJETEE">Rejetée</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Étudiant</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Ligne</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredInscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        Aucune inscription trouvée
                                    </td>
                                </tr>
                            ) : (
                                filteredInscriptions.map((insc) => (
                                    <motion.tr key={insc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <div>
                                                <p className="font-semibold text-slate-800">{insc.etudiantPrenom} {insc.etudiantNom}</p>
                                                <p className="text-[10px] text-slate-400">{insc.etudiantEmail}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                                                {insc.typeAbonnement}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            {insc.ligneNom || '-'}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            <p>{new Date(insc.dateDebut).toLocaleDateString('fr-MA')}</p>
                                            {insc.dateFin && (
                                                <p className="text-[10px] text-slate-400">à {new Date(insc.dateFin).toLocaleDateString('fr-MA')}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 ${getStatutColor(insc.statut)}`}>
                                                {insc.statut === 'VALIDEE' ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                {insc.statut}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-2">
                                                {insc.statut === 'EN_ATTENTE' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        onClick={() => handleValidateInscription(insc.id)}
                                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                        title="Valider"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </motion.button>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    onClick={() => handleOpenModal(insc)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    onClick={() => handleDelete(insc.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 w-full" />
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                                {editingInscription ? 'Modifier' : 'Créer'} Inscription
                            </h2>

                            <form onSubmit={handleSave} className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Étudiant *</span>
                                    <select
                                        required
                                        value={formData.etudiantId}
                                        onChange={(e) => setFormData({ ...formData, etudiantId: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Sélectionner</option>
                                        {etudiants.map(e => (
                                            <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Ligne *</span>
                                    <select
                                        required
                                        value={formData.ligneId}
                                        onChange={(e) => setFormData({ ...formData, ligneId: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Sélectionner</option>
                                        {lignes.map(l => (
                                            <option key={l.id} value={l.id}>{l.nom}</option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Type d'abonnement</span>
                                    <select
                                        value={formData.typeAbonnement}
                                        onChange={(e) => setFormData({ ...formData, typeAbonnement: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="MENSUEL">Mensuel</option>
                                        <option value="TRIMESTRIEL">Trimestriel</option>
                                        <option value="SEMESTRIEL">Semestriel</option>
                                        <option value="ANNUEL">Annuel</option>
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Date début</span>
                                    <input
                                        type="date"
                                        value={formData.dateDebut}
                                        onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Date fin</span>
                                    <input
                                        type="date"
                                        value={formData.dateFin}
                                        onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
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
                                        {editingInscription ? 'Modifier' : 'Créer'}
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

export default InscriptionsManagementPage;
