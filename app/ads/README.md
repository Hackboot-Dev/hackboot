# 🎨 ADS Dashboard - Internal Creative Tools

## 📋 Description

Page interne d'outils créatifs pour générer rapidement des visuels publicitaires pour les réseaux sociaux. Accessible uniquement via URL directe avec authentification.

## 🔐 Accès

**URL:** `http://localhost:3000/ads` (ou `/ads` en production)

**Credentials par défaut:**
- Username: `admin`
- Password: `adminFkvirtuel`

⚠️ **Important:** Cette page n'est pas liée dans la navigation publique. Elle est accessible uniquement en tapant l'URL directement.

## 🛠️ Fonctionnalités

### ✅ Disponible
- **Social Media Images** - Génération d'images pour réseaux sociaux
  - Instagram Post (1080×1080)
  - Instagram Story (1080×1920)
  - Facebook Post (1200×630)
  - Twitter/X Post (1200×675)
  - LinkedIn Post (1200×627)
  - YouTube Thumbnail (1280×720)

### 🚧 À venir
- Video Ads Generator
- Landing Pages Mockups
- AI Content Generator

## 📁 Structure des fichiers

```
/app/ads/
├── page.tsx                           # Page de login
├── dashboard/
│   ├── page.tsx                       # Dashboard principal
│   └── social-images/
│       └── page.tsx                   # Générateur d'images sociales
├── README.md                          # Ce fichier

/app/api/ads/
└── login/
    └── route.ts                       # API d'authentification

/data/
└── ads-users.json                     # Base de données utilisateurs ADS

/scripts/
└── generate-password-hash.js          # Script pour générer des hash de mots de passe
```

## 🔑 Gestion des utilisateurs

### Ajouter un nouvel utilisateur

1. Générer un hash de mot de passe:
```bash
node scripts/generate-password-hash.js
```

2. Ajouter l'utilisateur dans `/data/ads-users.json`:
```json
{
  "id": "user-002",
  "username": "nouveau_utilisateur",
  "passwordHash": "HASH_GENERE",
  "role": "user",
  "permissions": ["create", "edit"],
  "createdAt": "2025-10-29T00:00:00.000Z"
}
```

### Rôles et permissions

**Roles:**
- `admin` - Accès complet à tous les outils
- `user` - Accès limité aux outils de création

**Permissions:**
- `create` - Créer des contenus
- `edit` - Éditer des contenus
- `delete` - Supprimer des contenus
- `publish` - Publier des contenus

## 🔒 Sécurité

### JWT Token
- Expiration: 24h
- Stockage: localStorage (`ads-token`)
- Secret: Configuré via `ADS_JWT_SECRET` (environnement)

### Variables d'environnement recommandées

Ajouter dans `.env.local`:
```env
ADS_JWT_SECRET=votre-secret-tres-complexe-et-unique
```

### Bonnes pratiques
- ✅ Changer le mot de passe par défaut en production
- ✅ Utiliser un JWT_SECRET fort et unique
- ✅ Ne jamais committer les credentials
- ✅ Limiter les permissions selon les besoins
- ✅ Renouveler régulièrement les mots de passe

## 📝 Utilisation

### 1. Connexion
- Aller sur `/ads`
- Entrer username et password
- Cliquer sur "Sign In"

### 2. Dashboard
- Voir la liste des outils disponibles
- Cliquer sur un outil pour l'ouvrir

### 3. Social Media Images
- Sélectionner un format (Instagram, Facebook, etc.)
- Remplir le contenu (titre, sous-titre, CTA)
- Prévisualiser en temps réel
- Copier le HTML ou exporter en PNG

## 🎨 Design System

Le dashboard ADS utilise la même charte graphique que le site principal:
- Fond noir (#000000)
- Glassmorphism effect
- Gradients purple-blue
- Animations fluides
- Design responsive

## 🚀 Développement

### Ajouter un nouvel outil

1. Créer le composant dans `/app/ads/dashboard/nom-outil/page.tsx`

2. Ajouter l'outil dans le tableau `tools` de `/app/ads/dashboard/page.tsx`:
```typescript
{
  id: 'nom-outil',
  name: 'Nom de l\'outil',
  description: 'Description de l\'outil',
  icon: IconComponent,
  gradient: 'from-color-500 to-color-500',
  href: '/ads/dashboard/nom-outil',
  available: true,
}
```

3. Implémenter la logique métier

### Tester localement

```bash
npm run dev
```

Puis aller sur `http://localhost:3000/ads`

## 📊 Technologies utilisées

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **bcryptjs** - Hash des mots de passe
- **jsonwebtoken** - Authentification JWT
- **Lucide React** - Icônes

## 🐛 Dépannage

### "Invalid credentials"
- Vérifier username et password
- Vérifier que le hash dans `ads-users.json` est correct

### "Network error"
- Vérifier que l'API `/api/ads/login` est accessible
- Vérifier la console pour plus de détails

### Redirection vers login
- Le token JWT a peut-être expiré (24h)
- Le token est stocké dans localStorage
- Se reconnecter pour obtenir un nouveau token

## 📞 Support

Pour toute question ou problème, se référer à la documentation principale dans `/docs/README.md`.

---

**Dernière mise à jour:** 29 octobre 2025
**Version:** 1.0.0
