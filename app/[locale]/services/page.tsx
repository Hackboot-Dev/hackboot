'use client'

import { useMemo } from 'react'
import { useI18n } from '@/lib/i18n-simple'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Shield,
  Cpu,
  HeadphonesIcon,
  Cloud,
  ArrowRight,
  TrendingUp,
  Award,
  Rocket,
  Target,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SiteHeader from '@/components/SiteHeader'
import FlipCard3D from '@/components/services/FlipCard3D'
import AnimatedCounter from '@/components/services/AnimatedCounter'
import InteractiveTimeline from '@/components/services/InteractiveTimeline'
import ParticleBackground from '@/components/services/ParticleBackground'
import GlowingCard from '@/components/services/GlowingCard'
import MorphingShape from '@/components/services/MorphingShape'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-black" />,
  ssr: false,
})

type ServicesMetric = {
  id: string
  value: string
  label: string
}

type ServicesPillar = {
  id: string
  title: string
  description: string
  bullets: string[]
}

type ServicesSolution = {
  id: string
  title: string
  description: string
  linkLabel: string
}

type ServicesStep = {
  id: string
  title: string
  description: string
}

type PillarCard = {
  id: string
  icon: LucideIcon
  gradient: string
  iconColor: string
  title: string
  description: string
  bullets: string[]
  stats: { label: string; value: string }[]
  highlights: string[]
}

type SolutionCard = {
  id: string
  icon: LucideIcon
  gradient: string
  title: string
  description: string
  link: string
  linkLabel: string
}

type ServicesContent = {
  badge?: string
  title?: string
  subtitle?: string
  cta?: string
  metrics?: Partial<ServicesMetric>[]
  pillarsHeading?: {
    title?: string
    subtitle?: string
  }
  pillars?: Partial<ServicesPillar>[]
  solutions?: {
    title?: string
    subtitle?: string
    items?: Partial<ServicesSolution>[]
  }
  process?: {
    title?: string
    subtitle?: string
    steps?: Partial<ServicesStep>[]
  }
  contact?: {
    title?: string
    description?: string
    cta?: string
    metrics?: Partial<ServicesMetric>[]
    note?: string
  }
}

export default function ServicesPage() {
  const { t } = useI18n()
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const servicesContent = (t.services ?? {}) as ServicesContent

  const badge = servicesContent.badge ?? 'Services Premium'
  const title = servicesContent.title ?? 'Infrastructure & Sécurité'
  const subtitle =
    servicesContent.subtitle ??
    'Des services sur-mesure pour les joueurs et équipes qui exigent la perfection technique et la performance maximale.'
  const primaryCta = servicesContent.cta ?? 'Parler à un expert'

  const heroMetricFallback: ServicesMetric[] = [
    { id: 'uptime', value: '99.9%', label: 'Uptime garanti' },
    { id: 'clients', value: '500+', label: 'Clients satisfaits' },
    { id: 'regions', value: '12', label: 'Régions globales' },
    { id: 'support', value: '24/7', label: 'Support dédié' },
  ]
  const heroMetricsSource = Array.isArray(servicesContent.metrics)
    ? servicesContent.metrics
    : []
  const heroMetrics = heroMetricFallback.map((metric) => {
    const match = heroMetricsSource.find((item) => item?.id === metric.id)
    return {
      ...metric,
      value: match?.value ?? metric.value,
      label: match?.label ?? metric.label,
    }
  })

  const pillarDefaults: PillarCard[] = [
    {
      id: 'security',
      icon: Shield,
      gradient: 'from-purple-500 via-violet-500 to-purple-600',
      iconColor: 'text-purple-400',
      title: 'Sécurité Maximale',
      description:
        'Protection multi-couches avec supervision continue et technologies anti-détection de pointe pour une tranquillité totale.',
      bullets: [
        'Surveillance anti-cheat 24/7',
        'Kernel shield propriétaire',
        'Chiffrement E2E permanent',
      ],
      stats: [
        { label: 'Protection', value: 'Kernel-level' },
        { label: 'Détection', value: '0%' },
        { label: 'Uptime', value: '99.9%' },
        { label: 'Audits', value: 'Quotidiens' },
      ],
      highlights: [
        'Protection kernel-level avancée',
        'HWID spoofer intégré',
        'Bypass EAC/BE/Vanguard',
        'Stream-proof garanti',
        'Chiffrement bout en bout',
        'Monitoring en temps réel',
        'Alertes instantanées',
        'Backup automatique',
      ],
    },
    {
      id: 'performance',
      icon: Cpu,
      gradient: 'from-blue-500 via-indigo-500 to-blue-600',
      iconColor: 'text-blue-400',
      title: 'Performance Extrême',
      description:
        'Infrastructure bare-metal avec optimisation GPU frame-by-frame et pipelines CI/CD pensés pour le gaming compétitif.',
      bullets: [
        'Clusters bare-metal dédiés',
        'Optimisation GPU à la frame',
        'Monitoring de latence en direct',
      ],
      stats: [
        { label: 'CPU', value: 'i9-13900K' },
        { label: 'GPU', value: 'RTX 4090' },
        { label: 'RAM', value: '128GB DDR5' },
        { label: 'Latence', value: '<1ms' },
      ],
      highlights: [
        'Processeurs dernière génération',
        'GPU RTX 4090 dédiés',
        'RAM DDR5 ultra-rapide',
        'SSD NVMe Gen4',
        'Réseau 10Gbps',
        'Optimisation automatique',
        'Scaling instantané',
        'Zero downtime',
      ],
    },
    {
      id: 'partnership',
      icon: HeadphonesIcon,
      gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
      iconColor: 'text-emerald-400',
      title: 'Support Dédié',
      description:
        'Account manager personnel, playbooks sur-mesure et support prioritaire sur canaux privés Discord et WhatsApp.',
      bullets: [
        'Account manager dédié',
        'Playbooks personnalisés',
        'Escalade instantanée sur Discord',
      ],
      stats: [
        { label: 'Réponse', value: '<5min' },
        { label: 'Disponibilité', value: '24/7' },
        { label: 'Satisfaction', value: '98%' },
        { label: 'Résolution', value: '<30min' },
      ],
      highlights: [
        'Manager dédié à votre compte',
        'Canal Discord prioritaire',
        'Support WhatsApp direct',
        'Documentation personnalisée',
        'Formations régulières',
        'Veille technologique',
        'Recommendations proactives',
        'Revues mensuelles',
      ],
    },
    {
      id: 'infrastructure',
      icon: Cloud,
      gradient: 'from-cyan-500 via-sky-500 to-cyan-600',
      iconColor: 'text-cyan-400',
      title: 'Cloud Enterprise',
      description:
        'Infrastructure cloud redondante multi-régions avec provisionnement automatisé et scaling intelligent en temps réel.',
      bullets: [
        'Multi-régions global',
        'Auto-scaling intelligent',
        'Déploiement automatisé',
      ],
      stats: [
        { label: 'Régions', value: '12+' },
        { label: 'Uptime', value: '99.99%' },
        { label: 'Déploiement', value: '<2min' },
        { label: 'Backup', value: 'Temps réel' },
      ],
      highlights: [
        'Présence dans 12 régions',
        'Load balancing automatique',
        'CDN global optimisé',
        'Disaster recovery',
        'Backup redondant',
        'Migration à chaud',
        'Scaling élastique',
        'Monitoring avancé',
      ],
    },
    {
      id: 'analytics',
      icon: TrendingUp,
      gradient: 'from-amber-500 via-yellow-500 to-amber-600',
      iconColor: 'text-amber-400',
      title: 'Analytics & Insights',
      description:
        'Tableaux de bord en temps réel avec métriques de performance détaillées et rapports d\'optimisation personnalisés.',
      bullets: [
        'Dashboard temps réel',
        'Métriques détaillées',
        'Rapports personnalisés',
      ],
      stats: [
        { label: 'Métriques', value: '50+' },
        { label: 'Refresh', value: 'Temps réel' },
        { label: 'Historique', value: '6 mois' },
        { label: 'Exports', value: 'Illimités' },
      ],
      highlights: [
        'Dashboard interactif',
        'KPIs personnalisables',
        'Alertes intelligentes',
        'Rapports automatiques',
        'Comparaisons périodiques',
        'Prédictions IA',
        'Export données brutes',
        'API complète',
      ],
    },
    {
      id: 'compliance',
      icon: Award,
      gradient: 'from-pink-500 via-rose-500 to-pink-600',
      iconColor: 'text-pink-400',
      title: 'Conformité & Certifications',
      description:
        'Infrastructure certifiée aux standards internationaux avec audits réguliers et conformité RGPD garantie.',
      bullets: [
        'Certifications ISO',
        'Conformité RGPD',
        'Audits trimestriels',
      ],
      stats: [
        { label: 'Certifs', value: 'ISO 27001' },
        { label: 'RGPD', value: 'Conforme' },
        { label: 'Audits', value: 'Trimestriels' },
        { label: 'SOC', value: 'Type II' },
      ],
      highlights: [
        'Certification ISO 27001',
        'SOC 2 Type II compliant',
        'RGPD full compliance',
        'Audits indépendants',
        'Documentation complète',
        'Formation équipes',
        'Politiques mises à jour',
        'Transparence totale',
      ],
    },
  ]

  const pillarSource = Array.isArray(servicesContent.pillars)
    ? servicesContent.pillars
    : []
  const pillars = pillarDefaults.map((pillar) => {
    const match = pillarSource.find((item) => item?.id === pillar.id)
    return {
      ...pillar,
      title: match?.title ?? pillar.title,
      description: match?.description ?? pillar.description,
      bullets:
        Array.isArray(match?.bullets) && match?.bullets?.length
          ? (match?.bullets as string[])
          : pillar.bullets,
    }
  })

  const pillarsHeading = {
    title: servicesContent.pillarsHeading?.title ?? 'Nos Services Premium',
    subtitle:
      servicesContent.pillarsHeading?.subtitle ??
      'Une suite complète de services professionnels pour maximiser vos performances et votre sécurité.',
  }

  const solutionDefaults: SolutionCard[] = [
    {
      id: 'cloud',
      icon: Rocket,
      gradient: 'from-sky-500 via-blue-600 to-indigo-600',
      title: 'Cloud Gaming Infrastructure',
      description:
        'Infrastructure cloud complète avec machines virtuelles optimisées, auto-scaling intelligent et déploiement multi-régions instantané.',
      link: `/${locale}/premium`,
      linkLabel: 'Découvrir Premium',
    },
    {
      id: 'competitive',
      icon: Target,
      gradient: 'from-purple-500 via-fuchsia-500 to-purple-600',
      title: 'Solutions Anti-Cheat',
      description:
        'Protection avancée avec reverse engineering continu, correctifs jour zéro et protocoles d\'audit pour rester indétectable sur tous les anti-cheats.',
      link: `/${locale}/games`,
      linkLabel: 'Voir les jeux',
    },
    {
      id: 'custom',
      icon: Users,
      gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
      title: 'Coaching & Intégrations',
      description:
        'Accompagnement personnalisé avec sessions 1:1, assistance en direct, intégrations API sur-mesure et formation continue de vos équipes.',
      link: `/${locale}/contact`,
      linkLabel: 'Nous contacter',
    },
  ]

  const solutionsSource = servicesContent.solutions?.items ?? []
  const solutions = solutionDefaults.map((solution) => {
    const match = solutionsSource.find((item) => item?.id === solution.id)
    return {
      ...solution,
      title: match?.title ?? solution.title,
      description: match?.description ?? solution.description,
      linkLabel: match?.linkLabel ?? solution.linkLabel,
    }
  })

  const solutionsHeading = {
    title: servicesContent.solutions?.title ?? 'Solutions Complètes',
    subtitle:
      servicesContent.solutions?.subtitle ??
      'Des modules flexibles qui s\'intègrent parfaitement à votre workflow pour un écosystème gaming complet.',
  }

  const processFallback = [
    {
      id: 'discover',
      title: 'Découverte & Audit',
      description:
        'Analyse approfondie de vos besoins, objectifs de performance et contraintes techniques pour créer une solution parfaitement adaptée.',
    },
    {
      id: 'prototype',
      title: 'Prototype & Test',
      description:
        'Mise en place d\'un environnement de test avec configurations optimisées et validation complète avant déploiement production.',
    },
    {
      id: 'deploy',
      title: 'Déploiement Production',
      description:
        'Migration progressive avec supervision continue, formation de vos équipes et documentation technique complète.',
    },
    {
      id: 'optimize',
      title: 'Optimisation Continue',
      description:
        'Monitoring permanent, revues mensuelles, ajustements proactifs et évolution de l\'infrastructure selon vos besoins.',
    },
  ]

  const processSource = servicesContent.process?.steps ?? []
  const processSteps = processFallback.map((step) => {
    const match = processSource.find((item) => item?.id === step.id)
    return {
      ...step,
      title: match?.title ?? step.title,
      description: match?.description ?? step.description,
    }
  })

  const processHeading = {
    title: servicesContent.process?.title ?? 'Notre Méthodologie',
    subtitle:
      servicesContent.process?.subtitle ??
      'Un processus éprouvé qui garantit une intégration fluide et des résultats mesurables dès le premier jour.',
  }

  const contactContent = servicesContent.contact ?? {}

  const contactMetricFallback: ServicesMetric[] = [
    { id: 'sla', value: '5', label: 'Temps de réponse (min)' },
    { id: 'coverage', value: '365', label: 'Jours par an' },
    { id: 'satisfaction', value: '98', label: 'Satisfaction (%)' },
  ]

  const contactMetricsSource = Array.isArray(contactContent.metrics)
    ? contactContent.metrics
    : []
  const contactMetrics = contactMetricFallback.map((metric) => {
    const match = contactMetricsSource.find((item) => item?.id === metric.id)
    return {
      ...metric,
      value: match?.value ?? metric.value,
      label: match?.label ?? metric.label,
    }
  })

  const contactNote =
    contactContent.note ??
    'Un canal prioritaire Discord & WhatsApp est activé dès la signature du contrat.'

  const contactTitle = contactContent.title ?? 'Prêt à démarrer ?'
  const contactDescription =
    contactContent.description ??
    'Notre équipe vous répond sous 24h pour évaluer vos besoins et préparer un plan d\'action personnalisé.'
  const contactCta = contactContent.cta ?? 'Planifier un call'

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden animate-fade-in">
      <SiteHeader />

      {/* Background Effects */}
      <ParticleBackground />
      <MorphingShape />

      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ zIndex: 1 }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative pt-32 pb-20" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-scale-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full mb-6">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">{badge}</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">
                {title}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              {subtitle}
            </p>

            {/* Animated Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              {heroMetrics.map((metric) => (
                <AnimatedCounter
                  key={metric.id}
                  value={metric.value}
                  label={metric.label}
                />
              ))}
            </div>

            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-600 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform"
            >
              {primaryCta}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Pillars Title */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                {pillarsHeading.title}
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {pillarsHeading.subtitle}
            </p>
          </div>

          {/* Flip Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 animate-slide-up">
            {pillars.map((pillar) => (
              <FlipCard3D
                key={pillar.id}
                icon={pillar.icon}
                gradient={pillar.gradient}
                iconColor={pillar.iconColor}
                title={pillar.title}
                description={pillar.description}
                bullets={pillar.bullets}
                stats={pillar.stats}
                highlights={pillar.highlights}
              />
            ))}
          </div>

          {/* Solutions Section */}
          <div className="mb-20 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-600">
                  {solutionsHeading.title}
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                {solutionsHeading.subtitle}
              </p>
            </div>

            {/* Glowing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {solutions.map((solution) => (
                <GlowingCard
                  key={solution.id}
                  icon={solution.icon}
                  gradient={solution.gradient}
                  title={solution.title}
                  description={solution.description}
                  link={solution.link}
                  linkLabel={solution.linkLabel}
                />
              ))}
            </div>
          </div>

          {/* Process Section - Interactive Timeline */}
          <div className="mb-20 animate-slide-up">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-600">
                  {processHeading.title}
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                {processHeading.subtitle}
              </p>
            </div>

            <InteractiveTimeline steps={processSteps} />
          </div>

          {/* CTA Section */}
          <div className="animate-scale-in">
            <div className="glass-effect rounded-3xl p-12 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-2 border-purple-500/20">
              <div className="text-center mb-8">
                <Shield className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl font-black mb-4">
                  {contactTitle}
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  {contactDescription}
                </p>

                {/* Contact Metrics with Animation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
                  {contactMetrics.map((metric) => (
                    <AnimatedCounter
                      key={metric.id}
                      value={metric.value}
                      label={metric.label}
                      duration={1.5}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-400 mb-8">{contactNote}</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={`/${locale}/contact`}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-600 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                    {contactCta}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href={`/${locale}/premium`}
                    className="px-8 py-4 glass-effect rounded-full text-lg font-medium hover:bg-white/10 transition-all"
                  >
                    Voir les offres
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
