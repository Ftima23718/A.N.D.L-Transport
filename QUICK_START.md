# 🚀 GUIDE DE DÉMARRAGE RAPIDE

## État Actuel (Mai 20, 2026)

✅ **Backend:** Fonctionnel sur http://localhost:8081
✅ **Frontend:** Prêt, besoin de `npm run dev`
✅ **Base de données:** H2 en mémoire initialisée
✅ **Données de test:** 4 établissements + admin créés

---

## 1️⃣ Démarrer le Frontend

```bash
# Terminal 2
cd "C:\Users\THINKPAD\Desktop\Nouveau dossier (5)\andl-transport\frontend"
npm run dev
```

**Résultat attendu:**
```
  VITE v8.0.12  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Accédez via: **http://localhost:5173**

---

## 2️⃣ Se Connecter

**Identifiants de Test:**
- Email: `admin@andl.ma`
- Mot de passe: `Admin@2024`

---

## 3️⃣ Tester les Fonctionnalités

### Dashboard Admin
- Vue d'ensemble des stats
- Accès aux modules

### Gestion des Transports
- Liste des bus
- Créer/Modifier/Supprimer
- Affecter chauffeur et établissement
- Définir horaires et capacité

### Gestion des Factures
- Créer factures
- Marquer comme payée
- Voir statistiques
- Export Excel/PDF (UI)

### Gestion des Établissements
- Voir les 4 écoles initialisées
- Statistiques par établissement
- Ajouter transports associés

### Gestion des Inscriptions
- Valider inscriptions
- Affecter à ligne/établissement
- Gérer statuts

### Gestion des Administrateurs
- Créer autres admins
- Réinitialiser mot de passe
- Activer/Désactiver

### Carte Interactive
- Vue géographique (structure)
- Liste des établissements
- Détails au clic

---

## 4️⃣ Tester les API Directement

### Obtenir un Token JWT

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@andl.ma",
    "motDePasse": "Admin@2024"
  }'
```

**Réponse:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "email": "admin@andl.ma"
}
```

### Lister les Bus

```bash
curl -X GET http://localhost:8081/api/bus \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Créer une Facture

```bash
curl -X POST http://localhost:8081/api/factures \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "etudiantId": 1,
    "tarifId": 1,
    "montant": 100.0,
    "dateEmission": "2026-05-20"
  }'
```

---

## 5️⃣ Accéder à la Console H2

**URL:** http://localhost:8081/h2-console

**Credentials:**
- Username: `sa`
- Password: (vide)
- JDBC URL: `jdbc:h2:mem:andl_transport`

**Tables disponibles:**
- `utilisateurs` - Base des utilisateurs
- `administrateurs` - Admins
- `etudiants` - Étudiants
- `chauffeurs` - Chauffeurs
- `etablissements` - Écoles (4 initialisées)
- `bus` - Transports
- `factures` - Factures/Invoices
- `tarifs` - Tarifs (4 initialisés)
- `inscriptions` - Inscriptions
- `paiements` - Paiements

---

## 6️⃣ Données Initialisées

### Établissements (4)

| Nom | Niveau | Ville | Fonction |
|-----|--------|-------|----------|
| Madrasat A9odad | Primaire | Casablanca | Pour élèves primaires |
| Madrasat A9odad - Collège | Collège | Casablanca | Branche collège |
| Najah I3dadi | Collège | Casablanca | École alternative collège |
| Ibn Nafis - Lycée | Lycée | Casablanca | Pour élèves lycéens |

### Tarifs (4)

| Type | Montant | Usage |
|------|---------|-------|
| MENSUEL | 100 DH | Abonnement mois |
| TRIMESTRIEL | 280 DH | 3 mois |
| SEMESTRIEL | 550 DH | 6 mois |
| ANNUEL | 1000 DH | 12 mois |

### Admin (1)

| Email | Mot de passe | Status |
|-------|--------------|--------|
| admin@andl.ma | Admin@2024 | ACTIF |

---

## 🎯 Workflows à Tester

### Workflow 1: Créer un Transport

1. Aller à "Gestion des Transports"
2. Cliquer "Nouveau Transport"
3. Remplir:
   - Matricule: `CAB-2024-001`
   - Nom: `Express Casablanca`
   - Chauffeur: (Sélectionner existant ou créer)
   - Établissement: `Madrasat A9odad`
   - Horaires: 08:00 - 16:00
4. Cliquer "Créer"
5. Vérifier dans le tableau

### Workflow 2: Créer une Facture

1. Aller à "Gestion des Factures"
2. Cliquer "Nouvelle Facture"
3. Sélectionner étudiant
4. Choisir tarif (ex: MENSUEL 100 DH)
5. Cliquer "Créer"
6. Dans la liste, cliquer "Marquer payée"
7. Vérifier les stats

### Workflow 3: Gérer un Établissement

1. Aller à "Établissements"
2. Cliquer sur une carte
3. Voir détails et stats
4. "Modifier" pour changer infos
5. Ajouter transports associés

---

## 🔍 Vérification de Santé

### Health Check Backend

```bash
# Vérifier que le serveur répond
curl http://localhost:8081/api/bus \
  -H "Authorization: Bearer dummy"
```

**Doit retourner:** 401 Unauthorized (pas de token valide)
**Pas de réponse:** Backend arrêté

### Health Check Frontend

```bash
# Vérifier que Vite répond
curl http://localhost:5173
```

**Doit retourner:** HTML (index.html)

---

## 🛑 Troubleshooting

### Backend ne démarre pas

1. Vérifier port 8081 libre:
```bash
netstat -ano | findstr :8081
```

2. Redémarrer:
```bash
# Tuer le processus ancien
taskkill /PID <pid> /F
# Relancer
mvn spring-boot:run
```

### Frontend ne se charge pas

```bash
# Réinstaller dépendances
cd frontend
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Erreur CORS

- Backend expose `*` par défaut
- Frontend appelle `http://localhost:8081/api`
- Vérifier dans `src/services/api.ts`

### Pas d'admin après démarrage

- H2 crée-drop = données perdues à chaque restart
- DataInitializer devrait les recréer automatiquement
- Vérifier logs backend pour "DEFAULT ADMIN CREATED"

---

## 📱 Pages Disponibles

### Admin (Connecté)
- ✅ `/admin` - Dashboard
- ✅ `/admin/transports` - Gestion bus
- ✅ `/admin/factures` - Gestion factures
- ✅ `/admin/etablissements` - Gestion écoles
- ✅ `/admin/inscriptions` - Gestion inscriptions
- ✅ `/admin/administrateurs` - Gestion admins
- ✅ `/admin/carte` - Carte interactive

### Public
- ✅ `/login` - Connexion
- ✅ `/register` - Enregistrement

---

## 🎓 Étapes Suivantes

### Court terme (Aujourd'hui)
1. ✅ Tester les 6 pages
2. ✅ Valider les workflows
3. ✅ Vérifier les API
4. ✅ Tester authentification

### Moyen terme (Cette semaine)
1. Intégrer Leaflet pour carte
2. Implémenter export PDF/Excel
3. Ajouter upload fichiers
4. Tests d'intégration complets

### Long terme (Ce mois)
1. Notifications email
2. Rapports avancés
3. Analytics dashboard
4. Mobile responsiveness
5. Performance optimization

---

## 📞 Support Rapide

| Problème | Solution |
|----------|----------|
| 404 Not Found | Vérifier URL endpoint |
| 401 Unauthorized | Token expiré, reconnecter |
| CORS error | Vérifier backend CORS config |
| Page blanche | F5 refresh, vérifier console |
| API timeout | Backend arrêté? |

---

**🎉 Vous êtes prêt à tester le système complètement fonctionnel!**

**Documentation:** Voir [SESSION_2_COMPLETE.md](SESSION_2_COMPLETE.md)  
**Rapport:** Voir [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

