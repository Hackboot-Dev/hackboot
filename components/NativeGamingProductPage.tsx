'use client'

import { useState } from 'react'
import { Star, Shield, Zap, Check, ArrowRight, ChevronLeft, Trophy, Gauge, Code, Target, TrendingUp, Activity, Cpu, Users, BarChart3, Lock, Wifi } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { GamingProduct, ProductVariant } from '@/lib/gaming-products'
import { getSubscriptionPlans } from '@/lib/subscriptions'

interface NativeGamingProductPageProps {
  product: GamingProduct
}

export default function NativeGamingProductPage({ product }: NativeGamingProductPageProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  const subscriptionPlans = getSubscriptionPlans()
  const gallery = product.gallery || [selectedVariant.image]
  const tech = product.technicalSpecs

  const nativeAdvantages = [
    {
      icon: Code,
      title: "Build Privé Exclusif",
      description: "Code source personnalisé et optimisé spécifiquement pour votre configuration"
    },
    {
      icon: Shield,
      title: "Protection Maximale",
      description: "HWID Spoofer intégré + Protection kernel-level contre les détections"
    },
    {
      icon: Gauge,
      title: "Performances Optimisées",
      description: "FPS stable 240+ garantis avec latence <1ms grâce à notre infrastructure dédiée"
    },
    {
      icon: Trophy,
      title: "Support Premium 24/7",
      description: "Équipe technique dédiée disponible en direct + Mises à jour prioritaires"
    }
  ]

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
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          <Link href={`/${locale}`} className="text-gray-400 hover:text-white transition">
            Accueil
          </Link>
          <span className="text-gray-500">/</span>
          <Link href={`/${locale}/games`} className="text-gray-400 hover:text-white transition">
            Jeux
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
                src={gallery[selectedImageIndex]}
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
                  OPTIMISÉ NATIVEMENT
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400 text-sm">{product.game}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">{product.name}</h1>
              <p className="text-xl text-gray-300">{product.description}</p>
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
              <span className="text-gray-400">({product.reviews.count} avis)</span>
            </div>

            {/* Quick Stats */}
            {tech?.performanceMetrics && (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                <div className="p-3 glass-effect rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">{tech.performanceMetrics.avgFps}</div>
                  <div className="text-xs text-gray-400">FPS Moyen</div>
                </div>
                <div className="p-3 glass-effect rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">{tech.performanceMetrics.latency}ms</div>
                  <div className="text-xs text-gray-400">Latence</div>
                </div>
                {tech.aimbotStats && (
                  <>
                    <div className="p-3 glass-effect rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-400">{tech.aimbotStats.predictionAccuracy}%</div>
                      <div className="text-xs text-gray-400">Précision Aimbot</div>
                    </div>
                    <div className="p-3 glass-effect rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-400">{tech.aimbotStats.headShotRate}%</div>
                      <div className="text-xs text-gray-400">Taux HeadShot</div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Choisissez votre abonnement Premium */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="font-semibold text-xl">Choisissez votre abonnement</h3>
              <div className="grid grid-cols-1 gap-4">
                {subscriptionPlans.map((plan) => (
                  <Link
                    key={plan.id}
                    href={`/${locale}/premium/signup?plan=${plan.id}`}
                    className="relative p-5 rounded-xl border border-white/10 hover:border-purple-500/50 glass-effect transition-all group"
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-4 px-3 py-1 bg-purple-500 text-xs text-white font-semibold rounded-full">
                        Le plus populaire
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
                      <span>Voir les détails</span>
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
                <span className="font-semibold">MÉTRIQUES DE PERFORMANCE</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Performances Mesurées en Temps Réel</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Des résultats concrets, testés et validés sur notre infrastructure dédiée
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={Gauge} label="FPS Maximum" value={tech.performanceMetrics.maxFps} color="green" />
                <StatCard icon={Zap} label="Input Lag" value={`${tech.performanceMetrics.inputLag}ms`} color="blue" />
                <StatCard icon={Activity} label="Frame Time" value={`${tech.performanceMetrics.frameTime}ms`} color="purple" />
              </div>

              <div className="glass-effect rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-purple-400" />
                      Utilisation Système
                    </h3>
                    <ProgressBar label="CPU Usage" value={tech.performanceMetrics.cpuUsage} max={100} unit="%" color="purple" />
                    <ProgressBar label="GPU Usage" value={tech.performanceMetrics.gpuUsage} max={100} unit="%" color="green" />
                    <ProgressBar label="RAM Usage" value={tech.performanceMetrics.ramUsage} max={128} unit=" GB" color="blue" />
                    <ProgressBar label="VRAM Usage" value={tech.performanceMetrics.vramUsage} max={24} unit=" GB" color="cyan" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-orange-400" />
                      Températures & Puissance
                    </h3>
                    <ProgressBar label="CPU Temperature" value={tech.performanceMetrics.thermalCpu} max={100} unit="°C" color="orange" />
                    <ProgressBar label="GPU Temperature" value={tech.performanceMetrics.thermalGpu} max={100} unit="°C" color="orange" />
                    <ProgressBar label="Power Draw" value={tech.performanceMetrics.powerDraw} max={600} unit="W" color="red" />
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <Check className="w-4 h-4" />
                        <span>Températures optimales - Performance maximale garantie</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Competitor Comparison */}
        {tech?.benchmarks?.competitorComparison && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full mb-4">
                <BarChart3 className="w-5 h-5" />
                <span className="font-semibold">COMPARAISON CONCURRENTIELLE</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">HACKBOOT vs. Concurrence</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Pourquoi nous sommes leader du marché avec des performances mesurables
              </p>
            </div>

            <div className="max-w-6xl mx-auto glass-effect rounded-2xl p-8 border border-white/10">
              <div className="space-y-8">
                {tech.benchmarks.competitorComparison.map((comparison, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-lg">{comparison.metric}</h4>
                      <div className="text-sm text-gray-400">Plus c'est élevé, mieux c'est {comparison.metric.includes('Detection') || comparison.metric.includes('Latency') ? '(inversé)' : ''}</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="text-xs text-purple-400 font-semibold">HACKBOOT</div>
                        <div className="h-24 bg-purple-500/20 rounded-lg border-2 border-purple-500 flex items-end overflow-hidden">
                          <div
                            className="w-full bg-gradient-to-t from-purple-500 to-purple-400 flex items-end justify-center pb-2"
                            style={{ height: '100%' }}
                          >
                            <span className="text-white font-bold text-sm">{comparison.hackboot}</span>
                          </div>
                        </div>
                      </div>
                      {[comparison.competitor1, comparison.competitor2, comparison.competitor3].map((value, i) => {
                        const maxValue = Math.max(comparison.hackboot, comparison.competitor1, comparison.competitor2, comparison.competitor3)
                        const height = (value / maxValue) * 100
                        return (
                          <div key={i} className="space-y-2">
                            <div className="text-xs text-gray-500 font-semibold">Concurrent {i + 1}</div>
                            <div className="h-24 bg-white/5 rounded-lg border border-white/10 flex items-end overflow-hidden">
                              <div
                                className="w-full bg-gradient-to-t from-gray-600 to-gray-500 flex items-end justify-center pb-2"
                                style={{ height: `${height}%` }}
                              >
                                <span className="text-white font-bold text-sm">{value}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aimbot Stats */}
        {tech?.aimbotStats && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full mb-4">
                <Target className="w-5 h-5" />
                <span className="font-semibold">CAPACITÉS AIMBOT</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Précision de Niveau Professionnel</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Aimbot humanisé avec prédiction avancée et contrôle total
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Target} label="Précision" value={`${tech.aimbotStats.predictionAccuracy}%`} color="red" />
                <StatCard icon={Activity} label="Fluidité" value={`${tech.aimbotStats.smoothness}%`} color="orange" />
                <StatCard icon={Zap} label="FOV" value={`${tech.aimbotStats.fov}°`} color="purple" />
                <StatCard icon={Gauge} label="Switch Time" value={`${tech.aimbotStats.targetSwitchTime}s`} color="blue" />
              </div>

              <div className="glass-effect rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4">Statistiques Avancées</h3>
                    <div className="space-y-4">
                      <ProgressBar label="HeadShot Rate" value={tech.aimbotStats.headShotRate} max={100} unit="%" color="red" />
                      <ProgressBar label="Weapon Support" value={tech.aimbotStats.weaponSupport} max={100} unit="%" color="green" />
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">Reaction Time</span>
                        <span className="text-blue-400 font-bold">{tech.aimbotStats.reactionTime}ms</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-4">Configuration Hitbox</h3>
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
                        <span>Humanisation active : Comportement indétectable par les systèmes anti-cheat</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Compatibility Matrix */}
        {tech?.compatibilityMatrix && tech.compatibilityMatrix.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full mb-4">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">COMPATIBILITÉ PAR HÉROS</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Performance par Héros</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Optimisations spécifiques pour chaque héros d'{product.game}
              </p>
            </div>

            <div className="max-w-6xl mx-auto glass-effect rounded-2xl p-8 border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Héros</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-semibold">Efficacité</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-semibold">HeadShot %</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-semibold">K/D Moyen</th>
                      <th className="text-center py-4 px-4 text-gray-400 font-semibold">Win Rate</th>
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

        {/* Rank Progression */}
        {tech?.benchmarks?.rankProgression && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full mb-4">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">PROGRESSION CLASSÉE</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">De Bronze à Grandmaster</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Temps moyen pour atteindre chaque rang avec notre solution
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {tech.benchmarks.rankProgression.map((rank, idx) => (
                  <div key={idx} className="glass-effect rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all">
                    <div className="text-center space-y-3">
                      <div className="text-xl font-bold text-purple-400">{rank.rank}</div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-white">{rank.avgGamesTo}</div>
                        <div className="text-xs text-gray-400">parties</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-lg font-bold text-green-400">{rank.winRate}%</div>
                        <div className="text-xs text-gray-400">Win Rate</div>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <div className="text-sm font-semibold text-blue-400">{rank.avgTime}</div>
                        <div className="text-xs text-gray-400">temps moyen</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Metrics */}
        {tech?.securityMetrics && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full mb-4">
                <Lock className="w-5 h-5" />
                <span className="font-semibold">SÉCURITÉ & PROTECTION</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Sécurité de Niveau Entreprise</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Protection multicouche avec encryption AES-256 et obfuscation avancée
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-effect rounded-xl p-6 border border-green-500/30 bg-green-500/5">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">{tech.securityMetrics.detectionRate}%</div>
                    <div className="text-sm text-gray-400">Taux de Détection</div>
                    <div className="mt-3 text-xs text-green-400">Quasi-inexistant</div>
                  </div>
                </div>
                <div className="glass-effect rounded-xl p-6 border border-blue-500/30 bg-blue-500/5">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">{tech.securityMetrics.uptimePercentage}%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                    <div className="mt-3 text-xs text-blue-400">Disponibilité maximale</div>
                  </div>
                </div>
                <div className="glass-effect rounded-xl p-6 border border-purple-500/30 bg-purple-500/5">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400 mb-2">{tech.securityMetrics.avgResponseTime}min</div>
                    <div className="text-sm text-gray-400">Support Moyen</div>
                    <div className="mt-3 text-xs text-purple-400">Réponse ultra-rapide</div>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      Protection Active
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">Encryption</span>
                        <span className="text-green-400 font-bold">{tech.securityMetrics.encryptionLevel}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">Couches d'Obfuscation</span>
                        <span className="text-purple-400 font-bold">{tech.securityMetrics.obfuscationLayers}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">MAJ Sécurité/Semaine</span>
                        <span className="text-blue-400 font-bold">{tech.securityMetrics.securityUpdatesPerWeek}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-400">Incidents (30j)</span>
                        <span className="text-green-400 font-bold">{tech.securityMetrics.incidentsLastMonth}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-purple-400" />
                      Technologies de Protection
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: "Anti-Debug", enabled: tech.securityMetrics.antiDebug },
                        { label: "Anti-VM Detection", enabled: tech.securityMetrics.antiVM },
                        { label: "Kernel-Level Protection", enabled: tech.securityMetrics.kernelProtection }
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
                          <span>Protection complète contre reverse engineering et analyse comportementale</span>
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
                <span className="font-semibold">INFRASTRUCTURE RÉSEAU</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Réseau Global Ultra-Rapide</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                {tech.networkStats.serverLocations} serveurs dans le monde pour une latence minimale
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Wifi} label="Serveurs" value={tech.networkStats.serverLocations} color="blue" />
                <StatCard icon={Zap} label="Ping Moyen" value={`${tech.networkStats.avgPing}ms`} color="green" />
                <StatCard icon={Activity} label="Packet Loss" value={`${tech.networkStats.packetLoss}%`} color="purple" />
                <StatCard icon={Gauge} label="Jitter" value={`${tech.networkStats.jitter}ms`} color="cyan" />
              </div>

              <div className="glass-effect rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wifi className="w-6 h-6 text-blue-400" />
                      <div>
                        <div className="font-semibold">Bande Passante Max</div>
                        <div className="text-sm text-gray-400">Par connexion</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">{tech.networkStats.maxBandwidth} Mbps</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="w-6 h-6 text-green-400" />
                      <div>
                        <div className="font-semibold">Encryption</div>
                        <div className="text-sm text-gray-400">Sécurité maximale</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-green-400">{tech.networkStats.encryption}</div>
                  </div>
                </div>
                {tech.networkStats.ddosProtection && (
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400">
                      <Shield className="w-5 h-5" />
                      <span className="font-semibold">Protection DDoS Active</span>
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
                <span className="font-semibold">COMMUNAUTÉ & SATISFACTION</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Plébiscité par {tech.userStats.totalUsers.toLocaleString()} Joueurs</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Une communauté active et satisfaite qui témoigne de notre qualité
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="glass-effect rounded-xl p-6 border border-white/10 text-center">
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{tech.userStats.totalUsers.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Utilisateurs Total</div>
                </div>
                <div className="glass-effect rounded-xl p-6 border border-white/10 text-center">
                  <Activity className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{tech.userStats.activeUsersLast30Days.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Actifs (30j)</div>
                </div>
                <div className="glass-effect rounded-xl p-6 border border-white/10 text-center">
                  <Gauge className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{tech.userStats.avgSessionDuration}h</div>
                  <div className="text-sm text-gray-400">Session Moyenne</div>
                </div>
                <div className="glass-effect rounded-xl p-6 border border-white/10 text-center">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{tech.userStats.avgGamesPerDay}</div>
                  <div className="text-sm text-gray-400">Parties/Jour</div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-effect rounded-xl p-8 border border-yellow-500/30 bg-yellow-500/5">
                  <div className="text-center">
                    <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <div className="text-5xl font-bold text-yellow-400 mb-2">{tech.userStats.satisfactionScore}/5</div>
                    <div className="text-gray-400">Score de Satisfaction</div>
                  </div>
                </div>
                <div className="glass-effect rounded-xl p-8 border border-green-500/30 bg-green-500/5">
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <div className="text-5xl font-bold text-green-400 mb-2">{tech.userStats.recommendationRate}%</div>
                    <div className="text-gray-400">Taux de Recommandation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Native Advantages Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi Choisir Notre Build Natif ?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Optimisé de A à Z pour {product.game}, avec des performances mesurées et un support dédié
            </p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fonctionnalités Incluses</h2>
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
          <h2 className="text-4xl font-bold mb-6">Prêt à Dominer {product.game} ?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de joueurs et transformez votre expérience de jeu dès aujourd&apos;hui.
          </p>
          <Link
            href={`/${locale}/premium/signup?plan=${subscriptionPlans.find(p => p.popular)?.id ?? 'élite'}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition-all"
          >
            Choisir mon abonnement
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
