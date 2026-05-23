// src/pages/EtudiantDashboard.tsx
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode, Bus, Clock, CreditCard, Download, CheckCircle,
  MapPin, Calendar, Eye, Bell, User, LogOut, ChevronRight,
  Navigation, Award, AlertCircle, LayoutDashboard, TrendingUp,
  Phone, Mail, Map, Circle, ChevronDown, FileText, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

// ============================================
// INTERFACES
// ============================================

interface BadgeData {
  id: number;
  codeQr: string;
  dateExpiration: string;
  estValide: boolean;
  qrCodeBase64?: string;
  numeroEtudiant: string;
  etudiantNom: string;
  etudiantPrenom: string;
  etablissement: string;
  niveauScolaire: string;
  anneeScolaire: string;
  ligneNom: string;
  photoUrl?: string;
  telephone?: string;
}

interface Paiement {
  id: number;
  periode: string;
  montant: number;
  datePaiement: string;
  statut: string;
  methodePaiement: string;
  typeAbonnement: string;
  factureUrl?: string;
}

interface ItineraireArret {
  id: number;
  nom: string;
  latitude: number;
  longitude: number;
  ordre: number;
  isDepart: boolean;
  isDestination: boolean;
}

interface ProchainTrajet {
  heureDepart: string;
  heureArrivee: string;
  minutesRestantes: string;
  busMatricule: string;
}

interface Itineraire {
  ligneId: number;
  ligneNom: string;
  ligneDescription: string;
  arrets: ItineraireArret[];
  prochainTrajet: ProchainTrajet | null;
}

interface Inscription {
  id: number;
  typeAbonnement: string;
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE';
  dateDebut: string;
  dateFin: string;
  ligneNom: string;
  motifRejet?: string;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

const EtudiantDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [badge, setBadge] = useState<BadgeData | null>(null);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [itineraire, setItineraire] = useState<Itineraire | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [downloadingBadge, setDownloadingBadge] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // FETCH DATA
  // ============================================

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Récupérer les inscriptions
        const inscriptionsRes = await api.get('/inscriptions/ma-liste');
        const userInscriptions = inscriptionsRes.data || [];
        setInscriptions(userInscriptions);

        const validInscription = userInscriptions.find((i: Inscription) => i.statut === 'VALIDEE');

        // 2. Récupérer le badge si inscription validée
        if (validInscription) {
          try {
            const badgeRes = await api.get(`/badges/inscription/${validInscription.id}`);
            setBadge(badgeRes.data);
          } catch (err) {
            console.log('Aucun badge trouvé');
          }

          // 3. Récupérer l'itinéraire
          try {
            const itineraireRes = await api.get('/inscriptions/mon-itineraire');
            setItineraire(itineraireRes.data);
          } catch (err) {
            console.log('Erreur chargement itinéraire');
          }
        }

        // 4. Récupérer les paiements
        try {
          const paiementsRes = await api.get('/paiements/mes-paiements');
          setPaiements(paiementsRes.data || []);
        } catch (err) {
          console.log('Erreur chargement paiements');
        }

      } catch (err) {
        console.error('Erreur chargement dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ============================================
  // HANDLERS
  // ============================================

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleDownloadBadge = async () => {
    if (!badge) return;
    setDownloadingBadge(true);
    try {
      const response = await api.get(`/badges/${badge.id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `badge_${badge.numeroEtudiant}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erreur téléchargement badge:', err);
      alert('Impossible de télécharger le badge');
    } finally {
      setDownloadingBadge(false);
    }
  };

  const handleViewReceipt = async (factureId: number) => {
    try {
      const response = await api.get(`/factures/${factureId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, '_blank');
    } catch (err) {
      console.error('Erreur visualisation reçu:', err);
      alert('Impossible de visualiser le reçu');
    }
  };

  const getStatutStep = (statut: string): number => {
    switch(statut) {
      case 'EN_ATTENTE': return 1;
      case 'VALIDEE': return 3;
      case 'REJETEE': return 0;
      default: return 0;
    }
  };

  const getStatutLabel = (statut: string): string => {
    switch(statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'VALIDEE': return 'Validée';
      case 'REJETEE': return 'Rejetée';
      default: return statut;
    }
  };

  const getStatutColor = (statut: string): string => {
    switch(statut) {
      case 'EN_ATTENTE': return 'text-amber-600 bg-amber-50';
      case 'VALIDEE': return 'text-emerald-600 bg-emerald-50';
      case 'REJETEE': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { id: 'badge', icon: QrCode, label: 'Mon Badge' },
    { id: 'paiements', icon: CreditCard, label: 'Paiements' },
    { id: 'profil', icon: User, label: 'Profil' },
  ];

  const currentInscription = inscriptions.find(i => i.statut === 'VALIDEE') || inscriptions[0];
  const statutStep = currentInscription ? getStatutStep(currentInscription.statut) : 0;

  // ============================================
  // RENDU
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-800">Cadi Ayyad</h1>
              <p className="text-xs text-slate-500">University Transport</p>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              {badge?.photoUrl ? (
                <img src={badge.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {user?.prenom?.[0]}{user?.nom?.[0]}
                </span>
              )}
            </div>
            <h3 className="font-bold text-slate-800">{user?.prenom} {user?.nom}</h3>
            <p className="text-xs text-slate-500">Étudiant • {badge?.numeroEtudiant || 'N° à venir'}</p>
            <div className="mt-3 flex justify-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatutColor(currentInscription?.statut || '')}`}>
                {getStatutLabel(currentInscription?.statut || '')}
              </span>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'profil') {
                  navigate('/etudiant/profil');
                } else {
                  setActiveTab(item.id);
                }
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${
                activeTab === item.id ? 'translate-x-1' : ''
              }`} />
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-80 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              {activeTab === 'dashboard' && 'Tableau de bord'}
              {activeTab === 'badge' && 'Mon Badge Numérique'}
              {activeTab === 'paiements' && 'Mes Paiements'}
            </h1>
            <p className="text-slate-500 mt-1">
              {activeTab === 'dashboard' && 'Bienvenue dans votre espace étudiant'}
              {activeTab === 'badge' && 'Présentez ce QR code à chaque montée'}
              {activeTab === 'paiements' && 'Historique de vos transactions'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* ============================================ */}
            {/* DASHBOARD TAB */}
            {/* ============================================ */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* === STATUT STEPPER === */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Statut de mon inscription
                  </h2>

                  <div className="relative">
                    {/* Barre de progression */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 rounded-full">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${(statutStep / 3) * 100}%` }}
                      />
                    </div>

                    {/* Étapes */}
                    <div className="relative flex justify-between">
                      {[
                        { step: 0, label: 'Soumis', icon: FileText },
                        { step: 1, label: 'En traitement', icon: Clock },
                        { step: 2, label: 'Validée', icon: CheckCircle },
                        { step: 3, label: 'Active', icon: Shield }
                      ].map((etape) => (
                        <div key={etape.step} className="flex flex-col items-center">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all
                            ${statutStep >= etape.step
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                              : 'bg-slate-100 text-slate-400'}
                          `}>
                            {statutStep > etape.step ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <etape.icon className="w-5 h-5" />
                            )}
                          </div>
                          <p className={`text-xs font-medium mt-2 ${
                            statutStep >= etape.step ? 'text-blue-600' : 'text-slate-400'
                          }`}>
                            {etape.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {currentInscription?.statut === 'REJETEE' && currentInscription.motifRejet && (
                    <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100">
                      <p className="text-sm text-red-700 font-medium">Motif du rejet :</p>
                      <p className="text-sm text-red-600 mt-1">{currentInscription.motifRejet}</p>
                    </div>
                  )}
                </div>

                {/* === MON ITINÉRAIRE AVEC MAP === */}
                {itineraire && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Navigation className="w-6 h-6 text-blue-600" />
                        Mon Itinéraire
                      </h2>
                      <p className="text-sm text-slate-500">{itineraire.ligneNom}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      {/* Google Maps */}
                      <div className="h-80 bg-slate-100 relative">
                        {itineraire.arrets.length > 0 && (
                          <iframe
                            title="Google Maps"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            src={`https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY&origin=${itineraire.arrets[0].latitude},${itineraire.arrets[0].longitude}&destination=${itineraire.arrets[itineraire.arrets.length-1].latitude},${itineraire.arrets[itineraire.arrets.length-1].longitude}&mode=driving`}
                          />
                        )}
                      </div>

                      {/* Liste des arrêts */}
                      <div className="p-6 bg-slate-50">
                        <div className="space-y-4">
                          {itineraire.arrets.map((arret, idx) => (
                            <div key={arret.id} className="flex items-start gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`
                                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                  ${arret.isDepart ? 'bg-emerald-500 text-white' :
                                    arret.isDestination ? 'bg-red-500 text-white' :
                                    'bg-white border-2 border-blue-400 text-blue-600'}
                                `}>
                                  {arret.isDepart ? 'D' : arret.isDestination ? 'A' : idx + 1}
                                </div>
                                {idx < itineraire.arrets.length - 1 && (
                                  <div className="w-0.5 h-8 bg-slate-300 mt-1" />
                                )}
                              </div>
                              <div className="flex-1 pb-4">
                                <p className="font-semibold text-slate-800">{arret.nom}</p>
                                <p className="text-xs text-slate-400">
                                  {arret.isDepart ? 'Point de départ' :
                                   arret.isDestination ? 'Destination' : `Arrêt ${arret.ordre}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Prochain bus */}
                        {itineraire.prochainTrajet && (
                          <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">Prochain car dans</span>
                            </div>
                            <p className="text-3xl font-bold">{itineraire.prochainTrajet.minutesRestantes} min</p>
                            <p className="text-sm mt-1">
                              {itineraire.prochainTrajet.heureDepart} - Bus {itineraire.prochainTrajet.busMatricule}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ============================================ */}
            {/* BADGE TAB - CARTE STYLÉE */}
            {/* ============================================ */}
            {activeTab === 'badge' && (
              <motion.div
                key="badge"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* CARTE BADGE STYLÉE */}
                <div className="relative">
                  {/* Carte principale */}
                  <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header avec logo */}
                    <div className="bg-blue-950/50 p-6 border-b border-white/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur">
                              <Bus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-white/60 text-xs font-medium">Cadi Ayyad University</p>
                              <p className="text-white text-sm font-bold">Transport Service</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white/50 text-[10px] uppercase tracking-wider">Badge N°</p>
                          <p className="text-white font-mono text-sm font-bold">{badge?.numeroEtudiant || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Corps de la carte */}
                    <div className="p-6">
                      <div className="flex gap-6">
                        {/* Photo étudiant */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center overflow-hidden border-2 border-white/20">
                            {badge?.photoUrl ? (
                              <img src={badge.photoUrl} alt="Student" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-center">
                                <User className="w-8 h-8 text-white/40 mx-auto" />
                                <span className="text-white/40 text-xs">Photo</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Infos étudiant */}
                        <div className="flex-1 space-y-2">
                          <div>
                            <p className="text-white/50 text-[10px] uppercase tracking-wider">Nom complet</p>
                            <p className="text-white font-semibold text-base">
                              {badge?.etudiantNom} {badge?.etudiantPrenom}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-white/50 text-[10px] uppercase tracking-wider">Niveau</p>
                              <p className="text-white text-sm font-medium">{badge?.niveauScolaire || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-white/50 text-[10px] uppercase tracking-wider">Année</p>
                              <p className="text-white text-sm font-medium">{badge?.anneeScolaire || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Infos ligne et validité */}
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur">
                          <p className="text-white/50 text-[10px] uppercase tracking-wider">Ligne</p>
                          <p className="text-white font-semibold text-sm">{badge?.ligneNom || 'Non assignée'}</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur">
                          <p className="text-white/50 text-[10px] uppercase tracking-wider">Validité</p>
                          <div className="flex items-center gap-2">
                            {badge?.estValide ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-400" />
                            )}
                            <p className="text-white font-semibold text-sm">
                              {badge?.estValide ? 'Actif' : 'Expiré'}
                            </p>
                          </div>
                          <p className="text-white/60 text-xs mt-1">
                            jusqu'au {badge?.dateExpiration ? new Date(badge.dateExpiration).toLocaleDateString('fr-FR') : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="mt-6 flex justify-between items-end">
                        <div>
                          <p className="text-white/50 text-[10px] uppercase tracking-wider">Téléphone</p>
                          <p className="text-white text-sm">{badge?.telephone || 'Non renseigné'}</p>
                        </div>
                        <div className="bg-white rounded-xl p-2 w-20 h-20 flex items-center justify-center">
                          {badge?.qrCodeBase64 ? (
                            <img
                              src={`data:image/png;base64,${badge.qrCodeBase64}`}
                              alt="QR Code"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <QrCode className="w-12 h-12 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-blue-950/50 p-4 text-center border-t border-white/10">
                      <p className="text-white/40 text-[10px] tracking-wider">
                        Présentez ce badge à chaque montée • Valable pour l'année scolaire en cours
                      </p>
                    </div>
                  </div>

                  {/* Bouton téléchargement */}
                  <button
                    onClick={handleDownloadBadge}
                    disabled={downloadingBadge}
                    className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    {downloadingBadge ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    Télécharger le Badge (PDF)
                  </button>
                </div>

                {/* Side info */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="font-bold text-emerald-800 mb-2">📌 Comment utiliser votre badge ?</h3>
                    <ul className="space-y-2 text-sm text-emerald-700">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Présentez le QR code au chauffeur avant la montée
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Le badge est valable pour toute l'année scolaire
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Téléchargez une copie PDF en cas de besoin
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      Informations importantes
                    </h3>
                    <div className="space-y-3 text-sm">
                      <p className="text-slate-600">
                        🔹 Le badge est personnel et non transférable<br />
                        🔹 En cas de perte, contactez l'administration<br />
                        🔹 Renouvellement automatique chaque année
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============================================ */}
            {/* PAIEMENTS TAB - AVEC VRAIES DONNÉES */}
            {/* ============================================ */}
            {activeTab === 'paiements' && (
              <motion.div
                key="paiements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-800">Historique des paiements</h2>
                  <p className="text-sm text-slate-500">
                    Abonnement {currentInscription?.typeAbonnement || 'Annuel'}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Période</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Montant</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Méthode</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Statut</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paiements.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                            Aucun paiement enregistré
                          </td>
                        </tr>
                      ) : (
                        paiements.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-800">{p.periode}</td>
                            <td className="px-6 py-4 font-semibold text-emerald-600">{p.montant.toLocaleString()} DH</td>
                            <td className="px-6 py-4 text-slate-600">
                              {new Date(p.datePaiement).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs text-slate-500 uppercase">{p.methodePaiement}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                                <CheckCircle className="w-3 h-3" />
                                Payé
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => p.factureUrl && handleViewReceipt(p.id)}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                Voir Reçu
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// Import manquants
import { X, Menu, Loader2 } from 'lucide-react';

export default EtudiantDashboard;