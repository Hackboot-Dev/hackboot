# 🚀 API Routes - Hackboot

**SOURCE DE VÉRITÉ** pour toutes les routes API du projet.

---

## Table des matières
- [Routes Carrières](#routes-carrières)

---

## Routes Carrières

### POST /api/careers/apply
**Description**: Soumet une candidature et envoie les informations structurées à Telegram

**Permission**: Publique (aucune authentification requise)

**Params**:
- `firstName` (string, required) - Prénom du candidat
- `lastName` (string, required) - Nom du candidat
- `email` (string, required) - Email du candidat
- `phone` (string, optional) - Téléphone du candidat
- `location` (string, optional) - Localisation du candidat
- `position` (string, required) - Poste visé
- `department` (string, optional) - Département
- `startDate` (string, optional) - Date de disponibilité
- `motivation` (string, required) - Lettre de motivation
- `salary` (string, required) - Prétentions salariales
- `portfolio` (string, optional) - Portfolio / GitHub / LinkedIn
- `remote` (string, required) - Préférence de travail (full/hybrid/office)
- `availability` (string, optional) - Disponibilité pour un entretien
- `message` (string, optional) - Message / Questions
- `gdpr` (boolean, required) - Consentement RGPD
- `newsletter` (boolean, optional) - Souscription newsletter
- `cv` (string, required) - CV en base64 (PDF)
- `cvFileName` (string, required) - Nom du fichier CV

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Application submitted successfully"
}
```

**Response Error (400)**:
```json
{
  "error": "Missing required fields"
}
```

**Response Error (500)**:
```json
{
  "error": "Failed to submit application"
}
```

**Intégration Telegram**:
- Token: `8496898839:AAEd01EKYQwxPIqCtNtaJ1VqOsXGSTgTzi4`
- Chat ID: Défini dans `TELEGRAM_CHAT_ID` (env variable)
- Envoie 2 messages :
  1. Message formaté avec toutes les infos du candidat (HTML)
  2. Document PDF du CV

**Fichiers associés**:
- Route API: `/app/api/careers/apply/route.ts`
- Page formulaire: `/app/[locale]/careers/apply/page.tsx`
- Traductions: `/public/locales/*/common.json` → `careers.apply`

---

## Notes importantes

- ✅ Toutes les routes sont documentées ici
- ⚠️ Toute nouvelle route DOIT être ajoutée immédiatement
- 🔒 Les permissions sont indiquées pour chaque route
- 📝 Les paramètres requis sont marqués "required"
