# 🚀 QUICK REFERENCE - Lancement et Test Rapide

## ⚡ 1-2-3 Démarrage

### Terminal 1 - Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run

# ✅ Attendre: "Started AndlTransportApplication"
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install  # Si première fois
npm run dev

# ✅ Attendre: "VITE v5.x ready in xxxx ms"
# ✅ Accédez à: http://localhost:5173
```

---

## 🧪 Quick Test Checklist

### ✅ À Chaque Lancement

- [ ] Backend accessible: `netstat -ano | findstr :8081`
- [ ] Frontend affiche: `Chargement de l'application...`
- [ ] Console F12: Aucune erreur ROUGE
- [ ] URL: `/login` après le chargement

### ✅ Test Login (Étudiant)

| Champ | Valeur |
|-------|--------|
| Email | test@andl.ma |
| Mot de passe | test123 |

**Résultat attendu:**
- ✅ Redirection vers `/etudiant/dashboard`
- ✅ Dashboard affiche contenu
- ✅ Sidebar visible

### ✅ Test Login (Admin)

| Champ | Valeur |
|-------|--------|
| Email | admin@andl.ma |
| Mot de passe | admin123 |

**Résultat attendu:**
- ✅ Redirection vers `/admin/dashboard`
- ✅ Dashboard Admin affiche statistiques
- ✅ Sidebar menu Admin visible

### ✅ Test Register

1. Clic "Créer un compte étudiant"
2. Remplir tous les champs
3. **Sélectionner établissement** (doit être chargé de l'API, pas statique)
4. Clic "S'inscrire"

**Résultat attendu:**
- ✅ Message succès
- ✅ Redirection vers Login après 2s
- ✅ Dropdown établissement a des vraies valeurs

---

## 🔴 Si Problème

### Page Noire au Démarrage?
```javascript
// Console F12:
localStorage.clear();
location.reload();
```

### Dashboard Vide?
```javascript
// Console F12:
console.log(localStorage.getItem('token'));
console.log(localStorage.getItem('user'));
// Les deux doivent avoir des valeurs
```

### Erreur "Port 8081"?
```bash
netstat -ano | findstr :8081
# Rien? Backend non lancé
# LISTENING? Backend OK, autre problème
```

### Établissements Vide au Register?
- DevTools → Network
- Chercher GET `/etablissements`
- Vérifier Status et Response

---

## 📋 Tests Critiques (En Ordre)

```
1. [  ] Démarrage → voir Login
2. [  ] Login étudiant → dashboard étudiant
3. [  ] Login admin → dashboard admin
4. [  ] Dashboard NON VIDE
5. [  ] Logout → redirection Login
6. [  ] Refresh → session persiste
7. [  ] Back button après logout → pas retour au dashboard
8. [  ] Register → établissements chargés
9. [  ] Pas d'erreurs rouges en Console
10. [  ] API /inscriptions/ma-liste répond
```

---

## 💾 Fichiers Importants Modifiés

```
✅ AuthContext.tsx       → Ajout isLoading state
✅ App.tsx               → Vérification isLoading
✅ LoginPage.tsx         → Navigation par rôle
✅ EtudiantDashboard.tsx → Import + error handling
✅ RegisterPage.tsx      → Établissements dynamiques
✅ Sidebar.tsx           → Logout avec redirect
```

---

## 🎯 Résumé des Fixes

| Before | After |
|--------|-------|
| Écran noir au démarrage | Loading → Login ✅ |
| Dashboard vide | Dashboard avec contenu ✅ |
| Redirection confuse | Navigation directe par rôle ✅ |
| Pas d'erreur visible | Erreurs affichées clairement ✅ |
| Établissements statiques | Dynamique de l'API ✅ |
| Logout sans redirection | Redirection propre ✅ |

---

## 🆘 Support Rapide

**Documentation disponible:**
- [COMPLETE_ANALYSIS.md](./COMPLETE_ANALYSIS.md) → Analyse détaillée
- [FIXES_SUMMARY.md](./FIXES_SUMMARY.md) → Résumé des corrections
- [DEBUG_AND_TEST_GUIDE.md](./DEBUG_AND_TEST_GUIDE.md) → Guide complet de test
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) → Problèmes courants

---

## ⏱️ Temps Attendu

- Backend démarrage: **5-10 secondes**
- Frontend démarrage: **3-5 secondes**
- Login réponse: **1-2 secondes**
- Dashboard chargement: **1-3 secondes**

**Si ça dépasse 10s:** Vérifier les logs pour les erreurs

---

## 📞 Commandes Utiles

```bash
# Voir logs backend en temps réel
cd backend && mvn spring-boot:run

# Voir logs frontend
cd frontend && npm run dev

# Redémarrer everything
pkill java  # Tuer Java
npm run dev --prefix frontend  # Frontend frais

# Nettoyer cache
cd frontend && rm -rf node_modules/.vite
cd frontend && npm run dev

# Tests API rapides
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@andl.ma","motDePasse":"test123"}'
```

---

## ✨ Everything Working? 

Vous êtes prêt pour:
- ✅ Développement des features
- ✅ Tests d'intégration
- ✅ Déploiement en staging/production
- ✅ Ajouter plus de fonctionnalités

**Bonne chance! 🚀**
