import React, { useEffect, useState } from 'react';
import { Search, Edit2, Mail, Phone, Check, X, School } from 'lucide-react';
import api from '../services/api';

const GestionEtudiantsPage: React.FC = () => {
    const [etudiants, setEtudiants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedEtudiant, setSelectedEtudiant] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchEtudiants = async () => {
        try {
            const response = await api.get('/admin/etudiants');
            setEtudiants(response.data.content || response.data || []);
        } catch (err) {
            console.error('Erreur chargement étudiants', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEtudiants();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put(`/admin/etudiants/${selectedEtudiant.id}`, selectedEtudiant);
            setIsEditModalOpen(false);
            fetchEtudiants();
        } catch (err) {
            alert("Erreur lors de la modification");
        }
    };

    const toggleStatus = async (etudiant: any) => {
        try {
            await api.put(`/admin/etudiants/${etudiant.id}`, { ...etudiant, actif: !etudiant.actif });
            fetchEtudiants();
        } catch (err) {
            alert("Erreur lors du changement de statut");
        }
    };

    const filtered = etudiants.filter(e =>
        `${e.prenom} ${e.nom} ${e.numeroEtudiant} ${e.email}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Gestion des Étudiants</h1>
                    <p className="text-slate-500">Consultez et gérez les profils des étudiants inscrits</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email ou ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Étudiant</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Scolarité</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Chargement...</td></tr>
                            ) : filtered.map((e) => (
                                <tr key={e.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold uppercase">
                                                {e.prenom[0]}{e.nom[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{e.prenom} {e.nom}</p>
                                                <p className="text-xs text-slate-400">#{e.numeroEtudiant || e.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{e.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{e.telephone || '-'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <School className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{e.etablissementNom || 'Non spécifié'}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase">{e.niveauScolaire} - {e.anneeScolaire}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                            e.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                        }`}>
                                            {e.actif ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => { setSelectedEtudiant(e); setIsEditModalOpen(true); }}
                                                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors shadow-sm"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => toggleStatus(e)}
                                                className={`p-2 rounded-xl transition-colors shadow-sm ${
                                                    e.actif ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                }`}
                                            >
                                                {e.actif ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && selectedEtudiant && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden">
                        <div className="bg-blue-600 h-2 w-full" />
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Modifier le Profil Étudiant</h2>
                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Nom</span>
                                        <input 
                                            type="text" 
                                            value={selectedEtudiant.nom}
                                            onChange={e => setSelectedEtudiant({...selectedEtudiant, nom: e.target.value})}
                                            className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Prénom</span>
                                        <input 
                                            type="text" 
                                            value={selectedEtudiant.prenom}
                                            onChange={e => setSelectedEtudiant({...selectedEtudiant, prenom: e.target.value})}
                                            className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Email</span>
                                        <input 
                                            type="email" 
                                            value={selectedEtudiant.email}
                                            onChange={e => setSelectedEtudiant({...selectedEtudiant, email: e.target.value})}
                                            className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </label>
                                </div>
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Téléphone</span>
                                        <input 
                                            type="text" 
                                            value={selectedEtudiant.telephone || ''}
                                            onChange={e => setSelectedEtudiant({...selectedEtudiant, telephone: e.target.value})}
                                            className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Date de naissance</span>
                                        <input 
                                            type="date" 
                                            value={selectedEtudiant.dateNaissance ? selectedEtudiant.dateNaissance.split('T')[0] : ''}
                                            onChange={e => setSelectedEtudiant({...selectedEtudiant, dateNaissance: e.target.value})}
                                            className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Niveau Scolaire</span>
                                        <input 
                                            type="text" 
                                            value={selectedEtudiant.niveauScolaire || ''}
                                            onChange={e => setSelectedEtudiant({...selectedEtudiant, niveauScolaire: e.target.value})}
                                            className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Année Scolaire</span>
                                        <input 
                                            type="text" 
                                            value={selectedEtudiant.anneeScolaire || ''}
                                            onChange={e => setSelectedEtudiant({...selectedEtudiant, anneeScolaire: e.target.value})}
                                            className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </label>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-6 py-2 text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors font-semibold"
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md shadow-blue-200"
                                    >
                                        Enregistrer
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

export default GestionEtudiantsPage;
