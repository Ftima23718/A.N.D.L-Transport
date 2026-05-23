import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Navigation, Clock } from 'lucide-react';
import api from '../services/api';

const TransportManagementPage: React.FC = () => {
    const [lignes, setLignes] = useState<any[]>([]);
    const [arrets, setArrets] = useState<any[]>([]);
    const [trajets, setTrajets] = useState<any[]>([]);
    const [buses, setBuses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'lignes' | 'arrets' | 'trajets'>('lignes');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const getEmptyItem = (tab: typeof activeTab) => {
        switch (tab) {
            case 'lignes':
                return { nom: '', description: '' };
            case 'arrets':
                return { nom: '', ligneId: '', latitude: '', longitude: '', ordre: 1 };
            case 'trajets':
                return { ligneId: '', busId: '', heureDepart: '06:00', heureArrivee: '07:00', joursSemaine: 'Lundi - Vendredi' };
            default:
                return {};
        }
    };

    const fetchData = async () => {
        try {
            const [lRes, aRes, tRes, bRes] = await Promise.all([
                api.get('/transport/lignes'),
                api.get('/transport/arrets'),
                api.get('/transport/trajets'),
                api.get('/transport/bus')
            ]);
            setLignes(lRes.data);
            setArrets(aRes.data);
            setTrajets(tRes.data);
            setBuses(bRes.data);
        } catch (err) {
            console.error('Erreur chargement transport', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (type: string, id: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet élément ?")) return;
        try {
            await api.delete(`/transport/${type}/${id}`);
            fetchData();
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        try {
            const payload = {
                ...editingItem,
                ligneId: editingItem.ligneId ? Number(editingItem.ligneId) : undefined,
                busId: editingItem.busId ? Number(editingItem.busId) : undefined,
                ordre: editingItem.ordre ? Number(editingItem.ordre) : undefined,
                latitude: editingItem.latitude ? Number(editingItem.latitude) : undefined,
                longitude: editingItem.longitude ? Number(editingItem.longitude) : undefined,
            };

            await api.post(`/transport/${activeTab}`, payload);
            setIsModalOpen(false);
            setEditingItem(null);
            fetchData();
        } catch (err) {
            alert("Erreur lors de l'enregistrement");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Gestion du Transport</h1>
                    <p className="text-slate-500">Gérez les lignes, les arrêts et les trajets du réseau</p>
                </div>
                <button 
                    onClick={() => { setEditingItem(getEmptyItem(activeTab)); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter {activeTab === 'lignes' ? 'une Ligne' : activeTab === 'arrets' ? 'un Arrêt' : 'un Trajet'}</span>
                </button>
            </div>

            <div className="flex gap-2 p-1 bg-slate-100 w-fit rounded-2xl">
                {(['lignes', 'arrets', 'trajets'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                            activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                {activeTab === 'lignes' && (
                                    <>
                                        <th className="px-6 py-4">Nom de la Ligne</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4">Arrêts</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </>
                                )}
                                {activeTab === 'arrets' && (
                                    <>
                                        <th className="px-6 py-4">Nom de l'Arrêt</th>
                                        <th className="px-6 py-4">Ligne</th>
                                        <th className="px-6 py-4">Position (Lat, Long)</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </>
                                )}
                                {activeTab === 'trajets' && (
                                    <>
                                        <th className="px-6 py-4">Ligne</th>
                                        <th className="px-6 py-4">Bus</th>
                                        <th className="px-6 py-4">Horaires</th>
                                        <th className="px-6 py-4">Jours</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Chargement...</td></tr>
                            ) : (
                                activeTab === 'lignes' ? lignes.map(l => (
                                    <tr key={l.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-5 flex items-center gap-3 font-bold text-slate-700">
                                            <Navigation className="w-5 h-5 text-blue-500" />
                                            {l.nom}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-500">{l.description}</td>
                                        <td className="px-6 py-5">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                                                {arrets.filter(a => a.ligneId === l.id).length} arrêts
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-2">
                                                <button onClick={() => {setEditingItem(l); setIsModalOpen(true);}} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete('lignes', l.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : activeTab === 'arrets' ? arrets.map(a => (
                                    <tr key={a.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-5 font-bold text-slate-700">{a.nom}</td>
                                        <td className="px-6 py-5 text-sm text-slate-500">
                                            {lignes.find(l => l.id === a.ligneId)?.nom || 'N/A'}
                                        </td>
                                        <td className="px-6 py-5 text-xs font-mono text-slate-400">
                                            {a.latitude}, {a.longitude}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-2">
                                                <button onClick={() => {setEditingItem(a); setIsModalOpen(true);}} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete('arrets', a.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : trajets.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-5 font-bold text-slate-700">
                                            {lignes.find(l => l.id === t.ligneId)?.nom || 'N/A'}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-500">Bus #{t.busId || 'Non assigné'}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                                {t.heureDepart} → {t.heureArrivee}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-bold text-slate-400 uppercase">{t.joursSemaine}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-2">
                                                <button onClick={() => {setEditingItem(t); setIsModalOpen(true);}} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete('trajets', t.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && editingItem && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Ajouter / Modifier {activeTab === 'lignes' ? 'une ligne' : activeTab === 'arrets' ? 'un arrêt' : 'un trajet'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">Fermer</button>
                        </div>
                        <form className="grid gap-4" onSubmit={handleSave}>
                            {activeTab === 'lignes' && (
                                <>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Nom de la ligne</span>
                                        <input
                                            type="text"
                                            value={editingItem.nom || ''}
                                            onChange={e => setEditingItem({...editingItem, nom: e.target.value})}
                                            className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            required
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Description</span>
                                        <textarea
                                            value={editingItem.description || ''}
                                            onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                                            className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                                        />
                                    </label>
                                </>
                            )}
                            {activeTab === 'arrets' && (
                                <>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Nom de l'arrêt</span>
                                        <input
                                            type="text"
                                            value={editingItem.nom || ''}
                                            onChange={e => setEditingItem({...editingItem, nom: e.target.value})}
                                            className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            required
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Ligne</span>
                                        <select
                                            value={editingItem.ligneId || ''}
                                            onChange={e => setEditingItem({...editingItem, ligneId: e.target.value})}
                                            className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            required
                                        >
                                            <option value="">Sélectionnez une ligne</option>
                                            {lignes.map(l => (
                                                <option key={l.id} value={l.id}>{l.nom}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="block">
                                            <span className="text-sm font-semibold text-slate-600">Latitude</span>
                                            <input
                                                type="number"
                                                step="0.000001"
                                                value={editingItem.latitude || ''}
                                                onChange={e => setEditingItem({...editingItem, latitude: e.target.value})}
                                                className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-semibold text-slate-600">Longitude</span>
                                            <input
                                                type="number"
                                                step="0.000001"
                                                value={editingItem.longitude || ''}
                                                onChange={e => setEditingItem({...editingItem, longitude: e.target.value})}
                                                className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </label>
                                    </div>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Ordre</span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={editingItem.ordre || 1}
                                            onChange={e => setEditingItem({...editingItem, ordre: Number(e.target.value)})}
                                            className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </label>
                                </>
                            )}
                            {activeTab === 'trajets' && (
                                <>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Ligne</span>
                                        <select
                                            value={editingItem.ligneId || ''}
                                            onChange={e => setEditingItem({...editingItem, ligneId: e.target.value})}
                                            className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                            required
                                        >
                                            <option value="">Sélectionnez une ligne</option>
                                            {lignes.map(l => (
                                                <option key={l.id} value={l.id}>{l.nom}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Bus</span>
                                        <select
                                            value={editingItem.busId || ''}
                                            onChange={e => setEditingItem({...editingItem, busId: e.target.value})}
                                            className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="">Bus non assigné</option>
                                            {buses.map(bus => (
                                                <option key={bus.id} value={bus.id}>#{bus.id} - {bus.matricule || bus.modele || 'Bus'}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="block">
                                            <span className="text-sm font-semibold text-slate-600">Heure de départ</span>
                                            <input
                                                type="time"
                                                value={editingItem.heureDepart || '06:00'}
                                                onChange={e => setEditingItem({...editingItem, heureDepart: e.target.value})}
                                                className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                required
                                            />
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-semibold text-slate-600">Heure d'arrivée</span>
                                            <input
                                                type="time"
                                                value={editingItem.heureArrivee || '07:00'}
                                                onChange={e => setEditingItem({...editingItem, heureArrivee: e.target.value})}
                                                className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                required
                                            />
                                        </label>
                                    </div>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-600">Jours de circulation</span>
                                        <input
                                            type="text"
                                            value={editingItem.joursSemaine || ''}
                                            onChange={e => setEditingItem({...editingItem, joursSemaine: e.target.value})}
                                            className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </label>
                                </>
                            )}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50">Annuler</button>
                                <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransportManagementPage;
