'use client'

import React, { memo } from 'react'
import { Shield, Zap, Cloud, RotateCw, Headphones, Users } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'

const cardData = [
  { key: 'security', icon: Shield, color: 'from-blue-500 to-cyan-500' },
  { key: 'speed', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { key: 'cloud', icon: Cloud, color: 'from-purple-500 to-pink-500' },
  { key: 'updates', icon: RotateCw, color: 'from-green-500 to-emerald-500' },
  { key: 'support', icon: Headphones, color: 'from-pink-500 to-rose-500' },
  { key: 'users', icon: Users, color: 'from-indigo-500 to-blue-500' },
]

const Card = memo(function Card({ card }: { card: typeof cardData[number] }) {
  const { t } = useI18n()
  const Icon = card.icon

  return (
    <div className="relative group">
      <div className="relative h-full p-8 rounded-2xl glass-effect overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

        <div className="relative z-10 space-y-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 text-accent transition-transform duration-300 group-hover:-translate-y-1">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-display font-bold">
            {t.features.items[card.key as keyof typeof t.features.items].title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t.features.items[card.key as keyof typeof t.features.items].description}
          </p>
        </div>

        <div className="absolute bottom-4 right-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          →
        </div>
      </div>
    </div>
  )
})

export default memo(function InteractiveCards() {
  const { t } = useI18n()

  return (
    <section className="min-h-[60vh] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">
            {t.features.title}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardData.map((card) => (
            <Card key={card.key} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
})
