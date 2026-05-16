import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Bus as BusIcon, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const BusChauffeursPage: React.FC = () => {
    const [buses, setBuses] = useState<any[]>([]);
    const [chauffeurs, setChauffeurs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'buses' | 'chauffeurs'>('buses');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const fetchData = async () => {
        try {
            const [bRes, cRes] = await Promise.all([
                api.get('/transport/bus'),
                api.get('/transport/chauffeurs')
            ]);
            setBuses(bRes.data);
            setChauffeurs(cRes.data);
        } catch (err) {
            console.error('Erreur chargement données', err);
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Flotte & Personnel</h1>
                    <p className="text-slate-500">Gérez vos bus et vos chauffeurs de transport</p>
                </div>
                <button 
                    onClick={() => { setEditingItem({}); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter {activeTab === 'buses' ? 'un Bus' : 'un Chauffeur'}</span>
                </button>
            </div>

            <div className="flex gap-2 p-1 bg-slate-100 w-fit rounded-2xl">
                {(['buses', 'chauffeurs'] as const).map(tab => (
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
                                {activeTab === 'buses' ? (
                                    <>
                                        <th className="px-6 py-4">Immatriculation</th>
                                        <th className="px-6 py-4">Modèle</th>
                                        <th className="px-6 py-4">Capacité</th>
                                        <th className="px-6 py-4">Statut</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-6 py-4">Chauffeur</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">N° Permis</th>
                                        <th className="px-6 py-4">Statut</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Chargement...</td></tr>
                            ) : (
                                activeTab === 'buses' ? buses.map(b => (
                                    <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-5 flex items-center gap-3 font-bold text-slate-700">
                                            <BusIcon className="w-5 h-5 text-slate-400" />
                                            {b.immatriculation}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-500">{b.modele}</td>
                                        <td className="px-6 py-5 text-sm font-semibold">{b.capacite} places</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                b.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                {b.actif ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-2">
                                                <button onClick={() => {setEditingItem(b); setIsModalOpen(true);}} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete('bus', b.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : chauffeurs.map(c => (
                                    <tr key={c.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-5 flex items-center gap-3">
                                            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">{c.prenom[0]}{c.nom[0]}</div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{c.prenom} {c.nom}</p>
                                                <p className="text-xs text-slate-400">ID: #{c.id}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-slate-600">{c.email}</p>
                                            <p className="text-xs text-slate-400">{c.telephone}</p>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-mono font-bold text-slate-500">{c.numeroPermis}</td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-2">
                                                <button onClick={() => {setEditingItem(c); setIsModalOpen(true);}} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete('chauffeurs', c.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Ajouter/Modifier {activeTab}</h2>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-slate-600">Annuler</button>
                            <button className="px-6 py-2 bg-blue-600 text-white rounded-xl">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusChauffeursPage;
