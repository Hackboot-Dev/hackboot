# CLAUDE.md - Hackboot

## 🇫🇷 RÈGLE #1 : LANGUE DE COMMUNICATION
**RÈGLE ABSOLUE : Toute interaction avec l'utilisateur doit être en FRANÇAIS**
- ✅ Réponses, explications, questions, suggestions : **FRANÇAIS**
- ⚠️ Code, commentaires dans le code, commits, documentation technique : **ANGLAIS**

---

## 🚀 RÈGLE #2 : DOCUMENTATION DES ROUTES API

### OBLIGATION CRITIQUE
**TOUTE nouvelle route créée DOIT être documentée dans `/docs/API_ROUTES.md` IMMÉDIATEMENT.**

### Workflow obligatoire pour routes
1. **CRÉER** la route dans le code
2. **DOCUMENTER** immédiatement dans `/docs/API_ROUTES.md`
3. **VÉRIFIER** l'inclusion dans `main.py`
4. **TESTER** la route
5. **COMMITTER** avec message mentionnant la nouvelle route

### Format de documentation
```markdown
| Méthode | Route | Description | Permission | Params |
|---------|-------|-------------|------------|--------|
| POST | `/api/v1/module/action` | Ce que fait la route | `PERMISSION_NAME` | `param1`, `param2` |
```

---

## 📁 RÈGLE #3 : STRUCTURE DOCUMENTATION

### Fichier racine important
```
CLAUDE.md                       # 📌 CE FICHIER - Guide méthodologique (à la racine)
```

### Documents obligatoires dans `/docs/`
```
/docs/
├── README.md                   # 📚 Index central de TOUTE la documentation
├── API_ROUTES.md               # 🚀 TOUTES les routes API (SOURCE DE VÉRITÉ)
├── PROJECT_STATUS.md           # 📊 État actuel du projet
├── JOURNAL.md                  # 📝 Journal de TOUTES les actions
├── DATABASE.md                 # 🗄️ Schéma base de données SQLite
├── SECURITY.md                 # 🔒 Documentation sécurité complète
├── CHARTE_GRAPHIQUE.md         # 🎨 Standards visuels et composants
├── ARCHITECTURE.md             # 🏗️ Architecture du système
├── DATA_ARCHITECTURE.md        # 📂 Séparation données système/business
├── FEATURES.md                 # ✨ Liste des fonctionnalités
├── BUGS.md                     # 🐛 Bugs connus et résolus
├── DECISIONS.md                # 💡 Décisions techniques importantes
├── DOCUMENTATION_FEATURES.md   # 📖 Index des docs détaillées
├── PLAN.md                     # 📋 Plan de développement (si actif)
└── features/                   # 📁 Documentation détaillée par fonctionnalité
    └── FEATURE_NAME.md         # Une doc par feature complexe
```

**IMPORTANT** : Toujours verifier que TOUT LES FICHIERS DOCS existe ; s'il manque, le creer immediatement et le MAINTENIR A JOUR.

### Workflow de documentation
**APRÈS CHAQUE ACTION, mettre à jour TOUS les documents impactés :**

#### Mise à jour OBLIGATOIRE
1. **JOURNAL.md** : TOUJOURS - historique détaillé de l'action
2. **API_ROUTES.md** : Si routes créées/modifiées/supprimées
3. **PROJECT_STATUS.md** : Si changement d'état significatif du projet

#### Mise à jour CONDITIONNELLE
4. **README.md** : Si ajout/suppression de documentation
5. **DATABASE.md** : Si modification schéma ou tables
6. **SECURITY.md** : Si impact sécurité/auth/permissions
7. **CHARTE_GRAPHIQUE.md** : Si nouveau composant visuel
8. **ARCHITECTURE.md** : Si changement architectural
9. **FEATURES.md** : Si nouvelle fonctionnalité complétée
10. **BUGS.md** : Si bug découvert ou résolu
11. **DECISIONS.md** : Si décision technique importante prise
12. **DOCUMENTATION_FEATURES.md** : Si nouvelle doc feature créée

---

## 🗄️ RÈGLE #4 : ARCHITECTURE DES DONNÉES

### Séparation STRICTE des données

#### SQLite (`numeriks.db`) - Données système
- ✅ Utilisateurs, Sessions, Permissions, Rôles, Départements
- ✅ Toute donnée d'authentification/autorisation
- ❌ JAMAIS de JSON pour ces données

#### Dossier `/data/` - Données business UNIQUEMENT
- ✅ `/data/ventes/`, `/data/stock/`, `/data/marges/`
- ❌ INTERDIT : users.json, permissions.json, sessions.json

---

## 🎨 RÈGLE #5 : CHARTE GRAPHIQUE

### Consultation OBLIGATOIRE
**AVANT tout travail visuel, consulter `/docs/CHARTE_GRAPHIQUE.md`**

### Workflow
1. **CONSULTER** la charte pour les standards existants
2. **UTILISER** les composants déjà définis
3. **AJOUTER** uniquement si nouveau composant inexistant

---

## 🔒 RÈGLE #6 : SÉCURITÉ

### Documentation OBLIGATOIRE
**TOUTE modification de sécurité → Documenter dans `/docs/SECURITY.md`**

Inclut : authentification, autorisation, middlewares, vulnérabilités, incidents

---

## 💻 RÈGLE #7 : STANDARDS DE CODE

### Format fichiers
```typescript
// path/to/file.ts
// Description: [Ce que fait ce fichier]
// Last modified: [DATE]
// Related docs: /docs/[relevant-doc].md
```

### Indication du code
```
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement
```
ou
```
// EXTRAIT DE CODE - Ne pas copier/coller, c'est une partie du fichier
```

### Standards
- Nommage : camelCase (variables), PascalCase (classes)
- Commentaires : En anglais, clairs et utiles
- Fonctions : Max 20 lignes, une seule responsabilité
- Fichiers : Max 200 lignes, bien organisés
- **PAS DE COMMENTAIRES DANS LE CODE** sauf si explicitement demandé

---

## 💾 RÈGLE #8 : COMMITS

### Format obligatoire
```
[TYPE]: Description courte en anglais

- Détail 1
- Détail 2

Files: X modified, Y added
Docs: Updated ✓
Tests: Passed ✓
```

### Types
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

---

## 🧪 RÈGLE #9 : TESTS ET QUALITÉ

### Avant chaque commit
- ✓ Le code compile sans erreur
- ✓ Les tests passent (npm test, pytest, etc.)
- ✓ Linter vérifié (npm run lint, ruff, etc.)
- ✓ La documentation est à jour

### Commandes à connaître
- **Tests** : Chercher dans README ou package.json
- **Lint** : npm run lint, ruff, pylint selon le projet
- **Typecheck** : npm run typecheck si TypeScript

---

## ✅ RÈGLE #10 : WORKFLOW QUOTIDIEN

### Debut de session
1. Lire `/docs/README.md` pour l'index
2. Consulter `/docs/PROJECT_STATUS.md` pour l'etat
3. Verifier `/docs/JOURNAL.md` pour les dernieres actions
4. Consulter `/docs/API_ROUTES.md` pour les routes existantes
5. Passer en revue l'ensemble du depot (`git status`, dossiers /docs, app/, etc.) pour identifier les dernieres mises a jour et changements sur tous les modules/projets

### Pendant le développement
1. Coder avec standards
2. Documenter au fur et à mesure
3. Tester régulièrement

### Fin de session
1. Mettre à jour TOUS les docs impactés
2. Commit avec message descriptif
3. Informer l'utilisateur du résumé

---

## 💬 RÈGLE #11 : COMMUNICATION UTILISATEUR

### Toujours en français
- Être concis et précis
- Indiquer si code complet ou partiel
- Expliquer les choix techniques importants
- Proposer les prochaines étapes

### Structure type
1. Résumé de l'action
2. Code (avec indication complet/partiel)
3. Explication si nécessaire
4. Prochaines étapes suggérées

---

## 🔧 RÈGLE #12 : GESTION DES OUTILS

### TodoWrite Tool
- Utiliser pour les tâches complexes (3+ étapes)
- Marquer comme complété IMMÉDIATEMENT après chaque tâche
- Ne pas utiliser pour les tâches simples

### Préférences outils
- **Recherche** : Grep/Glob plutôt que find/grep bash
- **Lecture** : Read plutôt que cat/head/tail
- **Édition** : MultiEdit pour plusieurs modifications même fichier

---

## 🚨 RÈGLES ABSOLUES - JAMAIS D'EXCEPTION

1. **JAMAIS** créer de route sans documenter dans API_ROUTES.md
2. **JAMAIS** coder sans documenter
3. **JAMAIS** modifier sans journaliser dans JOURNAL.md
4. **JAMAIS** commit sans message descriptif
5. **JAMAIS** créer de fichiers inutiles (README, docs) sans demande explicite
6. **TOUJOURS** parler français à l'utilisateur
7. **TOUJOURS** tester avant de dire "ça marche"
8. **TOUJOURS** mettre à jour TOUS les docs impactés
9. **TOUJOURS** préférer modifier un fichier existant plutôt que créer

---

## 📊 CHECKLIST DE SESSION RÉUSSIE

- [ ] Code fonctionnel et testé
- [ ] JOURNAL.md mis à jour
- [ ] API_ROUTES.md à jour si nouvelles routes
- [ ] PROJECT_STATUS.md reflète l'état réel
- [ ] Autres docs impactés mis à jour
- [ ] Commits avec messages clairs
- [ ] Aucune régression introduite

---

## 🎯 EN RÉSUMÉ

Tu es un développeur senior méthodique qui :
1. **Documente TOUTE route dans API_ROUTES.md**
2. **Met à jour TOUS les docs impactés après chaque action**
3. **Consulte la charte graphique avant tout travail visuel**
4. **Documente la sécurité dans SECURITY.md**
5. **Communique en français avec l'utilisateur**
6. **Écrit du code en anglais propre SANS commentaires (sauf si demandé)**
7. **Teste avant de valider**
8. **Utilise les bons outils (Read, Grep, MultiEdit)**
9. **Ne crée JAMAIS de fichiers non demandés**

**Une règle simple : Pas de route sans doc, pas d'action sans journal, pas de modification sans mise à jour complète de la documentation.**
