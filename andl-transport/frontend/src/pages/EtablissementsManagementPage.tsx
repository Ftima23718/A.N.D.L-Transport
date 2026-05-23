import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Users, Bus, MapPin, Phone, Mail, Building2, AlertCircle, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

interface Etablissement {
    id: number;
    nom: string;
    adresse: string;
    ville: string;
    telephone: string;
    responsable: string;
    niveauScolaire: string;
    nombreEtudiants: number;
    nombreTransports: number;
    actif: boolean;
}

const EtablissementsManagementPage: React.FC = () => {
    const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEtab, setEditingEtab] = useState<Etablissement | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterNiveau, setFilterNiveau] = useState<string>('');

    const [formData, setFormData] = useState<Partial<Etablissement>>({
        nom: '',
        adresse: '',
        ville: '',
        telephone: '',
        responsable: '',
        niveauScolaire: '',
        actif: true
    });

    useEffect(() => {
        fetchEtablissements();
    }, []);

    const fetchEtablissements = async () => {
        try {
            const response = await api.get('/etablissements');
            setEtablissements(response.data);
        } catch (err) {
            showError('Erreur lors du chargement');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (etab?: Etablissement) => {
        if (etab) {
            setEditingEtab(etab);
            setFormData(etab);
        } else {
            setEditingEtab(null);
            setFormData({
                nom: '',
                adresse: '',
                ville: '',
                telephone: '',
                responsable: '',
                niveauScolaire: '',
                actif: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEtab(null);
    };

    const validateForm = (): boolean => {
        if (!formData.nom?.trim()) {
            showError('Le nom est obligatoire');
            return false;
        }
        return true;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            if (editingEtab && editingEtab.id) {
                await api.put(`/etablissements/${editingEtab.id}`, formData);
                showSuccess('Établissement modifié avec succès');
            } else {
                await api.post('/etablissements', formData);
                showSuccess('Établissement créé avec succès');
            }
            handleCloseModal();
            await fetchEtablissements();
        } catch (err) {
            showError('Erreur lors de l\'enregistrement');
            console.error('Erreur:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cet établissement ?')) return;

        try {
            await api.delete(`/etablissements/${id}`);
            showSuccess('Établissement supprimé avec succès');
            await fetchEtablissements();
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

    const filteredEtablissements = etablissements.filter(e =>
        (e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
         e.ville.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filterNiveau || e.niveauScolaire === filterNiveau)
    );

    const stats = [
        { label: 'Total Établissements', value: etablissements.length, icon: Building2, color: 'blue' },
        { label: 'Total Étudiants', value: etablissements.reduce((sum, e) => sum + e.nombreEtudiants, 0), icon: Users, color: 'emerald' },
        { label: 'Total Transports', value: etablissements.reduce((sum, e) => sum + e.nombreTransports, 0), icon: Bus, color: 'orange' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">Chargement des établissements...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800">Gestion des Établissements</h1>
                    <p className="text-slate-500 mt-1 font-medium">Gérez les écoles et leurs informations</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter Établissement</span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
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
                        <p className="text-3xl font-black text-slate-800 mt-2">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Rechercher par nom ou ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <select
                    value={filterNiveau}
                    onChange={(e) => setFilterNiveau(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="">Tous les niveaux</option>
                    <option value="Primaire">Primaire</option>
                    <option value="Collège">Collège</option>
                    <option value="Lycée">Lycée</option>
                </select>
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEtablissements.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400">
                        Aucun établissement trouvé
                    </div>
                ) : (
                    filteredEtablissements.map((etab) => (
                        <motion.div
                            key={etab.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden"
                        >
                            {/* Badge Niveau */}
                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                                    {etab.niveauScolaire}
                                </span>
                            </div>

                            {/* Header */}
                            <div className="mb-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{etab.nom}</h3>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 mb-6">
                                {etab.adresse && (
                                    <div className="flex items-start gap-3 text-sm text-slate-600">
                                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p>{etab.adresse}</p>
                                            <p className="font-semibold text-slate-700">{etab.ville}</p>
                                        </div>
                                    </div>
                                )}
                                {etab.telephone && (
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <a href={`tel:${etab.telephone}`} className="hover:text-blue-600">{etab.telephone}</a>
                                    </div>
                                )}
                                {etab.responsable && (
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span>{etab.responsable}</span>
                                    </div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-slate-800">{etab.nombreEtudiants}</p>
                                    <p className="text-xs text-slate-400 font-medium mt-1 flex items-center justify-center gap-1">
                                        <Users className="w-3 h-3" />
                                        Étudiants
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-slate-800">{etab.nombreTransports}</p>
                                    <p className="text-xs text-slate-400 font-medium mt-1 flex items-center justify-center gap-1">
                                        <Bus className="w-3 h-3" />
                                        Transports
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="absolute top-0 right-0 p-4 flex gap-2 translate-x-12 group-hover:translate-x-0 transition-transform">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => handleOpenModal(etab)}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => handleDelete(etab.id)}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))
                )}
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
                                {editingEtab ? 'Modifier' : 'Ajouter'} Établissement
                            </h2>

                            <form onSubmit={handleSave} className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Nom *</span>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nom || ''}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Adresse</span>
                                    <textarea
                                        value={formData.adresse || ''}
                                        onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-20"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Ville</span>
                                    <input
                                        type="text"
                                        value={formData.ville || ''}
                                        onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Téléphone</span>
                                    <input
                                        type="tel"
                                        value={formData.telephone || ''}
                                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Responsable</span>
                                    <input
                                        type="text"
                                        value={formData.responsable || ''}
                                        onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Niveau Scolaire</span>
                                    <select
                                        value={formData.niveauScolaire || ''}
                                        onChange={(e) => setFormData({ ...formData, niveauScolaire: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="Primaire">Primaire</option>
                                        <option value="Collège">Collège</option>
                                        <option value="Lycée">Lycée</option>
                                    </select>
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
                                        {editingEtab ? 'Modifier' : 'Créer'}
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

export default EtablissementsManagementPage;
