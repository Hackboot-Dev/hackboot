'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface Stat {
  icon: LucideIcon
  value: string
  label: string
  suffix?: string
  gradient: string
}

interface StatsShowcaseProps {
  stats: Stat[]
}

export default function StatsShowcase({ stats }: StatsShowcaseProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} stat={stat} index={index} />
      ))}
    </div>
  )
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const Icon = stat.icon
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    if (!isInView) return

    const cleanValue = stat.value.replace(/[^\d.]/g, '')
    const numericValue = parseFloat(cleanValue)

    if (isNaN(numericValue)) {
      setDisplayValue(stat.value)
      return
    }

    const hasDecimal = cleanValue.includes('.')
    const decimalPlaces = hasDecimal ? cleanValue.split('.')[1]?.length || 0 : 0

    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      const currentValue = numericValue * progress

      if (hasDecimal) {
        setDisplayValue(currentValue.toFixed(decimalPlaces))
      } else {
        setDisplayValue(Math.floor(currentValue).toString())
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, stat.value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all relative overflow-hidden">
        {/* Background gradient on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
        />

        <div className="relative z-10">
          <motion.div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>

          <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
            {displayValue}
            {stat.suffix}
          </div>

          <div className="text-sm text-gray-400">{stat.label}</div>
        </div>
      </div>
    </motion.div>
  )
}
