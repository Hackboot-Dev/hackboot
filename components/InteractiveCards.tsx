'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import { Shield, Zap, Cloud, RotateCw, Headphones, Users } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'
import { useParams } from 'next/navigation'

const cardData = [
  { key: 'security', icon: Shield, color: 'from-blue-500 to-cyan-500', link: '/services' },
  { key: 'speed', icon: Zap, color: 'from-yellow-500 to-orange-500', link: '/games' },
  { key: 'cloud', icon: Cloud, color: 'from-purple-500 to-pink-500', link: '/premium' },
  { key: 'updates', icon: RotateCw, color: 'from-green-500 to-emerald-500', link: '/services' },
  { key: 'support', icon: Headphones, color: 'from-pink-500 to-rose-500', link: '/contact' },
  { key: 'users', icon: Users, color: 'from-indigo-500 to-blue-500', link: '/about' },
]

const Card = memo(function Card({ card }: { card: typeof cardData[number] }) {
  const { t } = useI18n()
  const params = useParams()
  const locale = params.locale as string
  const Icon = card.icon

  return (
    <Link href={`/${locale}${card.link}`} className="relative group block">
      <div className="relative h-full p-8 rounded-2xl glass-effect overflow-hidden cursor-pointer">
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
    </Link>
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
