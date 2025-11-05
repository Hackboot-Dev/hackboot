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
  },
  'gaming-valorant': {
    fr: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Profil Esports Valorant natif',
          description: 'FPS 240–360 Hz stabilisés avec orchestration CPU↔GPU dédiée et overlays fair-play.'
        },
        {
          icon: Zap,
          title: 'Pipeline ultra-basse latence',
          description: 'Streaming 1080p/1440p/4K avec routage adaptatif et bascule automatique de région.'
        },
        {
          icon: Shield,
          title: 'Suite fair-play certifiée',
          description: 'Overlays HUD/audio/minimap conformes tournois, sans injection ni assistances intrusives.'
        },
        {
          icon: Trophy,
          title: 'Support staff & scrims',
          description: 'Plans PulseForge Lobby, analytics VOD et accompagnement coach/caster.'
        }
      ],
      metrics: {
        title: 'Performances calibrées pour Valorant',
        description:
          'Profil PulseForge Esports (preset compétitif). Valorant étant très CPU-bound, nous maintenons 596 FPS de moyenne en 1080p avec un min observé à 507 FPS et un maximum à 685 FPS. La stabilité reste élevée en 1440p et 4K grâce à la réserve CPU.',
        statCards: {
          maxFps: 'FPS maximum observé (1080p Medium)',
          onePercentLow: 'Min observé (proxy 1% low, 1080p Medium)',
          inputLag: 'Input lag moyen'
        },
        allocationTitle: 'Bottleneck dominant (profil Medium)',
        datacenterTitle: 'Monitoring cloud PulseForge',
        usage: {
          cpu: 'Charge CPU',
          gpu: 'Charge GPU',
          ram: 'Mémoire utilisée',
          vram: 'VRAM utilisée'
        },
        thermals: {
          cpu: 'Température CPU cloud',
          gpu: 'Température GPU',
          power: 'Consommation électrique'
        },
        stabilityNote: 'Valorant reste limité par le CPU : nos profils conservent la marge nécessaire jusqu’en 4K.'
      },
      fpsTable: {
        footnote: 'Benchmarks internes Valorant (profil Medium compétitif, maps ranked et scrims).'
      },
      resolution: {
        title: 'Comment ajuster la résolution côté cloud',
        description:
          'Nos mesures internes traduisent la marge FPS réelle lorsque vous ajustez la définition depuis le panneau PulseForge.',
        windowLabel: 'Fenêtre relevée',
        footnote: 'Valeurs relevées sur preset Medium/Ultra Valorant avec overlays actifs.',
        avgLabel: 'FPS moyen'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} tourne intégralement sur notre infrastructure : provisioning instantané, routage réseau adaptatif et latence stabilisée à ${latency} ms.`,
        bullets: [
          'Overlays, presets et mises à jour appliqués côté serveur — aucune installation locale.',
          'Bascule 1080p/1440p/4K instantanée depuis le panneau PulseForge avec la marge FPS mesurée.',
          'Monitoring ping/jitter/pertes avec failover automatique si la région devient instable.'
        ],
        profileSubtitle: 'Moyenne mesurée en 1080p Medium',
        lowLabel: 'Min observé 1080p Medium',
        lowSubtitle: 'Fenêtre basse relevée'
      },
      improvement: {
        adviceTitle: 'Option « CPU Boost » (côté hôte)'
      },
      augmentation: {
        description: 'Modules phase-aware Valorant : économie, executes, retakes et coaching stream-safe.'
      },
      hero: {
        badge: 'PROFILS AGENT / RÔLE',
        title: 'Optimisations dédiées',
        description: 'Chaque preset couvre un rôle Valorant (Duelist, Controller, Initiator, Sentinel, Flex).',
        headers: {
          hero: 'Rôle',
          overlay: 'Focus overlay',
          clarity: 'Clarté visuelle',
          preset: 'Preset conseillé',
          notes: 'Notes coaching'
        },
        fallbackDescription: (game: string) => `Optimisations par rôle pour ${game}`
      },
      nativeReasons: {
        description: (game: string) => `Optimisé de bout en bout pour ${game} Esports avec overlays fair-play et support staff.`
      },
      product: {
        description: 'Instance Valorant cloud native calibrée pour le 240+ Hz et la conformité tournoi.',
        longDescription:
          'PulseForge Valorant associe une orchestration CPU-bound et notre pipeline vidéo faible latence pour garantir une réactivité extrême. Tout est piloté côté serveur : overlays, Focus HUD, presets audio et mises à jour synchronisées après chaque patch Riot.',
        variants: {
          'pulseforge-valorant': {
            name: 'PulseForge Valorant Esports',
            usage: 'Instance Valorant Esports',
            description: 'Build cloud Valorant orienté compétition et streaming 240+ Hz.',
            use_cases: [
              'Scrims pro et ranked Immortal/Radiant',
              'Coaching staff et review tactique',
              'Production stream Esports & watch parties',
              'Line-up practice PulseForge Lobby',
              'Sessions VOD & sandbox utilitaires'
            ],
            features: [
              'Overlays modulaires phase-aware',
              'Analyse post-match & export (timeline, economy)',
              'Coach macro (tempo, rotations, retakes)',
              'Thèmes d’équipe stream-safe (PulseForge Lobby)',
              'Intégration multi-input (clavier/souris, manette)',
              'Mises à jour continues & profils partagés d’équipe'
            ],
            featureHighlights: [
              'Ranked / tournois — overlays 100 % fair-play basés sur HUD, audio et minimap',
              'PulseForge Lobby — scrims synchronisés, lineup sandbox et caster mode intégré'
            ],
            featureGroups: [
              {
                title: 'Modules tactiques en temps réel',
                description: 'Suite contextuelle pour les phases Valorant',
                items: [
                  'Eco & Buy Advisor : calcul du loss bonus, recommandations full/half/force et rappel drop.',
                  'Execute Planner : cartes-plans par site avec tempo flash/smoke/plant et crossfires probables.',
                  'Post-Plant Director : timer Spike précis, chemins de repost safe et zones d’interdiction.',
                  'Retake Coach : séquence clear → trade → isolate avec alerte avantage numérique (killfeed).',
                  'Angle & Head-Height : repères de hauteur de tête et prompts “don’t ego-peek”.',
                  'Audio Spatial Director : priorisation pas/portes/reload, ducking des sons non critiques.',
                  'Fight Timeline : suivi picks/trades, alerte “no-trade 3 s” et indicateurs de man-advantage.',
                  'VOD Auto-Tag : marquage des pivots (retake tardif, dry peek, spike late) avec export chronologique.'
                ]
              },
              {
                title: 'Réactivité & couverture',
                items: [
                  'Overlay refresh jusqu’à 144 Hz sur preset Esports.',
                  'Modules actifs phase-aware : 10 à 14 selon la carte et le mode.',
                  'Temps de réaction moyen ~40–45 ms sur événements visibles.',
                  'Focus HUD : masquage automatique des overlays non essentiels en fight.'
                ]
              },
              {
                title: 'PulseForge Lobby',
                description: 'Options scrim & entraînement (tous joueurs sur PulseForge)',
                items: [
                  'Cosmétiques partagés : thèmes d’armes et kill-banners PulseForge visibles côté lobby.',
                  'Lineup Sandbox : trajectoires stream-safe de flashes/smokes/molotovs et time-trial d’exec.',
                  'Draft & Role Rules : rôles IGL/Entry/Anchor/Support et contraintes d’achat par round.',
                  'Retake/Execute Scenario Runner : séquences scriptées avec scoreboard d’exécution.',
                  'Ghost-Run & Pathing : fantômes de vos meilleures entrées/retakes, replays synchronisés.',
                  'Caster Mode : HUD élargi (killfeed, economy), replays 8 s et marqueurs de manches.'
                ]
              },
              {
                title: 'Capacité multi-jeux',
                description: 'Profil medium sur top 100 jeux',
                items: [
                  '1080p : 100 % ≥30/60/90 FPS, 96 % ≥120 FPS, 86 % ≥144 FPS.',
                  '1440p : 100 % ≥30/60 FPS, 96 % ≥90 FPS, 75 % ≥120 FPS, 51 % ≥144 FPS.',
                  '4K : 100 % ≥30 FPS, 94 % ≥60 FPS, 52 % ≥90 FPS, 24 % ≥120 FPS, 14 % ≥144 FPS.'
                ]
              },
              {
                title: 'Compatibilité & prérequis',
                items: [
                  '1080p : CPU min Core2 Duo E6550, GPU GTX 550 Ti / HD 6790, 4 Go RAM.',
                  '1440p : CPU min Pentium E5200, GPU GT 1030 / R7 450, 4 Go RAM.',
                  '4K : CPU min Core2 Duo E6700, GPU GTX 750 Ti / RX 550X, 8 Go RAM.',
                  'Sur PulseForge : seules une connexion stable et notre client léger sont requis.'
                ]
              },
              {
                title: 'Pourquoi choisir notre build natif Valorant ?',
                items: [
                  'Intégration native synchronisée après chaque patch Riot.',
                  'Suite overlays et coaching conforme tournois & stream-safe.',
                  'Performances calibrées : 596/565/520 FPS moyens (1080p/1440p/4K).',
                  'Support créatif : scrims, VOD analytics et thèmes d’équipe PulseForge Lobby.'
                ]
              }
            ],
            implementationNotes: [
              'En parties classées/publiques, les overlays utilisent uniquement HUD, audio et minimap visibles. Aucune lecture mémoire, aucun aim-assist.',
              'Les modules sandbox (lineups projetées, caster mode complet) nécessitent PulseForge Lobby avec build partagé.',
              'Les overlays sont opt-in et s’ajustent automatiquement pour éviter la surcharge visuelle.'
            ],
            target_audience: 'Équipes Valorant, coachs Esports, créateurs',
            highlight: 'Profil Esports 240–360 Hz stabilisé',
            protection: 'Overlays fair-play stream-safe',
            updates: 'Sync patch Riot & maintenance continue'
          }
        }
      },
      technical: {
        fpsByResolution: [
          { playability: 'Très fluide', bottleneck: 'CPU (42%)' },
          { playability: 'Très fluide', bottleneck: 'CPU (36%)' },
          { playability: 'Très fluide', bottleneck: 'CPU (25%)' }
        ],
        resolutionGuidance: [
          {
            refreshAdvice: 'Cible 240–360 Hz compétitif',
            description: 'Le profil 1080p Esports maintient ~596 FPS, avec 577 FPS en Ultra. Idéal pour scrims, ranked et LAN virtuelles.',
            note: 'Activez le Focus HUD pour lisser les 1% low en clutch.'
          },
          {
            refreshAdvice: 'Netteté + fréquence 240 Hz',
            description: 'Passer en 1440p conserve une fenêtre de 480–650 FPS. Ultra reste exploitable à ~547 FPS pour streaming détaillé.',
            note: 'Parfait pour un rendu net sur les VOD et le co-stream.'
          },
          {
            refreshAdvice: '4K à 200+ Hz',
            description: 'En 4K Medium, la moyenne reste ~520 FPS avec réserve CPU. Ultra tourne autour de 471 FPS pour des showcases coach/stream.',
            note: 'Utilisez ce preset pour les analyses spectateur et le contenu premium.'
          }
        ],
        improvementTips: [
          'Utilisez le preset Esports et désactivez les post-FX superflus.',
          'Laissez PulseForge piloter le cap d’images (évitez les limites externes).',
          'Activez le Focus HUD pour masquer les modules non essentiels en fight.',
          'Si vous ciblez un 240 Hz parfait, réduisez l’anti-aliasing plutôt que la résolution.'
        ],
        advice: 'Option « CPU Boost » : +5 % → 598/508/687 FPS · +10 % → 602/512/692 FPS · +15 % → 609/518/701 FPS · +20 % → 620/527/713 FPS (requiert un nœud Thermal-Premium).',
        augmentationSuite: {
          modules: [
            'Eco & Buy Advisor : calcul du loss bonus et recommandations achat/drop.',
            'Execute Planner : plans par site avec tempo utilitaires et crossfires probables.',
            'Post-Plant Director : timer Spike, chemins de repost et zones d’interdiction.',
            'Retake Coach : séquence clear → trade → isolate avec alertes d’avantage numérique.',
            'Angle & Head-Height : repères de hauteur de tête et prompts anti ego-peek.',
            'Audio Spatial Director : priorisation pas/portes/reload, ducking automatique.',
            'Fight Timeline : suivi picks/trades et alertes no-trade 3 s.',
            'VOD Auto-Tag : marquage automatique des pivots et export chronologique.'
          ],
          notes: 'Overlays rafraîchis jusqu’à 144 Hz, calibrés sur les phases Valorant (defaults, executes, retakes).'
        },
        heroSynergy: [
          {
            preset: 'Esports',
            coachingNotes: 'Timeline engage, rappels dash/satchel et alertes anti dry-peak.'
          },
          {
            preset: 'Macro',
            coachingNotes: 'Plans de smokes synchronisés, timers post-plant et rappel des re-smokes.'
          },
          {
            preset: 'Recon',
            coachingNotes: 'Séquençage drone/flash, line-ups et signal anti double-push.'
          },
          {
            preset: 'Anchor',
            coachingNotes: 'Alertes trap, rotations safe et monitoring économie adversaire.'
          },
          {
            preset: 'Sniper Focus',
            coachingNotes: 'Head-height map, glint minimisé et rappel reposition instant.'
          },
          {
            preset: 'Support',
            coachingNotes: 'Gestion drop utilitaires, callouts auto et focus anti-tilt HUD.'
          }
        ]
      }
    },
    en: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Native Valorant esports profile',
          description: 'Stabilized 240–360 FPS with dedicated CPU↔GPU orchestration and fair-play overlays.'
        },
        {
          icon: Zap,
          title: 'Ultra-low latency pipeline',
          description: '1080p/1440p/4K streaming with adaptive routing and automatic region failover.'
        },
        {
          icon: Shield,
          title: 'Certified fair-play suite',
          description: 'HUD/audio/minimap overlays compliant with tournament rules—no injection, no intrusive assists.'
        },
        {
          icon: Trophy,
          title: 'Staff & scrim support',
          description: 'PulseForge Lobby playbooks, VOD analytics, and coaching/casting assistance.'
        }
      ],
      metrics: {
        title: 'Calibrated performance for Valorant',
        description:
          'PulseForge Esports reference profile (competitive preset). Valorant is heavily CPU-bound, so we hold 596 average FPS at 1080p with a 507 FPS observed low and 685 FPS peak. Stability remains high at 1440p and 4K thanks to CPU headroom.',
        statCards: {
          maxFps: 'Max observed FPS (1080p Medium)',
          onePercentLow: 'Min observed (1% low proxy, 1080p Medium)',
          inputLag: 'Average input lag'
        },
        allocationTitle: 'Dominant bottleneck (Medium profile)',
        datacenterTitle: 'PulseForge cloud monitoring',
        usage: {
          cpu: 'CPU load',
          gpu: 'GPU load',
          ram: 'Memory used',
          vram: 'VRAM used'
        },
        thermals: {
          cpu: 'Cloud CPU temperature',
          gpu: 'GPU temperature',
          power: 'Power draw'
        },
        stabilityNote: 'Valorant stays CPU-limited: our profiles keep the needed headroom up to 4K.'
      },
      fpsTable: {
        footnote: 'Internal Valorant benchmarks (competitive Medium profile across ranked and scrim maps).'
      },
      resolution: {
        title: 'How to adjust resolution in the cloud',
        description:
          'Our internal measurements reflect the real FPS margin when you change resolution from the PulseForge panel.',
        windowLabel: 'Observed window',
        footnote: 'Values captured on Valorant Medium/Ultra presets with overlays enabled.',
        avgLabel: 'Average FPS'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} runs entirely on our infrastructure: instant provisioning, adaptive network routing, and latency held around ${latency} ms.`,
        bullets: [
          'Server-side overlays, presets, and updates—nothing to install locally.',
          'Instant 1080p/1440p/4K switching from the PulseForge panel while respecting the measured FPS window.',
          'Live ping/jitter/loss monitoring with automatic failover if a region becomes unstable.'
        ],
        profileSubtitle: 'Average measured at 1080p Medium',
        lowLabel: 'Min observed 1080p Medium',
        lowSubtitle: 'Recorded low window'
      },
      improvement: {
        adviceTitle: 'CPU Boost option (host side)'
      },
      augmentation: {
        description: 'Phase-aware Valorant modules covering economy, executes, retakes, and stream-safe coaching.'
      },
      hero: {
        badge: 'AGENT / ROLE PROFILES',
        title: 'Dedicated optimizations',
        description: 'Each preset covers a Valorant role (Duelist, Controller, Initiator, Sentinel, Flex).',
        headers: {
          hero: 'Role',
          overlay: 'Overlay focus',
          clarity: 'Visual clarity',
          preset: 'Recommended preset',
          notes: 'Coaching notes'
        },
        fallbackDescription: (game: string) => `Role-specific optimizations for ${game}`
      },
      nativeReasons: {
        description: (game: string) => `Optimized end to end for ${game} esports with fair-play overlays and staff support.`
      },
      product: {
        description: 'Cloud-native Valorant instance tuned for 240+ Hz competitive play and tournament compliance.',
        longDescription:
          'PulseForge Valorant pairs CPU-bound orchestration with our low-latency video pipeline to keep responsiveness extreme. Everything runs server-side: overlays, Focus HUD, audio presets, and Riot patch-sync updates.',
        variants: {
          'pulseforge-valorant': {
            name: 'PulseForge Valorant Esports',
            usage: 'Valorant esports instance',
            description: 'Cloud Valorant build tailored for competition and 240+ Hz streaming.',
            use_cases: [
              'Pro scrims and Immortal/Radiant ranked play',
              'Coaching staff and tactical review',
              'Esports stream production & watch parties',
              'Line-up practice with PulseForge Lobby',
              'VOD sessions and utility sandbox'
            ],
            features: [
              'Phase-aware modular overlays',
              'Post-match analysis & exports (timeline, economy)',
              'Macro coach (tempo, rotations, retakes)',
              'Stream-safe team themes (PulseForge Lobby)',
              'Multi-input integration (keyboard/mouse, controller)',
              'Continuous updates & shared team profiles'
            ],
            featureHighlights: [
              'Ranked / tournaments—100% fair-play overlays based on HUD, audio, and minimap',
              'PulseForge Lobby—synchronized scrims, lineup sandbox, and built-in caster mode'
            ],
            featureGroups: [
              {
                title: 'Real-time tactical modules',
                description: 'Contextual suite for Valorant phases',
                items: [
                  'Eco & Buy Advisor: computes loss bonus, recommends full/half/force, and reminds drops.',
                  'Execute Planner: site blueprints with flash/smoke/plant tempo and expected crossfires.',
                  'Post-Plant Director: precise spike timer, safe re-peek paths, and denial zones.',
                  'Retake Coach: clear → trade → isolate sequence with numeric advantage alerts from the killfeed.',
                  'Angle & Head-Height: head-height references and “don’t ego-peek” prompts.',
                  'Audio Spatial Director: prioritizes footsteps/doors/reloads with automatic ducking.',
                  'Fight Timeline: tracks picks/trades, flags “no-trade 3 s”, and shows man-advantage.',
                  'VOD Auto-Tag: marks pivots (late retake, dry peek, late spike) with chronological export.'
                ]
              },
              {
                title: 'Reactivity & coverage',
                items: [
                  'Overlay refresh up to 144 Hz on the Esports preset.',
                  'Phase-aware modules: 10 to 14 active depending on map and mode.',
                  'Average reaction time ~40–45 ms on visible events.',
                  'Focus HUD: automatically hides non-essential overlays in fights.'
                ]
              },
              {
                title: 'PulseForge Lobby',
                description: 'Scrim & training options (all players on PulseForge)',
                items: [
                  'Shared cosmetics: PulseForge weapon themes and kill banners visible within the lobby.',
                  'Lineup Sandbox: stream-safe trajectories for flashes/smokes/molotovs plus execute time-trials.',
                  'Draft & Role Rules: enforce IGL/Entry/Anchor/Support roles and round-based buy constraints.',
                  'Retake/Execute Scenario Runner: scripted sequences with execution scoreboards.',
                  'Ghost-Run & Pathing: ghosts of your best entries/retakes with synchronized replays.',
                  'Caster Mode: expanded HUD (killfeed, economy), 8 s instant replays, and round markers.'
                ]
              },
              {
                title: 'Multigame capacity',
                description: 'Medium profile across top 100 titles',
                items: [
                  '1080p: 100% ≥30/60/90 FPS, 96% ≥120 FPS, 86% ≥144 FPS.',
                  '1440p: 100% ≥30/60 FPS, 96% ≥90 FPS, 75% ≥120 FPS, 51% ≥144 FPS.',
                  '4K: 100% ≥30 FPS, 94% ≥60 FPS, 52% ≥90 FPS, 24% ≥120 FPS, 14% ≥144 FPS.'
                ]
              },
              {
                title: 'Compatibility & requirements',
                items: [
                  '1080p: Min CPU Core2 Duo E6550, GPU GTX 550 Ti / HD 6790, 4 GB RAM.',
                  '1440p: Min CPU Pentium E5200, GPU GT 1030 / R7 450, 4 GB RAM.',
                  '4K: Min CPU Core2 Duo E6700, GPU GTX 750 Ti / RX 550X, 8 GB RAM.',
                  'On PulseForge only a stable connection and our lightweight client are required.'
                ]
              },
              {
                title: 'Why choose our native Valorant build?',
                items: [
                  'Native integration synchronized after every Riot patch.',
                  'Fair-play overlays and coaching compliant with tournament and streaming rules.',
                  'Calibrated performance: 596/565/520 average FPS (1080p/1440p/4K).',
                  'Creative support: scrims, VOD analytics, and PulseForge Lobby team themes.'
                ]
              }
            ],
            implementationNotes: [
              'In public/ranked games overlays rely solely on visible HUD, audio, and minimap data. No memory reading, no aim assist.',
              'Sandbox modules (projected lineups, full caster mode) require PulseForge Lobby with a shared build.',
              'Overlays are opt-in and auto-adjust to prevent visual overload.'
            ],
            target_audience: 'Valorant teams, esports coaches, creators',
            highlight: 'Stabilized 240–360 Hz esports profile',
            protection: 'Stream-safe fair-play overlays',
            updates: 'Riot patch sync and continuous maintenance'
          }
        }
      },
      technical: {
        fpsByResolution: [
          { playability: 'Very smooth', bottleneck: 'CPU (42%)' },
          { playability: 'Very smooth', bottleneck: 'CPU (36%)' },
          { playability: 'Very smooth', bottleneck: 'CPU (25%)' }
        ],
        resolutionGuidance: [
          {
            refreshAdvice: '240–360 Hz competitive target',
            description: 'The 1080p Esports profile holds ~596 FPS with Ultra around 577 FPS—ideal for scrims, ranked, and virtual LANs.',
            note: 'Enable Focus HUD to smooth 1% lows during clutch moments.'
          },
          {
            refreshAdvice: 'Sharpness + 240 Hz frequency',
            description: 'Switching to 1440p keeps a 480–650 FPS window. Ultra stays usable near 547 FPS for detailed streaming.',
            note: 'Perfect for high-definition VODs and co-streams.'
          },
          {
            refreshAdvice: '4K at 200+ Hz',
            description: 'At 4K Medium the average stays near 520 FPS with CPU headroom. Ultra hovers around 471 FPS for showcase/coach streams.',
            note: 'Use this preset for spectator analysis and premium content.'
          }
        ],
        improvementTips: [
          'Use the Esports preset and disable non-essential post-FX.',
          'Let PulseForge manage the frame cap—avoid external limits.',
          'Enable Focus HUD to hide non-critical modules during fights.',
          'If you need a flawless 240 Hz, lower anti-aliasing instead of resolution.'
        ],
        advice: 'CPU Boost option: +5% → 598/508/687 FPS · +10% → 602/512/692 FPS · +15% → 609/518/701 FPS · +20% → 620/527/713 FPS (requires a Thermal-Premium node).',
        augmentationSuite: {
          modules: [
            'Eco & Buy Advisor: computes loss bonus and drop recommendations.',
            'Execute Planner: site plans with utility tempo and expected crossfires.',
            'Post-Plant Director: spike timer, repost paths, and denial zones.',
            'Retake Coach: clear → trade → isolate sequence with advantage alerts.',
            'Angle & Head-Height: head-height markers and “don’t ego-peek” prompts.',
            'Audio Spatial Director: prioritizes footsteps/doors/reloads with auto ducking.',
            'Fight Timeline: tracks picks/trades and issues “no-trade 3 s” warnings.',
            'VOD Auto-Tag: automatically tags pivotal moments with timeline export.'
          ],
          notes: 'Overlays refresh up to 144 Hz and are tuned for Valorant phases (defaults, executes, retakes).'
        },
        heroSynergy: [
          {
            preset: 'Esports',
            coachingNotes: 'Engage timeline, dash/satchel reminders, and anti dry-peek alerts.'
          },
          {
            preset: 'Macro',
            coachingNotes: 'Synchronized smoke plans, post-plant timers, and re-smoke reminders.'
          },
          {
            preset: 'Recon',
            coachingNotes: 'Drone/flash sequencing, lineups, and anti double-push signals.'
          },
          {
            preset: 'Anchor',
            coachingNotes: 'Trap alerts, safe rotations, and opponent economy monitoring.'
          },
          {
            preset: 'Sniper Focus',
            coachingNotes: 'Head-height mapping, minimized glint, and instant reposition cues.'
          },
          {
            preset: 'Support',
            coachingNotes: 'Utility drop management, auto callouts, and anti-tilt HUD focus.'
          }
        ]
      }
    },
    et: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Valoranti natiivne Esports-profiil',
          description: '240–360 FPS stabiliseeritud CPU↔GPU orkestreerimise ja fair-play overlaydega.'
        },
        {
          icon: Zap,
          title: 'Ülimadala latentsusega toru',
          description: '1080p/1440p/4K voog adaptatiivse marsruudi ja automaatse regiooni vahetusega.'
        },
        {
          icon: Shield,
          title: 'Fair-play kinnitatud suite',
          description: 'HUDi/heli/minikaardi overlayd vastavad turniirireeglitele – ilma süstide ja abita.'
        },
        {
          icon: Trophy,
          title: 'Tiimi ja scrimi tugi',
          description: 'PulseForge Lobby plaanid, VOD-analüütika ja coach/casteri abi.'
        }
      ],
      metrics: {
        title: 'Kalibreeritud jõudlus Valoranti jaoks',
        description:
          'PulseForge Esportsi võrdlusprofiil (võistluspreset). Valorant sõltub tugevalt CPU-st, seega hoiame 596 FPS keskmiselt 1080p juures, 507 FPS madalvahemiku ja 685 FPS tipuga. 1440p ja 4K säilitavad kõrge stabiilsuse tänu CPU varule.',
        statCards: {
          maxFps: 'Maksimaalne täheldatud FPS (1080p Medium)',
          onePercentLow: 'Minimaalne täheldatud (1% low proxy, 1080p Medium)',
          inputLag: 'Keskmine sisendviivitus'
        },
        allocationTitle: 'Domineeriv pudelkits (Medium-profiil)',
        datacenterTitle: 'PulseForge’i pilvemonitoring',
        usage: {
          cpu: 'CPU koormus',
          gpu: 'GPU koormus',
          ram: 'RAM kasutus',
          vram: 'VRAM kasutus'
        },
        thermals: {
          cpu: 'Pilve CPU temperatuur',
          gpu: 'GPU temperatuur',
          power: 'Võimsustarve'
        },
        stabilityNote: 'Valorant jääb CPU-piiratuks: meie profiilid hoiavad varu ka 4K juures.'
      },
      fpsTable: {
        footnote: 'Valoranti sisemised benchmarkid (Medium võistluspreset, ranked- ja scrim-kaardid).'
      },
      resolution: {
        title: 'Kuidas pilves resolutsiooni reguleerida',
        description:
          'Meie mõõtmised näitavad tegelikku FPS-varu, kui muudate PulseForge’i paneelist eraldusvõimet.',
        windowLabel: 'Täheldatud vahemik',
        footnote: 'Väärtused Valoranti Medium/Ultra presetidel koos overlaydega.',
        avgLabel: 'Keskmine FPS'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} töötab täielikult meie infrastruktuuril: kohene provisioning, adaptatiivne võrk ja latentsus hoitakse umbes ${latency} ms juures.`,
        bullets: [
          'Overlayd, presetid ja uuendused rakenduvad serveripoolselt – kohalikke installatsioone pole.',
          'Lülitu 1080p/1440p/4K vahel hetkega, järgides mõõdetud FPS-vahemikku.',
          'Otsemonitooring ping/jitter/kao üle, automaatne regiooni vahetus ebastabiilsuse korral.'
        ],
        profileSubtitle: 'Keskmine mõõdetud 1080p Medium juures',
        lowLabel: 'Min täheldatud 1080p Medium',
        lowSubtitle: 'Madal aken'
      },
      improvement: {
        adviceTitle: '„CPU Boost” valik (hosti poolel)'
      },
      augmentation: {
        description: 'Valoranti faasiteadlikud moodulid: majandus, executes, retake’id ja stream-safe coaching.'
      },
      hero: {
        badge: 'AGENDI / ROLLI PROFIILID',
        title: 'Pühendatud optimeerimised',
        description: 'Iga preset katab Valoranti rolli (Duelist, Controller, Initiator, Sentinel, Flex).',
        headers: {
          hero: 'Roll',
          overlay: 'Overlay fookus',
          clarity: 'Visuaalne selgus',
          preset: 'Soovituslik preset',
          notes: 'Coaching’u märkused'
        },
        fallbackDescription: (game: string) => `Rollipõhised optimeerimised mängule ${game}`
      },
      nativeReasons: {
        description: (game: string) => `${game} on optimeeritud otsast lõpuni fair-play overlayde ja tiimitaseme toega.`
      },
      product: {
        description: 'Pilvepõhine Valoranti instants, häälestatud 240+ Hz võistlusmänguks ja turniirinõuetele.',
        longDescription:
          'PulseForge Valorant ühendab CPU-keskse orkestreerimise ja madala latentsusega videotoru, et hoida reageerimisvõime äärmuslik. Kõik töötab serveripoolselt: overlayd, Focus HUD, audiopresetid ja Riot patchide järgsed värskendused.',
        variants: {
          'pulseforge-valorant': {
            name: 'PulseForge Valorant Esports',
            usage: 'Valoranti esports-instants',
            description: 'Pilvebuild, mis on loodud võistlusmänguks ja 240+ Hz voogedastuseks.',
            use_cases: [
              'Pro-scrimid ja Immortal/Radiant ranked',
              'Treeneritiim ja taktikaline analüüs',
              'Esports-voogude produktsioon ja watch party’d',
              'Lineup’i harjutamine PulseForge Lobbyga',
              'VOD-sessioonid ja utiliidi-sandbox'
            ],
            features: [
              'Faasiteadlikud modulaarsed overlayd',
              'Matšijärgne analüüs ja ekspordid (timeline, economy)',
              'Makrocoach (tempo, rotatsioonid, retake’id)',
              'Stream-safe tiimiteemad (PulseForge Lobby)',
              'Multi-input tugi (klaviatuur/hiir, kontroller)',
              'Pidevad uuendused ja jagatud tiimiprofiilid'
            ],
            featureHighlights: [
              'Ranked / turniirid – 100% fair-play overlayd HUDi, heli ja minikaardi põhjal',
              'PulseForge Lobby – sünkroonitud scrimid, lineup-sandbox ja sisse-ehitatud caster mode'
            ],
            featureGroups: [
              {
                title: 'Reaalajas taktikamoodulid',
                description: 'Kontekstuaalne suite Valoranti faaside jaoks',
                items: [
                  'Eco & Buy Advisor: loss-bonuse arvutus, full/half/force soovitused ja drop-meeldetuletused.',
                  'Execute Planner: saidiplanid flashide/suitse/molyde jaoks ja oodatavate crossfire’idega.',
                  'Post-Plant Director: täpne spike-timer, turvalised repost-teed ja keelu tsoonid.',
                  'Retake Coach: clear → trade → isolate järjestus killfeed’i arvulise eelise hoiatustega.',
                  'Angle & Head-Height: pea kõrguse markerid ja “don’t ego-peek” vihjed.',
                  'Audio Spatial Director: sammude/uste/reload’i prioritiseerimine automaatse ducking’uga.',
                  'Fight Timeline: jälgib picke/trade’e, annab “no-trade 3 s” hoiatused ja eelisnäitajad.',
                  'VOD Auto-Tag: märgib pöördepunktid (hiline retake, dry peek, hiline spike) koos ekspordiga.'
                ]
              },
              {
                title: 'Reaktiivsus ja katvus',
                items: [
                  'Overlay värskendus kuni 144 Hz Esports-preseti peal.',
                  'Faasiteadlikke mooduleid on 10–14 sõltuvalt kaardist ja režiimist.',
                  'Keskmine reaktsiooniaeg ~40–45 ms nähtavatel sündmustel.',
                  'Focus HUD peidab võitluses mitteolulised overlayd automaatselt.'
                ]
              },
              {
                title: 'PulseForge Lobby',
                description: 'Scrimi ja treeningu valikud (kõik mängijad PulseForge’il)',
                items: [
                  'Jagatud kosmeetika: PulseForge’i relvateemad ja kill-bännerid lobby’s nähtavad.',
                  'Lineup Sandbox: stream-safe trajektoorid flashide/suitse/molyde jaoks ja execute time-trialid.',
                  'Draft & Role Rules: kehtestab IGL/Entry/Anchor/Support rollid ja ostureeglid.',
                  'Retake/Execute Scenario Runner: skriptitud seeriad täitmise scoreboardiga.',
                  'Ghost-Run & Pathing: parimate sisenemiste/retake’ide kummitused ja sünkroonitud kordused.',
                  'Caster Mode: laiendatud HUD (killfeed, economy), 8 s kohesed kordused ja roundi markerid.'
                ]
              },
              {
                title: 'Mitmemänguline võimekus',
                description: 'Medium-profiil top 100 mängu lõikes',
                items: [
                  '1080p: 100% ≥30/60/90 FPS, 96% ≥120 FPS, 86% ≥144 FPS.',
                  '1440p: 100% ≥30/60 FPS, 96% ≥90 FPS, 75% ≥120 FPS, 51% ≥144 FPS.',
                  '4K: 100% ≥30 FPS, 94% ≥60 FPS, 52% ≥90 FPS, 24% ≥120 FPS, 14% ≥144 FPS.'
                ]
              },
              {
                title: 'Ühilduvus ja nõuded',
                items: [
                  '1080p: min CPU Core2 Duo E6550, GPU GTX 550 Ti / HD 6790, 4 GB RAM.',
                  '1440p: min CPU Pentium E5200, GPU GT 1030 / R7 450, 4 GB RAM.',
                  '4K: min CPU Core2 Duo E6700, GPU GTX 750 Ti / RX 550X, 8 GB RAM.',
                  'PulseForge’is on vaja vaid stabiilset ühendust ja meie kerget klienti.'
                ]
              },
              {
                title: 'Miks valida meie Valoranti natiivne build?',
                items: [
                  'Natiivne integratsioon sünkroonis iga Riot patchiga.',
                  'Fair-play overlayd ja coaching turniiri- ning striiminõuetele vastav.',
                  'Kalibreeritud jõudlus: 596/565/520 FPS keskmiselt (1080p/1440p/4K).',
                  'Loominguline tugi: scrimid, VOD-analüütika ja PulseForge Lobby tiimiteemad.'
                ]
              }
            ],
            implementationNotes: [
              'Avalikes/ranked-mängudes tuginevad overlayd ainult nähtavale HUDile, helile ja minikaardile. Mälulugemist ega aim-abi pole.',
              'Sandbox-moodulid (joonistatud lineupid, täismahus caster mode) nõuavad PulseForge Lobby ühise buildiga.',
              'Overlayd on opt-in ja kohanduvad automaatselt, et vältida visuaalset üleküllust.'
            ],
            target_audience: 'Valoranti tiimid, esports-treenerid, loojad',
            highlight: 'Stabiliseeritud 240–360 Hz Esports-profiil',
            protection: 'Stream-safe fair-play overlayd',
            updates: 'Riot patchide sünkroon ja pidev hooldus'
          }
        }
      },
      technical: {
        fpsByResolution: [
          { playability: 'Väga sujuv', bottleneck: 'CPU (42%)' },
          { playability: 'Väga sujuv', bottleneck: 'CPU (36%)' },
          { playability: 'Väga sujuv', bottleneck: 'CPU (25%)' }
        ],
        resolutionGuidance: [
          {
            refreshAdvice: '240–360 Hz võistlussiht',
            description: '1080p Esports-profiil hoiab ~596 FPS, Ultra ~577 FPS – ideaalne scrimideks ja ranked’iks.',
            note: 'Focus HUD aitab clutch’ides 1% madalaid siluda.'
          },
          {
            refreshAdvice: 'Teravus + 240 Hz',
            description: '1440p peale liikumine jätab 480–650 FPS akna. Ultra püsib ~547 FPS ümber detailseks voogedastuseks.',
            note: 'Sobib ideaalselt HD-VODideks ja co-streamideks.'
          },
          {
            refreshAdvice: '4K üle 200 Hz',
            description: '4K Medium hoiab keskmiselt ~520 FPS CPU-varuga. Ultra on ~471 FPS coach/stream-sisu jaoks.',
            note: 'Kasuta seda presetit vaatajapildi analüüsiks ja premium-sisuks.'
          }
        ],
        improvementTips: [
          'Kasuta Esports-preseti ja lülita mittevajalikud post-FX-id välja.',
          'Lase PulseForge’il hallata FPS limiiti – väldi väliseid piirajaid.',
          'Aktiveeri Focus HUD, et peita võitluse ajal ebaolulised moodulid.',
          'Kui vajad täiuslikku 240 Hz kogemust, vähenda pigem anti-aliasingut kui resolutsiooni.'
        ],
        advice: '„CPU Boost” valik: +5% → 598/508/687 FPS · +10% → 602/512/692 FPS · +15% → 609/518/701 FPS · +20% → 620/527/713 FPS (vajab Thermal-Premium sõlme).',
        augmentationSuite: {
          modules: [
            'Eco & Buy Advisor: loss-bonuse arvutus ja drop-soovitused.',
            'Execute Planner: saidiplanid utiliidi tempoga ja eeldatavate risttuledega.',
            'Post-Plant Director: spike’i taimer, repost-teed ja keelutsoonid.',
            'Retake Coach: clear → trade → isolate järjestus eelisehoiatustega.',
            'Angle & Head-Height: pea kõrguse markerid ja “don’t ego-peek” vihjed.',
            'Audio Spatial Director: sammude/uste/reload’i prioritiseerimine automaatse ducking’uga.',
            'Fight Timeline: jälgib picke/trade’e ja annab “no-trade 3 s” märguande.',
            'VOD Auto-Tag: märgib pöördepunktid automaatselt ja ekspordib ajajoone.'
          ],
          notes: 'Overlayd värskenduvad kuni 144 Hz ja on häälestatud Valoranti faasidele (defaults, executes, retake’id).'
        },
        heroSynergy: [
          {
            preset: 'Esports',
            coachingNotes: 'Engage’i ajajoon, dash/satchel meeldetuletused ja anti dry-peak hoiatused.'
          },
          {
            preset: 'Macro',
            coachingNotes: 'Sünkroonitud suitsuplaanid, post-plant taimerid ja re-smoke märguanded.'
          },
          {
            preset: 'Recon',
            coachingNotes: 'Droon/flash’i järjestused, lineupid ja anti double-push signaalid.'
          },
          {
            preset: 'Anchor',
            coachingNotes: 'Trap’i hoiatused, turvalised rotatsioonid ja vastase majanduse jälgimine.'
          },
          {
            preset: 'Sniper Focus',
            coachingNotes: 'Pea kõrguse kaardistus, vähendatud glint ja kohene repositsioon.'
          },
          {
            preset: 'Support',
            coachingNotes: 'Utiliitide jagamise haldus, automaatsed callout’id ja anti-tilt HUD fookus.'
          }
        ]
      }
    }
  },
  'gaming-battlefield6': {
    fr: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Optimisation Battlefield native',
          description: 'Profils Conquest/Breakthrough calibrés avec pipeline CPU↔GPU équilibré.'
        },
        {
          icon: Zap,
          title: 'Provisioning cloud instantané',
          description: 'Instances Battlefield 6 prêtes en quelques secondes avec bascule région automatique selon le ping.'
        },
        {
          icon: Shield,
          title: 'Suite tactique fair-play',
          description: 'Overlays objectifs/escouade stream-safe sans injection mémoire ni assistance intrusive.'
        },
        {
          icon: Trophy,
          title: 'Support véhicules & production',
          description: 'Coaching véhicules, analytics tickets et outils stream intégrés PulseForge Lobby.'
        }
      ],
      metrics: {
        title: 'Performances calibrées pour Battlefield 6',
        description:
          'Profil PulseForge Medium compétitif : 208 FPS de moyenne, min observé à 176 FPS et pic à 238 FPS en 1080p. Les profils 1440p et 4K restent très fluides grâce à l’allocation dynamique CPU↔GPU.',
        statCards: {
          maxFps: 'FPS maximum observé (1080p Medium)',
          onePercentLow: 'Min observé (1080p Medium)',
          inputLag: 'Input lag moyen'
        },
        allocationTitle: 'Bottleneck dominant (profil Medium)',
        datacenterTitle: 'Monitoring cloud PulseForge',
        usage: {
          cpu: 'Charge CPU',
          gpu: 'Charge GPU',
          ram: 'Mémoire utilisée',
          vram: 'VRAM utilisée'
        },
        thermals: {
          cpu: 'Température CPU cloud',
          gpu: 'Température GPU',
          power: 'Consommation électrique'
        },
        stabilityNote: '1080p reste limité par le CPU ; les profils 1440p/4K exploitent la marge GPU pour lisser la courbe FPS.'
      },
      fpsTable: {
        footnote: 'Benchmarks internes Battlefield 6 (Conquest & Breakthrough, profil Medium compétitif).'
      },
      resolution: {
        title: 'Comment ajuster la résolution côté cloud',
        description:
          'Nos mesures internes traduisent la marge FPS réelle lorsque vous modifiez la définition depuis le panneau PulseForge.',
        windowLabel: 'Fenêtre relevée',
        footnote: 'Valeurs relevées sur presets Medium/Ultra avec overlays actifs.',
        avgLabel: 'FPS moyen'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} tourne entièrement sur notre infrastructure : provisioning instantané, routage adaptatif et latence stabilisée à ${latency} ms.`,
        bullets: [
          'Overlays, presets et mises à jour appliqués côté serveur — aucune installation locale.',
          'Monitoring ping/jitter/pertes en temps réel avec bascule automatique de région si nécessaire.',
          'Profilage spécifique Conquest/Breakthrough et véhicules mis à jour après chaque patch.'
        ],
        profileSubtitle: 'Moyenne mesurée en 1080p Medium',
        lowLabel: 'Min observé 1080p Medium',
        lowSubtitle: 'Fenêtre basse relevée'
      },
      improvement: {
        adviceTitle: 'Option « CPU Boost » (côté hôte)'
      },
      augmentation: {
        description: 'Suite tactique Battlefield 6 : objectifs, rotations, véhicules et analytics tickets.'
      },
      hero: {
        badge: 'PROFILS ESCOUADE & VÉHICULES',
        title: 'Optimisations dédiées',
        description: 'Chaque preset couvre un rôle Battlefield (infanterie, reconnaissance, véhicules, commandement).',
        headers: {
          hero: 'Rôle',
          overlay: 'Focus overlay',
          clarity: 'Clarté visuelle',
          preset: 'Preset conseillé',
          notes: 'Notes coaching'
        },
        fallbackDescription: (game: string) => `Optimisations par rôle pour ${game}`
      },
      nativeReasons: {
        description: (game: string) => `Optimisé de bout en bout pour ${game} côté cloud avec overlays fair-play.`
      },
      product: {
        description: 'Instance Battlefield 6 cloud native calibrée Conquest/Breakthrough.',
        longDescription:
          'PulseForge Battlefield 6 combine profils objectifs, pipeline vidéo faible latence et monitoring réseau pour maintenir une réactivité stable en 1080p, 1440p et 4K. Les overlays, modules véhicules et Focus HUD sont pilotés côté serveur afin de rester conformes en ranked comme en scrim.',
        variants: {
          'pulseforge-battlefield6': {
            name: 'PulseForge Battlefield 6 Command',
            usage: 'Instance Battlefield 6 PulseForge',
            description: 'Build cloud Battlefield 6 orienté objectifs, véhicules et production stream.',
            use_cases: [
              'Compétitions Conquest & Breakthrough',
              'Coaching escouade et analytics tickets',
              'Production stream Battlefield',
              'Scrims privés PulseForge Lobby',
              'Sandbox véhicules & drills objectifs'
            ],
            features: [
              'Overlays modulaires objectifs/escouade',
              'Analytics post-match tickets & timeline',
              'Coach rotations et spawn waves',
              'Vehicle drill suite PulseForge Lobby',
              'Profils audio Battlefield calibrés',
              'Mises à jour synchronisées patch Battlefield',
              'Compatibilité PulseForge Lobby sandbox'
            ],
            featureHighlights: [
              'Ranked/Tous serveurs – 100 % fair-play (lecture d’écran, killfeed, audio, sans injection mémoire)',
              'Lobbies privés PulseForge – builds synchronisés où tout le monde est sur PulseForge (cosmétique & entraînement avancé)'
            ],
            featureGroups: [
              {
                title: 'Ranked / fair-play (live)',
                items: [
                  'Ticket & Pressure Overlay : pression par secteur, fenêtres de neutralisation/capture et rappel des tickets.',
                  'Rotation Coach : routes d’escouade safe/fast, backcaps opportunistes et timings de regroupement.',
                  'Spawn Wave Planner : estimation vagues alliées/ennemies, choix beacon/squad/base.',
                  'Vehicle Ops Assistant : cycles réparation/sortie et angles sûrs (sans assistance d’aim).',
                  'Suppression & Visibility : indicateurs suppression et fenêtres de punition.',
                  'Killfeed Intelligence : synthèse wipes d’escouade et détection avantage numérique.',
                  'Focus HUD : masquage contextuel des modules non essentiels pendant les fights massifs.'
                ]
              },
              {
                title: 'Réactivité & couverture',
                items: [
                  'Overlay refresh jusqu’à 144 Hz sur profils Medium/High.',
                  'Modules actifs phase-aware : objectifs, escouade, véhicules.',
                  'Temps de réaction moyen ~45 ms sur événements visibles.',
                  'Monitoring réseau continu avec bascule automatique de région.'
                ]
              },
              {
                title: 'PulseForge Lobby',
                description: 'Options de jeu & d’entraînement (tous joueurs sur build PulseForge)',
                items: [
                  'Cosmétiques partagés : thèmes d’escouade, tracers & kill-banners PulseForge.',
                  'Vehicle Drill Suite : circuits tank/IFV/heli/jet, duels blindés et ateliers réparation coordonnée.',
                  'Objective Scenario Runner : scripts Conquest/Breakthrough avec scoreboard captures/retakes/tickets.',
                  'Stratboard Live : tableau tactique par carte avec annotations coach/lead.',
                  'Draft & Role Rules : verrouillage Lead/Anchor/Recon/Support et loadouts imposés.',
                  'Caster Mode : HUD élargi (objectifs, véhicules, tickets), replays instantanés et marqueurs d’actions.'
                ]
              },
              {
                title: 'Pourquoi choisir notre build natif Battlefield 6 ?',
                items: [
                  'Intégration native synchronisée après chaque mise à jour DICE.',
                  'Suite overlays fair-play, stream-safe et conforme ranked/tournoi.',
                  'Performances calibrées : 208/186/154 FPS moyens (1080p/1440p/4K).',
                  'Support créatif : scrims, VOD analytics et thèmes d’escouade PulseForge Lobby.'
                ]
              }
            ],
            implementationNotes: [
              'En parties publiques/ranked, les overlays reposent uniquement sur HUD/son/killfeed visibles. Aucune lecture mémoire ni injection.',
              'Cosmétiques partagés, sandbox véhicules et stratboards temps réel sont réservés aux lobbies PulseForge avec build commun.',
              'Overlays opt-in avec masquage automatique en fight pour limiter la surcharge visuelle.'
            ],
            target_audience: 'Escouades Battlefield, coachs véhicules, créateurs',
            highlight: 'Suite Conquest & véhicules dédiée',
            protection: 'Fair-play stream-safe',
            updates: 'Mises à jour synchronisées patch Battlefield'
          }
        }
      },
      technical: {
        fpsByResolution: [
          { playability: 'Très fluide', bottleneck: 'CPU (≈ 88%)' },
          { playability: 'Très fluide', bottleneck: 'GPU (≈ 61%)' },
          { playability: 'Très fluide', bottleneck: 'GPU (≈ 76%)' }
        ],
        resolutionGuidance: [
          {
            refreshAdvice: 'Cible 144–200 Hz compétitif',
            description: 'Idéal pour l’infanterie et les combats rapprochés ; la marge reste confortable même en High.',
            note: 'Activez Focus HUD pour réduire la charge visuelle lors des push massifs.'
          },
          {
            refreshAdvice: 'Netteté + stabilité',
            description: 'Excellent compromis pour le streaming Conquest et les VOD détaillées.',
            note: 'Préférez le preset High pour lisser les 1% low sans perte visuelle majeure.'
          },
          {
            refreshAdvice: '4K fluide 120 Hz',
            description: 'Parfait pour du showcase cinématographique tout en gardant une bonne réactivité.',
            note: 'Utilisez ce mode pour les prises de vue premium ou la production stream.'
          }
        ],
        improvementTips: [
          'Baissez ombres et Post-FX en priorité tout en conservant la résolution native.',
          'Activez Focus HUD afin de masquer les modules non essentiels lors des grands teamfights.',
          'Préférez le preset High plutôt que Ultra en 1440p/4K pour lisser les 1% low.'
        ],
        advice:
          'Option « CPU Boost » : +5 % → ~210/178/240 FPS · +10 % → ~212/180/244 FPS · +15 % → ~215/183/247 FPS · +20 % → ~219/186/251 FPS (nécessite un nœud Thermal-Premium).',
        augmentationSuite: {
          modules: [
            'Ticket & Pressure Overlay : pression par secteur et fenêtres de capture.',
            'Rotation Coach : routes safe/fast et timings de regroupement.',
            'Spawn Wave Planner : estimation des vagues alliées/ennemies.',
            'Vehicle Ops Assistant : cycles réparation/sortie sans assistance intrusive.',
            'Suppression & Visibility : indicateurs de suppression et fenêtres de punition.',
            'Ballistics Trainer : visualisation de la balistique en entraînement.',
            'Killfeed Intelligence : synthèse wipes d’escouade et avantage numérique.'
          ],
          notes: 'Modules calibrés Conquest/Breakthrough, rafraîchis après chaque patch DICE.'
        },
        heroSynergy: [
          { preset: 'Assault', coachingNotes: 'Priorité points chauds et rappels utilitaires anti-véhicule.' },
          { preset: 'Recon', coachingNotes: 'Surveillance drones et trajectoires de backcap.' },
          { preset: 'Support', coachingNotes: 'Gestion beacons et cycles de réparation.' },
          { preset: 'Armor', coachingNotes: 'Angles sûrs et cycles réparation/sortie.' },
          { preset: 'Air', coachingNotes: 'Routes nap-of-the-earth et timers de contre-mesures.' },
          { preset: 'Command', coachingNotes: 'Synthèse tickets et priorités d’objectif.' }
        ]
      }
    },
    en: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Native Battlefield optimization',
          description: 'Conquest/Breakthrough profiles tuned with a balanced CPU↔GPU pipeline.'
        },
        {
          icon: Zap,
          title: 'Instant cloud provisioning',
          description: 'Battlefield 6 instances spin up in seconds with automatic region failover based on ping.'
        },
        {
          icon: Shield,
          title: 'Fair-play tactical suite',
          description: 'Objective/squad overlays stay stream-safe with zero memory injection or intrusive assists.'
        },
        {
          icon: Trophy,
          title: 'Vehicle & production support',
          description: 'Vehicle coaching, ticket analytics, and integrated streaming tools via PulseForge Lobby.'
        }
      ],
      metrics: {
        title: 'Performance calibrated for Battlefield 6',
        description:
          'PulseForge competitive Medium profile: 208 average FPS, 176 FPS minimum, and peaks at 238 FPS in 1080p. 1440p and 4K remain very smooth thanks to dynamic CPU↔GPU allocation.',
        statCards: {
          maxFps: 'Max FPS observed (1080p Medium)',
          onePercentLow: 'Min observed (1080p Medium)',
          inputLag: 'Average input lag'
        },
        allocationTitle: 'Dominant bottleneck (Medium profile)',
        datacenterTitle: 'PulseForge cloud monitoring',
        usage: {
          cpu: 'CPU load',
          gpu: 'GPU load',
          ram: 'Memory usage',
          vram: 'VRAM usage'
        },
        thermals: {
          cpu: 'Cloud CPU temperature',
          gpu: 'GPU temperature',
          power: 'Power draw'
        },
        stabilityNote: '1080p is CPU-bound; the 1440p/4K presets leverage GPU headroom to keep the curve stable.'
      },
      fpsTable: {
        footnote: 'Internal Battlefield 6 benchmarks (Conquest & Breakthrough, competitive Medium profile).'
      },
      resolution: {
        title: 'How to adjust resolution from the cloud',
        description:
          'Our internal measurements show the actual FPS buffer when you change definition via the PulseForge panel.',
        windowLabel: 'Measured window',
        footnote: 'Values captured on Medium/Ultra presets with overlays enabled.',
        avgLabel: 'Average FPS'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} runs entirely on our infrastructure: instant provisioning, adaptive routing, and latency stabilized around ${latency} ms.`,
        bullets: [
          'Overlays, presets, and updates are applied server-side—nothing to install locally.',
          'Real-time ping/jitter/loss monitoring with automatic region failover when needed.',
          'Battlefield-specific profiling for Conquest/Breakthrough and vehicles refreshed after every patch.'
        ],
        profileSubtitle: 'Average measured at 1080p Medium',
        lowLabel: 'Min observed 1080p Medium',
        lowSubtitle: 'Recorded low window'
      },
      improvement: {
        adviceTitle: 'CPU Boost option (host side)'
      },
      augmentation: {
        description: 'Battlefield 6 tactical suite covering objectives, rotations, vehicles, and ticket analytics.'
      },
      hero: {
        badge: 'SQUAD & VEHICLE PROFILES',
        title: 'Dedicated optimizations',
        description: 'Each preset covers a Battlefield role (infantry, recon, vehicles, command).',
        headers: {
          hero: 'Role',
          overlay: 'Overlay focus',
          clarity: 'Visual clarity',
          preset: 'Recommended preset',
          notes: 'Coaching notes'
        },
        fallbackDescription: (game: string) => `Role-specific optimizations for ${game}`
      },
      nativeReasons: {
        description: (game: string) => `Optimized end to end for ${game} in the cloud with fair-play overlays.`
      },
      product: {
        description: 'Cloud-native Battlefield 6 instance tuned for Conquest/Breakthrough.',
        longDescription:
          'PulseForge Battlefield 6 blends objective profiles, a low-latency video pipeline, and live network monitoring to keep responsiveness steady at 1080p, 1440p, and 4K. Overlays, vehicle modules, and Focus HUD are orchestrated server-side to remain compliant in ranked and scrims.',
        variants: {
          'pulseforge-battlefield6': {
            name: 'PulseForge Battlefield 6 Command',
            usage: 'Battlefield 6 PulseForge instance',
            description: 'Cloud Battlefield 6 build focused on objectives, vehicles, and premium streaming.',
            use_cases: [
              'Conquest & Breakthrough competition',
              'Squad coaching and ticket analytics',
              'Battlefield stream production',
              'Private scrims with PulseForge Lobby',
              'Vehicle sandbox & objective drills'
            ],
            features: [
              'Modular objective/squad overlays',
              'Post-match ticket analytics & timeline',
              'Rotation and spawn-wave coaching',
              'PulseForge Lobby vehicle drill suite',
              'Calibrated Battlefield audio profiles',
              'Patch-synced Battlefield updates',
              'PulseForge Lobby sandbox compatibility'
            ],
            featureHighlights: [
              'Ranked/all servers – 100% fair play (screen reading, killfeed, audio, no memory injection)',
              'PulseForge private lobbies – synchronized builds with every player on PulseForge (cosmetics & advanced training)'
            ],
            featureGroups: [
              {
                title: 'Ranked / fair-play (live)',
                items: [
                  'Ticket & Pressure Overlay: sector pressure, capture windows, and ticket reminders.',
                  'Rotation Coach: safe/fast squad routes, opportunistic backcaps, and regroup timings.',
                  'Spawn Wave Planner: estimates ally/enemy waves and optimizes beacon/squad/base respawns.',
                  'Vehicle Ops Assistant: repair/exit cycles and safe angles without aim assistance.',
                  'Suppression & Visibility: suppression indicators and punishment windows.',
                  'Killfeed Intelligence: squad wipe synthesis and numeric advantage detection.',
                  'Focus HUD: contextually hides non-essential modules during large fights.'
                ]
              },
              {
                title: 'Reactivity & coverage',
                items: [
                  'Overlay refresh up to 144 Hz on Medium/High profiles.',
                  'Phase-aware modules covering objectives, squads, and vehicles.',
                  'Average reaction time ~45 ms on visible events.',
                  'Continuous network monitoring with automatic region switching.'
                ]
              },
              {
                title: 'PulseForge Lobby',
                description: 'Training options when everyone runs the PulseForge build',
                items: [
                  'Shared cosmetics: squad themes, tracers, and PulseForge kill banners.',
                  'Vehicle Drill Suite: timed tank/IFV/heli/jet circuits, armor duels, coordinated repair workshops.',
                  'Objective Scenario Runner: scripted Conquest/Breakthrough drills with capture/retake/ticket scoreboards.',
                  'Stratboard Live: map-tied tactical board with coach/leader annotations.',
                  'Draft & Role Rules: locks Lead/Anchor/Recon/Support roles and enforces loadouts.',
                  'Caster Mode: expanded HUD (objectives, vehicles, tickets), instant replays, and key event markers.'
                ]
              },
              {
                title: 'Why choose our native Battlefield 6 build?',
                items: [
                  'Native integration synchronized after every DICE update.',
                  'Fair-play, stream-safe overlay suite compliant with ranked and tournaments.',
                  'Calibrated performance: 208/186/154 average FPS (1080p/1440p/4K).',
                  'Creative support: scrims, VOD analytics, and PulseForge Lobby squad themes.'
                ]
              }
            ],
            implementationNotes: [
              'In public/ranked games overlays rely solely on visible HUD/audio/killfeed data. No memory reading or injection.',
              'Shared cosmetics, vehicle sandboxes, and live stratboards are limited to PulseForge lobbies with a shared build.',
              'Overlays are opt-in and auto-hide during fights to avoid visual overload.'
            ],
            target_audience: 'Battlefield squads, vehicle coaches, creators',
            highlight: 'Dedicated Conquest & vehicle suite',
            protection: 'Stream-safe fair play',
            updates: 'Battlefield patch-synced updates'
          }
        }
      },
      technical: {
        fpsByResolution: [
          { playability: 'Very smooth', bottleneck: 'CPU (≈ 88%)' },
          { playability: 'Very smooth', bottleneck: 'GPU (≈ 61%)' },
          { playability: 'Very smooth', bottleneck: 'GPU (≈ 76%)' }
        ],
        resolutionGuidance: [
          {
            refreshAdvice: '144–200 Hz competitive target',
            description: 'Ideal for infantry and close-quarters fights; the buffer stays generous even on High.',
            note: 'Enable Focus HUD to trim visual noise during large pushes.'
          },
          {
            refreshAdvice: 'Sharpness + stability',
            description: 'A strong balance for streaming Conquest and detailed VOD work.',
            note: 'Stay on the High preset to smooth 1% lows without major visual loss.'
          },
          {
            refreshAdvice: '120 Hz-ready 4K',
            description: 'Great for cinematic showcases while keeping the experience reactive.',
            note: 'Use this mode for premium capture or stream production.'
          }
        ],
        improvementTips: [
          'Lower shadows and post-FX first while keeping native resolution.',
          'Enable Focus HUD to hide non-essential modules during massive firefights.',
          'Prefer High instead of Ultra at 1440p/4K to stabilize 1% lows.'
        ],
        advice:
          'CPU Boost option: +5% → ~210/178/240 FPS · +10% → ~212/180/244 FPS · +15% → ~215/183/247 FPS · +20% → ~219/186/251 FPS (requires a Thermal-Premium node).',
        augmentationSuite: {
          modules: [
            'Ticket & Pressure Overlay: sector pressure and capture windows.',
            'Rotation Coach: safe/fast routes and regroup timings.',
            'Spawn Wave Planner: predicts ally/enemy waves.',
            'Vehicle Ops Assistant: repair/exit cycles without intrusive assistance.',
            'Suppression & Visibility: suppression indicators and punish windows.',
            'Ballistics Trainer: ballistic visualization in training.',
            'Killfeed Intelligence: squad wipe synthesis and numeric advantage.'
          ],
          notes: 'Modules calibrated for Conquest/Breakthrough and refreshed after every DICE patch.'
        },
        heroSynergy: [
          { preset: 'Assault', coachingNotes: 'Hot zone priority and anti-vehicle utility reminders.' },
          { preset: 'Recon', coachingNotes: 'Drone coverage and backcap pathing.' },
          { preset: 'Support', coachingNotes: 'Beacon management and repair cycles.' },
          { preset: 'Armor', coachingNotes: 'Safe angles and repair/exit timing.' },
          { preset: 'Air', coachingNotes: 'Nap-of-the-earth routes and countermeasure timers.' },
          { preset: 'Command', coachingNotes: 'Ticket synthesis and objective priorities.' }
        ]
      }
    },
    et: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Battlefieldi natiivne optimeerimine',
          description: 'Conquest/Breakthrough profiilid on häälestatud tasakaalus CPU↔GPU toruga.'
        },
        {
          icon: Zap,
          title: 'Viivitusteta pilveprovision',
          description: 'Battlefield 6 instants käivituvad sekunditega ja vahetavad regiooni automaatselt vastavalt pingile.'
        },
        {
          icon: Shield,
          title: 'Fair-play taktikamoodulid',
          description: 'Eesmärkide/eskadroni overlayd on stream-safe – mälu ei loeta ja abivahendeid ei lisata.'
        },
        {
          icon: Trophy,
          title: 'Sõiduki- ja produktsioonitugi',
          description: 'Sõidukitreening, piletite analüütika ja PulseForge Lobby integreeritud striimitööriistad.'
        }
      ],
      metrics: {
        title: 'Battlefield 6 jõudlus',
        description:
          'PulseForge’i Medium võistlusprofiil: keskmiselt 208 FPS, miinimum 176 FPS ja maksimum 238 FPS 1080p juures. 1440p ja 4K jäävad väga sujuvaks tänu dünaamilisele CPU↔GPU jaotusele.',
        statCards: {
          maxFps: 'Maks FPS (1080p Medium)',
          onePercentLow: 'Min märgatud (1080p Medium)',
          inputLag: 'Keskmine sisendviivitus'
        },
        allocationTitle: 'Domineeriv kitsaskoht (Medium profiil)',
        datacenterTitle: 'PulseForge’i pilvemonitoring',
        usage: {
          cpu: 'CPU koormus',
          gpu: 'GPU koormus',
          ram: 'Mälu kasutus',
          vram: 'VRAM kasutus'
        },
        thermals: {
          cpu: 'Pilve CPU temperatuur',
          gpu: 'GPU temperatuur',
          power: 'Voolutarve'
        },
        stabilityNote: '1080p on CPU-põhine; 1440p/4K presetid kasutavad GPU varu, et hoida FPS kõvera stabiilsena.'
      },
      fpsTable: {
        footnote: 'Sisemised Battlefield 6 benchmark’id (Conquest & Breakthrough, Medium profiil).'
      },
      resolution: {
        title: 'Resolutsiooni muutmine pilves',
        description:
          'Meie mõõtmised näitavad tegelikku FPS varu, kui muudad PulseForge’i paneelist resolutsiooni.',
        windowLabel: 'Mõõdetud aken',
        footnote: 'Väärtused Medium/Ultra presetitel koos overlaydega.',
        avgLabel: 'Keskmine FPS'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} töötab täielikult meie infrastruktuuris: kohene provisioning, adaptiivne marsruut ja latentsus umbes ${latency} ms.`,
        bullets: [
          'Overlayd, presetid ja uuendused rakenduvad serveripoolselt – lokaalset installi pole vaja.',
          'Reaalajas ping/jitter/kadude jälgimine automaatse regiooni vahetusega vajadusel.',
          'Battlefieldi-spetsiifiline profiil Conquest/Breakthrough ja sõidukitele, värskendatakse iga patchi järel.'
        ],
        profileSubtitle: 'Keskmine 1080p Medium mõõtmine',
        lowLabel: 'Min 1080p Medium',
        lowSubtitle: 'Salvestatud alumine aken'
      },
      improvement: {
        adviceTitle: '„CPU Boost” valik (hosti pool)'
      },
      augmentation: {
        description: 'Battlefield 6 taktikaline suite: eesmärgid, rotatsioonid, sõidukid ja piletianalüütika.'
      },
      hero: {
        badge: 'ESKADRONI JA SÕIDUKI PROFIILID',
        title: 'Pühendatud optimisatsioonid',
        description: 'Iga preset katab Battlefieldi rolli (jalavägi, luure, sõidukid, juhtimine).',
        headers: {
          hero: 'Roll',
          overlay: 'Overlay fookus',
          clarity: 'Visuaalne selgus',
          preset: 'Soovitatud preset',
          notes: 'Treeningmärkused'
        },
        fallbackDescription: (game: string) => `Rollipõhised optimeerimised mängule ${game}`
      },
      nativeReasons: {
        description: (game: string) => `Täielikult pilves optimeeritud lahendus mängule ${game} fair-play overlaydega.`
      },
      product: {
        description: 'Pilvepõhine Battlefield 6 instants Conquest/Breakthrough jaoks.',
        longDescription:
          'PulseForge Battlefield 6 ühendab eesmärgiprofiilid, väikse latentsusega videotoru ja võrgujälgimise, et hoida reaktsioon stabiilsena 1080p, 1440p ja 4K juures. Overlayd, sõidukimoodulid ja Focus HUD juhitakse serverist, et jääda vastavusse ranked ja scrim nõuetega.',
        variants: {
          'pulseforge-battlefield6': {
            name: 'PulseForge Battlefield 6 Command',
            usage: 'Battlefield 6 PulseForge instants',
            description: 'Pilvepõhine Battlefield 6 build eesmärkide, sõidukite ja premium-striimi jaoks.',
            use_cases: [
              'Conquest & Breakthrough võistlused',
              'Eskadroni coaching ja piletianalüütika',
              'Battlefieldi striimiproduktsioon',
              'Privaat-scrimid PulseForge Lobbyga',
              'Sõiduki sandbox ja eesmärgiharjutused'
            ],
            features: [
              'Modulaarsed overlayd eesmärkide/eskadroni jaoks',
              'Post-matši piletianalüütika ja ajajoon',
              'Rotatsiooni ja spawn-wave’i coaching',
              'PulseForge Lobby sõidukitreeningu suite',
              'Kalibreeritud Battlefieldi audioprofiilid',
              'Patchidega sünkroonitud uuendused',
              'PulseForge Lobby sandboxi tugi'
            ],
            featureHighlights: [
              'Ranked/kõik serverid – 100% fair-play (ekraani lugemine, killfeed, audio, ilma mälu süstita)',
              'PulseForge’i privaatlobbyd – sünkroonitud buildid kõigile mängijatele (kosmeetika ja edasijõudnud treening)'
            ],
            featureGroups: [
              {
                title: 'Ranked / fair-play (live)',
                items: [
                  'Ticket & Pressure Overlay: sektori surve, vallutuse aknad ja piletimärguanded.',
                  'Rotation Coach: turvalised/kiired marsruudid, backcap’i võimalused ja kogunemise ajastus.',
                  'Spawn Wave Planner: liitlaste/vastaste lainete hinnang ja beacon/squad/base optimeerimine.',
                  'Vehicle Ops Assistant: remondi/väljumise tsüklid ja turvalised nurgad (ilma aim-abita).',
                  'Suppression & Visibility: suppressiooni indikaatorid ja karistuse aknad.',
                  'Killfeed Intelligence: eskadroni wipe’i kokkuvõte ja arvulise eelise tuvastus.',
                  'Focus HUD: peidab suurtes võitlustes ebaolulised moodulid.'
                ]
              },
              {
                title: 'Reaktsioon ja katvus',
                items: [
                  'Overlay värskendus kuni 144 Hz Medium/High profiilidel.',
                  'Faaditeadlikud moodulid: eesmärgid, eskadron, sõidukid.',
                  'Keskmine reaktsiooniaeg ~45 ms nähtavate sündmuste puhul.',
                  'Järjepidev võrgujälgimine automaatse regiooni vahetusega.'
                ]
              },
              {
                title: 'PulseForge Lobby',
                description: 'Treeninguvõimalused, kui kõik kasutavad PulseForge’i buildi',
                items: [
                  'Jagatud kosmeetika: eskadroni teemad, tracer’id ja PulseForge’i kill-bannerid.',
                  'Vehicle Drill Suite: ajastatud tank/IFV/heli/jeti rajad, soomusduellid ja koordineeritud remondiharjutused.',
                  'Objective Scenario Runner: skriptitud Conquest/Breakthrough harjutused capture/retake/pileti tabelitega.',
                  'Stratboard Live: kaardiga seotud taktikalaud treeneri/liidri annotatsioonidega.',
                  'Draft & Role Rules: lukustab Lead/Anchor/Recon/Support rollid ja kehtestab loadout’id.',
                  'Caster Mode: laiendatud HUD (eesmärgid, sõidukid, piletid), kiired kordused ja võtmesündmuste markerid.'
                ]
              },
              {
                title: 'Miks valida meie natiivne Battlefield 6 build?',
                items: [
                  'Natiivne integratsioon sünkroonis iga DICE uuendusega.',
                  'Fair-play ja stream-safe overlayd, mis vastavad ranked ja turniiri nõuetele.',
                  'Kalibreeritud jõudlus: 208/186/154 FPS keskmiselt (1080p/1440p/4K).',
                  'Loominguline tugi: scrimid, VOD-analüütika ja PulseForge Lobby eskadroni teemad.'
                ]
              }
            ],
            implementationNotes: [
              'Avalikes/ranked mängudes tuginevad overlayd ainult nähtavale HUDile/helile/killfeedile. Mälulugemist ega süsti pole.',
              'Jagatud kosmeetika, sõidukisandboxid ja live-stratboardid on piiratud PulseForge’i lobbydega, kus on ühine build.',
              'Overlayd on opt-in ja peidavad end suure võitluse ajal, et vältida visuaalset ülekoormust.'
            ],
            target_audience: 'Battlefieldi eskadronid, sõidukitreenerid, loojad',
            highlight: 'Conquesti ja sõidukite fokusseeritud suite',
            protection: 'Stream-safe fair-play',
            updates: 'Battlefieldi patchidega sünkroonitud uuendused'
          }
        }
      },
      technical: {
        fpsByResolution: [
          { playability: 'Väga sujuv', bottleneck: 'CPU (≈ 88%)' },
          { playability: 'Väga sujuv', bottleneck: 'GPU (≈ 61%)' },
          { playability: 'Väga sujuv', bottleneck: 'GPU (≈ 76%)' }
        ],
        resolutionGuidance: [
          {
            refreshAdvice: '144–200 Hz võistlussiht',
            description: 'Ideaalne jalaväele ja lähivõitlusele; puhver jääb heldeks isegi High presetil.',
            note: 'Aktiveeri Focus HUD, et suurte rünnakute ajal visuaalset müra vähendada.'
          },
          {
            refreshAdvice: 'Teravus + stabiilsus',
            description: 'Tugev tasakaal Conquesti striimimiseks ja detailseks VOD tööks.',
            note: 'Kasuta High presetit, et 1% madalaid ilma suure visuaalkaota siluda.'
          },
          {
            refreshAdvice: '120 Hz valmis 4K',
            description: 'Sobib hästi kinemaatilisteks esitluste ja samas säilitab reaktsioonivõime.',
            note: 'Kasuta seda režiimi premium-salvestuseks või striimiproduktsiooniks.'
          }
        ],
        improvementTips: [
          'Vähenda esmalt varje ja post-FX’e, jättes resolutsiooni natiivseks.',
          'Lülita sisse Focus HUD, et peita massiivsetes lahingutes ebaolulised moodulid.',
          'Eelista 1440p/4K puhul High presetit Ultra asemel, et stabiliseerida 1% madalaid.'
        ],
        advice:
          '„CPU Boost” valik: +5% → ~210/178/240 FPS · +10% → ~212/180/244 FPS · +15% → ~215/183/247 FPS · +20% → ~219/186/251 FPS (vajab Thermal-Premium sõlme).',
        augmentationSuite: {
          modules: [
            'Ticket & Pressure Overlay: sektori surve ja vallutuse aknad.',
            'Rotation Coach: turvalised/kiired teed ja kogunemise ajastus.',
            'Spawn Wave Planner: ennustab liitlaste/vastaste laineid.',
            'Vehicle Ops Assistant: remondi/väljumise tsüklid ilma pealetükkiva abita.',
            'Suppression & Visibility: suppressiooni indikaatorid ja karistusaknad.',
            'Ballistics Trainer: ballistika visualiseerimine treeningus.',
            'Killfeed Intelligence: eskadroni wipe’i kokkuvõte ja arvuline eelis.'
          ],
          notes: 'Moodulid on häälestatud Conquest/Breakthrough jaoks ja värskendatakse iga DICE patchiga.'
        },
        heroSynergy: [
          { preset: 'Assault', coachingNotes: 'Kuumade tsoonide prioriteet ja anti-sõiduki utiliidi meeldetuletused.' },
          { preset: 'Recon', coachingNotes: 'Droonikatvus ja backcap’i trajektoorid.' },
          { preset: 'Support', coachingNotes: 'Beaconite haldus ja remonditsüklid.' },
          { preset: 'Armor', coachingNotes: 'Turvalised nurgad ja remondi/väljumise ajastus.' },
          { preset: 'Air', coachingNotes: 'Nap-of-the-earth marsruudid ja vastumeetmete taimerid.' },
          { preset: 'Command', coachingNotes: 'Piletite kokkuvõte ja eesmärkide prioriteedid.' }
        ]

      }
    }
  },
  'gaming-destiny2': {
    fr: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Profil Destiny 2 natif',
          description: 'Stabilité 1% low et pipeline faible latence calibrés PvE/PvP.'
        },
        {
          icon: Zap,
          title: 'Provisioning cloud instantané',
          description: 'Instances Destiny prêtes en quelques secondes avec bascule région automatique selon le ping.'
        },
        {
          icon: Shield,
          title: 'Suite fair-play situationnelle',
          description: 'Overlays PvE/PvP stream-safe, aucune injection ni assistance intrusive.'
        },
        {
          icon: Trophy,
          title: 'Support raids & Trials',
          description: 'Sandbox PulseForge Lobby, analytics DPS et assistance macro Supers.'
        }
      ],
      metrics: {
        title: 'Performances calibrées pour Destiny 2',
        description:
          'Profil PulseForge Medium compétitif : 402 FPS de moyenne, min observé à 342 FPS et pic à 462 FPS en 1080p. Les profils 1440p et 4K restent très fluides grâce à l’allocation CPU↔GPU et au pipeline faible latence.',
        statCards: {
          maxFps: 'FPS maximum observé (1080p Medium)',
          onePercentLow: 'Min observé (proxy 1% low, 1080p Medium)',
          inputLag: 'Input lag moyen'
        },
        allocationTitle: 'Bottleneck dominant (profil Medium)',
        datacenterTitle: 'Monitoring cloud PulseForge',
        usage: {
          cpu: 'Charge CPU',
          gpu: 'Charge GPU',
          ram: 'Mémoire utilisée',
          vram: 'VRAM utilisée'
        },
        thermals: {
          cpu: 'Température CPU cloud',
          gpu: 'Température GPU',
          power: 'Consommation électrique'
        },
        stabilityNote:
          'Destiny 2 reste CPU-bound en 1080p/1440p ; nos profils maintiennent la réserve nécessaire tout en stabilisant l’input-lag en 4K.'
      },
      fpsTable: {
        footnote: 'Benchmarks internes Destiny 2 (profil Medium compétitif, Crucible/Trials et PvE endgame).'
      },
      resolution: {
        title: 'Comment ajuster la résolution côté cloud',
        description:
          'Nos mesures internes traduisent la marge FPS réelle lorsque vous modifiez la définition depuis le panneau PulseForge.',
        windowLabel: 'Fenêtre relevée',
        footnote: 'Valeurs relevées sur presets Medium/Ultra Destiny 2 avec overlays actifs.',
        avgLabel: 'FPS moyen'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} tourne entièrement sur notre infrastructure : provisioning instantané, routage adaptatif et latence stabilisée à ${latency} ms.`,
        bullets: [
          'Overlays, presets et mises à jour appliqués côté serveur — aucune installation locale.',
          'Bascule 1080p/1440p/4K instantanée tout en respectant la fenêtre FPS mesurée.',
          'Monitoring ping/jitter/pertes avec bascule automatique de région pour Trials ou raids critiques.'
        ],
        profileSubtitle: 'Moyenne mesurée en 1080p Medium',
        lowLabel: 'Min observé 1080p Medium',
        lowSubtitle: 'Fenêtre basse relevée'
      },
      improvement: { adviceTitle: 'Option « CPU Boost » (côté hôte)' },
      augmentation: {
        description: 'Modules situationnels PvE/PvP pour raids, Trials et sandbox stream-safe.'
      },
      hero: {
        badge: 'PROFILS ARME / RÔLE',
        title: 'Optimisations dédiées',
        description: 'Chaque preset couvre un archétype Destiny 2 (AR, SMG, LMG, Sniper, Shotgun, Support).',
        headers: {
          hero: 'Rôle / Arme',
          overlay: 'Focus overlay',
          clarity: 'Clarté visuelle',
          preset: 'Preset conseillé',
          notes: 'Notes coaching'
        },
        fallbackDescription: (game: string) => `Optimisations par archétype pour ${game}`
      },
      nativeReasons: {
        description: (game: string) => `Optimisé de bout en bout pour ${game} en PvE/PvP, overlays stream-safe et support raid.`
      },
      product: {
        description: 'Instance Destiny 2 cloud native calibrée Trials/Raids.',
        longDescription:
          'PulseForge Destiny 2 associe stabilité 1% low et pipeline vidéo faible latence pour Crucible, Trials et PvE endgame. Toutes les assistances (Focus HUD, timeline encounters, economy Supers) sont orchestrées côté serveur pour rester conformes aux guidelines Bungie.',
        variants: {
          'pulseforge-destiny2': {
            name: 'PulseForge Destiny 2 Vanguard',
            usage: 'Instance Destiny 2 PulseForge',
            description: 'Build cloud Destiny 2 orienté PvE/PvP avec overlays situationnels et support raids.',
            use_cases: [
              'Trials of Osiris et PvP compétitif',
              'Raids, donjons et Nuit Noire GM',
              'Scrims privés PulseForge Lobby',
              'Production stream et VOD analytics',
              'Entraînement DPS et sandbox mécaniques'
            ],
            features: [
              'Overlays modulaires PvE/PvP stream-safe',
              'Analyse post-match & export (timeline, DPS, deaths)',
              'Coach macro Supers, economy et rotations',
              'Thèmes d’escouade PulseForge Lobby',
              'Intégration multi-input clavier/souris/manette',
              'Mises à jour synchronisées patch Destiny 2',
              'Compatibilité PulseForge Lobby sandbox'
            ],
            featureHighlights: [
              'Public/Ranked – overlays purement visuels (HUD, audio, killfeed) sans injection mémoire',
              'PulseForge Lobby – cosmétiques partagés, sandbox DPS et stratboard live pour tous les joueurs PulseForge'
            ],
            featureGroups: [
              {
                title: 'Modules tactiques PvE',
                items: [
                  'Encounter Timeline : jalons mécaniques, phases DPS et safe spots stream-safe.',
                  'Champions & Mods Planner : rappel champions/mods requis par escouade.',
                  'Super & Buff Orchestrator : cycle Supers et buffs/débuffs visibles pour éviter l’overlap.',
                  'Ammo Economy : prompts heavy/special avant les phases DPS critiques.',
                  'DPS Estimator : lecture relative du DPS de phase basée sur les ticks affichés.',
                  'Survival Cues : alertes résilience/recovery et fenêtres sans rez.'
                ]
              },
              {
                title: 'Modules tactiques PvP',
                items: [
                  'Zone & Pressure Map : pression par zone et lecture du man-advantage via killfeed.',
                  'Super Economy Read : estimation charge Supers visible pour rounds clés.',
                  'Peek Discipline : repères head-height, tempo jiggle/swing et prompts anti ego-peek.',
                  'Fight Timeline : suivi trades, alerte no-trade 3 s et rappel stabiliser quand l’équipe mène.',
                  'Audio Spatial Director : priorisation pas/portes/reloads, ducking automatique du bruit non critique.'
                ]
              },
              {
                title: 'Réactivité & couverture',
                items: [
                  'Overlay refresh jusqu’à 144 Hz.',
                  'Modules actifs selon mode PvE/PvP détecté.',
                  'Temps de réaction moyen ~40–45 ms sur événements visibles.',
                  'Monitoring réseau avec bascule automatique de région.'
                ]
              },
              {
                title: 'PulseForge Lobby',
                description: 'Options de jeu & d’entraînement (tous joueurs sur build PulseForge)',
                items: [
                  'Raid Lab : salles mécaniques avec timelines partageables et scoring d’exécution.',
                  'DPS Check Lab : mannequins et cibles mobiles avec scoreboard DPS de phase.',
                  'Movement & Ability Sandbox : parcours chronométrés et drills capacité avec reset rapide.',
                  'Ghost-Run & Pathing : fantômes de vos meilleures exécutions et replays synchronisés.',
                  'Cosmétiques partagés : bannières d’escouade, finisher FX, kill-banners PulseForge.',
                  'Caster Mode : HUD élargi, replays instantanés 8 s et export highlights.'
                ]
              },
              {
                title: 'Pourquoi choisir notre build natif Destiny 2 ?',
                items: [
                  'Intégration native synchronisée après chaque patch Bungie.',
                  'Suite fair-play stream-safe pour PvE/PvP sans injection ni assistance intrusive.',
                  'Performances calibrées : 402/356/246 FPS moyens avec marge sur chaque preset.',
                  'Support créatif : scrims, analytics VOD et thèmes d’escouade PulseForge Lobby.'
                ]
              }
            ],
            implementationNotes: [
              'En parties publiques/ranked, les overlays reposent uniquement sur HUD, audio et killfeed visibles.',
              'Cosmétiques, sandbox DPS et stratboards live sont réservés aux lobbies PulseForge avec build partagé.',
              'Overlays opt-in et auto-masquage lors des phases à forte intensité visuelle.'
            ],
            target_audience: 'Escouades Destiny, raid leads, créateurs',
            highlight: 'Stabilité 1% low pour PvE/PvP intensif',
            protection: 'Fair-play stream-safe certifié',
            updates: 'Mises à jour synchronisées patch Destiny 2'
          }
        }
      },
      technical: {
        fpsByResolution: [
          { playability: 'Très fluide', bottleneck: 'CPU (≈76%)' },
          { playability: 'Très fluide', bottleneck: 'CPU (≈64%)' },
          { playability: 'Très fluide', bottleneck: 'GPU (≈41%)' }
        ],
        resolutionGuidance: [
          {
            refreshAdvice: 'Cible 240–360 Hz',
            description: 'Le profil 1080p Medium maintient ~402 FPS avec Ultra à ~342 FPS pour Trials et Crucible.',
            note: 'Activez Focus HUD pour lisser les phases clutch.'
          },
          {
            refreshAdvice: 'Netteté + fréquence 240 Hz',
            description: '1440p conserve une fenêtre 302–410 FPS, idéale pour streaming et VOD détaillées.',
            note: 'Conservez le preset High pour stabiliser les 1% low.'
          },
          {
            refreshAdvice: '4K 200+ Hz jouable',
            description: 'Même en 4K Medium (~246 FPS), l’expérience reste très fluide pour les raids showcase.',
            note: 'Ultra (~206 FPS) convient aux sessions stream premium.'
          }
        ],
        improvementTips: [
          'Utilisez le preset Esports/Low pour Trials/Compétitif, Medium pour le PvE endgame.',
          'Laissez PulseForge piloter le cap FPS et l’anti-tear ; évitez les limites externes.',
          'Activez Focus HUD pour masquer les modules non essentiels pendant les fights.',
          'En 4K, privilégiez High plutôt qu’Ultra pour conserver la régularité des combats.'
        ],
        advice:
          'Option « CPU Boost » : +5 % → ~410/348/470 FPS · +10 % → ~418/355/478 FPS · +15 % → ~428/364/490 FPS · +20 % → ~440/374/505 FPS (nœud Thermal-Premium requis).',
        augmentationSuite: {
          modules: [
            'Encounter Timeline : jalons mécaniques, phases DPS et safe spots stream-safe.',
            'Champions & Mods Planner : rappel champions/mods requis par escouade.',
            'Super & Buff Orchestrator : cycle Supers et buffs/débuffs visibles.',
            'Ammo Economy : suivi heavy/special et fenêtres probables de drop.',
            'DPS Estimator : lecture relative du DPS de phase basée sur les ticks affichés.',
            'Survival Cues : alertes résilience/recovery et fenêtres sans rez.',
            'Zone & Pressure Map : pression par zone et man-advantage via killfeed.',
            'Super Economy Read : estimation charge Supers visible pour rounds clés.',
            'Peek Discipline : repères head-height, tempo jiggle/swing et prompts anti ego-peek.',
            'Fight Timeline : suivi trades et alerte no-trade 3 s.'
          ],
          notes: 'Modules PvE/PvP rafraîchis après chaque patch Destiny 2.'
        },
        heroSynergy: [
          { preset: 'Balance', coachingNotes: 'Angles d’ouverture sécurisés et rappels anti ego-peek.' },
          { preset: 'Esports', coachingNotes: 'Timing d’entrée, engage windows et routes d’évasion courtes.' },
          { preset: 'Stability', coachingNotes: 'Contrôle des lanes longues et discipline reload.' },
          { preset: 'Sniper Focus', coachingNotes: 'Pré-aim hauteur tête et gestion du glint.' },
          { preset: 'Indoor', coachingNotes: 'Consolidation des pushes rapprochés et duo-timings.' },
          { preset: 'Macro', coachingNotes: 'Macro-calls, economy Supers et alertes rotations.' }
        ]
      }
    },
    en: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Native Destiny 2 profile',
          description: 'Stable 1% lows and low-latency pipeline tuned for PvE and PvP.'
        },
        {
          icon: Zap,
          title: 'Instant cloud provisioning',
          description: 'Destiny instances spin up in seconds with automatic region failover based on ping.'
        },
        {
          icon: Shield,
          title: 'Fair-play situational suite',
          description: 'PvE/PvP overlays stay stream-safe with zero memory injection or intrusive assists.'
        },
        {
          icon: Trophy,
          title: 'Raid & Trials support',
          description: 'PulseForge Lobby sandbox, DPS analytics, and macro Super guidance.'
        }
      ],
      metrics: {
        title: 'Calibrated performance for Destiny 2',
        description:
          'PulseForge competitive Medium profile: 402 average FPS, 342 FPS observed low, and 462 FPS peak at 1080p. 1440p and 4K remain very smooth thanks to CPU↔GPU allocation and our low-latency pipeline.',
        statCards: {
          maxFps: 'Max observed FPS (1080p Medium)',
          onePercentLow: 'Min observed (1% low proxy, 1080p Medium)',
          inputLag: 'Average input lag'
        },
        allocationTitle: 'Dominant bottleneck (Medium profile)',
        datacenterTitle: 'PulseForge cloud monitoring',
        usage: {
          cpu: 'CPU load',
          gpu: 'GPU load',
          ram: 'Memory used',
          vram: 'VRAM used'
        },
        thermals: {
          cpu: 'Cloud CPU temperature',
          gpu: 'GPU temperature',
          power: 'Power draw'
        },
        stabilityNote:
          'Destiny 2 is CPU-bound at 1080p/1440p; our profiles preserve headroom while keeping input lag steady at 4K.'
      },
      fpsTable: {
        footnote: 'Internal Destiny 2 benchmarks (competitive Medium profile across Crucible/Trials and endgame PvE).'
      },
      resolution: {
        title: 'How to adjust resolution from the cloud',
        description:
          'Our internal measurements show the real FPS buffer when you change resolution via the PulseForge panel.',
        windowLabel: 'Measured window',
        footnote: 'Values captured on Destiny 2 Medium/Ultra presets with overlays enabled.',
        avgLabel: 'Average FPS'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} runs entirely on our infrastructure: instant provisioning, adaptive routing, and latency held around ${latency} ms.`,
        bullets: [
          'Server-side overlays, presets, and updates—nothing to install locally.',
          'Instant 1080p/1440p/4K switching while respecting the measured FPS window.',
          'Live ping/jitter/loss monitoring with automatic region failover for critical Trials or raid sessions.'
        ],
        profileSubtitle: 'Average measured at 1080p Medium',
        lowLabel: 'Min observed 1080p Medium',
        lowSubtitle: 'Recorded low window'
      },
      improvement: { adviceTitle: 'CPU Boost option (host side)' },
      augmentation: {
        description: 'Situational PvE/PvP modules covering raids, Trials, and stream-safe sandbox drills.'
      },
      hero: {
        badge: 'WEAPON / ROLE PROFILES',
        title: 'Dedicated optimizations',
        description: 'Each preset covers a Destiny 2 archetype (AR, SMG, LMG, Sniper, Shotgun, Support).',
        headers: {
          hero: 'Role / weapon',
          overlay: 'Overlay focus',
          clarity: 'Visual clarity',
          preset: 'Recommended preset',
          notes: 'Coaching notes'
        },
        fallbackDescription: (game: string) => `Archetype-specific optimizations for ${game}`
      },
      nativeReasons: {
        description: (game: string) => `Optimized end to end for ${game} PvE/PvP with stream-safe overlays and raid support.`
      },
      product: {
        description: 'Cloud-native Destiny 2 instance tuned for Trials and raid stability.',
        longDescription:
          'PulseForge Destiny 2 balances 1% low stability with a low-latency video pipeline for Crucible, Trials, and endgame PvE. Focus HUD, encounter timelines, and Super economy coaching are orchestrated server-side to respect Bungie’s guidelines.',
        variants: {
          'pulseforge-destiny2': {
            name: 'PulseForge Destiny 2 Vanguard',
            usage: 'Destiny 2 PulseForge instance',
            description: 'Cloud Destiny 2 build focused on PvE/PvP overlays and raid-ready support.',
            use_cases: [
              'Trials of Osiris and competitive PvP',
              'Raids, dungeons, and Grandmaster Nightfalls',
              'Private scrims with PulseForge Lobby',
              'Stream production and VOD analytics',
              'DPS training and encounter sandbox'
            ],
            features: [
              'Stream-safe PvE/PvP modular overlays',
              'Post-match analysis & exports (timeline, DPS, deaths)',
              'Macro coaching for Supers, economy, and rotations',
              'PulseForge Lobby squad theming',
              'Multi-input integration (keyboard/mouse, controller)',
              'Patch-synced Destiny 2 updates',
              'PulseForge Lobby sandbox compatibility'
            ],
            featureHighlights: [
              'Public/ranked – purely visual overlays (HUD, audio, killfeed) with no memory injection',
              'PulseForge Lobby – shared cosmetics, DPS sandbox, and live stratboard for every PulseForge player'
            ],
            featureGroups: [
              {
                title: 'PvE tactical modules',
                items: [
                  'Encounter Timeline: mechanical milestones, DPS windows, and safe spots.',
                  'Champions & Mods Planner: reminders for champion types and required anti-barrier/overload mods.',
                  'Super & Buff Orchestrator: visible Super and buff/debuff cycles to avoid overlap.',
                  'Ammo Economy: heavy/special prompts before critical DPS phases.',
                  'DPS Estimator: phase DPS read based on visible ticks.',
                  'Survival Cues: resilience/recovery prompts and no-rez windows.'
                ]
              },
              {
                title: 'PvP tactical modules',
                items: [
                  'Zone & Pressure Map: area pressure and man-advantage from the killfeed.',
                  'Super Economy Read: visible Super charge estimation for clutch rounds.',
                  'Peek Discipline: head-height markers, jiggle/swing pacing, and anti ego-peek prompts.',
                  'Fight Timeline: trade tracking, 3-second no-trade alert, and stabilize reminders.',
                  'Audio Spatial Director: footsteps/doors/reload prioritization with automatic ducking.'
                ]
              },
              {
                title: 'Reactivity & coverage',
                items: [
                  'Overlay refresh up to 144 Hz.',
                  'Modules adapt automatically to PvE or PvP contexts.',
                  'Average reaction time ~40–45 ms on visible events.',
                  'Network monitoring with automatic region failover.'
                ]
              },
              {
                title: 'PulseForge Lobby',
                description: 'Training options when everyone runs the PulseForge build',
                items: [
                  'Raid Lab: mechanic rooms with shareable timelines and execution scoring.',
                  'DPS Check Lab: dummies and moving targets with phase DPS scoreboards.',
                  'Movement & Ability Sandbox: timed routes and ability drills with quick resets.',
                  'Ghost-Run & Pathing: ghost replays of best clears and synchronized playback.',
                  'Shared cosmetics: squad banners, finisher FX, PulseForge kill banners.',
                  'Caster Mode: expanded HUD, 8-second instant replays, and highlight exports.'
                ]
              },
              {
                title: 'Why choose our native Destiny 2 build?',
                items: [
                  'Native integration synchronized after every Bungie patch.',
                  'Stream-safe fair-play overlays for PvE/PvP without intrusive assists.',
                  'Calibrated performance: 402/356/246 average FPS across 1080p/1440p/4K.',
                  'Creative support: scrims, VOD analytics, and PulseForge Lobby squad theming.'
                ]
              }
            ],
            implementationNotes: [
              'In public/ranked games overlays rely solely on visible HUD/audio/killfeed data.',
              'Cosmetics, DPS sandbox, and live stratboards stay limited to PulseForge lobbies with a shared build.',
              'Overlays are opt-in and auto-hide during high-visibility phases.'
            ],
            target_audience: 'Destiny fireteams, raid leads, creators',
            highlight: 'Stable 1% lows for intense PvE/PvP',
            protection: 'Certified stream-safe fair play',
            updates: 'Destiny 2 patch-synced updates'
          }
        }
      },
      technical: {
        fpsByResolution: [
          { playability: 'Very smooth', bottleneck: 'CPU (≈76%)' },
          { playability: 'Very smooth', bottleneck: 'CPU (≈64%)' },
          { playability: 'Very smooth', bottleneck: 'GPU (≈41%)' }
        ],
        resolutionGuidance: [
          {
            refreshAdvice: '240–360 Hz competitive target',
            description: 'The 1080p Medium profile holds ~402 FPS with Ultra near 342 FPS for Trials and Crucible.',
            note: 'Enable Focus HUD to smooth clutch phases.'
          },
          {
            refreshAdvice: '240 Hz sharpness balance',
            description: '1440p maintains a 302–410 FPS window, perfect for detailed streaming and VOD work.',
            note: 'Stay on the High preset to stabilize 1% lows.'
          },
          {
            refreshAdvice: 'Playable 4K above 200 Hz',
            description: '4K Medium (~246 FPS) stays very smooth for raid showcases; Ultra (~206 FPS) suits premium streams.',
            note: 'Use this mode for broadcast-ready captures.'
          }
        ],
        improvementTips: [
          'Use the Esports/Low preset for Trials/competitive play and Medium for endgame PvE.',
          'Let PulseForge control frame capping and anti-tear; avoid external limits.',
          'Enable Focus HUD to hide non-essential modules mid-fight.',
          'At 4K, prefer High over Ultra to keep combat pacing consistent.'
        ],
        advice:
          'CPU Boost option: +5% → ~410/348/470 FPS · +10% → ~418/355/478 FPS · +15% → ~428/364/490 FPS · +20% → ~440/374/505 FPS (requires a Thermal-Premium node).',
        augmentationSuite: {
          modules: [
            'Encounter Timeline: mechanical milestones, DPS windows, and safe spots.',
            'Champions & Mods Planner: champion/mod reminders for the fireteam.',
            'Super & Buff Orchestrator: visible Super and buff/debuff cycles.',
            'Ammo Economy: heavy/special tracking with drop windows.',
            'DPS Estimator: phase DPS read based on visible ticks.',
            'Survival Cues: resilience/recovery prompts and no-rez windows.',
            'Zone & Pressure Map: zone pressure and numeric advantage from the killfeed.',
            'Super Economy Read: visible Super charge estimation.',
            'Peek Discipline: head-height markers and anti ego-peek prompts.',
            'Fight Timeline: trade tracking with a 3-second no-trade alert.'
          ],
          notes: 'PvE/PvP modules refreshed after every Destiny 2 patch.'
        },
        heroSynergy: [
          { preset: 'Balance', coachingNotes: 'Secure opening angles with anti ego-peek reminders.' },
          { preset: 'Esports', coachingNotes: 'Engage timing, windows, and short escape routes.' },
          { preset: 'Stability', coachingNotes: 'Long lane control and reload discipline.' },
          { preset: 'Sniper Focus', coachingNotes: 'Head-height pre-aim and glint management.' },
          { preset: 'Indoor', coachingNotes: 'Structured close-range pushes and duo timings.' },
          { preset: 'Macro', coachingNotes: 'Macro calls, Super economy, and rotation alerts.' }
        ]
      }
    },
    et: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Destiny 2 natiivne profiil',
          description: 'Stabiilsed 1% low väärtused ja madala latentsusega toru PvE/PvP jaoks.'
        },
        {
          icon: Zap,
          title: 'Kohene pilveprovision',
          description: 'Destiny instantsid käivituvad sekunditega ja vahetavad regiooni automaatselt vastavalt pingile.'
        },
        {
          icon: Shield,
          title: 'Fair-play situatsiooniline suite',
          description: 'PvE/PvP overlayd on stream-safe – mälu ei loeta ja abivahendeid ei lisata.'
        },
        {
          icon: Trophy,
          title: 'Raidide ja Trials tugi',
          description: 'PulseForge Lobby sandbox, DPS analüütika ja makro-Superite juhendamine.'
        }
      ],
      metrics: {
        title: 'Destiny 2 jõudlus',
        description:
          'PulseForge’i Medium võistlusprofiil: keskmiselt 402 FPS, miinimum 342 FPS ja maksimum 462 FPS 1080p juures. 1440p ja 4K püsivad väga sujuvana tänu CPU↔GPU jaotusele ja madala latentsusega torule.',
        statCards: {
          maxFps: 'Maks FPS (1080p Medium)',
          onePercentLow: 'Min täheldatud (1% low proxy, 1080p Medium)',
          inputLag: 'Keskmine sisendviivitus'
        },
        allocationTitle: 'Domineeriv kitsaskoht (Medium profiil)',
        datacenterTitle: 'PulseForge’i pilvemonitoring',
        usage: {
          cpu: 'CPU koormus',
          gpu: 'GPU koormus',
          ram: 'Mälu kasutus',
          vram: 'VRAM kasutus'
        },
        thermals: {
          cpu: 'Pilve CPU temperatuur',
          gpu: 'GPU temperatuur',
          power: 'Võimsustarve'
        },
        stabilityNote:
          'Destiny 2 on 1080p/1440p juures CPU-bound; meie profiilid hoiavad varu ja sisendviivituse stabiilsena isegi 4K-s.'
      },
      fpsTable: {
        footnote: 'Sisemised Destiny 2 benchmarkid (Medium profiil Crucible/Trials ja PvE endgame stsenaariumites).'
      },
      resolution: {
        title: 'Kuidas pilves resolutsiooni muuta',
        description:
          'Sisemised mõõtmised näitavad tegelikku FPS varu, kui muudate PulseForge’i paneelist resolutsiooni.',
        windowLabel: 'Mõõdetud aken',
        footnote: 'Väärtused mõõdetud Destiny 2 Medium/Ultra presetidel koos overlaydega.',
        avgLabel: 'Keskmine FPS'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} töötab täielikult meie infrastruktuuris: kohene provisioning, adaptiivne marsruut ja latentsus umbes ${latency} ms.`,
        bullets: [
          'Overlayd, presetid ja uuendused rakenduvad serveripoolselt – lokaalset installi pole vaja.',
          'Vaheta 1080p/1440p/4K koheselt, säilitades mõõdetud FPS akna.',
          'Elav ping/jitter/kao jälgimine automaatse regiooni vahetusega Trials’i või raidide kriitilistel hetkedel.'
        ],
        profileSubtitle: 'Keskmine 1080p Medium mõõtmine',
        lowLabel: 'Min 1080p Medium',
        lowSubtitle: 'Salvestatud madalaken'
      },
      improvement: { adviceTitle: '„CPU Boost” valik (hosti pool)' },
      augmentation: {
        description: 'Situatsioonilised PvE/PvP moodulid raidide, Trials’i ja stream-safe sandboxi jaoks.'
      },
      hero: {
        badge: 'RELV / ROLL PROFIILID',
        title: 'Pühendatud optimeerimised',
        description: 'Iga preset katab Destiny 2 arhetüübi (AR, SMG, LMG, snaiper, shotgun, tugi).',
        headers: {
          hero: 'Roll / relv',
          overlay: 'Overlay fookus',
          clarity: 'Visuaalne selgus',
          preset: 'Soovitatud preset',
          notes: 'Coaching märkused'
        },
        fallbackDescription: (game: string) => `Arhetüübi optimeerimised mängule ${game}`
      },
      nativeReasons: {
        description: (game: string) => `Täielikult optimeeritud lahendus mängule ${game} PvE/PvP jaoks stream-safe overlaydega.`
      },
      product: {
        description: 'Pilvepõhine Destiny 2 instants Trials’i ja raidi stabiilsuseks.',
        longDescription:
          'PulseForge Destiny 2 ühendab stabiilsed 1% low väärtused ja madala latentsusega videotoru Crucible’i, Trials’i ja PvE endgame’i jaoks. Focus HUD, encounter timeline’id ja Superite majandus juhitakse serveripoolselt, järgides Bungie juhiseid.',
        variants: {
          'pulseforge-destiny2': {
            name: 'PulseForge Destiny 2 Vanguard',
            usage: 'Destiny 2 PulseForge instants',
            description: 'Pilvepõhine Destiny 2 build PvE/PvP overlayde ja raidivalmiduse jaoks.',
            use_cases: [
              'Trials of Osiris ja konkurentsitihe PvP',
              'Raidid, dungeonid ja Grandmaster Nightfallid',
              'Privaat-scrimid PulseForge Lobbyga',
              'Striimitootmine ja VOD analüütika',
              'DPS treening ja encounter sandbox'
            ],
            features: [
              'Stream-safe PvE/PvP modulaarsed overlayd',
              'Post-matši analüüs ja eksport (timeline, DPS, deaths)',
              'Makro coaching Superite, majanduse ja rotatsioonide jaoks',
              'PulseForge Lobby eskadroni teemad',
              'Multi-input integratsioon (klaviatuur/hiir, kontroller)',
              'Patchidega sünkroonitud Destiny 2 uuendused',
              'PulseForge Lobby sandboxi tugi'
            ],
            featureHighlights: [
              'Avalik/ranked – puhtalt visuaalsed overlayd (HUD, audio, killfeed), mälu ei loeta',
              'PulseForge Lobby – jagatud kosmeetika, DPS sandbox ja live stratboard kõigile PulseForge’i mängijatele'
            ],
            featureGroups: [
              {
                title: 'PvE taktikamoodulid',
                items: [
                  'Encounter Timeline: mehaanika verstapostid, DPS aknad ja safe spotid.',
                  'Champions & Mods Planner: meeldetuletused champion-tüüpidest ja vajaminevatest modidest.',
                  'Super & Buff Orchestrator: nähtavad Superite ja buff/debuff’i tsüklid ülekattest hoidumiseks.',
                  'Ammo Economy: heavy/special meeldetuletused enne DPS faase.',
                  'DPS Estimator: faasi DPS lugemine nähtavate tickide põhjal.',
                  'Survival Cues: vastupidavuse/taastumise vihjed ja no-rez aknad.'
                ]
              },
              {
                title: 'PvP taktikamoodulid',
                items: [
                  'Zone & Pressure Map: surve tsoonides ja killfeedist loetav arvuline eelis.',
                  'Super Economy Read: nähtav Superi laetuse hinnang otsustavate roundide jaoks.',
                  'Peek Discipline: pea kõrguse märgised, jiggle/swing tempo ja anti ego-peek vihjed.',
                  'Fight Timeline: trade’i jälgimine, 3-sekundiline no-trade hoiatus ja stabiliseerimise meeldetuletused.',
                  'Audio Spatial Director: sammude/uste/reload’i prioriseerimine automaatse summutusega.'
                ]
              },
              {
                title: 'Reageerimine ja katvus',
                items: [
                  'Overlay värskendus kuni 144 Hz.',
                  'Moodulid kohanevad automaatselt PvE või PvP kontekstiga.',
                  'Keskmine reaktsiooniaeg ~40–45 ms nähtavate sündmuste puhul.',
                  'Võrgu jälgimine automaatse regiooni vahetusega.'
                ]
              },
              {
                title: 'PulseForge Lobby',
                description: 'Treeningvõimalused, kui kõik kasutavad PulseForge’i buildi',
                items: [
                  'Raid Lab: mehaanikaruumid jagatavate timeline’ide ja soorituspunktidega.',
                  'DPS Check Lab: mannekeenid ja liikuvad sihtmärgid DPS scoreboardiga.',
                  'Movement & Ability Sandbox: ajastatud rajad ja võimeharjutused kiire resetiga.',
                  'Ghost-Run & Pathing: parimate soorituste „fantoomid” ja sünkroniseeritud taasesitused.',
                  'Jagatud kosmeetika: eskadroni bännerid, finisher FX, PulseForge’i kill-bannerid.',
                  'Caster Mode: laiendatud HUD, 8-sekundilised kohesed kordused ja highlight’ide eksport.'
                ]
              },
              {
                title: 'Miks valida meie natiivne Destiny 2 build?',
                items: [
                  'Natiivne integratsioon sünkroonis iga Bungie patchiga.',
                  'Stream-safe fair-play overlayd PvE/PvP jaoks ilma pealetükkivate abideta.',
                  'Kalibreeritud jõudlus: 402/356/246 FPS keskmiselt 1080p/1440p/4K juures.',
                  'Loominguline tugi: scrimid, VOD analüütika ja PulseForge Lobby eskadroni teemad.'
                ]
              }
            ],
            implementationNotes: [
              'Avalikes/ranked mängudes tuginevad overlayd ainult nähtavale HUDile/helile/killfeedile.',
              'Kosmeetika, DPS sandbox ja live stratboardid on piiratud PulseForge’i lobbydega, kus on ühine build.',
              'Overlayd on opt-in ja peidavad end intensiivsetel visuaalsetel faasidel.'
            ],
            target_audience: 'Destiny fireteamid, raid lead’id, loojad',
            highlight: 'Stabiilsed 1% low väärtused intensiivseks PvE/PvP-ks',
            protection: 'Sertifitseeritud stream-safe fair-play',
            updates: 'Destiny 2 patchidega sünkroonitud uuendused'
          }
        }
      },
      technical: {
        fpsByResolution: [
          { playability: 'Väga sujuv', bottleneck: 'CPU (≈76%)' },
          { playability: 'Väga sujuv', bottleneck: 'CPU (≈64%)' },
          { playability: 'Väga sujuv', bottleneck: 'GPU (≈41%)' }
        ],
        resolutionGuidance: [
          {
            refreshAdvice: '240–360 Hz siht',
            description: '1080p Medium hoiab ~402 FPS, Ultra on ~342 FPS Trials’i ja Crucible’i jaoks.',
            note: 'Aktiveeri Focus HUD, et clutch-situatsioonides kõver sujuvaks jääks.'
          },
          {
            refreshAdvice: '240 Hz teravuse tasakaal',
            description: '1440p säilitab 302–410 FPS akna – ideaalne detailseks striimiks ja VOD tööks.',
            note: 'Hoia High presetit, et 1% madalad stabiilsed oleksid.'
          },
          {
            refreshAdvice: 'Mängitav 4K üle 200 Hz',
            description: '4K Medium (~246 FPS) püsib väga sujuv raidide showcase’ideks; Ultra (~206 FPS) sobib premium-striimiks.',
            note: 'Kasuta seda režiimi edastusvalmis salvestusteks.'
          }
        ],
        improvementTips: [
          'Kasuta Trials/konkurentsimängus Esports/Low presetit ja PvE endgame’is Medium presetit.',
          'Lase PulseForge’il kontrollida FPS piiramist ja anti-tear’i; väldi väliseid limite.',
          'Lülita Focus HUD sisse, et võitluse ajal mittevajalikud moodulid peita.',
          '4K juures eelista High presetit Ultra asemel, et hoida lahingutempo ühtlane.'
        ],
        advice:
          '„CPU Boost” valik: +5% → ~410/348/470 FPS · +10% → ~418/355/478 FPS · +15% → ~428/364/490 FPS · +20% → ~440/374/505 FPS (vajab Thermal-Premium sõlme).',
        augmentationSuite: {
          modules: [
            'Encounter Timeline: mehaanika verstapostid, DPS aknad ja safe spotid.',
            'Champions & Mods Planner: championite/modide meeldetuletused tiimile.',
            'Super & Buff Orchestrator: nähtavad Superite ja buff/debuff’i tsüklid.',
            'Ammo Economy: heavy/special jälgimine ja drop-aknad.',
            'DPS Estimator: faasi DPS lugemine nähtavate tickide järgi.',
            'Survival Cues: vastupidavuse/taastumise vihjed ja no-rez aknad.',
            'Zone & Pressure Map: surve tsoonides ja killfeedist loetav arvuline eelis.',
            'Super Economy Read: Superi laetuse hinnang nähtava info põhjal.',
            'Peek Discipline: pea kõrguse märgised ja anti ego-peek vihjed.',
            'Fight Timeline: trade’i jälgimine ja 3-sekundiline no-trade hoiatus.'
          ],
          notes: 'PvE/PvP moodulid värskendatakse iga Destiny 2 patchi järel.'
        },
        heroSynergy: [
          { preset: 'Balance', coachingNotes: 'Turvalised avamisnurgad ja anti ego-peek meeldetuletused.' },
          { preset: 'Esports', coachingNotes: 'Engage’i ajastus, aknad ja lühikesed põgenemisteed.' },
          { preset: 'Stability', coachingNotes: 'Pikamaa kontroll ja reload’i distsipliin.' },
          { preset: 'Sniper Focus', coachingNotes: 'Pea kõrguse pre-aim ja glindi haldus.' },
          { preset: 'Indoor', coachingNotes: 'Struktureeritud lähivõitlused ja duo-timingud.' },
          { preset: 'Macro', coachingNotes: 'Makrokõned, Superi majandus ja rotatsiooni hoiatused.' }
        ]
      }
    }
  },
  'gaming-dota2': {
    fr: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Profil Dota 2 natif',
          description: 'Stabilité CPU-bound et pipeline vidéo faible latence calibrés teamfight.'
        },
        {
          icon: Zap,
          title: 'Provisioning cloud instantané',
          description: 'Instances Dota 2 prêtes en quelques secondes avec bascule région automatique.'
        },
        {
          icon: Shield,
          title: 'Overlays sobres fair-play',
          description: 'Modules stream-safe basés sur HUD/son/killfeed sans aucune injection mémoire.'
        },
        {
          icon: Trophy,
          title: 'Sandbox PulseForge Lobby',
          description: 'Lane lab, warding planner et cosmétiques partagés pour scrims et coaching.'
        }
      ],
      metrics: {
        title: 'Performances calibrées pour Dota 2',
        description:
          'Profil PulseForge Medium compétitif : 405 FPS de moyenne, 1% low à 310 FPS et pic à 470 FPS en 1080p. Les profils 1440p et 4K restent très fluides grâce à l’allocation CPU↔GPU et à l’overhead cloud contrôlé.',
        statCards: {
          maxFps: 'FPS maximum observé (1080p Medium)',
          onePercentLow: 'Min observé (proxy 1% low, 1080p Medium)',
          inputLag: 'Input lag moyen'
        },
        allocationTitle: 'Bottleneck dominant (profil Medium)',
        datacenterTitle: 'Monitoring cloud PulseForge',
        usage: {
          cpu: 'Charge CPU',
          gpu: 'Charge GPU',
          ram: 'Mémoire utilisée',
          vram: 'VRAM utilisée'
        },
        thermals: {
          cpu: 'Température CPU cloud',
          gpu: 'Température GPU',
          power: 'Consommation électrique'
        },
        stabilityNote:
          'Dota 2 reste majoritairement CPU-bound ; nos profils maintiennent la réserve nécessaire jusqu’en 4K tout en stabilisant les 1% low.'
      },
      fpsTable: {
        footnote: 'Benchmarks internes Dota 2 (profil Medium compétitif, scrims 5v5 et pubs high MMR).'
      },
      resolution: {
        title: 'Comment ajuster la résolution côté cloud',
        description:
          'Nos mesures traduisent la marge FPS réelle lorsque vous ajustez la définition depuis le panneau PulseForge.',
        windowLabel: 'Fenêtre relevée',
        footnote: 'Valeurs relevées sur presets Medium/Ultra Dota 2 avec overlays actifs.',
        avgLabel: 'FPS moyen'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} tourne entièrement sur notre infrastructure : provisioning instantané, routage adaptatif et latence stabilisée à ${latency} ms.`,
        bullets: [
          'Overlays, presets et mises à jour appliqués côté serveur — rien à installer localement.',
          'Bascule 1080p/1440p/4K instantanée tout en respectant la fenêtre FPS mesurée.',
          'Monitoring ping/jitter/pertes avec bascule automatique de région lors des tournois et scrims.'
        ],
        profileSubtitle: 'Moyenne mesurée en 1080p Medium',
        lowLabel: 'Min observé 1080p Medium',
        lowSubtitle: 'Fenêtre basse relevée'
      },
      improvement: { adviceTitle: 'Option « CPU Boost » (côté hôte)' },
      augmentation: {
        description: 'Modules tactiques sobres pour teamfights, macro économies et confort stream-safe.'
      },
      hero: {
        badge: 'PROFILS PAR RÔLE',
        title: 'Optimisations dédiées',
        description: 'Chaque preset couvre les positions 1 à 5 avec feedback overlay dédié.',
        headers: {
          hero: 'Rôle',
          overlay: 'Focus overlay',
          clarity: 'Clarté visuelle',
          preset: 'Preset conseillé',
          notes: 'Notes coaching'
        },
        fallbackDescription: (game: string) => `Optimisations par rôle pour ${game}`
      },
      nativeReasons: {
        description: (game: string) => `Optimisé de bout en bout pour ${game} avec overlays fair-play et sandbox scrims.`
      },
      product: {
        description: 'Instance Dota 2 cloud native calibrée compétitif.',
        longDescription:
          'PulseForge Dota 2 vise une fréquence d’image stable tout en respectant le fair-play : overlays purement visuels, pipeline vidéo faible latence et sandbox PulseForge Lobby pour scrims et entraînements.',
        variants: {
          'pulseforge-dota2': {
            name: 'PulseForge Dota 2 Ancients',
            usage: 'Instance Dota 2 PulseForge',
            description: 'Build cloud Dota 2 orienté compétitif avec overlays sobres et sandbox scrim.',
            use_cases: [
              'Ranked haut niveau et scrims',
              'Coaching équipe et analyst desk',
              'Production stream MOBA',
              'Revues VOD stratégiques',
              'Sandbox PulseForge Lobby'
            ],
            features: [
              'Overlays modulaires stream-safe',
              'Analyse post-match et exports timeline',
              'Coach macro rotations & buybacks',
              'Thèmes d’équipe PulseForge Lobby',
              'Intégration multi-input clavier/souris/manette',
              'Mises à jour synchronisées patch Dota 2',
              'Compatibilité PulseForge Lobby sandbox'
            ],
            featureHighlights: [
              'Public/Ranked – overlays purement visuels (HUD, audio, killfeed, minimap) sans lecture mémoire',
              'PulseForge Lobby – cosmétiques partagés et sandbox lanes/warding pour tous les joueurs PulseForge'
            ],
            featureGroups: [
              {
                title: 'Modules tactiques publics',
                items: [
                  'Roshan/Aegis & Runes : rappels Aegis, Power/Bounty et alternance Day/Night.',
                  'Stack & Pull Helper : minuteurs pull/stack affichés sur la carte.',
                  'Buyback & Économie : suivi buybacks alliés, stocks smokes/dusts/TPs et rappels shop.',
                  'Fight Timeline : suivi trades, alerte no-trade 3 s et man-advantage.',
                  'Post-fight Digest : récap morts, ultis et TPs disponibles par camp.',
                  'Focus HUD : masquage intelligent des stats toxiques pendant les fights.'
                ]
              },
              {
                title: 'Lisibilité & confort',
                items: [
                  'Audio Spatial Director : priorisation pas/TP/ult, ducking du bruit non critique.',
                  'Color grading optionnel pour highlight spells critiques.',
                  'Anti-tilt HUD avec prompts respiration entre fights.',
                  'Support multi-moniteur pour analyst desk stream.',
                  'Latency Guard : maintien du jitter et adaptation du buffer de stream.'
                ]
              },
              {
                title: 'PulseForge Lobby',
                description: 'Options de jeu & d’entraînement (tous joueurs sur build PulseForge)',
                items: [
                  'Lane & Last-hit Lab : vagues scriptées, scoreboard CS delta et sandbox freeze/push.',
                  'Warding Planner : plan sentries/obs par zone avec partage live coach/équipe.',
                  'Draft & Role Rules : règles pos 1–5, rotations imposées et répétitions d’openings.',
                  'Ghost-Run & Pathing : fantômes de rotations support/carry avec replays synchronisés.',
                  'Cosmétiques partagés : kill-banners & emotes PulseForge visibles par le lobby PF.',
                  'Caster Mode : HUD élargi, replays 8 s et marqueurs de fights stream-ready.'
                ]
              },
              {
                title: 'Pourquoi choisir notre build natif Dota 2 ?',
                items: [
                  'Intégration native synchronisée après chaque patch Valve.',
                  'Conformité totale : overlays stream-safe, aucune assistance intrusive.',
                  'Performances calibrées : ~405/380/300 FPS moyens avec réserve CPU.',
                  'Support créatif : scrims outillés, analytics VOD et thèmes d’équipe PulseForge Lobby.'
                ]
              }
            ],
            implementationNotes: [
              'En parties publiques, toutes les données proviennent uniquement du HUD, du son et du killfeed visibles.',
              'Cosmétiques, sandbox lanes et stratboards sont réservés aux lobbies PulseForge avec build partagé.',
              'Les overlays restent opt-in et se masquent lors des teamfights pour limiter le bruit visuel.'
            ],
            target_audience: 'Teams Dota 2, coachs, analystes',
            highlight: 'Stabilité CPU-bound calibrée',
            protection: 'Fair-play stream-safe certifié',
            updates: 'Mises à jour synchronisées patch Dota 2'
          }
        }
      },
      technical: {
        fpsByResolution: [
          { playability: 'Très fluide', bottleneck: 'CPU (majoritaire)' },
          { playability: 'Très fluide', bottleneck: 'CPU' },
          { playability: 'Très fluide', bottleneck: 'Mixte (tendance CPU)' }
        ],
        resolutionGuidance: [
          {
            refreshAdvice: 'Cible 240–360 Hz',
            description: 'Le profil 1080p Medium maintient ~405 FPS avec 1% low à ~310 FPS pour les teamfights denses.',
            note: 'Conservez fps_max piloté par PulseForge pour lisser l’input-lag.'
          },
          {
            refreshAdvice: 'Netteté + fréquence 240 Hz',
            description: '1440p garde 300–440 FPS, idéal pour streaming et VOD détaillées.',
            note: 'Maintenez Focus HUD actif pour éviter la surcharge visuelle en fight.'
          },
          {
            refreshAdvice: '4K 200+ Hz jouable',
            description: 'Même en 4K Medium (~300 FPS), l’expérience reste très fluide pour les showcases et coachings.',
            note: 'Ultra (~260 FPS) convient aux reviews premium.'
          }
        ],
        improvementTips: [
          'Gardez V-Sync off, fps_max piloté par PulseForge et overlay limité aux modules essentiels en fight.',
          'Baissez post-FX et ombres si vous ciblez un 1% low encore plus serré.',
          'Le jeu étant CPU-bound, l’overclock contrôlé côté hôte améliore surtout les 1% low.'
        ],
        advice:
          'Option « CPU Boost » : +5 % → ~410/312/476 FPS · +10 % → ~415/316/482 FPS · +15 % → ~422/323/490 FPS · +20 % → ~432/332/502 FPS (nœud Thermal-Premium requis).',
        augmentationSuite: {
          modules: [
            'Roshan/Aegis & Runes : rappels non intrusifs (Aegis, Power/Bounty, Day/Night) basés sur l’horloge.',
            'Stack & Pull Helper : minuteurs pull/stack par camp synchronisés sur l’horloge in-game.',
            'Buyback & Économie : suivi buyback/économie alliée (smokes, dusts, TPs) sans infos ennemies cachées.',
            'Fight Timeline : suivi trades & man-advantage avec alerte no-trade 3 s.',
            'Post-fight Digest : récap morts/ult/TP par camp pour décider push ou retreat.',
            'Audio Spatial Director : priorisation pas/TP/ult et ducking du bruit non critique.',
            'Focus HUD : masquage intelligent des stats non pertinentes pendant 5–8 s critiques.'
          ],
          notes: 'Overlays rafraîchis jusqu’à 144 Hz, calibrés pour les teamfights Source 2 et conformes aux règles publiques.'
        },
        heroSynergy: [
          { preset: 'Hyperfarm', coachingNotes: 'Timers stack, rappel buyback et lanes safe pour scaling mid/late.' },
          { preset: 'Tempo', coachingNotes: 'Runes, rotations et Fight Timeline pour sécuriser les power spikes.' },
          { preset: 'Pressure', coachingNotes: 'Rotation Coach, Post-fight Digest et prompts tower trades.' },
          { preset: 'Playmaker', coachingNotes: 'Stack & Pull Helper, warding cues et Fight Timeline pour initier sans feed.' },
          { preset: 'Vision', coachingNotes: 'Warding Planner, Buyback Economy et rappels smoke/dust.' }
        ]
      }
    },
    en: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Native Dota 2 profile',
          description: 'CPU-bound stability and low-latency video pipeline tuned for teamfights.'
        },
        {
          icon: Zap,
          title: 'Instant cloud provisioning',
          description: 'Dota 2 instances spin up in seconds with automatic region failover.'
        },
        {
          icon: Shield,
          title: 'Fair-play overlay stack',
          description: 'Stream-safe modules built from HUD/audio/killfeed with zero memory reads.'
        },
        {
          icon: Trophy,
          title: 'PulseForge Lobby sandbox',
          description: 'Lane lab, warding planner, and shared cosmetics for scrims and coaching.'
        }
      ],
      metrics: {
        title: 'Calibrated performance for Dota 2',
        description:
          'PulseForge competitive Medium profile: 405 average FPS, 310 FPS 1% low proxy, and 470 FPS peaks at 1080p. The 1440p and 4K profiles stay very smooth thanks to CPU↔GPU allocation and controlled cloud overhead.',
        statCards: {
          maxFps: 'Max observed FPS (1080p Medium)',
          onePercentLow: 'Min observed (1% low proxy, 1080p Medium)',
          inputLag: 'Average input lag'
        },
        allocationTitle: 'Dominant bottleneck (Medium profile)',
        datacenterTitle: 'PulseForge cloud monitoring',
        usage: {
          cpu: 'CPU load',
          gpu: 'GPU load',
          ram: 'Memory used',
          vram: 'VRAM used'
        },
        thermals: {
          cpu: 'Cloud CPU temperature',
          gpu: 'GPU temperature',
          power: 'Power draw'
        },
        stabilityNote:
          'Dota 2 remains mostly CPU-bound; our profiles keep enough headroom up to 4K while stabilising 1% lows.'
      },
      fpsTable: {
        footnote: 'Internal Dota 2 benchmarks (Medium competitive profile across 5v5 scrims and high-MMR pubs).'
      },
      resolution: {
        title: 'How to adjust resolution from the cloud',
        description:
          'Our measurements reflect the real FPS headroom when you change resolution inside the PulseForge panel.',
        windowLabel: 'Observed window',
        footnote: 'Values captured on Dota 2 Medium/Ultra presets with overlays enabled.',
        avgLabel: 'Average FPS'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} runs entirely on our infrastructure: instant provisioning, adaptive routing, and latency held around ${latency} ms.`,
        bullets: [
          'Overlays, presets, and updates ship server-side—nothing to install locally.',
          'Swap 1080p/1440p/4K instantly while staying within the measured FPS window.',
          'Ping/jitter/loss monitoring with automatic region failover for tournaments and scrims.'
        ],
        profileSubtitle: 'Average recorded at 1080p Medium',
        lowLabel: 'Observed minimum 1080p Medium',
        lowSubtitle: 'Low-end window'
      },
      improvement: { adviceTitle: '“CPU Boost” option (host side)' },
      augmentation: {
        description: 'Minimal, fair-play tactical modules for teamfights, economy reads, and stream-safe comfort.'
      },
      hero: {
        badge: 'ROLE PROFILES',
        title: 'Dedicated optimisations',
        description: 'Each preset covers positions 1 to 5 with role-specific overlay feedback.',
        headers: {
          hero: 'Role',
          overlay: 'Overlay focus',
          clarity: 'Visual clarity',
          preset: 'Suggested preset',
          notes: 'Coaching notes'
        },
        fallbackDescription: (game: string) => `Role-based optimisations for ${game}`
      },
      nativeReasons: {
        description: (game: string) => `End-to-end optimisation for ${game} with fair-play overlays and scrim sandbox.`
      },
      product: {
        description: 'Native Dota 2 cloud instance tuned for competitive play.',
        longDescription:
          'PulseForge Dota 2 targets extreme frame rates while staying fair-play: overlays remain purely visual, the video pipeline stays low-latency, and the PulseForge Lobby sandbox powers scrims and training.',
        variants: {
          'pulseforge-dota2': {
            name: 'PulseForge Dota 2 Ancients',
            usage: 'PulseForge Dota 2 instance',
            description: 'Competitive cloud build with minimalist overlays and full scrim sandbox.',
            use_cases: [
              'High-level ranked and scrims',
              'Team coaching and analyst desks',
              'MOBA stream production',
              'Strategic VOD reviews',
              'PulseForge Lobby sandbox'
            ],
            features: [
              'Stream-safe modular overlays',
              'Post-match analysis and timeline exports',
              'Macro coaching for rotations and buybacks',
              'PulseForge Lobby team themes',
              'Multi-input integration (mouse/keyboard, controller)',
              'Patch-synchronised Dota 2 updates',
              'PulseForge Lobby sandbox compatibility'
            ],
            featureHighlights: [
              'Public/Ranked – overlays stay purely visual (HUD, audio, killfeed, minimap) with no memory access',
              'PulseForge Lobby – shared cosmetics plus lane/warding sandbox for every PulseForge player'
            ],
            featureGroups: [
              {
                title: 'Public tactical modules',
                items: [
                  'Roshan/Aegis & Runes: Aegis, Power/Bounty, and Day/Night reminders.',
                  'Stack & Pull Helper: on-screen stack/pull timers per camp.',
                  'Buyback & Economy: allied buyback tracker, smoke/dust/TP stocks, and shop reminders.',
                  'Fight Timeline: trade tracking with 3 s no-trade alerts and advantage reads.',
                  'Post-fight Digest: deaths, ultimates, and TP availability by team.',
                  'Focus HUD: hides distracting stats during fights.'
                ]
              },
              {
                title: 'Readability & comfort',
                items: [
                  'Audio Spatial Director: prioritised footsteps/TP/ult cues with ducking.',
                  'Optional colour grading to highlight critical spells.',
                  'Anti-tilt HUD with breathing prompts between fights.',
                  'Multi-monitor support for analyst desk streams.',
                  'Latency Guard: jitter control and adaptive stream buffer.'
                ]
              },
              {
                title: 'PulseForge Lobby',
                description: 'Practice options when every player runs the PulseForge build',
                items: [
                  'Lane & Last-hit Lab: scripted waves, CS delta scoreboard, freeze/push sandbox.',
                  'Warding Planner: shared sentry/obs plans with live coach collaboration.',
                  'Draft & Role Rules: enforced pos1–5 rules, rotation drills, and opening rehearsals.',
                  'Ghost-Run & Pathing: ghosts of support/carry rotations with synced replays.',
                  'Shared cosmetics: PulseForge kill banners and emotes visible to the lobby.',
                  'Caster Mode: expanded HUD, 8 s instant replays, and fight markers ready for broadcast.'
                ]
              },
              {
                title: 'Why choose our native Dota 2 build?',
                items: [
                  'Native integration refreshed after every Valve patch.',
                  'Full compliance: stream-safe overlays with no intrusive assistance.',
                  'Calibrated performance: ~405/380/300 average FPS with CPU headroom.',
                  'Creative support: tooled scrims, VOD analytics, and PulseForge Lobby themes.'
                ]
              }
            ],
            implementationNotes: [
              'In public/ranked games, data comes only from visible HUD, audio, and killfeed.',
              'Cosmetics, lane sandbox, and stratboards stay exclusive to PulseForge Lobby sessions.',
              'Overlays remain opt-in and auto-hide during heavy teamfight moments.'
            ],
            target_audience: 'Dota 2 teams, coaches, analysts',
            highlight: 'Calibrated CPU-bound stability',
            protection: 'Certified stream-safe fair play',
            updates: 'Patch-synchronised Dota 2 updates'
          }
        }
      },
      technical: {
        fpsByResolution: [
          { playability: 'Very smooth', bottleneck: 'CPU (majority)' },
          { playability: 'Very smooth', bottleneck: 'CPU' },
          { playability: 'Very smooth', bottleneck: 'Mixed (CPU-leaning)' }
        ],
        resolutionGuidance: [
          {
            refreshAdvice: 'Target 240–360 Hz',
            description: 'The 1080p Medium profile holds ~405 FPS with ~310 FPS 1% lows for intense teamfights.',
            note: 'Let PulseForge control fps_max to keep input latency tight.'
          },
          {
            refreshAdvice: 'Sharpness + 240 Hz balance',
            description: '1440p sustains 300–440 FPS, ideal for streaming and detailed VODs.',
            note: 'Keep Focus HUD active to avoid clutter during fights.'
          },
          {
            refreshAdvice: 'Playable 4K above 200 Hz',
            description: 'Even at 4K Medium (~300 FPS), the experience stays snappy for showcases and coaching.',
            note: 'Ultra (~260 FPS) suits premium reviews and broadcast capture.'
          }
        ],
        improvementTips: [
          'Keep V-Sync off, let PulseForge drive fps_max, and only enable essential overlays during fights.',
          'Lower post-FX and shadows if you want even tighter 1% lows.',
          'Because the game is CPU-bound, host-side overclocking mostly helps the 1% lows.'
        ],
        advice:
          '“CPU Boost” option: +5% → ~410/312/476 FPS · +10% → ~415/316/482 FPS · +15% → ~422/323/490 FPS · +20% → ~432/332/502 FPS (requires a Thermal-Premium node).',
        augmentationSuite: {
          modules: [
            'Roshan/Aegis & Runes: non-intrusive reminders (Aegis, Power/Bounty, Day/Night) keyed to the clock.',
            'Stack & Pull Helper: synced stack/pull timers per camp using the in-game clock.',
            'Buyback & Economy: allied buyback tracker plus smoke/dust/TP stock without enemy leaks.',
            'Fight Timeline: trade tracking with 3 s no-trade alerts and advantage calls.',
            'Post-fight Digest: deaths/ultimates/TPs summarised per side for push vs retreat decisions.',
            'Audio Spatial Director: prioritised footsteps/TP/ult cues with noise ducking.',
            'Focus HUD: context-aware stat hiding during the 5–8 s critical windows.'
          ],
          notes: 'Overlays refresh up to 144 Hz, tuned for Source 2 teamfights and public-rule compliance.'
        },
        heroSynergy: [
          { preset: 'Hyperfarm', coachingNotes: 'Stack timers, buyback reminders, and safe lanes for mid/late scaling.' },
          { preset: 'Tempo', coachingNotes: 'Rune tracking, rotations, and Fight Timeline to secure power spikes.' },
          { preset: 'Pressure', coachingNotes: 'Rotation guidance, post-fight digest, and tower trade prompts.' },
          { preset: 'Playmaker', coachingNotes: 'Stack & Pull Helper, ward cues, and Fight Timeline to engage cleanly.' },
          { preset: 'Vision', coachingNotes: 'Warding Planner, buyback economy, and smoke/dust reminders.' }
        ]
      }
    },
    et: {
      nativeAdvantages: [
        {
          icon: Code,
          title: 'Dota 2 natiivprofiil',
          description: 'CPU-põhine stabiilsus ja madala latentsusega videotoru, mis on häälestatud teamfight’ideks.'
        },
        {
          icon: Zap,
          title: 'Kohene pilveprovisioneerimine',
          description: 'Dota 2 instantsid käivitatakse sekunditega, piirkonna automaatne vahetus pingist lähtuvalt.'
        },
        {
          icon: Shield,
          title: 'Fair-play overlay pakett',
          description: 'Stream-safe moodulid, mis tuginevad HUDile/helile/killfeedile ilma mälu lugemata.'
        },
        {
          icon: Trophy,
          title: 'PulseForge Lobby liivakast',
          description: 'Lane lab, wardingu planner ja jagatud kosmeetika scrimideks ning coachinguks.'
        }
      ],
      metrics: {
        title: 'Kalibreeritud jõudlus Dota 2 jaoks',
        description:
          'PulseForge’i Medium konkurentsiprofiil: keskmiselt 405 FPS, 1% low umbes 310 FPS ja tipud 470 FPS 1080p juures. 1440p ja 4K profiilid püsivad väga sujuvad tänu CPU↔GPU jaotusele ja kontrollitud pilve overhead’ile.',
        statCards: {
          maxFps: 'Maksimaalne täheldatud FPS (1080p Medium)',
          onePercentLow: 'Min täheldatud (1% low proxy, 1080p Medium)',
          inputLag: 'Keskmine sisendviivitus'
        },
        allocationTitle: 'Domineeriv pudelkits (Medium profiil)',
        datacenterTitle: 'PulseForge’i pilvemonitoring',
        usage: {
          cpu: 'CPU koormus',
          gpu: 'GPU koormus',
          ram: 'Mälu kasutus',
          vram: 'VRAM kasutus'
        },
        thermals: {
          cpu: 'Pilve CPU temperatuur',
          gpu: 'GPU temperatuur',
          power: 'Voolutarve'
        },
        stabilityNote:
          'Dota 2 on valdavalt CPU-põhine; meie profiilid hoiavad varu kuni 4K resolutsioonini ja stabiliseerivad 1% low väärtused.'
      },
      fpsTable: {
        footnote: 'Sisemised Dota 2 testid (Medium konkurentsiprofiil 5v5 scrimidel ja kõrge MMR pubides).'
      },
      resolution: {
        title: 'Kuidas pilves resolutsiooni kohandada',
        description:
          'Mõõtmised näitavad tegelikku FPS varu, kui muudate resolutsiooni PulseForge’i paneelist.',
        windowLabel: 'Täheldatud aken',
        footnote: 'Väärtused Medium/Ultra presetitel koos overlaydega.',
        avgLabel: 'Keskmine FPS'
      },
      experience: {
        description: (productName: string, latency: number) =>
          `${productName} töötab täielikult meie infrastruktuuris: kohene provisioning, adaptiivne ruuting ja latentsus hoitud umbes ${latency} ms juures.`,
        bullets: [
          'Overlayd, presetid ja uuendused tulevad serveri kaudu — lokaalne paigaldus puudub.',
          'Vaheta 1080p/1440p/4K kohe, püsides mõõdetud FPS aknas.',
          'Ping/jitter/loss monitooring automaatse regiooni vahetusega turniirideks ja scrimideks.'
        ],
        profileSubtitle: 'Keskmine väärtus 1080p Medium profiilil',
        lowLabel: 'Min täheldatud 1080p Medium',
        lowSubtitle: 'Madalaim aken'
      },
      improvement: { adviceTitle: '„CPU Boost” valik (hosti pool)' },
      augmentation: {
        description: 'Minimalistlikud, fair-play taktikamoodulid teamfight’ideks, majanduse lugemiseks ja stream-safe mugavuseks.'
      },
      hero: {
        badge: 'ROLLIPÕHISED PROFIILID',
        title: 'Pühendatud optimeerimised',
        description: 'Iga preset katab positsioonid 1–5 rollipõhise overlay tagasisidega.',
        headers: {
          hero: 'Roll',
          overlay: 'Overlay fookus',
          clarity: 'Visuaalne selgus',
          preset: 'Soovitatud preset',
          notes: 'Coaching märkused'
        },
        fallbackDescription: (game: string) => `Rollipõhised optimeerimised mängule ${game}`
      },
      nativeReasons: {
        description: (game: string) => `Täielikult optimeeritud ${game} lahendus fair-play overlayde ja scrim-liivakastiga.`
      },
      product: {
        description: 'Natiivne Dota 2 pilveinstants, mis on häälestatud konkurentsimänguks.',
        longDescription:
          'PulseForge Dota 2 sihib väga kõrgeid kaadrisagedusi jäädes samas fair-play reeglitele truuks: overlayd on puhtalt visuaalsed, videotoru hoiab madalat latentsust ja PulseForge Lobby liivakast katab scrimid ning treeningud.',
        variants: {
          'pulseforge-dota2': {
            name: 'PulseForge Dota 2 Ancients',
            usage: 'PulseForge’i Dota 2 instants',
            description: 'Konkurentsile suunatud pilvebuild minimalistlike overlayde ja täisliivakastiga.',
            use_cases: [
              'Kõrgetasemeline ranked ja scrimid',
              'Tiimitreening ja analüütikute töö',
              'MOBA striimitootmine',
              'Strateegilised VOD-ülevaated',
              'PulseForge Lobby liivakast'
            ],
            features: [
              'Stream-safe modulaarsed overlayd',
              'Post-matši analüüs ja timeline’i eksport',
              'Makro coaching rotatsioonide ja buyback’ide jaoks',
              'PulseForge Lobby tiimiteemad',
              'Multi-input integratsioon (klaviatuur/hiir, kontroller)',
              'Patchidega sünkroonis Dota 2 uuendused',
              'PulseForge Lobby liivakasti tugi'
            ],
            featureHighlights: [
              'Avalik/ranked – overlayd on puhtalt visuaalsed (HUD, audio, killfeed, minimapp) ilma mälu lugemata',
              'PulseForge Lobby – jagatud kosmeetika ja lane/wardingu liivakast kõikidele PulseForge’i mängijatele'
            ],
            featureGroups: [
              {
                title: 'Avalikud taktikamoodulid',
                items: [
                  'Roshan/Aegis & Runes: Aegise, Power/Bounty rune’ide ja Day/Night meeldetuletused.',
                  'Stack & Pull Helper: laagripõhised stack/pull taimerid ekraanil.',
                  'Buyback & Economy: liitlaste buyback jälgija, smoke/dust/TP varud ja poe meeldetuletused.',
                  'Fight Timeline: trade’ide jälgimine, 3 s no-trade hoiatused ja eelisinfo.',
                  'Post-fight Digest: surmad, ulti’d ja TP-d mõlema poole kohta.',
                  'Focus HUD: peidab häirivad statistilised näidikud võitluse ajal.'
                ]
              },
              {
                title: 'Loetavus ja mugavus',
                items: [
                  'Audio Spatial Director: eelistab samme/TP/ult helisid ja summutab müra.',
                  'Valikuline värvikorrektsioon kriitiliste loitsude esiletõstmiseks.',
                  'Anti-tilt HUD hingamispromptidega võitluste vahel.',
                  'Mitme monitori tugi analüütikute striimidele.',
                  'Latency Guard: kontrollib jitterit ja kohandab striimi puhvrit.'
                ]
              },
              {
                title: 'PulseForge Lobby',
                description: 'Harjutusvõimalused, kui kõik mängijad on PulseForge’i buildil',
                items: [
                  'Lane & Last-hit Lab: skriptitud lained, CS delta tabel ja freeze/push liivakast.',
                  'Warding Planner: jagatud sentry/obs plaanid koos live coach’iga.',
                  'Draft & Role Rules: pos1–5 reeglid, rotatsiooni harjutused ja avangute kordused.',
                  'Ghost-Run & Pathing: tugi/kandja rotatsioonide “kummitused” sünkroniseeritud taasesitusega.',
                  'Jagatud kosmeetika: PulseForge’i kill-bannerid ja emotsioonid nähtavad kogu lobbys.',
                  'Caster Mode: laiendatud HUD, 8 s kohesed kordused ja võitluse markerid ülekandeks.'
                ]
              },
              {
                title: 'Miks valida meie natiivne Dota 2 build?',
                items: [
                  'Natiivne integratsioon, värskendatud pärast iga Valve patchi.',
                  'Täielik vastavus: stream-safe overlayd, intrusiivseid abisid pole.',
                  'Kalibreeritud jõudlus: ~405/380/300 FPS keskmiselt koos CPU varuga.',
                  'Loov tugi: scrimid, VOD analüütika ja PulseForge Lobby tiimiteemad.'
                ]
              }
            ],
            implementationNotes: [
              'Avalikes/ranked mängudes pärinevad andmed ainult nähtavast HUDist, helist ja killfeedist.',
              'Kosmeetika, lane-liivakast ja stratboardid on eksklusiivsed PulseForge Lobby seanssidele.',
              'Overlayd on opt-in ja peituvad automaatselt intensiivsete teamfight’ide ajal.'
            ],
            target_audience: 'Dota 2 tiimid, coach’id, analüütikud',
            highlight: 'Häälestatud CPU-põhine stabiilsus',
            protection: 'Sertifitseeritud stream-safe fair play',
            updates: 'Patchidega sünkroonis Dota 2 uuendused'
          }
        }
      },
      technical: {
        fpsByResolution: [
          { playability: 'Väga sujuv', bottleneck: 'CPU (enamus)' },
          { playability: 'Väga sujuv', bottleneck: 'CPU' },
          { playability: 'Väga sujuv', bottleneck: 'Segapudelkael (CPU eelis)' }
        ],
        resolutionGuidance: [
          {
            refreshAdvice: 'Siht 240–360 Hz',
            description: '1080p Medium hoiab ~405 FPS ja ~310 FPS 1% low väärtusi tihedate teamfight’ide jaoks.',
            note: 'Lase PulseForge’il juhtida fps_max seadet, et hoida input viivitus madal.'
          },
          {
            refreshAdvice: 'Teravus + 240 Hz tasakaal',
            description: '1440p säilitab 300–440 FPS ja sobib suurepäraselt striimide ja detailsete VODide jaoks.',
            note: 'Hoia Focus HUD aktiivne, et vältida ekraanikära võitluses.'
          },
          {
            refreshAdvice: 'Mängitav 4K üle 200 Hz',
            description: '4K Medium (~300 FPS) püsib väga reageeriv showcase’ideks ja coachinguks.',
            note: 'Ultra (~260 FPS) sobib premium-ülekannete ja analüüside jaoks.'
          }
        ],
        improvementTips: [
          'Hoia V-Sync väljas, lase PulseForge’il juhtida fps_max’i ja aktiveeri vaid vajalikud overlayd võitluse ajal.',
          'Vähenda post-FX ja varje, kui soovid veel stabiilsemat 1% low väärtust.',
          'Kuna mäng on CPU-põhine, aitab hosti poolne ülekiirendus peamiselt 1% low väärtusi.'
        ],
        advice:
          '„CPU Boost” valik: +5% → ~410/312/476 FPS · +10% → ~415/316/482 FPS · +15% → ~422/323/490 FPS · +20% → ~432/332/502 FPS (vajab Thermal-Premium sõlme).',
        augmentationSuite: {
          modules: [
            'Roshan/Aegis & Runes: mitteintrusiivsed meeldetuletused (Aegis, Power/Bounty, Day/Night) mängukella järgi.',
            'Stack & Pull Helper: sünkroonitud stack/pull taimerid iga laagri kohta.',
            'Buyback & Economy: liitlaste buyback’i ja tarvikute (smoke, dust, TP) jälgimine ilma vastase infot lekitamata.',
            'Fight Timeline: trade’ide jälgimine koos 3 s no-trade hoiatustega ja eelisinfoga.',
            'Post-fight Digest: surmad/ultid/TP-d mõlema poole kohta push vs retreat otsusteks.',
            'Audio Spatial Director: eelistatud sammude/TP/ult helid mürasummutusega.',
            'Focus HUD: peidab kontekstuaalselt mittevajalikud näitajad 5–8 kriitilise sekundi jooksul.'
          ],
          notes: 'Overlayd värskenevad kuni 144 Hz, häälestatud Source 2 teamfight’idele ja avalikele reeglitele.'
        },
        heroSynergy: [
          { preset: 'Hyperfarm', coachingNotes: 'Stacki taimerid, buyback’i meeldetuletused ja turvalised rajad mid/late skaleerimiseks.' },
          { preset: 'Tempo', coachingNotes: 'Rune jälgimine, rotatsioonid ja Fight Timeline power spike’ide kindlustamiseks.' },
          { preset: 'Pressure', coachingNotes: 'Rotatsiooni juhendid, post-fight kokkuvõtted ja tower trade soovitused.' },
          { preset: 'Playmaker', coachingNotes: 'Stack & Pull Helper, wardingu vihjed ja Fight Timeline puhaste engage’ide jaoks.' },
          { preset: 'Vision', coachingNotes: 'Warding Planner, buyback majandus ja smoke/dust meeldetuletused.' }
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
                  <Link key={plan.id} href={`/${locale}/premium/signup?plan=${plan.id}`} className="group block">
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
            <Link href={`/${locale}/premium/signup?plan=${subscriptionPlans.find(p => p.popular)?.id ?? 'élite'}`} className="group inline-block">
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
