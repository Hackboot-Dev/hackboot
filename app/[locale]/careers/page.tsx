'use client'

import { useMemo, useState } from 'react'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  Code,
  Palette,
  Server,
  Shield,
  Headphones,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  Globe,
  Rocket,
  ChevronRight,
  Briefcase,
} from 'lucide-react'
import SiteHeader from '@/components/SiteHeader'
import { useI18n } from '@/lib/i18n-simple'
import careersData from '@/data/careers.json'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-24 bg-black" />,
  ssr: false,
})

const iconMap: Record<string, any> = {
  Code,
  Palette,
  Server,
  Shield,
  Headphones,
}

export default function CareersPage() {
  const { t, locale } = useI18n()
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')

  const filteredJobs = useMemo(() => {
    if (selectedDepartment === 'all') {
      return careersData.jobs
    }
    return careersData.jobs.filter((job) => job.department === selectedDepartment)
  }, [selectedDepartment])

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <SiteHeader />

        <main className="relative pt-24">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />

          <section className="relative py-24 px-4">
            <div className="max-w-7xl mx-auto">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                  <span className="text-purple-400 font-medium">{t.careers.badge}</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent">
                  {t.careers.title}
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">{t.careers.subtitle}</p>
              </m.div>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
              >
                {[
                  {
                    icon: Briefcase,
                    value: careersData.jobs.length,
                    label: t.careers.stats.openings,
                    gradient: 'from-purple-500 to-violet-600',
                  },
                  {
                    icon: Globe,
                    value: '15+',
                    label: t.careers.stats.countries,
                    gradient: 'from-cyan-500 to-blue-600',
                  },
                  {
                    icon: Users,
                    value: '100%',
                    label: t.careers.stats.remote,
                    gradient: 'from-pink-500 to-rose-600',
                  },
                  {
                    icon: TrendingUp,
                    value: '300%',
                    label: t.careers.stats.growth,
                    gradient: 'from-emerald-500 to-teal-600',
                  },
                ].map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <m.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="glass-effect p-6 rounded-2xl border border-white/10"
                    >
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.gradient} mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </m.div>
                  )
                })}
              </m.div>
            </div>
          </section>

          <section className="py-24 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-4 mb-12">
                <button
                  onClick={() => setSelectedDepartment('all')}
                  className={`px-6 py-3 rounded-xl transition-all ${
                    selectedDepartment === 'all'
                      ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white'
                      : 'glass-effect border border-white/10 text-gray-300 hover:border-purple-500/50'
                  }`}
                >
                  {t.careers.filters.all}
                </button>
                {careersData.departments.map((dept) => {
                  const Icon = iconMap[dept.icon]
                  return (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDepartment(dept.id)}
                      className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
                        selectedDepartment === dept.id
                          ? `bg-gradient-to-r ${dept.color} text-white`
                          : 'glass-effect border border-white/10 text-gray-300 hover:border-purple-500/50'
                      }`}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      {t.careers.departments[dept.id as keyof typeof t.careers.departments]}
                    </button>
                  )
                })}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredJobs.map((job, index) => {
                  const department = careersData.departments.find((d) => d.id === job.department)
                  const DeptIcon = department ? iconMap[department.icon] : Briefcase
                  const jobDetails = t.careers.jobs[job.id as keyof typeof t.careers.jobs]

                  return (
                    <m.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group glass-effect p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${department?.color || 'from-gray-500 to-gray-600'}`}
                        >
                          <DeptIcon className="w-6 h-6" />
                        </div>
                        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-400">
                          {t.careers.types[job.type as keyof typeof t.careers.types]}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                        {jobDetails.title}
                      </h3>
                      <p className="text-gray-400 mb-6 line-clamp-2">{jobDetails.shortDescription}</p>

                      <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {job.experience}
                        </div>
                      </div>

                      <Link
                        href={`/${locale}/careers/${job.id}`}
                        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors group"
                      >
                        {t.careers.apply.button}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </m.div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="py-24 px-4 bg-gradient-to-b from-purple-900/10 to-transparent">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">{t.careers.culture.title}</h2>
                <p className="text-xl text-gray-400">{t.careers.culture.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {t.careers.culture.values.map((value: any, index: number) => (
                  <m.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="glass-effect p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all"
                  >
                    <div className="text-5xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-gray-400">{value.description}</p>
                  </m.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">{t.careers.perks.title}</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {t.careers.perks.items.map((perk: any, index: number) => (
                  <m.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="glass-effect p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all"
                  >
                    <div className="text-4xl mb-3">{perk.icon}</div>
                    <h3 className="text-lg font-bold mb-2">{perk.title}</h3>
                    <p className="text-sm text-gray-400">{perk.description}</p>
                  </m.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 px-4 bg-gradient-to-b from-transparent to-purple-900/10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">{t.careers.process.title}</h2>
                <p className="text-xl text-gray-400">{t.careers.process.subtitle}</p>
              </div>

              <div className="relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-violet-500 to-transparent hidden md:block" />

                {t.careers.process.steps.map((step: any, index: number) => (
                  <m.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className={`flex items-center gap-8 mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className="flex-1 glass-effect p-6 rounded-2xl border border-white/10">
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center text-xl font-bold">
                      {step.number}
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </m.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass-effect p-12 rounded-3xl border border-white/10"
              >
                <Rocket className="w-16 h-16 mx-auto mb-6 text-purple-400" />
                <h2 className="text-4xl font-display font-bold mb-4">{t.careers.cta.title}</h2>
                <p className="text-xl text-gray-400 mb-8">{t.careers.cta.description}</p>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl font-semibold hover:scale-105 transition-transform"
                >
                  {t.careers.cta.button}
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </m.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </LazyMotion>
  )
}
