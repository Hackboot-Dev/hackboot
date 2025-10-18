'use client'

import { useI18n } from '@/lib/i18n-simple'
import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Shield,
  Zap,
  Cloud,
  Lock,
  RefreshCw,
  HeadphonesIcon,
  Settings,
  ArrowRight,
  Code,
  Server,
  Cpu,
  Database,
  Globe,
  Rocket,
  Monitor,
} from 'lucide-react'
import HeaderFixed from '@/components/HeaderFixed'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-black" />,
  ssr: false,
})

interface ServiceCard {
  icon: React.ElementType
  title: string
  subtitle: string
  description: string
  features: string[]
  color: string
}

export default function ServicesPage() {
  const { t } = useI18n()
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'

  const services: ServiceCard[] = useMemo(
    () => [
      {
        icon: Shield,
        title: 'Protection',
        subtitle: 'Indétectable',
        description: 'Multi-layer kernel-level protection tested across every major anti-cheat.',
        features: ['Kernel-level', 'HWID Spoofer', 'Stream-proof', 'Bypass EAC/BE'],
        color: 'from-purple-500 via-violet-500 to-purple-600',
      },
      {
        icon: Zap,
        title: 'Updates',
        subtitle: 'Instantanées',
        description: '24/7 developer coverage for real-time patches after every update.',
        features: ['Auto-update', 'Rollback', 'Beta access'],
        color: 'from-blue-500 via-indigo-500 to-blue-600',
      },
      {
        icon: HeadphonesIcon,
        title: 'Support',
        subtitle: 'Premium 24/7',
        description: 'Average response time under 5 minutes with dedicated Discord assistance.',
        features: ['Discord VIP', 'Setup 1-on-1', 'Guides', 'Live help'],
        color: 'from-cyan-500 via-sky-500 to-cyan-600',
      },
      {
        icon: Settings,
        title: 'Config',
        subtitle: 'Personnalisée',
        description: 'Thousands of adjustable parameters with multi-profile cloud sync.',
        features: ['UI intuitive', 'Multi-profils', 'Hotkeys', 'Cloud sync'],
        color: 'from-teal-500 via-emerald-500 to-teal-600',
      },
      {
        icon: Cloud,
        title: 'Cloud',
        subtitle: 'Infrastructure',
        description: 'Multi-region servers and optimized CDN for high availability.',
        features: ['CDN Global', 'Multi-régions'],
        color: 'from-green-500 via-lime-500 to-green-600',
      },
      {
        icon: Code,
        title: 'Private',
        subtitle: 'Development',
        description: 'Private builds with customised features for our premium clients.',
        features: ['Code privé', 'Features exclusives', 'Updates à vie'],
        color: 'from-emerald-500 via-teal-500 to-emerald-600',
      },
    ],
    [],
  )

  const guarantees = [
    { icon: Lock, text: 'Chiffrement E2E', gradient: 'from-blue-500 to-cyan-500' },
    { icon: RefreshCw, text: 'Updates gratuites', gradient: 'from-cyan-500 to-teal-500' },
    { icon: Globe, text: 'Compliance mondiale', gradient: 'from-purple-500 to-indigo-500' },
  ]

  const expertise = [
    { icon: Server, label: 'Infra bare-metal' },
    { icon: Cpu, label: 'Optimisation GPU' },
    { icon: Database, label: 'Data sécurisée' },
    { icon: Rocket, label: 'Delivery rapide' },
    { icon: Monitor, label: 'Monitoring 24/7' },
  ]

  return (
    <div className="bg-black text-white min-h-screen">
      <HeaderFixed />
      <main className="pt-24">
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center px-4 py-2 glass-effect rounded-full text-sm font-semibold gradient-text">
              {t.services?.badge || 'Services premium Hackboot'}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mt-6 mb-4">
              {t.services?.title || 'Infrastructure & sécurité au niveau pro'}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              {t.services?.subtitle || 'Des services sur-mesure pour les joueurs et équipes qui exigent la perfection.'}
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-20">
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon as React.ComponentType<{ className?: string }>
              return (
                <div
                  key={service.title}
                  className={`relative h-full rounded-3xl bg-gradient-to-br ${service.color} p-[1px]`}
                >
                  <div className="h-full bg-black/90 rounded-3xl p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400">{service.subtitle}</p>
                        <h3 className="text-2xl font-semibold">{service.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{service.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                      {service.features.map((feature) => (
                        <span key={feature} className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/${locale}/contact`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                    >
                      {t.services?.cta || 'Parler à un expert'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="bg-white/5 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-display font-bold mb-10 text-center">
              {t.services?.guarantees?.title || 'Nos garanties'}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {guarantees.map(({ icon: Icon, text, gradient }) => (
                <div key={text} className={`rounded-2xl p-6 bg-gradient-to-br ${gradient} text-black font-semibold`}>
                  <div className="w-12 h-12 rounded-xl bg-black/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="glass-effect rounded-3xl border border-white/5 p-10">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-display font-bold">
                  {t.services?.expertise?.title || 'Exécution technique maîtrisée'}
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {t.services?.expertise?.description ||
                    'Nous opérons sur des infrastructures bare-metal optimisées avec un monitoring en temps réel et un pipeline de déploiement continu.'}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-300">
                  {expertise.map(({ icon: Icon, label }) => (
                    <span key={label} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      <Icon className="w-4 h-4 text-accent" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full max-w-sm bg-white/5 rounded-2xl border border-white/10 p-6 space-y-4">
                <h3 className="text-xl font-semibold">{t.services?.contact?.title || 'Prendre rendez-vous'}</h3>
                <p className="text-sm text-gray-300">
                  {t.services?.contact?.description ||
                    'Nos équipes vous répondent sous 24h pour évaluer vos besoins et préparer un plan de déploiement.'}
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center w-full px-4 py-3 bg-accent text-white rounded-full text-sm font-semibold"
                >
                  {t.services?.contact?.cta || 'Planifier un call'}
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
