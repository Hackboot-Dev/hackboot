'use client'

import type { LucideIcon } from 'lucide-react'
import { useReveal } from '@/lib/hooks/useReveal'

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
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.35 })

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`relative group transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        <div className="relative z-10">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 transition-transform duration-300 ease-out group-hover:scale-105`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>

          <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
            {stat.value}
            {stat.suffix}
          </div>

          <div className="text-sm text-gray-400">{stat.label}</div>
        </div>
      </div>
    </div>
  )
}
