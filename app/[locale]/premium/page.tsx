'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Crown,
  Zap,
  Cpu,
  Gamepad2,
  MonitorPlay,
  Shield,
  ArrowRight,
  CheckCircle,
  Infinity as InfinityIcon,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useI18n } from '@/lib/i18n-simple'
import HeaderFixed from '@/components/HeaderFixed'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-black" />,
  ssr: false,
})

interface Feature {
  id: string
  icon: React.ElementType
  title: string
  subtitle: string
  description: string
  stats: { label: string; value: string }[]
  highlights: string[]
  gradient: string
  iconColor: string
}

export default function PremiumPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { t } = useI18n()

  const features: Feature[] = [
    {
      id: 'performance',
      icon: Cpu,
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
      gradient: 'from-purple-500 via-violet-500 to-purple-600',
      iconColor: 'text-purple-400',
    },
    {
      id: 'games',
      icon: Gamepad2,
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
      gradient: 'from-blue-500 via-indigo-500 to-blue-600',
      iconColor: 'text-blue-400',
    },
    {
      id: 'technology',
      icon: Zap,
      title: 'Technologies Récentes',
      subtitle: 'Innovation permanente',
      description:
        'Infrastructure cloud mise à jour en continu avec les dernières innovations. Architecture optimisée pour la latence minimale et la performance maximale.',
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
      gradient: 'from-cyan-500 via-sky-500 to-cyan-600',
      iconColor: 'text-cyan-400',
    },
    {
      id: 'instant',
      icon: MonitorPlay,
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
      gradient: 'from-teal-500 via-emerald-500 to-teal-600',
      iconColor: 'text-teal-400',
    },
    {
      id: 'price',
      icon: Crown,
      title: 'Prix Unique',
      subtitle: 'Tout inclus',
      description:
        "Un seul abonnement pour accéder à l'intégralité des fonctionnalités et tous les jeux. Pas de frais cachés, pas de supplément. Simplicité totale.",
      stats: [
        { label: 'Formule', value: 'Unique' },
        { label: 'Jeux inclus', value: 'Tous' },
        { label: 'Features', value: '100%' },
        { label: 'Frais cachés', value: '0€' },
      ],
      highlights: [
        'Un seul prix transparent',
        'Tous les jeux inclus',
        'Toutes les fonctionnalités',
        'Mises à jour gratuites',
        'Support premium inclus',
        'Sans engagement',
      ],
      gradient: 'from-amber-500 via-yellow-500 to-amber-600',
      iconColor: 'text-amber-400',
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Sécurité Maximale',
      subtitle: 'Protection totale',
      description:
        'Protection multi-couches indétectable avec HWID spoofer intégré. Technologie kernel-level pour une sécurité maximale et une tranquillité d’esprit totale.',
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
      gradient: 'from-green-500 via-emerald-500 to-green-600',
      iconColor: 'text-green-400',
    },
  ]

  const [selectedFeature, setSelectedFeature] = useState<Feature>(features[0])

  const benefits = [
    'Accès illimité à tous les jeux',
    'Performances GPU RTX 4090',
    'Pas de téléchargement requis',
    'Support prioritaire 24/7',
    'Mises à jour gratuites à vie',
    'HWID Spoofer inclus',
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <HeaderFixed />
      <main className="pt-24">
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full border border-white/10 text-sm font-semibold gradient-text">
              {t.premium?.badge || 'Accès premium Hackboot'}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mt-6 mb-4">
              {t.premium?.title || 'Une seule offre, tout compris'}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              {t.premium?.subtitle || 'La configuration ultime pour les joueurs qui veulent tout sans compromis.'}
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-300 mt-6">
              {benefits.map((benefit) => (
                <span key={benefit} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  {benefit}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href={`/${locale}/premium/signup`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full text-sm font-semibold"
              >
                {t.premium?.cta || 'Commencer maintenant'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-6 py-3 glass-effect rounded-full text-sm"
              >
                {t.premium?.contact || 'Parler à un expert'}
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-20 grid lg:grid-cols-[1.2fr_1fr] gap-10">
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon as React.ComponentType<{ className?: string }>
              const isActive = selectedFeature.id === feature.id
              return (
                <button
                  key={feature.id}
                  onClick={() => setSelectedFeature(feature)}
                  className={`text-left rounded-2xl border transition-colors p-6 bg-black/70 ${
                    isActive ? 'border-accent' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">{feature.subtitle}</p>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </button>
              )
            })}
          </div>

          <aside className="glass-effect rounded-3xl border border-white/10 p-8 space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                {(() => {
                  const Icon = selectedFeature.icon as React.ComponentType<{ className?: string }>
                  return <Icon className={`w-6 h-6 ${selectedFeature.iconColor}`} />
                })()}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  {selectedFeature.subtitle}
                </p>
                <h2 className="text-2xl font-semibold">{selectedFeature.title}</h2>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">
              {selectedFeature.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {selectedFeature.stats.map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-lg font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {selectedFeature.highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-2 text-sm text-gray-300">
                  <InfinityIcon className="w-4 h-4 text-accent" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  )
}
