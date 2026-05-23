// src/pages/ProfilUtilisateur.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Calendar, Camera, Save, Lock,
  Bell, Shield, Globe, Moon, Sun, CreditCard, History,
  ChevronRight, CheckCircle, AlertCircle, Loader2, Edit2,
  Eye, EyeOff, Smartphone, Languages, LogOut, Trash2, X,
  Home, TrendingUp, Award, QrCode, Bus, Navigation
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface UtilisateurProfile {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateNaissance: string;
  photoProfil?: string;
  niveauScolaire: string;
  etablissementNom: string;
  numeroEtudiant: string;
  dateInscription: string;
  actif: boolean;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    langue: 'fr' | 'ar' | 'en';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      paiements: boolean;
      transport: boolean;
      promo: boolean;
    };
  };
}

interface Notification {
  id: number;
  titre: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string;
  lu: boolean;
  action?: string;
}

const ProfilUtilisateur: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UtilisateurProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profil' | 'parametres' | 'notifications' | 'securite'>('profil');
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState<Partial<UtilisateurProfile>>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/utilisateur/profil');
      setProfile(response.data);
      setFormData(response.data);
    } catch (err) {
      console.error('Erreur chargement profil:', err);
      // Données mockées pour démo
      const mockProfile: UtilisateurProfile = {
        id: 1,
        nom: user?.nom || 'Benali',
        prenom: user?.prenom || 'Nasira',
        email: user?.email || 'nasira.benali@example.com',
        telephone: '06 12 34 56 78',
        adresse: 'Rue 123, Quartier, Lkouirate',
        dateNaissance: '2000-01-01',
        niveauScolaire: 'Master 2',
        etablissementNom: 'Faculté des Sciences',
        numeroEtudiant: 'E12345678',
        dateInscription: '2024-09-01',
        actif: true,
        preferences: {
          theme: 'light',
          langue: 'fr',
          notifications: {
            email: true,
            sms: false,
            push: true,
            paiements: true,
            transport: true,
            promo: false
          }
        }
      };
      setProfile(mockProfile);
      setFormData(mockProfile);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (err) {
      setNotifications([
        {
          id: 1,
          titre: 'Paiement reçu',
          message: 'Votre paiement du mois d\'octobre a été confirmé',
          type: 'success',
          date: new Date().toISOString(),
          lu: false
        },
        {
          id: 2,
          titre: 'Horaire modifié',
          message: 'Le bus de 08:30 passera à 08:45 demain',
          type: 'warning',
          date: new Date(Date.now() - 86400000).toISOString(),
          lu: false
        },
        {
          id: 3,
          titre: 'Bienvenue sur ANDL Transport',
          message: 'Votre compte a été créé avec succès',
          type: 'info',
          date: new Date(Date.now() - 172800000).toISOString(),
          lu: true
        }
      ]);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('La photo ne doit pas dépasser 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        setSaving(true);
        await api.post('/utilisateur/photo', { photo: base64String });
        setProfile(prev => prev ? { ...prev, photoProfil: base64String } : null);
        setSuccessMessage('Photo mise à jour avec succès');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setErrorMessage('Erreur lors de l\'upload');
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/utilisateur/profil', formData);
      setProfile(prev => prev ? { ...prev, ...formData } : null);
      setEditMode(false);
      setSuccessMessage('Profil mis à jour avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setErrorMessage('Le mot de passe doit avoir au moins 6 caractères');
      return;
    }

    setSaving(true);
    try {
      await api.post('/utilisateur/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccessMessage('Mot de passe modifié avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Mot de passe actuel incorrect');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, lu: true } : n)
      );
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications(prev =>
        prev.map(n => ({ ...n, lu: true }))
      );
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const updatePreference = async (key: string, value: any) => {
    if (!profile) return;
    let newPreferences = { ...profile.preferences };

    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      newPreferences = {
        ...newPreferences,
        [parent]: {
          ...newPreferences[parent as keyof typeof newPreferences],
          [child]: value
        }
      };
    } else {
      newPreferences = { ...newPreferences, [key]: value };
    }

    try {
      await api.put('/utilisateur/preferences', newPreferences);
      setProfile({ ...profile, preferences: newPreferences });
      setSuccessMessage('Préférence mise à jour');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      setErrorMessage('Erreur lors de la mise à jour');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-semibold flex items-center gap-2 shadow-lg"
          >
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold flex items-center gap-2 shadow-lg"
          >
            <AlertCircle className="w-5 h-5" />
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Mon Profil</h1>
        <p className="text-slate-500 mt-1">Gérez vos informations personnelles et préférences</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'profil', label: 'Profil', icon: User },
          { id: 'parametres', label: 'Paramètres', icon: Settings },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'securite', label: 'Sécurité', icon: Shield }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Profil Tab */}
        {activeTab === 'profil' && (
          <motion.div
            key="profil"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Photo Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto overflow-hidden">
                    {profile?.photoProfil ? (
                      <img src={profile.photoProfil} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-white">
                        {profile?.prenom?.[0]}{profile?.nom?.[0]}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mt-4">
                  {profile?.prenom} {profile?.nom}
                </h2>
                <p className="text-sm text-slate-500">{profile?.numeroEtudiant}</p>
                <div className="mt-4 flex justify-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    profile?.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {profile?.actif ? 'Compte actif' : 'Compte inactif'}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Membre depuis</span>
                  <span className="font-semibold text-slate-700">
                    {profile?.dateInscription ? new Date(profile.dateInscription).toLocaleDateString('fr-FR') : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-500">Dernière connexion</span>
                  <span className="font-semibold text-slate-700">Aujourd'hui</span>
                </div>
              </div>
            </div>

            {/* Info Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Informations personnelles</h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Nom</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.nom || ''}
                        onChange={e => setFormData({ ...formData, nom: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-slate-800 font-medium">{profile?.nom}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Prénom</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.prenom || ''}
                        onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-slate-800 font-medium">{profile?.prenom}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-slate-800">{profile?.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Téléphone</label>
                    {editMode ? (
                      <input
                        type="tel"
                        value={formData.telephone || ''}
                        onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-slate-800">{profile?.telephone || '-'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Date de naissance</label>
                    {editMode ? (
                      <input
                        type="date"
                        value={formData.dateNaissance?.split('T')[0] || ''}
                        onChange={e => setFormData({ ...formData, dateNaissance: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-slate-800">
                        {profile?.dateNaissance ? new Date(profile.dateNaissance).toLocaleDateString('fr-FR') : '-'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Adresse</label>
                  {editMode ? (
                    <textarea
                      value={formData.adresse || ''}
                      onChange={e => setFormData({ ...formData, adresse: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      rows={2}
                    />
                  ) : (
                    <p className="text-slate-800">{profile?.adresse || '-'}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Établissement</label>
                    <p className="text-slate-800 font-medium">{profile?.etablissementNom || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Niveau scolaire</label>
                    <p className="text-slate-800">{profile?.niveauScolaire || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Paramètres Tab */}
        {activeTab === 'parametres' && (
          <motion.div
            key="parametres"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Theme Settings */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Apparence
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: 'light', label: 'Clair', icon: Sun },
                  { value: 'dark', label: 'Sombre', icon: Moon },
                  { value: 'system', label: 'Système', icon: Smartphone }
                ].map(theme => (
                  <button
                    key={theme.value}
                    onClick={() => updatePreference('theme', theme.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      profile?.preferences.theme === theme.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <theme.icon className={`w-6 h-6 mx-auto mb-2 ${
                      profile?.preferences.theme === theme.value ? 'text-blue-600' : 'text-slate-400'
                    }`} />
                    <p className={`text-sm font-medium ${
                      profile?.preferences.theme === theme.value ? 'text-blue-600' : 'text-slate-600'
                    }`}>
                      {theme.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Settings */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Languages className="w-5 h-5 text-blue-600" />
                Langue
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: 'fr', label: 'Français', flag: '🇫🇷' },
                  { value: 'ar', label: 'العربية', flag: '🇲🇦' },
                  { value: 'en', label: 'English', flag: '🇬🇧' }
                ].map(lang => (
                  <button
                    key={lang.value}
                    onClick={() => updatePreference('langue', lang.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      profile?.preferences.langue === lang.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{lang.flag}</span>
                    <p className={`text-sm font-medium ${
                      profile?.preferences.langue === lang.value ? 'text-blue-600' : 'text-slate-600'
                    }`}>
                      {lang.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Préférences de notifications
              </h2>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Notifications par email', icon: Mail },
                  { key: 'sms', label: 'Notifications par SMS', icon: Smartphone },
                  { key: 'push', label: 'Notifications push', icon: Bell },
                  { key: 'paiements', label: 'Alertes de paiement', icon: CreditCard },
                  { key: 'transport', label: 'Alertes de transport', icon: Bus },
                  { key: 'promo', label: 'Offres promotionnelles', icon: Award }
                ].map(pref => (
                  <div key={pref.key} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <pref.icon className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-700">{pref.label}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile?.preferences.notifications[pref.key as keyof typeof profile.preferences.notifications] || false}
                        onChange={(e) => updatePreference(`notifications.${pref.key}`, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Centre de notifications</h2>
                <p className="text-sm text-slate-500">
                  {notifications.filter(n => !n.lu).length} notification(s) non lue(s)
                </p>
              </div>
              {notifications.some(n => !n.lu) && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-sm font-medium"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Aucune notification</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-6 hover:bg-slate-50 transition-colors ${
                      !notif.lu ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div>
                            <h3 className="font-semibold text-slate-800">{notif.titre}</h3>
                            <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                            <p className="text-xs text-slate-400 mt-2">
                              {new Date(notif.date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!notif.lu && (
                              <button
                                onClick={() => handleMarkAsRead(notif.id)}
                                className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 rounded"
                              >
                                Marquer lu
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notif.id)}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Sécurité Tab */}
        {activeTab === 'securite' && (
          <motion.div
            key="securite"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Change Password */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Changer le mot de passe
              </h2>

              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  Changer mon mot de passe
                </button>
              ) : (
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPasswordForm(false)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Enregistrer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sessions Actives */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                Sessions actives
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Appareil actuel</p>
                      <p className="text-xs text-slate-500">Chrome - Windows • Aujourd'hui</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold">Actif</span>
                </div>
              </div>
            </div>

            {/* Delete Account */}
            <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
              <h2 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Supprimer mon compte
              </h2>
              <p className="text-sm text-red-700 mb-4">
                Cette action est irréversible. Toutes vos données seront supprimées.
              </p>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Supprimer mon compte
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-red-800">
                    Êtes-vous vraiment sûr ? Tapez "SUPPRIMER" pour confirmer.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 text-slate-600 bg-white rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                      Confirmer la suppression
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Import manquant
import { Settings } from 'lucide-react';

export default ProfilUtilisateur;