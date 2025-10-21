# 🕹️ Pages produits gaming

Cette note explique comment sont structurées les pages produits gaming, où vivent les données et comment fonctionne la traduction.

## 📦 Données produits
- Les fiches produits sont définies dans [`data/gaming-products.json`](../data/gaming-products.json).
  - Chaque entrée décrit l'identifiant, le `slug`, le niveau d'optimisation (`native` ou `community`), la description marketing et les métriques techniques.
  - Les tableaux `technicalSpecs` exposent les performances (FPS, latence, réseau) qui sont injectées tels quels dans l'interface.
- Les fonctions d'accès et les types TypeScript associés vivent dans [`lib/gaming-products.ts`](../lib/gaming-products.ts).
  - `getAllGamingProducts()` et `getGamingProductBySlug()` sont utilisés par les pages pour charger les données à l'exécution.

## 🌐 Localisation
- Les textes génériques de l'interface (navigation, footer, listes de jeux, CTA) sont stockés dans [`public/locales/<locale>/common.json`](../public/locales).
- Le contenu narratif spécifique aux pages natives (sections métriques, cartes de résolutions, conseils, etc.) est défini par langue directement dans [`components/NativeGamingProductPage.tsx`](../components/NativeGamingProductPage.tsx) via la constante `copyByLocale`.
  - Pour ajouter une nouvelle langue, dupliquez l'objet existant et adaptez le texte dans cette constante.
- Les pages communautaires réutilisent les traductions génériques (titres, CTA) depuis les fichiers JSON et les textes en dur présents dans [`components/CommunityGamingProductPage.tsx`](../components/CommunityGamingProductPage.tsx).

## 🏗️ Construction des pages
- Le routeur [`app/[locale]/products/[slug]/page.tsx`](../app/%5Blocale%5D/products/%5Bslug%5D/page.tsx) résout le produit demandé et décide quelle vue rendre :
  - `optimizationLevel === 'native'` ⟶ [`NativeGamingProductPage`](../components/NativeGamingProductPage.tsx)
  - sinon ⟶ [`CommunityGamingProductPage`](../components/CommunityGamingProductPage.tsx)
- Les deux vues chargent désormais automatiquement le header global (`SiteHeader`) et le footer (`Footer`) afin de conserver la navigation cohérente sur toutes les pages produits.
- Le contenu principal est encapsulé dans un `<main>` avec padding supérieur pour compenser le header fixe (`pt-28`) et un padding inférieur (`pb-24`) qui laisse de l'espace avant le footer.

## ➕ Ajouter / mettre à jour un produit
1. Créer ou mettre à jour l'entrée correspondante dans `data/gaming-products.json` (pensez aux métriques de performance et aux images).
2. Vérifier que les champs requis par `lib/gaming-products.ts` sont renseignés (variants, `technicalSpecs`, etc.).
3. Adapter la copie dans `NativeGamingProductPage.tsx` si le produit est natif (sections `copyByLocale`).
4. Compléter les traductions génériques si nécessaire dans `public/locales/<locale>/common.json`.
5. Lancer `npm run lint` pour valider le schéma et pousser les changements.

Ce flux garantit que toutes les pages produits s'affichent avec la navigation complète et les traductions appropriées.
