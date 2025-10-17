'use client'

import { useI18n } from '@/lib/i18n-simple'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { ChevronDown, Gamepad2, Code, Cloud, Rocket, Globe, Shield, Users, Zap, Target, MessageSquare, TrendingUp, CheckCircle, AlertTriangle, FileText, Award } from 'lucide-react'
import HeaderFixed from '@/components/HeaderFixed'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-black" />,
  ssr: false
})

export default function AboutPage() {
  const { t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setMousePos({
          x: (e.clientX / window.innerWidth) - 0.5,
          y: (e.clientY / window.innerHeight) - 0.5
        })
      })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const timelineEvents = useMemo(() => [
    {
      year: '2023',
      title: t.about?.timeline?.event1?.title || 'Genesis',
      desc: t.about?.timeline?.event1?.description || 'Game keys marketplace',
      Icon: Gamepad2
    },
    {
      year: '2023',
      title: t.about?.timeline?.event2?.title || 'Pivot',
      desc: t.about?.timeline?.event2?.description || 'Custom gaming software',
      Icon: Code
    },
    {
      year: '2025',
      title: t.about?.timeline?.event3?.title || 'Cloud Gaming',
      desc: t.about?.timeline?.event3?.description || 'Platform revolution',
      Icon: Cloud
    },
    {
      year: '2025',
      title: t.about?.timeline?.event4?.title || 'VMCloud',
      desc: t.about?.timeline?.event4?.description || 'Group expansion',
      Icon: Rocket
    }
  ], [t])

  useEffect(() => {
    if (!titleRef.current) return

    const text = t.about?.title || 'OUR STORY'
    titleRef.current.textContent = ''

    text.split('').forEach((char, i) => {
      const span = document.createElement('span')
      span.textContent = char
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      span.style.transform = 'translateY(20px)'
      span.style.transition = `all 0.5s ease ${i * 0.05}s`
      // Appliquer immédiatement la couleur blanche pour la visibilité
      span.style.color = '#ffffff'
      titleRef.current!.appendChild(span)

      setTimeout(() => {
        span.style.opacity = '1'
        span.style.transform = 'translateY(0)'
        span.style.background = 'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.8) 100%)';
        (span.style as any).webkitBackgroundClip = 'text';
        (span.style as any).webkitTextFillColor = 'transparent'
        span.style.backgroundClip = 'text'
        span.style.color = 'transparent'
      }, 100 + (i * 50))
    })
  }, [t.about?.title])

  return (
    <div ref={containerRef} className="bg-black text-white">
      <HeaderFixed />

      {/* Hero Section avec style cohérent */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background similar to main page */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            animate={{
              x: mousePos.x * 30,
              y: mousePos.y * 30,
            }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="absolute inset-0"
            style={{ opacity }}
          >
            <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          </motion.div>
        </div>

        <motion.div
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge similaire au hero principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div className="inline-block px-4 py-1.5 glass-effect rounded-full">
              <span className="text-sm md:text-base font-semibold gradient-text">
                {t.about?.badge || 'VMCloud Group OÜ'}
              </span>
            </div>
          </motion.div>

          {/* Titre avec animation caractère par caractère */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl font-display font-bold mb-6"
          >
            {t.about?.title || 'OUR STORY'}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            {t.about?.subtitle || 'Discover the story and vision of Hackboot'}
          </motion.p>

          {/* Metadata bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="inline-flex items-center gap-4 text-xs text-gray-500 glass-effect px-4 py-2 rounded-full"
          >
            <span>EST. 2023</span>
            <span className="w-px h-4 bg-gray-700" />
            <span>ESTONIA</span>
            <span className="w-px h-4 bg-gray-700" />
            <span>VMCLOUD GROUP</span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-white/50" />
        </motion.div>
      </section>

      {/* Overview Section - Glass morphism style */}
      <section className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="grid md:grid-cols-2 gap-12"
          >
            <div>
              <h2 className="text-3xl font-bold mb-4 gradient-text">
                {t.about?.overview?.title || 'Overview'}
              </h2>
              <p className="text-base text-gray-300 mb-4 leading-relaxed">
                {t.about?.overview?.description || 'Hackboot is an innovative technology company.'}
              </p>
              <div className="space-y-4">
                <div className="glass-effect p-4 rounded-xl border border-white/5">
                  <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    {t.about?.overview?.vmcloud || 'Part of VMCloud Group OÜ'}
                  </h3>
                  <p className="text-gray-400">
                    {t.about?.overview?.vmcloudDesc || 'Leading cloud solutions provider'}
                  </p>
                </div>
                <div className="glass-effect p-4 rounded-xl border border-white/5">
                  <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    {t.about?.overview?.established || 'Established in 2023'}
                  </h3>
                  <p className="text-gray-400">
                    {t.about?.overview?.establishedDesc || 'Founded with a clear vision'}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 h-full">
              {[
                { number: '100+', label: t.about?.stats?.games || 'Jeux disponibles' },
                { number: '3', label: t.about?.stats?.products || 'Produits principaux' },
                { number: '2023', label: t.about?.stats?.founded || 'Année' },
                { number: '24/7', label: t.about?.stats?.support || 'Support' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="glass-effect rounded-xl border border-white/5 hover:border-accent/50 transition-all min-h-[120px] flex flex-col items-center justify-center p-4"
                >
                  <div className="text-2xl font-bold gradient-text">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400 text-center mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section - Modernized */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text"
          >
            {t.about?.timeline?.title || 'Our Journey'}
          </motion.h2>

          <div className="relative">
            {/* Central line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent -translate-x-1/2" />

            {/* Events */}
            <div className="space-y-16">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className="flex-1">
                    <div className={`glass-effect p-4 rounded-xl border border-white/5 hover:border-accent/30 transition-all ${
                      index % 2 === 0 ? 'text-right' : 'text-left'
                    }`}>
                      <div className={`mb-2 ${index % 2 === 0 ? 'flex justify-end' : 'flex justify-start'}`}>
                        <event.Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div className="text-xl font-bold gradient-text mb-1">{event.year}</div>
                      <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-400">{event.desc}</p>
                    </div>
                  </div>

                  {/* Center point */}
                  <div className="relative">
                    <div className="w-4 h-4 bg-accent rounded-full" />
                    <div className="absolute inset-0 w-4 h-4 bg-accent rounded-full animate-ping opacity-30" />
                  </div>

                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Clean cards */}
      <section className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text"
          >
            {t.about?.vision?.title || 'Our Philosophy'}
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-effect p-6 rounded-xl border border-white/5 hover:border-accent/30 transition-all group"
            >
              <h3 className="text-xl font-bold mb-3 gradient-text">
                {t.about?.vision?.tab || 'Vision'}
              </h3>
              <p className="text-base text-gray-300 mb-4">
                {t.about?.vision?.heading || 'Become the Estonian cloud gaming leader'}
              </p>
              <div className="space-y-3">
                {(t.about?.vision?.points || ['Global recognition', 'Zero detection', 'Market dominance']).map((point: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <span className="text-sm text-gray-400">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-effect p-6 rounded-xl border border-white/5 hover:border-accent/30 transition-all group"
            >
              <h3 className="text-xl font-bold mb-3 gradient-text">
                {t.about?.mission?.tab || 'Mission'}
              </h3>
              <p className="text-base text-gray-300 mb-4">
                {t.about?.mission?.heading || 'Provide ultra-performance infrastructure'}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { Icon: Zap, title: 'Performance', desc: 'Zero latency' },
                  { Icon: Shield, title: 'Security', desc: '100% safe' },
                  { Icon: Rocket, title: 'Innovation', desc: 'Cutting edge' },
                  { Icon: Award, title: 'Quality', desc: 'Premium only' }
                ].map((goal, i) => (
                  <div key={i} className="text-center">
                    <div className="flex justify-center mb-1">
                      <goal.Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-xs font-semibold">{goal.title}</div>
                    <div className="text-xs text-gray-500">{goal.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Culture Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-effect p-8 rounded-xl border border-white/5 text-center overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />
            <div className="relative">
              <h3 className="text-2xl font-bold mb-4 gradient-text">
                {t.about?.culture?.title || 'No Bullshit Culture'}
              </h3>
              <div className="flex flex-wrap justify-center gap-6 mb-6">
                <span className="text-sm text-gray-300 flex items-center gap-1">
                  <Globe className="w-4 h-4" /> 100% Remote
                </span>
                <span className="text-sm text-gray-300 flex items-center gap-1">
                  <Zap className="w-4 h-4" /> No useless meetings
                </span>
                <span className="text-sm text-gray-300 flex items-center gap-1">
                  <Target className="w-4 h-4" /> Passion first
                </span>
                <span className="text-sm text-gray-300 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Results only
                </span>
              </div>
              <p className="text-base text-gray-400 max-w-2xl mx-auto">
                {t.about?.culture?.philosophy?.description || 'Work from anywhere. No micromanagement. Pure talent.'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Legal Section - Simplified */}
      <section className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text"
          >
            {t.about?.legal?.title || 'Legal Framework'}
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-effect p-6 rounded-xl border border-white/5"
            >
              <div className="flex items-center gap-4 mb-6">
                <Globe className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="text-lg font-bold">Estonian Law</h3>
                  <p className="text-sm text-gray-500">100% Legal Operations</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t.about?.legal?.jurisdiction?.description ||
                'Complete legal compliance in Estonia with all gaming modification laws.'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-effect p-6 rounded-xl border border-white/5"
            >
              <div className="flex items-center gap-4 mb-6">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
                <div>
                  <h3 className="text-lg font-bold">EU Markets</h3>
                  <p className="text-sm text-gray-500">Expansion Limited</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t.about?.legal?.market?.warning ||
                'European expansion currently restricted. Focus on Estonian and compatible markets.'}
              </p>
            </motion.div>
          </div>

          {/* Compliance badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { Icon: Shield, label: 'GDPR', status: 'Compliant' },
              { Icon: CheckCircle, label: 'Estonian Law', status: 'Compliant' },
              { Icon: FileText, label: 'Terms', status: 'Updated' },
              { Icon: Award, label: 'Certified', status: '2023' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-effect p-4 rounded-xl text-center border border-white/5"
              >
                <div className="flex justify-center mb-1">
                  <item.Icon className="w-5 h-5 text-accent" />
                </div>
                <div className="text-sm font-bold">{item.label}</div>
                <div className="text-xs text-gray-500 mt-1">{item.status}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Minimal grid */}
      <section className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text"
          >
            {t.about?.team?.title || 'Our Team'}
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden mb-16">
            {[
              { Icon: Code, dept: 'Core Products', count: '3' },
              { Icon: Gamepad2, dept: 'Games', count: '100+' },
              { Icon: Globe, dept: 'Markets', count: 'Estonia' },
              { Icon: Shield, dept: 'Security', count: 'Zero Detection' },
              { Icon: MessageSquare, dept: 'Support', count: '24/7' },
              { Icon: Rocket, dept: 'Founded', count: '2023' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="bg-black p-6 flex flex-col items-center justify-center text-center cursor-pointer group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
                    <item.Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-base font-bold mb-1">{item.dept}</h3>
                  <p className="text-xl font-bold gradient-text">{item.count}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold mb-3 gradient-text">
              {t.about?.team?.join?.title || 'Join the Revolution'}
            </h3>
            <p className="text-base text-gray-400 mb-6 max-w-2xl mx-auto">
              {t.about?.team?.join?.description || 'We recruit on talent and passion. No bullshit.'}
            </p>
            <button className="px-6 py-3 glass-effect rounded-full hover:bg-white/10 transition-all text-sm font-semibold border border-white/10 hover:border-accent/50">
              {t.about?.team?.join?.button || 'VIEW CAREERS →'}
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}