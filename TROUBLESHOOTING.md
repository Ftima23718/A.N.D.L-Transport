# Checklist de Troubleshooting - Système d'Authentification

## 🔴 Si vous voyez une page NOIRE/VIDE au démarrage

### Diagnostic rapide
1. Ouvrir DevTools (F12)
2. Aller à l'onglet **Console**
3. Chercher les messages en ROUGE

**Si vous voyez une erreur Rouge:**
```
Erreur: Cannot read property 'email' of undefined
OU
Erreur: Cannot read property 'map' of undefined
```
→ Les données ne sont pas chargées correctement
→ **Solution:** Vérifier que le backend API répond correctement

**Si pas d'erreur en rouge:**
→ **Attendre 3-5 secondes** et rafraîchir (F5)
→ Le chargement initial peut être lent

---

## 🔴 Si vous restez bloqué sur LOGIN après l'avoir soumis

### Diagnostic
1. Devtools → Network
2. Chercher une requête `POST /auth/login`
3. Vérifier le **Status Code**

**Si Status 200 ou 201:**
- ✅ Login accepté par le backend
- ❌ Problème: Navigation ne se fait pas
- **Solution:** 
  - Vérifier la console pour les erreurs JavaScript
  - Vérifier que le token est sauvegardé dans localStorage

**Si Status 401 ou 403:**
- ✅ Backend rejette les credentials
- **Solution:** Vérifier email et mot de passe

**Si Status 500:**
- ❌ Erreur backend
- **Solution:** Vérifier les logs du serveur Java

**Si pas de réponse ou timeout:**
- ❌ Backend non accessible
- **Vérifier:** Est-ce que le backend est lancé sur le port 8081?
  ```bash
  netstat -ano | findstr :8081
  ```

---

## 🔴 Si le DASHBOARD est vide après login

### Vérification étape par étape

**Étape 1: Vérifier localStorage**
```javascript
// Copier-coller dans Console (F12)
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

- Si `Token: null` → Pas connecté, retour à Login
- Si `Token: <chaîne longue>` → Token sauvegardé ✅

**Étape 2: Vérifier les appels API**
- Devtools → Network
- Chercher une requête GET `/inscriptions/ma-liste`
- Cliquer dessus, voir la **réponse (Response tab)**

```json
// Si vous voyez:
[
  {
    "id": 1,
    "typeAbonnement": "MENSUEL",
    ...
  }
]
```
→ API fonctionne, données reçues ✅

```json
// Si vous voyez:
{
  "timestamp": "...",
  "message": "Unauthorized"
}
```
→ Token invalide
→ **Solution:** Se reconnecter

```json
// Si vous voyez une erreur ou status 404:
{
  "error": "Not Found"
}
```
→ Endpoint inexistant au backend
→ **Solution:** Vérifier que le backend a l'endpoint `/inscriptions/ma-liste`

**Étape 3: Vérifier les erreurs JavaScript**
- Console → Chercher messages d'erreur en rouge
- Si vous voyez:
  ```
  Erreur chargement espace étudiant: 
  TypeError: Cannot read property 'map' of undefined
  ```
→ Les données API sont mal formatées
→ **Solution:** Vérifier le format de la réponse API

---

## 🔴 Si après Register, la page reste blanche

### Diagnostic

1. Vérifier que l'inscription a réussi:
   - Network tab → Chercher POST `/auth/register`
   - Status doit être 200 ou 201

2. Si status 200/201:
   - Attendre 2 secondes (la redirection est programmée)
   - Vous devriez voir message "Inscription réussie"
   - Puis redirection vers Login

3. Si vous voyez l'erreur:
   ```
  "etablissement is required"
  ```
→ L'établissement n'a pas été sélectionné
→ **Solution:** Sélectionner un établissement avant soumettre

4. Si le dropdown établissement est vide:
   - Network tab → Chercher GET `/etablissements`
   - Si status 404: Endpoint inexistant
   - Si status 200: Vérifier la réponse (Response tab)

---

## 🔴 Si vous voyez une erreur "Port 8081"

### Message complet:
```
Impossible de contacter le serveur (Port 8081). 
Vérifiez que le backend est lancé.
```

### Solution:

**1. Vérifier si le backend est lancé:**
```bash
# Windows PowerShell
netstat -ano | findstr :8081

# Si rien n'apparaît: Backend non lancé ❌
# Si vous voyez "LISTENING": Backend lancé ✅
```

**2. Lancer le backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run

# Ou si vous utilisez Java directement:
java -jar target/andl-transport-1.0.0.jar
```

**3. Vérifier les logs du backend:**
- Chercher `Started AndlTransportApplication`
- Si vous voyez des erreurs rouges, copier et dépanner

---

## 🔴 Si le logout ne fonctionne pas

### Diagnostic

1. Cliquer "Déconnexion"
2. Vérifier que localStorage est vidé:
   ```javascript
   console.log('Token après logout:', localStorage.getItem('token'));
   // Doit afficher: null
   ```

3. Si localStorage n'est pas vidé:
   → Erreur dans le code logout
   → **Solution:** Vérifier que `logout()` du AuthContext est appelé

4. Vérifier que vous êtes redirigé vers Login:
   - L'URL doit devenir `/login`
   - Si ce n'est pas le cas → Problème de navigation

---

## 🔴 Si vous avez une erreur "Missing imports"

### Exemple d'erreur:
```
ReferenceError: Check is not defined
```

### Diagnostic:
- Chercher dans quel fichier le composant `Check` est utilisé
- Vérifier que le fichier importe `Check` depuis lucide-react

**Solution rapide:**
```javascript
// Au début du fichier, ajouter:
import { ..., Check, ... } from 'lucide-react';
```

Tous les imports manquants ont été corrigés dans cette version ✅

---

## 🟢 CHECKLIST - Tout fonctionne si:

- [ ] Au démarrage: Loading screen visible brièvement
- [ ] Vous voyez la page Login après le chargement
- [ ] Login avec identifiants valides fonctionne
- [ ] Vous êtes redirigé vers votre dashboard (admin ou étudiant)
- [ ] Dashboard affiche du contenu (pas d'écran noir)
- [ ] Console F12 n'affiche aucune erreur ROUGE
- [ ] Logout redirige vers Login
- [ ] Refresh page maintient la session (pas de logout)
- [ ] Back button après logout n'amène pas au dashboard
- [ ] Pas de messages "Impossible de contacter le serveur"

---

## 📞 Commandes de réinitialisation (si tout est bloqué)

### Vider le cache navigateur:
```javascript
// Copier-coller dans Console (F12)
localStorage.clear();
sessionStorage.clear();
```
Puis rafraîchir (Ctrl+R ou Cmd+R)

### Vérifier la version du frontend:
```javascript
console.log(navigator.userAgent);
```

### Voir tous les appels API réalisés:
- Network tab
- Filter: `inscriptions` ou `auth` ou `etablissements`

---

## 🆘 Dernier recours - Rapport complet

Si rien ne fonctionne, collecter ces informations:

```javascript
// Copier-coller tout cela dans Console et copier l'output

console.log('=== DIAGNOSTIC ===');
console.log('URL:', window.location.href);
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
console.log('App version:', 'React+TypeScript');
console.log('Browser:', navigator.userAgent);

// Tester l'API
fetch('http://localhost:8081/api/inscriptions/ma-liste', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}).then(r => {
  console.log('API Response Status:', r.status);
  return r.json();
}).then(data => {
  console.log('API Response Data:', data);
}).catch(e => {
  console.log('API Error:', e.message);
});
```

Copier tout l'output et l'utiliser pour dépanner ✅
