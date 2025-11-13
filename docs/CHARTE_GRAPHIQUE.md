# 🎨 CHARTE GRAPHIQUE HACKBOOT

**Version:** 1.0
**Date:** 29 octobre 2025
**Plateforme:** Hackboot Gaming Cloud
**Univers:** Gaming haute performance, Cloud gaming, E-sport premium

---

## 📑 TABLE DES MATIÈRES

1. [Identité visuelle](#1-identité-visuelle)
2. [Palette de couleurs](#2-palette-de-couleurs)
3. [Typographie](#3-typographie)
4. [Logo et symbole](#4-logo-et-symbole)
5. [Système de grille et espacement](#5-système-de-grille-et-espacement)
6. [Composants UI](#6-composants-ui)
7. [Animations et effets](#7-animations-et-effets)
8. [Iconographie](#8-iconographie)
9. [Images et illustrations](#9-images-et-illustrations)
10. [Ton et style](#10-ton-et-style)
11. [Accessibilité](#11-accessibilité)
12. [Guidelines d'utilisation](#12-guidelines-dutilisation)

---

## 1. IDENTITÉ VISUELLE

### 🎯 Positionnement de marque

**Hackboot** est une plateforme de gaming cloud premium positionnée sur :
- **Performance extrême** : FPS élevés, latence minimale, optimisations natives
- **Innovation technologique** : Cloud gaming, IA, coaching adaptatif
- **E-sport professionnel** : Outils tactiques, analytics, compétition
- **Accessibilité premium** : Interface moderne, expérience fluide, glassmorphism

### 🌌 Univers visuel

**Ambiance :** Futuriste, cyberpunk élégant, minimaliste premium
**Tonalité :** Sombre, lumineuse par touches, énergique, technologique
**Inspiration :** Sci-fi moderne, interfaces holographiques, gaming high-tech

**Mots-clés visuels :**
- Dark mode élégant
- Glassmorphism subtil
- Gradients vibrants (bleu, violet, rose)
- Effets de lumière (glow, blur, shadow)
- Animations fluides
- Géométrie hexagonale

---

## 2. PALETTE DE COULEURS

### 🎨 Couleurs principales

#### Background (Noir profond)
```css
--background-start: #000000     /* Noir pur */
--background-end: #0A0A0A       /* Noir très profond */
--background-gradient: linear-gradient(to bottom, #000000, #0A0A0A)
```

**Usage :** Fond principal de tout le site, fond des cartes, fond des modals

#### Texte (Blanc éclatant)
```css
--foreground: #FFFFFF           /* Blanc pur - texte principal */
--text-gray-300: #D1D5DB        /* Gris clair - texte secondaire */
--text-gray-400: #9CA3AF        /* Gris moyen - texte tertiaire */
--text-gray-500: #6B7280        /* Gris foncé - texte désactivé */
```

**Usage :** Titres en blanc pur, corps en gray-300, sous-titres en gray-400

#### Accent principal (Bleu électrique)
```css
--accent-primary: #0066FF       /* Bleu électrique - CTA principal */
--accent-hover: #0052CC         /* Bleu foncé - hover CTA */
```

**Usage :** Boutons CTA principaux, liens actifs, éléments interactifs clés

---

### 🌈 Gradients secondaires (6 ensembles)

#### Gradient 1 : Blue → Purple (Signature Hackboot)
```css
--gradient-blue-purple: linear-gradient(135deg, #0066FF 0%, #8B5CF6 100%)
```
**Hex:** `#0066FF` → `#8B5CF6`
**Usage :** Boutons CTA, header actif, effets hover principaux

#### Gradient 2 : Purple → Pink (Logo et accents)
```css
--gradient-purple-pink: linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #6366F1 100%)
```
**Hex:** `#A855F7` → `#EC4899` → `#6366F1`
**Usage :** Logo, titres héros, badges premium, indicateurs actifs

#### Gradient 3 : Green → Cyan (Success & Performance)
```css
--gradient-green-cyan: linear-gradient(135deg, #10B981 0%, #06B6D4 100%)
```
**Hex:** `#10B981` → `#06B6D4`
**Usage :** Indicateurs de performance, badges "Actif", stats positives

#### Gradient 4 : Orange → Red (Alerte & Premium)
```css
--gradient-orange-red: linear-gradient(135deg, #F97316 0%, #EF4444 100%)
```
**Hex:** `#F97316` → `#EF4444`
**Usage :** Alertes, notifications urgentes, badges "Hot"

#### Gradient 5 : Yellow → Orange (VIP & Gold)
```css
--gradient-yellow-orange: linear-gradient(135deg, #FDE047 0%, #FB923C 100%)
```
**Hex:** `#FDE047` → `#FB923C`
**Usage :** Badges VIP, éléments premium, statistiques exceptionnelles

#### Gradient 6 : Indigo → Blue (Calme & Professionnel)
```css
--gradient-indigo-blue: linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)
```
**Hex:** `#6366F1` → `#3B82F6`
**Usage :** Sections services, cartes professionnelles, footer

---

### 🎯 Couleurs de support

#### Bordures et séparateurs
```css
--border-white-10: rgba(255, 255, 255, 0.1)    /* Bordure subtile */
--border-white-20: rgba(255, 255, 255, 0.2)    /* Bordure visible */
--border-white-30: rgba(255, 255, 255, 0.3)    /* Bordure prononcée */
```

#### Backgrounds glassmorphism
```css
--glass-bg: rgba(255, 255, 255, 0.05)          /* Fond verre léger */
--glass-bg-hover: rgba(255, 255, 255, 0.1)     /* Fond verre hover */
--glass-blur: blur(8px)                         /* Flou standard */
--glass-blur-heavy: blur(16px)                  /* Flou intense */
```

#### Ombres et glows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.2)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.3)

--glow-blue: 0 0 20px rgba(0, 102, 255, 0.5)
--glow-purple: 0 0 20px rgba(139, 92, 246, 0.5)
--glow-pink: 0 0 20px rgba(236, 72, 153, 0.5)
```

---

### 🎮 Couleurs gaming spécifiques

#### Jeux PulseForge (Premium natif)
```css
--pulseforge-gradient: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)
--pulseforge-border: #EC4899
--pulseforge-shadow: 0 0 20px rgba(236, 72, 153, 0.3)
```

#### Jeux communautaires
```css
--community-bg: rgba(255, 255, 255, 0.05)
--community-border: rgba(255, 255, 255, 0.1)
--community-text: #FFFFFF
```

---

## 3. TYPOGRAPHIE

### 🔤 Polices système

#### Display (Titres et héros)
```css
font-family: 'Space Grotesk', system-ui, sans-serif;
font-weight: 700;  /* Bold uniquement */
```

**Usage :** Titres H1, H2, titres de sections, héros, logo texte
**Caractère :** Moderne, géométrique, tech, légèrement condensé
**Source :** Google Fonts ou next/font

#### Body (Corps et navigation)
```css
font-family: 'Inter', system-ui, sans-serif;
font-weight: 400 | 500 | 600;  /* Regular, Medium, Semibold */
```

**Usage :** Paragraphes, navigation, boutons, labels, formulaires
**Caractère :** Neutre, lisible, professionnel, excellent rendu écran
**Source :** Google Fonts ou next/font

---

### 📏 Hiérarchie typographique

#### Héros (Homepage, landing pages)
```css
/* Desktop */
font-size: 96px;        /* 6rem */
line-height: 1.1;
font-weight: 700;
letter-spacing: -0.02em;

/* Mobile */
font-size: 60px;        /* 3.75rem */
line-height: 1.15;
```

**Exemple :** "Boostez vos performances gaming"

---

#### H1 - Titres de sections principales
```css
/* Desktop */
font-size: 60px;        /* 3.75rem */
line-height: 1.2;
font-weight: 700;
letter-spacing: -0.015em;

/* Mobile */
font-size: 36px;        /* 2.25rem */
line-height: 1.25;
```

**Exemple :** "Solutions Gaming Premium"

---

#### H2 - Sous-titres de sections
```css
/* Desktop */
font-size: 48px;        /* 3rem */
line-height: 1.25;
font-weight: 700;

/* Mobile */
font-size: 30px;        /* 1.875rem */
line-height: 1.3;
```

**Exemple :** "PulseForge : Performances Natives"

---

#### H3 - Titres de cartes
```css
font-size: 24px;        /* 1.5rem */
line-height: 1.4;
font-weight: 600;
```

**Exemple :** "Overwatch 2", "Service Premium"

---

#### H4 - Labels et sous-sections
```css
font-size: 20px;        /* 1.25rem */
line-height: 1.5;
font-weight: 600;
```

---

#### Body Large (Sous-titres héros)
```css
font-size: 24px;        /* 1.5rem */
line-height: 1.6;
font-weight: 400;
color: var(--text-gray-300);

/* Mobile */
font-size: 20px;        /* 1.25rem */
```

**Exemple :** "Optimisez vos sessions avec notre cloud gaming..."

---

#### Body Regular (Paragraphes standard)
```css
font-size: 18px;        /* 1.125rem */
line-height: 1.7;
font-weight: 400;
color: var(--text-gray-300);

/* Mobile */
font-size: 16px;        /* 1rem */
```

---

#### Body Small (Texte secondaire)
```css
font-size: 14px;        /* 0.875rem */
line-height: 1.6;
font-weight: 400;
color: var(--text-gray-400);
```

**Exemple :** Labels de formulaire, descriptions courtes

---

#### Caption (Texte extra-small)
```css
font-size: 12px;        /* 0.75rem */
line-height: 1.5;
font-weight: 400;
color: var(--text-gray-500);
```

**Exemple :** Légendes, mentions légales, timestamps

---

### ✨ Styles typographiques spéciaux

#### Gradient text (Titres premium)
```css
.gradient-text {
  background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Usage :** Titres héros, badges premium, mots-clés importants

#### Text glow (Effets lumineux)
```css
.text-glow {
  text-shadow: 0 0 20px rgba(0, 102, 255, 0.5);
}
```

**Usage :** Hover sur liens, titres actifs, effets spéciaux

---

## 4. LOGO ET SYMBOLE

### 🏷️ Logo principal

#### Structure du logo
- **Format :** SVG vectoriel 40×40px (symbole) + texte "HACKBOOT"
- **Symbole :** Hexagone avec lignes horizontales (H abstrait)
- **Gradient :** Purple → Pink → Indigo (3 couleurs)
- **Animation :** Rotation 360° au hover (500ms)

#### Code SVG du symbole
```svg
<svg width="40" height="40" viewBox="0 0 32 32" fill="none">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7" />   <!-- Purple -->
      <stop offset="50%" stop-color="#ec4899" />  <!-- Pink -->
      <stop offset="100%" stop-color="#6366f1" /> <!-- Indigo -->
    </linearGradient>
  </defs>

  <!-- Background rectangle -->
  <rect width="32" height="32" rx="6" fill="#0a0a0a" />

  <!-- Hexagon shape -->
  <path d="M16 4 L26 10 L26 22 L16 28 L6 22 L6 10 Z"
        stroke="url(#logoGradient)"
        stroke-width="1.5"
        fill="none" />

  <!-- H letter (horizontal lines) -->
  <path d="M11 9 L11 23 M21 9 L21 23 M11 16 L21 16"
        stroke="url(#logoGradient)"
        stroke-width="2"
        stroke-linecap="round" />
</svg>
```

#### Texte "HACKBOOT"
```css
font-family: 'Space Grotesk', sans-serif;
font-size: 24px;
font-weight: 700;
background: linear-gradient(135deg, #A855F7, #EC4899, #6366F1);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

### 📐 Variations du logo

#### Logo horizontal (header)
- Symbole (40px) + Espace (12px) + Texte "HACKBOOT"
- Apparition du texte au hover avec transition 300ms
- Ligne gradient en dessous au hover (0.5px height)

#### Logo compact (mobile, favicon)
- Symbole seul 32×32px
- Pas de texte
- Même gradient et animation

#### Logo monochrome (si nécessaire)
- Symbole en blanc pur #FFFFFF
- Utiliser uniquement sur fond sombre
- Pas de gradient

---

### 🎨 Couleurs du logo

**Palette officielle :**
- Purple: `#A855F7` (violet principal)
- Pink: `#EC4899` (rose vibrant)
- Indigo: `#6366F1` (bleu indigo)

**Background :**
- Dark: `#0A0A0A` (noir profond)

---

### ⚠️ Zones de protection

**Espace minimum autour du logo :**
- 20px sur tous les côtés (desktop)
- 16px sur tous les côtés (mobile)

**Ne jamais :**
- Déformer ou étirer le logo
- Changer les couleurs du gradient
- Ajouter des effets (ombre, bordure) sauf hover
- Placer sur fond clair sans adaptation

---

## 5. SYSTÈME DE GRILLE ET ESPACEMENT

### 📏 Grille responsive

#### Container principal
```css
.container {
  max-width: 1280px;        /* 7xl */
  margin: 0 auto;
  padding-left: 24px;       /* px-6 */
  padding-right: 24px;      /* px-6 */
}

/* Mobile */
@media (max-width: 640px) {
  .container {
    padding-left: 16px;     /* px-4 */
    padding-right: 16px;    /* px-4 */
  }
}
```

#### Breakpoints
```css
sm: 640px;     /* Mobile large */
md: 768px;     /* Tablet */
lg: 1024px;    /* Desktop */
xl: 1280px;    /* Desktop large */
2xl: 1536px;   /* Desktop XL */
```

---

### 📐 Système d'espacement (basé sur 4px)

#### Padding (Internal spacing)
```css
px-4:  16px;   /* Petit - Mobile, éléments compacts */
px-6:  24px;   /* Standard - Desktop, cartes, sections */
px-8:  32px;   /* Large - Conteneurs, modals */
px-12: 48px;   /* Extra-large - Sections principales */

py-12: 48px;   /* Sections verticales standard */
py-20: 80px;   /* Sections verticales larges */
py-24: 96px;   /* Sections verticales extra-larges */
py-32: 128px;  /* Hero sections */
```

#### Gap (Spacing between elements)
```css
gap-4:  16px;  /* Espacement serré (boutons, tags) */
gap-6:  24px;  /* Espacement standard (cartes, liste) */
gap-8:  32px;  /* Espacement large (sections) */
gap-12: 48px;  /* Espacement extra-large (grilles) */
```

#### Margin (External spacing)
```css
mb-6:  24px;   /* Marge bottom standard */
mb-12: 48px;   /* Marge bottom large */
mt-8:  32px;   /* Marge top standard */
mt-16: 64px;   /* Marge top large */
```

---

### 🎯 Grilles de layout

#### Grid 2 colonnes (Desktop)
```css
.grid-2-cols {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;  /* gap-8 */
}

/* Mobile */
@media (max-width: 768px) {
  .grid-2-cols {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
```

#### Grid 3 colonnes (Desktop)
```css
.grid-3-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;  /* gap-6 */
}

/* Tablet */
@media (max-width: 1024px) {
  .grid-3-cols {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 640px) {
  .grid-3-cols {
    grid-template-columns: 1fr;
  }
}
```

---

### 📦 Border radius (Arrondis)

```css
rounded-full: 9999px;   /* Boutons, badges, bulles */
rounded-3xl:  24px;     /* Grandes cartes, sections */
rounded-2xl:  16px;     /* Cartes standard */
rounded-xl:   12px;     /* Petites cartes, inputs */
rounded-lg:   8px;      /* Éléments compacts */
rounded-md:   6px;      /* Micro-éléments */
```

---

## 6. COMPOSANTS UI

### 🔘 Boutons

#### Primary Button (CTA principal)
```css
.btn-primary {
  padding: 16px 32px;                    /* py-4 px-8 */
  background: #0066FF;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  border-radius: 9999px;                 /* rounded-full */
  transition: all 300ms ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-8px);           /* hover-lift */
  opacity: 0.9;
  box-shadow: 0 10px 15px rgba(0, 102, 255, 0.3);
}

.btn-primary:active {
  transform: translateY(-4px);
  opacity: 0.95;
}
```

**Usage :** "Commencer", "S'inscrire", "Acheter maintenant"

---

#### Secondary Button (CTA secondaire)
```css
.btn-secondary {
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.05);  /* glass-effect */
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  border-radius: 9999px;
  transition: all 300ms ease;
}

.btn-secondary:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}
```

**Usage :** "En savoir plus", "Voir démo", "Annuler"

---

#### Gradient Button (CTA premium)
```css
.btn-gradient {
  padding: 16px 32px;
  background: linear-gradient(135deg, #0066FF 0%, #8B5CF6 100%);
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  border-radius: 9999px;
  transition: all 300ms ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-gradient:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(139, 92, 246, 0.4);
}
```

**Usage :** "Devenir Premium", "Offre VIP", "Essai gratuit"

---

#### Icon Button (Bouton icône seul)
```css
.btn-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 300ms ease;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-4px);
}
```

**Usage :** Menu mobile, actions rapides, favoris

---

### 🃏 Cards (Cartes)

#### Standard Card
```css
.card {
  padding: 24px;                          /* p-6 */
  background: rgba(255, 255, 255, 0.05);  /* glass-effect */
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;                    /* rounded-2xl */
  transition: all 300ms ease;
}

.card:hover {
  transform: scale(1.05) translateY(-4px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}
```

**Usage :** Cartes de jeux, services, features

---

#### Product Card (Carte produit gaming)
```css
.product-card {
  padding: 0;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 300ms ease;
}

.product-card img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.product-card-content {
  padding: 24px;
}

.product-card:hover {
  transform: translateY(-8px);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 15px 30px rgba(139, 92, 246, 0.3);
}
```

**Usage :** Cartes de jeux (Overwatch, Valorant, Warzone...)

---

#### PulseForge Card (Carte premium)
```css
.pulseforge-card {
  padding: 24px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.2);
  transition: all 300ms ease;
}

.pulseforge-card:hover {
  transform: scale(1.05) translateY(-8px);
  box-shadow: 0 0 30px rgba(236, 72, 153, 0.4);
}
```

**Usage :** Cartes de jeux PulseForge (natifs premium)

---

### 🎯 Badges

#### Status Badge (Active, Inactive, etc.)
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;                     /* py-1.5 px-4 */
  font-size: 12px;
  font-weight: 600;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-active {
  background: linear-gradient(135deg, #10B981, #06B6D4);
  color: #FFFFFF;
}

.badge-premium {
  background: linear-gradient(135deg, #FDE047, #FB923C);
  color: #000000;
}

.badge-hot {
  background: linear-gradient(135deg, #F97316, #EF4444);
  color: #FFFFFF;
}
```

**Usage :** Status de jeu, tags premium, badges "Nouveau"

---

### 🎨 Glass Effect Components

#### Glass Container
```css
.glass-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

**Usage :** Modals, overlays, cartes flottantes, header scrollé

---

### 📝 Inputs (Formulaires)

#### Text Input
```css
.input {
  width: 100%;
  padding: 12px 16px;                    /* py-3 px-4 */
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #FFFFFF;
  font-size: 16px;
  transition: all 300ms ease;
}

.input:focus {
  outline: none;
  border-color: #0066FF;
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}
```

---

## 7. ANIMATIONS ET EFFETS

### ✨ Animations principales

#### Float (Flottement doux)
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

**Usage :** Blobs de background, éléments décoratifs

---

#### Float Delayed (Flottement décalé)
```css
@keyframes float-delayed {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-30px, -20px) scale(1.1);
  }
}

.animate-float-delayed {
  animation: float-delayed 25s ease-in-out infinite;
}
```

**Usage :** Blobs secondaires, effets de profondeur

---

#### Float Slow (Flottement lent avec fade)
```css
@keyframes float-slow {
  0%, 100% {
    transform: translate(0, 0);
    opacity: 0.5;
  }
  50% {
    transform: translate(20px, -40px);
    opacity: 0.3;
  }
}

.animate-float-slow {
  animation: float-slow 30s ease-in-out infinite;
}
```

**Usage :** Éléments d'arrière-plan lointains

---

#### Gradient Shift (Animation gradient)
```css
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animated-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}
```

**Usage :** Titres animés, boutons premium, effets de texte

---

#### Slide & Fade In (Apparition avec slide)
```css
@keyframes slideUp {
  0% {
    transform: translateY(100px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}
```

**Usage :** Apparition de sections, scroll reveal

---

#### Shake (Secousse rapide)
```css
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-8px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(8px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
```

**Usage :** Erreurs de formulaire, alertes, feedback négatif

---

#### Marquee (Défilement infini)
```css
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 300s linear infinite;
}
```

**Usage :** Bandeau de jeux, liste infinie, ticker

---

#### Particle (Ascension avec fade)
```css
@keyframes particle {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(50px);
    opacity: 0;
  }
}

.animate-particle {
  animation: particle 15s linear infinite;
}
```

**Usage :** Particules décoratives, effets de fond

---

#### Blob animations (About page)
```css
@keyframes about-blob-a {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  25% {
    transform: translate3d(80px, -60px, 0) scale(1.1);
  }
  50% {
    transform: translate3d(-40px, 40px, 0) scale(0.95);
  }
  75% {
    transform: translate3d(60px, 20px, 0) scale(1.05);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}
```

**Usage :** Blobs organiques page "À propos"

---

### 🎭 Framer Motion Presets

#### Fade In View
```javascript
const fadeInView = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 }
  }
}
```

#### Slide Up View
```javascript
const slideUpView = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}
```

#### Scale In View
```javascript
const scaleInView = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 }
  }
}
```

#### Hover Lift
```javascript
const hoverLift = {
  rest: { y: 0 },
  hover: {
    y: -8,
    transition: { duration: 0.3 }
  }
}
```

#### Hover Glow
```javascript
const hoverGlow = {
  rest: { boxShadow: '0 0 0 rgba(0, 102, 255, 0)' },
  hover: {
    boxShadow: '0 0 20px rgba(0, 102, 255, 0.5)',
    transition: { duration: 0.3 }
  }
}
```

---

### ⚙️ Timing & Easing

#### Durées standards
```css
--duration-instant: 150ms;   /* Micro-interactions */
--duration-fast: 300ms;      /* Hover, focus, toggle */
--duration-medium: 500ms;    /* Slide, fade, scale */
--duration-slow: 700ms;      /* Page transitions */
--duration-fade: 600ms;      /* Fade in/out */
```

#### Easing curves
```css
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--ease-enter: cubic-bezier(0, 0, 0.2, 1);
--ease-exit: cubic-bezier(0.4, 0, 1, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 8. ICONOGRAPHIE

### 🎯 Bibliothèque d'icônes : Lucide React

**Source :** `lucide-react` (npm package)
**Style :** Outline, minimaliste, moderne
**Taille par défaut :** 24×24px
**Stroke width :** 2px

#### Exemples d'icônes utilisées
```jsx
import {
  ChevronDown,    // Navigation, scroll hint
  Sparkles,       // Premium, PulseForge
  Zap,            // Performance, vitesse
  Shield,         // Sécurité, protection
  Users,          // Communauté, équipe
  Trophy,         // Compétition, victoire
  TrendingUp,     // Statistiques, progression
  Settings,       // Configuration, paramètres
  ExternalLink,   // Liens externes
  Check,          // Validation, succès
  X,              // Fermeture, erreur
  Menu,           // Menu mobile
  Globe           // Langue, international
} from 'lucide-react'
```

#### Tailles standards
```css
.icon-sm {
  width: 16px;
  height: 16px;
}

.icon-md {
  width: 24px;
  height: 24px;
}

.icon-lg {
  width: 32px;
  height: 32px;
}

.icon-xl {
  width: 48px;
  height: 48px;
}
```

#### Couleurs des icônes
```css
/* Standard */
color: #FFFFFF;                        /* Blanc pur */

/* Secondaire */
color: rgba(255, 255, 255, 0.6);      /* White/60 */

/* Accent */
color: #0066FF;                        /* Bleu accent */

/* Success */
color: #10B981;                        /* Vert */

/* Warning */
color: #F59E0B;                        /* Orange */

/* Error */
color: #EF4444;                        /* Rouge */
```

---

## 9. IMAGES ET ILLUSTRATIONS

### 🎮 Images de jeux gaming

#### Structure des assets
```
/public/images/products/
├── overwatch/
│   ├── main.png         (Image principale 2804×1580px)
│   ├── 1.png            (Gallery image 1)
│   ├── 2.png            (Gallery image 2)
├── valorant/
│   ├── main.png
│   ├── 1.png
├── warzone/
│   ├── main.png
│   ├── 1.png
│   ├── 2.png
├── destiny2/
│   ├── main.png
│   ├── godmode/
│   │   └── main.png
├── battlefield6/
│   ├── main.png
│   ├── godmode/
│   │   └── main.png
└── dota2/
    ├── main.png
    ├── godmode/
    │   └── main.png
```

#### Formats recommandés
- **Format :** PNG (transparence) ou WebP (optimisation)
- **Résolution principale :** 2804×1580px (16:9 ratio)
- **Gallery images :** 1920×1080px minimum
- **Thumbnails :** 640×360px
- **Optimisation :** Compression avec TinyPNG ou Squoosh

#### Traitement des images
```css
.product-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 16px;
  transition: transform 300ms ease;
}

.product-image:hover {
  transform: scale(1.05);
}
```

---

### 🎨 Illustrations pour la page principale

#### Style visuel
- **Ambiance :** Futuriste, cyberpunk, sci-fi moderne
- **Couleurs :** Gradients bleu/violet/rose sur fond noir
- **Éléments :** Hexagones, grilles, particules, lignes lumineuses
- **Effet :** Glassmorphism, glow, blur, transparence

#### Prompts pour génération d'illustrations

**1. Hero Background (Background principal homepage)**
```
A futuristic cyberpunk gaming cloud environment, dark black background with
glowing purple, pink and blue gradients, floating hexagons, holographic
particles, grid lines, depth of field blur, minimalist high-tech aesthetic,
8K quality, ultra-wide panoramic, cinematic lighting
```

**2. Gaming Performance Abstract (Section performances)**
```
Abstract representation of gaming performance metrics, flowing data streams
in electric blue and purple, FPS counters, latency graphs as neon light
trails, dark background, futuristic HUD elements, holographic interface,
glass morphism effect, high-tech minimalist style
```

**3. Cloud Gaming Server Room (Section infrastructure)**
```
Futuristic server room with glowing racks, purple and blue neon lights,
hexagonal pattern on floor, volumetric fog, holographic displays showing
game stats, cyberpunk aesthetic, dark atmosphere with vibrant accent lights,
ultra-realistic 3D render
```

**4. E-sport Competition Scene (Section services)**
```
Professional e-sport arena from above, multiple gaming stations with glowing
monitors showing Overwatch/Valorant, purple and blue stadium lights, crowd
silhouettes, holographic scoreboard, cinematic wide angle, high-tech futuristic
design, dark ambiance with vibrant RGB accents
```

**5. Gaming Controller Abstract (Section features)**
```
Abstract gaming controller disintegrating into particles and data streams,
glowing purple and blue energy, hexagonal fragments, holographic elements,
dark black background, glass morphism effect, futuristic tech aesthetic,
volumetric lighting
```

**6. PulseForge Native Gaming (Section PulseForge)**
```
Holographic hexagon platform with glowing pink and purple energy core,
floating game logos (Overwatch, Valorant), particle effects, cyber grid
floor, volumetric rays, premium luxury tech aesthetic, dark background,
ultra-realistic 3D visualization
```

#### Spécifications techniques illustrations
- **Format :** PNG avec transparence ou WebP
- **Résolution :** 2560×1440px minimum (pour retina)
- **Poids :** < 500KB après compression
- **Ratio :** 16:9 (paysage) ou 1:1 (carré) selon usage
- **Effet blur :** Appliquer un léger blur (2-4px) pour fond

---

### 📸 Traitement des images dans le code

#### Lazy loading
```jsx
import Image from 'next/image'

<Image
  src="/images/products/overwatch/main.png"
  alt="Overwatch 2 PulseForge"
  width={2804}
  height={1580}
  loading="lazy"
  quality={85}
/>
```

#### Gradient overlay
```css
.image-overlay {
  position: relative;
}

.image-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%);
  pointer-events: none;
}
```

---

## 10. TON ET STYLE

### 📝 Principes rédactionnels

#### Ton de la marque
- **Professionnel** : Expert, technique, crédible
- **Accessible** : Clair, direct, sans jargon excessif
- **Énergique** : Dynamique, moderne, innovant
- **Passionné** : Gaming, e-sport, performance

#### Vocabulaire clé
- **Performance :** FPS, latency, optimization, native, cloud
- **Gaming :** E-sport, competitive, streaming, overlay, coaching
- **Premium :** PulseForge, native, exclusive, VIP, elite
- **Innovation :** AI, adaptive, real-time, tactical, analytics

---

### 💬 Messages types

#### Hero (Homepage)
```
Boostez vos performances gaming avec notre cloud ultra-optimisé
```

#### Value Proposition
```
Des instances gaming natives avec coaching IA adaptatif et
analytics en temps réel pour dominer la compétition
```

#### CTA (Call-to-Action)
```
Commencer gratuitement
Découvrir PulseForge
Rejoindre la communauté
Essayer maintenant
```

#### Features
```
✨ Performances natives 400+ FPS
⚡ Latence ultra-faible < 1ms
🎯 Coaching IA adaptatif
🔒 Anti-cheat intégré
📊 Analytics temps réel
```

---

## 11. ACCESSIBILITÉ

### ♿ Standards WCAG 2.1 AA

#### Contrastes
```
Blanc sur Noir : 21:1  (WCAG AAA) ✅
Gray-300 sur Noir : 12:1  (WCAG AAA) ✅
Gray-400 sur Noir : 7:1  (WCAG AA) ✅
Bleu #0066FF sur Noir : 8.2:1  (WCAG AA) ✅
```

#### Focus indicators
```css
*:focus-visible {
  outline: 2px solid #0066FF;
  outline-offset: 2px;
  border-radius: 4px;
}
```

#### Motion réduit
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### Taille des zones de clic
- **Minimum :** 44×44px (mobile)
- **Recommandé :** 48×48px (desktop)
- **Boutons :** 56px height minimum

#### Alt text pour images
```jsx
<Image
  src="/images/overwatch/main.png"
  alt="Overwatch 2 gameplay avec overlay tactique PulseForge montrant les statistiques de performance en temps réel"
/>
```

---

## 12. GUIDELINES D'UTILISATION

### ✅ À FAIRE

#### Couleurs
- ✅ Utiliser le fond noir (#000000) pour toutes les pages
- ✅ Utiliser les gradients signature (blue-purple, purple-pink)
- ✅ Respecter les ratios de contraste WCAG AA minimum
- ✅ Utiliser le bleu #0066FF pour tous les CTA principaux

#### Typographie
- ✅ Space Grotesk Bold pour tous les titres
- ✅ Inter pour tous les corps de texte
- ✅ Respecter la hiérarchie typographique (H1-H4)
- ✅ Utiliser le gradient text pour les titres premium

#### Espacement
- ✅ Utiliser le système d'espacement 4px (gap-4, gap-6, gap-8...)
- ✅ Respecter les marges de sections (py-12, py-20, py-24)
- ✅ Maintenir une cohérence entre les pages

#### Composants
- ✅ Utiliser le glass effect pour les cartes et modals
- ✅ Appliquer le hover-lift sur les éléments interactifs
- ✅ Ajouter des transitions fluides (300ms)
- ✅ Utiliser les badges pour les statuts et tags

#### Images
- ✅ Optimiser toutes les images (WebP, compression)
- ✅ Ajouter des alt text descriptifs
- ✅ Utiliser le lazy loading (Next.js Image)
- ✅ Appliquer des gradient overlays sur les images de fond

---

### ❌ À NE PAS FAIRE

#### Couleurs
- ❌ Ne jamais utiliser de fond blanc ou clair
- ❌ Ne pas mélanger plus de 3 couleurs dans un gradient
- ❌ Ne pas utiliser de couleurs criardes non définies
- ❌ Éviter les contrastes insuffisants (<4.5:1)

#### Typographie
- ❌ Ne jamais utiliser plus de 2 polices différentes
- ❌ Ne pas utiliser de tailles < 14px pour du corps de texte
- ❌ Éviter le texte gris sur gris (manque de contraste)
- ❌ Ne pas dépasser 80 caractères par ligne

#### Espacement
- ❌ Ne pas utiliser de valeurs d'espacement arbitraires
- ❌ Éviter les espacements trop serrés (<16px)
- ❌ Ne pas oublier les marges sur mobile

#### Composants
- ❌ Ne pas surcharger de glassmorphism (max 2 niveaux)
- ❌ Éviter les animations trop rapides (<200ms)
- ❌ Ne pas empiler trop d'ombres (max 2)
- ❌ Éviter les border-radius incohérents

#### Images
- ❌ Ne jamais utiliser d'images non optimisées (> 1MB)
- ❌ Éviter les images floues ou pixelisées
- ❌ Ne pas oublier les fallbacks pour images manquantes
- ❌ Éviter les images sans contexte ni alt text

---

### 🎯 Checklist de conformité

Avant de valider un design ou une page :

- [ ] Fond noir (#000000) utilisé
- [ ] Gradients signature appliqués (blue-purple, purple-pink)
- [ ] Contrastes WCAG AA respectés (4.5:1 minimum)
- [ ] Space Grotesk pour titres, Inter pour corps
- [ ] Hiérarchie typographique claire (H1-H4)
- [ ] Espacement cohérent (système 4px)
- [ ] Glass effect sur cartes et modals
- [ ] Hover-lift sur éléments interactifs
- [ ] Transitions fluides (300ms)
- [ ] Images optimisées (< 500KB)
- [ ] Alt text descriptifs
- [ ] Lazy loading activé
- [ ] Responsive mobile testé
- [ ] Focus indicators visibles
- [ ] Prefers-reduced-motion respecté

---

## 📞 CONTACT & RESSOURCES

### 🔗 Liens utiles

- **Documentation projet :** `/docs/README.md`
- **Fichier CSS principal :** `/app/globals.css`
- **Config Tailwind :** `/tailwind.config.js`
- **Composants :** `/components/`
- **Assets images :** `/public/images/`

### 📦 Dépendances design

```json
{
  "tailwindcss": "^3.x",
  "framer-motion": "^11.x",
  "lucide-react": "^0.x",
  "next": "^14.x"
}
```

### 🎨 Outils recommandés

- **Design :** Figma, Adobe XD
- **Prototypage :** Framer, ProtoPie
- **Couleurs :** Coolors, Adobe Color
- **Compression images :** TinyPNG, Squoosh
- **Génération illustrations :** Midjourney, Stable Diffusion, DALL-E 3

---

## 🎉 CONCLUSION

Cette charte graphique définit l'identité visuelle complète de **Hackboot**, une plateforme de gaming cloud premium. Elle garantit une cohérence visuelle sur l'ensemble du site et facilite la création de nouveaux designs et illustrations.

**Principes clés :**
1. **Sombre et vibrant** : Fond noir avec gradients colorés
2. **Moderne et tech** : Glassmorphism, hexagones, effets lumineux
3. **Performance et élégance** : Animations fluides, hover-lift, transitions
4. **Accessible et professionnel** : Contrastes élevés, typographie claire

Pour toute question ou suggestion, référez-vous à la documentation projet dans `/docs/`.

---

**Dernière mise à jour :** 29 octobre 2025
**Version :** 1.0
**Auteur :** Hackboot Design Team
