import React, { useEffect, useState } from 'react';
import { MapPin, Building2, Bus, Phone, Mail, Users, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

interface Etablissement {
    id: number;
    nom: string;
    adresse: string;
    ville: string;
    telephone?: string;
    responsable?: string;
    niveauScolaire?: string;
    nombreEtudiants: number;
    nombreTransports: number;
    latitude?: number;
    longitude?: number;
}

interface Bus {
    id: number;
    matricule: string;
    nom: string;
    etablissementNom?: string;
    etablissementId?: number;
    capacite: number;
    statut: string;
}

const CarteInteractivePage: React.FC = () => {
    const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
    const [buses, setBuses] = useState<Bus[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEtab, setSelectedEtab] = useState<Etablissement | null>(null);
    const [filterNiveau, setFilterNiveau] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('map');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [etabRes, busRes] = await Promise.all([
                api.get('/etablissements'),
                api.get('/bus')
            ]);
            setEtablissements(etabRes.data);
            setBuses(busRes.data);
        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredEtablissements = etablissements.filter(e =>
        (e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
         e.ville.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!filterNiveau || e.niveauScolaire === filterNiveau)
    );

    const getColorByLevel = (level?: string) => {
        switch(level) {
            case 'Primaire': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'Collège': return 'bg-purple-100 text-purple-700 border-purple-300';
            case 'Lycée': return 'bg-green-100 text-green-700 border-green-300';
            default: return 'bg-slate-100 text-slate-700 border-slate-300';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">Chargement de la carte...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-slate-800">Carte Interactive</h1>
                <p className="text-slate-500 mt-1 font-medium">Visualisez les établissements et les trajets en temps réel</p>
            </div>

            {/* Controls */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <div className="flex gap-2 mb-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setViewMode('map')}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                            viewMode === 'map' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        Carte
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                            viewMode === 'list' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        Liste
                    </motion.button>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
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
            </div>

            {/* Map/List View */}
            {viewMode === 'map' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden h-[600px] relative">
                            {/* Simplified Map Display */}
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-50 flex flex-col items-center justify-center">
                                <MapPin className="w-16 h-16 text-blue-300 mb-4" />
                                <p className="text-slate-500 font-medium text-center">Carte interactive</p>
                                <p className="text-slate-400 text-sm mt-2">Intégration Leaflet / Google Maps disponible</p>
                                <div className="mt-8 text-center">
                                    <p className="text-xs text-slate-400 mb-4">Établissements sur la carte:</p>
                                    <div className="flex gap-4 justify-center flex-wrap">
                                        {filteredEtablissements.map(e => (
                                            <motion.div
                                                key={e.id}
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => setSelectedEtab(e)}
                                                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-200 transition-colors"
                                            >
                                                {e.nom}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Map controls overlay */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
                                    <span className="text-lg">+</span>
                                </button>
                                <button className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
                                    <span className="text-lg">−</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 h-[600px] overflow-y-auto">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Détails</h3>
                        
                        {selectedEtab ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div>
                                    <div className={`px-3 py-1 rounded-lg text-xs font-bold w-fit mb-2 border ${getColorByLevel(selectedEtab.niveauScolaire)}`}>
                                        {selectedEtab.niveauScolaire || 'Non spécifié'}
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-800">{selectedEtab.nom}</h4>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    {selectedEtab.adresse && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-slate-400 font-semibold">ADRESSE</p>
                                                <p className="text-sm text-slate-700">{selectedEtab.adresse}</p>
                                                <p className="text-sm font-semibold text-slate-700">{selectedEtab.ville}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedEtab.telephone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-slate-400 font-semibold">TÉLÉPHONE</p>
                                                <a href={`tel:${selectedEtab.telephone}`} className="text-sm text-blue-600 hover:text-blue-700">
                                                    {selectedEtab.telephone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {selectedEtab.responsable && (
                                        <div className="flex items-center gap-3">
                                            <Building2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-slate-400 font-semibold">RESPONSABLE</p>
                                                <p className="text-sm text-slate-700">{selectedEtab.responsable}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3 pt-3">
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <p className="text-xs text-blue-600 font-bold">ÉTUDIANTS</p>
                                            <p className="text-2xl font-black text-blue-700">{selectedEtab.nombreEtudiants}</p>
                                        </div>
                                        <div className="bg-orange-50 p-3 rounded-lg">
                                            <p className="text-xs text-orange-600 font-bold">TRANSPORTS</p>
                                            <p className="text-2xl font-black text-orange-700">{selectedEtab.nombreTransports}</p>
                                        </div>
                                    </div>

                                    {/* Transports associés */}
                                    <div className="pt-4">
                                        <p className="text-sm font-bold text-slate-800 mb-3">Transports Associés</p>
                                        <div className="space-y-2">
                                            {buses.filter(b => b.etablissementId === selectedEtab.id).map(bus => (
                                                <div key={bus.id} className="p-2 bg-slate-50 rounded-lg text-sm">
                                                    <p className="font-semibold text-slate-700">{bus.nom}</p>
                                                    <p className="text-xs text-slate-500">{bus.matricule} • {bus.capacite} places</p>
                                                </div>
                                            ))}
                                            {buses.filter(b => b.etablissementId === selectedEtab.id).length === 0 && (
                                                <p className="text-xs text-slate-400">Aucun transport</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center py-12">
                                <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-400 text-sm">Sélectionnez un établissement</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* List View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEtablissements.map((etab) => (
                        <motion.div
                            key={etab.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedEtab(etab)}
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                        >
                            <div className={`px-3 py-1 rounded-lg text-xs font-bold w-fit mb-3 border ${getColorByLevel(etab.niveauScolaire)}`}>
                                {etab.niveauScolaire}
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                {etab.nom}
                            </h3>

                            <div className="space-y-2 mt-4 text-sm text-slate-600">
                                {etab.ville && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span>{etab.ville}</span>
                                    </div>
                                )}
                                {etab.telephone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <span>{etab.telephone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-slate-800">{etab.nombreEtudiants}</p>
                                    <p className="text-xs text-slate-400 font-medium">Étudiants</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-slate-800">{etab.nombreTransports}</p>
                                    <p className="text-xs text-slate-400 font-medium">Transports</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {filteredEtablissements.length === 0 && (
                <div className="text-center py-12">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Aucun établissement trouvé</p>
                </div>
            )}
        </div>
    );
};

export default CarteInteractivePage;
