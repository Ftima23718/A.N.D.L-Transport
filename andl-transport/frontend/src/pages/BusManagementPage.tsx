import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Clock, Users, MapPin, Phone, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

interface Bus {
    id: number;
    matricule: string;
    nom: string;
    modele: string;
    capacite: number;
    statut: string;
    chauffeurId?: number;
    chauffeurNom?: string;
    chauffeurPrenom?: string;
    etablissementId?: number;
    etablissementNom?: string;
    telephoneChauffeur?: string;
    heureDebut?: string;
    heureFin?: string;
    description?: string;
}

interface Chauffeur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
}

interface Etablissement {
    id: number;
    nom: string;
}

const BusManagementPage: React.FC = () => {
    const [buses, setBuses] = useState<Bus[]>([]);
    const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
    const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBus, setEditingBus] = useState<Bus | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState<Bus>({
        id: 0,
        matricule: '',
        nom: '',
        modele: '',
        capacite: 50,
        statut: 'ACTIF',
        telephoneChauffeur: '',
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [busRes, chauffeurRes, etabRes] = await Promise.all([
                api.get('/bus'),
                api.get('/transport/chauffeurs'),
                api.get('/etablissements')
            ]);
            setBuses(busRes.data);
            setChauffeurs(chauffeurRes.data);
            setEtablissements(etabRes.data);
        } catch (err) {
            showError('Erreur lors du chargement des données');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (bus?: Bus) => {
        if (bus) {
            setEditingBus(bus);
            setFormData(bus);
        } else {
            setEditingBus(null);
            setFormData({
                id: 0,
                matricule: '',
                nom: '',
                modele: '',
                capacite: 50,
                statut: 'ACTIF',
                telephoneChauffeur: '',
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBus(null);
    };

    const validateForm = (): boolean => {
        if (!formData.matricule.trim()) {
            showError('Le matricule est obligatoire');
            return false;
        }
        if (!formData.nom.trim()) {
            showError('Le nom du transport est obligatoire');
            return false;
        }
        if (formData.capacite <= 0) {
            showError('La capacité doit être supérieure à 0');
            return false;
        }
        return true;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            if (editingBus && editingBus.id) {
                await api.put(`/bus/${editingBus.id}`, {
                    matricule: formData.matricule,
                    nom: formData.nom,
                    modele: formData.modele,
                    capacite: formData.capacite,
                    statut: formData.statut,
                    chauffeurId: formData.chauffeurId,
                    etablissementId: formData.etablissementId,
                    telephoneChauffeur: formData.telephoneChauffeur,
                    heureDebut: formData.heureDebut,
                    heureFin: formData.heureFin,
                    description: formData.description
                });
                showSuccess('Transport modifié avec succès');
            } else {
                await api.post('/bus', {
                    matricule: formData.matricule,
                    nom: formData.nom,
                    modele: formData.modele,
                    capacite: formData.capacite,
                    statut: formData.statut,
                    chauffeurId: formData.chauffeurId,
                    etablissementId: formData.etablissementId,
                    telephoneChauffeur: formData.telephoneChauffeur,
                    heureDebut: formData.heureDebut,
                    heureFin: formData.heureFin,
                    description: formData.description
                });
                showSuccess('Transport créé avec succès');
            }
            handleCloseModal();
            await fetchData();
        } catch (err) {
            showError('Erreur lors de l\'enregistrement');
            console.error('Erreur:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce transport ?')) return;

        try {
            await api.delete(`/bus/${id}`);
            showSuccess('Transport supprimé avec succès');
            await fetchData();
        } catch (err) {
            showError('Erreur lors de la suppression');
            console.error('Erreur:', err);
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

    const filteredBuses = buses.filter(bus =>
        bus.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.etablissementNom?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (statut: string) => {
        if (statut === 'ACTIF') {
            return <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold"><CheckCircle className="w-3 h-3" />Actif</span>;
        } else {
            return <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold"><XCircle className="w-3 h-3" />Inactif</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">Chargement des transports...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800">Gestion des Transports</h1>
                    <p className="text-slate-500 mt-1 font-medium">Gérez les bus, chauffeurs et horaires</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter Transport</span>
                </motion.button>
            </div>

            {/* Messages */}
            {successMessage && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {successMessage}
                </motion.div>
            )}
            {errorMessage && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {errorMessage}
                </motion.div>
            )}

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <input
                    type="text"
                    placeholder="Rechercher par matricule, nom ou établissement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Matricule</th>
                                <th className="px-6 py-4">Nom</th>
                                <th className="px-6 py-4">Capacité</th>
                                <th className="px-6 py-4">Chauffeur</th>
                                <th className="px-6 py-4">Établissement</th>
                                <th className="px-6 py-4">Horaires</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredBuses.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                                        Aucun transport trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredBuses.map((bus, idx) => (
                                    <motion.tr key={bus.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm">{bus.matricule}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-800">{bus.nom}</p>
                                            <p className="text-[10px] text-slate-400">{bus.modele}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                                <Users className="w-4 h-4 text-blue-600" />
                                                {bus.capacite} places
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-semibold text-slate-600">
                                                {bus.chauffeurNom && bus.chauffeurPrenom 
                                                    ? `${bus.chauffeurNom} ${bus.chauffeurPrenom}`
                                                    : 'Non assigné'
                                                }
                                            </p>
                                            {bus.telephoneChauffeur && (
                                                <p className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                                                    <Phone className="w-3 h-3" />
                                                    {bus.telephoneChauffeur}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-semibold text-slate-600">
                                                {bus.etablissementNom || 'Non spécifié'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                <Clock className="w-4 h-4 text-orange-500" />
                                                {bus.heureDebut && bus.heureFin 
                                                    ? `${bus.heureDebut.slice(0, 5)} - ${bus.heureFin.slice(0, 5)}`
                                                    : '-'
                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(bus.statut)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    onClick={() => handleOpenModal(bus)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    onClick={() => handleDelete(bus.id)}
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
                        className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 w-full" />
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-slate-800">
                                    {editingBus ? 'Modifier Transport' : 'Ajouter Transport'}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                {/* Row 1 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600 mb-2 block">Matricule *</span>
                                        <input
                                            type="text"
                                            required
                                            value={formData.matricule}
                                            onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="ex: MA-001-BUS"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600 mb-2 block">Nom du Transport *</span>
                                        <input
                                            type="text"
                                            required
                                            value={formData.nom}
                                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="ex: Bus ligne 1"
                                        />
                                    </label>
                                </div>

                                {/* Row 2 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600 mb-2 block">Modèle</span>
                                        <input
                                            type="text"
                                            value={formData.modele}
                                            onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="ex: Isuzu D-Max"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600 mb-2 block">Capacité *</span>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.capacite}
                                            onChange={(e) => setFormData({ ...formData, capacite: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </label>
                                </div>

                                {/* Row 3 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600 mb-2 block">Chauffeur</span>
                                        <select
                                            value={formData.chauffeurId || ''}
                                            onChange={(e) => setFormData({ ...formData, chauffeurId: e.target.value ? parseInt(e.target.value) : undefined })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="">Sélectionner un chauffeur</option>
                                            {chauffeurs.map(c => (
                                                <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600 mb-2 block">Établissement</span>
                                        <select
                                            value={formData.etablissementId || ''}
                                            onChange={(e) => setFormData({ ...formData, etablissementId: e.target.value ? parseInt(e.target.value) : undefined })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="">Sélectionner un établissement</option>
                                            {etablissements.map(e => (
                                                <option key={e.id} value={e.id}>{e.nom}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                {/* Row 4 */}
                                <div className="grid grid-cols-3 gap-4">
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600 mb-2 block">Heure début</span>
                                        <input
                                            type="time"
                                            value={formData.heureDebut || ''}
                                            onChange={(e) => setFormData({ ...formData, heureDebut: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600 mb-2 block">Heure fin</span>
                                        <input
                                            type="time"
                                            value={formData.heureFin || ''}
                                            onChange={(e) => setFormData({ ...formData, heureFin: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600 mb-2 block">Téléphone Chauffeur</span>
                                        <input
                                            type="tel"
                                            value={formData.telephoneChauffeur || ''}
                                            onChange={(e) => setFormData({ ...formData, telephoneChauffeur: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </label>
                                </div>

                                {/* Row 5 */}
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Statut</span>
                                    <select
                                        value={formData.statut}
                                        onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="ACTIF">Actif</option>
                                        <option value="INACTIF">Inactif</option>
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Description</span>
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-20"
                                        placeholder="Notes supplémentaires..."
                                    />
                                </label>

                                {/* Buttons */}
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
                                        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md shadow-blue-200 flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        {editingBus ? 'Modifier' : 'Créer'}
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

export default BusManagementPage;
