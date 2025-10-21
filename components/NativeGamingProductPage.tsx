'use client'

import { useEffect, useMemo, useState } from 'react'
import { Star, Shield, Zap, Check, ArrowRight, Trophy, Gauge, Code, Target, TrendingUp, Activity, Cpu, Users, Lock, Wifi } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { GamingProduct, ProductVariant } from '@/lib/gaming-products'
import { getSubscriptionPlans } from '@/lib/subscriptions'
import type { SubscriptionPlan } from '@/lib/subscriptions'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'

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

const copyByLocale: Record<'fr' | 'en' | 'et', LocaleContent> = {
  fr: frenchCopy,
  en: englishCopy,
  et: englishCopy
}

type LocaleKey = keyof typeof copyByLocale

interface NativeGamingProductPageProps {
  product: GamingProduct
}

export default function NativeGamingProductPage({ product }: NativeGamingProductPageProps) {
  const pathname = usePathname()
  const locale = pathname.split('/')[1]
  const supportedLocales = ['fr', 'en', 'et'] as const
  const localeKey: LocaleKey = supportedLocales.includes(locale as LocaleKey) ? (locale as LocaleKey) : 'fr'
  const copy = copyByLocale[localeKey]

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

  const ProgressBar = ({ label, value, max, color = "purple", unit = "" }: { label: string, value: number, max: number, color?: string, unit?: string }) => {
    const percentage = (value / max) * 100
    const colorClasses = {
      purple: "bg-purple-500",
      green: "bg-green-500",
      blue: "bg-blue-500",
      orange: "bg-orange-500",
      red: "bg-red-500",
      cyan: "bg-cyan-500"
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">{label}</span>
          <span className="text-white font-semibold">{value}{unit}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  const StatCard = ({ icon: Icon, label, value, color = "purple" }: { icon: any, label: string, value: string | number, color?: string }) => {
    const colorClasses = {
      purple: "text-purple-400",
      green: "text-green-400",
      blue: "text-blue-400",
      orange: "text-orange-400",
      red: "text-red-400",
      cyan: "text-cyan-400"
    }

    return (
      <div className="p-6 glass-effect rounded-xl border border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 bg-${color}-500/20 rounded-lg`}>
            <Icon className={`w-5 h-5 ${colorClasses[color as keyof typeof colorClasses]}`} />
          </div>
          <span className="text-gray-400 text-sm">{label}</span>
        </div>
        <div className={`text-3xl font-bold ${colorClasses[color as keyof typeof colorClasses]}`}>
          {value}
        </div>
      </div>
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
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden glass-effect transition-transform duration-300">
              <img
                src={activeImage}
                alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                className="w-full h-auto max-h-[600px] object-contain"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {selectedVariant.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-purple-500 scale-105'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
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

            <div className="flex items-center gap-4">
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
            </div>

            {/* Quick Stats */}
            {tech?.performanceMetrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-white/10">
                <div className="p-3 glass-effect rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">{tech.performanceMetrics.avgFps}</div>
                  <div className="text-xs text-gray-400">{copy.quickStats.avgFps}</div>
                </div>
                <div className="p-3 glass-effect rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-400">{tech.performanceMetrics.onePercentLow ?? tech.performanceMetrics.minFps}</div>
                  <div className="text-xs text-gray-400">{copy.quickStats.onePercentLow}</div>
                </div>
                <div className="p-3 glass-effect rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">{tech.performanceMetrics.latency}ms</div>
                  <div className="text-xs text-gray-400">{copy.quickStats.latency}</div>
                </div>
                <div className="p-3 glass-effect rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">{tech.performanceMetrics.inputLag}ms</div>
                  <div className="text-xs text-gray-400">{copy.quickStats.inputLag}</div>
                </div>
              </div>
            )}

            {/* Subscription CTA */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="font-semibold text-xl">{copy.subscription.title}</h3>
              <div className="grid grid-cols-1 gap-4">
                {localizedSubscriptionPlans.map((plan) => (
                  <Link
                    key={plan.id}
                    href={`/${locale}/premium/signup`}
                    className="relative p-5 rounded-xl border border-white/10 hover:border-purple-500/50 glass-effect transition-all group"
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
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics Section */}
        {tech?.performanceMetrics && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full mb-4">
                <Activity className="w-5 h-5" />
                <span className="font-semibold">{copy.metrics.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.metrics.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.metrics.description}</p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={Gauge} label={copy.metrics.statCards.maxFps} value={tech.performanceMetrics.maxFps} color="green" />
                <StatCard
                  icon={Activity}
                  label={copy.metrics.statCards.onePercentLow}
                  value={tech.performanceMetrics.onePercentLow ?? tech.performanceMetrics.minFps}
                  color="orange"
                />
                <StatCard icon={Zap} label={copy.metrics.statCards.inputLag} value={`${tech.performanceMetrics.inputLag}ms`} color="blue" />
              </div>

              <div className="glass-effect rounded-2xl p-8 border border-white/10">
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
              </div>
            </div>
          </div>
        )}

        {tech?.fpsByResolution && tech.fpsByResolution.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">{copy.fpsTable.title}</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.fpsTable.description}</p>
            </div>
            <div className="glass-effect rounded-2xl p-6 border border-white/10 overflow-x-auto">
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
                    <tr key={idx} className="border-b border-white/10 last:border-none">
                      <td className="py-3 px-4 font-semibold text-white">{entry.resolution}</td>
                      <td className="py-3 px-4 text-center text-green-400 font-semibold">{entry.avgFps}</td>
                      <td className="py-3 px-4 text-center text-orange-400">{entry.minFps}</td>
                      <td className="py-3 px-4 text-center text-blue-400">{entry.maxFps}</td>
                      <td className="py-3 px-4 text-center text-gray-300">{entry.playability}</td>
                      <td className="py-3 px-4 text-center text-gray-400">{entry.bottleneck}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-500 mt-4">{copy.fpsTable.footnote}</p>
            </div>
          </div>
        )}

        {tech?.qualityBreakdown && tech.qualityBreakdown.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">{copy.quality.title}</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.quality.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tech.qualityBreakdown.map((quality, idx) => (
                <div key={idx} className="glass-effect rounded-2xl border border-white/10 p-6">
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
                </div>
              ))}
            </div>
          </div>
        )}

        {tech?.resolutionGuidance && tech.resolutionGuidance.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">{copy.resolution.title}</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.resolution.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tech.resolutionGuidance.map((entry, idx) => (
                <div key={idx} className="glass-effect rounded-2xl p-6 border border-white/10 flex flex-col h-full">
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
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-6 text-center">{copy.resolution.footnote}</p>
          </div>
        )}

        {tech?.performanceMetrics && (
          <div className="mt-16">
            <div className="glass-effect rounded-3xl border border-purple-500/30 bg-purple-500/5 p-8">
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
            </div>
          </div>
        )}

        

        {(tech?.improvementTips || tech?.advice) && (
          <div className="mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tech?.improvementTips && (
                <div className="glass-effect rounded-2xl border border-white/10 p-6">
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
                </div>
              )}
              {tech?.advice && (
                <div className="glass-effect rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    {copy.improvement.adviceTitle}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed">{tech.advice}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assistance Suite */}
        {tech?.augmentationSuite && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full mb-4">
                <Target className="w-5 h-5" />
                <span className="font-semibold">{copy.augmentation.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.augmentation.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.augmentation.description}</p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Target} label={copy.augmentation.awarenessLabel} value={`${tech.augmentationSuite.awarenessIndex}/100`} color="red" />
                <StatCard icon={Activity} label={copy.augmentation.overlayLabel} value={`${tech.augmentationSuite.overlayRefresh} Hz`} color="orange" />
                <StatCard icon={TrendingUp} label={copy.augmentation.coachingLabel} value={`${tech.augmentationSuite.adaptiveCoaching}%`} color="purple" />
                <StatCard icon={Gauge} label={copy.augmentation.focusLabel} value={`${tech.augmentationSuite.tacticalFocus}%`} color="blue" />
              </div>

              <div className="glass-effect rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4">{copy.augmentation.modulesTitle}</h3>
                    <div className="space-y-3">
                      {tech.augmentationSuite.modules.map((module, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                          <Check className="w-5 h-5 text-red-400 mt-0.5" />
                          <span className="text-gray-200">{module}</span>
                        </div>
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
              </div>
            </div>
          </div>
        )}

        {/* Legacy precision suite */}
        {!tech?.augmentationSuite && tech?.aimbotStats && copy.legacyPrecision && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full mb-4">
                <Target className="w-5 h-5" />
                <span className="font-semibold">{copy.legacyPrecision.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.legacyPrecision.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.legacyPrecision.description}</p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Target} label={copy.legacyPrecision.stats.tracking} value={`${tech.aimbotStats.predictionAccuracy}%`} color="red" />
                <StatCard icon={Activity} label={copy.legacyPrecision.stats.smoothness} value={`${tech.aimbotStats.smoothness}%`} color="orange" />
                <StatCard icon={Zap} label={copy.legacyPrecision.stats.fov} value={`${tech.aimbotStats.fov}°`} color="purple" />
                <StatCard icon={Gauge} label={copy.legacyPrecision.stats.switchTime} value={`${tech.aimbotStats.targetSwitchTime}s`} color="blue" />
              </div>

              <div className="glass-effect rounded-2xl p-8 border border-white/10">
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
                        <div key={idx} className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                          <Check className="w-5 h-5 text-purple-400" />
                          <span className="text-white capitalize">{bone}</span>
                        </div>
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
              </div>
            </div>
          </div>
        )}

        {/* Hero Synergy */}
        {tech?.heroSynergy && tech.heroSynergy.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full mb-4">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">{copy.hero.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.hero.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.hero.description}</p>
            </div>

            <div className="max-w-6xl mx-auto glass-effect rounded-2xl p-8 border border-white/10">
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
                      <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!tech?.heroSynergy && tech?.compatibilityMatrix && tech.compatibilityMatrix.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full mb-4">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">{copy.hero.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.hero.fallbackTitle}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.hero.fallbackDescription(product.game)}</p>
            </div>

            <div className="max-w-6xl mx-auto glass-effect rounded-2xl p-8 border border-white/10">
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
                      <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">{hero.hero}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-green-400 font-bold">{hero.effectiveness}%</span>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${hero.effectiveness}%` }}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


        {/* Reliability Metrics */}
        {tech?.securityMetrics && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full mb-4">
                <Lock className="w-5 h-5" />
                <span className="font-semibold">{copy.reliability.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.reliability.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.reliability.description}</p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-effect rounded-xl p-6 border border-green-500/30 bg-green-500/5">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">{tech.securityMetrics.detectionRate}%</div>
                    <div className="text-sm text-gray-400">{copy.reliability.cards.detection}</div>
                    <div className="mt-3 text-xs text-green-400">{copy.reliability.cards.detectionFootnote}</div>
                  </div>
                </div>
                <div className="glass-effect rounded-xl p-6 border border-blue-500/30 bg-blue-500/5">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">{tech.securityMetrics.uptimePercentage}%</div>
                    <div className="text-sm text-gray-400">{copy.reliability.cards.uptime}</div>
                    <div className="mt-3 text-xs text-blue-400">{copy.reliability.cards.uptimeFootnote}</div>
                  </div>
                </div>
                <div className="glass-effect rounded-xl p-6 border border-purple-500/30 bg-purple-500/5">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400 mb-2">{tech.securityMetrics.avgResponseTime}min</div>
                    <div className="text-sm text-gray-400">{copy.reliability.cards.response}</div>
                    <div className="mt-3 text-xs text-purple-400">{copy.reliability.cards.responseFootnote}</div>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-8 border border-white/10">
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
                          <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${item.enabled ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                            <div className={`w-3 h-3 rounded-full ${item.enabled ? 'bg-green-400' : 'bg-red-400'}`} />
                            <span className={item.enabled ? 'text-green-400' : 'text-red-400'}>{item.label}</span>
                            {item.enabled && <Check className="w-4 h-4 text-green-400 ml-auto" />}
                          </div>
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
              </div>
            </div>
          </div>
        )}

        {/* Network Stats */}
        {tech?.networkStats && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full mb-4">
                <Wifi className="w-5 h-5" />
                <span className="font-semibold">{copy.network.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.network.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.network.description(tech.networkStats.serverLocations)}</p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Wifi} label={copy.network.cards.servers} value={tech.networkStats.serverLocations} color="blue" />
                <StatCard icon={Zap} label={copy.network.cards.ping} value={`${tech.networkStats.avgPing}ms`} color="green" />
                <StatCard icon={Activity} label={copy.network.cards.loss} value={`${tech.networkStats.packetLoss}%`} color="purple" />
                <StatCard icon={Gauge} label={copy.network.cards.jitter} value={`${tech.networkStats.jitter}ms`} color="cyan" />
              </div>

              <div className="glass-effect rounded-2xl p-8 border border-white/10">
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
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400">
                      <Shield className="w-5 h-5" />
                      <span className="font-semibold">{copy.network.ddos}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User Stats */}
        {tech?.userStats && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full mb-4">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{copy.user.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.user.title(tech.userStats.totalUsers.toLocaleString(localeKey))}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{copy.user.subtitle}</p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="glass-effect rounded-xl p-6 border border-white/10 text-center">
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{tech.userStats.totalUsers.toLocaleString(localeKey)}</div>
                  <div className="text-sm text-gray-400">{copy.user.cards.total}</div>
                </div>
                <div className="glass-effect rounded-xl p-6 border border-white/10 text-center">
                  <Activity className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{tech.userStats.activeUsersLast30Days.toLocaleString(localeKey)}</div>
                  <div className="text-sm text-gray-400">{copy.user.cards.active}</div>
                </div>
                <div className="glass-effect rounded-xl p-6 border border-white/10 text-center">
                  <Gauge className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{tech.userStats.avgSessionDuration}h</div>
                  <div className="text-sm text-gray-400">{copy.user.cards.session}</div>
                </div>
                <div className="glass-effect rounded-xl p-6 border border-white/10 text-center">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{tech.userStats.avgGamesPerDay}</div>
                  <div className="text-sm text-gray-400">{copy.user.cards.games}</div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-effect rounded-xl p-8 border border-yellow-500/30 bg-yellow-500/5">
                  <div className="text-center">
                    <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <div className="text-5xl font-bold text-yellow-400 mb-2">{tech.userStats.satisfactionScore}/5</div>
                    <div className="text-gray-400">{copy.user.ratingLabel}</div>
                  </div>
                </div>
                <div className="glass-effect rounded-xl p-8 border border-green-500/30 bg-green-500/5">
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <div className="text-5xl font-bold text-green-400 mb-2">{tech.userStats.recommendationRate}%</div>
                    <div className="text-gray-400">{copy.user.recommendationLabel}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Native Advantages Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.nativeReasons.title}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{copy.nativeReasons.description(product.game)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {nativeAdvantages.map((advantage, idx) => {
              const Icon = advantage.icon
              return (
                <div key={idx} className="p-6 glass-effect rounded-xl border border-white/10 hover:border-purple-500/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{advantage.title}</h3>
                      <p className="text-gray-400 text-sm">{advantage.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Fonctionnalités */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.featuresTitle}</h2>
          </div>

          <div className="max-w-4xl mx-auto glass-effect rounded-2xl p-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedVariant.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center py-16 glass-effect rounded-2xl border border-white/10">
          <h2 className="text-4xl font-bold mb-6">{copy.cta.title(product.game)}</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{copy.cta.description}</p>
          <Link
            href={`/${locale}/premium/signup`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition-all"
          >
            {copy.cta.button}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
    <Footer />
  </div>
  )
}
