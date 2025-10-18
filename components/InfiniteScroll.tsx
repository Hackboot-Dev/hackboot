'use client'

import React, { memo } from 'react'
import { useI18n } from '@/lib/i18n-simple'

const technologies = [
  'Valorant',
  'Fortnite',
  'Call of Duty',
  'Apex Legends',
  'CS2',
  'League of Legends',
  'Overwatch 2',
  'Rainbow Six',
  'Warzone',
  'PUBG',
  'Rocket League',
  'GTA V',
  'FIFA 24',
  'Minecraft',
]

export default memo(function InfiniteScroll() {
  const { t } = useI18n()
  const items = [...technologies, ...technologies]

  return (
    <section className="py-20 overflow-hidden">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
          {t.games.title}
        </h2>
        <p className="text-gray-400">{t.games.subtitle}</p>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex gap-6 animate-marquee whitespace-nowrap w-max">
          {items.map((tech, index) => (
            <div
              key={`${tech}-${index}`}
              className="px-8 py-4 glass-effect rounded-full whitespace-nowrap transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="text-lg font-medium">{tech}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})
