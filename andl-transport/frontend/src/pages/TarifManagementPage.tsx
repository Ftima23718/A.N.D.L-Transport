import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Info } from 'lucide-react';
import api from '../services/api';

const TarifManagementPage: React.FC = () => {
    const [tarifs, setTarifs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>({});

    const fetchTarifs = async () => {
        try {
            const response = await api.get('/transport/tarifs');
            setTarifs(response.data);
        } catch (err) {
            console.error('Erreur chargement tarifs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTarifs();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/transport/tarifs', editingItem);
            setIsModalOpen(false);
            setEditingItem({});
            fetchTarifs();
        } catch (err) {
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Supprimer ce tarif ?")) return;
        try {
            await api.delete(`/transport/tarifs/${id}`);
            fetchTarifs();
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Gestion des Tarifs</h1>
                    <p className="text-slate-500">Configurez les prix des abonnements par catégorie</p>
                </div>
                <button 
                    onClick={() => { setEditingItem({ typeAbonnement: 'MENSUEL', montant: 0 }); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nouveau Tarif</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-slate-400">Chargement...</div>
                ) : tarifs.map((t) => (
                    <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:ring-2 hover:ring-blue-500 transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <Tag className="w-6 h-6" />
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => { setEditingItem(t); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 capitalize mb-1">{t.typeAbonnement.toLowerCase()}</h3>
                        <p className="text-3xl font-black text-blue-600 mb-4">{t.montant} <span className="text-sm font-bold text-slate-400">DH</span></p>
                        <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                            <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-slate-500 italic">{t.description || "Aucune description fournie"}</p>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="bg-blue-600 h-2 w-full" />
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">{editingItem.id ? 'Modifier' : 'Ajouter'} un Tarif</h2>
                            <form onSubmit={handleSave} className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600">Type d'abonnement</span>
                                    <select 
                                        required
                                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editingItem.typeAbonnement}
                                        onChange={e => setEditingItem({...editingItem, typeAbonnement: e.target.value})}
                                    >
                                        <option value="MENSUEL">Mensuel</option>
                                        <option value="TRIMESTRIEL">Trimestriel</option>
                                        <option value="SEMESTRIEL">Semestriel</option>
                                        <option value="ANNUEL">Annuel</option>
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600">Montant (DH)</span>
                                    <input 
                                        type="number" required
                                        value={editingItem.montant || ''}
                                        onChange={e => setEditingItem({...editingItem, montant: e.target.value})}
                                        className="mt-1 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-600">Description</span>
                                    <textarea 
                                        value={editingItem.description || ''}
                                        onChange={e => setEditingItem({...editingItem, description: e.target.value})}
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

export default TarifManagementPage;
