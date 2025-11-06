'use client'

import { useI18n } from '@/lib/i18n-simple'
import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import {
  Gamepad2,
  Code,
  Cloud,
  Rocket,
  Shield,
  Users,
  Zap,
  Target,
  TrendingUp,
  Award,
  Globe,
  Server,
  Lock,
  Heart,
  Lightbulb,
  CheckCircle,
  Trophy,
  Star,
  MessageSquare,
  Eye,
} from 'lucide-react'
import SiteHeader from '@/components/SiteHeader'
import HeroParallax from '@/components/about/HeroParallax'
import StatsShowcase from '@/components/about/StatsShowcase'
import MissionVision from '@/components/about/MissionVision'
import AchievementGrid from '@/components/about/AchievementGrid'
import ValueCardParallax from '@/components/about/ValueCardParallax'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-black" />,
  ssr: false,
})

export default function AboutPage() {
  const { t } = useI18n()

  const stats = useMemo(
    () => [
      {
        icon: Users,
        value: '1500',
        label: t.about?.stats?.clients || 'Clients satisfaits',
        suffix: '+',
        gradient: 'from-purple-500 to-violet-600',
      },
      {
        icon: Globe,
        value: '25',
        label: t.about?.stats?.countries || 'Pays couverts',
        suffix: '+',
        gradient: 'from-cyan-500 to-blue-600',
      },
      {
        icon: Server,
        value: '99.9',
        label: t.about?.stats?.uptime || 'Uptime garanti',
        suffix: '%',
        gradient: 'from-emerald-500 to-teal-600',
      },
      {
        icon: Trophy,
        value: '100',
        label: t.about?.stats?.satisfaction || 'Satisfaction',
        suffix: '%',
        gradient: 'from-amber-500 to-yellow-600',
      },
    ],
    [t],
  )

  const timelineEvents = useMemo(
    () => [
      {
        year: '2023',
        title: t.about?.timeline?.event1?.title || 'Genèse : Marketplace Gaming',
        description:
          t.about?.timeline?.event1?.description ||
          'Lancement initial en tant que marketplace de clés de jeux, premiers pas dans l\'écosystème gaming avec focus sur la sécurité des transactions.',
        icon: Gamepad2,
        achievements: [
          '500+ premiers clients',
          'Plateforme de paiement sécurisée',
          'Catalogue de 100+ jeux',
        ],
      },
      {
        year: '2023',
        title: t.about?.timeline?.event2?.title || 'Pivot Stratégique : Software Custom',
        description:
          t.about?.timeline?.event2?.description ||
          'Transition vers le développement de logiciels gaming sur-mesure avec technologies anti-détection avancées.',
        icon: Code,
        achievements: [
          'Premier software custom déployé',
          'Technologie kernel-level développée',
          'Partenariats avec joueurs pro',
        ],
      },
      {
        year: '2024',
        title: 'Expansion : Multi-jeux & Communauté',
        description:
          'Élargissement du catalogue à 10+ jeux majeurs (Valorant, Apex, Fortnite...) et construction d\'une communauté active de 5000+ membres Discord.',
        icon: Users,
        achievements: [
          '10+ jeux supportés',
          '5000+ membres Discord',
          'Support 24/7 établi',
          'Forum communautaire lancé',
        ],
      },
      {
        year: '2025',
        title: t.about?.timeline?.event3?.title || 'Révolution : Cloud Gaming Platform',
        description:
          t.about?.timeline?.event3?.description ||
          'Lancement de notre plateforme cloud gaming révolutionnaire avec VMs haute performance et infrastructure mondiale.',
        icon: Cloud,
        achievements: [
          'Infrastructure cloud 12 régions',
          'GPU RTX 4090 dédiés',
          '1000+ clients premium',
          'Latence <5ms garantie',
        ],
      },
      {
        year: '2025',
        title: t.about?.timeline?.event4?.title || 'Acquisition : Intégration VMCloud Group',
        description:
          t.about?.timeline?.event4?.description ||
          'Acquisition par VMCloud Group OÜ, expansion internationale et scaling de l\'infrastructure pour supporter 10x la capacité.',
        icon: Rocket,
        achievements: [
          'Intégration VMCloud Group',
          'Expansion européenne',
          'Capacité 10x augmentée',
          'Équipe de 20+ experts',
        ],
      },
      {
        year: '2025',
        title: 'Certification & Conformité',
        description:
          'Obtention des certifications ISO 27001 et SOC 2 Type II, conformité RGPD complète et audits de sécurité trimestriels.',
        icon: Award,
        achievements: [
          'ISO 27001 certifié',
          'SOC 2 Type II compliant',
          'RGPD full compliance',
          'Audits trimestriels validés',
        ],
      },
    ],
    [t],
  )

  const achievements = useMemo(
    () => [
      {
        icon: Star,
        title: 'Clients Premium',
        value: '1.5K+',
        description: 'Joueurs de niveau mondial nous font confiance',
        gradient: 'from-purple-500 to-violet-600',
      },
      {
        icon: Shield,
        title: 'Taux de Détection',
        value: '0%',
        description: 'Protection indétectable sur tous les anti-cheats',
        gradient: 'from-emerald-500 to-teal-600',
      },
      {
        icon: Zap,
        title: 'Uptime Annuel',
        value: '99.9%',
        description: 'Infrastructure ultra-fiable et redondante',
        gradient: 'from-amber-500 to-yellow-600',
      },
      {
        icon: Globe,
        title: 'Couverture Globale',
        value: '25+',
        description: 'Pays desservis à travers le monde',
        gradient: 'from-cyan-500 to-blue-600',
      },
      {
        icon: Gamepad2,
        title: 'Jeux Supportés',
        value: '100+',
        description: 'Catalogue complet des jeux les plus populaires',
        gradient: 'from-pink-500 to-rose-600',
      },
      {
        icon: TrendingUp,
        title: 'Croissance Annuelle',
        value: '300%',
        description: 'Progression constante depuis le lancement',
        gradient: 'from-indigo-500 to-purple-600',
      },
    ],
    [],
  )

  const values = useMemo(
    () => [
      {
        icon: MessageSquare,
        title: t.about?.values?.transparency || 'Transparence',
        description:
          'Communication ouverte et honnête avec nos clients. Pas de frais cachés, pas de surprises.',
        gradient: 'from-purple-500 to-violet-600',
      },
      {
        icon: Shield,
        title: t.about?.values?.security || 'Sécurité Maximale',
        description:
          'Protection kernel-level avancée et indétectable. Votre sécurité est notre priorité absolue.',
        gradient: 'from-emerald-500 to-teal-600',
      },
      {
        icon: Zap,
        title: t.about?.values?.performance || 'Performance Extrême',
        description:
          'Infrastructure cloud dernière génération pour des performances gaming optimales sans compromis.',
        gradient: 'from-amber-500 to-yellow-600',
      },
      {
        icon: Heart,
        title: t.about?.values?.community || 'Communauté Engagée',
        description:
          'Une communauté de passionnés qui s\'entraident. Support 24/7 et canaux Discord actifs.',
        gradient: 'from-pink-500 to-rose-600',
      },
      {
        icon: Lightbulb,
        title: t.about?.values?.innovation || 'Innovation Continue',
        description:
          'R&D permanente pour rester à la pointe de la technologie gaming et anti-cheat.',
        gradient: 'from-cyan-500 to-blue-600',
      },
      {
        icon: CheckCircle,
        title: t.about?.values?.quality || 'Qualité Obsessionnelle',
        description:
          'Chaque ligne de code, chaque feature est testée et optimisée pour l\'excellence.',
        gradient: 'from-indigo-500 to-purple-600',
      },
    ],
    [t],
  )

  const mission = {
    title: t.about?.mission?.title || 'Notre Mission',
    description:
      t.about?.mission?.description ||
      'Démocratiser l\'accès aux technologies gaming de pointe en fournissant une infrastructure cloud ultra-performante et des solutions anti-cheat indétectables. Nous croyons que chaque joueur mérite les meilleurs outils pour exceller, sans compromis sur la sécurité ou la performance.',
  }

  const vision = {
    title: t.about?.vision?.title || 'Notre Vision',
    description:
      t.about?.vision?.description ||
      'Devenir la plateforme cloud gaming de référence mondiale en révolutionnant l\'expérience de jeu compétitif. D\'ici 2027, nous visons à servir 50 000+ joueurs à travers 100+ pays avec une infrastructure présente sur tous les continents.',
  }

  const manifesto = {
    title: 'Notre Manifeste',
    points: [
      'La sécurité n\'est jamais optionnelle',
      'La performance doit être accessible à tous',
      'La transparence construit la confiance',
      'L\'innovation ne dort jamais',
      'La communauté est au cœur de tout',
      'L\'excellence est un standard, pas un objectif',
      'Le support client est sacré',
      'La conformité protège nos utilisateurs',
    ],
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <SiteHeader />

      <div className="relative">
        {/* Hero Section */}
        <HeroParallax
          badge={t.about?.badge || 'VMCloud Group OÜ'}
          title={t.about?.title || 'Notre Histoire'}
          highlight="Hackboot"
          subtitle={
            t.about?.subtitle ||
            'De la marketplace gaming à la plateforme cloud révolutionnaire. Découvrez le parcours qui nous a menés jusqu\'ici.'
          }
        />

        {/* Stats Showcase */}
        <section className="container mx-auto px-6 py-20">
          <StatsShowcase stats={stats} />
        </section>

        {/* Mission & Vision */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-black mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-600">
                  Pourquoi Nous Existons
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">Notre raison d’être et la direction que nous prenons</p>
          </div>

          <MissionVision mission={mission} vision={vision} manifesto={manifesto} />
        </section>

        {/* Timeline */}
        <section className="bg-black/50 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-600">
                  {t.about?.timeline?.title || 'Notre Parcours'}
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Les étapes clés qui ont façonné Hackboot
              </p>
            </div>

            <VerticalTimeline lineColor="rgba(147, 51, 234, 0.3)" animate={true}>
              {timelineEvents.map((event, index) => {
                const IconComponent = event.icon
                return (
                  <VerticalTimelineElement
                    key={index}
                    className="vertical-timeline-element--work"
                    contentStyle={{
                      background: 'rgba(17, 24, 39, 0.6)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '1rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      color: '#fff',
                      padding: '2rem',
                    }}
                    contentArrowStyle={{
                      borderRight: '7px solid rgba(17, 24, 39, 0.6)',
                    }}
                    iconStyle={{
                      background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                      color: '#fff',
                      boxShadow: '0 0 0 4px #000, 0 0 20px rgba(147, 51, 234, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    icon={<IconComponent size={28} />}
                  >
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full" />
                          <h3 className="text-xl sm:text-2xl font-bold text-white">{event.title}</h3>
                        </div>
                        <span className="text-lg font-bold text-purple-400">{event.year}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-base mb-4">{event.description}</p>
                      {event.achievements && event.achievements.length > 0 && (
                        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                          <h4 className="text-sm font-semibold text-purple-400 mb-3">Points clés :</h4>
                          <ul className="space-y-2">
                            {event.achievements.map((achievement, i) => (
                              <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </VerticalTimelineElement>
                )
              })}
            </VerticalTimeline>
          </div>
        </section>

        {/* Achievements */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-600">
                Nos Réalisations
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Les chiffres qui témoignent de notre excellence
            </p>
          </div>

          <AchievementGrid achievements={achievements} />
        </section>

        {/* Values */}
        <section className="bg-black/50 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-black mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-rose-600">
                  {t.about?.values?.title || 'Nos Valeurs'}
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Les principes fondamentaux qui guident chacune de nos décisions
              </p>
            </div>

            <ValueCardParallax values={values} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="glass-effect rounded-3xl p-12 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-2 border-purple-500/20 text-center">
            <Target className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Rejoignez l’Aventure
              </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Faites partie de la révolution cloud gaming. Plus de 1500 joueurs nous font déjà confiance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`/${t.locale || 'fr'}/premium`}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-600 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform"
              >
                Découvrir Premium
              </a>
              <a
                href={`/${t.locale || 'fr'}/contact`}
                className="px-8 py-4 glass-effect rounded-full text-lg font-medium hover:bg-white/10 transition-all"
              >
                Nous Contacter
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
