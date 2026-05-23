# Guide de Débogage et de Test - Système d'Authentification et Routing

## 📋 Résumé des Corrections Appliquées

### 1. **AuthContext - Gestion du chargement initial** ✅
**Problème:** Race condition lors du démarrage de l'app - les routes étaient évaluées avant la restauration de la session.
**Solution:**
- Ajout d'un état `isLoading: boolean` dans AuthContext
- Le chargement reste true jusqu'à la fin du useEffect qui restaure localStorage
- ProtectedRoute et AppRoutes vérifient `isLoading` avant d'effectuer des redirections
- Affichage d'un écran de chargement pendant la restauration de la session

**Fichier modifié:** `frontend/src/context/AuthContext.tsx`

### 2. **App.tsx - Amélioration du routing** ✅
**Problèmes corrigés:**
- Ajout de vérifications `isLoading` dans AppRoutes
- Navigation directe vers le dashboard approprié selon le rôle au démarrage
- Utilisation de `replace: true` pour éviter les problèmes de back button
- Écran de chargement élégant lors du démarrage
- Routes mieux structurées sans imbrication inutile

**Changements clés:**
```typescript
// Avant: Redirection via ProtectedRoute imbriquée
<Route path="/" element={<ProtectedRoute>...</ProtectedRoute>} />

// Après: Redirection directe basée sur le rôle
<Route path="/" element={
  isAuthenticated ? (
    <Navigate to={isAdmin ? "/admin/dashboard" : "/etudiant/dashboard"} replace />
  ) : (
    <Navigate to="/login" replace />
  )
} />
```

**Fichier modifié:** `frontend/src/App.tsx`

### 3. **LoginPage - Navigation améliorée** ✅
**Changements:**
- Navigation directe vers le dashboard du rôle correspondant après login
- Utilisation de `replace: true` pour prévenir la navigation vers le root
- Meilleure détection et gestion des erreurs API

**Fichier modifié:** `frontend/src/pages/LoginPage.tsx`

### 4. **EtudiantDashboard - Corrections d'erreurs et d'affichage** ✅
**Problèmes corrigés:**
- ❌ **Import manquant:** `Check` icon n'était pas importé
- Ajout d'un état d'erreur pour afficher les problèmes d'API
- Meilleure gestion de l'état de chargement avec UI améliore
- Logging détaillé pour le débogage
- Gestion des données null/undefined
- Affichage d'un message d'erreur professionnel en cas de problème

**Fichier modifié:** `frontend/src/pages/EtudiantDashboard.tsx`

### 5. **RegisterPage - Corrections multiples** ✅
**Changements:**
- Utilisation de `replace: true` dans la navigation après succès
- Remplissage dynamique du dropdown "Établissement" à partir de l'API
- Fallback vers les options statiques si l'API échoue
- Meilleure gestion des erreurs d'inscription

**Fichier modifié:** `frontend/src/pages/RegisterPage.tsx`

### 6. **Sidebar - Logout avec redirection** ✅
**Changement:**
- Création d'une fonction `handleLogout` qui appelle logout puis navigue vers /login
- Utilisation de `replace: true` pour éviter les problèmes de navigation
- Import de `useNavigate` de react-router-dom

**Fichier modifié:** `frontend/src/components/Sidebar.tsx`

---

## 🧪 Guide de Test Complet

### Test 1: Démarrage initial (Premier lancement)
**Étapes:**
1. Ouvrir le navigateur à `http://localhost:5173`
2. Observer le chargement

**Attendu:**
- ✅ Écran de chargement avec spinner
- ✅ Redirection automatique vers `/login` après chargement
- ✅ Page Login affichée

**Si le problème persiste:**
- Ouvrir les DevTools (F12) → Console
- Vérifier s'il y a des erreurs JavaScript
- Vérifier les onglets Network pour voir les appels API

---

### Test 2: Login valide (Étudiant)
**Données de test:**
- Email: `etudiant@example.com`
- Motdepasse: `password123`

**Étapes:**
1. Entrer les identifiants
2. Cliquer sur "Se connecter"
3. Attendre la réponse du serveur

**Attendu:**
- ✅ Pas d'erreur réseau
- ✅ Redirection automatique vers `/etudiant/dashboard`
- ✅ Dashboard s'affiche avec contenu (liste des inscriptions, badge)
- ✅ Sidebar visible avec menu étudiant
- ✅ Informations de l'utilisateur affichées dans le sidebar

**Si le dashboard est vide:**
- Ouvrir DevTools → Console
- Chercher les erreurs: "Erreur chargement espace étudiant"
- Vérifier l'onglet Network:
  - `/inscriptions/ma-liste` doit retourner 200
  - Si 401: token invalide, se reconnecter
  - Si 404: endpoint inexistant dans le backend

---

### Test 3: Login valide (Admin)
**Données de test:**
- Email: `admin@example.com`
- Motdepasse: `admin123`

**Étapes:**
1. Entrer les identifiants
2. Cliquer sur "Se connecter"

**Attendu:**
- ✅ Redirection vers `/admin/dashboard`
- ✅ Dashboard Admin affichée avec statistiques
- ✅ Sidebar affiche menu Admin (inscriptions, paiements, etc.)

---

### Test 4: Identifiants invalides
**Étapes:**
1. Entrer email et mot de passe incorrects
2. Cliquer "Se connecter"

**Attendu:**
- ✅ Message d'erreur affiché: "Identifiants invalides ou erreur serveur"
- ✅ Page Login reste sur place
- ✅ Champs conservent les valeurs

---

### Test 5: Backend indisponible
**Étapes:**
1. Arrêter le backend (Ctrl+C sur le serveur Java)
2. Essayer de se connecter

**Attendu:**
- ✅ Message d'erreur: "Impossible de contacter le serveur (Port 8081)"
- ✅ Pas de crash de l'application

---

### Test 6: Inscription (Register)
**Étapes:**
1. Cliquer "Créer un compte étudiant" sur la page Login
2. Remplir tous les champs
3. Sélectionner un établissement (doit être chargé de l'API)
4. Cliquer "S'inscrire"

**Attendu:**
- ✅ Établissements chargés dynamiquement (pas les valeurs statiques)
- ✅ Message de succès après soumission
- ✅ Redirection automatique vers Login après 2 secondes
- ✅ Les établissements ne sont pas null/undefined

**Si dropdown vide:**
- DevTools → Network → `/etablissements`
- Vérifier la réponse API
- Vérifier la structure: chaque item doit avoir `id` et `nom`

---

### Test 7: Accès protégé sans authentification
**Étapes:**
1. Ouvrir une nouvelle fenêtre navigateur
2. Aller directement à `http://localhost:5173/etudiant/dashboard`

**Attendu:**
- ✅ Redirection automatique vers `/login`
- ✅ Page Login affichée

---

### Test 8: Déconnexion
**Étapes:**
1. Être connecté (admin ou étudiant)
2. Cliquer "Déconnexion" dans le sidebar
3. Naviguer en arrière (back button)

**Attendu:**
- ✅ Redirection vers `/login`
- ✅ Back button ne revient pas au dashboard
- ✅ localStorage vidé (token et user supprimés)

**Vérification localStorage:**
- DevTools → Application → Local Storage
- Vérifier que `token` et `user` n'existent pas

---

### Test 9: Persistance de session
**Étapes:**
1. Se connecter (admin ou étudiant)
2. Rafraîchir la page (F5)
3. Attendre le chargement

**Attendu:**
- ✅ Pas de redirection vers login
- ✅ Restez sur le dashboard
- ✅ Données utilisateur conservées
- ✅ Écran de chargement visible brièvement

**Ceci teste que localStorage est bien restauré au démarrage**

---

### Test 10: Dashboard non vide
**Étapes:**
1. Se connecter en tant qu'étudiant
2. Attendre le chargement du dashboard
3. Observer le contenu

**Attendu (après tous les fixes):**
- ✅ Titre "Espace Étudiant" visible
- ✅ Salutation avec prénom de l'utilisateur
- ✅ Badge Transport section (avec QR code si badge existe)
- ✅ État de l'Abonnement section
- ✅ Paiements & Facturation section
- ✅ Pas d'écran complètement noir/vide

**Si encore vide:**
- DevTools → Console → vérifier les erreurs
- Copier le message d'erreur exact
- Vérifier que les données API ne sont pas null

---

## 🔧 Checklist Finale

### Avant de tester:
- [ ] Backend lancé sur le port 8081
- [ ] Frontend lancé sur le port 5173
- [ ] DevTools ouvert (F12)
- [ ] Console visible pour les erreurs

### Pendant les tests:
- [ ] Ouvrir DevTools → Console (aucun message d'erreur rouge)
- [ ] Ouvrir DevTools → Network (vérifier les appels API)
- [ ] Ouvrir DevTools → Application → Local Storage (vérifier token/user)
- [ ] Ouvrir DevTools → Performance (si lent, profiler)

### Points critiques à vérifier:
1. ✅ **Race condition:** Chargement initial sans erreur
2. ✅ **Navigation:** Redirection correcte selon le rôle
3. ✅ **Dashboard:** Contenu affiché, pas d'écran vide
4. ✅ **Erreurs:** Aucun message d'erreur en rouge dans la console
5. ✅ **Imports:** Tous les composants et icônes correctement importés
6. ✅ **API:** Les endpoints retournent les bonnes données
7. ✅ **localStorage:** Token et user stockés/restaurés correctement

---

## 🐛 Commandes de Débogage Utiles (Navigateur Console)

```javascript
// Vérifier l'authentification
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));

// Forcer la déconnexion
localStorage.removeItem('token');
localStorage.removeItem('user');
location.reload();

// Tester l'API
fetch('http://localhost:8081/api/inscriptions/ma-liste', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}).then(r => r.json()).then(console.log);

// Vérifier les routes
console.log('Current path:', window.location.pathname);
```

---

## 📱 Messages d'erreur courants et solutions

| Erreur | Cause | Solution |
|--------|-------|----------|
| "Impossible de contacter le serveur (Port 8081)" | Backend non lancé | `cd backend && mvn spring-boot:run` |
| "Identifiants invalides ou erreur serveur" | Email/password incorrect | Vérifier les credentials |
| "Cannot read property 'map' of undefined" | État API null | Le fix d'EtudiantDashboard le résout |
| "404: /inscriptions/ma-liste" | Endpoint inexistant | Vérifier le backend API |
| "401 Unauthorized" | Token expiré | Se reconnecter |
| Page blanche/noire au démarrage | Race condition | Le fix d'isLoading le résout |

---

## ✨ Résumé des améliorations

| Aspect | Avant | Après |
|--------|-------|-------|
| Démarrage | Page vide ou redirection incorrecte | Chargement visible puis login |
| Login | Navigation vers root | Navigation directe au dashboard du rôle |
| Dashboard | Peut être vide/crash | Affichage normal avec données |
| Imports | Icônes manquantes | Tous les imports présents |
| Logout | Pas de redirection | Redirection propre vers login |
| Register | Options établissement statiques | Options dynamiques de l'API |
| Erreurs | Non gérées | Messages d'erreur clairs |

---

## 🚀 Prochaines étapes optionnelles

1. Ajouter la gestion des tokens expirants
2. Implémenter refresh token
3. Ajouter des notifications toast pour les erreurs
4. Implémenter le remember me
5. Ajouter les validations de formulaire côté client
6. Optimiser les requêtes API avec cache/SWR
