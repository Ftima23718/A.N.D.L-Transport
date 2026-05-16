import React, { useState } from 'react';
import { QrCode, ShieldCheck, AlertCircle, RefreshCw, X, User, MapPin, Calendar, Clock } from 'lucide-react';
import api from '../services/api';
// Use a library for QR scanning if available, but for now we'll simulate with manual input
// as we don't have direct camera access through the agent easily. 
// In a real app, you'd use react-qr-reader or similar.

const QRScannerPage: React.FC = () => {
    const [qrValue, setQrValue] = useState('');
    const [scanning, setScanning] = useState(false);
    const [badgeData, setBadgeData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleScan = async (value: string) => {
        if (!value) return;
        setScanning(true);
        setError(null);
        try {
            const response = await api.get(`/badges/valider/${value}`);
            setBadgeData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Badge invalide ou expiré");
            setBadgeData(null);
        } finally {
            setScanning(false);
        }
    };

    const resetScanner = () => {
        setBadgeData(null);
        setError(null);
        setQrValue('');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Scanner de Badge</h1>
                <p className="text-slate-500">Validation en temps réel des accès étudiants</p>
            </div>

            {!badgeData && !error && (
                <div className="bg-white p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-6 transition-all hover:border-blue-300">
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center animate-pulse">
                        <QrCode className="w-12 h-12" />
                    </div>
                    <div className="text-center space-y-2">
                        <p className="font-bold text-slate-700 text-xl text-balance px-4">Placez le QR Code de l'étudiant face à la caméra</p>
                        <p className="text-sm text-slate-400">Ou saisissez le code manuellement ci-dessous pour le test</p>
                    </div>
                    <div className="w-full max-w-xs flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Code QR..."
                            value={qrValue}
                            onChange={(e) => setQrValue(e.target.value)}
                            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                            onClick={() => handleScan(qrValue)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                        >
                            Valider
                        </button>
                    </div>
                </div>
            )}

            {scanning && (
                <div className="flex flex-col items-center py-20 space-y-4">
                    <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-bold">Vérification du badge...</p>
                </div>
            )}

            {badgeData && (
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-emerald-100 overflow-hidden relative animate-in fade-in zoom-in duration-300">
                    <div className="bg-emerald-500 h-4 w-full" />
                    <div className="p-10">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck className="w-10 h-10" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Accès Autorisé</h2>
                                    <p className="text-emerald-600 font-bold">Badge valide jusqu'au {new Date(badgeData.dateExpiration).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button onClick={resetScanner} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors"><User className="w-6 h-6" /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Étudiant</p>
                                        <p className="text-lg font-bold text-slate-700">{badgeData.etudiantPrenom} {badgeData.etudiantNom}</p>
                                        <p className="text-xs text-slate-400 font-medium">#{badgeData.numeroEtudiant}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors"><MapPin className="w-6 h-6" /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Trajet Assigné</p>
                                        <p className="text-lg font-bold text-slate-700">{badgeData.ligneNom || 'Ligne non spécifiée'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                                <div className="flex items-center gap-2 text-emerald-700">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-bold">{badgeData.anneeScolaire}</span>
                                </div>
                                <div className="flex items-center gap-2 text-emerald-700">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-bold">Scan à {new Date().toLocaleTimeString()}</span>
                                </div>
                                <div className="pt-2 border-t border-emerald-100 uppercase text-[10px] font-black tracking-widest text-emerald-600">
                                    Identité vérifiée par système A.N.D.L
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={resetScanner}
                            className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                        >
                            Scanner le Suivant
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-rose-100 overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-rose-500 h-4 w-full" />
                    <div className="p-10 text-center space-y-6">
                        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
                            <AlertCircle className="w-12 h-12" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-800">Accès Refusé</h2>
                            <p className="text-rose-600 font-bold text-lg">{error}</p>
                        </div>
                        <button 
                            onClick={resetScanner}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 transition-all"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRScannerPage;
