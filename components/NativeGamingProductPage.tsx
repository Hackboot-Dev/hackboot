'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Star, Shield, Zap, Check, ArrowRight, Trophy, Gauge, Code, Target, TrendingUp, Activity, Cpu, Users, Lock, Wifi } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { GamingProduct, ProductVariant } from '@/lib/gaming-products'
import { getSubscriptionPlans } from '@/lib/subscriptions'
import type { SubscriptionPlan } from '@/lib/subscriptions'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const inViewFadeProps = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 }
} as const

const inViewSlideProps = {
  initial: { opacity: 0, x: -48 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.2 }
} as const

const inViewScaleProps = {
  initial: { opacity: 0, scale: 0.88, y: 24 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: { once: true, amount: 0.25 }
} as const

const inViewTiltProps = {
  initial: { opacity: 0, rotateX: -10, y: 28 },
  whileInView: { opacity: 1, rotateX: 0, y: 0 },
  viewport: { once: true, amount: 0.25 }
} as const

const hoverLiftProps = {
  whileHover: { y: -8, scale: 1.02 },
  whileTap: { scale: 0.98 }
} as const

const hoverGlowProps = {
  whileHover: { y: -6, scale: 1.01, boxShadow: '0px 20px 45px rgba(168, 85, 247, 0.35)' },
  whileTap: { scale: 0.99 }
} as const

const fadeTransition = { duration: 0.6, ease: 'easeOut' } as const

const statPalette = {
  purple: { text: 'text-purple-400', iconBg: 'bg-purple-500/20' },
  green: { text: 'text-green-400', iconBg: 'bg-green-500/20' },
  blue: { text: 'text-blue-400', iconBg: 'bg-blue-500/20' },
  orange: { text: 'text-orange-400', iconBg: 'bg-orange-500/20' },
  red: { text: 'text-red-400', iconBg: 'bg-red-500/20' },
  cyan: { text: 'text-cyan-400', iconBg: 'bg-cyan-500/20' }
} as const

const progressPalette = {
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  cyan: 'bg-cyan-500'
} as const

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (...args: any[]) => any
    ? T[P]
    : T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T[P] extends object
        ? DeepPartial<T[P]>
        : T[P]
}

function mergeDeep<T>(base: T, override?: DeepPartial<T>): T {
  if (!override) {
    return base
  }

  if (Array.isArray(base)) {
    return (override as unknown as T) ?? base
  }

  if (typeof base === 'object' && base !== null) {
    const result: any = { ...(base as any) }

    for (const key of Object.keys(override) as Array<keyof T>) {
      const overrideValue = override[key]
      if (overrideValue === undefined) {
        continue
      }

      const baseValue = (base as any)[key]

      if (Array.isArray(baseValue) || Array.isArray(overrideValue)) {
        result[key] = overrideValue
        continue
      }

      if (
        typeof baseValue === 'object' &&
        baseValue !== null &&
        typeof overrideValue === 'object' &&
        overrideValue !== null &&
        typeof overrideValue !== 'function'
      ) {
        result[key] = mergeDeep(baseValue, overrideValue as any)
        continue
      }

      result[key] = overrideValue
    }

    return result
  }

  return (override as unknown as T) ?? base
}

type VariantOverride = Partial<ProductVariant> & {
  features?: string[]
  use_cases?: string[]
  badges?: string[]
  usage?: string
  target_audience?: string
  highlight?: string
  protection?: string
  updates?: string
}

interface TechnicalOverrides {
  fpsByResolution?: Array<{ playability?: string; bottleneck?: string }>
  resolutionGuidance?: Array<{ refreshAdvice?: string; description?: string; note?: string }>
  improvementTips?: string[]
  advice?: string
  augmentationSuite?: {
    modules?: string[]
    notes?: string
  }
  heroSynergy?: Array<{ preset?: string; coachingNotes?: string }>
}

interface LocaleContent {
  breadcrumbs: { home: string; games: string }
  reviewsLabel: string
  optimizationBadge: string
  nativeAdvantages: Array<{ title: string; description: string; icon: typeof Code }>
  quickStats: { avgFps: string; onePercentLow: string; latency: string; inputLag: string }
  subscription: { title: string; popular: string; viewDetails: string }
  metrics: {
    badge: string
    title: string
    description: string
    statCards: { maxFps: string; onePercentLow: string; inputLag: string }
    allocationTitle: string
    datacenterTitle: string
    usage: { cpu: string; gpu: string; ram: string; vram: string }
    thermals: { cpu: string; gpu: string; power: string }
    stabilityNote: string
  }
  fpsTable: {
    title: string
    description: string
    headers: { resolution: string; avg: string; min: string; max: string; playability: string; bottleneck: string }
    footnote: string
  }
  quality: { title: string; description: string; badge: string }
  resolution: { title: string; description: string; windowLabel: string; footnote: string; avgLabel: string }
  experience: {
    title: string
    description: (productName: string, latency: number) => string
    bullets: string[]
    profileLabel: string
    profileSubtitle: string
    lowLabel: string
    lowSubtitle: string
  }
  improvement: { tipsTitle: string; adviceTitle: string }
  augmentation: {
    badge: string
    title: string
    description: string
    modulesTitle: string
    reactivityTitle: string
    overlayLabel: string
    modulesLabel: string
    coachingLabel: string
    reactionLabel: string
    motionNote: string
    awarenessLabel: string
    focusLabel: string
  }
  legacyPrecision?: {
    badge: string
    title: string
    description: string
    stats: { tracking: string; smoothness: string; fov: string; switchTime: string }
    advancedTitle: string
    metrics: { priority: string; weapon: string; reaction: string }
    focusTitle: string
  }
  hero: {
    badge: string
    title: string
    description: string
    headers: { hero: string; overlay: string; clarity: string; preset: string; notes: string }
    fallbackTitle: string
    fallbackDescription: (game: string) => string
    fallbackHeaders: { optimization: string; critRate: string; efficiency: string; impact: string }
  }
  reliability: {
    badge: string
    title: string
    description: string
    cards: { detection: string; detectionFootnote: string; uptime: string; uptimeFootnote: string; response: string; responseFootnote: string }
    maintenanceTitle: string
    encryption: string
    isolation: string
    updates: string
    incidents: string
    surveillanceTitle: string
    surveillanceToggles: { antiDebug: string; antiVM: string; kernel: string }
    protectionNote: string
  }
  network: {
    badge: string
    title: string
    description: (serverCount: number) => string
    cards: { servers: string; ping: string; loss: string; jitter: string }
    bandwidthLabel: string
    bandwidthSubtitle: string
    encryptionLabel: string
    encryptionSubtitle: string
    ddos: string
  }
  user: {
    badge: string
    title: (total: string) => string
    subtitle: string
    cards: { total: string; active: string; session: string; games: string }
    ratingLabel: string
    recommendationLabel: string
  }
  nativeReasons: { title: string; description: (game: string) => string }
  featuresTitle: string
  featureNotesTitle: string
  cta: { title: (game: string) => string; description: string; button: string }
  subscriptionPlans?: Record<string, Partial<SubscriptionPlan>>
  product: { description?: string; longDescription?: string; variants?: Record<string, VariantOverride> }
  technical: TechnicalOverrides
}

const frenchCopy: LocaleContent = {
  breadcrumbs: { home: 'Accueil', games: 'Jeux' },
  reviewsLabel: 'avis',
  optimizationBadge: 'OPTIMISÉ NATIVEMENT',
  nativeAdvantages: [
    {
      icon: Code,
      title: 'Intégration native',
      description: 'Modules calibrés avec Overwatch 2 et synchronisés après chaque mise à jour Blizzard'
    },
    {
      icon: Shield,
      title: 'Conformité totale',
      description: 'Overlays stream-safe respectant les guidelines esports, sans injection intrusive'
    },
    {
      icon: Gauge,
      title: 'Performance calibrée',
      description: 'FPS stables 400+ et latence maîtrisée grâce à notre profil serveur sur mesure'
    },
    {
      icon: Trophy,
      title: 'Support créatif',
      description: 'Accompagnement dédié pour configurer vos presets coaching, stream et LAN'
    }
  ],
  quickStats: {
    avgFps: 'FPS moyen',
    onePercentLow: '1% low (4K Ultra)',
    latency: 'Latence système',
    inputLag: 'Input lag'
  },
  subscription: {
    title: 'Choisissez votre abonnement',
    popular: 'Le plus populaire',
    viewDetails: 'Voir les détails'
  },
  metrics: {
    badge: 'MÉTRIQUES DE PERFORMANCE',
    title: 'Performances calibrées pour Overwatch 2',
    description:
      'Mesures internes sur notre instance PulseForge : 410 FPS de moyenne sur le preset Esports 1080p, 242 FPS en 1440p et 131 FPS en 4K. Le 1% low descend à 84 FPS dans le scénario 4K Ultra avec overlays complets, garantissant une marge confortable même sur les charges extrêmes.',
    statCards: {
      maxFps: 'FPS maximum observé',
      onePercentLow: '1% low (4K Ultra)',
      inputLag: 'Input lag moyen'
    },
    allocationTitle: 'Allocation serveur PulseForge',
    datacenterTitle: 'Stabilité datacenter',
    usage: {
      cpu: 'Utilisation CPU',
      gpu: 'Utilisation GPU',
      ram: 'Utilisation RAM',
      vram: 'Utilisation VRAM'
    },
    thermals: {
      cpu: 'Température CPU',
      gpu: 'Température GPU',
      power: 'Consommation électrique'
    },
    stabilityNote: 'Températures maîtrisées et marge thermique préservée'
  },
  fpsTable: {
    title: 'FPS par résolution',
    description:
      'Nos profils cloud ajustent automatiquement les ressources : voici le niveau de FPS obtenu lorsque vous augmentez ou réduisez la résolution en réglages moyens.',
    headers: {
      resolution: 'Résolution',
      avg: 'FPS moyen',
      min: 'Min',
      max: 'Max',
      playability: 'Jouabilité',
      bottleneck: 'Bottleneck'
    },
    footnote: 'Benchmarks internes réalisés sur notre profil Overwatch 2 (preset moyen, cartes compétitives principales).'
  },
  quality: {
    title: 'FPS selon les presets graphiques',
    description: 'Utilisez le contrôleur cloud pour sélectionner le preset adapté tout en gardant la cohérence FPS indiquée.',
    badge: 'bench'
  },
  resolution: {
    title: 'Comment ajuster la résolution côté cloud',
    description:
      'Nos mesures internes traduisent la marge FPS réelle quand vous augmentez ou réduisez la définition depuis le panneau PulseForge.',
    windowLabel: 'Fenêtre relevée',
    footnote: 'Les valeurs correspondent à nos scénarios Overwatch 2 sur presets Moyen et Ultra avec overlays actifs.',
    avgLabel: 'FPS moyen'
  },
  experience: {
    title: 'Expérience cloud PulseForge',
    description: (productName: string, latency: number) =>
      `${productName} s’exécute entièrement sur notre infrastructure cloud : aucune configuration locale, provisionnement instantané et latence maîtrisée à ${latency} ms en moyenne.`,
    bullets: [
      'Overlays, mods et mises à jour appliqués côté serveur sans toucher à votre PC.',
      'Basculez en 1080p, 1440p ou 4K depuis le panneau cloud en conservant la marge FPS indiquée.',
      'Monitoring continu : déclenchez un switch de région si le ping dépasse 30 ms pour rester sous contrôle.'
    ],
    profileLabel: 'Profil Esports',
    profileSubtitle: 'Moyenne mesurée en 1080p',
    lowLabel: '1% low 4K Ultra',
    lowSubtitle: 'Scénario charges extrêmes'
  },
  improvement: {
    tipsTitle: 'Astuces pour gagner des FPS',
    adviceTitle: "Conseil d'utilisation"
  },
  augmentation: {
    badge: "SUITE D'ASSISTANCES PULSEFORGE",
    title: 'Modules tactiques en temps réel',
    description: 'Overlays contextuels, coaching adaptatif et insights pro intégrés directement dans votre HUD.',
    modulesTitle: 'Modules clés inclus',
    reactivityTitle: 'Réactivité & couverture',
    overlayLabel: 'Overlay refresh',
    modulesLabel: 'Modules actifs',
    coachingLabel: 'Coaching adaptatif',
    reactionLabel: 'Temps de réaction moyen',
    motionNote: 'Mouvements naturalisés pour un rendu fluide et ergonomique',
    awarenessLabel: 'Indice awareness',
    focusLabel: 'Focalisation tactique'
  },
  legacyPrecision: {
    badge: 'SUITE DE PRÉCISION AVANCÉE',
    title: 'Suivi assisté de niveau professionnel',
    description: 'Paramétrage de suivi intelligent et assistance ergonomique pour un rendu naturel.',
    stats: {
      tracking: 'Précision du suivi',
      smoothness: 'Fluidité',
      fov: 'Ouverture dynamique',
      switchTime: 'Temps de bascule'
    },
    advancedTitle: 'Statistiques avancées',
    metrics: {
      priority: 'Ciblage prioritaire',
      weapon: 'Compatibilité armes',
      reaction: 'Temps de réaction'
    },
    focusTitle: 'Points de focalisation'
  },
  hero: {
    badge: 'PROFILS PAR HÉROS',
    title: 'Optimisations dédiées',
    description: "Chaque module propose un preset calibré pour les rôles et héros majeurs d'Overwatch 2.",
    headers: {
      hero: 'Héros',
      overlay: 'Focus overlay',
      clarity: 'Clarté visuelle',
      preset: 'Preset conseillé',
      notes: 'Notes coaching'
    },
    fallbackTitle: 'Performance par Héros',
    fallbackDescription: (game: string) => `Optimisations spécifiques pour chaque héros d’${game}`,
    fallbackHeaders: {
      optimization: 'Optimisation',
      critRate: 'Taux critique',
      efficiency: 'Indice efficacité',
      impact: 'Impact victoire'
    }
  },
  reliability: {
    badge: 'FIABILITÉ & MAINTENANCE',
    title: 'Service de niveau entreprise',
    description: 'Supervision proactive, correctifs rapides et conformité streaming pour une expérience sereine.',
    cards: {
      detection: "Taux d'incident critique",
      detectionFootnote: 'Surveillance continue',
      uptime: 'Disponibilité',
      uptimeFootnote: 'Infrastructure hautement disponible',
      response: 'Temps de réponse support',
      responseFootnote: 'Équipe dédiée 24/7'
    },
    maintenanceTitle: 'Maintenance proactive',
    encryption: 'Chiffrement',
    isolation: "Couches d'isolation",
    updates: 'Mises à jour maintenance / semaine',
    incidents: 'Incidents (30j)',
    surveillanceTitle: 'Surveillance automatisée',
    surveillanceToggles: {
      antiDebug: "Surveillance d'intégrité",
      antiVM: 'Validation environnements virtuels',
      kernel: 'Service noyau optimisé'
    },
    protectionNote: 'Protection complète contre les conflits logiciels et dérives de pilotes'
  },
  network: {
    badge: 'INFRASTRUCTURE CLOUD',
    title: 'Réseau global ultra-rapide',
    description: (serverCount: number) =>
      `${serverCount} points de présence synchronisés pour maintenir la réactivité des overlays et du streaming.`,
    cards: {
      servers: 'Serveurs',
      ping: 'Ping Moyen',
      loss: 'Packet Loss',
      jitter: 'Jitter'
    },
    bandwidthLabel: 'Bande Passante Max',
    bandwidthSubtitle: 'Par connexion',
    encryptionLabel: 'Encryption',
    encryptionSubtitle: 'Sécurité maximale',
    ddos: 'Protection DDoS Active'
  },
  user: {
    badge: 'COMMUNAUTÉ & SATISFACTION',
    title: (total: string) => `Plébiscité par ${total} Joueurs`,
    subtitle: 'Une communauté active et satisfaite qui témoigne de notre qualité',
    cards: {
      total: 'Utilisateurs Total',
      active: 'Actifs (30j)',
      session: 'Session Moyenne',
      games: 'Parties/Jour'
    },
    ratingLabel: 'Score de Satisfaction',
    recommendationLabel: 'Taux de Recommandation'
  },
  nativeReasons: {
    title: 'Pourquoi Choisir Notre Build Natif ?',
    description: (game: string) => `Optimisé de A à Z pour ${game}, avec des performances mesurées et un support dédié`
  },
  featuresTitle: 'Fonctionnalités Incluses',
  featureNotesTitle: 'Notes d’implémentation (pour rester clean côté ToS)',
  cta: {
    title: (game: string) => `Prêt à sublimer votre expérience ${game} ?`,
    description: "Activez la suite PulseForge et profitez d'outils créatifs prêts pour le coaching, le streaming et la compétition.",
    button: 'Choisir mon abonnement'
  },
  product: {},
  technical: {}
}

const englishCopy: LocaleContent = {
  breadcrumbs: { home: 'Home', games: 'Games' },
  reviewsLabel: 'reviews',
  optimizationBadge: 'NATIVELY OPTIMIZED',
  nativeAdvantages: [
    {
      icon: Code,
      title: 'Native integration',
      description: 'Modules calibrated with Overwatch 2 and synced after every Blizzard update'
    },
    {
      icon: Shield,
      title: 'Full compliance',
      description: 'Stream-safe overlays aligned with esports guidelines, no intrusive injection'
    },
    {
      icon: Gauge,
      title: 'Tuned performance',
      description: 'Stable 400+ FPS and controlled latency thanks to our custom server profile'
    },
    {
      icon: Trophy,
      title: 'Creative support',
      description: 'Dedicated guidance to configure your coaching, streaming, and LAN presets'
    }
  ],
  quickStats: {
    avgFps: 'Average FPS',
    onePercentLow: '1% low (4K Ultra)',
    latency: 'System latency',
    inputLag: 'Input lag'
  },
  subscription: {
    title: 'Choose your subscription',
    popular: 'Most popular',
    viewDetails: 'View details'
  },
  metrics: {
    badge: 'PERFORMANCE METRICS',
    title: 'Calibrated performance for Overwatch 2',
    description:
      'Internal measurements on our PulseForge instance: 410 FPS average on the 1080p esports preset, 242 FPS at 1440p, and 131 FPS in 4K. The 1% low dips to 84 FPS in the 4K Ultra scenario with full overlays, keeping comfortable headroom even under extreme loads.',
    statCards: {
      maxFps: 'Peak observed FPS',
      onePercentLow: '1% low (4K Ultra)',
      inputLag: 'Average input lag'
    },
    allocationTitle: 'PulseForge server allocation',
    datacenterTitle: 'Datacenter stability',
    usage: {
      cpu: 'CPU usage',
      gpu: 'GPU usage',
      ram: 'RAM usage',
      vram: 'VRAM usage'
    },
    thermals: {
      cpu: 'CPU temperature',
      gpu: 'GPU temperature',
      power: 'Power draw'
    },
    stabilityNote: 'Temperatures kept in check with preserved thermal headroom'
  },
  fpsTable: {
    title: 'FPS by resolution',
    description:
      'Our cloud profiles automatically tune resources: here is the FPS level when you raise or lower resolution on medium settings.',
    headers: {
      resolution: 'Resolution',
      avg: 'Average FPS',
      min: 'Min',
      max: 'Max',
      playability: 'Playability',
      bottleneck: 'Bottleneck'
    },
    footnote: 'Internal benchmarks on our Overwatch 2 profile (medium preset, primary competitive maps).'
  },
  quality: {
    title: 'FPS by graphics presets',
    description: 'Use the cloud controller to pick the preset you need while staying within the displayed FPS range.',
    badge: 'bench'
  },
  resolution: {
    title: 'How to adjust resolution from the cloud',
    description:
      'Our internal measurements translate the real FPS margin when you increase or lower definition from the PulseForge panel.',
    windowLabel: 'Observed range',
    footnote: 'Values reflect our Overwatch 2 scenarios on Medium and Ultra presets with overlays enabled.',
    avgLabel: 'Average FPS'
  },
  experience: {
    title: 'PulseForge cloud experience',
    description: (productName: string, latency: number) =>
      `${productName} runs entirely on our cloud infrastructure: no local configuration, instant provisioning, and average latency held at ${latency} ms.`,
    bullets: [
      'Overlays, mods, and updates are applied server-side without touching your PC.',
      'Switch between 1080p, 1440p, or 4K from the cloud panel while keeping the displayed FPS margin.',
      'Continuous monitoring: trigger a region switch if ping exceeds 30 ms to stay in control.'
    ],
    profileLabel: 'Esports profile',
    profileSubtitle: 'Average measured in 1080p',
    lowLabel: '1% low 4K Ultra',
    lowSubtitle: 'Extreme workload scenario'
  },
  improvement: {
    tipsTitle: 'Tips to gain FPS',
    adviceTitle: 'Usage advice'
  },
  augmentation: {
    badge: 'PULSEFORGE ASSIST SUITE',
    title: 'Real-time tactical modules',
    description: 'Contextual overlays, adaptive coaching, and pro insights injected directly into your HUD.',
    modulesTitle: 'Key modules included',
    reactivityTitle: 'Responsiveness & coverage',
    overlayLabel: 'Overlay refresh',
    modulesLabel: 'Active modules',
    coachingLabel: 'Adaptive coaching',
    reactionLabel: 'Average reaction time',
    motionNote: 'Naturalized movements for a smooth, ergonomic feel',
    awarenessLabel: 'Awareness index',
    focusLabel: 'Tactical focus'
  },
  legacyPrecision: {
    badge: 'ADVANCED PRECISION SUITE',
    title: 'Pro-level assisted tracking',
    description: 'Intelligent tracking tuning and ergonomic assistance for a natural feeling response.',
    stats: {
      tracking: 'Tracking accuracy',
      smoothness: 'Smoothness',
      fov: 'Dynamic opening',
      switchTime: 'Switch time'
    },
    advancedTitle: 'Advanced statistics',
    metrics: {
      priority: 'Priority targeting',
      weapon: 'Weapon compatibility',
      reaction: 'Reaction time'
    },
    focusTitle: 'Focus points'
  },
  hero: {
    badge: 'HERO PROFILES',
    title: 'Dedicated optimizations',
    description: 'Each module ships a preset calibrated for Overwatch 2’s core roles and heroes.',
    headers: {
      hero: 'Hero',
      overlay: 'Overlay focus',
      clarity: 'Visual clarity',
      preset: 'Recommended preset',
      notes: 'Coaching notes'
    },
    fallbackTitle: 'Hero performance',
    fallbackDescription: (game: string) => `Role-specific optimizations for every ${game} hero`,
    fallbackHeaders: {
      optimization: 'Optimization',
      critRate: 'Critical rate',
      efficiency: 'Efficiency index',
      impact: 'Win impact'
    }
  },
  reliability: {
    badge: 'RELIABILITY & MAINTENANCE',
    title: 'Enterprise-grade service',
    description: 'Proactive supervision, rapid fixes, and streaming compliance for a stress-free experience.',
    cards: {
      detection: 'Critical incident rate',
      detectionFootnote: 'Continuous monitoring',
      uptime: 'Availability',
      uptimeFootnote: 'Highly available infrastructure',
      response: 'Support response time',
      responseFootnote: 'Dedicated 24/7 team'
    },
    maintenanceTitle: 'Proactive maintenance',
    encryption: 'Encryption',
    isolation: 'Isolation layers',
    updates: 'Maintenance updates / week',
    incidents: 'Incidents (30d)',
    surveillanceTitle: 'Automated monitoring',
    surveillanceToggles: {
      antiDebug: 'Integrity monitoring',
      antiVM: 'Virtual environment validation',
      kernel: 'Hardened kernel service'
    },
    protectionNote: 'Full protection against software conflicts and driver drifts'
  },
  network: {
    badge: 'CLOUD INFRASTRUCTURE',
    title: 'Ultra-fast global network',
    description: (serverCount: number) =>
      `${serverCount} points of presence kept in sync to sustain overlay and streaming responsiveness.`,
    cards: {
      servers: 'Servers',
      ping: 'Average ping',
      loss: 'Packet loss',
      jitter: 'Jitter'
    },
    bandwidthLabel: 'Max bandwidth',
    bandwidthSubtitle: 'Per connection',
    encryptionLabel: 'Encryption',
    encryptionSubtitle: 'Maximum security',
    ddos: 'Active DDoS protection'
  },
  user: {
    badge: 'COMMUNITY & SATISFACTION',
    title: (total: string) => `Trusted by ${total} Players`,
    subtitle: 'An active, satisfied community that highlights our quality',
    cards: {
      total: 'Total users',
      active: 'Active (30d)',
      session: 'Avg session',
      games: 'Games/day'
    },
    ratingLabel: 'Satisfaction score',
    recommendationLabel: 'Recommendation rate'
  },
  nativeReasons: {
    title: 'Why choose our native build?',
    description: (game: string) => `Optimized end to end for ${game}, with measured performance and dedicated support.`
  },
  featuresTitle: 'Included features',
  featureNotesTitle: 'Implementation notes (stay ToS-friendly)',
  cta: {
    title: (game: string) => `Ready to elevate your ${game} experience?`,
    description: 'Activate the PulseForge suite and unlock creative tools built for coaching, streaming, and competition.',
    button: 'Choose my plan'
  },
  subscriptionPlans: {
    essentiel: {
      name: 'Essential Pack',
      description: 'Reliable performance and full configurator access to get started immediately.',
      billing: 'per month',
      features: [
        'Access to the standard cloud infrastructure',
        'Community support',
        'Regular security updates',
        'Popular game catalog included'
      ]
    },
    avantage: {
      name: 'Advantage Pack',
      description: 'Extra power and priority support for an optimized experience.',
      billing: 'per month',
      features: [
        'Advanced GPU performance',
        'Priority 24/7 support',
        'Access to premium configurations',
        'Real-time analytics dashboard'
      ]
    },
    élite: {
      name: 'Elite Pack',
      description: 'Dedicated infrastructure and maximum security for the most demanding needs.',
      billing: 'per month',
      features: [
        'Dedicated RTX 4090 virtual machine',
        'Unlimited HWID spoofer',
        'Personal technical consultant',
        'Instant updates and patches'
      ]
    }
  },
  product: {
    description: 'Cloud Overwatch 2 instance bundling tactical overlays, live analytics, and stream-safe modding tools.',
    longDescription:
      'PulseForge for Overwatch 2 is a fully native hardware and software build hosted in our cloud gaming stack. It bundles our tactical overlays, automated coaching modules, and streaming-ready audio/video presets. Built for competitive teams as well as creators, the suite delivers non-intrusive integration with updates synced to every Blizzard patch and server-side orchestration.',
    variants: {
      godmode: {
        name: 'PulseForge Creator',
        usage: 'Native cloud augmentation instance',
        description: 'Cloud-hosted Overwatch 2 instance with tactical overlays, visual modding, and integrated training tools.',
        use_cases: [
          'Team coaching and analytics',
          'Immersive content creation',
          'LAN and online competitions',
          'Comfort macro optimization',
          'Multi-screen experiences'
        ],
        features: [
          'Role-calibrated modular overlays',
          'Post-match analytics modules with export',
          'Meta-synced composition assistant',
          'Stream-safe visual modding profiles',
          'Tournament-certified ergonomic macros',
          'Multi-input integration support (MKB/pad)',
          'Continuous collaborative updates'
        ],
        featureHighlights: [
          'Ranked / all servers – 100% fair-play (screen reading, killfeed, audio, no memory injection)',
          'PulseForge private lobbies – synchronized builds with everyone on PulseForge (cosmetics & advanced training)'
        ],
        featureGroups: [
          {
            title: 'Ranked / fair-play (live)',
            items: [
              'Ult Economy Assistant (light overlay): estimates enemy ultimate progress by role (killfeed, visible damage, time in game) plus an anti-ulti stack reminder for your team.',
              'Fight Timeline: a “teamfight phase” bar that lights up after the first pick and ends at clean-up, with “advantage/outnumbered”, “enemy respawn”, and stagger detection indicators (killfeed analysis).',
              'Cooldown Inference Overlay: infers key enemy cooldowns from visible cues (animation, sound, VFX). Example: Suzu/Kiriko, Lamp/Bap, Immortality consumed → punishment window displayed for 2–3 seconds.',
              'Map & Rotation Coach: interactive mini-maps per point/control, highlights risky angles, retake paths, overtime timers, and best recontest routes (based on the active map).',
              'Crosshair & FOV Optimizer: hero/map recommendations (default placement, head height, pre-aim lanes) plus a gaze heatmap (simulated eye-line via center-screen tracking).',
              'Comm AI Notetaker: local transcription of comms with tags (“Blade ready”, “no lamp”, “push right”), 20-second summaries at the bottom of the screen, silent text ping if no one calls.',
              'Anti-Tilt HUD: contextually hides tilting stats (accuracy, deaths) mid-fight, keeps focus on objectives. Unlocks everything between fights.',
              'Audio Director: role-based audio profiles (Tank/Support/DPS), automatic ducking when key calls trigger, low-frequency shield to better pick up footsteps/ultimates.',
              'Input Coach Micro-movements: detects micro habit errors (late reloads, ability hoarding, unnecessary jumps under hitscan) with short prompts between fights.',
              'Latency Guard: levels out jitter and adapts the stream pre-buffer in-fight vs out-of-fight to keep the cloud feel stable.'
            ]
          },
          {
            title: 'PulseForge private lobbies (everyone on the PulseForge build)',
            description: 'PulseForge Lobby compatible (private lobby options)',
            items: [
              'Shared skins & VFX: team-wide visual sets (weapons, tracers, kill-impact FX), synchronized team sprays, end-of-fight animations; invisible to non-PulseForge players.',
              'Dynamic cooldown sandbox: practice with reduced cooldowns, boosted ultimate charge, scenario runner (e.g. “Nano-Blade 3 tries”, “Dive Winston+Genji on point B”).',
              'Stratboard Live: tactical whiteboard aligned on the map overlay (routes, timings, map control zones), real-time sharing with coach/spectator.',
              'Draft & Lock scrim: lock compositions, force role rotations, auto-export scrim reports (picks, swaps, fight wins, ult diff).',
              'Ghost-Run & Time-Trial: “ghosts” of your best executions (e.g. Tracer pathing, Winston engage route) visible to the whole team.',
              'Stream-Ready Suite: automatic lower thirds, 8-second instant replays, widened killfeed for internal casting, chapter markers.'
            ]
          },
          {
            title: 'Hero packs',
            description: 'Quick and practical examples',
            items: [
              'Genji: Blade Planner (detected “no-Suzu/no-Lamp” window) plus dash reset check (killfeed) and suggested vertical engage route.',
              'Tracer: Blink Economy (blink counter → engage/escape), “Recall Value” (last 3 seconds state reminder) plus pre-aim lanes versus hitscan.',
              'Sombra: Translocator Planner (dynamic safe zones) plus Hack Window reminders on targets without cleanse.',
              'Winston: Dive Timer (jump → zap → bubble → melee → cancel) plus heatmap of effective bubbles on the active map.',
              'Reinhardt: Shatter Angle Coach (likely angle lines, on-screen reminders of enemy stuns/interrupts).',
              'Zarya: Bubble Trade Meter (probable charge value vs peel) plus “gravi combo” alerts ready when burst DPS allies are online.',
              'Sojourn: Rail Discipline (prompts “don’t ego-peek”, optimal rail charge before peek) plus power-spike reminders.',
              'Cassidy: Peek Timer (recommended max exposure per angle) plus sticky grenade “commit/abort” prompt.',
              'Ana: Anti/Nade Value (window for 3+ targets without cleanse) plus Sleep Priority (impact-ranked target list).',
              'Mercy: GA Pathing Preview (safe GA lines) plus beam juggling coach (optimal blue/yellow uptime).',
              'Kiriko: Suzu Priority (alerts on visible imminent threats) plus TP rescue lanes.',
              'Lucio: Beat Risk Meter (active anti-beat conditions) plus fast rollout ghosts.',
              'Baptiste: Immortality Trade (value vs risk) plus lamp angle helper (useful bounces).'
            ]
          },
          {
            title: 'Map & mode modules',
            items: [
              'King of the Hill IQ: retake timing indicators, split paths, “do-not-touch zones” when outnumbered.',
              'Hybrid/Escort: checkpoint playbook (off-angles, key high grounds, enemy spawn timers), “cart push discipline” reminders.',
              'Point flashcards: mini-cards during setup (30s) with three pre-configured plays per team.'
            ]
          },
          {
            title: 'Analytics & coaching',
            items: [
              'Match Story Auto-report: automatic recap (pivots, fight wins, ult diff, decisive picks) plus comparisons to your target MMR.',
              'Session Planner: session goals (two hero focuses + one map), micro-challenges, and adherence score.',
              'A/B Personal HUD: HUD tests (reticle size, minimal HUD) with measured impact on accuracy/KAST-like metrics.',
              'VOD Auto-tag: automatic tagging of recurring mistakes (stagger, over-ult, tunnel vision) with a clickable timeline.'
            ]
          },
          {
            title: 'Accessibility & comfort',
            items: [
              'Color-blind Pro: compliant team/hero palettes plus reinforced outlines on fast projectiles.',
              'Sound-to-HUD: critical audio cues converted into optional visual tiles for the hard of hearing.',
              'Focus Mode: blocks toxic whispers, breathing timer between rounds, guided micro-breaks.'
            ]
          }
        ],
        implementationNotes: [
          'In public ranked, every calculation only uses what is visible/audible (cloud-side vision/ASR) plus killfeed/scoreboard. No memory reading or injection.',
          'Cosmetics, tweaked cooldowns, sandbox scenarios, and live stratboards are reserved for PulseForge private lobbies where everyone runs the same build.',
          'All overlays are opt-in, discreet, and adaptive (auto-hide mid-fight when the visual load rises).'
        ],
        target_audience: 'Coaches, creators, competitive players',
        highlight: 'Meta-synced native suite',
        protection: 'Tournament & stream compliance',
        updates: 'Priority OTA pipeline'
      }
    }
  },
  technical: {
    fpsByResolution: [
      { playability: 'Very smooth', bottleneck: 'No bottleneck (0%)' },
      { playability: 'Very smooth', bottleneck: 'No bottleneck (0%)' },
      { playability: 'Very smooth', bottleneck: 'GPU bottleneck (18%)' }
    ],
    resolutionGuidance: [
      {
        refreshAdvice: 'Ideal for targeting 240 to 360 Hz in competitive play',
        description:
          '1080p esports profile: we sustain 410 FPS on the competition preset with full overlays. Switching to Medium yields 375 FPS and Ultra sits at 201 FPS for cinematic sessions.',
        note: 'Stay on this profile when maximum responsiveness is the priority.'
      },
      {
        refreshAdvice: 'Perfect for 165/240 Hz panels with a sharper image',
        description:
          'Moving to 1440p balances clarity and smoothness: 242 FPS measured on medium settings and still 130 FPS on Ultra with every overlay enabled.',
        note: 'Favour this mode for high-definition streaming or detailed VOD reviews.'
      },
      {
        refreshAdvice: 'Stable beyond 120 Hz for competitive 4K',
        description:
          'At 4K the platform holds 131 FPS on the Medium preset and 70 FPS on Ultra. The limitation comes from the GPU but remains high enough for a steady 120 Hz display.',
        note: 'Use this profile for showcase content or when playing on a 4K screen without major compromises.'
      }
    ],
    improvementTips: [
      'Toggle between our Esports and Ultra presets from the cloud panel to instantly modulate GPU load.',
      'Adjust your streaming resolution (1080p, 1440p, 2160p) according to the indicated FPS buffer to keep responsiveness.',
      'Use the automatic scheduler to spin up a fresh instance before long scrim blocks.',
      'Enable optional overlays only on the maps that need them to free up 3 to 5% resources.',
      'Watch the latency dashboard and trigger a region switch if ping exceeds 30 ms.'
    ],
    advice:
      'Enjoy exceptional smoothness on our cloud infrastructure: 410 FPS in 1080p esports, 242 FPS at 1440p, and 131 FPS in 4K. Adjust resolution to match the quality/responsiveness trade-off you want.',
    augmentationSuite: {
      modules: [
        'Dynamic tactical overlay',
        'Real-time ability analytics',
        'Team composition assistant',
        'Calibrated spatial audio profile',
        'Automated micro-coaching'
      ],
      notes: 'Automatically syncs with official patch notes and esports profiles.'
    },
    heroSynergy: [
      {
        preset: 'Sniper Focus',
        coachingNotes: '144 Hz overlay to secure long sightlines and coordinate position callouts.'
      },
      {
        preset: 'Precision Aim',
        coachingNotes: 'Timing assistants for mid-range duels plus cooldown reminders.'
      },
      {
        preset: 'Duelist',
        coachingNotes: 'Visibility spike tracking and Bob monitoring to align engagements.'
      },
      {
        preset: 'Assault',
        coachingNotes: 'Sprint zone monitoring and target windows for Helix Rocket.'
      },
      {
        preset: 'Mobility',
        coachingNotes: 'Optimal route guidance and health-pack tracking to play around Recall.'
      },
      {
        preset: 'Agility',
        coachingNotes: 'Dragonblade timeline with alerts for key enemy resources.'
      }
    ]
  }
}

const estonianCopy: LocaleContent = {
  breadcrumbs: { home: 'Avaleht', games: 'Mängud' },
  reviewsLabel: 'arvustust',
  optimizationBadge: 'NATIIVSELT OPTIMEERITUD',
  nativeAdvantages: [
    {
      icon: Code,
      title: 'Natiivne integratsioon',
      description: 'Moodulid on kalibreeritud Overwatch 2 jaoks ja sünkroniseeritakse pärast iga Blizzardi värskendust'
    },
    {
      icon: Shield,
      title: 'Täielik vastavus',
      description: 'Voogedastuseks turvalised overlayd, mis järgivad e-spordi juhiseid ilma pealetükkiva injektsioonita'
    },
    {
      icon: Gauge,
      title: 'Häälestatud jõudlus',
      description: 'Stabiilsed 400+ FPS ja kontrollitud latentsus tänu meie kohandatud serveriprofiilile'
    },
    {
      icon: Trophy,
      title: 'Loominguline tugi',
      description: 'Pühendunud saatja aitab seadistada coaching’u, striimi ja LAN-presette'
    }
  ],
  quickStats: {
    avgFps: 'Keskmine FPS',
    onePercentLow: '1% madal (4K Ultra)',
    latency: 'Süsteemi latentsus',
    inputLag: 'Sisendviivitus'
  },
  subscription: {
    title: 'Vali oma tellimus',
    popular: 'Kõige populaarsem',
    viewDetails: 'Vaata üksikasju'
  },
  metrics: {
    badge: 'JÕUDLUSMÕÕDIKUD',
    title: 'Kalibreeritud jõudlus Overwatch 2 jaoks',
    description:
      'Meie PulseForge’i instantsi sisemised mõõtmised: 410 FPS keskmiselt 1080p e-spordi eelseadistusel, 242 FPS 1440p juures ja 131 FPS 4K-s. 1% madal langeb 84 FPS-ni 4K Ultra stsenaariumis koos täiskomplekti overlaididega, jättes rohkelt varu ka äärmusliku koormuse korral.',
    statCards: {
      maxFps: 'Maksimaalne täheldatud FPS',
      onePercentLow: '1% madal (4K Ultra)',
      inputLag: 'Keskmine sisendviivitus'
    },
    allocationTitle: 'PulseForge’i serveri eraldus',
    datacenterTitle: 'Andmekeskuse stabiilsus',
    usage: {
      cpu: 'CPU kasutus',
      gpu: 'GPU kasutus',
      ram: 'RAM kasutus',
      vram: 'VRAM kasutus'
    },
    thermals: {
      cpu: 'CPU temperatuur',
      gpu: 'GPU temperatuur',
      power: 'Võimsustarve'
    },
    stabilityNote: 'Temperatuurid püsivad kontrolli all ja termiline varu säilib'
  },
  fpsTable: {
    title: 'FPS resolutsiooni järgi',
    description:
      'Meie pilveprofiilid häälestavad ressursid automaatselt: siin on FPS tase, kui suurendad või vähendad resolutsiooni keskmiste seadistustega.',
    headers: {
      resolution: 'Resolutsioon',
      avg: 'Keskmine FPS',
      min: 'Min',
      max: 'Maks',
      playability: 'Mängitavus',
      bottleneck: 'Pudelkits'
    },
    footnote: 'Sisemised Overwatch 2 profiili benchmarkid (keskmine eelseadistus, peamised võistluskaardid).'
  },
  quality: {
    title: 'FPS graafikaseadistuste kaupa',
    description: 'Kasuta pilvekontrollerit, et valida vajalik eelseadistus ja jääda näidatud FPS vahemikku.',
    badge: 'bench'
  },
  resolution: {
    title: 'Kuidas pilvest resolutsiooni reguleerida',
    description:
      'Meie sisemised mõõtmised näitavad tegelikku FPS varu, kui tõstad või langetad eraldusvõimet PulseForge’i paneelist.',
    windowLabel: 'Täheldatud vahemik',
    footnote: 'Väärtused põhinevad meie Overwatch 2 stsenaariumidel keskmise ja ultra eelseadistusega ning overlayd sisse lülitatud.',
    avgLabel: 'Keskmine FPS'
  },
  experience: {
    title: 'PulseForge’i pilvekogemus',
    description: (productName: string, latency: number) =>
      `${productName} töötab täielikult meie pilveinfrastruktuuril: puudub kohalik seadistus, kohene ettevalmistus ja keskmine latentsus hoitakse ${latency} ms juures.`,
    bullets: [
      'Overlayd, modid ja värskendused rakendatakse serveripoolselt ilma sinu arvutit puutumata.',
      'Lülitu 1080p, 1440p või 4K vahel pilvepaneelist, säilitades näidatud FPS varu.',
      'Pidev jälgimine: vaheta regiooni, kui ping ületab 30 ms, et kontroll säiliks.'
    ],
    profileLabel: 'E-spordi profiil',
    profileSubtitle: 'Keskmine mõõdetud 1080p juures',
    lowLabel: '1% madal 4K Ultra',
    lowSubtitle: 'Äärmusliku koormuse stsenaarium'
  },
  improvement: {
    tipsTitle: 'Vihjed FPS-i tõstmiseks',
    adviceTitle: 'Kasutussoovitus'
  },
  augmentation: {
    badge: 'PULSEFORGE’I ABISUITE',
    title: 'Reaalajas taktikamoodulid',
    description: 'Kontekstuaalsed overlayd, kohanduv coaching ja pro taseme teadmised otse sinu HUD-is.',
    modulesTitle: 'Kaasa kuuluvad põhimoodulid',
    reactivityTitle: 'Reageerimisvõime ja katvus',
    overlayLabel: 'Overlay värskendus',
    modulesLabel: 'Aktiivsed moodulid',
    coachingLabel: 'Kohanduv coaching',
    reactionLabel: 'Keskmine reaktsiooniaeg',
    motionNote: 'Naturaliseeritud liikumised sujuva ja ergonoomilise tunde jaoks',
    awarenessLabel: 'Teadlikkuse indeks',
    focusLabel: 'Taktikaline fookus'
  },
  legacyPrecision: {
    badge: 'ARENENUD TÄPSUSSÜSTEEM',
    title: 'Profi tasemel abistatud jälgimine',
    description: 'Tark jälgimise häälestus ja ergonoomiline abi loomuliku tunnetuse jaoks.',
    stats: {
      tracking: 'Jälgimise täpsus',
      smoothness: 'Sujuvus',
      fov: 'Dünaamiline vaateväli',
      switchTime: 'Lülitusaeg'
    },
    advancedTitle: 'Täiustatud statistika',
    metrics: {
      priority: 'Prioriteetne sihtimine',
      weapon: 'Relvade ühilduvus',
      reaction: 'Reaktsiooniaeg'
    },
    focusTitle: 'Fookuspunktid'
  },
  hero: {
    badge: 'KANGELASPROFIILID',
    title: 'Pühendatud optimeerimised',
    description: 'Iga moodul sisaldab eelseadistust, mis on kalibreeritud Overwatch 2 põhiklasside ja kangelaste jaoks.',
    headers: {
      hero: 'Kangelane',
      overlay: 'Overlay fookus',
      clarity: 'Visuaalne selgus',
      preset: 'Soovitatud eelseadistus',
      notes: 'Coaching’u märkmed'
    },
    fallbackTitle: 'Kangelaste jõudlus',
    fallbackDescription: (game: string) => `Spetsiifilised optimeerimised iga ${game} kangelase jaoks`,
    fallbackHeaders: {
      optimization: 'Optimeerimine',
      critRate: 'Kriitiline määr',
      efficiency: 'Tõhususindeks',
      impact: 'Võidumõju'
    }
  },
  reliability: {
    badge: 'USALDUSVÄÄRSUS JA HOOLDUS',
    title: 'Ettevõtte tasemel teenus',
    description: 'Proaktiivne järelevalve, kiired parandused ja voogedastuse vastavus rahulikuks kogemuseks.',
    cards: {
      detection: 'Kriitiliste juhtumite määr',
      detectionFootnote: 'Jätkuv järelevalve',
      uptime: 'Töökindlus',
      uptimeFootnote: 'Kõrge kättesaadavusega infrastruktuur',
      response: 'Toe reageerimisaeg',
      responseFootnote: 'Pühendunud meeskond 24/7'
    },
    maintenanceTitle: 'Proaktiivne hooldus',
    encryption: 'Krüptimine',
    isolation: 'Isolatsioonikihid',
    updates: 'Hoolduse värskendused / nädal',
    incidents: 'Intsidentide arv (30p)',
    surveillanceTitle: 'Automaatne järelevalve',
    surveillanceToggles: {
      antiDebug: 'Tervikluse jälgimine',
      antiVM: 'Virtuaalkeskkondade kontroll',
      kernel: 'Optimeeritud kerneli teenus'
    },
    protectionNote: 'Täielik kaitse tarkvarakonfliktide ja draiverihälvete vastu'
  },
  network: {
    badge: 'PILVEINFRASTRUKTUUR',
    title: 'Ülikiire globaalne võrk',
    description: (serverCount: number) =>
      `${serverCount} teenuspunkti on sünkroonitud, et hoida overlay ja voogedastuse reageerimisvõimet.`,
    cards: {
      servers: 'Serverid',
      ping: 'Keskmine ping',
      loss: 'Paketikadu',
      jitter: 'Jitter'
    },
    bandwidthLabel: 'Maksimaalne ribalaius',
    bandwidthSubtitle: 'Ühenduse kohta',
    encryptionLabel: 'Krüptimine',
    encryptionSubtitle: 'Maksimaalne turvalisus',
    ddos: 'Aktiivne DDoS-kaitse'
  },
  user: {
    badge: 'KOGUKOND JA RAHULOLU',
    title: (total: string) => `Usaldusväärne ${total} mängija poolt`,
    subtitle: 'Aktiivne ja rahulolev kogukond, mis kinnitab meie kvaliteeti',
    cards: {
      total: 'Kasutajaid kokku',
      active: 'Aktiivsed (30p)',
      session: 'Keskmine sessioon',
      games: 'Mänge päevas'
    },
    ratingLabel: 'Rahuloluhinne',
    recommendationLabel: 'Soovituse määr'
  },
  nativeReasons: {
    title: 'Miks valida meie natiivne build?',
    description: (game: string) => `Läbivalt ${game} jaoks optimeeritud, mõõdetud jõudluse ja pühendunud toe abil.`
  },
  featuresTitle: 'Kaasa kuuluvad funktsioonid',
  featureNotesTitle: 'Rakenduse märkused (ToS-sõbralik kasutus)',
  cta: {
    title: (game: string) => `Valmis oma ${game} kogemust tõstma?`,
    description: 'Aktiveeri PulseForge’i komplekt ja ava coaching’u, striimimise ja võistluste jaoks loodud tööriistad.',
    button: 'Vali minu pakett'
  },
  subscriptionPlans: {
    essentiel: {
      name: 'Essential pakett',
      description: 'Usaldusväärne jõudlus ja täielik konfiguratori ligipääs koheseks alustamiseks.',
      billing: 'kuus',
      features: [
        'Juurdepääs standardsele pilveinfrastruktuurile',
        'Kogukonna tugi',
        'Regulaarsed turvauuendused',
        'Populaarsete mängude kataloog kaasas'
      ]
    },
    avantage: {
      name: 'Advantage pakett',
      description: 'Rohkem võimsust ja prioriteetne tugi sujuvaks kogemuseks.',
      billing: 'kuus',
      features: [
        'Täiendatud GPU jõudlus',
        'Prioriteetne tugi 24/7',
        'Ligipääs premium konfiguratsioonidele',
        'Reaalajas analüütika töölaud'
      ]
    },
    élite: {
      name: 'Elite pakett',
      description: 'Pühendatud infrastruktuur ja maksimaalne turvalisus kõige nõudlikumatele vajadustele.',
      billing: 'kuus',
      features: [
        'Pühendatud RTX 4090 virtuaalmasin',
        'Piiramatu HWID Spoofer',
        'Isiklik tehniline konsultant',
        'Hetkelised uuendused ja paigad'
      ]
    }
  },
  product: {
    description: 'Pilvepõhine Overwatch 2 instants, mis koondab taktikaliselt overlayd, reaalajas analüütika ja stream-safe modding tööriistad.',
    longDescription:
      'PulseForge Overwatch 2 jaoks on täielikult natiivne riist- ja tarkvarapakett, mis on majutatud meie pilvemängu platvormil. See koondab meie taktikalised overlayd, automatiseeritud coaching’u moodulid ning striimiks valmis audio-/videopresetid. Mõeldud nii võistkondadele kui loojatele, pakkudes mittepealetükkivat integreerimist värskendustega, mis sünkroonitakse iga Blizzardi patchiga ja serveripoolse orkestreerimisega.',
    variants: {
      godmode: {
        name: 'PulseForge Creator',
        usage: 'Natiivne pilvepõhine augmentatsiooni instants',
        description: 'Pilvepõhine Overwatch 2 instants taktikaliste overlayde, visuaalse modimise ja integreeritud treeningtööriistadega.',
        use_cases: [
          'Meeskonna coaching ja analüütika',
          'Elamuslik sisuloomine',
          'LAN- ja online-võistlused',
          'Mugavusmakrode optimeerimine',
          'Mitme ekraani kogemused'
        ],
        features: [
          'Rollipõhiselt kalibreeritud modulaarsed overlayd',
          'Matši järelanalüüsi moodulid ekspordiga',
          'Metaga sünkroonis koosseisunõustaja',
          'Stream-safe visuaalse modimise profiilid',
          'Turniirikindlad ergonoomilised makrod',
          'Mitme sisendi tugi (MKB/pult)',
          'Jätkuvad koostööl põhinevad uuendused'
        ],
        featureHighlights: [
          'Reastatud / kõik serverid – 100% fair-play (ekraani lugemine, killfeed, audio, ilma mälusüstita)',
          "PulseForge'i privaatlobid – sünkroonitud buildid kõigile PulseForge'is (kosmeetika ja edasijõudnud treening)"
        ],
        featureGroups: [
          {
            title: 'Reastatud / fair-play (live)',
            items: [
              'Ult Economy Assistant (kerge overlay): hindab vastaste ulti edenemist rolli järgi (killfeed, nähtav kahju, mänguaeg) + meeskonnale anti-ulti-stack meeldetuletus.',
              'Fight Timeline: „teamfight’i faasi” riba süttib esimese pick’i järel ja lõppeb clean-up’iga, näidates „eelis / vähemus”, „vastase respawn” ja staggeri tuvastust (killfeed’i analüüs).',
              'Cooldown Inference Overlay: järeldab võtme cooldown’id nähtavate vihjete põhjal (animatsioon, heli, VFX). Nt Suzu/Kiriko, Lamp/Bap, Immortality kasutatud → karistusaken 2–3 sekundiks.',
              'Map & Rotation Coach: interaktiivsed minikaardid iga punkti/kontrolli jaoks, hoiatab ohtlike nurkade eest, näitab retake-teid, overtime’i taimerid ja parimad recontest-marsruudid (aktiivse kaardi põhjal).',
              'Crosshair & FOV Optimizer: soovitused kangelase/kaardi kaupa (vaikimisi paigutus, pea kõrgus, pre-aim rajad) + pilgukaart (simuleeritud silmaliin ekraani keskpunkti jälgimisest).',
              'Comm AI Notetaker: salvestab kohapeal commid siltidega („Blade ready”, „no lamp”, „push right”), kuvab iga 20 s ekraani allosas kokkuvõtte ja saadab vaikse tekstipingi, kui keegi ei call’i.',
              'Anti-Tilt HUD: peidab võitluse ajal tilt’i tekitavad statid (täpsus, surmad), hoiab fookuse eesmärkidel. Kõik avaneb uuesti võitluste vahel.',
              'Audio Director: rollipõhised audioprofiilid (Tank/Tugi/DPS), automaatne mixi langetamine oluliste call’ide ajal, madalsagedusfilter paremaks sammude/ultide kuulmiseks.',
              'Input Coach Micro-liigutused: tuvastab mikroharjumuste vead (hiline reload, võimete kogumine, ebavajalikud hüpped hitscan’i vastu) ja annab lühikesed promptid võitluste vahel.',
              'Latency Guard: tasandab jitterit ja kohandab stream’i eelpuhvrit võitluse ajal vs väljas, et pilvekogemus püsiks stabiilne.'
            ]
          },
          {
            title: "PulseForge'i privaatlobid (kõik PulseForge buildil)",
            description: 'Ühilduv PulseForge Lobby lahendusega (privaatlobi valikud)',
            items: [
              'Jagatud skinid ja VFX-id: tiimi visuaalseted setid (relvad, tracer’id, kill-impact FX), sünkroonitud tiimispreid, lahingu lõpu animatsioonid; nähtamatud neile, kes PulseForge’i ei kasuta.',
              'Dünaamiline cooldown-sandbox: treening lühendatud cooldown’idega, kiirendatud ulti charge, stsenaariumijooksja (nt „Nano-Blade 3 katset”, „Dive Winston+Genji punkt B-le”).',
              'Stratboard Live: taktikaline tahvel kaardiga overlay’s (marsruudid, ajastused, map control tsoonid), reaalajas jagamine coach’i või spectatoriga.',
              'Draft & Lock scrim: lukustab koosseisud, sunnib rollirotatsiooni, ekspordib automaatselt scrimi raporti (picks, swapid, fight-win’id, ult-diff).',
              'Ghost-Run & Time-Trial: „kummitused” teie parimatest sooritustest (nt Traceri liikumine, Winstoni engage) nähtavad kogu tiimile.',
              'Stream-Ready Suite: automaatsed lower thirdid, 8-sekundilised kohesed kordused, laiendatud killfeed sisekommentaatorile, peatükkide markerid.'
            ]
          },
          {
            title: 'Kangelase paketid',
            description: 'Kiired ja praktilised näited',
            items: [
              'Genji: Blade Planner (tuvastatud „no-Suzu/no-Lamp” aken) + dash reset kontroll (killfeed) + soovitatud vertikaalne engage-tee.',
              'Tracer: Blink Economy (blink loendur → engage/escape), „Recall Value” (viimase 3 s seisundi meeldetuletus) + pre-aim rajad hitscan’i vastu.',
              "Sombra: Translocator Planner (dünaamilised turvalised tsoonid) + Hack Window meeldetuletused sihtmärkidele ilma cleanse'ita.",
              'Winston: Dive Timer (hüpe → zap → bubble → melee → cancel) + aktiivse kaardi efektiivsete bubble’ite soojuskaart.',
              'Reinhardt: Shatter Angle Coach (tõenäolised nurkjooned, ekraanile ilmuvad vaenlase stunnide/katkestuste meeldetuletused).',
              'Zarya: Bubble Trade Meter (tõenäoline charge’i väärtus vs peel) + „gravi kombo” hoiatused, kui burst DPS-liitlased on valmis.',
              'Sojourn: Rail Discipline (promptid „ära ego-peeki”, optimaalne raili laeng enne piilumist) + power-spike meeldetuletused.',
              'Cassidy: Peek Timer (soovituslik maksimaalne kokkupuute aeg nurga järgi) + sticky granaadi „commit/abort” prompt.',
              'Ana: Anti/Nade Value (aken 3+ sihtmärgile ilma cleanse’ita) + Sleep Priority (mõju järgi järjestatud sihtmärkide nimekiri).',
              'Mercy: GA Pathing Preview (ohutud GA trajektoorid) + beam juggling coach (sinise/kollase kiire optimaalne uptime).',
              'Kiriko: Suzu Priority (hoiatused nähtavate peatselt saabuvate ohtude kohta) + TP päästerajad.',
              'Lucio: Beat Risk Meter (aktiivsed anti-beat tingimused) + kiired rollout-kummitused.',
              'Baptiste: Immortality Trade (väärtus vs risk) + lamp angle helper (kasulikud põrked).'
            ]
          },
          {
            title: 'Kaardi ja mänguviisi moodulid',
            items: [
              'King of the Hill IQ: retake’i ajastuse indikaatorid, split-teed, „ära-astuta tsoonid” kui olete vähemuses.',
              'Hybrid/Escort: checkpoint’i playbook (off-angles, võtme kõrgendikud, vastaste spawni taimerid), „cart push discipline” meeldetuletused.',
              'Punkti flashcardid: minikaardid setup’i (30 s) ajal kolme eelseadistatud käiguga tiimi kohta.'
            ]
          },
          {
            title: 'Analüütika ja coaching',
            items: [
              'Match Story Auto-report: automaatne kokkuvõte (pöörded, fight-võidud, ult-diff, otsustavad pickid) + võrdlus siht-MMR-iga.',
              'Session Planner: sessiooni eesmärgid (2 kangelase fookust + 1 kaart), mikroülesanded ja täituvuse skoor.',
              'A/B Personal HUD: HUDi testid (sihtmärgi suurus, minimaalne HUD) mõõdetud mõjuga täpsusele/KAST-laadsetele näitajatele.',
              'VOD Auto-tag: korduvate vigade automaatne märgistamine (stagger, üle-ulti, tunnel vision) klõpsatava ajajoonega.'
            ]
          },
          {
            title: 'Ligipääsetavus ja mugavus',
            items: [
              'Color-blind Pro: meeskonna/kangelase paletid standardite järgi + kiirete projektiilide tugevdatud kontuurid.',
              'Sound-to-HUD: kriitilised helisignaalid muudetakse valikuliseks visuaalseteks ikoonideks kuulmispuudega mängijatele.',
              'Focus Mode: blokeerib toksilised whisperid, hingamistimer roundide vahel, juhendatud mikro-pausid.'
            ]
          }
        ],
        implementationNotes: [
          'Avalikes reitingumängudes põhineb kogu arvutus ainult nähtaval/kuuldaval (pilvepoolne visioon/ASR) + killfeed/scoreboard. Mälulugemist ega süsti pole.',
          "Kosmeetika, muudetud cooldownid, sandbox-stsenaariumid ja reaalajas stratboardid on mõeldud ainult PulseForge'i privaatlobidele, kus kõik kasutavad sama buildi.",
          'Kõik overlayd on opt-in, diskreetsed ja kohanduvad (peidavad end võitluse ajal, kui visuaalne müra kasvab).'
        ],
        target_audience: 'Treenerid, loojad, võistlusmängijad',
        highlight: 'Metaga sünkroonis natiivne suite',
        protection: 'Turniiri ja striimi nõuetele vastavus',
        updates: 'Prioriteetne OTA töövoog'
      }
    }
  },
  technical: {
    fpsByResolution: [
      { playability: 'Väga sujuv', bottleneck: 'Pudelkits puudub (0%)' },
      { playability: 'Väga sujuv', bottleneck: 'Pudelkits puudub (0%)' },
      { playability: 'Väga sujuv', bottleneck: 'GPU pudelkits (18%)' }
    ],
    resolutionGuidance: [
      {
        refreshAdvice: 'Ideaalne 240–360 Hz võistlusmänguks',
        description:
          '1080p e-spordi profiil: hoiame 410 FPS keskmiselt võistluseelsedistusel täis overlay komplektiga. Keskmisele lülitudes saad 375 FPS ja Ultra annab 201 FPS filmilisteks seanssideks.',
        note: 'Hoia seda profiili, kui prioriteediks on maksimaalne reageerimisvõime.'
      },
      {
        refreshAdvice: 'Sobib 165/240 Hz paneelidele teravama pildiga',
        description:
          '1440p-le liikumine tasakaalustab selguse ja sujuvuse: 242 FPS mõõdetud keskmistel seadistustel ja endiselt 130 FPS Ultra režiimis kõigi overlaydega.',
        note: 'Eelista seda režiimi suure eraldusvõimega striimimiseks või detailsete VOD-analüüside jaoks.'
      },
      {
        refreshAdvice: 'Stabiilne üle 120 Hz konkurentsivõimeliseks 4K-ks',
        description:
          '4K juures hoiab platvorm 131 FPS keskmiselt keskmisel eelseadistusel ja 70 FPS Ultra režiimis. Piirang tuleneb GPU-st, kuid säilib 120 Hz jaoks vajalik puhver.',
        note: 'Kasuta seda profiili showcase-sisu või 4K ekraanil mängimise jaoks ilma suuremate kompromissideta.'
      }
    ],
    improvementTips: [
      'Lülitu meie Esports- ja Ultra-eelseadistuste vahel pilvepaneelist, et GPU koormust hetkega kohandada.',
      'Reguleeri oma voogedastuse resolutsiooni (1080p, 1440p, 2160p) vastavalt märgitud FPS-varule, et hoida reageerimisvõimet.',
      'Kasuta automaatset ajastajat, et käivitada enne pikki treeninguid värske instants.',
      'Luba valikulised overlayd ainult kaartidel, kus neid vajad, et vabastada 3–5% ressursse.',
      'Jälgi latentsusdashi ja vaheta regiooni, kui ping ületab 30 ms.'
    ],
    advice:
      'Naudi erakordset sujuvust meie pilveinfrastruktuuril: 410 FPS 1080p e-spordis, 242 FPS 1440p juures ja 131 FPS 4K-s. Kohanda resolutsiooni, et leida endale sobiv kvaliteedi ja reaktsioonivõime tasakaal.',
    augmentationSuite: {
      modules: [
        'Dünaamiline taktikaline overlay',
        'Reaalajas võimete analüütika',
        'Meeskonna koosseisu assistent',
        'Kalibreeritud ruumilise heli profiil',
        'Automatiseeritud mikrocoaching'
      ],
      notes: 'Sünkroonib automaatselt ametlike patchnote’ide ja e-spordi profiilidega.'
    },
    heroSynergy: [
      {
        preset: 'Snaipri fookus',
        coachingNotes: '144 Hz overlay hoiab pikad vaatejooned ja koordineerib positsioonikutsed.'
      },
      {
        preset: 'Täpsus sihtimine',
        coachingNotes: 'Ajastusassistendid keskmise kauguse duellideks ja cooldown’i meeldetuletused.'
      },
      {
        preset: 'Duelist',
        coachingNotes: 'Nähtavuse tippude jälgimine ja BOB-i monitooring rünnakute sünkroniseerimiseks.'
      },
      {
        preset: 'Rünnak',
        coachingNotes: 'Sprintitsoonide jälgimine ja sihtimisaknad Helix Rocketi jaoks.'
      },
      {
        preset: 'Liikuvus',
        coachingNotes: 'Optimaalsed marsruudid ja tervisepakettide jälgimine, et Recalli ümber mängida.'
      },
      {
        preset: 'Käbedus',
        coachingNotes: 'Dragonblade’i ajajoon koos hoiatustega võtmevastaste ressursside kohta.'
      }
    ]
  }
}

const copyByLocale: Record<'fr' | 'en' | 'et', LocaleContent> = {
  fr: frenchCopy,
  en: englishCopy,
  et: estonianCopy
}

type LocaleKey = keyof typeof copyByLocale

const localeOverridesByProduct: Record<string, Record<LocaleKey, DeepPartial<LocaleContent>>> = {
  'gaming-warzone': {
    fr: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Optimisation Warzone native',
          description: 'Profils Battle Royale calibrés avec équilibre CPU↔GPU et latence stream maîtrisée.'
        },
        {
          icon: Zap,
          title: 'Provisionnement instantané',
          description: 'Instances Warzone prêtes en quelques secondes avec bascule automatique de région selon le ping.'
        },
        {
          icon: Shield,
          title: 'Surcouche compétitive',
          description: 'Overlays BR, analytics TTK et coaching adaptatif sans compromettre le fair-play.'
        },
        {
          icon: Trophy,
          title: 'Support scrim & contenu',
          description: 'Accompagnement presets Resurgence, sandbox TTK et production stream premium.'
        }
      ],
      metrics: {
        title: 'Performances calibrées pour Call of Duty: Warzone',
        description:
          'Mesures internes sur notre instance PulseForge (profil Medium compétitif) : 217 FPS de moyenne et 1% low à 155 FPS en 1080p. Le gameplay reste très fluide jusqu’en 4K grâce à l’optimisation CPU↔GPU et au pipeline vidéo faible latence.',
        statCards: {
          maxFps: 'FPS maximum observé (1080p Medium)',
          onePercentLow: '1% low (1080p Medium)',
          inputLag: 'Input lag moyen'
        },
        allocationTitle: 'Allocation in-game (profil Medium)',
        datacenterTitle: 'Monitoring cloud PulseForge',
        usage: {
          cpu: 'Bottleneck dominant',
          gpu: 'Marge GPU',
          ram: 'Mémoire utilisée',
          vram: 'VRAM utilisée'
        },
        thermals: {
          cpu: 'Température CPU cloud',
          gpu: 'Température GPU',
          power: 'Consommation électrique'
        },
        stabilityNote: 'Optimisation Warzone dédiée : CPU maintenu à 93–96 % avec marge stable jusqu’en 4K.'
      },
      fpsTable: {
        footnote: 'Benchmarks internes Warzone (profil Medium compétitif sur Al Mazrah, Vondel et Fortune’s Keep).'
      },
      resolution: {
        title: 'Comment ajuster la résolution côté cloud',
        description:
          'Nos mesures internes traduisent la marge FPS réelle quand vous ajustez la définition depuis le panneau PulseForge.',
        windowLabel: 'Fenêtre relevée',
        footnote: 'Valeurs relevées sur profil Medium et Ultra Warzone avec overlays actifs.',
        avgLabel: 'FPS moyen'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} tourne intégralement sur notre infrastructure : provisionnement instantané, optimisation réseau dynamique et latence moyenne stabilisée à ${latency} ms.`,
        bullets: [
          'Overlays, profils et mises à jour appliqués côté serveur — rien à installer localement.',
          'Bascule 1080p/1440p/4K depuis le panneau PulseForge en respectant la marge FPS mesurée.',
          'Monitoring ping/jitter/pertes avec bascule automatique de région si instabilité détectée.'
        ],
        profileSubtitle: 'Moyenne mesurée en 1080p Medium',
        lowLabel: '1% low 1080p Medium',
        lowSubtitle: 'Fenêtre basse observée'
      },
      improvement: {
        adviceTitle: 'Option « CPU Boost » (côté hôte)'
      },
      augmentation: {
        description: 'Modules Battle Royale contextuels : TTK, économie d’escouade et overlays Resurgence stream-safe.'
      },
      hero: {
        badge: 'PROFILS PAR RÔLE / ARME',
        title: 'Optimisations dédiées',
        description: 'Chaque module propose un preset calibré pour les archétypes Warzone (AR, SMG, Sniper, Support, etc.).',
        headers: {
          hero: 'Rôle / Arme',
          overlay: 'Focus overlay',
          clarity: 'Clarté visuelle',
          preset: 'Preset conseillé',
          notes: 'Notes coaching'
        },
        fallbackDescription: (game: string) => `Optimisations archétype par archétype pour ${game}`
      },
      nativeReasons: {
        description: (game: string) => `Optimisé de A à Z pour ${game} en Battle Royale, avec overlays stream-safe et support dédié.`
      }
    },
    en: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Native Warzone optimization',
          description: 'Battle royale profiles with balanced CPU↔GPU pipeline and stabilized stream latency.'
        },
        {
          icon: Zap,
          title: 'Instant provisioning',
          description: 'Warzone instances spin up in seconds with automatic region failover based on ping.'
        },
        {
          icon: Shield,
          title: 'Competitive overlay stack',
          description: 'BR overlays, TTK analytics, and adaptive coaching while preserving fair play.'
        },
        {
          icon: Trophy,
          title: 'Scrim & content support',
          description: 'Guidance for Resurgence presets, TTK sandbox drills, and premium stream production.'
        }
      ],
      metrics: {
        title: 'Calibrated performance for Call of Duty: Warzone',
        description:
          'Internal measurements on our PulseForge instance (competitive Medium profile): 217 FPS average and 1% low at 155 FPS in 1080p. Gameplay stays very smooth up to 4K thanks to Warzone-specific CPU↔GPU tuning and a low-latency video pipeline.',
        statCards: {
          maxFps: 'Peak observed FPS (1080p Medium)',
          onePercentLow: '1% low (1080p Medium)',
          inputLag: 'Average input lag'
        },
        allocationTitle: 'In-game allocation (Medium profile)',
        datacenterTitle: 'PulseForge cloud monitoring',
        usage: {
          cpu: 'Dominant bottleneck',
          gpu: 'GPU headroom',
          ram: 'Memory usage',
          vram: 'VRAM usage'
        },
        thermals: {
          cpu: 'Cloud CPU temperature',
          gpu: 'GPU temperature',
          power: 'Power draw'
        },
        stabilityNote: 'Warzone-tuned CPU↔GPU pipeline keeps margin stable through 4K.'
      },
      fpsTable: {
        footnote: 'Internal Warzone benchmarks (competitive Medium profile across Al Mazrah, Vondel, and Fortune’s Keep).'
      },
      resolution: {
        footnote: 'Values captured on Warzone Medium and Ultra presets with overlays enabled.',
        windowLabel: 'Observed window',
        avgLabel: 'Average FPS'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} runs fully on our cloud: instant provisioning, dynamic network optimization, and average latency held at ${latency} ms.`,
        bullets: [
          'Overlays, profiles, and updates apply server-side—nothing to install locally.',
          'Switch between 1080p, 1440p, or 4K from the PulseForge panel while keeping the measured FPS margin.',
          'Live ping/jitter/loss monitoring with automatic region failover if instability appears.'
        ],
        profileSubtitle: 'Average measured at 1080p Medium',
        lowLabel: '1% low 1080p Medium',
        lowSubtitle: 'Observed low window'
      },
      improvement: {
        adviceTitle: 'CPU Boost option (host side)'
      },
      augmentation: {
        description: 'Battle royale overlays, TTK analytics, and Resurgence-ready coaching in a stream-safe suite.'
      },
      hero: {
        badge: 'ROLE / WEAPON PROFILES',
        title: 'Dedicated optimizations',
        description: 'Each module ships a preset tuned for Warzone archetypes (AR, SMG, Sniper, Support, etc.).',
        headers: {
          hero: 'Role / Weapon',
          overlay: 'Overlay focus',
          clarity: 'Visual clarity',
          preset: 'Recommended preset',
          notes: 'Coaching notes'
        },
        fallbackDescription: (game: string) => `Archetype-specific optimizations for ${game}`
      },
      nativeReasons: {
        description: (game: string) => `Optimized end to end for ${game} battle royale with stream-safe overlays and dedicated support.`
      },
      product: {
        description: 'Cloud Warzone instance bundling battle royale overlays, TTK analytics, and stream-safe coaching tools.',
        longDescription:
          'PulseForge for Warzone is a fully native battle royale build hosted inside our cloud stack. It brings contextual overlays, adaptive coaching, and BR/Resurgence-ready audio/video presets. Every patch is integrated server-side with CPU↔GPU optimization and a low-latency pipeline to preserve fair play and stability.',
        variants: {
          'pulseforge-warzone': {
            name: 'PulseForge Warzone Operator',
            usage: 'Calibrated cloud Warzone instance',
            description: 'Cloud-hosted Warzone build with battle royale overlays and Resurgence coaching.',
            use_cases: [
              'Ranked and Resurgence competition',
              'Squad coaching and TTK analytics',
              'Battle royale streaming production',
              'Private scrims with PulseForge Lobby',
              'VOD review and loadout sandbox'
            ],
            features: [
              'Stream-safe BR modular overlays',
              'TTK/plate tracking and squad economy',
              'Rotation coach and zone forecasts',
              'Post-match analytics with VOD exports',
              'Battle royale audio profiles',
              'PulseForge Lobby sandbox compatibility',
              'Updates synced with Warzone patches'
            ],
            featureHighlights: [
              'Ranked / all servers – 100% fair-play (screen reading, killfeed, audio, no memory injection)',
              'PulseForge private lobbies – synchronized builds with everyone on PulseForge (cosmetics & advanced training)'
            ],
            featureGroups: [
              {
                title: 'Ranked / fair-play (live)',
                items: [
                  'Zone & Rotation Coach: zone collapse forecasts, low-risk routes, and 3rd-party windows to avoid.',
                  'Squad Economy: purchase thresholds (UAV, loadout, redeploy) with priority buy station reminders.',
                  'TTK/Plate Estimator: estimates TTK based on your loadout, distance, and visible armor plates.',
                  'Audio Spatial Director: BR audio profiles with automatic ducking and prioritization of footsteps, armor, doors, and vehicles.',
                  'Killfeed Intelligence: squad knock/finish synthesis, numeric advantage detection, and respawn timers.',
                  'Vehicle & Route Helper: fuel management, estimated noise, covered paths, and critical choke alerts.',
                  'Recoil Learning Overlay: theoretical recoil patterns for training and VOD review—no input adjustment.',
                  'Stream Suite: automated lower-thirds, 8-second instant replays, expanded killfeed for internal casting.'
                ]
              },
              {
                title: 'PulseForge private lobbies',
                description: 'Game and training options for PulseForge Lobby',
                items: [
                  'Shared cosmetics: PulseForge camo and FX visible to every squad on the PF build.',
                  'TTK & Plates sandbox: armor/HP modifiers, fixed distances, and comparative TTK scoreboard.',
                  'Contract Planner: scripted contract rotations (bounty, scav, most wanted) for team drills.',
                  'Ghost-Run & Pathing: ghost rotations of your best runs, synchronized insertion time-trials.',
                  'Draft & Role Lock: locks roles (entry/anchor/support) and enforces weapon cycles.',
                  'Stratboard Live: tactical whiteboard overlay with coach/IGL sharing and play export.',
                  'Caster Mode: expanded HUD, instant replays, and round markers ready for streaming.'
                ]
              },
              {
                title: 'Role / weapon profiles',
                description: 'Dedicated optimizations per archetype',
                items: [
                  'AR (Assault): TTK & recoil lane focus, “don’t ego-peek” prompts, safe opening angles.',
                  'SMG (Close): engage windows, short escape paths, and armor reminders.',
                  'LMG (Anchor): reload discipline, cover swaps, and long-lane control.',
                  'Sniper/DMR: head-height pre-aim, reposition pacing, and glint management.',
                  'Shotgun: indoor push consolidation and duo timing cues.',
                  'Support (IGL): macro calls, squad economy tracking, and contextual 3rd-party alerts.'
                ]
              },
              {
                title: 'Map & mode modules',
                items: [
                  'Circle Forecast: collapse timeline, split routes, and high-risk zones.',
                  'Stronghold Planner: synchronized entries, reinforcement timing, and safe angles.',
                  'Resurgence Deck: respawn timers, retake paths, and aggression windows.',
                  'Vehicle Grid: noise heatmap, choke points, and safe air/ground transitions.'
                ]
              },
              {
                title: 'Analytics & coaching',
                items: [
                  'Match Story Auto-report: pivots, fight wins, and comparison to your target MMR.',
                  'Session Planner: session goals, micro-challenges, and adherence score.',
                  'Loadout Scorecard: damage/TTK tracking per weapon with adjustment suggestions.',
                  'VOD Auto-tag: flags 3rd-party hits, failed retakes, and overly long splits (clickable timeline).'
                ]
              },
              {
                title: 'Accessibility & comfort',
                items: [
                  'Color-blind Pro: compliant team palettes with reinforced projectile outlines.',
                  'Sound-to-HUD: critical audio cues converted into optional visual hints.',
                  'Focus Mode: blocks toxic whispers, breathing timer, and guided micro-breaks.'
                ]
              }
            ],
            implementationNotes: [
              'Public ranked relies solely on what is visible/audible (cloud-side vision/ASR) plus killfeed/scoreboard. No memory reading or injection.',
              'Cosmetics, TTK sandbox, and live stratboards remain limited to PulseForge private lobbies where every player uses the same build.',
              'All overlays are opt-in, discreet, and adaptive (auto-hide mid-fight when the visual load spikes).'
            ],
            target_audience: 'Competitive squads, BR coaches, creators',
            highlight: 'Low-latency pipeline tuned for Warzone',
            protection: 'Certified stream-safe fair-play',
            updates: 'Post-patch synchronized updates'
          }
        }
      },
      technical: {
        fpsByResolution: [
          { playability: 'Very smooth', bottleneck: 'CPU (96%)' },
          { playability: 'Very smooth', bottleneck: 'CPU (95%)' },
          { playability: 'Very smooth', bottleneck: 'CPU (93%)' }
        ],
        resolutionGuidance: [
          {
            refreshAdvice: 'Competitive 144–240 Hz target',
            description: 'The 1080p Medium profile holds around 217 FPS, with Ultra near 179 FPS—ideal for BR, Resurgence, and ranked.',
            note: 'Switch to the Esports preset when you need a locked 240 Hz experience.'
          },
          {
            refreshAdvice: 'Sharpness / refresh balance',
            description: 'Moving to 1440p keeps fluidity high. Ultra stays usable around 159 FPS for cinematic output without losing competitiveness.',
            note: 'Perfect for high-definition streaming or recorded scrims.'
          },
          {
            refreshAdvice: 'Playable 4K above 120 Hz',
            description: 'Even at 4K Medium (~163 FPS) the experience stays very smooth. Ultra lands near 135 FPS for showcase or premium streaming.',
            note: 'Use it to highlight content or full-resolution broadcasts.'
          }
        ],
        improvementTips: [
          'Lower shadows/effects/AA if you need a constant 240 Hz.',
          'Reduce in-game render resolution while keeping the stream at 1080p/1440p from the cloud.',
          'Keep drivers up to date (we handle the server profile).',
          'For hybrid desktop use: enable XMP and confirm memory frequency.',
          'Watch temperatures—CPU overheating causes most 1% low drops.'
        ],
        advice: 'CPU Boost option: +5% → ~217 FPS | +10% → ~219 FPS | +15% → ~222 FPS | +20% → ~225 FPS (requires a premium thermal node slot).',
        augmentationSuite: {
          modules: [
            'Zone & Rotation Coach: predicts circle closures, safe rotations, and 3rd-party risk.',
            'Squad Economy: tracks buy thresholds for UAV/loadout/redeploy with nearby station reminders.',
            'TTK/Plate Estimator: computes TTK from loadout, distance, and visible armor.',
            'Audio Spatial Director: BR audio profile with auto-ducking of non-critical sounds.',
            'Killfeed Intelligence: aggregates knocks/finishes, numeric advantage, and respawn timers.',
            'Vehicle & Route Helper: fuel, noise footprint, safe routes, and break points.',
            'Recoil Learning Overlay: theoretical recoil map for training and VOD (no input changes).',
            'VOD Auto-tag: automatic tagging of 3rd-party pivots, failed retakes, and long splits.',
            'Stream Suite: automated lower-thirds, 8-second instant replays, widened killfeed for casting.'
          ],
          notes: 'Modules calibrated for Warzone BR and Resurgence, refreshed after every major patch.'
        },
        heroSynergy: [
          {
            preset: 'Balance',
            coachingNotes: 'Safe opening angles and “don’t ego-peek” prompts to secure trades.'
          },
          {
            preset: 'Esports',
            coachingNotes: 'Engage windows, short escape lanes, and armor reminders for entry players.'
          },
          {
            preset: 'Stability',
            coachingNotes: 'Reload discipline, cover swaps, and long-lane control for anchor roles.'
          },
          {
            preset: 'Sniper Focus',
            coachingNotes: 'Head-height pre-aim, reposition pacing, and glint management.'
          },
          {
            preset: 'Indoor',
            coachingNotes: 'Structured indoor pushes and duo timing cues.'
          },
          {
            preset: 'Macro',
            coachingNotes: 'Macro call assistance, squad economy insights, and contextual 3rd-party alerts.'
          }
        ]
      }
    },
    et: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Warzone\'i natiivne optimeerimine',
          description: 'Battle Royale\'i profiilid CPU↔GPU tasakaaluga ja stabiilse vooglatentsusega.'
        },
        {
          icon: Zap,
          title: 'Kohene provisioneerimine',
          description: 'Warzone\'i instantsid valmivad sekunditega, piirkonna automaatne vahetus pingist lähtuvalt.'
        },
        {
          icon: Shield,
          title: 'Võistlussõbralik overlay',
          description: 'BR overlayd, TTK analüütika ja kohanduv coaching säilitades fair-play.'
        },
        {
          icon: Trophy,
          title: 'Scrimi ja sisu tugi',
          description: 'Abi Resurgence\'i presetidele, TTK sandboxile ja premium-voogude tootmisele.'
        }
      ],
      metrics: {
        title: 'Kalibreeritud jõudlus Call of Duty: Warzone\'i jaoks',
        description:
          'Meie PulseForge\'i instantsi (Medium võistlusprofiil) sisemõõtmised: keskmiselt 217 FPS ja 1% madal 155 FPS 1080p juures. Mängupilt püsib väga sujuv kuni 4K tänu Warzone\'i spetsiifilisele CPU↔GPU häälestusele ja madala latentsusega videotorule.',
        statCards: {
          maxFps: 'Maksimaalne täheldatud FPS (1080p Medium)',
          onePercentLow: '1% madal (1080p Medium)',
          inputLag: 'Keskmine sisendviivitus'
        },
        allocationTitle: 'In-game eraldus (Medium profiil)',
        datacenterTitle: 'PulseForge\'i pilvemonitoring',
        usage: {
          cpu: 'Domineeriv pudelkits',
          gpu: 'GPU varu',
          ram: 'Mälu kasutus',
          vram: 'VRAM kasutus'
        },
        thermals: {
          cpu: 'Pilve CPU temperatuur',
          gpu: 'GPU temperatuur',
          power: 'Võimsustarve'
        },
        stabilityNote: 'Warzone\'i häälestatud CPU↔GPU toru hoiab varu stabiilsena ka 4K juures.'
      },
      fpsTable: {
        footnote: 'Sisemised Warzone\'i benchmarkid (Medium võistlusprofiil Al Mazrahis, Vondelis ja Fortune’s Keepis).'
      },
      resolution: {
        footnote: 'Väärtused mõõdetud Warzone\'i Medium ja Ultra presetidel overlaydega.',
        windowLabel: 'Täheldatud aken',
        avgLabel: 'Keskmine FPS'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} töötab täielikult meie pilves: kohene provisioneerimine, dünaamiline võrguoptimeerimine ja keskmine latentsus hoitud ${latency} ms juures.`,
        bullets: [
          'Overlayd, profiilid ja uuendused rakenduvad serveripoolselt — kohalikku installi pole vaja.',
          'Vaheta 1080p/1440p/4K PulseForge\'i paneelist, säilitades mõõdetud FPS varu.',
          'Elav ping/jitter/kaokontroll automaatse piirkonnavahetusega, kui ilmneb ebastabiilsus.'
        ],
        profileSubtitle: 'Keskmine mõõdetud 1080p Medium',
        lowLabel: '1% madal 1080p Medium',
        lowSubtitle: 'Täheldatud madalaken'
      },
      improvement: {
        adviceTitle: '„CPU Boost” valik (hosti pool)'
      },
      augmentation: {
        description: 'Battle Royale\'i overlayd, TTK analüütika ja Resurgence\'i coaching ühes stream-safe paketis.'
      },
      hero: {
        badge: 'ROLLI / RELVA PROFIILID',
        title: 'Pühendatud optimeerimised',
        description: 'Iga moodul toob Warzone\'i arhetüüpidele (AR, SMG, snaiper, tugi jne) kalibreeritud presetid.',
        headers: {
          hero: 'Roll / Relv',
          overlay: 'Overlay fookus',
          clarity: 'Visuaalne selgus',
          preset: 'Soovituslik preset',
          notes: 'Coaching\'u märkmed'
        },
        fallbackDescription: (game: string) => `Arhetüübi põhised optimeerimised mängule ${game}`
      },
      nativeReasons: {
        description: (game: string) => `Täielikult optimeeritud ${game} Battle Royale\'i jaoks stream-safe overlayde ja spetsiaalse toega.`
      },
      product: {
        description: 'Pilvepõhine Warzone\'i instants, mis koondab BR overlayd, TTK analüütika ja stream-safe coaching’u tööriistad.',
        longDescription:
          'PulseForge Warzone\'i jaoks on täielikult natiivne Battle Royale\'i build meie pilveplatvormil. See koondab kontekstuaalsed overlayd, kohanduva coaching’u ning BR/Resurgence valmid audio-/videopresetid. Iga patch integreeritakse serveripoolselt CPU↔GPU optimeerimise ja madala latentsusega toruga, hoides fair-play ja stabiilsuse.',
        variants: {
          'pulseforge-warzone': {
            name: 'PulseForge Warzone Operator',
            usage: 'Kalibreeritud pilvepõhine Warzone\'i instants',
            description: 'Pilvehostitud Warzone\'i build BR overlayde ja Resurgence\'i coaching’uga.',
            use_cases: [
              'Ranked ja Resurgence võistlusmäng',
              'Meeskonna coaching ja TTK analüütika',
              'Battle Royale\'i striimimise produktsioon',
              'Privaat scrimid PulseForge Lobbyga',
              'VOD analüüs ja loadout-sandbox'
            ],
            features: [
              'Stream-safe BR modulaarsed overlayd',
              'TTK/plaadijälgimine ja escouadi majandus',
              'Rotatsioonicoach ja tsooni prognoosid',
              'Matšijärgne analüütika ja VOD eksport',
              'Battle Royale\'ile kalibreeritud audioprofiilid',
              'PulseForge Lobby sandboxi ühilduvus',
              'Uuendused sünkroonis Warzone\'i patchidega'
            ],
            featureHighlights: [
              'Reastatud / kõik serverid – 100% fair-play (ekraani lugemine, killfeed, audio, ilma mälusüstita)',
              'PulseForge\'i privaatlobid – sünkroonitud buildid kõigile PulseForge\'i mängijatele (kosmeetika ja edasijõudnud treening)'
            ],
            featureGroups: [
              {
                title: 'Reastatud / fair-play (live)',
                items: [
                  'Zone & Rotation Coach: tsooni sulgumise prognoosid, low-risk marsruudid ja 3rd-party akende vältimine.',
                  'Escouadi majandus: ostuläved (UAV, loadout, redeploy) ja lähimate buy station\'ite meeldetuletused.',
                  'TTK/Plate Estimator: TTK hinnang loadouti, distantsi ja nähtavate plaatide järgi.',
                  'Audio Spatial Director: BR audioprofiil automaatse duckingu ja sammude/armorite/uste/sõidukite prioriseerimisega.',
                  'Killfeed Intelligence: knock/finish kokkuvõte, arvuline ülekaal ja respawni taimerid.',
                  'Vehicle & Route Helper: kütusehaldus, mürataseme hinnang, kaetud teekonnad ja kriitilised choke-punktid.',
                  'Recoil Learning Overlay: relvade teoreetiline tagasilöögimuster treeninguks ja VOD-analüüsiks (ilma sisendimuutuseta).',
                  'Stream Suite: automaatsed lower thirdid, 8-sekundilised kohesed kordused, laiendatud killfeed sisekommentaatorile.'
                ]
              },
              {
                title: 'PulseForge\'i privaatlobid',
                description: 'Mängu- ja treeningvalikud PulseForge Lobby jaoks',
                items: [
                  'Jagatud kosmeetika: PulseForge\'i kammud ja efektid nähtavad kõigile PF buildil olevatele escouadidele.',
                  'TTK & Plates sandbox: soomuse/HP modifikaatorid, fikseeritud distantsid ja võrdlev TTK scoreboard.',
                  'Contract Planner: skriptitud lepinguringid (bounty, scav, most wanted) meeskonnadrillideks.',
                  'Ghost-Run & Pathing: parimate rotatsioonide kummitused ja sünkroonitud sissepääsu time-trialid.',
                  'Draft & Role Lock: lukustab rollid (entry/anchor/support) ja kehtestab relvatsüklid.',
                  'Stratboard Live: taktikaline tahvel overlay’na coach’i/IGL-i jagamisega ja play’de ekspordiga.',
                  'Caster Mode: laiendatud HUD, kohesed kordused ja roundi markerid striimiks valmis.'
                ]
              },
              {
                title: 'Rolli / relva profiilid',
                description: 'Pühendatud optimeerimised iga arhetüübi jaoks',
                items: [
                  'AR (Assault): TTK ja recoil lane fookus, “don’t ego-peek” meeldetuletused, turvalised avamisnurgad.',
                  'SMG (Close): engage-aknad, lühikesed põgenemisteed ja armori meeldetuletused.',
                  'LMG (Anchor): reload\'i distsipliin, cover\'i vahetus ja pikamaa kontroll.',
                  'Sniper/DMR: pea kõrguse pre-aim, repositsiooni tempo ja glindi haldus.',
                  'Shotgun: indoor-pushide konsolideerimine ja duo-timingud.',
                  'Support (IGL): makrokõned, escouadi majandus ning kontekstuaalsed 3rd-party hoiatused.'
                ]
              },
              {
                title: 'Kaardi & mängurežiimi moodulid',
                items: [
                  'Circle Forecast: sulgumise ajaskaala, split-marsruudid ja riskitsoonid.',
                  'Stronghold Planner: sünkroonsed sisenemised, lisajõudude taimerid ja ohutud nurgad.',
                  'Resurgence Deck: respawni taimerid, retake\'i teed ja agressiooniaknad.',
                  'Vehicle Grid: mürasoojuskaart, choke-punktid ja turvalised õhu/maa üleminekud.'
                ]
              },
              {
                title: 'Analüütika & coaching',
                items: [
                  'Match Story Auto-report: pöördepunktid, fight-võidud ja võrdlus siht-MMR-iga.',
                  'Session Planner: sessiooni eesmärgid, mikro-ülesanded ja järgimise skoor.',
                  'Loadout Scorecard: relvade damage/TTK jälgimine koos kohandamissoovitustega.',
                  'VOD Auto-tag: märgistab 3rd-party rünnakud, ebaõnnestunud retake\'id ja liiga pikad splitid (klõpsatav ajajoon).'
                ]
              },
              {
                title: 'Ligipääsetavus & mugavus',
                items: [
                  'Color-blind Pro: meeskonna paletid nõuetele vastavad ja kiirete projektiilide kontuurid tugevdatud.',
                  'Sound-to-HUD: kriitilised helisignaalid valikulisteks visuaalseteks vihjeteks.',
                  'Focus Mode: blokeerib toksilised whispers\'id, hingamise taimer ja juhitud mikropausid.'
                ]
              }
            ],
            implementationNotes: [
              'Avalikes ranked-mängudes tugineb kõik ainult nähtavale/kuuldavale (pilvepoolne visioon/ASR) + killfeed/scoreboard. Mälulugemist ega süsti pole.',
              'Kosmeetika, TTK sandbox ja aktiivsed stratboardid on reserveeritud PulseForge\'i privaatlobidele, kus kõik kasutavad sama buildi.',
              'Kõik overlayd on opt-in, diskreetsed ja kohanduvad (peituvad võitluse ajal, kui visuaalne koormus tõuseb).'
            ],
            target_audience: 'Võistlussquadi, BR-treenerid, loojad',
            highlight: 'Madala latentsusega Warzone\'i pipeline',
            protection: 'Stream-safe fair-play sertifitseeritud',
            updates: 'Patchijärgsed sünkroonitud uuendused'
          }
        }
      },
      technical: {
        fpsByResolution: [
          { playability: 'Väga sujuv', bottleneck: 'CPU (96%)' },
          { playability: 'Väga sujuv', bottleneck: 'CPU (95%)' },
          { playability: 'Väga sujuv', bottleneck: 'CPU (93%)' }
        ],
        resolutionGuidance: [
          {
            refreshAdvice: '144–240 Hz võistlussiht',
            description: '1080p Medium hoiab ~217 FPS, Ultra ~179 FPS — ideaalne BR-i, Resurgence\'i ja ranked\'i jaoks.',
            note: 'Lülitu Esports-preseti peale, kui vajad lukustatud 240 Hz kogemust.'
          },
          {
            refreshAdvice: 'Teravuse ja värskenduse tasakaal',
            description: '1440p peal püsib sujuvus kõrge. Ultra on jätkuvalt kasutatav ~159 FPS juures filmilise väljundi jaoks.',
            note: 'Sobib HD-striimideks või salvestatud scrimideks.'
          },
          {
            refreshAdvice: 'Mängitav 4K üle 120 Hz',
            description: 'Isegi 4K Medium (~163 FPS) jääb väga sujuvaks. Ultra jõuab ~135 FPS-ni showcase\'i ja premium-voogude jaoks.',
            note: 'Kasuta, et tõsta esile sisu või täisresolutsioonis ülekandeid.'
          }
        ],
        improvementTips: [
          'Langeta varje/efekte/AA-d, kui sihid püsivat 240 Hz.',
          'Vähenda in-game renderresolutsiooni, jättes pilvevoo 1080p/1440p peale.',
          'Hoia draiverid ajakohased (serveriprofiili haldame meie).',
          'Hübriidkasutuse korral aktiveeri XMP ja kinnita mälusagedus.',
          'Jälgi temperatuure — CPU ülekuumenemine põhjustab enamiku 1% madalaid.'
        ],
        advice: '„CPU Boost” valik: +5% → ~217 FPS | +10% → ~219 FPS | +15% → ~222 FPS | +20% → ~225 FPS (vajab premium-terminoodislot’i).',
        augmentationSuite: {
          modules: [
            'Zone & Rotation Coach: ennustab ringi sulgumist, turvalisi rotatsioone ja 3rd-party riske.',
            'Escouadi majandus: jälgib UAV/loadout/redeploy ostulävesid ja lähimaid jaamu.',
            'TTK/Plate Estimator: arvutab TTK loadouti, distantsi ja nähtava soomuse põhjal.',
            'Audio Spatial Director: BR audioprofiil automaatse mitteoluliste helide summutamisega.',
            'Killfeed Intelligence: koondab knockid/finishid, arvulise eelise ja respawni taimerid.',
            'Vehicle & Route Helper: kütus, müratase, turvalised marsruudid ja katkestuspunktid.',
            'Recoil Learning Overlay: relva tagasilöögimuster treeninguks ja VOD\'iks (ilma sisendi muutuseta).',
            'VOD Auto-tag: märgib automaatselt 3rd-party pöördepunktid, ebaõnnestunud retake\'id ja pikad splitid.',
            'Stream Suite: automaatsed lower thirdid, 8-sekundilised kordused, laiendatud killfeed casting\'uks.'
          ],
          notes: 'Moodulid kalibreeritud Warzone\'i BR-i ja Resurgence\'i jaoks, värskendatakse iga suure patchi järel.'
        },
        heroSynergy: [
          {
            preset: 'Balance',
            coachingNotes: 'Turvalised avamisnurgad ja “don’t ego-peek” meeldetuletused trades\'i kindlustamiseks.'
          },
          {
            preset: 'Esports',
            coachingNotes: 'Engage-aknad, lühikesed põgenemisteed ja armori meeldetuletused entry-rollile.'
          },
          {
            preset: 'Stability',
            coachingNotes: 'Reload\'i distsipliin, cover\'i vahetus ja pikamaa kontroll anchor-rollile.'
          },
          {
            preset: 'Sniper Focus',
            coachingNotes: 'Pea kõrguse pre-aim, repositsiooni tempo ja glindi haldus.'
          },
          {
            preset: 'Indoor',
            coachingNotes: 'Indoor-pushide struktuur ja duo-timingute vihjed.'
          },
          {
            preset: 'Macro',
            coachingNotes: 'Makrokõnede abi, escouadi majanduse ülevaade ja kontekstuaalsed 3rd-party hoiatused.'
          }
        ]
      }
    }
  }
}

interface NativeGamingProductPageProps {
  product: GamingProduct
}

export default function NativeGamingProductPage({ product }: NativeGamingProductPageProps) {
  const pathname = usePathname()
  const locale = pathname.split('/')[1]
  const supportedLocales = ['fr', 'en', 'et'] as const
  const localeKey: LocaleKey = supportedLocales.includes(locale as LocaleKey) ? (locale as LocaleKey) : 'fr'
  const baseCopy = copyByLocale[localeKey]
  const copyOverrides = localeOverridesByProduct[product.id]?.[localeKey]
  const copy = useMemo(() => mergeDeep(baseCopy, copyOverrides), [baseCopy, copyOverrides])

  const subscriptionPlans = getSubscriptionPlans()
  const localizedSubscriptionPlans = useMemo(
    () =>
      subscriptionPlans.map((plan) => {
        const override = copy.subscriptionPlans?.[plan.id]
        if (!override) {
          return plan
        }
        return {
          ...plan,
          ...override,
          features: override.features ?? plan.features
        }
      }),
    [subscriptionPlans, copy]
  )

  const localizedVariants = useMemo(
    () =>
      product.variants.map((variant) => {
        const override = copy.product.variants?.[variant.id]
        if (!override) {
          return variant
        }
        return {
          ...variant,
          ...override,
          features: override.features ?? variant.features,
          badges: override.badges ?? variant.badges
        }
      }),
    [product.variants, copy]
  )

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(localizedVariants[0] ?? product.variants[0])

  useEffect(() => {
    if (localizedVariants[0]) {
      setSelectedVariant(localizedVariants[0])
    }
  }, [localizedVariants])

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    setSelectedImageIndex(0)
  }, [selectedVariant?.id])

  const fallbackImage = selectedVariant?.image
  const gallery = product.gallery && product.gallery.length > 0
    ? product.gallery
    : fallbackImage
      ? [fallbackImage]
      : []
  const activeImage = gallery[selectedImageIndex] ?? fallbackImage ?? ''

  const tech = useMemo(() => {
    if (!product.technicalSpecs) {
      return product.technicalSpecs
    }

    const base = product.technicalSpecs
    const overrides = copy.technical
    const next = { ...base }

    if (base.fpsByResolution && overrides.fpsByResolution) {
      next.fpsByResolution = base.fpsByResolution.map((entry, idx) => {
        const override = overrides.fpsByResolution?.[idx]
        return override ? { ...entry, ...override } : entry
      })
    }

    if (base.resolutionGuidance && overrides.resolutionGuidance) {
      next.resolutionGuidance = base.resolutionGuidance.map((entry, idx) => {
        const override = overrides.resolutionGuidance?.[idx]
        return override ? { ...entry, ...override } : entry
      })
    }

    if (overrides.improvementTips) {
      next.improvementTips = overrides.improvementTips
    }

    if (overrides.advice) {
      next.advice = overrides.advice
    }

    if (base.augmentationSuite) {
      next.augmentationSuite = {
        ...base.augmentationSuite,
        ...overrides.augmentationSuite,
        modules: overrides.augmentationSuite?.modules ?? base.augmentationSuite.modules,
        notes: overrides.augmentationSuite?.notes ?? base.augmentationSuite.notes
      }
    }

    if (base.heroSynergy && overrides.heroSynergy) {
      next.heroSynergy = base.heroSynergy.map((entry, idx) => {
        const override = overrides.heroSynergy?.[idx]
        return override ? { ...entry, ...override } : entry
      })
    }

    return next
  }, [product.technicalSpecs, copy])

  const productDescription = copy.product.description ?? product.description
  const nativeAdvantages = copy.nativeAdvantages
  const performanceLatency = tech?.performanceMetrics?.latency ?? 0
  const featureHighlights = selectedVariant?.featureHighlights ?? []
  const featureGroups = selectedVariant?.featureGroups ?? []
  const [activeFeatureGroupIndex, setActiveFeatureGroupIndex] = useState(0)
  useEffect(() => {
    setActiveFeatureGroupIndex(0)
  }, [selectedVariant?.id])
  useEffect(() => {
    if (activeFeatureGroupIndex >= featureGroups.length && featureGroups.length > 0) {
      setActiveFeatureGroupIndex(0)
    }
  }, [activeFeatureGroupIndex, featureGroups.length])
  const activeFeatureGroup = featureGroups[activeFeatureGroupIndex] ?? null
  const implementationNotes = selectedVariant?.implementationNotes ?? []

  const ProgressBar = ({ label, value, max, color = "purple", unit = "" }: { label: string, value: number, max: number, color?: string, unit?: string }) => {
    const progressRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(progressRef, { once: true, amount: 0.6 })
    const percentage = Math.max(0, Math.min((value / max) * 100, 100))
    const fillClass = progressPalette[color as keyof typeof progressPalette] ?? progressPalette.purple

    return (
      <div ref={progressRef} className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">{label}</span>
          <span className="text-white font-semibold">{value}{unit}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${fillClass}`}
            initial={{ width: '0%' }}
            animate={{ width: isInView ? `${percentage}%` : '0%' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    )
  }

  const StatCard = ({ icon: Icon, label, value, color = "purple", delay = 0 }: { icon: any, label: string, value: string | number, color?: string, delay?: number }) => {
    const palette = statPalette[color as keyof typeof statPalette] ?? statPalette.purple

    return (
      <motion.div
        className="p-6 glass-effect rounded-xl border border-white/10"
        {...inViewScaleProps}
        transition={{ ...fadeTransition, delay }}
        {...hoverLiftProps}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${palette.iconBg}`}>
            <Icon className={`w-5 h-5 ${palette.text}`} />
          </div>
          <span className="text-gray-400 text-sm">{label}</span>
        </div>
        <div className={`text-3xl font-bold ${palette.text}`}>
          {value}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-28 pb-24">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          <Link href={`/${locale}`} className="text-gray-400 hover:text-white transition">
            {copy.breadcrumbs.home}
          </Link>
          <span className="text-gray-500">/</span>
          <Link href={`/${locale}/games`} className="text-gray-400 hover:text-white transition">
            {copy.breadcrumbs.games}
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-white">{product.name}</span>
        </nav>
      </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            className="space-y-4"
            {...inViewTiltProps}
            transition={{ ...fadeTransition, delay: 0.05 }}
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden glass-effect transition-transform duration-300"
              {...hoverGlowProps}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-auto max-h-[600px] object-contain"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </AnimatePresence>
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {selectedVariant.badges.map((badge, idx) => (
                  <motion.span
                    key={`${badge}-${idx}`}
                    className="px-3 py-1 bg-purple-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                  >
                    {badge}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((image, idx) => (
                  <motion.button
                    key={`${image}-${idx}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-purple-500 scale-105'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    whileHover={{ scale: selectedImageIndex === idx ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="space-y-6"
            {...inViewSlideProps}
            transition={{ ...fadeTransition, delay: 0.1 }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full border border-purple-500/30">
                  {copy.optimizationBadge}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400 text-sm">{product.game}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">{product.name}</h1>
              <p className="text-xl text-gray-300">{productDescription}</p>
            </div>

            <motion.div
              className="flex items-center gap-4"
              {...inViewFadeProps}
              transition={{ ...fadeTransition, delay: 0.15 }}
            >
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.reviews.average)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white font-medium">{product.reviews.average}</span>
              <span className="text-gray-400">({product.reviews.count} {copy.reviewsLabel})</span>
            </motion.div>

            {/* Quick Stats */}
            {tech?.performanceMetrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-white/10">
                {[
                  { value: `${tech.performanceMetrics.avgFps}`, label: copy.quickStats.avgFps, color: 'text-green-400' },
                  {
                    value: `${tech.performanceMetrics.onePercentLow ?? tech.performanceMetrics.minFps}`,
                    label: copy.quickStats.onePercentLow,
                    color: 'text-orange-400'
                  },
                  { value: `${tech.performanceMetrics.latency}ms`, label: copy.quickStats.latency, color: 'text-blue-400' },
                  { value: `${tech.performanceMetrics.inputLag}ms`, label: copy.quickStats.inputLag, color: 'text-purple-400' }
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    className="p-3 glass-effect rounded-lg text-center"
                    initial={{ opacity: 0, y: 16, scale: 0.95, rotate: idx % 2 === 0 ? -1.5 : 1.5 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{ duration: 0.45, ease: 'easeOut', delay: 0.2 + idx * 0.05 }}
                    whileHover={{ y: -6, scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Subscription CTA */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="font-semibold text-xl">{copy.subscription.title}</h3>
              <div className="grid grid-cols-1 gap-4">
                {localizedSubscriptionPlans.map((plan, idx) => (
                  <Link key={plan.id} href={`/${locale}/premium/signup`} className="group block">
                    <motion.div
                      className="relative p-5 rounded-xl border border-white/10 glass-effect transition-all group-hover:border-purple-500/50"
                      {...inViewSlideProps}
                      transition={{ ...fadeTransition, delay: 0.25 + idx * 0.05 }}
                      {...hoverLiftProps}
                    >
                      {plan.popular && (
                        <span className="absolute -top-3 left-4 px-3 py-1 bg-purple-500 text-xs text-white font-semibold rounded-full">
                          {copy.subscription.popular}
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg mb-1">{plan.name}</h4>
                          <p className="text-sm text-gray-400">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-400">{plan.price.toFixed(2)}€</div>
                          <div className="text-xs text-gray-500">{plan.billing}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center text-sm text-purple-400 group-hover:text-purple-300">
                        <span>{copy.subscription.viewDetails}</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics Section */}
        {tech?.performanceMetrics && (
          <motion.section className="mt-20" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
            <motion.div className="text-center mb-12" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full mb-4">
                <Activity className="w-5 h-5" />
                <span className="font-semibold">{copy.metrics.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.metrics.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.metrics.description}</p>
            </motion.div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={Gauge} label={copy.metrics.statCards.maxFps} value={tech.performanceMetrics.maxFps} color="green" delay={0.1} />
                <StatCard
                  icon={Activity}
                  label={copy.metrics.statCards.onePercentLow}
                  value={tech.performanceMetrics.onePercentLow ?? tech.performanceMetrics.minFps}
                  color="orange"
                  delay={0.2}
                />
                <StatCard icon={Zap} label={copy.metrics.statCards.inputLag} value={`${tech.performanceMetrics.inputLag}ms`} color="blue" delay={0.3} />
              </div>

              <motion.div className="glass-effect rounded-2xl p-8 border border-white/10" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.2 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-purple-400" />
                      {copy.metrics.allocationTitle}
                    </h3>
                    <ProgressBar label={copy.metrics.usage.cpu} value={tech.performanceMetrics.cpuUsage} max={100} unit="%" color="purple" />
                    <ProgressBar label={copy.metrics.usage.gpu} value={tech.performanceMetrics.gpuUsage} max={100} unit="%" color="green" />
                    <ProgressBar label={copy.metrics.usage.ram} value={tech.performanceMetrics.ramUsage} max={128} unit=" GB" color="blue" />
                    <ProgressBar label={copy.metrics.usage.vram} value={tech.performanceMetrics.vramUsage} max={24} unit=" GB" color="cyan" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-orange-400" />
                      {copy.metrics.datacenterTitle}
                    </h3>
                    <ProgressBar label={copy.metrics.thermals.cpu} value={tech.performanceMetrics.thermalCpu} max={100} unit="°C" color="orange" />
                    <ProgressBar label={copy.metrics.thermals.gpu} value={tech.performanceMetrics.thermalGpu} max={100} unit="°C" color="orange" />
                    <ProgressBar label={copy.metrics.thermals.power} value={tech.performanceMetrics.powerDraw} max={600} unit="W" color="red" />
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <Check className="w-4 h-4" />
                        <span>{copy.metrics.stabilityNote}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {tech?.fpsByResolution && tech.fpsByResolution.length > 0 && (
          <motion.section className="mt-16" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
            <motion.div className="text-center mb-8" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
              <h3 className="text-2xl font-bold mb-2">{copy.fpsTable.title}</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.fpsTable.description}</p>
            </motion.div>
            <motion.div className="glass-effect rounded-2xl p-6 border border-white/10 overflow-x-auto" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.2 }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="py-3 px-4 text-left">{copy.fpsTable.headers.resolution}</th>
                    <th className="py-3 px-4 text-center">{copy.fpsTable.headers.avg}</th>
                    <th className="py-3 px-4 text-center">{copy.fpsTable.headers.min}</th>
                    <th className="py-3 px-4 text-center">{copy.fpsTable.headers.max}</th>
                    <th className="py-3 px-4 text-center">{copy.fpsTable.headers.playability}</th>
                    <th className="py-3 px-4 text-center">{copy.fpsTable.headers.bottleneck}</th>
                  </tr>
                </thead>
                <tbody>
                  {tech.fpsByResolution.map((entry, idx) => (
                    <motion.tr
                      key={idx}
                      className="border-b border-white/10 last:border-none"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, ease: 'easeOut', delay: idx * 0.05 }}
                    >
                      <td className="py-3 px-4 font-semibold text-white">{entry.resolution}</td>
                      <td className="py-3 px-4 text-center text-green-400 font-semibold">{entry.avgFps}</td>
                      <td className="py-3 px-4 text-center text-orange-400">{entry.minFps}</td>
                      <td className="py-3 px-4 text-center text-blue-400">{entry.maxFps}</td>
                      <td className="py-3 px-4 text-center text-gray-300">{entry.playability}</td>
                      <td className="py-3 px-4 text-center text-gray-400">{entry.bottleneck}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-500 mt-4">{copy.fpsTable.footnote}</p>
            </motion.div>
          </motion.section>
        )}

        {tech?.qualityBreakdown && tech.qualityBreakdown.length > 0 && (
          <motion.section className="mt-16" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
            <motion.div className="text-center mb-8" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
              <h3 className="text-2xl font-bold mb-2">{copy.quality.title}</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.quality.description}</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tech.qualityBreakdown.map((quality, idx) => (
                <motion.div
                  key={idx}
                  className="glass-effect rounded-2xl border border-white/10 p-6"
                  {...inViewFadeProps}
                  transition={{ ...fadeTransition, delay: 0.2 + idx * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">{quality.resolution}</h4>
                    <span className="text-xs text-purple-400 uppercase">{copy.quality.badge}</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    {Object.entries(quality.presets).map(([preset, value]) => (
                      <div key={preset} className="flex items-center justify-between">
                        <span className="text-gray-400 capitalize">{preset}</span>
                        <span className="text-white font-semibold">{value} FPS</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {tech?.resolutionGuidance && tech.resolutionGuidance.length > 0 && (
          <motion.section className="mt-16" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
            <motion.div className="text-center mb-8" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
              <h3 className="text-2xl font-bold mb-2">{copy.resolution.title}</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.resolution.description}</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tech.resolutionGuidance.map((entry, idx) => (
                <motion.div
                  key={idx}
                  className="glass-effect rounded-2xl p-6 border border-white/10 flex flex-col h-full"
                  {...inViewFadeProps}
                  transition={{ ...fadeTransition, delay: 0.2 + idx * 0.05 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-semibold text-white">{entry.resolution}</h4>
                      <p className="text-sm text-gray-400 mt-1">{entry.refreshAdvice}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-400">{entry.avgFps}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{copy.resolution.avgLabel}</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 flex items-center justify-between">
                    <span>{copy.resolution.windowLabel}</span>
                    <span className="text-white font-semibold">{entry.fpsWindow}</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-300 leading-relaxed">{entry.description}</p>
                  {entry.note && (
                    <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-xs text-purple-200">
                      {entry.note}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-6 text-center">{copy.resolution.footnote}</p>
          </motion.section>
        )}

        {tech?.performanceMetrics && (
          <motion.section className="mt-16" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
            <motion.div className="glass-effect rounded-3xl border border-purple-500/30 bg-purple-500/5 p-8" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-2xl font-bold text-white">{copy.experience.title}</h3>
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                    {copy.experience.description(product.name, performanceLatency)}
                  </p>
                  <div className="space-y-4">
                    {copy.experience.bullets.map((bullet, index) => {
                      const icons = [Shield, Gauge, Wifi] as const
                      const colorClasses = ['text-purple-400', 'text-green-400', 'text-cyan-400'] as const
                      const Icon = icons[index] ?? Shield
                      const colorClass = colorClasses[index] ?? 'text-purple-400'
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 ${colorClass} mt-0.5`} />
                          <span className="text-gray-300 text-sm">{bullet}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="glass-effect rounded-2xl border border-white/10 p-6 text-center space-y-4">
                  <div>
                    <div className="text-xs uppercase text-gray-400 tracking-wider">{copy.experience.profileLabel}</div>
                    <div className="text-4xl font-bold text-green-400 mt-2">{tech.performanceMetrics.avgFps} FPS</div>
                    <div className="text-xs text-gray-500 mt-1">{copy.experience.profileSubtitle}</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-xs text-gray-400 uppercase tracking-wider">{copy.experience.lowLabel}</div>
                    <div className="text-3xl font-bold text-orange-400 mt-1">{tech.performanceMetrics.onePercentLow ?? tech.performanceMetrics.minFps} FPS</div>
                    <div className="text-xs text-gray-500 mt-1">{copy.experience.lowSubtitle}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}

        

        {(tech?.improvementTips || tech?.advice) && (
          <motion.section className="mt-16" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tech?.improvementTips && (
                <motion.div className="glass-effect rounded-2xl border border-white/10 p-6" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    {copy.improvement.tipsTitle}
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-300">
                    {tech.improvementTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-purple-400 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              {tech?.advice && (
                <motion.div className="glass-effect rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 flex flex-col justify-center" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.2 }}>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    {copy.improvement.adviceTitle}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed">{tech.advice}</p>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {/* Assistance Suite */}
        {tech?.augmentationSuite && (
          <motion.section className="mt-20" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
            <motion.div className="text-center mb-12" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full mb-4">
                <Target className="w-5 h-5" />
                <span className="font-semibold">{copy.augmentation.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.augmentation.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.augmentation.description}</p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Target} label={copy.augmentation.awarenessLabel} value={`${tech.augmentationSuite.awarenessIndex}/100`} color="red" delay={0.1} />
                <StatCard icon={Activity} label={copy.augmentation.overlayLabel} value={`${tech.augmentationSuite.overlayRefresh} Hz`} color="orange" delay={0.2} />
                <StatCard icon={TrendingUp} label={copy.augmentation.coachingLabel} value={`${tech.augmentationSuite.adaptiveCoaching}%`} color="purple" delay={0.3} />
                <StatCard icon={Gauge} label={copy.augmentation.focusLabel} value={`${tech.augmentationSuite.tacticalFocus}%`} color="blue" delay={0.4} />
              </div>

              <motion.div className="glass-effect rounded-2xl p-8 border border-white/10" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.2 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4">{copy.augmentation.modulesTitle}</h3>
                    <div className="space-y-3">
                      {tech.augmentationSuite.modules.map((module, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30"
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.4, ease: 'easeOut', delay: idx * 0.05 }}
                        >
                          <Check className="w-5 h-5 text-red-400 mt-0.5" />
                          <span className="text-gray-200">{module}</span>
                        </motion.div>
                      ))}
                    </div>
                    {tech.augmentationSuite.notes && (
                      <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <div className="flex items-start gap-2 text-purple-300 text-sm">
                          <Shield className="w-4 h-4 mt-0.5" />
                          <span>{tech.augmentationSuite.notes}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-4">{copy.augmentation.reactivityTitle}</h3>
                    <div className="space-y-4">
                      <ProgressBar label={copy.augmentation.overlayLabel} value={tech.augmentationSuite.overlayRefresh} max={240} unit=" Hz" color="red" />
                      <ProgressBar label={copy.augmentation.modulesLabel} value={tech.augmentationSuite.moduleCoverage} max={24} unit=" modules" color="purple" />
                      <ProgressBar label={copy.augmentation.coachingLabel} value={tech.augmentationSuite.adaptiveCoaching} max={100} unit="%" color="orange" />
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <span className="text-gray-400">{copy.augmentation.reactionLabel}</span>
                        <span className="text-red-400 font-bold">{tech.augmentationSuite.reactionTimeMs} ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Legacy precision suite */}
        {!tech?.augmentationSuite && tech?.aimbotStats && copy.legacyPrecision && (
          <motion.section className="mt-20" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
            <motion.div className="text-center mb-12" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full mb-4">
                <Target className="w-5 h-5" />
                <span className="font-semibold">{copy.legacyPrecision.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.legacyPrecision.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.legacyPrecision.description}</p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Target} label={copy.legacyPrecision.stats.tracking} value={`${tech.aimbotStats.predictionAccuracy}%`} color="red" delay={0.1} />
                <StatCard icon={Activity} label={copy.legacyPrecision.stats.smoothness} value={`${tech.aimbotStats.smoothness}%`} color="orange" delay={0.2} />
                <StatCard icon={Zap} label={copy.legacyPrecision.stats.fov} value={`${tech.aimbotStats.fov}°`} color="purple" delay={0.3} />
                <StatCard icon={Gauge} label={copy.legacyPrecision.stats.switchTime} value={`${tech.aimbotStats.targetSwitchTime}s`} color="blue" delay={0.4} />
              </div>

              <motion.div className="glass-effect rounded-2xl p-8 border border-white/10" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.2 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4">{copy.legacyPrecision.advancedTitle}</h3>
                    <div className="space-y-4">
                      <ProgressBar label={copy.legacyPrecision.metrics.priority} value={tech.aimbotStats.headShotRate} max={100} unit="%" color="red" />
                      <ProgressBar label={copy.legacyPrecision.metrics.weapon} value={tech.aimbotStats.weaponSupport} max={100} unit="%" color="green" />
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">{copy.legacyPrecision.metrics.reaction}</span>
                        <span className="text-blue-400 font-bold">{tech.aimbotStats.reactionTime}ms</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-4">{copy.legacyPrecision.focusTitle}</h3>
                    <div className="space-y-3">
                      {tech.aimbotStats.boneSelection.map((bone, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.4, ease: 'easeOut', delay: idx * 0.05 }}
                        >
                          <Check className="w-5 h-5 text-purple-400" />
                          <span className="text-white capitalize">{bone}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-start gap-2 text-green-400 text-sm">
                        <Shield className="w-4 h-4 mt-0.5" />
                        <span>{copy.augmentation.motionNote}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Hero Synergy */}
        {tech?.heroSynergy && tech.heroSynergy.length > 0 && (
          <motion.section className="mt-20" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
            <motion.div className="text-center mb-12" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full mb-4">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">{copy.hero.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.hero.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.hero.description}</p>
            </motion.div>

            <motion.div className="max-w-6xl mx-auto glass-effect rounded-2xl p-8 border border-white/10" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.2 }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">{copy.hero.headers.hero}</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-semibold">{copy.hero.headers.overlay}</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-semibold">{copy.hero.headers.clarity}</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-semibold">{copy.hero.headers.preset}</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-semibold">{copy.hero.headers.notes}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tech.heroSynergy.map((hero, idx) => (
                      <motion.tr
                        key={idx}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.4, ease: 'easeOut', delay: idx * 0.05 }}
                      >
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">{hero.hero}</div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-green-400 font-bold">{hero.overlayFocus}%</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-blue-400 font-bold">{hero.clarityBoost}%</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-purple-400 font-semibold">{hero.preset}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-orange-300 text-sm leading-relaxed">{hero.coachingNotes}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.section>
        )}

        {!tech?.heroSynergy && tech?.compatibilityMatrix && tech.compatibilityMatrix.length > 0 && (
          <motion.section className="mt-20" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
            <motion.div className="text-center mb-12" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full mb-4">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">{copy.hero.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.hero.fallbackTitle}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.hero.fallbackDescription(product.game)}</p>
            </motion.div>

            <motion.div className="max-w-6xl mx-auto glass-effect rounded-2xl p-8 border border-white/10" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.2 }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">{copy.hero.headers.hero}</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-semibold">{copy.hero.fallbackHeaders.optimization}</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-semibold">{copy.hero.fallbackHeaders.critRate}</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-semibold">{copy.hero.fallbackHeaders.efficiency}</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-semibold">{copy.hero.fallbackHeaders.impact}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tech.compatibilityMatrix.map((hero, idx) => (
                      <motion.tr
                        key={idx}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.4, ease: 'easeOut', delay: idx * 0.05 }}
                      >
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">{hero.hero}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-green-400 font-bold">{hero.effectiveness}%</span>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-green-500"
                                initial={{ width: '0%' }}
                                whileInView={{ width: `${hero.effectiveness}%` }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-purple-400 font-bold">{hero.headShotRate}%</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-blue-400 font-bold">{hero.kda}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-orange-400 font-bold">{hero.winRate}%</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.section>
        )}


        {/* Reliability Metrics */}
        {tech?.securityMetrics && (
          <motion.section className="mt-20" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
            <motion.div className="text-center mb-12" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full mb-4">
                <Lock className="w-5 h-5" />
                <span className="font-semibold">{copy.reliability.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.reliability.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.reliability.description}</p>
            </motion.div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div className="glass-effect rounded-xl p-6 border border-green-500/30 bg-green-500/5" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.2 }}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">{tech.securityMetrics.detectionRate}%</div>
                    <div className="text-sm text-gray-400">{copy.reliability.cards.detection}</div>
                    <div className="mt-3 text-xs text-green-400">{copy.reliability.cards.detectionFootnote}</div>
                  </div>
                </motion.div>
                <motion.div className="glass-effect rounded-xl p-6 border border-blue-500/30 bg-blue-500/5" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.25 }}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">{tech.securityMetrics.uptimePercentage}%</div>
                    <div className="text-sm text-gray-400">{copy.reliability.cards.uptime}</div>
                    <div className="mt-3 text-xs text-blue-400">{copy.reliability.cards.uptimeFootnote}</div>
                  </div>
                </motion.div>
                <motion.div className="glass-effect rounded-xl p-6 border border-purple-500/30 bg-purple-500/5" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.3 }}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400 mb-2">{tech.securityMetrics.avgResponseTime}min</div>
                    <div className="text-sm text-gray-400">{copy.reliability.cards.response}</div>
                    <div className="mt-3 text-xs text-purple-400">{copy.reliability.cards.responseFootnote}</div>
                  </div>
                </motion.div>
              </div>

              <motion.div className="glass-effect rounded-2xl p-8 border border-white/10" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.25 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      {copy.reliability.maintenanceTitle}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">{copy.reliability.encryption}</span>
                        <span className="text-green-400 font-bold">{tech.securityMetrics.encryptionLevel}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">{copy.reliability.isolation}</span>
                        <span className="text-purple-400 font-bold">{tech.securityMetrics.obfuscationLayers}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">{copy.reliability.updates}</span>
                        <span className="text-blue-400 font-bold">{tech.securityMetrics.securityUpdatesPerWeek}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">{copy.reliability.incidents}</span>
                        <span className="text-green-400 font-bold">{tech.securityMetrics.incidentsLastMonth}</span>
                      </div>
                    </div>
                  </div>
                    <div>
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-purple-400" />
                      {copy.reliability.surveillanceTitle}
                      </h3>
                      <div className="space-y-3">
                        {[
                          { label: copy.reliability.surveillanceToggles.antiDebug, enabled: tech.securityMetrics.antiDebug },
                          { label: copy.reliability.surveillanceToggles.antiVM, enabled: tech.securityMetrics.antiVM },
                          { label: copy.reliability.surveillanceToggles.kernel, enabled: tech.securityMetrics.kernelProtection }
                        ].map((item, idx) => (
                          <motion.div
                            key={idx}
                            className={`flex items-center gap-3 p-3 rounded-lg ${item.enabled ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}
                            initial={{ opacity: 0, x: -12 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.4, ease: 'easeOut', delay: idx * 0.05 }}
                          >
                            <div className={`w-3 h-3 rounded-full ${item.enabled ? 'bg-green-400' : 'bg-red-400'}`} />
                            <span className={item.enabled ? 'text-green-400' : 'text-red-400'}>{item.label}</span>
                            {item.enabled && <Check className="w-4 h-4 text-green-400 ml-auto" />}
                          </motion.div>
                        ))}
                        <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                          <div className="flex items-start gap-2 text-purple-400 text-sm">
                            <Shield className="w-4 h-4 mt-0.5" />
                          <span>{copy.reliability.protectionNote}</span>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Network Stats */}
        {tech?.networkStats && (
          <motion.section className="mt-20" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
            <motion.div className="text-center mb-12" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full mb-4">
                <Wifi className="w-5 h-5" />
                <span className="font-semibold">{copy.network.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.network.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.network.description(tech.networkStats.serverLocations)}</p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Wifi} label={copy.network.cards.servers} value={tech.networkStats.serverLocations} color="blue" delay={0.1} />
                <StatCard icon={Zap} label={copy.network.cards.ping} value={`${tech.networkStats.avgPing}ms`} color="green" delay={0.2} />
                <StatCard icon={Activity} label={copy.network.cards.loss} value={`${tech.networkStats.packetLoss}%`} color="purple" delay={0.3} />
                <StatCard icon={Gauge} label={copy.network.cards.jitter} value={`${tech.networkStats.jitter}ms`} color="cyan" delay={0.4} />
              </div>

              <motion.div className="glass-effect rounded-2xl p-8 border border-white/10" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.25 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wifi className="w-6 h-6 text-blue-400" />
                      <div>
                        <div className="font-semibold">{copy.network.bandwidthLabel}</div>
                        <div className="text-sm text-gray-400">{copy.network.bandwidthSubtitle}</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">{tech.networkStats.maxBandwidth} Mbps</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="w-6 h-6 text-green-400" />
                      <div>
                        <div className="font-semibold">{copy.network.encryptionLabel}</div>
                        <div className="text-sm text-gray-400">{copy.network.encryptionSubtitle}</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-green-400">{tech.networkStats.encryption}</div>
                  </div>
                </div>
                {tech.networkStats.ddosProtection && (
                  <motion.div
                    className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2 text-green-400">
                      <Shield className="w-5 h-5" />
                      <span className="font-semibold">{copy.network.ddos}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* User Stats */}
        {tech?.userStats && (
          <motion.section className="mt-20" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
            <motion.div className="text-center mb-12" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full mb-4">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{copy.user.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.user.title(tech.userStats.totalUsers.toLocaleString(localeKey))}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.user.subtitle}</p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <motion.div
                  className="glass-effect rounded-xl p-6 border border-white/10 text-center"
                  {...inViewScaleProps}
                  transition={{ ...fadeTransition, delay: 0.2 }}
                  {...hoverLiftProps}
                >
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{tech.userStats.totalUsers.toLocaleString(localeKey)}</div>
                  <div className="text-sm text-gray-400">{copy.user.cards.total}</div>
                </motion.div>
                <motion.div
                  className="glass-effect rounded-xl p-6 border border-white/10 text-center"
                  {...inViewScaleProps}
                  transition={{ ...fadeTransition, delay: 0.25 }}
                  {...hoverLiftProps}
                >
                  <Activity className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{tech.userStats.activeUsersLast30Days.toLocaleString(localeKey)}</div>
                  <div className="text-sm text-gray-400">{copy.user.cards.active}</div>
                </motion.div>
                <motion.div
                  className="glass-effect rounded-xl p-6 border border-white/10 text-center"
                  {...inViewScaleProps}
                  transition={{ ...fadeTransition, delay: 0.3 }}
                  {...hoverLiftProps}
                >
                  <Gauge className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{tech.userStats.avgSessionDuration}h</div>
                  <div className="text-sm text-gray-400">{copy.user.cards.session}</div>
                </motion.div>
                <motion.div
                  className="glass-effect rounded-xl p-6 border border-white/10 text-center"
                  {...inViewScaleProps}
                  transition={{ ...fadeTransition, delay: 0.35 }}
                  {...hoverLiftProps}
                >
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{tech.userStats.avgGamesPerDay}</div>
                  <div className="text-sm text-gray-400">{copy.user.cards.games}</div>
                </motion.div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  className="glass-effect rounded-xl p-8 border border-yellow-500/30 bg-yellow-500/5"
                  {...inViewTiltProps}
                  transition={{ ...fadeTransition, delay: 0.4 }}
                  {...hoverGlowProps}
                >
                  <div className="text-center">
                    <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <div className="text-5xl font-bold text-yellow-400 mb-2">{tech.userStats.satisfactionScore}/5</div>
                    <div className="text-gray-400">{copy.user.ratingLabel}</div>
                  </div>
                </motion.div>
                <motion.div
                  className="glass-effect rounded-xl p-8 border border-green-500/30 bg-green-500/5"
                  {...inViewTiltProps}
                  transition={{ ...fadeTransition, delay: 0.45 }}
                  {...hoverGlowProps}
                >
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <div className="text-5xl font-bold text-green-400 mb-2">{tech.userStats.recommendationRate}%</div>
                    <div className="text-gray-400">{copy.user.recommendationLabel}</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Native Advantages Section */}
        <motion.section className="mt-20" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
          <motion.div className="text-center mb-12" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.nativeReasons.title}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{copy.nativeReasons.description(product.game)}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {nativeAdvantages.map((advantage, idx) => {
              const Icon = advantage.icon
              return (
                <motion.div
                  key={idx}
                  className="p-6 glass-effect rounded-xl border border-white/10 hover:border-purple-500/30 transition-all"
                  {...inViewScaleProps}
                  transition={{ ...fadeTransition, delay: 0.2 + idx * 0.05 }}
                  {...hoverGlowProps}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{advantage.title}</h3>
                      <p className="text-gray-400 text-sm">{advantage.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Fonctionnalités */}
        <motion.section className="mt-20" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
          <motion.div className="text-center mb-12" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.featuresTitle}</h2>
          </motion.div>

          <div className="space-y-8 max-w-5xl mx-auto">
            {featureHighlights.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featureHighlights.map((highlight, idx) => (
                  <motion.div
                    key={idx}
                    className="glass-effect rounded-xl border border-purple-500/30 bg-purple-500/10 p-5 flex items-start gap-3"
                    {...inViewScaleProps}
                    transition={{ ...fadeTransition, delay: 0.2 + idx * 0.05 }}
                    {...hoverGlowProps}
                  >
                    <Shield className="w-5 h-5 text-purple-300 mt-0.5" />
                    <span className="text-sm md:text-base text-gray-200">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {featureGroups.length > 0 ? (
              <div className="space-y-6">
                <div className="-mx-4 md:mx-0">
                  <div className="flex gap-3 overflow-x-auto px-4 md:px-0 pb-2">
                    {featureGroups.map((group, idx) => {
                      const isActive = idx === activeFeatureGroupIndex
                      return (
                        <motion.button
                          key={`${group.title}-${idx}`}
                          type="button"
                          className={`relative flex min-w-[220px] flex-col rounded-2xl border px-5 py-4 text-left transition-all md:min-w-[200px] ${
                            isActive
                              ? 'border-purple-400/60 bg-purple-500/15 text-white shadow-lg shadow-purple-500/20'
                              : 'border-white/10 bg-white/5 text-gray-300 hover:border-purple-400/40 hover:text-white'
                          }`}
                          onClick={() => setActiveFeatureGroupIndex(idx)}
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        >
                          <span className="text-sm font-semibold md:text-base">{group.title}</span>
                          {group.description && (
                            <span className="mt-1 text-xs text-gray-300/80 md:text-sm">
                              {group.description}
                            </span>
                          )}
                          <span className="mt-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-purple-200/80">
                            <Check className="h-3.5 w-3.5" />
                            {group.items.length}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeFeatureGroup && (
                    <motion.div
                      key={activeFeatureGroup.title}
                      className="glass-effect rounded-2xl border border-white/10 p-8"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-2xl font-semibold text-white">{activeFeatureGroup.title}</h3>
                          {activeFeatureGroup.description && (
                            <p className="mt-2 text-sm text-gray-400 md:text-base md:leading-relaxed">
                              {activeFeatureGroup.description}
                            </p>
                          )}
                        </div>
                        <motion.span
                          className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-100"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
                        >
                          <Shield className="h-4 w-4" />
                          {activeFeatureGroup.items.length}
                        </motion.span>
                      </div>

                      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {activeFeatureGroup.items.map((item, itemIdx) => (
                          <motion.div
                            key={`${activeFeatureGroup.title}-${itemIdx}`}
                            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-colors hover:border-purple-400/40"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, ease: 'easeOut', delay: Math.min(itemIdx * 0.03, 0.12) }}
                            whileHover={{ y: -2 }}
                          >
                            <Check className="mt-1 h-5 w-5 flex-shrink-0 text-purple-400" />
                            <span className="text-sm leading-relaxed text-gray-200 md:text-base">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div className="glass-effect rounded-2xl p-8 border border-white/10" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.25 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedVariant.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.35, ease: 'easeOut', delay: idx * 0.04 }}
                    >
                      <Check className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {implementationNotes.length > 0 && (
              <motion.div className="glass-effect rounded-2xl p-6 border border-purple-500/40 bg-purple-500/10" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.3 }}>
                <div className="flex items-start gap-3">
                  <Lock className="w-6 h-6 text-purple-300 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{copy.featureNotesTitle}</h3>
                    <ul className="mt-3 space-y-2 text-sm text-gray-200">
                      {implementationNotes.map((note, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-start gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.35, ease: 'easeOut', delay: idx * 0.04 }}
                        >
                          <Check className="w-4 h-4 text-purple-300 mt-0.5 flex-shrink-0" />
                          <span>{note}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section className="mt-20" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
          <motion.div className="text-center py-16 glass-effect rounded-2xl border border-white/10" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
            <h2 className="text-4xl font-bold mb-6">{copy.cta.title(product.game)}</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{copy.cta.description}</p>
            <Link href={`/${locale}/premium/signup`} className="group inline-block">
              <motion.span
                className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 rounded-lg font-semibold transition-colors group-hover:bg-purple-600"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {copy.cta.button}
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
          </motion.div>
        </motion.section>
      </div>
    </main>
    <Footer />
  </div>
  )
}
