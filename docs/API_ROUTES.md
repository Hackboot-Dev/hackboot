# Routes API - HACKBOOT

## Table des matières
- [Routes API](#routes-api)
  - [Authentification ADS](#authentification-ads)
  - [Produits](#produits)

---

## Authentification ADS

### POST /api/ads/login

**Description**: Authentification pour le panneau d'administration ADS

**Permissions**: Aucune (public endpoint)

**Body Parameters**:
```json
{
  "userId": "string",
  "password": "string"
}
```

**Réponse succès (200)**:
```json
{
  "success": true,
  "message": "Authentification réussie",
  "user": {
    "id": "admin"
  }
}
```

**Réponse erreur (401)**:
```json
{
  "message": "Identifiants invalides"
}
```

**Fichier source**: `/app/api/ads/login/route.ts`
**Fichier credentials**: `/data/users.json`

---

## Produits

### GET /api/products/[slug]/images

**Description**: Récupère la liste des images pour un produit gaming

**Permissions**: Aucune (public endpoint)

**URL Parameters**:
- `slug`: Identifiant du produit (ex: `gaming-overwatch-phantom`)

**Réponse succès (200)**:
```json
{
  "images": [
    "/images/products/overwatch/phantom/main.png",
    "/images/products/overwatch/phantom/screenshot1.png"
  ]
}
```

**Fichier source**: `/app/api/products/[slug]/images/route.ts`

---

## Conventions

### Format des routes
- Toutes les routes API sont préfixées par `/api/`
- Utilisation de la structure Next.js App Router
- Routes dynamiques avec `[param]`

### Codes de statut HTTP
- `200`: Succès
- `400`: Requête invalide
- `401`: Non authentifié
- `403`: Non autorisé
- `404`: Non trouvé
- `500`: Erreur serveur

### Format des réponses
Toutes les réponses sont au format JSON avec une structure cohérente :
```json
{
  "success": true|false,
  "message": "Message descriptif",
  "data": {}
}
```
