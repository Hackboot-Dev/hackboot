# 📚 Documentation Hackboot

## Index Central de la Documentation

Bienvenue dans la documentation du projet Hackboot. Ce fichier sert d'index principal pour naviguer dans toute la documentation du projet.

## 📁 Structure de la Documentation

### 📊 Documents Principaux

- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - État actuel du projet, fonctionnalités implémentées, en cours
- **[JOURNAL.md](./JOURNAL.md)** - Journal détaillé de toutes les actions de développement
- **[API_ROUTES.md](./API_ROUTES.md)** - Documentation de toutes les routes API
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
- Les variantes peuvent embarquer `featureHighlights`, `featureGroups` (titre, description, éléments) et `implementationNotes` pour décrire les suites PulseForge ; le rendu se base maintenant sur un sélecteur interactif qui affiche un groupe à la fois pour limiter le scroll. Ces blocs sont traduits via les overrides de `copyByLocale.product.variants`.
- L’entrée `gaming-warzone` suit cette structure pour Call of Duty: Warzone : métriques BR (FPS multi-résolutions, option « CPU Boost »), variantes PulseForge et suites de fonctionnalités orientées Battle Royale.
- L’entrée `gaming-valorant` applique le même modèle pour Valorant : performances Esports 1080p/1440p/4K, contrôleur de résolution, onglets PulseForge Lobby et notes de conformité fair-play.
- L’entrée `gaming-battlefield6` décline l’offre Battlefield 6 PulseForge : profils Conquest/Breakthrough, benchmarks CPU/GPU, option « CPU Boost » et onglets PulseForge Lobby pour les scénarios véhicules et objectifs.
- L’entrée `gaming-destiny2` reprend la même logique pour Destiny 2 : métriques PvE/PvP (402/356/246 FPS), option « CPU Boost », modules tactiques raids/Trials et onglets PulseForge Lobby pour les sandbox DPS.
- L’entrée `gaming-dota2` étend l’offre PulseForge pour Dota 2 : profils Medium 405/380/300 FPS, option « CPU Boost », modules teamfight fair-play et onglets PulseForge Lobby (lane lab, warding planner, cosmétiques partagés).
- Les utilitaires d'accès et les types associés vivent dans [`lib/gaming-products.ts`](../lib/gaming-products.ts).
  - `getAllGamingProducts()` et `getGamingProductBySlug()` alimentent les routes dynamiques.

### 🌐 Localisation
- Les textes génériques (navigation, CTA, footer, listes) sont stockés dans [`public/locales/<locale>/common.json`](../public/locales).
- Le contenu narratif propre aux offres natives est regroupé dans [`components/NativeGamingProductPage.tsx`](../components/NativeGamingProductPage.tsx) via la constante `copyByLocale`.
  - Ajouter une langue consiste à dupliquer l'objet existant et adapter les champs textuels.
  - Les textes spécifiques à une offre (ex. PulseForge Warzone) sont fusionnés via `localeOverridesByProduct` pour injecter les métriques, descriptions cloud et variantes traduites dans chaque langue.
- Les pages communautaires réutilisent les traductions du dossier `public/locales` et les textes définis directement dans [`components/CommunityGamingProductPage.tsx`](../components/CommunityGamingProductPage.tsx).
  - La grille « configuration standard » a été retirée : la vue se concentre désormais sur les abonnements, la description longue et les avantages génériques du catalogue.

### 🏗️ Construction des pages
- Le routeur [`app/[locale]/products/[slug]/page.tsx`](../app/%5Blocale%5D/products/%5Bslug%5D/page.tsx) charge le produit demandé et choisit quel composant rendre :
  - `optimizationLevel === 'native'` ⟶ [`NativeGamingProductPage`](../components/NativeGamingProductPage.tsx)
  - sinon ⟶ [`CommunityGamingProductPage`](../components/CommunityGamingProductPage.tsx)
- Les deux vues encapsulent le contenu dans `<SiteHeader />`, `<main className="pt-28 pb-24">` et `<Footer />` afin de conserver la navigation cohérente.
- Les animations d’apparition, de remplissage des jauges et des CTA reposent sur `framer-motion`. Réutiliser les presets `inViewFadeProps`, `inViewSlideProps`, `inViewScaleProps`, `inViewTiltProps` ainsi que `fadeTransition` pour toute nouvelle section afin de garder un rythme cohérent. Les listes de fonctionnalités natives utilisent en complément `AnimatePresence` pour la transition entre onglets.
- Les effets au survol doivent rester légers : privilégier les helpers `hoverLiftProps` et `hoverGlowProps` déjà présents pour appliquer translation, légère mise à l’échelle et halo lumineux sur les cartes interactives.

### ➕ Ajouter ou mettre à jour un produit
1. Modifier l'entrée cible dans `data/gaming-products.json` (métriques, visuels, variantes).
2. Vérifier que les champs requis par `lib/gaming-products.ts` sont renseignés.
3. Adapter la copie dans `NativeGamingProductPage.tsx` si le produit est natif (`copyByLocale`).
4. Compléter les traductions génériques dans `public/locales/<locale>/common.json` si besoin.
5. Lancer `npm run lint` pour valider les schémas avant de publier.

**Dernière action:** Nettoyage des animations de la page About (suppression des halos et compteurs, 24/10/2025)

## 🛠️ Page Services premium

La page services (`app/[locale]/services/page.tsx`) reprend désormais les codes visuels du reste du site :

- **Hero harmonisé** : fond `bg-dark`, badge en `glass-effect` et titre `gradient-text` pour rester aligné avec l’accueil et les pages produits. Les apparitions reposent sur `LazyMotion` et respectent `useReducedMotion`.
- **Piliers tabulaires** : boutons latéraux et carte détaillée utilisent le même glassmorphism que les fiches produits. Les stats sont encapsulées dans des panneaux `glass-effect` pour garder une lecture homogène.
- **Modules & process** : cartes et étapes réemploient le combo `glass-effect` + border blanche, avec les mêmes animations `whileInView` que le catalogue PulseForge.
- **Bloc contact** : panel gradient adouci, métriques SLA et CTA principal conservent le rendu premium tout en respectant les proportions et micro-interactions communes.
- **Performances** : structure légère (plus de dépendances tierces), hover subtils et suppression des artefacts 3 FPS observés auparavant.

## 🧬 Page About (Notre histoire)

La page about conserve sa structure narrative (hero parallax, stats, timeline, valeurs) mais les animations ont été réécrites pour éliminer les ralentissements signalés :

- **Hook `useReveal`** : chaque carte (stats, mission/vision, timeline, valeurs) s’appuie sur l’observer léger (`lib/hooks/useReveal.ts`) pour déclencher des transitions CSS (`opacity`, `translate`, `scale`).
- **Hero simplifié** : plus de parallax ni de halos animés ; seul le fade-in graduel du badge/titre/texte est conservé.
- **Timeline** : la progression verticale continue d’utiliser le calcul ponctuel `requestAnimationFrame` pour l’animation de scroll « Notre parcours ».
- **Cartes & stats** : suppression des compteurs progressifs et des rotations 3D ; les hovers se limitent à de légers `scale`/`opacity`.
- **Décor maîtrisé** : les arrière-plans dynamiques (`ParticleBackground`, `MorphingShape`) ne sont plus montés sur la page pour éviter tout coût GPU inutile.

---

*Documentation maintenue selon les standards définis dans `/CLAUDE.md`*
