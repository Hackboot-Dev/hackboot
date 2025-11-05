'use client'

import { use } from 'react'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  Send,
  Code,
  Palette,
  Server,
  Shield,
  Headphones,
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

export default function JobDetailPage() {
  const { t, locale } = useI18n()
  const params = useParams()
  const slug = params.slug as string

  const job = careersData.jobs.find((j) => j.id === slug)

  if (!job) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Job not found</h1>
          <Link href={`/${locale}/careers`} className="text-purple-400 hover:text-purple-300">
            Back to careers
          </Link>
        </div>
      </div>
    )
  }

  const department = careersData.departments.find((d) => d.id === job.department)
  const DeptIcon = department ? iconMap[department.icon] : Briefcase
  const jobDetails = t.careers.jobs[job.id as keyof typeof t.careers.jobs]

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <ThreeBackground />
        <SiteHeader />

        <main className="relative pt-24">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 py-12">
            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <m.div whileHover={{ x: -5 }} transition={{ duration: 0.2 }} className="inline-block mb-8">
                <Link
                  href={`/${locale}/careers`}
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                  <m.div whileHover={{ x: -3 }} transition={{ duration: 0.2 }}>
                    <ArrowLeft className="w-4 h-4" />
                  </m.div>
                  <span className="group-hover:underline">Back to careers</span>
                </Link>
              </m.div>

              <m.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="glass-effect p-8 md:p-12 rounded-3xl border border-white/10 mb-8 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <m.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${department?.color || 'from-gray-500 to-gray-600'} shadow-lg`}
                    >
                      <DeptIcon className="w-8 h-8" />
                    </m.div>
                    <div>
                      <m.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-violet-400 group-hover:bg-clip-text transition-all"
                      >
                        {jobDetails.title}
                      </m.h1>
                      <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-wrap gap-4 text-gray-400 group-hover:text-gray-300 transition-colors"
                      >
                        <m.div
                          whileHover={{ scale: 1.05, x: 2 }}
                          className="flex items-center gap-2 cursor-default"
                        >
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </m.div>
                        <m.div
                          whileHover={{ scale: 1.05, x: 2 }}
                          className="flex items-center gap-2 cursor-default"
                        >
                          <Clock className="w-4 h-4" />
                          {job.experience}
                        </m.div>
                        <m.div
                          whileHover={{ scale: 1.05, x: 2 }}
                          className="flex items-center gap-2 cursor-default"
                        >
                          <Briefcase className="w-4 h-4" />
                          {t.careers.types[job.type as keyof typeof t.careers.types]}
                        </m.div>
                      </m.div>
                    </div>
                  </div>
                  <m.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Link href={`/${locale}/contact`}>
                      <m.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl font-semibold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-shadow whitespace-nowrap"
                      >
                        <Send className="w-5 h-5" />
                        {t.careers.apply.applyNow}
                      </m.div>
                    </Link>
                  </m.div>
                </div>

                <m.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-xl text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors"
                >
                  {jobDetails.description}
                </m.p>
              </m.div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <m.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{
                    scale: 1.02,
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  className="glass-effect p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all group"
                >
                  <m.h2
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 group-hover:text-purple-400 transition-colors"
                  >
                    <CheckCircle2 className="w-6 h-6 text-purple-400" />
                    {t.careers.apply.responsibilities}
                  </m.h2>
                  <ul className="space-y-3">
                    {jobDetails.responsibilities.map((resp: string, index: number) => (
                      <m.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ x: 5, transition: { duration: 0.2 } }}
                        className="flex items-start gap-3 cursor-default"
                      >
                        <m.div
                          whileHover={{ scale: 1.5 }}
                          className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2"
                        />
                        <span className="text-gray-300 group-hover:text-gray-200 transition-colors">{resp}</span>
                      </m.li>
                    ))}
                  </ul>
                </m.div>

                <m.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{
                    scale: 1.02,
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  className="glass-effect p-8 rounded-2xl border border-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all group"
                >
                  <m.h2
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 group-hover:text-cyan-400 transition-colors"
                  >
                    <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                    {t.careers.apply.requirements}
                  </m.h2>
                  <ul className="space-y-3">
                    {jobDetails.requirements.map((req: string, index: number) => (
                      <m.li
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ x: -5, transition: { duration: 0.2 } }}
                        className="flex items-start gap-3 cursor-default"
                      >
                        <m.div
                          whileHover={{ scale: 1.5 }}
                          className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-500 mt-2"
                        />
                        <span className="text-gray-300 group-hover:text-gray-200 transition-colors">{req}</span>
                      </m.li>
                    ))}
                  </ul>
                </m.div>
              </div>

              <m.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{
                  scale: 1.01,
                  transition: { duration: 0.2 },
                }}
                className="glass-effect p-8 rounded-2xl border border-white/10 mb-12 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 transition-all group"
              >
                <m.h2
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 group-hover:text-emerald-400 transition-colors"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  {t.careers.apply.benefits}
                </m.h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {jobDetails.benefits.map((benefit: string, index: number) => (
                    <m.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{
                        y: -4,
                        rotateX: 5,
                        rotateY: 5,
                        transition: { duration: 0.3, ease: 'easeOut' },
                      }}
                      style={{
                        transformStyle: 'preserve-3d',
                        perspective: '1000px',
                      }}
                      className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-300 group-hover:text-gray-200 transition-colors">{benefit}</span>
                    </m.div>
                  ))}
                </div>
              </m.div>

              <m.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                className="glass-effect p-12 rounded-3xl border border-white/10 text-center hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/30 transition-all group"
              >
                <m.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-violet-400 group-hover:bg-clip-text transition-all px-4"
                >
                  Ready to join our team?
                </m.h2>
                <m.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-lg sm:text-xl text-gray-400 mb-8 group-hover:text-gray-300 transition-colors px-4"
                >
                  Send us your application and let&apos;s build something amazing together.
                </m.p>
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Link href={`/${locale}/contact`}>
                    <m.div
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-shadow"
                    >
                      <Send className="w-6 h-6" />
                      {t.careers.apply.applyNow}
                    </m.div>
                  </Link>
                </m.div>
              </m.div>
            </m.div>
          </div>
        </main>

        <Footer />
      </div>
    </LazyMotion>
  )
}
