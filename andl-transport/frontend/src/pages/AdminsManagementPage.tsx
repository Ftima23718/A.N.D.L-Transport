import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Key, Shield, AlertCircle, Check, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

interface Admin {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    role: string;
    actif: boolean;
    dateCreation: string;
}

const AdminManagementPage: React.FC = () => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        actif: true
    });

    const [passwordData, setPasswordData] = useState({
        adminId: 0,
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await api.get('/administrateurs');
            setAdmins(response.data);
        } catch (err) {
            showError('Erreur lors du chargement');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (admin?: Admin) => {
        if (admin) {
            setEditingAdmin(admin);
            setFormData({
                nom: admin.nom,
                prenom: admin.prenom,
                email: admin.email,
                telephone: admin.telephone || '',
                actif: admin.actif
            });
        } else {
            setEditingAdmin(null);
            setFormData({
                nom: '',
                prenom: '',
                email: '',
                telephone: '',
                actif: true
            });
        }
        setIsModalOpen(true);
    };

    const handleOpenPasswordModal = (admin: Admin) => {
        setEditingAdmin(admin);
        setPasswordData({
            adminId: admin.id,
            newPassword: '',
            confirmPassword: ''
        });
        setIsPasswordModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAdmin(null);
    };

    const handleClosePasswordModal = () => {
        setIsPasswordModalOpen(false);
        setPasswordData({
            adminId: 0,
            newPassword: '',
            confirmPassword: ''
        });
    };

    const validateForm = (): boolean => {
        if (!formData.nom.trim()) {
            showError('Le nom est obligatoire');
            return false;
        }
        if (!formData.prenom.trim()) {
            showError('Le prénom est obligatoire');
            return false;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            showError('Un email valide est obligatoire');
            return false;
        }
        return true;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            if (editingAdmin && editingAdmin.id) {
                await api.put(`/administrateurs/${editingAdmin.id}`, formData);
                showSuccess('Admin modifié avec succès');
            } else {
                await api.post('/administrateurs', formData);
                showSuccess('Admin créé avec succès');
            }
            handleCloseModal();
            await fetchAdmins();
        } catch (err) {
            showError('Erreur lors de l\'enregistrement');
            console.error('Erreur:', err);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showError('Les mots de passe ne correspondent pas');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showError('Le mot de passe doit avoir au moins 6 caractères');
            return;
        }

        try {
            await api.patch(`/administrateurs/${passwordData.adminId}/reset-password`, {
                newPassword: passwordData.newPassword
            });
            showSuccess('Mot de passe réinitialisé avec succès');
            handleClosePasswordModal();
        } catch (err) {
            showError('Erreur lors de la réinitialisation');
            console.error('Erreur:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cet administrateur ?')) return;

        try {
            await api.delete(`/administrateurs/${id}`);
            showSuccess('Admin supprimé avec succès');
            await fetchAdmins();
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

    const filteredAdmins = admins.filter(a =>
        a.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: 'Total Admins', value: admins.length, color: 'blue' },
        { label: 'Actifs', value: admins.filter(a => a.actif).length, color: 'emerald' },
        { label: 'Inactifs', value: admins.filter(a => !a.actif).length, color: 'red' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">Chargement des administrateurs...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800">Gestion des Administrateurs</h1>
                    <p className="text-slate-500 mt-1 font-medium">Gérez l'accès administrateur et les permissions</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter Admin</span>
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
                            <Shield className="w-6 h-6" />
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{stat.label}</p>
                        <p className="text-3xl font-black text-slate-800 mt-2">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
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
                                <th className="px-6 py-4">Nom</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Téléphone</th>
                                <th className="px-6 py-4">Créé le</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAdmins.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        Aucun administrateur trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredAdmins.map((admin) => (
                                    <motion.tr key={admin.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                                    {admin.prenom[0]}{admin.nom[0]}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800">{admin.prenom} {admin.nom}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <a href={`mailto:${admin.email}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {admin.email}
                                            </a>
                                        </td>
                                        <td className="px-6 py-5 text-slate-600">
                                            {admin.telephone || '-'}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            {new Date(admin.dateCreation).toLocaleDateString('fr-MA')}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${admin.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {admin.actif ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    onClick={() => handleOpenPasswordModal(admin)}
                                                    className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                                    title="Réinitialiser le mot de passe"
                                                >
                                                    <Key className="w-4 h-4" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    onClick={() => handleOpenModal(admin)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    onClick={() => handleDelete(admin.id)}
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

            {/* Modal Créer/Modifier Admin */}
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
                                {editingAdmin ? 'Modifier Admin' : 'Ajouter Admin'}
                            </h2>

                            <form onSubmit={handleSave} className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Nom *</span>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Prénom *</span>
                                    <input
                                        type="text"
                                        required
                                        value={formData.prenom}
                                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Email *</span>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Téléphone</span>
                                    <input
                                        type="tel"
                                        value={formData.telephone}
                                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.actif}
                                        onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                                        className="w-4 h-4 rounded"
                                    />
                                    <span className="text-sm font-semibold text-slate-600">Actif</span>
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
                                        {editingAdmin ? 'Modifier' : 'Créer'}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Modal Réinitialiser Mot de Passe */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-orange-600 to-orange-700 h-2 w-full" />
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Réinitialiser le mot de passe</h2>
                            <p className="text-slate-500 text-sm mb-6">pour {editingAdmin?.prenom} {editingAdmin?.nom}</p>

                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2 block">
                                        <Lock className="w-4 h-4" />
                                        Nouveau mot de passe *
                                    </span>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2 block">
                                        <Lock className="w-4 h-4" />
                                        Confirmez le mot de passe *
                                    </span>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </label>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={handleClosePasswordModal}
                                        className="px-6 py-2 text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors font-semibold"
                                    >
                                        Annuler
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all font-semibold shadow-md shadow-orange-200"
                                    >
                                        Réinitialiser
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

export default AdminManagementPage;
