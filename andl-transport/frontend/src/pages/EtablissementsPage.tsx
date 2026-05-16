import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, School, MapPin, Globe } from 'lucide-react';
import api from '../services/api';

const EtablissementsPage: React.FC = () => {
    const [etablissements, setEtablissements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>({});

    const fetchEtablissements = async () => {
        try {
            const response = await api.get('/etablissements');
            setEtablissements(response.data);
        } catch (err) {
            console.error('Erreur chargement établissements', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEtablissements();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem.id) {
                await api.put(`/etablissements/${editingItem.id}`, editingItem);
            } else {
                await api.post('/etablissements', editingItem);
            }
            setIsModalOpen(false);
            setEditingItem({});
            fetchEtablissements();
        } catch (err) {
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Supprimer cet établissement ?")) return;
        try {
            await api.delete(`/etablissements/${id}`);
            fetchEtablissements();
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Établissements</h1>
                    <p className="text-slate-500">Gérez la liste des établissements scolaires desservis</p>
                </div>
                <button 
                    onClick={() => { setEditingItem({}); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter un Établissement</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-slate-400">Chargement...</div>
                ) : etablissements.map((etab) => (
                    <div key={etab.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 flex gap-2 translate-x-12 group-hover:translate-x-0 transition-transform">
                            <button onClick={() => { setEditingItem(etab); setIsModalOpen(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(etab.id)} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                            <School className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{etab.nom}</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <MapPin className="w-4 h-4" />
                                <span>{etab.ville || 'Ville non spécifiée'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Globe className="w-4 h-4" />
                                <span>{etab.adresse || 'Adresse non spécifiée'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="bg-blue-600 h-2 w-full" />
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">{editingItem.id ? 'Modifier' : 'Ajouter'} un Établissement</h2>
                            <form onSubmit={handleSave} className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600">Nom de l'établissement</span>
                                    <input 
                                        type="text" required
                                        value={editingItem.nom || ''}
                                        onChange={e => setEditingItem({...editingItem, nom: e.target.value})}
                                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600">Ville</span>
                                    <input 
                                        type="text"
                                        value={editingItem.ville || ''}
                                        onChange={e => setEditingItem({...editingItem, ville: e.target.value})}
                                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600">Adresse</span>
                                    <textarea 
                                        value={editingItem.adresse || ''}
                                        onChange={e => setEditingItem({...editingItem, adresse: e.target.value})}
                                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                    />
                                </label>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors font-semibold">Annuler</button>
                                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md shadow-blue-200">Enregistrer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EtablissementsPage;
