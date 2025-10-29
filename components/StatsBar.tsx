'use client'

import React from 'react'
import { Users, Zap, Globe, Trophy } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'

export default function StatsBar() {
  const { t } = useI18n()
  const stats = t.statsBar || {}

  const statsData = [
    {
      icon: Users,
      value: stats.users?.value || '100K+',
      label: stats.users?.label || 'Utilisateurs actifs',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Trophy,
      value: stats.uptime?.value || '99.9%',
      label: stats.uptime?.label || 'Uptime garanti',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      value: stats.latency?.value || '<5ms',
      label: stats.latency?.label || 'Latence moyenne',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Globe,
      value: stats.games?.value || '10+',
      label: stats.games?.label || 'Jeux supportés',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <section className="py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-purple-500/5 to-accent/5" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="group relative"
              >
                <div className="glass-effect rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center transition-transform duration-300 group-hover:rotate-12`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
