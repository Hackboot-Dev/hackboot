# GeForce NOW Games Scraping - Findings

## Date: 2025-10-21

---

## Objectif
Récupérer la liste complète des jeux supportés par GeForce NOW depuis leur page officielle : `https://www.nvidia.com/en-us/geforce-now/games/`

---

## Découvertes

### 1. Endpoint API Identifié ✓
**URL:** `https://api-prod.nvidia.com/services/gfngames/v1/gameList`

**Source:** Trouvé dans le code JavaScript de la page web
```javascript
endpoint: "https://api-prod.nvidia.com/services/gfngames/v1/gameList"
```

### 2. Méthode HTTP
- **GET:** ✗ Retourne `405 Method Not Allowed`
- **POST:** ✗ Retourne `500 Internal Server Error` avec différents payloads

**Payloads testés:**
- `{}`
- `{"limit": 1000, "offset": 0}`
- `{"locale": "en-US"}`
- `{"locale": "en-US", "limit": 1000, "offset": 0}`

Tous retournent une erreur 500, ce qui suggère que l'API nécessite :
- Des headers d'authentification spécifiques
- Une clé API
- Un token de session
- Ou d'autres paramètres non découverts

### 3. Structure de la Page
- **Type:** Single Page Application (SPA) avec rendu côté client
- **Framework:** Probablement React ou similaire
- **Scripts:** 27 script tags trouvés
- **Données JSON:** Aucune liste de jeux trouvée directement dans le HTML statique

---

## Conclusion

**La page GeForce NOW charge les jeux dynamiquement via JavaScript.**

Les données ne sont **PAS** disponibles dans le HTML statique, ce qui signifie qu'il faut :

### Option 1: Utiliser un navigateur headless (Selenium/Playwright)
**Avantages:**
- Exécute le JavaScript comme un vrai navigateur
- Peut intercepter les requêtes réseau
- Accès aux données une fois le DOM chargé

**Inconvénients:**
- Plus lent
- Nécessite plus de ressources
- Plus complexe

### Option 2: Reverse engineer l'API
**À faire:**
1. Ouvrir la page dans un navigateur (Chrome DevTools)
2. Onglet Network → Filtrer XHR/Fetch
3. Recharger la page
4. Trouver la requête qui charge les jeux
5. Copier les headers exacts (Authorization, cookies, etc.)
6. Reproduire la requête en Python

### Option 3: Solution alternative
**Utiliser une source de données alternative:**
- Liste statique de jeux populaires
- API tierce (IGDB, SteamAPI, etc.)
- Scraper d'autres sites qui listent les jeux GFN
- Maintenir une liste manuelle des jeux les plus populaires

---

## Fichiers Créés

### Scripts Python
1. **`analyze_geforce_now.py`** - Analyse initiale de la structure HTML
2. **`fetch_geforce_games.py`** - Tentative de fetch API avec GET
3. **`scrape_with_selenium.py`** - Tentatives multiples (POST + extraction HTML)

### Données
1. **`geforce_now_raw.html`** - HTML complet de la page (pour inspection manuelle)

---

## Recommandations

### Court terme (Rapide)
**Ajouter manuellement les jeux les plus populaires** dans la catégorie `community`:
- Apex Legends ✓ (déjà ajouté)
- Fortnite ✓ (déjà ajouté)
- CS2 ✓ (déjà ajouté)
- League of Legends ✓ (déjà ajouté)
- Cyberpunk 2077
- Elden Ring
- God of War
- Hogwarts Legacy
- The Witcher 3
- Red Dead Redemption 2
- etc.

### Moyen terme (Optimal)
**Utiliser Playwright/Selenium** pour :
1. Charger la page complète
2. Attendre que les jeux se chargent
3. Extraire la liste depuis le DOM
4. Sauvegarder dans un fichier JSON

### Long terme (Automatisation)
**Créer un job automatisé** qui :
1. Récupère la liste une fois par semaine
2. Compare avec la liste existante
3. Ajoute automatiquement les nouveaux jeux en tant que `community`
4. Envoie une notification des changements

---

## Prochaines étapes suggérées

1. **Option simple:** Continuer d'ajouter manuellement les jeux populaires
   - Rapide à implémenter
   - Contrôle total sur le catalogue
   - Pas de dépendances externes

2. **Option avancée:** Utiliser Playwright
   ```bash
   pip install playwright
   playwright install chromium
   ```
   - Script qui charge la page
   - Attend le chargement complet
   - Extrait tous les jeux
   - Génère un JSON

3. **Option DevTools:** Intercepter manuellement la requête
   - Ouvrir Chrome DevTools
   - Onglet Network
   - Copier la requête exacte (cURL)
   - Convertir en Python requests

---

## État actuel
- ✓ Endpoint API découvert
- ✓ Scripts de test créés
- ✗ Accès direct à l'API bloqué
- ✗ Pas de données JSON dans HTML statique

**→ Solution recommandée: Utiliser Playwright ou ajouter manuellement**
