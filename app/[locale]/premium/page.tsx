'use client'

import { useState, useMemo } from 'react'
import type { ElementType } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import {
  X, Crown, Zap, Cpu, Gamepad2,
  MonitorPlay, Shield, ArrowRight,
  CheckCircle
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useI18n } from '@/lib/i18n-simple'
import SiteHeader from '@/components/SiteHeader'
import { getSubscriptionPlans } from '@/lib/subscriptions'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-black" />,
  ssr: false
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

export default function PremiumPage() {
  const params = useParams()
  const locale = params?.locale as string || 'fr'
  const { t } = useI18n()
  const premiumContent = t.premium ?? {}
  const plans = useMemo(() => getSubscriptionPlans(), [])
  const featureSource = premiumContent.features as Record<string, Partial<Omit<Feature, 'id' | 'icon' | 'gradient' | 'iconColor'>>> | undefined
  const featureContent = useMemo<Record<string, Partial<Omit<Feature, 'id' | 'icon' | 'gradient' | 'iconColor'>>>>(() => featureSource ?? {}, [featureSource])
  const premiumBenefits = premiumContent.benefits as string[] | undefined

  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const premiumSignupContent = t.premiumSignup ?? {}
  const planTranslations = (premiumSignupContent.plans ?? {}) as Record<string, { name?: string; description?: string; features?: string[] }>

  const features = useMemo<Feature[]>(() => {
    const defaults: Record<string, { title: string; subtitle: string; description: string; stats: Feature['stats']; highlights: string[] }> = {
      performance: {
        title: 'Performances Exceptionnelles',
        subtitle: 'Puissance maximale',
        description: 'Machines virtuelles équipées des dernières technologies pour des performances gaming optimales. RTX 4090, processeurs dernière génération et RAM DDR5 pour une expérience fluide.',
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
        description: "Accès illimité à l'intégralité de notre catalogue de jeux. Valorant, Apex Legends, Overwatch, Fortnite et bien plus encore, sans supplément.",
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
        description: "Infrastructure cloud mise à jour en continu avec les dernières innovations. Architecture optimisée pour la latence minimale et la performance maximale.",
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
        description: "Plus besoin de télécharger ou installer quoi que ce soit. Connectez-vous à votre machine virtuelle et jouez immédiatement. Tout est préconfiguré et optimisé.",
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
        description: "Choisissez parmi trois formules pour accéder à l'intégralité des fonctionnalités et s'adapter à votre usage. Sans frais cachés, sans surprise.",
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
        description: "Protection multi-couches indétectable avec HWID spoofer intégré. Technologie kernel-level pour une sécurité maximale et une tranquillité d'esprit totale.",
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

  const benefits = useMemo(() => (
    Array.isArray(premiumBenefits) && premiumBenefits.length > 0
      ? premiumBenefits
      : [
          'Accès illimité à tous les jeux',
          'Performances GPU RTX 4090',
          'Trois formules adaptées à vos besoins',
          'Support prioritaire 24/7',
          'Mises à jour gratuites à vie',
          'HWID Spoofer inclus',
        ]
  ), [premiumBenefits])

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
    <div className="min-h-screen bg-black text-white overflow-hidden animate-fade-in">
      <SiteHeader />
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative pt-32 pb-20 animate-scale-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20 animate-scale-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full mb-6">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">{heroBadge}</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="text-white">{heroTitle}</span><br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600">
                {heroHighlight}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              {heroDescription}
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 glass-effect rounded-xl px-4 py-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plans Comparison Section */}
          <div className="mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-600">
                {premiumContent.plansTitle ?? 'Nos Offres Premium'}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const planContent = (premiumContent.plans as Record<string, { name?: string; description?: string; features?: string[] }> | undefined)?.[plan.id] ?? {}
                const planName = planContent.name ?? plan.name
                const planDescription = planContent.description ?? plan.description
                const planFeatures = Array.isArray(planContent.features) && planContent.features.length > 0
                  ? planContent.features
                  : plan.features

                return (
                  <div
                    key={plan.id}
                    className={`glass-effect rounded-3xl p-8 border-2 transition-all hover:scale-[1.02] ${
                      plan.popular
                        ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 relative'
                        : 'border-white/10 hover:border-purple-500/30'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-sm font-bold rounded-full">
                        {premiumContent.popularBadge ?? 'Populaire'}
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-black text-white mb-2">{planName}</h3>
                      <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                        {new Intl.NumberFormat(locale === 'en' ? 'en-US' : locale === 'et' ? 'et-EE' : 'fr-FR', {
                          style: 'currency',
                          currency: plan.currency,
                          minimumFractionDigits: plan.price % 1 === 0 ? 0 : 2
                        }).format(plan.price)}
                      </div>
                      <p className="text-sm text-gray-400">{plan.billing}</p>
                    </div>
                    <p className="text-gray-300 text-center mb-6">
                      {planDescription}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {planFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/${locale}/premium/signup?plan=${plan.id}`}
                      className={`block w-full px-6 py-4 rounded-xl font-bold text-center transition-all mt-auto ${
                        plan.popular
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black hover:scale-105'
                          : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {premiumSignupContent.labels?.select ?? 'Choisir cette offre'}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Features Title */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                {featuresHeading.title}
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              {featuresHeading.subtitle}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 animate-slide-up">
            {features.map((feature) => {
              const Icon = feature.icon as React.ComponentType<{ className?: string }>
              return (
                <div
                  key={feature.id}
                  onClick={() => setSelectedFeature(feature)}
                  className="group glass-effect rounded-2xl p-6 cursor-pointer hover:border-purple-500/50 hover:scale-[1.03] transition-all"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className={`text-2xl font-black mb-2 ${feature.iconColor}`}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {feature.subtitle}
                  </p>

                  {/* Stats Preview */}
                  <div className="grid grid-cols-2 gap-2">
                    {feature.stats.slice(0, 2).map((stat, idx) => (
                      <div key={idx} className="bg-white/5 rounded-lg p-2">
                        <div className="text-xs text-gray-500">{stat.label}</div>
                        <div className="text-sm font-bold text-white">{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-purple-400 text-sm font-medium">
                    <span>{learnMoreLabel}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="text-center animate-scale-in">
            <div className="glass-effect rounded-3xl p-12 bg-gradient-to-br from-purple-500/10 to-amber-500/10 border-2 border-purple-500/20">
              <Crown className="w-16 h-16 text-amber-400 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                {ctaContent.title}
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {ctaContent.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/${locale}/premium/signup?plan=${plans.find(p => p.popular)?.id ?? 'élite'}`}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-lg font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  {ctaContent.primary}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="px-8 py-4 glass-effect rounded-full text-lg font-medium hover:bg-white/10 transition-all">
                  {ctaContent.secondary}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence mode="wait">
        {selectedFeature && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            >
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl overflow-y-auto relative"
              >
              <div className="sticky top-0 bg-gradient-to-b from-gray-900 to-gray-900/95 backdrop-blur-xl border-b border-white/10 p-6 z-10">
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>

                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedFeature.gradient} flex items-center justify-center flex-shrink-0`}>
                    {(() => {
                      const ModalIcon = selectedFeature.icon as React.ComponentType<{ className?: string }>
                      return <ModalIcon className="w-8 h-8 text-white" />
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-3xl font-black mb-2 ${selectedFeature.iconColor}`}>
                      {selectedFeature.title}
                    </h3>
                    <p className="text-gray-400">
                      {selectedFeature.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Stats */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">{modalContent.stats}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedFeature.stats.map((stat, idx) => (
                      <div key={idx} className="glass-effect rounded-xl p-4 text-center">
                        <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                        <div className={`text-2xl font-black ${selectedFeature.iconColor}`}>
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">{modalContent.highlights}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedFeature.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 glass-effect rounded-lg px-4 py-3"
                      >
                        <CheckCircle className={`w-5 h-5 ${selectedFeature.iconColor} flex-shrink-0`} />
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
