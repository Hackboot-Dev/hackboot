'use client'

import { motion, useSpring, useTransform, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'

export default function StatsSection() {
  const { t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })

  const stats = [
    { value: 10000, suffix: '+', label: t.about.stats.activeUsers, color: 'from-blue-400 to-cyan-400' },
    { value: 99.9, suffix: '%', label: t.about.stats.uptime, color: 'from-purple-400 to-pink-400' },
    { value: 24, suffix: '/7', label: t.about.stats.support, color: 'from-green-400 to-emerald-400' },
    { value: 50, suffix: 'ms', label: t.about.stats.latency, color: 'from-yellow-400 to-orange-400' },
  ]

  return (
    <section ref={containerRef} className="relative py-32 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full
                      filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full
                      filter blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400
                       bg-clip-text text-transparent">
            {t.about.stats.title}
          </h2>
          <p className="text-xl text-gray-300">
            {t.about.stats.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              color={stat.color}
              isInView={isInView}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({
  value,
  suffix,
  label,
  color,
  isInView,
  delay
}: {
  value: number
  suffix: string
  label: string
  color: string
  isInView: boolean
  delay: number
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const spring = useSpring(0, { stiffness: 100, damping: 30 })

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        spring.set(value)
      }, delay * 1000)
    }
  }, [isInView, value, spring, delay])

  useEffect(() => {
    return spring.on('change', (latest) => {
      setDisplayValue(latest)
    })
  }, [spring])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl" />
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10
                     rounded-3xl transition-opacity duration-500`} />

      <div className="relative p-8 text-center">
        <div className={`text-6xl font-bold mb-2 bg-gradient-to-br ${color}
                       bg-clip-text text-transparent`}>
          {displayValue.toFixed(value % 1 !== 0 ? 1 : 0)}{suffix}
        </div>
        <div className="text-gray-400 uppercase tracking-wider text-sm">{label}</div>

        {/* Animated Circle */}
        <svg className="absolute top-4 right-4 w-12 h-12" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-700"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={283}
            strokeDashoffset={useTransform(spring, [0, value], [283, 0])}
            className="transform -rotate-90 origin-center"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-blue-400" stopColor="currentColor" />
              <stop offset="100%" className="text-purple-400" stopColor="currentColor" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  )
}