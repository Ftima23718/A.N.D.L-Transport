import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Navigation, Clock } from 'lucide-react';
import api from '../services/api';

const TransportManagementPage: React.FC = () => {
    const [lignes, setLignes] = useState<any[]>([]);
    const [arrets, setArrets] = useState<any[]>([]);
    const [trajets, setTrajets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'lignes' | 'arrets' | 'trajets'>('lignes');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const fetchData = async () => {
        try {
            const [lRes, aRes, tRes] = await Promise.all([
                api.get('/transport/lignes'),
                api.get('/transport/arrets'),
                api.get('/transport/trajets')
            ]);
            setLignes(lRes.data);
            setArrets(aRes.data);
            setTrajets(tRes.data);
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
        try {
            await api.post(`/transport/${activeTab}`, editingItem);
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
                    onClick={() => { setEditingItem({}); setIsModalOpen(true); }}
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

            {/* Modal placeholder (to be refined) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Ajouter/Modifier {activeTab}</h2>
                        {/* Dynamic fields would go here */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-slate-600">Annuler</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-xl">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransportManagementPage;
