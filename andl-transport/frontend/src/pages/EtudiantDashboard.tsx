import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Bus, Clock, CreditCard, ExternalLink, ShieldCheck, Download, Check, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EtudiantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [badge, setBadge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        console.log('Fetching inscriptions for user:', user?.email);
        
        const response = await api.get('/inscriptions/ma-liste');
        console.log('Inscriptions response:', response.data);
        
        setInscriptions(response.data || []);
        
        const validInsc = (response.data || []).find((i: any) => i.statut === 'VALIDEE');
        if (validInsc) {
          console.log('Fetching badge for inscription:', validInsc.id);
          const badgeRes = await api.get(`/badges/inscription/${validInsc.id}`);
          console.log('Badge response:', badgeRes.data);
          setBadge(badgeRes.data);
        } else {
          console.log('No validated inscription found');
          setBadge(null);
        }
      } catch (err: any) {
        console.error('Erreur chargement espace étudiant:', err);
        setError(err.response?.data?.message || err.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.email]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-semibold">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 pb-12">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-rose-900 mb-1">Erreur de chargement</h3>
            <p className="text-rose-700 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Impossible de charger votre profil. Veuillez vous reconnecter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Espace Étudiant</h1>
          <p className="text-slate-500">Bienvenue, {user?.prenom} ! Voici l'état de votre abonnement.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
           <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
             <ShieldCheck className="w-5 h-5" />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statut Compte</p>
             <p className="text-sm font-bold text-emerald-600">ACTIF</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Badge Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
            
            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <QrCode className="w-6 h-6 text-blue-600" />
              Badge Transport
            </h2>

            {badge ? (
              <div className="flex flex-col items-center">
                <div className="p-4 bg-white border-2 border-slate-50 rounded-3xl shadow-inner mb-6 relative group-hover:rotate-1 transition-transform">
                  <img 
                    src={`data:image/png;base64,${badge.qrCodeBase64}`} 
                    alt="QR Code" 
                    className="w-48 h-48 rendering-pixelated"
                  />
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors rounded-3xl" />
                </div>
                
                <div className="w-full space-y-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">{badge.etudiantPrenom} {badge.etudiantNom}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {badge.numeroEtudiant}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-4 border-t border-slate-50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Expiration</span>
                      <span className="font-bold text-slate-700">{new Date(badge.dateExpiration).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Ligne</span>
                      <span className="font-bold text-blue-600">{badge.ligneNom || 'Non assignée'}</span>
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-wide mt-4 hover:bg-black transition-all">
                    <Download className="w-4 h-4" />
                    Télécharger PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                  <QrCode className="w-10 h-10" />
                </div>
                <p className="text-slate-500 font-medium">Votre badge sera généré une fois votre inscription validée.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Status and History */}
        <div className="lg:col-span-2 space-y-8">
          {/* Latest Subscription Status */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Bus className="w-6 h-6 text-emerald-500" />
              État de l'Abonnement
            </h2>

            {inscriptions.length > 0 ? (
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-500" />
                   </div>
                   <div>
                     <p className="text-sm text-slate-500">Demande en cours</p>
                     <p className="text-lg font-bold text-slate-800">{inscriptions[0].typeAbonnement}</p>
                   </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      inscriptions[0].statut === 'VALIDEE' ? 'bg-emerald-500 text-white' :
                      inscriptions[0].statut === 'REJETEE' ? 'bg-rose-500 text-white' :
                      'bg-amber-100 text-amber-700'
                   }`}>
                     {inscriptions[0].statut}
                   </span>
                   <p className="text-[10px] text-slate-400 mt-2">Dernière mise à jour: {new Date(inscriptions[0].dateCreation).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 mb-6 font-medium">Vous n'avez pas encore d'abonnement actif pour cette période.</p>
                <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 mx-auto">
                   <ExternalLink className="w-5 h-5" />
                   S'abonner maintenant
                </button>
              </div>
            )}
          </div>

          {/* Payment History / Next Payment */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
             <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-blue-600" />
              Paiements & Facturation
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white text-emerald-600 rounded-xl flex items-center justify-center">
                     <Check className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="font-bold text-slate-800 text-sm">Octobre 2024</p>
                     <p className="text-xs text-slate-500">Abonnement Mensuel</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-bold text-emerald-600">150.00 DH</p>
                   <p className="text-[10px] text-slate-400 uppercase font-black">Payé</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtudiantDashboard;
