'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import {
  X, Crown, Zap, Cpu, Gamepad2, Sparkles,
  MonitorPlay, Database, Gauge, Shield, ArrowRight,
  CheckCircle, Infinity as InfinityIcon
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useI18n } from '@/lib/i18n-simple'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-black" />,
  ssr: false
})

interface Feature {
  id: string
  icon: React.ElementType
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

  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)

  const features: Feature[] = [
    {
      id: 'performance',
      icon: Cpu,
      title: "Performances Exceptionnelles",
      subtitle: "Puissance maximale",
      description: "Machines virtuelles équipées des dernières technologies pour des performances gaming optimales. RTX 4090, processeurs dernière génération et RAM DDR5 pour une expérience fluide.",
      stats: [
        { label: "GPU", value: "RTX 4090" },
        { label: "RAM", value: "128GB DDR5" },
        { label: "CPU", value: "i9-13900K" },
        { label: "FPS", value: "240+ FPS" }
      ],
      highlights: [
        "RTX 4090 dernière génération",
        "Ray tracing temps réel",
        "DLSS 3.0 activé",
        "128GB RAM DDR5",
        "Processeur i9-13900K",
        "SSD NVMe ultra-rapide"
      ],
      gradient: "from-purple-500 via-violet-500 to-purple-600",
      iconColor: "text-purple-400"
    },
    {
      id: 'games',
      icon: Gamepad2,
      title: "Catalogue Complet",
      subtitle: "Tous les jeux",
      description: "Accès illimité à l'intégralité de notre catalogue de jeux. Valorant, Apex Legends, Overwatch, Fortnite et bien plus encore, sans supplément.",
      stats: [
        { label: "Jeux", value: "10+" },
        { label: "Mises à jour", value: "24/7" },
        { label: "Nouveautés", value: "Chaque mois" },
        { label: "Support", value: "Tous jeux" }
      ],
      highlights: [
        "Valorant",
        "Apex Legends",
        "Overwatch 2",
        "Fortnite",
        "Call of Duty Warzone",
        "CS2",
        "Rainbow Six Siege",
        "PUBG",
        "Rust",
        "Nouveaux titres ajoutés régulièrement"
      ],
      gradient: "from-blue-500 via-indigo-500 to-blue-600",
      iconColor: "text-blue-400"
    },
    {
      id: 'technology',
      icon: Zap,
      title: "Technologies Récentes",
      subtitle: "Innovation permanente",
      description: "Infrastructure cloud mise à jour en continu avec les dernières innovations. Architecture optimisée pour la latence minimale et la performance maximale.",
      stats: [
        { label: "Latence", value: "<5ms" },
        { label: "Uptime", value: "99.9%" },
        { label: "Bande passante", value: "10Gbps" },
        { label: "Update", value: "Temps réel" }
      ],
      highlights: [
        "Serveurs dernière génération",
        "Infrastructure redondante",
        "CDN global multi-régions",
        "Optimisation réseau automatique",
        "Mises à jour instantanées",
        "Monitoring 24/7"
      ],
      gradient: "from-cyan-500 via-sky-500 to-cyan-600",
      iconColor: "text-cyan-400"
    },
    {
      id: 'instant',
      icon: MonitorPlay,
      title: "Install to Play",
      subtitle: "Prêt instantanément",
      description: "Plus besoin de télécharger ou installer quoi que ce soit. Connectez-vous à votre machine virtuelle et jouez immédiatement. Tout est préconfiguré et optimisé.",
      stats: [
        { label: "Installation", value: "0 min" },
        { label: "Setup", value: "Automatique" },
        { label: "Config", value: "Préconfigurée" },
        { label: "Connexion", value: "Instantanée" }
      ],
      highlights: [
        "Aucun téléchargement requis",
        "Environnement préconfiguré",
        "Jeux pré-installés",
        "Paramètres optimisés",
        "Connexion en 1 clic",
        "Multi-dispositifs"
      ],
      gradient: "from-teal-500 via-emerald-500 to-teal-600",
      iconColor: "text-teal-400"
    },
    {
      id: 'price',
      icon: Crown,
      title: "Prix Unique",
      subtitle: "Tout inclus",
      description: "Un seul abonnement pour accéder à l'intégralité des fonctionnalités et tous les jeux. Pas de frais cachés, pas de supplément. Simplicité totale.",
      stats: [
        { label: "Formule", value: "Unique" },
        { label: "Jeux inclus", value: "Tous" },
        { label: "Features", value: "100%" },
        { label: "Frais cachés", value: "0€" }
      ],
      highlights: [
        "Un seul prix transparent",
        "Tous les jeux inclus",
        "Toutes les fonctionnalités",
        "Mises à jour gratuites",
        "Support premium inclus",
        "Sans engagement"
      ],
      gradient: "from-amber-500 via-yellow-500 to-amber-600",
      iconColor: "text-amber-400"
    },
    {
      id: 'security',
      icon: Shield,
      title: "Sécurité Maximale",
      subtitle: "Protection totale",
      description: "Protection multi-couches indétectable avec HWID spoofer intégré. Technologie kernel-level pour une sécurité maximale et une tranquillité d'esprit totale.",
      stats: [
        { label: "Protection", value: "Kernel-level" },
        { label: "Détection", value: "0%" },
        { label: "HWID Spoofer", value: "Inclus" },
        { label: "Chiffrement", value: "E2E" }
      ],
      highlights: [
        "Protection kernel-level",
        "HWID spoofer intégré",
        "Bypass EAC/BE",
        "Stream-proof",
        "Chiffrement bout en bout",
        "Indétectable"
      ],
      gradient: "from-green-500 via-emerald-500 to-green-600",
      iconColor: "text-green-400"
    }
  ]

  const benefits = [
    "Accès illimité à tous les jeux",
    "Performances GPU RTX 4090",
    "Pas de téléchargement requis",
    "Support prioritaire 24/7",
    "Mises à jour gratuites à vie",
    "HWID Spoofer inclus"
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
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
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full mb-6"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">Abonnement Exclusif</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="text-white">PREMIUM</span><br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600">
                UNLIMITED
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              L&apos;expérience gaming ultime.<br />
              Performances maximales, catalogue complet, prix unique.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-center gap-3 glass-effect rounded-xl px-4 py-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                AVANTAGES RÉSERVÉS
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Découvrez ce qui rend notre offre Premium exceptionnelle
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon as React.ComponentType<{ className?: string }>
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setSelectedFeature(feature)}
                  className="group glass-effect rounded-2xl p-6 cursor-pointer hover:border-purple-500/50 transition-all"
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
                    <span>En savoir plus</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="glass-effect rounded-3xl p-12 bg-gradient-to-br from-purple-500/10 to-amber-500/10 border-2 border-purple-500/20">
              <Crown className="w-16 h-16 text-amber-400 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Prêt à passer Premium ?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Rejoignez l&apos;élite du gaming avec un accès illimité à toutes nos fonctionnalités
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-lg font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  Commencer maintenant
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 glass-effect rounded-full text-lg font-medium hover:bg-white/10 transition-all">
                  Comparer les offres
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100]"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl overflow-y-auto z-[101]"
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
                  <h4 className="text-lg font-bold text-white mb-4">Statistiques</h4>
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
                  <h4 className="text-lg font-bold text-white mb-4">Fonctionnalités incluses</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedFeature.highlights.map((highlight, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-3 glass-effect rounded-lg px-4 py-3"
                      >
                        <CheckCircle className={`w-5 h-5 ${selectedFeature.iconColor} flex-shrink-0`} />
                        <span className="text-sm text-gray-300">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
