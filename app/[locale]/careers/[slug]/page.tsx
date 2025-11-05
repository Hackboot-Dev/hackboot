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
        <SiteHeader />

        <main className="relative pt-24">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 py-12">
            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Link
                href={`/${locale}/careers`}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to careers
              </Link>

              <div className="glass-effect p-8 md:p-12 rounded-3xl border border-white/10 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${department?.color || 'from-gray-500 to-gray-600'}`}
                    >
                      <DeptIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-5xl font-display font-bold mb-2">{jobDetails.title}</h1>
                      <div className="flex flex-wrap gap-4 text-gray-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {job.experience}
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {t.careers.types[job.type as keyof typeof t.careers.types]}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl font-semibold hover:scale-105 transition-transform whitespace-nowrap"
                  >
                    <Send className="w-5 h-5" />
                    {t.careers.apply.applyNow}
                  </Link>
                </div>

                <p className="text-xl text-gray-300 leading-relaxed">{jobDetails.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="glass-effect p-8 rounded-2xl border border-white/10">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-purple-400" />
                    {t.careers.apply.responsibilities}
                  </h2>
                  <ul className="space-y-3">
                    {jobDetails.responsibilities.map((resp: string, index: number) => (
                      <m.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                        <span className="text-gray-300">{resp}</span>
                      </m.li>
                    ))}
                  </ul>
                </div>

                <div className="glass-effect p-8 rounded-2xl border border-white/10">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                    {t.careers.apply.requirements}
                  </h2>
                  <ul className="space-y-3">
                    {jobDetails.requirements.map((req: string, index: number) => (
                      <m.li
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-500 mt-2" />
                        <span className="text-gray-300">{req}</span>
                      </m.li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="glass-effect p-8 rounded-2xl border border-white/10 mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  {t.careers.apply.benefits}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {jobDetails.benefits.map((benefit: string, index: number) => (
                    <m.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </m.div>
                  ))}
                </div>
              </div>

              <div className="glass-effect p-12 rounded-3xl border border-white/10 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to join our team?</h2>
                <p className="text-xl text-gray-400 mb-8">
                  Send us your application and let&apos;s build something amazing together.
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl font-semibold text-lg hover:scale-105 transition-transform"
                >
                  <Send className="w-6 h-6" />
                  {t.careers.apply.applyNow}
                </Link>
              </div>
            </m.div>
          </div>
        </main>

        <Footer />
      </div>
    </LazyMotion>
  )
}
