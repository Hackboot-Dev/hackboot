'use client'

import { useMemo, useState } from 'react'
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
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
  Briefcase,
  Sparkles,
  ChevronDown,
  Gem,
  Handshake,
  DollarSign,
  Home,
  BookOpen,
  Laptop,
  Umbrella,
  Heart,
  Gamepad2,
} from 'lucide-react'
import SiteHeader from '@/components/SiteHeader'
import { useI18n } from '@/lib/i18n-simple'
import careersData from '@/data/careers.json'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-24 bg-black" />,
  ssr: false,
})

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), {
  loading: () => <div className="fixed inset-0 -z-10 bg-black" />,
  ssr: false,
})

const iconMap: Record<string, any> = {
  Code,
  Palette,
  Server,
  Shield,
  Headphones,
}

const careersIconMap: Record<string, any> = {
  Globe,
  Rocket,
  Gem,
  Handshake,
  DollarSign,
  Home,
  Clock,
  BookOpen,
  Laptop,
  Umbrella,
  Heart,
  Gamepad2,
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
  const [openCultureCard, setOpenCultureCard] = useState<number | null>(null)
  const [openPerkCard, setOpenPerkCard] = useState<number | null>(null)

  const filteredJobs = useMemo(() => {
    if (selectedDepartment === 'all') {
      return careersData.jobs
    }
    return careersData.jobs.filter((job) => job.department === selectedDepartment)
  }, [selectedDepartment])

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <ThreeBackground />
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
                  className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 px-4"
                >
                  {t.careers.title}
                </m.h1>
                <m.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-4"
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
                        y: -8,
                        rotateX: 5,
                        rotateY: 5,
                        transition: { duration: 0.3, ease: 'easeOut' },
                      }}
                      style={{
                        transformStyle: 'preserve-3d',
                        perspective: '1000px',
                      }}
                      className="glass-effect p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/30 cursor-pointer group"
                    >
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.gradient} mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
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
                      <Link key={job.id} href={`/${locale}/careers/${job.id}`}>
                        <m.div
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          whileHover={{
                            scale: 1.02,
                            y: -5,
                            transition: { duration: 0.2 },
                          }}
                          className="group glass-effect p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer"
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

                          <div className="flex flex-wrap gap-4 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {job.experience}
                            </div>
                          </div>
                        </m.div>
                      </Link>
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
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 px-4">{t.careers.culture.title}</h2>
                <p className="text-lg sm:text-xl text-gray-400 px-4">{t.careers.culture.subtitle}</p>
              </m.div>

              <m.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {t.careers.culture.values.map((value: any, index: number) => {
                  const isOpen = openCultureCard === index
                  const IconComponent = careersIconMap[value.icon] || Globe
                  return (
                    <m.div
                      key={index}
                      variants={itemVariants}
                      onClick={() => setOpenCultureCard(isOpen ? null : index)}
                      whileHover={{
                        y: -12,
                        rotateX: 8,
                        rotateY: 8,
                        transition: { duration: 0.3, ease: 'easeOut' },
                      }}
                      style={{
                        transformStyle: 'preserve-3d',
                        perspective: '1000px',
                      }}
                      className="glass-effect p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/30 group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-purple-400">
                          <IconComponent className="w-12 h-12" strokeWidth={1.5} />
                        </div>
                        <m.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-purple-400"
                        >
                          <ChevronDown className="w-6 h-6" />
                        </m.div>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed mb-3">
                        {value.description}
                      </p>
                      <AnimatePresence mode="wait">
                        {isOpen && value.details && (
                          <m.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-xs text-gray-500 mt-4 pt-4 border-t border-white/10 overflow-hidden leading-relaxed"
                          >
                            {value.details}
                          </m.div>
                        )}
                      </AnimatePresence>
                      {!isOpen && value.details && (
                        <p className="text-purple-400 text-xs mt-3 font-medium">Lire la suite →</p>
                      )}
                    </m.div>
                  )
                })}
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
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 px-4">{t.careers.perks.title}</h2>
                {t.careers.perks.subtitle && (
                  <p className="text-lg sm:text-xl text-gray-400 px-4">{t.careers.perks.subtitle}</p>
                )}
              </m.div>

              <m.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {t.careers.perks.items.map((perk: any, index: number) => {
                  const isOpen = openPerkCard === index
                  const IconComponent = careersIconMap[perk.icon] || Briefcase
                  return (
                    <m.div
                      key={index}
                      variants={itemVariants}
                      onClick={() => setOpenPerkCard(isOpen ? null : index)}
                      whileHover={{
                        y: -8,
                        rotateX: 5,
                        rotateY: 5,
                        transition: { duration: 0.3, ease: 'easeOut' },
                      }}
                      style={{
                        transformStyle: 'preserve-3d',
                        perspective: '1000px',
                      }}
                      className="glass-effect p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/30 group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-purple-400">
                          <IconComponent className="w-10 h-10" strokeWidth={1.5} />
                        </div>
                        <m.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-purple-400"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </m.div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">
                        {perk.title}
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors mb-2">
                        {perk.description}
                      </p>
                      <AnimatePresence mode="wait">
                        {isOpen && perk.details && (
                          <m.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-xs text-gray-500 mt-3 pt-3 border-t border-white/10 overflow-hidden leading-relaxed"
                          >
                            {perk.details}
                          </m.div>
                        )}
                      </AnimatePresence>
                      {!isOpen && perk.details && (
                        <p className="text-purple-400 text-xs mt-2 font-medium">Cliquez pour les détails →</p>
                      )}
                    </m.div>
                  )
                })}
              </m.div>
            </div>
          </section>

          <section className="py-24 px-4 bg-gradient-to-b from-transparent to-purple-900/10">
            <div className="max-w-6xl mx-auto">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 px-4">
                  {t.careers.process.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 px-4">{t.careers.process.subtitle}</p>
              </m.div>

              <VerticalTimeline lineColor="rgba(147, 51, 234, 0.3)" animate={true}>
                {t.careers.process.steps.map((step: any, index: number) => (
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
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                    }}
                    icon={<span>{step.number}</span>}
                  >
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full" />
                          <h3 className="text-xl sm:text-2xl font-bold text-white hover:text-purple-400 transition-colors">
                            {step.title}
                          </h3>
                        </div>
                        {step.duration && (
                          <span className="text-sm text-purple-400 font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {step.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 leading-relaxed text-base mb-4">{step.description}</p>
                      {step.details && (
                        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-sm text-gray-400 leading-relaxed mb-3">{step.details}</p>
                          {step.tips && (
                            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-white/10">
                              <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-purple-300 leading-relaxed">
                                <span className="font-semibold">Pro tip:</span> {step.tips}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </VerticalTimelineElement>
                ))}
              </VerticalTimeline>
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
                  className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-violet-400 group-hover:bg-clip-text transition-all px-4"
                >
                  {t.careers.cta.title}
                </m.h2>
                <m.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-lg sm:text-xl text-gray-400 mb-8 group-hover:text-gray-300 transition-colors px-4"
                >
                  {t.careers.cta.description}
                </m.p>
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Link href={`/${locale}/careers/apply`}>
                    <m.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl font-semibold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-shadow"
                    >
                      {t.careers.cta.button}
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
