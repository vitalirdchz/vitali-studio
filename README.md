# 🎬 Vitali Studio — Vitrine & CMS Studio de Montage Vidéo & Clipping IA

Site vitrine officiel et interface d'administration sur-mesure pour **Vitali Studio**, agence premium spécialisée dans le montage vidéo dynamique et le clipping par Intelligence Artificielle (Shorts, Reels, TikTok, YouTube).

---

## ⚡ Stack Technique

- **Front-end** : React (Vite), Tailwind CSS, Framer Motion (animations cinématiques et discrètes), React Icons.
- **Design System** : Thème Dark épuré (`#181825`), accents néon en dégradé signature (Rose `#FF0050` vers Cyan `#00F2FE`), typographies géométriques (*Poppins* pour les titres, *Inter* pour le corps).
- **Back-end & Serverless** : Netlify Serverless Functions (Architecture ES Modules).
- **Base de données** : MongoDB via Mongoose (connexion persistante cachée pour Serverless).
- **Sécurité** : Authentification par code d'accès unique (`ADMIN_ACCESS_CODE`) via en-tête sécurisé `x-admin-code`.
- **Formulaires** : Netlify Forms intégré nativement sur la section Contact.

---

## 📂 Architecture du Projet

```
vitali-studio/
├── netlify.toml                        # Configuration de build et redirection SPA Netlify
├── package.json
├── tailwind.config.js
├── vite.config.js
│
├── netlify/
│   └── functions/                      # Serverless API Netlify
│       ├── auth-check.js               # Validation du code d'accès admin
│       ├── services.js                 # CRUD Services
│       ├── portfolio.js                # CRUD Portfolio & Mes Créations (?category=...)
│       ├── faq.js                      # CRUD Foire aux Questions
│       ├── testimonials.js             # CRUD Avis & Témoignages clients
│       └── utils/
│           ├── auth.js                 # Middleware de vérification de l'en-tête admin + CORS
│           ├── db.js                   # Gestionnaire de connexion MongoDB mis en cache
│           └── models.js               # Schémas Mongoose (Service, PortfolioItem, FAQ, Testimonial)
│
└── src/
    ├── App.jsx                         # Routage React (/, /charte, /admin) avec Suspense
    ├── main.jsx
    ├── index.css                       # Variables Tailwind, dégradés, classes custom
    ├── pages/
    │   ├── Home.jsx                    # Assemblage de la page d'accueil
    │   ├── Charte.jsx                  # Page Charte Technique & Règlement (Règle du 1080p...)
    │   └── Admin.jsx                   # Page Admin sécurisée avec gestion de session
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx              # Header avec logo lumineux, liens d'ancres et burger menu
    │   │   └── Footer.jsx              # Footer moderne avec réseaux sociaux et mentions
    │   ├── home/
    │   │   ├── Hero.jsx                # Hero section cinématique avec statistiques
    │   │   ├── Services.jsx            # Grille modulaire des offres (Clipping 9:16, YouTube...)
    │   │   ├── Portfolio.jsx           # Réalisations clients avec filtre tags et aperçu vidéo
    │   │   ├── Creations.jsx           # Laboratoire d'expérimentations vidéo personnelles
    │   │   ├── Testimonials.jsx        # Carrousel d'avis clients avec notation étoiles
    │   │   ├── FAQ.jsx                 # Accordéon animé des questions fréquentes
    │   │   └── Contact.jsx             # Formulaire Netlify Forms + Call-to-Action Fiverr
    │   ├── admin/
    │   │   ├── AdminLogin.jsx          # Écran de verrouillage avec saisie du code PIN
    │   │   ├── AdminLayout.jsx         # Sidebar de navigation du back-office
    │   │   ├── AdminDashboard.jsx      # Métriques et compteurs en temps réel
    │   │   ├── AdminServices.jsx       # Gestionnaire complet (Ajout, Modif, Suppression)
    │   │   ├── AdminPortfolio.jsx      # Gestionnaire du portfolio client
    │   │   ├── AdminCreations.jsx      # Gestionnaire du Laboratoire créatif
    │   │   ├── AdminFAQ.jsx            # Gestionnaire de la FAQ
    │   │   └── AdminTestimonials.jsx   # Gestionnaire des avis clients
    │   └── ui/                         # Composants atomiques (Button, Card, GradientText, SectionTitle...)
    └── utils/
        └── api.js                      # Client API HTTP avec injection automatique du token admin
```

---

## 🚀 Déploiement sur Netlify

### 1. Préparation de la base de données (MongoDB Atlas)
1. Créez un compte gratuit sur [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Créez un cluster gratuit (Shared M0).
3. Dans **Database Access**, créez un utilisateur (ex: `vitali`) avec un mot de passe fort.
4. Dans **Network Access**, ajoutez l'IP `0.0.0.0/0` (accès depuis n'importe où, nécessaire pour les fonctions serverless Netlify).
5. Cliquez sur **Connect** > **Drivers** > copiez votre chaîne de connexion (ex: `mongodb+srv://vitali:<password>@cluster0.xxxxx.mongodb.net/vitali_studio?retryWrites=true&w=majority`).

### 2. Déploiement sur Netlify
1. Poussez le dossier sur votre compte GitHub/GitLab.
2. Rendez-vous sur votre dashboard [Netlify](https://app.netlify.com) et cliquez sur **Add new site** > **Import an existing project**.
3. Sélectionnez le dépôt `vitali-studio`.
4. Les paramètres de build sont automatiquement détectés grâce au fichier `netlify.toml` :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - **Functions directory** : `netlify/functions`
5. **CRUCIAL — Configuration des Variables d'Environnement** :
   Dans Netlify, allez dans **Site configuration** > **Environment variables** > **Add a variable** et configurez :
   - `MONGODB_URI` : Votre chaîne de connexion MongoDB Atlas avec le mot de passe complété.
   - `ADMIN_ACCESS_CODE` : Le mot de passe secret de votre choix (ex: `VitaliStudio2026!`).

### 3. Connexion au Panneau d'Administration
- Rendez-vous sur `https://votre-site.netlify.app/admin`.
- Saisissez votre `ADMIN_ACCESS_CODE`.
- Vous accédez à votre CMS sur-mesure pour ajouter, modifier ou supprimer vos services, vos réalisations et vos avis !
