'use client'

import { useI18n } from '@/lib/i18n-simple'
import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import {
  Gamepad2,
  Code,
  Cloud,
  Rocket,
  Shield,
  Users,
  Zap,
  Target,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  FileText,
  Award,
} from 'lucide-react'
import SiteHeader from '@/components/SiteHeader'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-black" />,
  ssr: false,
})

export default function AboutPage() {
  const { t } = useI18n()

  const timelineEvents = useMemo(
    () => [
      {
        year: '2023',
        title: t.about?.timeline?.event1?.title || 'Genesis',
        desc: t.about?.timeline?.event1?.description || 'Game keys marketplace',
        Icon: Gamepad2,
      },
      {
        year: '2023',
        title: t.about?.timeline?.event2?.title || 'Pivot',
        desc: t.about?.timeline?.event2?.description || 'Custom gaming software',
        Icon: Code,
      },
      {
        year: '2025',
        title: t.about?.timeline?.event3?.title || 'Cloud Gaming',
        desc: t.about?.timeline?.event3?.description || 'Platform revolution',
        Icon: Cloud,
      },
      {
        year: '2025',
        title: t.about?.timeline?.event4?.title || 'VMCloud',
        desc: t.about?.timeline?.event4?.description || 'Group expansion',
        Icon: Rocket,
      },
    ],
    [t],
  )

  const highlights = [
    { icon: Shield, label: t.about?.highlights?.security || 'Security first' },
    { icon: Users, label: t.about?.highlights?.community || 'Trusted community' },
    { icon: Zap, label: t.about?.highlights?.performance || 'High performance' },
    { icon: Target, label: t.about?.highlights?.vision || 'Clear vision' },
  ]

  const values = [
    { icon: MessageSquare, label: t.about?.values?.transparency || 'Transparency' },
    { icon: TrendingUp, label: t.about?.values?.growth || 'Growth mindset' },
    { icon: CheckCircle, label: t.about?.values?.quality || 'Quality obsessed' },
    { icon: AlertTriangle, label: t.about?.values?.responsibility || 'Responsible by design' },
    { icon: FileText, label: t.about?.values?.compliance || 'Compliance ready' },
    { icon: Award, label: t.about?.values?.excellence || 'Operational excellence' },
  ]

  return (
    <div className="bg-black text-white min-h-screen animate-fade-in">
      <SiteHeader />
      <main className="pt-24">
        <section className="relative overflow-hidden animate-scale-in">
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15)_0%,_transparent_55%)]" />
          <div className="container mx-auto px-6 py-24 relative">
            <div className="max-w-3xl">
              <span className="inline-flex items-center px-4 py-2 glass-effect rounded-full text-sm font-semibold gradient-text">
                {t.about?.badge || 'VMCloud Group OÜ'}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold mt-6 mb-4">
                {t.about?.title || 'Our story'}
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                {t.about?.subtitle || 'Discover the journey and vision of Hackboot.'}
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16 animate-slide-up">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-4 gradient-text">
                {t.about?.overview?.title || 'Overview'}
              </h2>
              <p className="text-base text-gray-300 leading-relaxed mb-6">
                {t.about?.overview?.description || 'Hackboot is an innovative technology company.'}
              </p>
              <div className="space-y-4">
                <div className="glass-effect p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-gray-300">
                    {t.about?.overview?.mission || 'We build premium gaming experiences with uncompromising security.'}
                  </p>
                </div>
                <div className="glass-effect p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-gray-300">
                    {t.about?.overview?.vision || 'A trusted ecosystem for competitive players and creators.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-3xl border border-white/5 p-6 grid sm:grid-cols-2 gap-4">
              {highlights.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-white/5">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-sm text-gray-300">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white/5 py-16 animate-fade-in">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-display font-bold mb-10 text-center">
              {t.about?.timeline?.title || 'Timeline'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {timelineEvents.map(({ year, title, desc, Icon }) => (
                <div key={year + title} className="glass-effect rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wide">
                      {year}
                    </div>
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16 animate-scale-in">
          <h2 className="text-3xl font-display font-bold mb-10 text-center gradient-text">
            {t.about?.values?.title || 'Our values'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, label }) => (
              <div key={label} className="glass-effect rounded-2xl border border-white/5 p-6 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/5">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-sm text-gray-200">{label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
