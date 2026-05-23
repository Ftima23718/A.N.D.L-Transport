import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bus, MapPin, Send, Loader2, CheckCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SoumissionInscription: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lignes, setLignes] = useState<any[]>([]);
  const [tarifs, setTarifs] = useState<any[]>([]);
  const [selectedLigne, setSelectedLigne] = useState('');
  const [selectedType, setSelectedType] = useState('MENSUEL');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lignesRes, tarifsRes] = await Promise.all([
          api.get('/transport/lignes'),
          api.get('/transport/tarifs')
        ]);

        setLignes(lignesRes.data || []);
        setTarifs(tarifsRes.data || []);
      } catch (err) {
        console.error('Erreur chargement données', err);
        setLignes([{ id: 1, nom: 'Ligne 1: Lkouirate - Centre' }, { id: 2, nom: 'Ligne 2: Lkouirate - Campus' }]);
        setTarifs([
          { typeAbonnement: 'MENSUEL', montant: 150 },
          { typeAbonnement: 'TRIMESTRIEL', montant: 400 },
          { typeAbonnement: 'ANNUEL', montant: 1400 }
        ]);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/inscriptions/soumettre', {
        typeAbonnement: selectedType,
        ligneId: selectedLigne
      });
      setSuccess(true);
      setTimeout(() => navigate('/etudiant/dashboard'), 2000);
    } catch (err) {
      alert("Erreur lors de la soumission");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Demande Soumise !</h2>
        <p className="text-slate-500 mt-2">Votre demande est en cours de traitement par l'administration.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Nouvelle Inscription</h1>
        <p className="text-slate-500 mt-1">Choisissez votre forfait et votre ligne de transport.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Bus className="w-4 h-4 text-blue-600" />
                Type d'abonnement
              </label>
              <div className="grid grid-cols-1 gap-3">
                {tarifs.map((t) => (
                  <label 
                    key={t.typeAbonnement}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedType === t.typeAbonnement ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="typeAbonnement" 
                      value={t.typeAbonnement} 
                      className="hidden"
                      onChange={() => setSelectedType(t.typeAbonnement)}
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-800">{t.typeAbonnement}</span>
                        <p className="text-xs text-slate-400">Paiement {t.typeAbonnement.toLowerCase()}</p>
                      </div>
                      <span className="text-lg font-black text-blue-600">{t.montant} DH</span>
                    </div>
                    {selectedType === t.typeAbonnement && (
                      <motion.div layoutId="outline" className="absolute -inset-0.5 border-2 border-blue-600 rounded-2xl pointer-events-none" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Ligne de transport
              </label>
              <select 
                required
                value={selectedLigne}
                onChange={(e) => setSelectedLigne(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
              >
                <option value="">Sélectionner une ligne</option>
                {lignes.map(l => <option key={l.id} value={l.id}>{l.nom}</option>)}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Soumettre ma demande</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="space-y-6">
           <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-4">
                 <Info className="w-5 h-5" />
                 Informations importantes
              </h3>
              <ul className="space-y-3 text-sm text-blue-700">
                 <li className="flex gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                    La validation de votre demande prend généralement 24h à 48h.
                 </li>
                 <li className="flex gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                    Un badge QR sera automatiquement généré après validation.
                 </li>
                 <li className="flex gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                    Le paiement doit être effectué auprès du trésorier de l'association.
                 </li>
              </ul>
           </div>

           <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="font-bold text-lg mb-2">Besoin d'aide ?</h3>
                 <p className="text-slate-400 text-sm mb-4">Contactez le support technique ou visitez notre bureau à Lkouirate.</p>
                 <a href="tel:0600000000" className="text-emerald-400 font-bold hover:underline text-sm">06 00 00 00 00</a>
               </div>
               <Bus className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 -rotate-12" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default SoumissionInscription;
