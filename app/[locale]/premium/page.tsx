'use client'

import { useMemo, useState, type ComponentType, type ElementType, type MouseEvent } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import {
  X,
  Crown,
  Zap,
  Cpu,
  Gamepad2,
  MonitorPlay,
  Shield,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useI18n } from '@/lib/i18n-simple'
import SiteHeader from '@/components/SiteHeader'
import DesignBackdrop from '@/components/DesignBackdrop'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-black" />,
  ssr: false,
})

interface Feature {
  id: string
  icon: ElementType
  title: string
  subtitle: string
  description: string
  stats: {
    label: string
    value: string
  }[]
  highlights: string[]
  gradient: string
  iconColor: string
}

interface PremiumMetric {
  id: string
  value: string
  label: string
}

interface PremiumPlan {
  id: string
  name: string
  description: string
  billing: string
  features: string[]
  gradient: string
  accent: string
}

export default function PremiumPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { t } = useI18n()
  const premiumContent = t.premium ?? {}
  const featureSource = premiumContent.features as Record<string, Partial<Omit<Feature, 'id' | 'icon' | 'gradient' | 'iconColor'>>> | undefined
  const featureContent = useMemo(
    () => featureSource ?? {},
    [featureSource],
  )
  const premiumBenefits = premiumContent.benefits as string[] | undefined
  const premiumPlans = premiumContent.plans as Record<string, Partial<Omit<PremiumPlan, 'id' | 'gradient' | 'accent'>>> | undefined

  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)

  const heroMetrics = useMemo(() => {
    const metricFallback: PremiumMetric[] = [
      { id: 'uptime', value: '99.9%', label: 'Disponibilité garantie' },
      { id: 'latency', value: '<5ms', label: 'Latence mesurée UE' },
      { id: 'response', value: '30min', label: 'Temps de réponse support' },
    ]

    const source = Array.isArray(premiumContent.metrics) ? premiumContent.metrics : []

    return metricFallback.map((metric) => {
      const match = source.find((item: Partial<PremiumMetric>) => item?.id === metric.id)
      return {
        ...metric,
        value: match?.value ?? metric.value,
        label: match?.label ?? metric.label,
      }
    })
  }, [premiumContent.metrics])

  const plans = useMemo<PremiumPlan[]>(() => {
    const defaults: Record<string, PremiumPlan> = {
      essentiel: {
        id: 'essentiel',
        name: 'Pack Essentiel',
        description: 'Performances fiables et accès complet au configurateur pour démarrer immédiatement.',
        billing: 'par mois',
        features: [
          "Accès à l'infrastructure cloud standard",
          'Support communautaire',
          'Mises à jour de sécurité régulières',
        ],
        gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
        accent: 'text-emerald-300',
      },
      avantage: {
        id: 'avantage',
        name: 'Pack Avantage',
        description: 'Puissance supplémentaire et support prioritaire pour une expérience optimisée.',
        billing: 'par mois',
        features: [
          'Performances GPU avancées',
          'Support prioritaire 24/7',
          'Accès aux configurations premium',
        ],
        gradient: 'from-indigo-500/20 via-purple-500/10 to-transparent',
        accent: 'text-indigo-300',
      },
      élite: {
        id: 'élite',
        name: 'Pack Élite',
        description: 'Infrastructure dédiée et sécurité maximale pour les besoins les plus exigeants.',
        billing: 'par mois',
        features: [
          'Machine virtuelle dédiée RTX 4090',
          'HWID Spoofer illimité',
          'Consultant technique personnel',
        ],
        gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
        accent: 'text-amber-300',
      },
    }

    const source = premiumPlans ?? {}

    return ['essentiel', 'avantage', 'élite'].map((planId) => {
      const fallback = defaults[planId]
      const override = source[planId] ?? {}
      return {
        ...fallback,
        name: override.name ?? fallback.name,
        description: override.description ?? fallback.description,
        billing: override.billing ?? fallback.billing,
        features:
          Array.isArray(override.features) && override.features.length > 0
            ? (override.features as string[])
            : fallback.features,
      }
    })
  }, [premiumPlans])

  const features = useMemo<Feature[]>(() => {
    const defaults: Record<string, { title: string; subtitle: string; description: string; stats: Feature['stats']; highlights: string[] }> = {
      performance: {
        title: 'Performances Exceptionnelles',
        subtitle: 'Puissance maximale',
        description:
          'Machines virtuelles équipées des dernières technologies pour des performances gaming optimales. RTX 4090, processeurs dernière génération et RAM DDR5 pour une expérience fluide.',
        stats: [
          { label: 'GPU', value: 'RTX 4090' },
          { label: 'RAM', value: '128GB DDR5' },
          { label: 'CPU', value: 'i9-13900K' },
          { label: 'FPS', value: '240+ FPS' },
        ],
        highlights: [
          'RTX 4090 dernière génération',
          'Ray tracing temps réel',
          'DLSS 3.0 activé',
          '128GB RAM DDR5',
          'Processeur i9-13900K',
          'SSD NVMe ultra-rapide',
        ],
      },
      games: {
        title: 'Catalogue Complet',
        subtitle: 'Tous les jeux',
        description:
          "Accès illimité à l'intégralité de notre catalogue de jeux. Valorant, Apex Legends, Overwatch, Fortnite et bien plus encore, sans supplément.",
        stats: [
          { label: 'Jeux', value: '10+' },
          { label: 'Mises à jour', value: '24/7' },
          { label: 'Nouveautés', value: 'Chaque mois' },
          { label: 'Support', value: 'Tous jeux' },
        ],
        highlights: [
          'Valorant',
          'Apex Legends',
          'Overwatch 2',
          'Fortnite',
          'Call of Duty Warzone',
          'CS2',
          'Rainbow Six Siege',
          'PUBG',
          'Rust',
          'Nouveaux titres ajoutés régulièrement',
        ],
      },
      technology: {
        title: 'Technologies Récentes',
        subtitle: 'Innovation permanente',
        description:
          "Infrastructure cloud mise à jour en continu avec les dernières innovations. Architecture optimisée pour la latence minimale et la performance maximale.",
        stats: [
          { label: 'Latence', value: '<5ms' },
          { label: 'Uptime', value: '99.9%' },
          { label: 'Bande passante', value: '10Gbps' },
          { label: 'Update', value: 'Temps réel' },
        ],
        highlights: [
          'Serveurs dernière génération',
          'Infrastructure redondante',
          'CDN global multi-régions',
          'Optimisation réseau automatique',
          'Mises à jour instantanées',
          'Monitoring 24/7',
        ],
      },
      instant: {
        title: 'Install to Play',
        subtitle: 'Prêt instantanément',
        description:
          "Plus besoin de télécharger ou installer quoi que ce soit. Connectez-vous à votre machine virtuelle et jouez immédiatement. Tout est préconfiguré et optimisé.",
        stats: [
          { label: 'Installation', value: '0 min' },
          { label: 'Setup', value: 'Automatique' },
          { label: 'Config', value: 'Préconfigurée' },
          { label: 'Connexion', value: 'Instantanée' },
        ],
        highlights: [
          'Aucun téléchargement requis',
          'Environnement préconfiguré',
          'Jeux pré-installés',
          'Paramètres optimisés',
          'Connexion en 1 clic',
          'Multi-dispositifs',
        ],
      },
      price: {
        title: 'Formules flexibles',
        subtitle: 'Trois niveaux adaptés',
        description:
          "Choisissez parmi trois formules pour accéder à l'intégralité des fonctionnalités et s'adapter à votre usage. Sans frais cachés, sans surprise.",
        stats: [
          { label: 'Formules', value: '3 niveaux' },
          { label: 'Essai', value: 'Immersion immédiate' },
          { label: 'Support', value: 'Prioritaire' },
          { label: 'Engagement', value: 'Sans' },
        ],
        highlights: [
          'Trois offres modulables',
          'Toutes les fonctionnalités incluses',
          'Support premium 24/7',
          'Upgrade à tout moment',
          'Sans frais cachés',
          'Paiement sécurisé',
        ],
      },
      security: {
        title: 'Sécurité Maximale',
        subtitle: 'Protection totale',
        description:
          'Protection multi-couches indétectable avec HWID spoofer intégré. Technologie kernel-level pour une sécurité maximale et une tranquillité d\'esprit totale.',
        stats: [
          { label: 'Protection', value: 'Kernel-level' },
          { label: 'Détection', value: '0%' },
          { label: 'HWID Spoofer', value: 'Inclus' },
          { label: 'Chiffrement', value: 'E2E' },
        ],
        highlights: [
          'Protection kernel-level',
          'HWID spoofer intégré',
          'Bypass EAC/BE',
          'Stream-proof',
          'Chiffrement bout en bout',
          'Indétectable',
        ],
      },
    }

    const buildFeature = (
      id: keyof typeof defaults,
      icon: ElementType,
      gradient: string,
      iconColor: string,
    ): Feature => {
      const fallback = defaults[id]
      const content = featureContent[id] ?? {}

      return {
        id,
        icon,
        title: content.title ?? fallback.title,
        subtitle: content.subtitle ?? fallback.subtitle,
        description: content.description ?? fallback.description,
        stats: Array.isArray(content.stats) && content.stats.length > 0 ? content.stats : fallback.stats,
        highlights: Array.isArray(content.highlights) && content.highlights.length > 0 ? content.highlights : fallback.highlights,
        gradient,
        iconColor,
      }
    }

    return [
      buildFeature('performance', Cpu, 'from-purple-500 via-violet-500 to-purple-600', 'text-purple-400'),
      buildFeature('games', Gamepad2, 'from-blue-500 via-indigo-500 to-blue-600', 'text-blue-400'),
      buildFeature('technology', Zap, 'from-cyan-500 via-sky-500 to-cyan-600', 'text-cyan-400'),
      buildFeature('instant', MonitorPlay, 'from-teal-500 via-emerald-500 to-teal-600', 'text-teal-400'),
      buildFeature('price', Crown, 'from-amber-500 via-yellow-500 to-amber-600', 'text-amber-400'),
      buildFeature('security', Shield, 'from-green-500 via-emerald-500 to-green-600', 'text-green-400'),
    ]
  }, [featureContent])

  const benefits = useMemo(
    () =>
      Array.isArray(premiumBenefits) && premiumBenefits.length > 0
        ? premiumBenefits
        : [
            'Accès illimité à tous les jeux',
            'Performances GPU RTX 4090',
            'Trois formules adaptées à vos besoins',
            'Support prioritaire 24/7',
            'Mises à jour gratuites à vie',
            'HWID Spoofer inclus',
          ],
    [premiumBenefits],
  )

  const learnMoreLabel = premiumContent.learnMore ?? 'En savoir plus'
  const featuresHeading = premiumContent.featuresHeading ?? {
    title: 'AVANTAGES RÉSERVÉS',
    subtitle: 'Découvrez ce qui rend notre offre Premium exceptionnelle',
  }
  const heroBadge = premiumContent.badge ?? 'Abonnement Exclusif'
  const heroTitle = premiumContent.title ?? 'PREMIUM'
  const heroHighlight = premiumContent.highlight ?? 'UNLIMITED'
  const heroDescription = premiumContent.description ?? "L'expérience gaming ultime. Performances maximales, catalogue complet, offres flexibles."
  const ctaContent = premiumContent.cta ?? {
    title: 'Prêt à passer Premium ?',
    description: "Rejoignez l'élite du gaming avec un accès illimité à toutes nos fonctionnalités",
    primary: 'Commencer maintenant',
    secondary: 'Comparer les offres',
  }
  const modalContent = premiumContent.modal ?? {
    stats: 'Statistiques',
    highlights: 'Fonctionnalités incluses',
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white animate-fade-in">
      <DesignBackdrop variant="amber" intensity="soft" />
      <div className="relative z-10">
        <SiteHeader />

        <div className="pt-32 pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-start gap-12 lg:grid-cols-[1.1fr,0.9fr]">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2">
                  <Crown className="h-4 w-4 text-amber-200" />
                  <span className="text-sm font-medium text-amber-100">{heroBadge}</span>
                </div>

                <div>
                  <h1 className="text-5xl font-black md:text-7xl">
                    <span className="text-white">{heroTitle}</span>
                    <br />
                    <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
                      {heroHighlight}
                    </span>
                  </h1>
                  <p className="mt-6 text-lg text-gray-300 md:text-xl">{heroDescription}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {heroMetrics.map((metric) => (
                    <div key={metric.id} className="glass-effect rounded-2xl border border-white/10 px-6 py-5">
                      <div className="text-3xl font-bold text-white">{metric.value}</div>
                      <p className="text-sm text-gray-400">{metric.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/${locale}/premium/signup`}
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 px-8 py-4 text-base font-semibold text-black transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/30"
                  >
                    {ctaContent.primary}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <button className="flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold glass-effect transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10">
                    {ctaContent.secondary}
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm text-gray-200">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6">
                {plans.map((plan) => (
                  <div key={plan.id} className="relative overflow-hidden rounded-3xl border border-white/10 p-6 backdrop-blur-xl">
                    <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient}`} />
                    <div className="relative space-y-4">
                      <div className="inline-flex rounded-full bg-black/60 px-4 py-1 text-xs uppercase tracking-wide text-white/70">
                        {plan.billing}
                      </div>
                      <h3 className={`text-2xl font-bold ${plan.accent}`}>{plan.name}</h3>
                      <p className="text-sm text-gray-200">{plan.description}</p>
                      <ul className="space-y-2 text-sm text-gray-300">
                        {plan.features.slice(0, 3).map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-white/60" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/${locale}/premium/signup?plan=${plan.id}`}
                        className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-amber-300"
                      >
                        {ctaContent.primary}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-4xl font-black md:text-6xl">
                <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  {featuresHeading.title}
                </span>
              </h2>
              <p className="mt-4 text-lg text-gray-400">{featuresHeading.subtitle}</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon as ComponentType<{ className?: string }>
              return (
                <div
                  key={feature.id}
                  onClick={() => setSelectedFeature(feature)}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40"
                >
                  <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} transition-transform group-hover:scale-105`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className={`text-2xl font-black ${feature.iconColor}`}>{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-300">{feature.subtitle}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {feature.stats.slice(0, 2).map((stat, idx) => (
                      <div key={idx} className="rounded-xl bg-black/60 p-3">
                        <div className="text-xs text-gray-500">{stat.label}</div>
                        <div className="text-sm font-semibold text-white">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-amber-300">
                    <span>{learnMoreLabel}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-20 text-center">
            <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-purple-500/10 to-amber-500/10 p-12">
              <Crown className="mx-auto mb-6 h-16 w-16 text-amber-400" />
              <h2 className="text-4xl font-black md:text-5xl">{ctaContent.title}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">{ctaContent.description}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={`/${locale}/premium/signup`}
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 px-8 py-4 text-base font-semibold text-black transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/30"
                >
                  {ctaContent.primary}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <button className="rounded-full px-8 py-4 text-base font-semibold glass-effect transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10">
                  {ctaContent.secondary}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedFeature && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
                className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 to-black"
              >
                <div className="sticky top-0 z-10 border-b border-white/10 bg-gradient-to-b from-gray-900 to-gray-900/95 p-6 backdrop-blur-xl">
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-white/10"
                  >
                    <X className="h-6 w-6 text-gray-400" />
                  </button>

                  <div className="flex items-start gap-4">
                    <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedFeature.gradient}`}>
                      {(() => {
                        const ModalIcon = selectedFeature.icon as ComponentType<{ className?: string }>
                        return <ModalIcon className="h-8 w-8 text-white" />
                      })()}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-3xl font-black ${selectedFeature.iconColor}`}>{selectedFeature.title}</h3>
                      <p className="mt-2 text-gray-400">{selectedFeature.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 p-6">
                  <div>
                    <h4 className="mb-4 text-lg font-bold text-white">{modalContent.stats}</h4>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {selectedFeature.stats.map((stat, idx) => (
                        <div key={idx} className="glass-effect rounded-xl p-4 text-center">
                          <div className="mb-1 text-sm text-gray-400">{stat.label}</div>
                          <div className={`text-2xl font-black ${selectedFeature.iconColor}`}>{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4 text-lg font-bold text-white">{modalContent.highlights}</h4>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {selectedFeature.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-3 rounded-lg px-4 py-3 glass-effect">
                          <CheckCircle className={`h-5 w-5 ${selectedFeature.iconColor} flex-shrink-0`} />
                          <span className="text-sm text-gray-300">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
