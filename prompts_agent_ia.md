# 🤖 Prompts Complets pour Agent IA
## Application : Gestion des Inscriptions au Service de Transport Étudiant
### Stack : Java Spring Boot 3 · React 18 · MySQL 8 · Docker

---

## 📌 INSTRUCTIONS GÉNÉRALES POUR L'AGENT

> Colle ce bloc au début de chaque session de travail avec l'agent IA :

```
Tu es un développeur fullstack senior expert en Java Spring Boot 3, React.js 18, MySQL et Docker.
Tu travailles sur une application web appelée "TransportEtud" — Gestion des inscriptions des étudiants au service de transport universitaire.

Stack technique :
- Backend  : Java 17, Spring Boot 3.x, Spring Security 6 + JWT (jjwt), Spring Data JPA, Hibernate, Flyway, iText 7, ZXing, Apache POI, JavaMailSender + Thymeleaf, SpringDoc OpenAPI
- Frontend : React 18 + Vite, React Router v6, Axios, Redux Toolkit, Material UI v5
- Base de données : MySQL 8 via Docker
- Build : Maven (backend), npm/Vite (frontend)

Structure du projet :
transport-etud/
├── backend/          (Spring Boot)
├── frontend/         (React + Vite)
├── docker-compose.yml
└── README.md

Réponds toujours avec du code complet, fonctionnel et prêt à copier. Pas de pseudo-code.
```

---

## 🗂️ PHASE 0 — SETUP INITIAL DU PROJET

### Prompt 0.1 — Initialisation de la structure
```
Crée la structure complète du projet "transport-etud" :
1. Un dossier racine transport-etud/
2. Initialise le backend Spring Boot avec Spring Initializr (Maven) incluant ces dépendances :
   spring-boot-starter-web, spring-boot-starter-security, spring-boot-starter-data-jpa,
   spring-boot-starter-mail, spring-boot-starter-validation, spring-boot-starter-thymeleaf,
   mysql-connector-j, flyway-core, lombok
3. Ajoute dans pom.xml les dépendances supplémentaires : jjwt-api 0.12, jjwt-impl, jjwt-jackson,
   itext7-core 7.2, zxing core 3.5, zxing javase, apache poi 5.2, springdoc-openapi-starter-webmvc-ui 2.3
4. Initialise le frontend avec : npm create vite@latest frontend -- --template react
5. Dans frontend/, installe : axios, react-router-dom, @reduxjs/toolkit, react-redux, @mui/material, @emotion/react, @emotion/styled, @mui/icons-material
6. Génère un docker-compose.yml à la racine avec MySQL 8 et phpMyAdmin
7. Génère un README.md avec les instructions de démarrage

Donne le code complet de chaque fichier.
```

---

## 🐳 PHASE 1 — BASE DE DONNÉES DOCKER

### Prompt 1.1 — docker-compose.yml complet
```
Génère le fichier docker-compose.yml complet pour le projet TransportEtud avec :

Services :
1. mysql :
   - image: mysql:8.0
   - container_name: transportetud_mysql
   - environment: MYSQL_ROOT_PASSWORD=root, MYSQL_DATABASE=transportetud_db, MYSQL_USER=transport_user, MYSQL_PASSWORD=transport2026
   - ports: 3306:3306
   - volume: mysql_data:/var/lib/mysql
   - healthcheck pour vérifier que MySQL est prêt

2. phpmyadmin :
   - image: phpmyadmin:latest
   - container_name: transportetud_pma
   - ports: 8081:80
   - depends_on: mysql
   - environment: PMA_HOST=mysql, PMA_USER=root, PMA_PASSWORD=root

3. backend (optionnel, commenté) :
   - build: ./backend
   - ports: 8080:8080
   - depends_on: mysql

4. frontend (optionnel, commenté) :
   - build: ./frontend
   - ports: 3000:80

volumes: mysql_data

Donne aussi les commandes Docker à exécuter :
- Démarrer : docker-compose up -d
- Arrêter : docker-compose down
- Voir logs : docker-compose logs -f mysql
- Accéder au shell MySQL : docker exec -it transportetud_mysql mysql -u root -p
```

### Prompt 1.2 — Scripts Flyway de migration
```
Génère tous les scripts de migration Flyway pour TransportEtud dans backend/src/main/resources/db/migration/ :

V1__create_utilisateurs.sql :
- Table utilisateurs(id, nom, prenom, email, mot_de_passe, role ENUM('ETUDIANT','ADMIN','RESPONSABLE','CHAUFFEUR'), telephone, actif, date_creation, date_modification)

V2__create_etudiants.sql :
- Table etudiants(id FK→utilisateurs, numero_etudiant UNIQUE, filiere, annee_etude, photo_url, carte_etudiant_url)

V3__create_lignes_arrets.sql :
- Table lignes(id, nom, point_depart, point_arrivee, description, est_active)
- Table arrets(id, nom, adresse, ordre, ligne_id FK→lignes)

V4__create_bus_chauffeurs_trajets.sql :
- Table chauffeurs(id FK→utilisateurs, numero_permis)
- Table bus(id, immatriculation UNIQUE, marque, capacite, statut ENUM('ACTIF','EN_MAINTENANCE','HORS_SERVICE'))
- Table trajets(id, heure_depart, heure_arrivee, jours_semaine, places_disponibles, ligne_id, bus_id, chauffeur_id)

V5__create_tarifs_inscriptions.sql :
- Table tarifs(id, type_abonnement ENUM('MENSUEL','SEMESTRIEL','ANNUEL'), montant DECIMAL(10,2), description)
- Table inscriptions(id, date_inscription, statut ENUM('EN_ATTENTE','VALIDEE','REJETEE','EXPIREE','ANNULEE'), type_abonnement, date_debut, date_fin, motif_rejet, etudiant_id, ligne_id, arret_id, tarif_id)

V6__create_paiements_badges.sql :
- Table paiements(id, montant, date_paiement, mode_paiement ENUM('ESPECES','VIREMENT'), statut, reference_transaction, inscription_id FK→inscriptions)
- Table badges(id, code_qr UNIQUE, date_expiration, est_valide, inscription_id FK→inscriptions)

V7__create_notifications.sql :
- Table notifications(id, type, message TEXT, date_envoi, est_lue, utilisateur_id FK→utilisateurs)

V8__insert_data.sql :
- Insère 3 tarifs (Mensuel=2000DA, Semestriel=10000DA, Annuel=18000DA)
- Insère 1 admin par défaut (email: admin@transport.univ, mot_de_passe hashé BCrypt de 'Admin@2026')
- Insère 3 lignes de bus exemples avec leurs arrêts

Donne le SQL complet pour chaque fichier.
```

---

## ⚙️ PHASE 2 — BACKEND SPRING BOOT

### Prompt 2.1 — Configuration principale
```
Génère tous les fichiers de configuration du backend Spring Boot TransportEtud :

1. application.properties (src/main/resources/) :
   - spring.datasource.url=jdbc:mysql://localhost:3306/transportetud_db
   - spring.datasource.username=transport_user / password=transport2026
   - spring.jpa.hibernate.ddl-auto=validate
   - spring.flyway.enabled=true
   - spring.mail.host=smtp.gmail.com, port=587, TLS
   - app.jwt.secret=clé secrète 256 bits, app.jwt.expiration=86400000
   - app.upload.dir=./uploads
   - spring.servlet.multipart.max-file-size=5MB
   - springdoc.swagger-ui.path=/swagger-ui.html

2. application-docker.properties (pour le conteneur Docker)

3. CorsConfig.java : CORS pour http://localhost:3000 (toutes routes, méthodes, headers)

4. OpenApiConfig.java : configuration Swagger avec Bearer JWT

5. Structure complète des packages :
   com.transportetud
   ├── controller/
   ├── service/
   ├── repository/
   ├── model/entity/
   ├── model/dto/request/
   ├── model/dto/response/
   ├── security/
   ├── exception/
   ├── util/
   └── config/
```

### Prompt 2.2 — Entités JPA
```
Génère toutes les entités JPA du projet TransportEtud dans le package com.transportetud.model.entity :

1. Utilisateur.java (@Entity, @Table("utilisateurs"), héritage @Inheritance(JOINED), implémente UserDetails)
   - Champs : id, nom, prenom, email, motDePasse, role (enum Role), telephone, actif
   - @CreationTimestamp dateCreation, @UpdateTimestamp dateModification
   - Annotations Lombok : @Data, @NoArgsConstructor, @AllArgsConstructor, @Builder

2. Etudiant.java (@Entity, extends Utilisateur)
   - Champs : numeroEtudiant, filiere, anneeEtude, photoUrl, carteEtudiantUrl
   - Relation : @OneToMany inscriptions

3. Administrateur.java (@Entity, extends Utilisateur)

4. ResponsableTransport.java (@Entity, extends Utilisateur)

5. Chauffeur.java (@Entity, extends Utilisateur)
   - Champ : numeroPermis

6. Ligne.java (@Entity)
   - Champs : id, nom, pointDepart, pointArrivee, description, estActive
   - @OneToMany arrets, @OneToMany trajets

7. Arret.java (@Entity)
   - Champs : id, nom, adresse, ordre
   - @ManyToOne ligne

8. Bus.java (@Entity)
   - Champs : id, immatriculation, marque, capacite, statut (enum StatutBus)

9. Trajet.java (@Entity)
   - Champs : id, heureDepart, heureArrivee, joursSemaine, placesDisponibles
   - @ManyToOne ligne, @ManyToOne bus, @ManyToOne chauffeur

10. Tarif.java (@Entity)
    - Champs : id, typeAbonnement (enum TypeAbonnement), montant, description

11. Inscription.java (@Entity)
    - Champs : id, dateInscription, statut (enum StatutInscription), typeAbonnement, dateDebut, dateFin, motifRejet
    - @ManyToOne etudiant, @ManyToOne ligne, @ManyToOne arret, @ManyToOne tarif
    - @OneToOne paiement, @OneToOne badge

12. Paiement.java (@Entity)
    - Champs : id, montant, datePaiement, modePaiement (enum), statut, referenceTransaction
    - @OneToOne inscription

13. Badge.java (@Entity)
    - Champs : id, codeQr, dateExpiration, estValide
    - @OneToOne inscription

14. Notification.java (@Entity)
    - Champs : id, type, message, dateEnvoi, estLue
    - @ManyToOne utilisateur

Génère aussi les enums : Role, StatutBus, StatutInscription, TypeAbonnement, ModePaiement

Donne le code Java complet avec toutes les annotations.
```

### Prompt 2.3 — Repositories
```
Génère tous les Repository Spring Data JPA pour TransportEtud dans com.transportetud.repository :

1. UtilisateurRepository : findByEmail, existsByEmail
2. EtudiantRepository : findByNumeroEtudiant, existsByNumeroEtudiant, findByEmail
3. InscriptionRepository : findByEtudiantId, findByStatut, findByStatutAndLigneId, findAllByDateFinBefore (pour expirations), countByStatut, Page<Inscription> findAll(Specification, Pageable)
4. LigneRepository : findByEstActiveTrue, findByNomContaining
5. ArretRepository : findByLigneId, findByLigneIdOrderByOrdre
6. BusRepository : findByStatut, findByCapaciteGreaterThan
7. TrajetRepository : findByLigneId, findByBusId, findByChauffeurId, findByJoursSemaineContaining
8. PaiementRepository : findByInscriptionId, findByDatePaiementBetween, sumMontantByDateBetween
9. BadgeRepository : findByCodeQr, findByInscriptionId, findByEstValideAndDateExpirationBefore
10. NotificationRepository : findByUtilisateurIdOrderByDateEnvoiDesc, findByUtilisateurIdAndEstLueFalse, countByUtilisateurIdAndEstLueFalse
11. TarifRepository : findByTypeAbonnement

Chaque interface extend JpaRepository avec les bonnes signatures de méthodes.
```

### Prompt 2.4 — DTOs
```
Génère tous les DTOs (Data Transfer Objects) pour TransportEtud :

Package com.transportetud.model.dto.request :
- RegisterRequest : nom, prenom, email, motDePasse, telephone, numeroEtudiant, filiere, anneeEtude + validations @NotBlank, @Email, @Size
- LoginRequest : email, motDePasse
- InscriptionRequest : ligneId, arretId, typeAbonnement + @NotNull
- PaiementRequest : inscriptionId, montant, modePaiement, referenceTransaction
- LigneRequest : nom, pointDepart, pointArrivee, description
- ArretRequest : nom, adresse, ordre, ligneId
- BusRequest : immatriculation, marque, capacite, statut
- TrajetRequest : heureDepart, heureArrivee, joursSemaine, ligneId, busId, chauffeurId
- ValidationRequest : motifRejet (pour le rejet)
- ChangePasswordRequest : ancienMotDePasse, nouveauMotDePasse

Package com.transportetud.model.dto.response :
- AuthResponse : accessToken, tokenType="Bearer", role, nom, prenom, email
- EtudiantResponse : tous les champs étudiant + statut inscription actuelle
- InscriptionResponse : tous les champs + nomLigne + nomArret + nomEtudiant
- LigneResponse : id, nom, depart, arrivee, nbArrets, nbInscrits
- BadgeResponse : id, codeQr, dateExpiration, estValide, qrCodeBase64
- PaiementResponse : id, montant, date, mode, statut, reference
- StatistiquesResponse : totalInscrits, enAttente, valides, rejetes, revenuTotal, tauxRemplissage
- NotificationResponse : id, type, message, dateEnvoi, estLue
- ErrorResponse : timestamp, status, message, details

Utilise @Data, @Builder, @NoArgsConstructor, @AllArgsConstructor de Lombok.
```

### Prompt 2.5 — Sécurité JWT
```
Génère la configuration complète de sécurité Spring Security 6 + JWT pour TransportEtud :

1. JwtTokenProvider.java (com.transportetud.security) :
   - generateToken(Authentication auth) → retourne JWT signé HMAC-SHA256
   - generateToken(String email) → overload
   - getEmailFromToken(String token) → extrait le sujet
   - validateToken(String token) → true/false avec log des erreurs
   - getExpirationFromToken(String token)
   - Lit app.jwt.secret et app.jwt.expiration depuis application.properties

2. JwtAuthenticationFilter.java (extends OncePerRequestFilter) :
   - Extrait le token du header Authorization: Bearer ...
   - Valide et charge UserDetails
   - Définit SecurityContextHolder

3. CustomUserDetailsService.java (implements UserDetailsService) :
   - loadUserByUsername(email) → charge depuis UtilisateurRepository

4. SecurityConfig.java (@Configuration, @EnableMethodSecurity) :
   - Bean SecurityFilterChain avec :
     * CORS activé (CorsConfig)
     * CSRF désactivé (API stateless)
     * Routes publiques : /api/auth/**, /swagger-ui/**, /v3/api-docs/**
     * Toutes autres routes : authentifiées
     * sessionManagement STATELESS
     * Ajout JwtAuthenticationFilter avant UsernamePasswordAuthenticationFilter
   - Bean AuthenticationManager
   - Bean PasswordEncoder (BCrypt facteur 12)

5. SecurityUtils.java : méthode statique getCurrentUserEmail()
```

### Prompt 2.6 — Gestion des Exceptions
```
Génère la gestion globale des erreurs pour TransportEtud :

1. Exceptions personnalisées (com.transportetud.exception) :
   - ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue)
   - BadRequestException(String message)
   - UnauthorizedException(String message)
   - FileUploadException(String message)
   - InscriptionException(String message) — pour règles métier (ex: déjà inscrit, plus de place)

2. GlobalExceptionHandler.java (@RestControllerAdvice) :
   - @ExceptionHandler(ResourceNotFoundException.class) → 404
   - @ExceptionHandler(BadRequestException.class) → 400
   - @ExceptionHandler(UnauthorizedException.class) → 401
   - @ExceptionHandler(MethodArgumentNotValidException.class) → 400 avec liste des erreurs de validation
   - @ExceptionHandler(MaxUploadSizeExceededException.class) → 413
   - @ExceptionHandler(Exception.class) → 500

   Chaque handler retourne ErrorResponse avec timestamp, status, message, path.
```

### Prompt 2.7 — Services & Controllers Authentification
```
Génère le module d'authentification complet pour TransportEtud :

AuthService.java (com.transportetud.service) :
- register(RegisterRequest dto) → crée Etudiant, encode mot de passe, retourne AuthResponse
- login(LoginRequest dto) → authentifie, génère JWT, retourne AuthResponse
- forgotPassword(String email) → génère token reset (UUID stocké en base), envoie email
- resetPassword(String token, String nouveauMDP) → valide token, change mot de passe
- changePassword(String email, ChangePasswordRequest dto)

AuthController.java (@RestController, @RequestMapping("/api/auth")) :
- POST /register → public
- POST /login → public
- POST /logout → authentifié
- POST /forgot-password → public
- POST /reset-password → public
- POST /change-password → authentifié (@PreAuthorize)

Donne le code complet avec @Operation Swagger sur chaque endpoint.
```

### Prompt 2.8 — Service & Controller Inscriptions
```
Génère le module inscription complet pour TransportEtud :

InscriptionService.java :
- soumettre(InscriptionRequest dto, String emailEtudiant) :
  * Vérifie que l'étudiant n'a pas déjà une inscription active sur cette ligne
  * Vérifie places disponibles
  * Calcule tarif selon typeAbonnement
  * Calcule dateDebut et dateFin selon type (Mensuel +30j, Semestriel +180j, Annuel +365j)
  * Sauvegarde inscription statut=EN_ATTENTE
  * Envoie notification email de confirmation
- getMesInscriptions(String email) → liste pour l'étudiant connecté
- getInscriptionById(Long id) → avec contrôle d'accès
- getAllInscriptions(String statut, Long ligneId, Pageable pageable) → pour admin (Specification JPA)
- valider(Long id) → statut=VALIDEE, envoie email avec montant
- rejeter(Long id, String motif) → statut=REJETEE, envoie email avec motif
- annuler(Long id, String email) → statut=ANNULEE (étudiant ou admin)
- renouveler(Long id, String email)
- expireInscriptions() → @Scheduled(cron="0 0 2 * * *") — expire les abonnements dépassés

InscriptionController.java (@RequestMapping("/api/inscriptions")) :
- POST / → @PreAuthorize ETUDIANT
- GET /mes-inscriptions → ETUDIANT
- GET /{id} → authentifié
- GET / → ADMIN (avec filtres + pagination)
- PATCH /{id}/valider → ADMIN
- PATCH /{id}/rejeter → ADMIN
- PATCH /{id}/annuler → ETUDIANT ou ADMIN
- POST /{id}/renouveler → ETUDIANT
- POST /{id}/upload-documents → ETUDIANT (MultipartFile photo, carte)

Donne le code Java complet.
```

### Prompt 2.9 — Paiement, Badge, QR Code, PDF
```
Génère les modules Paiement + Badge pour TransportEtud :

PaiementService.java :
- enregistrerPaiement(PaiementRequest dto, String emailAdmin) :
  * Vérifie inscription VALIDEE et non déjà payée
  * Sauvegarde paiement
  * Déclenche généraBadge(inscriptionId)
  * Envoie email avec reçu PDF joint
- getHistoriquePaiements(Long inscriptionId)
- genererRecuPdf(Long paiementId) → byte[] (PDF via iText 7)

BadgeService.java :
- genererBadge(Long inscriptionId) :
  * Génère UUID unique → codeQR
  * Génère image QR Code avec ZXing (300x300px)
  * Génère PDF badge avec iText 7 (photo étudiant, nom, ligne, dates, QR Code)
  * Sauvegarde badge en BD
- telechargerBadge(Long badgeId, String email) → byte[] PDF
- verifierBadge(String codeQr) → BadgeResponse (valide ou non + infos)
- invaliderBadgesExpires() → @Scheduled

PaiementController.java (@RequestMapping("/api/paiements")) :
- POST / → ADMIN
- GET /{id}/recu → ResponseEntity<byte[]> content-type application/pdf
- GET /historique/{inscriptionId}

BadgeController.java (@RequestMapping("/api/badges")) :
- GET /{id}/download → ResponseEntity<byte[]>
- GET /verify/{codeQr} → public (pour scanner)
- GET /{id}/qr-image → ResponseEntity<byte[]> image/png

Inclus le code complet d'iText 7 pour le PDF badge et ZXing pour le QR Code.
```

### Prompt 2.10 — Lignes, Bus, Trajets
```
Génère les modules de gestion des ressources transport pour TransportEtud :

LigneService.java + LigneController.java (/api/lignes) :
- CRUD complet (creer, modifier, supprimer, lister, getById)
- getArretsByLigne(Long ligneId)
- getPlacesDisponibles(Long ligneId) → compte places restantes sur les trajets actifs
- @PreAuthorize RESPONSABLE pour create/update/delete, GET public

ArretService.java + ArretController.java (/api/arrets) :
- CRUD complet
- Tri automatique par ordre dans la ligne

BusService.java + BusController.java (/api/bus) :
- CRUD complet
- changement de statut (ACTIF, EN_MAINTENANCE, HORS_SERVICE)

TrajetService.java + TrajetController.java (/api/trajets) :
- CRUD complet
- getTrajetsByLigne(Long ligneId)
- getMonPlanning(String emailChauffeur) → pour le chauffeur connecté
- getPassagersTrajet(Long trajetId) → liste des étudiants inscrits sur cette ligne

Donne le code Java complet de chaque fichier.
```

### Prompt 2.11 — Notifications & Rapports
```
Génère les modules notifications et rapports pour TransportEtud :

EmailService.java (com.transportetud.util) :
- sendEmail(String to, String subject, String templateName, Map<String,Object> variables)
  (utilise JavaMailSender + Thymeleaf TemplateEngine)
- Templates Thymeleaf à créer dans resources/templates/emails/ :
  * confirmation-dossier.html
  * dossier-valide.html
  * dossier-rejete.html
  * badge-pret.html
  * rappel-expiration.html

NotificationService.java :
- creerNotification(Long userId, String type, String message)
- getMesNotifications(String email, Pageable pageable)
- marquerCommeLue(Long notifId, String email)
- marquerToutesCommeLues(String email)
- getRappelsExpiration() → @Scheduled(cron="0 0 8 * * *") — J-7 et J-1

NotificationController.java (/api/notifications) :
- GET / → mes notifications paginées
- PATCH /{id}/lire
- PATCH /lire-toutes
- GET /count-non-lues → nombre badge

RapportService.java :
- getStatistiquesGlobales() → StatistiquesResponse (totaux, revenus, taux remplissage par ligne)
- getRapportInscriptionsParPeriode(LocalDate debut, LocalDate fin)
- exporterExcel(LocalDate debut, LocalDate fin) → byte[] (Apache POI)
- exporterPdf(LocalDate debut, LocalDate fin) → byte[] (iText 7)

RapportController.java (/api/rapports) :
- GET /statistiques → ADMIN
- GET /export/excel → ResponseEntity<byte[]>
- GET /export/pdf → ResponseEntity<byte[]>
```

---

## ⚛️ PHASE 3 — FRONTEND REACT

### Prompt 3.1 — Setup & Configuration React
```
Génère la configuration complète du frontend React TransportEtud (Vite + React 18) :

1. vite.config.js :
   - proxy /api vers http://localhost:8080
   - alias @ → src/

2. src/config/api.js :
   - Instance Axios avec baseURL='/api'
   - Intercepteur request : ajoute Authorization: Bearer <token> depuis localStorage
   - Intercepteur response : si 401 → redirige vers /login, si erreur → rejette avec message lisible

3. src/store/index.js (Redux Toolkit) :
   - authSlice : { user, token, isAuthenticated, role }
   - reducers : setCredentials, logout
   - Persistance dans localStorage

4. src/router/index.jsx (React Router v6) :
   - Routes publiques : /, /login, /register, /forgot-password, /reset-password/:token, /badges/verify/:code
   - ProtectedRoute : vérifie isAuthenticated → redirige /login si non connecté
   - RoleRoute : vérifie le rôle → redirige si accès refusé
   - Routes par rôle :
     * /dashboard (commun)
     * /etudiant/* (ETUDIANT)
     * /admin/* (ADMIN)
     * /responsable/* (RESPONSABLE)
     * /chauffeur/* (CHAUFFEUR)

5. src/theme/theme.js : thème MUI personnalisé
   - palette primary: #0f3460, secondary: #e94560
   - Typography: Inter
   - Composants arrondis (borderRadius 10)

6. src/App.jsx : RouterProvider + ThemeProvider + Redux Provider

Donne le code complet.
```

### Prompt 3.2 — Pages Auth
```
Génère les pages d'authentification pour TransportEtud (React + MUI) :

1. src/pages/auth/LoginPage.jsx :
   - Formulaire MUI : email + mot de passe + bouton Connexion
   - Appel POST /api/auth/login via Axios
   - Stocke token + user dans Redux (setCredentials)
   - Redirige selon rôle : /admin/dashboard, /etudiant/dashboard, /responsable/dashboard, /chauffeur/dashboard
   - Lien "Mot de passe oublié" et "Créer un compte"
   - Gestion erreurs (toast MUI Snackbar)
   - Design premium : fond dégradé, carte centrée avec logo

2. src/pages/auth/RegisterPage.jsx :
   - Formulaire en 2 étapes (stepper MUI) :
     * Étape 1 : nom, prénom, email, téléphone, mot de passe
     * Étape 2 : numéro étudiant, filière, année d'études
   - Validation en temps réel (react-hook-form ou useState)
   - Appel POST /api/auth/register
   - Redirige vers /login après succès avec message de confirmation

3. src/pages/auth/ForgotPasswordPage.jsx :
   - Champ email + bouton Envoyer
   - Affiche message de confirmation après envoi

4. src/pages/auth/ResetPasswordPage.jsx :
   - Récupère token depuis URL params
   - Champs : nouveau mot de passe + confirmation
   - Appel POST /api/auth/reset-password

Donne le code JSX complet avec styles MUI.
```

### Prompt 3.3 — Espace Étudiant
```
Génère toutes les pages de l'espace étudiant pour TransportEtud (React + MUI) :

1. src/pages/etudiant/EtudiantDashboard.jsx :
   - Barre latérale avec liens : Tableau de bord, Nouvelle inscription, Mes inscriptions, Mon badge, Mes paiements, Mon profil
   - Cartes de résumé : statut inscription actuelle, jours restants abonnement, ligne assignée
   - Timeline de l'état du dossier (MUI Stepper horizontal)

2. src/pages/etudiant/NouvelleInscription.jsx :
   - Formulaire multi-étapes (MUI Stepper) :
     * Étape 1 : Sélectionner une ligne (liste des lignes avec capacités)
     * Étape 2 : Choisir son arrêt (liste des arrêts de la ligne)
     * Étape 3 : Choisir type abonnement (cartes cliquables avec prix)
     * Étape 4 : Upload photo + carte étudiante (MUI file input)
     * Étape 5 : Résumé + Confirmer
   - Appel POST /api/inscriptions + POST /{id}/upload-documents

3. src/pages/etudiant/MesInscriptions.jsx :
   - Tableau MUI DataGrid des inscriptions
   - Chips colorés pour statuts (EN_ATTENTE=orange, VALIDEE=vert, REJETEE=rouge)
   - Bouton Annuler (si EN_ATTENTE)
   - Bouton Renouveler (si VALIDEE et proche expiration)

4. src/pages/etudiant/MonBadge.jsx :
   - Affiche badge sous forme de carte visuelle (design carte transport)
   - Image QR Code centrée
   - Bouton Télécharger PDF
   - Statut de validité (valide/expiré)

5. src/pages/etudiant/MesPaiements.jsx :
   - Liste des paiements avec bouton Télécharger Reçu

6. src/pages/etudiant/MonProfil.jsx :
   - Affichage et modification infos personnelles
   - Changement de mot de passe
   - Upload photo de profil

Donne le code JSX complet.
```

### Prompt 3.4 — Espace Administrateur
```
Génère toutes les pages de l'espace administrateur pour TransportEtud (React + MUI) :

1. src/pages/admin/AdminDashboard.jsx :
   - Sidebar navigation : Tableau de bord, Inscriptions, Étudiants, Paiements, Rapports, Paramètres
   - 4 cartes KPI : Total inscrits, En attente, Revenus du mois, Taux de remplissage
   - Graphique bar chart (recharts) : inscriptions par mois
   - Graphique pie chart : répartition par type abonnement
   - Tableau des dernières inscriptions (5 dernières avec actions rapides)

2. src/pages/admin/GestionInscriptions.jsx :
   - MUI DataGrid avec :
     * Colonnes : Étudiant, Ligne, Arrêt, Type, Date, Statut, Actions
     * Filtres : par statut, par ligne, par date (MUI DatePicker)
     * Pagination côté serveur
   - Dialog de validation : aperçu dossier + boutons Valider/Rejeter
   - Dialog de rejet : champ motif obligatoire
   - Téléchargement des documents uploadés

3. src/pages/admin/GestionPaiements.jsx :
   - Liste des paiements avec statut
   - Formulaire enregistrement paiement manuel
   - Bouton télécharger reçu PDF

4. src/pages/admin/Rapports.jsx :
   - Sélecteur de période (DateRangePicker)
   - Affichage statistiques
   - Boutons Exporter Excel / Exporter PDF

5. src/pages/admin/GestionEtudiants.jsx :
   - Liste étudiants avec recherche
   - Vue détail étudiant (historique inscriptions)
   - Activation/désactivation compte

Donne le code JSX complet.
```

### Prompt 3.5 — Espace Responsable
```
Génère toutes les pages de l'espace responsable transport pour TransportEtud (React + MUI) :

1. src/pages/responsable/GestionLignes.jsx :
   - DataGrid des lignes avec CRUD (MUI Dialog pour add/edit)
   - Pour chaque ligne : nom, départ, arrivée, nb arrêts, nb inscrits, statut actif/inactif
   - Bouton voir les arrêts (expand row ou navigate)

2. src/pages/responsable/GestionArrets.jsx :
   - Sélecteur de ligne (Select MUI)
   - Liste des arrêts avec ordre drag-and-drop (react-beautiful-dnd ou simple ordre)
   - CRUD arrêts

3. src/pages/responsable/GestionBus.jsx :
   - DataGrid des bus
   - Statut coloré (Actif=vert, Maintenance=orange, Hors service=rouge)
   - CRUD bus

4. src/pages/responsable/GestionTrajets.jsx :
   - Vue calendrier hebdomadaire des trajets (FullCalendar ou tableau par jour)
   - Création trajet : sélection ligne, bus, chauffeur, horaires, jours
   - Affectation chauffeur

5. src/pages/responsable/PlacesDisponibles.jsx :
   - Vue générale du taux de remplissage par ligne (progress bars)

Donne le code JSX complet.
```

### Prompt 3.6 — Espace Chauffeur & Pages Communes
```
Génère les pages de l'espace chauffeur et les composants communs pour TransportEtud :

Espace Chauffeur :
1. src/pages/chauffeur/ChauffeurDashboard.jsx :
   - Prochain trajet du jour (carte avec heure, ligne, nb passagers)
   - Planning de la semaine (tableau jours/horaires)

2. src/pages/chauffeur/ListePassagers.jsx :
   - Sélecteur de trajet (par date)
   - Liste des étudiants inscrits avec photo, nom, arrêt de montée
   - Scanner QR Code (react-qr-scanner ou bouton qui ouvre input caméra)
   - Affiche statut badge (valide/invalide) après scan

Composants communs partagés (src/components/) :

3. Layout/AppLayout.jsx : Sidebar + Header + Outlet (selon rôle)
4. UI/StatCard.jsx : carte KPI réutilisable
5. UI/StatusChip.jsx : chip coloré pour statuts
6. UI/LoadingSpinner.jsx : spinner centré
7. UI/ConfirmDialog.jsx : dialog confirmation générique
8. UI/NotificationBell.jsx : icône cloche + badge nombre non lus (polling toutes 30s)
9. UI/FileUpload.jsx : dropzone pour upload fichiers
10. Pages/NotFound.jsx (404) et Forbidden.jsx (403)

Hooks personnalisés (src/hooks/) :
- useAuth() : retourne user, token, isAuthenticated, role depuis Redux
- useNotifications() : polling notifications, count non lues
- usePagination() : gestion pagination DataGrid

Donne le code JSX complet.
```

### Prompt 3.7 — Services API Axios
```
Génère tous les services Axios pour TransportEtud dans src/services/ :

authService.js : login, register, logout, forgotPassword, resetPassword, changePassword

inscriptionService.js :
- soumettre(data) → POST /api/inscriptions
- uploadDocuments(inscriptionId, formData) → POST multipart
- getMesInscriptions() → GET /api/inscriptions/mes-inscriptions
- getAll(params) → GET /api/inscriptions?statut=...&page=...
- getById(id) → GET /api/inscriptions/{id}
- valider(id) → PATCH /api/inscriptions/{id}/valider
- rejeter(id, motif) → PATCH /api/inscriptions/{id}/rejeter
- annuler(id) → PATCH /api/inscriptions/{id}/annuler
- renouveler(id) → POST /api/inscriptions/{id}/renouveler

paiementService.js : enregistrer, getRecu(id) [blob], getHistorique

badgeService.js : download(id) [blob], verify(codeQr), getQrImage(id) [blob]

ligneService.js : getAll, getById, create, update, delete, getArrets, getPlaces

busService.js : getAll, create, update, delete, changeStatut

trajetService.js : getAll, getByLigne, getMonPlanning, getPassagers, create, update, delete

rapportService.js : getStatistiques, exportExcel [blob], exportPdf [blob]

notificationService.js : getAll, marquerLue, marquerToutesLues, getCount

Pour les services retournant des fichiers blob, configure responseType: 'blob' et crée une fonction helper downloadFile(blob, filename).
```

---

## 🧪 PHASE 4 — TESTS

### Prompt 4.1 — Tests Backend JUnit
```
Génère les tests JUnit 5 + Mockito pour TransportEtud :

1. AuthServiceTest.java :
   - testRegisterSuccess()
   - testRegisterEmailAlreadyExists() → doit lever BadRequestException
   - testLoginSuccess()
   - testLoginWrongPassword() → doit lever UnauthorizedException

2. InscriptionServiceTest.java :
   - testSoumettreSuccess()
   - testSoumettreDejaInscrit() → doit lever InscriptionException
   - testSoumettreAucunePlaceDisponible() → doit lever InscriptionException
   - testValiderInscription()
   - testRejeterInscription()

3. InscriptionControllerTest.java (MockMvc) :
   - testPostInscription_Authenticated_Returns201()
   - testPostInscription_Unauthenticated_Returns401()
   - testGetInscriptions_AdminRole_Returns200()
   - testValiderInscription_AdminRole_Returns200()

4. BadgeServiceTest.java :
   - testGenererBadgeSuccess()
   - testVerifierBadgeValide()
   - testVerifierBadgeExpire()

Config : @SpringBootTest + @AutoConfigureMockMvc + @TestPropertySource(locations="classpath:application-test.properties") + H2 en mémoire pour les tests d'intégration.
```

### Prompt 4.2 — Tests E2E Cypress
```
Génère les tests Cypress E2E pour TransportEtud dans frontend/cypress/e2e/ :

1. auth.cy.js :
   - Inscription nouveau étudiant (formulaire complet)
   - Connexion avec compte valide
   - Connexion avec mauvais mot de passe → message erreur visible
   - Récupération mot de passe

2. inscription.cy.js :
   - Flux complet inscription : login étudiant → Nouvelle inscription → sélection ligne → arrêt → abonnement → upload docs → confirmation
   - Vérification statut "EN ATTENTE" après soumission

3. admin-validation.cy.js :
   - Login admin → liste dossiers → ouvrir dossier en attente → valider → vérifier statut VALIDEE

4. badge.cy.js :
   - Login étudiant → Mon badge → télécharger PDF → vérifier téléchargement

Chaque test utilise cy.intercept() pour mocker les appels API si nécessaire.
Génère aussi cypress.config.js et les fixtures (fixtures/etudiant.json, admin.json).
```

---

## 🚀 PHASE 5 — DÉPLOIEMENT

### Prompt 5.1 — Dockerfile & Docker Compose Production
```
Génère les fichiers de déploiement production pour TransportEtud :

1. backend/Dockerfile :
   - Multi-stage build :
     * Stage 1 (build) : maven:3.9-eclipse-temurin-17 → mvn clean package -DskipTests
     * Stage 2 (run) : eclipse-temurin:17-jre-alpine → COPY le JAR, EXPOSE 8080, ENTRYPOINT

2. frontend/Dockerfile :
   - Stage 1 (build) : node:20-alpine → npm ci && npm run build
   - Stage 2 (serve) : nginx:alpine → COPY dist/ → /usr/share/nginx/html
   - COPY nginx.conf → /etc/nginx/conf.d/default.conf

3. frontend/nginx.conf :
   - server { listen 80, root /usr/share/nginx/html }
   - location /api { proxy_pass http://backend:8080 }
   - location / { try_files $uri $uri/ /index.html } (SPA routing)

4. docker-compose.prod.yml (complet, tous services actifs) :
   - mysql, backend, frontend
   - Variables d'environnement depuis .env
   - Réseau transportetud_network
   - Volumes persistants

5. .env.example avec toutes les variables requises

6. GitHub Actions (.github/workflows/ci-cd.yml) :
   - On push main : build Maven, tests JUnit, build React, build images Docker, push DockerHub

Donne le code complet.
```

### Prompt 5.2 — Documentation finale
```
Génère la documentation finale pour TransportEtud :

1. README.md complet avec :
   - Description du projet
   - Prérequis (Java 17, Node 20, Docker)
   - Installation pas à pas :
     * git clone
     * docker-compose up -d (BD)
     * cd backend → mvn spring-boot:run
     * cd frontend → npm install && npm run dev
   - Variables d'environnement requises
   - URLs : Frontend http://localhost:3000, Backend http://localhost:8080, Swagger http://localhost:8080/swagger-ui.html, phpMyAdmin http://localhost:8081
   - Comptes par défaut (admin@transport.univ / Admin@2026)
   - Architecture du projet (arborescence)
   - Commandes utiles

2. Ajoute @Operation et @ApiResponse Swagger sur tous les controllers (résumé des annotations à ajouter)

Donne le contenu complet.
```

---

## 📋 RÉCAPITULATIF — ORDRE D'EXÉCUTION

| # | Prompt | Phase |
|---|--------|-------|
| 0.1 | Initialisation structure projet | Setup |
| 1.1 | docker-compose.yml + commandes Docker | DB |
| 1.2 | Scripts Flyway (V1 à V8) | DB |
| 2.1 | Configuration Spring Boot (properties, CORS, Swagger) | Backend |
| 2.2 | Entités JPA (14 classes + enums) | Backend |
| 2.3 | Repositories (11 interfaces) | Backend |
| 2.4 | DTOs Request + Response | Backend |
| 2.5 | Spring Security + JWT | Backend |
| 2.6 | Gestion des exceptions globale | Backend |
| 2.7 | Auth (Service + Controller) | Backend |
| 2.8 | Inscriptions (Service + Controller) | Backend |
| 2.9 | Paiement + Badge + PDF + QR Code | Backend |
| 2.10 | Lignes + Bus + Trajets (Services + Controllers) | Backend |
| 2.11 | Notifications + Rapports + Email | Backend |
| 3.1 | Config React (Axios, Redux, Router, Theme) | Frontend |
| 3.2 | Pages Auth (Login, Register, Forgot, Reset) | Frontend |
| 3.3 | Espace Étudiant (6 pages) | Frontend |
| 3.4 | Espace Administrateur (5 pages) | Frontend |
| 3.5 | Espace Responsable (5 pages) | Frontend |
| 3.6 | Espace Chauffeur + Composants communs | Frontend |
| 3.7 | Services Axios (8 fichiers) | Frontend |
| 4.1 | Tests JUnit 5 + Mockito | Tests |
| 4.2 | Tests E2E Cypress | Tests |
| 5.1 | Dockerfiles + docker-compose.prod.yml + CI/CD | Déploiement |
| 5.2 | README + Documentation Swagger | Docs |

---

*TransportEtud v1.0 — Guide Prompts Agent IA — Mai 2026*
