'use client'

import { useMemo, useState } from 'react'
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Shield,
  Cpu,
  HeadphonesIcon,
  Cloud,
  Rocket,
  Target,
  Users,
  Sparkles,
  Compass,
  Layers,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SiteHeader from '@/components/SiteHeader'
import { useI18n } from '@/lib/i18n-simple'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-24 bg-black" />,
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

type PillarBlueprint = {
  id: string
  icon: LucideIcon
  label: string
  accent: string
  stats: { label: string; value: string }[]
  defaultDescription: string
  defaultBullets: string[]
}

type SolutionBlueprint = {
  id: string
  icon: LucideIcon
  accent: string
  defaultTitle: string
  defaultDescription: string
  defaultLinkLabel: string
  linkBuilder: (locale: string) => string
}

const HERO_METRIC_FALLBACK: ServicesMetric[] = [
  { id: 'uptime', value: '99,9 %', label: 'Disponibilité garantie' },
  { id: 'clients', value: '120+', label: 'Clients pro accompagnés' },
  { id: 'regions', value: '8', label: 'Régions cloud actives' },
  { id: 'sla', value: '<5 min', label: 'SLA support moyen' },
]

const PILLAR_BLUEPRINTS: PillarBlueprint[] = [
  {
    id: 'security',
    icon: Shield,
    label: 'Sécurité proactive',
    accent: 'from-purple-500/90 to-purple-700/60',
    stats: [
      { label: 'Kernel shield', value: 'Propriétaire' },
      { label: 'Audits', value: 'Quotidiens' },
      { label: 'Détection', value: '0%' },
    ],
    defaultDescription:
      'Protection multi-couches, supervision anti-détection et chiffrement bout en bout.',
    defaultBullets: [
      'Surveillance continue et audits dynamiques',
      'Gestion proactive des incidents',
      'Playbooks de mitigation personnalisés',
    ],
  },
  {
    id: 'performance',
    icon: Cpu,
    label: 'Performance calibrée',
    accent: 'from-sky-500/90 to-indigo-700/60',
    stats: [
      { label: 'GPU', value: 'RTX 4090' },
      { label: 'Latency', value: '<1 ms' },
      { label: 'Scaling', value: 'Instantané' },
    ],
    defaultDescription:
      'Clusters bare-metal optimisés, pipeline CI/CD gaming et monitoring temps réel.',
    defaultBullets: [
      'Optimisation GPU frame-by-frame',
      'Auto-scaling multi-régions',
      'Benchmarks et rapports mensuels',
    ],
  },
  {
    id: 'partnership',
    icon: HeadphonesIcon,
    label: 'Support dédié',
    accent: 'from-emerald-500/90 to-teal-700/60',
    stats: [
      { label: 'Réponse', value: '<5 min' },
      { label: 'Disponibilité', value: '24/7' },
      { label: 'Satisfaction', value: '98%' },
    ],
    defaultDescription:
      'Account manager senior, escalade prioritaire et canaux privés Discord/WhatsApp.',
    defaultBullets: [
      'Veille & recommandations proactives',
      'Workshops adaptés à votre roster',
      'Documentation personnalisée',
    ],
  },
  {
    id: 'infrastructure',
    icon: Cloud,
    label: 'Cloud orchestration',
    accent: 'from-cyan-500/90 to-slate-700/60',
    stats: [
      { label: 'Régions', value: '12+' },
      { label: 'Uptime', value: '99.99%' },
      { label: 'Déploiement', value: '<2 min' },
    ],
    defaultDescription:
      'Provisionnement instantané, bascule automatique de région et sauvegardes en continu.',
    defaultBullets: [
      'Réseau 10 Gbps sécurisé',
      'Disaster recovery automatisé',
      'Intégration API PulseForge',
    ],
  },
]

const SOLUTION_BLUEPRINTS: SolutionBlueprint[] = [
  {
    id: 'cloud',
    icon: Rocket,
    accent: 'from-blue-500/90 to-purple-500/60',
    defaultTitle: 'Cloud Ops & Scaling',
    defaultDescription:
      'Provisionnement automatisé, régions multiples et pipelines CI/CD prêts pour PulseForge.',
    defaultLinkLabel: 'Découvrir Premium',
    linkBuilder: (locale) => `/${locale}/premium`,
  },
  {
    id: 'competitive',
    icon: Target,
    accent: 'from-rose-500/90 to-orange-500/60',
    defaultTitle: 'Labs Anti-Cheat',
    defaultDescription:
      'Reverse engineering continu, correctifs jour zéro et protocoles d’audit conformes.',
    defaultLinkLabel: 'Voir les jeux',
    linkBuilder: (locale) => `/${locale}/games`,
  },
  {
    id: 'custom',
    icon: Users,
    accent: 'from-emerald-500/90 to-cyan-500/60',
    defaultTitle: 'Coaching & Integrations',
    defaultDescription:
      'Sessions 1:1, assistance en direct et intégrations personnalisées dans vos outils.',
    defaultLinkLabel: 'Planifier un call',
    linkBuilder: (locale) => `/${locale}/contact`,
  },
]

const PROCESS_FALLBACK: ServicesStep[] = [
  {
    id: 'discover',
    title: 'Kick-off & audit',
    description:
      'Analyse de votre roster, objectifs de performance et contraintes de sécurité.',
  },
  {
    id: 'prototype',
    title: 'Prototype guidé',
    description:
      'Instance pilote PulseForge avec profils calibrés et supervision conjointe.',
  },
  {
    id: 'deploy',
    title: 'Déploiement orchestré',
    description:
      'Activation progressive, documentation et transfert de compétences.',
  },
  {
    id: 'optimize',
    title: 'Optimisation continue',
    description:
      'Revues, benchmarks et évolution proactive selon vos retours terrain.',
  },
]

const CONTACT_METRIC_FALLBACK: ServicesMetric[] = [
  { id: 'sla', value: '<5 min', label: 'Temps de réponse moyen' },
  { id: 'coverage', value: '24/7', label: 'Support global' },
  { id: 'satisfaction', value: '98 %', label: 'Satisfaction client' },
]

const heroReveal = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
}

const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

const cardReveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export default function ServicesPage() {
  const { t } = useI18n()
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const servicesContent = (t.services ?? {}) as ServicesContent
  const shouldReduceMotion = useReducedMotion()

  const badge = servicesContent.badge ?? 'Services PulseForge'
  const title =
    servicesContent.title ??
    'Infrastructure et sécurité professionnelles pour vos opérations gaming'
  const subtitle =
    servicesContent.subtitle ??
    'Nous combinons cloud, sécurité et coaching technique pour déployer des expériences PulseForge irréprochables.'
  const primaryCta = servicesContent.cta ?? 'Parler à un expert'

  const heroMetrics = HERO_METRIC_FALLBACK.map((metric) => {
    const match = Array.isArray(servicesContent.metrics)
      ? servicesContent.metrics.find((item) => item?.id === metric.id)
      : undefined
    return {
      ...metric,
      value: match?.value ?? metric.value,
      label: match?.label ?? metric.label,
    }
  })

  const pillars = useMemo(() => {
    const source = Array.isArray(servicesContent.pillars)
      ? servicesContent.pillars
      : []
    return PILLAR_BLUEPRINTS.map((pillar) => {
      const match = source.find((item) => item?.id === pillar.id)
      return {
        ...pillar,
        title: match?.title ?? pillar.label,
        description: match?.description ?? pillar.defaultDescription,
        bullets:
          Array.isArray(match?.bullets) && match?.bullets?.length
            ? (match?.bullets as string[])
            : pillar.defaultBullets,
      }
    })
  }, [servicesContent.pillars])

  const [activePillarId, setActivePillarId] = useState<string>(
    () => PILLAR_BLUEPRINTS[0]?.id ?? 'security',
  )

  const fallbackPillar = useMemo(() => {
    const blueprint = PILLAR_BLUEPRINTS[0]
    return {
      ...blueprint,
      title: blueprint.label,
      description: blueprint.defaultDescription,
      bullets: blueprint.defaultBullets,
    }
  }, [])

  const activePillar = pillars.find((pillar) => pillar.id === activePillarId)
  const displayedPillar = activePillar ?? fallbackPillar

  const pillarsHeading = {
    title:
      servicesContent.pillarsHeading?.title ?? 'Des fondations pensées pour le pro',
    subtitle:
      servicesContent.pillarsHeading?.subtitle ??
      'Chaque pilier combine nos briques cloud, sécurité et support pour une exécution PulseForge sans faille.',
  }

  const solutions = useMemo(() => {
    const source = Array.isArray(servicesContent.solutions?.items)
      ? servicesContent.solutions?.items ?? []
      : []
    return SOLUTION_BLUEPRINTS.map((solution) => {
      const match = source.find((item) => item?.id === solution.id)
      return {
        ...solution,
        title: match?.title ?? solution.defaultTitle,
        description: match?.description ?? solution.defaultDescription,
        linkLabel: match?.linkLabel ?? solution.defaultLinkLabel,
        link: solution.linkBuilder(locale),
      }
    })
  }, [servicesContent.solutions?.items, locale])

  const solutionsHeading = {
    title: servicesContent.solutions?.title ?? 'Modules prêts à activer',
    subtitle:
      servicesContent.solutions?.subtitle ??
      'Composez votre stack PulseForge en sélectionnant les modules adaptés à vos besoins opérationnels.',
  }

  const processSteps = useMemo(() => {
    const source = Array.isArray(servicesContent.process?.steps)
      ? servicesContent.process?.steps ?? []
      : []
    return PROCESS_FALLBACK.map((step) => {
      const match = source.find((item) => item?.id === step.id)
      return {
        ...step,
        title: match?.title ?? step.title,
        description: match?.description ?? step.description,
      }
    })
  }, [servicesContent.process?.steps])

  const processHeading = {
    title: servicesContent.process?.title ?? 'Notre méthode accompagnée',
    subtitle:
      servicesContent.process?.subtitle ??
      'Un cadre en quatre phases pour intégrer PulseForge sans rupture et avec un pilotage constant.',
  }

  const contactContent = servicesContent.contact ?? {}

  const contactMetrics = useMemo(() => {
    const source = Array.isArray(contactContent.metrics)
      ? contactContent.metrics
      : []
    return CONTACT_METRIC_FALLBACK.map((metric) => {
      const match = source.find((item) => item?.id === metric.id)
      return {
        ...metric,
        value: match?.value ?? metric.value,
        label: match?.label ?? metric.label,
      }
    })
  }, [contactContent.metrics])

  const contactTitle =
    contactContent.title ?? 'Prêt à lancer votre build PulseForge ?'
  const contactDescription =
    contactContent.description ??
    'Nos ingénieurs vous répondent sous 24 h pour cadrer les besoins, planifier les tests et verrouiller la mise en production.'
  const contactCta = contactContent.cta ?? 'Planifier un call dédié'
  const contactNote =
    contactContent.note ??
    'Un canal prioritaire (Discord + WhatsApp) est ouvert dès la signature pour les escalades critiques.'

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      <SiteHeader />
      <LazyMotion features={domAnimation}>
        <main className="relative flex-1 overflow-hidden pt-28 pb-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.14),_transparent_55%)]" />

          <section className="relative z-10">
            <div className="mx-auto w-full max-w-6xl px-6">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
                <div className="space-y-8">
                  <m.div
                    className="inline-flex items-center gap-2 glass-effect rounded-full px-4 py-1 text-sm text-purple-200"
                    initial="hidden"
                    animate="show"
                    variants={heroReveal}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <Sparkles className="h-4 w-4" />
                    {badge}
                  </m.div>

                  <m.h1
                    className="max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl"
                    initial="hidden"
                    animate="show"
                    variants={heroReveal}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.05 }}
                  >
                    <span className="gradient-text">{title}</span>
                  </m.h1>

                  <m.p
                    className="max-w-3xl text-lg text-slate-300 sm:text-xl"
                    initial="hidden"
                    animate="show"
                    variants={heroReveal}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.12 }}
                  >
                    {subtitle}
                  </m.p>

                  <m.div
                    className="flex flex-col items-start gap-4 sm:flex-row"
                    initial="hidden"
                    animate="show"
                    variants={heroReveal}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.18 }}
                  >
                    <Link
                      href={`/${locale}/contact`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 px-6 py-3 text-base font-semibold shadow-lg shadow-sky-500/30 transition-transform duration-200 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                    >
                      {primaryCta}
                    </Link>
                    <Link
                      href={`/${locale}/premium`}
                      className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-3 text-base font-semibold text-slate-200 transition duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                    >
                      Explorer les offres
                    </Link>
                  </m.div>
                </div>

                <m.div
                  className="grid gap-4 sm:grid-cols-2 lg:self-center"
                  initial="hidden"
                  animate="show"
                  variants={heroReveal}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.24 }}
                >
                  {heroMetrics.map((metric, index) => (
                    <m.div
                      key={metric.id}
                      className="glass-effect relative overflow-hidden rounded-3xl px-6 py-5"
                      initial="hidden"
                      animate="show"
                      variants={cardReveal}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.05 }}
                      whileHover=
                        {shouldReduceMotion
                          ? undefined
                          : { y: -6, scale: 1.01, transition: { type: 'spring', stiffness: 220, damping: 20 } }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" aria-hidden />
                      <p className="text-sm uppercase tracking-wide text-slate-300">{metric.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{metric.value}</p>
                    </m.div>
                  ))}
                </m.div>
              </div>
            </div>
          </section>

          <section className="relative z-10 py-24">
            <div className="mx-auto w-full max-w-6xl px-6">
              <m.div
                className="max-w-3xl"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionReveal}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Pillars</p>
                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                  <span className="gradient-text">{pillarsHeading.title}</span>
                </h2>
                <p className="mt-4 text-lg text-slate-300">{pillarsHeading.subtitle}</p>
              </m.div>

              <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
                <div className="flex flex-col gap-3">
                  {pillars.map((pillar) => {
                    const Icon = pillar.icon
                    const isActive = pillar.id === activePillarId
                    return (
                      <button
                        key={pillar.id}
                        type="button"
                        onClick={() => setActivePillarId(pillar.id)}
                        className={`group relative flex min-w-[220px] items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 ${
                          isActive
                            ? 'bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.18)]'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div
                          className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${pillar.accent} transition-transform duration-200 ${
                            isActive && !shouldReduceMotion ? 'scale-105' : 'group-hover:scale-105'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{pillar.title}</p>
                          <p className="text-xs text-slate-300">{pillar.label}</p>
                        </div>
                        <div
                          className={`pointer-events-none absolute inset-0 rounded-2xl border border-white/0 transition ${
                            isActive ? 'border-white/20 shadow-[0_15px_35px_-12px_rgba(99,102,241,0.45)]' : 'group-hover:border-white/10'
                          }`}
                          aria-hidden
                        />
                      </button>
                    )
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <m.div
                    key={displayedPillar.id}
                    className="glass-effect relative overflow-hidden rounded-3xl border border-white/15 p-8"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
                    transition={shouldReduceMotion ? undefined : { duration: 0.35, ease: 'easeOut' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" aria-hidden />
                    <div className="relative z-10">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="max-w-2xl">
                          <h3 className="text-2xl font-semibold text-white sm:text-3xl">{displayedPillar.title}</h3>
                          <p className="mt-3 text-base text-slate-300 sm:text-lg">{displayedPillar.description}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3 rounded-2xl glass-effect border border-white/10 bg-black/40 p-4">
                          {displayedPillar.stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                              <p className="text-sm text-slate-300">{stat.label}</p>
                              <p className="mt-1 text-lg font-semibold text-white">{stat.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        {displayedPillar.bullets.map((bullet, index) => (
                          <m.div
                            key={bullet}
                            className="glass-effect flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-200"
                            initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
                            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                            transition={shouldReduceMotion ? undefined : { duration: 0.3, ease: 'easeOut', delay: index * 0.05 }}
                          >
                            <Layers className="h-4 w-4 text-emerald-300" />
                            {bullet}
                          </m.div>
                        ))}
                      </div>
                    </div>
                  </m.div>
                </AnimatePresence>
              </div>
            </div>
          </section>

          <section className="relative z-10 py-24">
            <div className="mx-auto w-full max-w-6xl px-6">
              <m.div
                className="max-w-3xl"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionReveal}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Modules</p>
                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                  <span className="gradient-text">{solutionsHeading.title}</span>
                </h2>
                <p className="mt-4 text-lg text-slate-300">{solutionsHeading.subtitle}</p>
              </m.div>

              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {solutions.map((solution, index) => {
                  const Icon = solution.icon
                  return (
                    <m.article
                      key={solution.id}
                      className="group relative flex h-full flex-col overflow-hidden rounded-3xl glass-effect border border-white/10 p-7"
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.3 }}
                      variants={cardReveal}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.05 }}
                      whileHover=
                        {shouldReduceMotion
                          ? undefined
                          : {
                              y: -8,
                              transition: { type: 'spring', stiffness: 220, damping: 24 },
                            }}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${solution.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-40`}
                        aria-hidden
                      />
                      <div className="relative z-10 flex flex-1 flex-col">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-white">{solution.title}</h3>
                        <p className="mt-3 text-sm text-slate-200 sm:text-base">{solution.description}</p>
                        <div className="mt-auto pt-6">
                          <Link
                            href={solution.link}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 transition-colors duration-200 hover:text-white"
                          >
                            {solution.linkLabel}
                            <Compass className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </m.article>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="relative z-10 border-y border-white/5 bg-white/[0.03] py-24">
            <div className="mx-auto w-full max-w-6xl px-6">
              <m.div
                className="max-w-3xl"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionReveal}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Process</p>
                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                  <span className="gradient-text">{processHeading.title}</span>
                </h2>
                <p className="mt-4 text-lg text-slate-300">{processHeading.subtitle}</p>
              </m.div>

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {processSteps.map((step, index) => (
                  <m.div
                    key={step.id}
                    className="glass-effect relative overflow-hidden rounded-3xl border border-white/10 p-6"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={cardReveal}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.04 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" aria-hidden />
                    <div className="relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-base font-semibold text-white">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                      </div>
                      <p className="mt-4 text-sm text-slate-200 sm:text-base">{step.description}</p>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative z-10 py-24">
            <div className="mx-auto w-full max-w-5xl px-6">
              <m.div
                className="glass-effect overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-sky-500/15 to-emerald-500/15 p-10"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionReveal}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-200">Contact</p>
                    <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">{contactTitle}</h2>
                    <p className="mt-3 text-base text-slate-100 sm:text-lg">{contactDescription}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {contactMetrics.map((metric) => (
                      <div key={metric.id} className="glass-effect rounded-2xl px-4 py-3 text-center">
                        <p className="text-xs uppercase tracking-wide text-slate-300">{metric.label}</p>
                        <p className="mt-2 text-lg font-semibold text-white sm:text-xl">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 transition-transform duration-200 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {contactCta}
                  </Link>
                  <p className="text-sm text-slate-100">{contactNote}</p>
                </div>
              </m.div>
            </div>
          </section>
        </main>
      </LazyMotion>
      <Footer />
    </div>
  )
}
