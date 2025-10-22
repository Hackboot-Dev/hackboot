# 📚 Documentation Hackboot

## Index Central de la Documentation

Bienvenue dans la documentation du projet Hackboot. Ce fichier sert d'index principal pour naviguer dans toute la documentation du projet.

## 📁 Structure de la Documentation

### 📊 Documents Principaux

- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - État actuel du projet, fonctionnalités implémentées, en cours
- **[JOURNAL.md](./JOURNAL.md)** - Journal détaillé de toutes les actions de développement
- **[API_ROUTES.md](./API_ROUTES.md)** - Documentation de toutes les routes API (à créer)
- **[DATABASE.md](./DATABASE.md)** - Schéma de base de données (à créer si nécessaire)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture technique du système (à créer)

### 🎨 Design et UI

- **[CHARTE_GRAPHIQUE.md](./CHARTE_GRAPHIQUE.md)** - Standards visuels et composants UI (à créer)

### 🔒 Sécurité

- **[SECURITY.md](./SECURITY.md)** - Documentation sécurité complète (à créer)

### 📂 Données

- **[DATA_ARCHITECTURE.md](./DATA_ARCHITECTURE.md)** - Architecture et séparation des données (à créer)

### ✨ Fonctionnalités

- **[FEATURES.md](./FEATURES.md)** - Liste des fonctionnalités (à créer)
- **[DOCUMENTATION_FEATURES.md](./DOCUMENTATION_FEATURES.md)** - Index des documentations détaillées (à créer)
- **[features/](./features/)** - Dossier contenant les documentations détaillées par feature
- **Pages produits gaming** - Voir la section dédiée ci-dessous sur la structure et les traductions

### 🐛 Maintenance

- **[BUGS.md](./BUGS.md)** - Bugs connus et résolus (à créer)
- **[DECISIONS.md](./DECISIONS.md)** - Décisions techniques importantes (à créer)

### 📋 Planification

- **[PLAN.md](./PLAN.md)** - Plan de développement actif (à créer si nécessaire)

## 🚀 Quick Start

Le projet Hackboot est une application web moderne construite avec Next.js 14, proposant une expérience utilisateur premium avec des animations fluides et un design inspiré d'Awwwards.

### Technologies principales :
- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **i18n:** Support multi-langues (FR, EN, ET)
- **UI:** Design moderne avec glassmorphism et animations

### Commandes utiles :
```bash
npm run dev     # Lancer le serveur de développement
npm run build   # Build de production
npm run start   # Lancer la production
npm run lint    # Vérifier le code
```

## 📝 Conventions

- Documentation en français
- Code et commentaires techniques en anglais
- Commits descriptifs avec tags (feat, fix, docs, etc.)
- Mise à jour systématique de la documentation

## 🔄 Dernières mises à jour

Voir [JOURNAL.md](./JOURNAL.md) pour l'historique complet des modifications.

## 🕹️ Pages produits gaming

Cette section résume le fonctionnement des pages produits cloud gaming : où sont stockées les données, comment la localisation est organisée et quelle structure utilisent les pages côté Next.js.

### 📦 Données produits
- Les fiches sont définies dans [`data/gaming-products.json`](../data/gaming-products.json).
  - Chaque entrée précise l'identifiant, le `slug`, le niveau d'optimisation (`native` ou `community`), la description marketing et les métriques de performance.
  - Les tableaux `resolutionGuidance` et `technicalSpecs` exposent les FPS, la latence et les informations réseau injectées telles quelles dans l'interface.
  - Les variantes peuvent embarquer `featureHighlights`, `featureGroups` (titre, description, éléments) et `implementationNotes` pour décrire les suites PulseForge ; ces blocs sont traduits via les overrides de `copyByLocale.product.variants`.
- Les utilitaires d'accès et les types associés vivent dans [`lib/gaming-products.ts`](../lib/gaming-products.ts).
  - `getAllGamingProducts()` et `getGamingProductBySlug()` alimentent les routes dynamiques.

### 🌐 Localisation
- Les textes génériques (navigation, CTA, footer, listes) sont stockés dans [`public/locales/<locale>/common.json`](../public/locales).
- Le contenu narratif propre aux offres natives est regroupé dans [`components/NativeGamingProductPage.tsx`](../components/NativeGamingProductPage.tsx) via la constante `copyByLocale`.
  - Ajouter une langue consiste à dupliquer l'objet existant et adapter les champs textuels.
- Les pages communautaires réutilisent les traductions du dossier `public/locales` et les textes définis directement dans [`components/CommunityGamingProductPage.tsx`](../components/CommunityGamingProductPage.tsx).

### 🏗️ Construction des pages
- Le routeur [`app/[locale]/products/[slug]/page.tsx`](../app/%5Blocale%5D/products/%5Bslug%5D/page.tsx) charge le produit demandé et choisit quel composant rendre :
  - `optimizationLevel === 'native'` ⟶ [`NativeGamingProductPage`](../components/NativeGamingProductPage.tsx)
  - sinon ⟶ [`CommunityGamingProductPage`](../components/CommunityGamingProductPage.tsx)
- Les deux vues encapsulent le contenu dans `<SiteHeader />`, `<main className="pt-28 pb-24">` et `<Footer />` afin de conserver la navigation cohérente.
- Les animations d’apparition, de remplissage des jauges et des CTA reposent sur `framer-motion`. Réutiliser `inViewFadeProps` / `fadeTransition` introduits dans les composants pour toute nouvelle section afin de garder un rythme homogène.

### ➕ Ajouter ou mettre à jour un produit
1. Modifier l'entrée cible dans `data/gaming-products.json` (métriques, visuels, variantes).
2. Vérifier que les champs requis par `lib/gaming-products.ts` sont renseignés.
3. Adapter la copie dans `NativeGamingProductPage.tsx` si le produit est natif (`copyByLocale`).
4. Compléter les traductions génériques dans `public/locales/<locale>/common.json` si besoin.
5. Lancer `npm run lint` pour valider les schémas avant de publier.

**Dernière action:** Harmonisation des animations framer-motion sur les pages native & communautaire (24/10/2025)

---

*Documentation maintenue selon les standards définis dans `/CLAUDE.md`*