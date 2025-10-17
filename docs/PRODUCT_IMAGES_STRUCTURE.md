# Structure des dossiers d'images produits

## 📂 Mapping des produits vers leurs dossiers

| Slug du produit | Dossier des images |
|-----------------|-------------------|
| `gaming-overwatch-phantom` | `/public/images/products/overwatch/phantom/` |
| `gaming-overwatch-dominion` | `/public/images/products/overwatch/dominion/` |
| `gaming-overwatch-godmode` | `/public/images/products/overwatch/godmode/` |
| `gaming-warzone-reaper` | `/public/images/products/warzone/reaper/` |
| `gaming-warzone-reaper2` | `/public/images/products/warzone/reaper2/` |
| `gaming-valorant-oblivion` | `/public/images/products/valorant/oblivion/` |

## 🎯 Règle de nommage

Pour un slug au format : `gaming-[JEU]-[PRODUIT]`

Le dossier sera : `/public/images/products/[JEU]/[PRODUIT]/`

## 🖼️ Nommage des fichiers d'images

- **main.png** (ou .jpg, .jpeg, .webp) : Image principale du produit, affichée en premier
- **1.png**, **2.png**, **3.png**, etc. : Images secondaires de la galerie (dans n'importe quel format)

**Note**: Il n'y a pas de format obligatoire. Les images peuvent être en .png, .jpg, .jpeg, .webp, etc.

## 📝 Comment ajouter des images

1. Identifiez le slug du produit
2. Naviguez vers le dossier correspondant
3. Déposez les images avec le nommage approprié :
   - `main.png` pour l'image principale
   - `1.png`, `2.png`, `3.png` pour la galerie
4. Les images apparaissent automatiquement sur la page produit dans leur **format natif** (pas de déformation en 16:9)

## ⚡ Système automatique

- **PAS BESOIN** de modifier le fichier JSON
- **PAS BESOIN** de redémarrer le serveur
- Les images sont chargées dynamiquement via l'API `/api/products/[slug]/images`
- Les images sont triées automatiquement : `main.*` en premier, puis les autres par ordre alphabétique

## 🎨 Affichage des images

- **Page produit** : Les images sont affichées dans leur format original (object-contain)
- **Page liste des produits** : Les images sont affichées dans leur format original (object-contain)
- **Galerie** : Les miniatures sont affichées dans leur format original

Aucune déformation en 16:9 n'est appliquée.