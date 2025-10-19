'use client'

import { useI18n } from '@/lib/i18n-simple'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Shield,
  Cpu,
  HeadphonesIcon,
  Cloud,
  Gamepad2,
  Settings,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SiteHeader from '@/components/SiteHeader'

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
  title: string
  description: string
  bullets: string[]
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

  const badge = servicesContent.badge ?? 'Services premium Hackboot'
  const title = servicesContent.title ?? 'Infrastructure & sécurité au niveau pro'
  const subtitle =
    servicesContent.subtitle ??
    'Des services sur-mesure pour les joueurs et équipes qui exigent la perfection.'
  const primaryCta = servicesContent.cta ?? 'Parler à un expert'

  const heroMetricFallback: ServicesMetric[] = [
    { id: 'uptime', value: '99.9%', label: 'Uptime garanti' },
    { id: 'clients', value: '120+', label: 'Clients pro actifs' },
    { id: 'regions', value: '8', label: 'Régions couvertes' },
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
      title: 'Sécurité proactive',
      description:
        'Protection multi-couches, audits continus et supervision anti-cheat pour rester indétectable.',
      bullets: [
        'Surveillance anti-cheat 24/7',
        'Kernel shield propriétaire',
        'Chiffrement E2E permanent',
      ],
    },
    {
      id: 'performance',
      icon: Cpu,
      gradient: 'from-blue-500 via-indigo-500 to-blue-600',
      title: 'Performance calibrée',
      description:
        'Clusters bare-metal, tuning GPU frame-by-frame et pipelines CI/CD pensés pour le compétitif.',
      bullets: [
        'Clusters bare-metal dédiés',
        'Optimisation GPU à la frame',
        'Monitoring de latence en direct',
      ],
    },
    {
      id: 'partnership',
      icon: HeadphonesIcon,
      gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
      title: 'Partenariat dédié',
      description:
        'Account manager senior, playbooks sur-mesure et support instantané sur nos canaux privés.',
      bullets: [
        'Account manager dédié',
        'Playbooks personnalisés',
        'Escalade instantanée sur Discord',
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
    title: servicesContent.pillarsHeading?.title ?? 'Nos piliers',
    subtitle:
      servicesContent.pillarsHeading?.subtitle ??
      'Une couverture complète du déploiement technique à l’accompagnement quotidien.',
  }

  const solutionDefaults: SolutionCard[] = [
    {
      id: 'cloud',
      icon: Cloud,
      gradient: 'from-sky-500 via-blue-600 to-indigo-600',
      title: 'Cloud Ops & Scaling',
      description:
        'Provisionnement automatisé multi-régions et pipelines CI/CD conçus pour le jeu compétitif.',
      link: `/${locale}/premium`,
      linkLabel: 'Voir les offres',
    },
    {
      id: 'competitive',
      icon: Gamepad2,
      gradient: 'from-purple-500 via-fuchsia-500 to-purple-600',
      title: 'Labs Anti-Cheat',
      description:
        'Reverse engineering continu, correctifs jour 0 et protocoles d’audit pour rester indétectable.',
      link: `/${locale}/games`,
      linkLabel: 'Explorer le catalogue',
    },
    {
      id: 'custom',
      icon: Settings,
      gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
      title: 'Coaching & Integrations',
      description:
        'Sessions 1:1, assistance en direct et intégrations personnalisées à vos outils existants.',
      link: `/${locale}/contact`,
      linkLabel: 'Planifier un call',
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
    title:
      servicesContent.solutions?.title ??
      'Des modules alignés sur vos objectifs',
    subtitle:
      servicesContent.solutions?.subtitle ??
      'Combinez nos briques pour un parcours fluide du déploiement initial à l’assistance quotidienne.',
  }

  const processFallback: ServicesStep[] = [
    {
      id: 'discover',
      title: 'Kick-off & audit',
      description:
        'Cartographie des besoins, objectifs de performance et contraintes de sécurité.',
    },
    {
      id: 'prototype',
      title: 'Prototype guidé',
      description:
        'Mise en place d’un environnement test avec préconfigurations adaptées à votre roster.',
    },
    {
      id: 'deploy',
      title: 'Déploiement orchestré',
      description:
        'Activation progressive, supervision conjointe et documentation de référence.',
    },
    {
      id: 'optimize',
      title: 'Optimisation continue',
      description:
        'Revues mensuelles, benchmarks et ajustements proactifs basés sur les retours terrain.',
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
    title: servicesContent.process?.title ?? 'Un cadre éprouvé',
    subtitle:
      servicesContent.process?.subtitle ??
      'Notre équipe vous accompagne de la découverte au maintien opérationnel sans rupture.',
  }

  const contactContent = servicesContent.contact ?? {}

  const contactMetricFallback: ServicesMetric[] = [
    { id: 'sla', value: '<5 min', label: 'Temps de réponse moyen' },
    { id: 'coverage', value: '24/7', label: 'Support global' },
    { id: 'satisfaction', value: '98 %', label: 'Satisfaction client' },
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
    'Un canal prioritaire Discord & WhatsApp est activé dès la signature.'

  const contactTitle = contactContent.title ?? 'Prendre rendez-vous'
  const contactDescription =
    contactContent.description ??
    'Nos équipes vous répondent sous 24h pour évaluer vos besoins et préparer un plan de déploiement.'
  const contactCta = contactContent.cta ?? 'Planifier un call'

  return (
    <div className="bg-black text-white min-h-screen">
      <SiteHeader />
      <main className="pt-24">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 blur-3xl" />
          <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col gap-12 animate-fade-in">
            <div className="max-w-4xl space-y-6">
              <span className="inline-flex items-center px-4 py-2 glass-effect rounded-full text-sm font-semibold">
                <span className="gradient-text block">{badge}</span>
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">{title}</h1>
              <p className="text-lg text-gray-300 max-w-2xl">{subtitle}</p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent/80"
                >
                  {primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                  {heroMetrics.map((metric) => (
                    <div key={metric.id} className="min-w-[120px]">
                      <p className="text-2xl font-display font-semibold text-white">{metric.value}</p>
                      <p>{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {pillars.map((pillar) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={pillar.id}
                    className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${pillar.gradient} p-[1px] animate-scale-in`}
                  >
                    <div className="h-full rounded-[calc(1.5rem-1px)] bg-black/90 p-6 space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                          <Icon className="h-6 w-6 text-accent" />
                        </div>
                        <h2 className="text-xl font-semibold">{pillar.title}</h2>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{pillar.description}</p>
                      <ul className="space-y-2 text-sm text-gray-200">
                        {pillar.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-display font-bold">{pillarsHeading.title}</h2>
              <p className="text-gray-300 max-w-3xl">{pillarsHeading.subtitle}</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20 animate-slide-up">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="text-sm uppercase tracking-[0.3em] text-accent">{badge}</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold">{solutionsHeading.title}</h2>
              <p className="text-gray-300">{solutionsHeading.subtitle}</p>
            </div>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {solutions.map((solution) => {
              const Icon = solution.icon
              return (
                <div
                  key={solution.id}
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${solution.gradient} p-[1px] transition-transform duration-300 hover:-translate-y-1`}
                >
                  <div className="h-full rounded-[calc(1.5rem-1px)] bg-black/90 p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="text-xl font-semibold">{solution.title}</h3>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{solution.description}</p>
                    <Link
                      href={solution.link}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                    >
                      {solution.linkLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="bg-white/5 py-20 animate-fade-in">
          <div className="container mx-auto px-6 space-y-12">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold">{processHeading.title}</h2>
              <p className="mx-auto max-w-3xl text-gray-300">{processHeading.subtitle}</p>
            </div>
            <div className="grid gap-8 lg:grid-cols-4">
              {processSteps.map((step, index) => (
                <div key={step.id} className="flex h-full flex-col gap-4 rounded-3xl bg-black/80 p-6 border border-white/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20 animate-scale-in">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 glass-effect">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-500/10" />
            <div className="relative z-10 grid gap-10 p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-display font-bold">{contactTitle}</h2>
                <p className="text-gray-300 max-w-2xl">{contactDescription}</p>
                <div className="grid gap-6 sm:grid-cols-3">
                  {contactMetrics.map((metric) => (
                    <div key={metric.id} className="rounded-2xl bg-black/70 p-4 border border-white/10">
                      <p className="text-2xl font-display font-semibold text-white">{metric.value}</p>
                      <p className="text-sm text-gray-300">{metric.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">{contactNote}</p>
              </div>
              <div className="flex flex-col gap-4">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent/80"
                >
                  {contactCta}
                </Link>
                <Link
                  href={`/${locale}/premium`}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white"
                >
                  {primaryCta}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
