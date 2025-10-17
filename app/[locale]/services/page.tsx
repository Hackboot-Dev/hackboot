'use client'

import { useI18n } from '@/lib/i18n-simple'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Shield, Zap, Cloud, Lock, RefreshCw,
  HeadphonesIcon, Settings, ArrowRight,
  Code, ArrowUpRight, Server,
  ChevronRight, PlayCircle, Cpu, Database,
  Globe, Rocket, Monitor
} from 'lucide-react'
import HeaderFixed from '@/components/HeaderFixed'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-black" />,
  ssr: false
})

interface ServiceCardProps {
  icon: React.ElementType
  title: string
  subtitle: string
  description: string
  features: string[]
  color: string
  index: number
}

function ServiceCard({ icon, title, subtitle, description, features, color, index }: ServiceCardProps) {
  const Icon = icon as React.ComponentType<{ className?: string }>
  const getColorClasses = (color: string) => {
    const colors: Record<string, { gradient: string, text: string, bg: string }> = {
      purple: { gradient: "from-purple-500 via-violet-500 to-purple-600", text: "text-purple-400", bg: "bg-purple-500/10" },
      blue: { gradient: "from-blue-500 via-indigo-500 to-blue-600", text: "text-blue-400", bg: "bg-blue-500/10" },
      cyan: { gradient: "from-cyan-500 via-sky-500 to-cyan-600", text: "text-cyan-400", bg: "bg-cyan-500/10" },
      teal: { gradient: "from-teal-500 via-emerald-500 to-teal-600", text: "text-teal-400", bg: "bg-teal-500/10" },
      green: { gradient: "from-green-500 via-lime-500 to-green-600", text: "text-green-400", bg: "bg-green-500/10" },
      emerald: { gradient: "from-emerald-500 via-teal-500 to-emerald-600", text: "text-emerald-400", bg: "bg-emerald-500/10" }
    }
    return colors[color] || colors.purple
  }

  const colors = getColorClasses(color)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group w-full"
    >
      <motion.div
        whileHover={{ scale: 1.02, rotate: Math.random() * 2 - 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={`relative h-full rounded-3xl bg-gradient-to-br ${colors.gradient} p-[2px] cursor-pointer`}
      >
        <div className="h-full bg-black/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 flex flex-col overflow-hidden min-h-[280px]">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)`,
            }} />
          </div>

          <div className="relative flex-1 flex flex-col">
            <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>
            <div className="space-y-1 mb-3">
              <h3 className={`text-3xl md:text-4xl font-black ${colors.text}`}>
                {title}
              </h3>
              <p className="text-lg md:text-xl font-light text-white/60">
                {subtitle}
              </p>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-4 flex-1">
              {description}
            </p>

            {/* Features list */}
            <div className="flex flex-wrap gap-2 mb-4">
              {features.map((feature, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60"
                >
                  {feature}
                </span>
              ))}
            </div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 text-white/40 group-hover:text-white/80 transition-colors"
            >
              <span className="text-xs font-medium">En savoir plus</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Glow effect on hover */}
          <div className={`absolute -inset-[2px] bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 -z-10`} />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ServicesPage() {
  const { t } = useI18n()
  const params = useParams()
  const locale = params?.locale as string || 'fr'
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setMousePos({
          x: e.clientX,
          y: e.clientY
        })
      })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const services = [
    {
      icon: Shield,
      title: "Protection",
      subtitle: "Indétectable",
      description: "Multi-layers kernel-level protection testée contre tous les anti-cheats du marché",
      features: ["Kernel-level", "HWID Spoofer", "Stream-proof", "Bypass EAC/BE"],
      color: "purple"
    },
    {
      icon: Zap,
      title: "Updates",
      subtitle: "Instantanées",
      description: "Équipe dev 24/7 pour des mises à jour en temps réel après chaque patch",
      features: ["Auto-update", "Rollback", "Beta access"],
      color: "blue"
    },
    {
      icon: HeadphonesIcon,
      title: "Support",
      subtitle: "Premium 24/7",
      description: "Réponse moyenne sous 5 minutes sur Discord, assistance setup personnalisée",
      features: ["Discord VIP", "Setup 1-on-1", "Guides", "Live help"],
      color: "cyan"
    },
    {
      icon: Settings,
      title: "Config",
      subtitle: "Personnalisée",
      description: "Des milliers de paramètres ajustables, profils multiples, sauvegarde cloud",
      features: ["UI intuitive", "Multi-profils", "Hotkeys", "Cloud sync"],
      color: "teal"
    },
    {
      icon: Cloud,
      title: "Cloud",
      subtitle: "Infrastructure",
      description: "Serveurs multi-régions, CDN optimisé, infrastructure hautement disponible",
      features: ["CDN Global", "Multi-régions"],
      color: "green"
    },
    {
      icon: Code,
      title: "Private",
      subtitle: "Development",
      description: "Builds privés exclusifs avec features customisées pour nos clients premium",
      features: ["Code privé", "Features exclusives", "Updates à vie"],
      color: "emerald"
    }
  ]

  const guarantees = [
    { icon: Lock, text: "Chiffrement E2E", gradient: "from-blue-500 to-cyan-500" },
    { icon: RefreshCw, text: "Updates gratuites", gradient: "from-cyan-500 to-teal-500" },
    { icon: Shield, text: "Protection maximale", gradient: "from-purple-500 to-pink-500" },
    { icon: Server, text: "Infrastructure stable", gradient: "from-teal-500 to-green-500" }
  ]

  const technologies = [
    { name: "Kernel Driver", desc: "Protection bas niveau", icon: Cpu },
    { name: "Cloud Infrastructure", desc: "Serveurs distribués", icon: Cloud },
    { name: "Real-time Updates", desc: "Patch instantané", icon: Zap },
    { name: "Encryption", desc: "Sécurité maximale", icon: Lock },
    { name: "CDN Global", desc: "Download rapide", icon: Globe },
    { name: "Analytics", desc: "Monitoring 24/7", icon: Database }
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden">
      <HeaderFixed />

      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Cursor glow effect */}
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%)',
          left: mousePos.x - 192,
          top: mousePos.y - 192,
        }}
      />

      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Hero section */}
      <div className="relative min-h-screen flex items-center justify-center pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-center px-4 max-w-7xl mx-auto"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-[12vw] md:text-[10vw] font-black leading-none mb-4 tracking-tighter">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600">
                SERVICES
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-4xl text-gray-400 font-light max-w-4xl mx-auto mb-12"
          >
            Infrastructure de pointe.<br />
            Support exceptionnel.<br />
            Expérience gaming sans compromis.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {guarantees.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative overflow-hidden rounded-full px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className="relative flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator - avec z-index plus bas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-0"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-gray-500 text-sm flex flex-col items-center gap-2"
          >
            <span>Scroll</span>
            <ArrowRight className="w-4 h-4 rotate-90" />
          </motion.div>
        </motion.div>
      </div>

      {/* Services - Masonry-style layout */}
      <div className="relative py-32">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center md:text-left"
          >
            <h2 className="text-6xl md:text-8xl font-black mb-6">
              <span className="text-white">CE QUE NOUS</span><br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                OFFRONS
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto md:mx-0">
              Une stack technologique complète pour garantir performance, sécurité et stabilité
            </p>
          </motion.div>

          {/* Grid responsive avec masonry effect */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Technologies section */}
      <div className="py-32 bg-gradient-to-b from-black via-purple-950/5 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-8xl font-black mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                STACK TECH
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Les technologies qui propulsent nos services au sommet de la performance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group glass-effect rounded-2xl p-6 hover:bg-white/5 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <tech.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1 text-white group-hover:text-purple-300 transition-colors">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-gray-400">{tech.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="py-32 bg-gradient-to-b from-black via-purple-950/10 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-6xl md:text-8xl font-black text-center mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                EN 3 ÉTAPES
              </span>
            </h2>
            <p className="text-center text-2xl text-gray-400">Simple. Rapide. Efficace.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Inscription",
                desc: "Créez votre compte et choisissez votre plan",
                icon: Server,
                details: ["Inscription rapide", "Paiement sécurisé", "Accès instantané"]
              },
              {
                num: "02",
                title: "Connexion",
                desc: "Accédez à votre machine virtuelle",
                icon: Monitor,
                details: ["Identifiants envoyés", "Connexion sécurisée", "Environnement prêt"]
              },
              {
                num: "03",
                title: "Launch",
                desc: "Connectez-vous et profitez",
                icon: Rocket,
                details: ["Interface simple", "Config rapide", "Enjoy!"]
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="glass-effect rounded-2xl p-8 hover:bg-white/5 transition-all h-full">
                  <div className="text-8xl font-black text-white/5 absolute -top-6 right-6 group-hover:text-purple-500/20 transition-colors">
                    {step.num}
                  </div>

                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-3xl font-black mb-3 text-white group-hover:text-purple-400 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{step.desc}</p>

                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                          <ChevronRight className="w-3 h-3 text-purple-500" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto px-4 text-center"
        >
          <h2 className="text-7xl md:text-9xl font-black mb-12 leading-none">
            <span className="text-white">PRÊT À</span><br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
              DÉMARRER?
            </span>
          </h2>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Rejoignez des milliers de joueurs qui ont fait le choix de l&apos;excellence
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href={`/${locale}/products`}
              className="group relative px-12 py-6 bg-white text-black text-xl font-bold rounded-full overflow-hidden hover:scale-105 transition-transform"
            >
              <span className="relative z-10 flex items-center gap-3">
                Voir les produits
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="group px-12 py-6 bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white text-xl font-bold rounded-full hover:bg-white/10 transition-all"
            >
              Contact
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
