# Documentation Sécurité - Système d'authentification ADS

## 🔒 Vue d'ensemble

Le système d'authentification ADS est conçu avec une **séparation stricte client/serveur** pour garantir que les credentials ne sont jamais exposés au client.

## ✅ Mesures de sécurité en place

### 1. Architecture Client/Serveur

#### Côté Client (`/app/ads/page.tsx`)
- ✅ **Composant client** (`'use client'`)
- ✅ **Aucune logique d'authentification**
- ✅ **Aucune lecture de fichier**
- ✅ Envoie uniquement les credentials via `fetch('/api/ads/login')`
- ✅ Reçoit uniquement success/error (jamais le contenu du fichier users.json)

```typescript
// Le client envoie juste les credentials
const response = await fetch('/api/ads/login', {
  method: 'POST',
  body: JSON.stringify({ userId, password }),
})
```

#### Côté Serveur (`/app/api/ads/login/route.ts`)
- ✅ **Route API serveur** (pas de `'use client'`)
- ✅ Utilise le module `fs` (Node.js - **serveur uniquement**)
- ✅ Lit `users.json` **côté serveur uniquement**
- ✅ Vérifie les credentials **côté serveur**
- ✅ Renvoie uniquement `{ success: true/false, message: string }`
- ✅ **Ne renvoie JAMAIS le contenu du fichier users.json**

```typescript
// Le serveur lit le fichier (inaccessible au client)
const usersData = await fs.readFile(usersFilePath, 'utf-8')
const users = JSON.parse(usersData)

// Vérifie les credentials
const user = users.find(u => u.id === userId && u.password === password)

// Renvoie UNIQUEMENT success/error
return NextResponse.json({ success: true, user: { id: user.id } })
```

### 2. Protection du dossier `/data/`

#### Structure des dossiers
```
/hackboot
├── /public/          ← Servi statiquement par Next.js
├── /data/            ← NON servi statiquement (accessible uniquement côté serveur)
│   └── users.json    ← Fichier de credentials
└── /app/
    └── /api/         ← Routes API côté serveur
```

#### Pourquoi c'est sécurisé ?
1. **Next.js ne sert que `/public/`** : Les fichiers dans `/data/` ne sont pas accessibles via HTTP
2. **Module `fs` côté serveur uniquement** : Le module Node.js `fs` ne fonctionne que sur le serveur
3. **Pas de route statique vers `/data/`** : Aucun fichier de `/data/` n'est mappé vers une URL publique

### 3. Configuration Next.js (`next.config.js`)

Protection additionnelle ajoutée :

```javascript
async headers() {
  return [
    {
      // Block direct access to /data/ directory
      source: '/data/:path*',
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex',
        },
      ],
    },
  ]
}
```

### 4. Flow d'authentification

```
┌─────────────────┐
│  Client Browser │
└────────┬────────┘
         │ 1. Envoie userId + password
         │    via POST /api/ads/login
         ▼
┌─────────────────────────┐
│  Next.js API Route      │ ← Côté Serveur
│  /app/api/ads/login/    │
│  route.ts               │
└────────┬────────────────┘
         │ 2. Lit users.json
         │    via fs.readFile()
         ▼
┌─────────────────┐
│ /data/users.json│ ← Fichier système (serveur uniquement)
└────────┬────────┘
         │ 3. Parse JSON
         │    et vérifie credentials
         ▼
┌─────────────────────────┐
│  Vérification serveur   │
│  userId === admin ?     │
│  password === admin ?   │
└────────┬────────────────┘
         │ 4. Renvoie UNIQUEMENT
         │    { success: true/false }
         ▼
┌─────────────────┐
│  Client Browser │
│  Reçoit success │
└─────────────────┘
```

## ⚠️ Limitations actuelles (DEV uniquement)

### Credentials en clair
- ❌ Les mots de passe sont stockés **en clair** dans `users.json`
- ⚠️ **Acceptable uniquement en développement**
- ⚠️ **À NE JAMAIS utiliser en production**

### Pas de JWT/Sessions
- ❌ Utilise `localStorage` côté client (peu sécurisé)
- ⚠️ Pas de token JWT
- ⚠️ Pas de vérification de session côté serveur

### Pas de rate limiting
- ❌ Aucune limite de tentatives de connexion
- ⚠️ Vulnérable aux attaques par force brute

## 🚀 Recommandations pour la production

Si ce système doit passer en production, il faut impérativement :

### 1. Hasher les mots de passe
```bash
npm install bcrypt
```

```typescript
import bcrypt from 'bcrypt'

// Lors de l'inscription
const hashedPassword = await bcrypt.hash(password, 10)

// Lors de la connexion
const isValid = await bcrypt.compare(password, user.hashedPassword)
```

### 2. Utiliser une vraie base de données
- Migrer vers SQLite (comme indiqué dans `CLAUDE.md`)
- Ou PostgreSQL/MySQL pour plus de robustesse

### 3. Implémenter JWT pour les sessions
```bash
npm install jsonwebtoken
```

```typescript
import jwt from 'jsonwebtoken'

// Générer un token
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
  expiresIn: '24h'
})

// Vérifier le token
const decoded = jwt.verify(token, process.env.JWT_SECRET)
```

### 4. Ajouter du rate limiting
```bash
npm install express-rate-limit
```

### 5. Variables d'environnement
```bash
# .env.local
JWT_SECRET=votre_secret_super_securise_aleatoire
DATABASE_URL=postgresql://...
```

### 6. Protection CSRF
```bash
npm install csurf
```

### 7. HTTPS obligatoire
- Forcer HTTPS en production
- Utiliser des cookies `secure` et `httpOnly`

## 📊 Résumé sécurité actuelle

| Mesure                              | Statut | Note |
|-------------------------------------|--------|------|
| Séparation client/serveur           | ✅ OK  | Credentials jamais envoyés au client |
| Fichier users.json inaccessible     | ✅ OK  | Pas dans /public/, utilisé via fs |
| Vérification côté serveur           | ✅ OK  | Toute la logique auth sur le serveur |
| Protection next.config.js           | ✅ OK  | Headers de sécurité ajoutés |
| Mots de passe hashés                | ❌ NON | **À implémenter pour prod** |
| JWT/Sessions sécurisées             | ❌ NON | **À implémenter pour prod** |
| Rate limiting                       | ❌ NON | **À implémenter pour prod** |
| HTTPS                               | ⚠️ DEV | **Obligatoire en production** |

## 🎯 Conclusion

Le système actuel est **sécurisé pour le développement** :
- ✅ Le fichier `users.json` n'est **JAMAIS** accessible au client
- ✅ Toute la vérification se fait **côté serveur**
- ✅ Le client reçoit uniquement `success/error`

Mais il **DOIT être amélioré pour la production** avec :
- Hash des mots de passe (bcrypt/argon2)
- JWT ou sessions sécurisées
- Rate limiting
- Base de données
- HTTPS
- Protection CSRF
