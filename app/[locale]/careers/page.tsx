'use client'

import { useMemo, useState } from 'react'
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion'
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
  Sparkles,
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const cardHoverVariants = {
  rest: { scale: 1, rotateY: 0 },
  hover: {
    scale: 1.03,
    rotateY: 2,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-16"
              >
                <m.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6 hover:bg-purple-500/20 hover:scale-105 transition-all cursor-default"
                >
                  <span className="text-purple-400 font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {t.careers.badge}
                  </span>
                </m.div>
                <m.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
                >
                  {t.careers.title}
                </m.h1>
                <m.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl text-gray-400 max-w-3xl mx-auto"
                >
                  {t.careers.subtitle}
                </m.p>
              </m.div>

              <m.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
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
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.05,
                        rotateY: 5,
                        transition: { duration: 0.3 },
                      }}
                      className="glass-effect p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 cursor-default group"
                    >
                      <m.div
                        className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.gradient} mb-4`}
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-6 h-6" />
                      </m.div>
                      <m.div
                        className="text-3xl font-bold mb-1"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      >
                        {stat.value}
                      </m.div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        {stat.label}
                      </div>
                    </m.div>
                  )
                })}
              </m.div>
            </div>
          </section>

          <section className="py-24 px-4">
            <div className="max-w-7xl mx-auto">
              <m.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-4 mb-12"
              >
                <m.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDepartment('all')}
                  className={`px-6 py-3 rounded-xl transition-all ${
                    selectedDepartment === 'all'
                      ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/50'
                      : 'glass-effect border border-white/10 text-gray-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20'
                  }`}
                >
                  {t.careers.filters.all}
                </m.button>
                {careersData.departments.map((dept) => {
                  const Icon = iconMap[dept.icon]
                  return (
                    <m.button
                      key={dept.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDepartment(dept.id)}
                      className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
                        selectedDepartment === dept.id
                          ? `bg-gradient-to-r ${dept.color} text-white shadow-lg shadow-purple-500/50`
                          : 'glass-effect border border-white/10 text-gray-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20'
                      }`}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      {t.careers.departments[dept.id as keyof typeof t.careers.departments]}
                    </m.button>
                  )
                })}
              </m.div>

              <AnimatePresence mode="wait">
                <m.div
                  key={selectedDepartment}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {filteredJobs.map((job, index) => {
                    const department = careersData.departments.find((d) => d.id === job.department)
                    const DeptIcon = department ? iconMap[department.icon] : Briefcase
                    const jobDetails = t.careers.jobs[job.id as keyof typeof t.careers.jobs]

                    return (
                      <m.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{
                          scale: 1.02,
                          y: -5,
                          transition: { duration: 0.2 },
                        }}
                        className="group glass-effect p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/20"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <m.div
                            whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${department?.color || 'from-gray-500 to-gray-600'}`}
                          >
                            <DeptIcon className="w-6 h-6" />
                          </m.div>
                          <m.span
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-400 hover:bg-purple-500/20 transition-all"
                          >
                            {t.careers.types[job.type as keyof typeof t.careers.types]}
                          </m.span>
                        </div>

                        <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                          {jobDetails.title}
                        </h3>
                        <p className="text-gray-400 mb-6 line-clamp-2 group-hover:text-gray-300 transition-colors">
                          {jobDetails.shortDescription}
                        </p>

                        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
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
                          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-all group/link"
                        >
                          <span className="group-hover/link:underline">{t.careers.apply.button}</span>
                          <m.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                            <ChevronRight className="w-4 h-4" />
                          </m.div>
                        </Link>
                      </m.div>
                    )
                  })}
                </m.div>
              </AnimatePresence>
            </div>
          </section>

          <section className="py-24 px-4 bg-gradient-to-b from-purple-900/10 to-transparent">
            <div className="max-w-7xl mx-auto">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">{t.careers.culture.title}</h2>
                <p className="text-xl text-gray-400">{t.careers.culture.subtitle}</p>
              </m.div>

              <m.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {t.careers.culture.values.map((value: any, index: number) => (
                  <m.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      y: -10,
                      transition: { duration: 0.3 },
                    }}
                    className="glass-effect p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/20 group"
                  >
                    <m.div
                      className="text-5xl mb-4"
                      whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {value.icon}
                    </m.div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{value.description}</p>
                  </m.div>
                ))}
              </m.div>
            </div>
          </section>

          <section className="py-24 px-4">
            <div className="max-w-7xl mx-auto">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">{t.careers.perks.title}</h2>
              </m.div>

              <m.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {t.careers.perks.items.map((perk: any, index: number) => (
                  <m.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      rotate: 2,
                      transition: { duration: 0.2 },
                    }}
                    className="glass-effect p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 group"
                  >
                    <m.div
                      className="text-4xl mb-3"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {perk.icon}
                    </m.div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">
                      {perk.title}
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      {perk.description}
                    </p>
                  </m.div>
                ))}
              </m.div>
            </div>
          </section>

          <section className="py-24 px-4 bg-gradient-to-b from-transparent to-purple-900/10">
            <div className="max-w-5xl mx-auto">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">{t.careers.process.title}</h2>
                <p className="text-xl text-gray-400">{t.careers.process.subtitle}</p>
              </m.div>

              <div className="relative">
                <m.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-violet-500 to-transparent hidden md:block origin-top"
                />

                {t.careers.process.steps.map((step: any, index: number) => (
                  <m.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className={`flex items-center gap-8 mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <m.div
                      whileHover={{
                        scale: 1.03,
                        y: -5,
                        transition: { duration: 0.2 },
                      }}
                      className="flex-1 glass-effect p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 group"
                    >
                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{step.description}</p>
                    </m.div>
                    <m.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
                      whileHover={{
                        scale: 1.2,
                        rotate: 360,
                        transition: { duration: 0.5 },
                      }}
                      className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-purple-500/50 cursor-default"
                    >
                      {step.number}
                    </m.div>
                    <div className="flex-1 hidden md:block" />
                  </m.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <m.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                className="glass-effect p-12 rounded-3xl border border-white/10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/30 transition-all group"
              >
                <m.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
                  whileHover={{
                    y: [-5, 0, -5],
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 0.6, repeat: Infinity, repeatDelay: 0.5 },
                  }}
                  className="inline-block mb-6"
                >
                  <Rocket className="w-16 h-16 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </m.div>
                <m.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-4xl font-display font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-violet-400 group-hover:bg-clip-text transition-all"
                >
                  {t.careers.cta.title}
                </m.h2>
                <m.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-xl text-gray-400 mb-8 group-hover:text-gray-300 transition-colors"
                >
                  {t.careers.cta.description}
                </m.p>
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Link href={`/${locale}/contact`}>
                    <m.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl font-semibold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-shadow"
                    >
                      {t.careers.cta.button}
                      <m.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                        <ChevronRight className="w-5 h-5" />
                      </m.div>
                    </m.div>
                  </Link>
                </m.div>
              </m.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </LazyMotion>
  )
}
