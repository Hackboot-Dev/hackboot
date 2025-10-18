'use client'

import React, { memo } from 'react'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n-simple'

interface ParallaxSectionProps {
  sectionKey: 'gaming' | 'security' | 'cloud'
  imageUrl: string
  reverse?: boolean
}

export default memo(function ParallaxSectionI18n({
  sectionKey,
  imageUrl,
  reverse = false
}: ParallaxSectionProps) {
  const { t } = useI18n()
  const section = t.sections[sectionKey]

  return (
    <section className="min-h-[70vh] flex items-center py-16 px-4">
      <div className="max-w-7xl mx-auto w-full">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:[&>*:first-child]:order-last' : ''}`}
        >
          <div className="space-y-6">
            <span className="text-accent font-medium tracking-wider uppercase">
              {section.subtitle}
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-bold mt-2 mb-6">
              {section.title}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              {section.description}
            </p>
            <button className="px-6 py-3 bg-accent text-white rounded-full transition-transform duration-300 hover:-translate-y-1 hover:bg-accent/90">
              {t.hero.getStarted}
            </button>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-effect">
              <Image
                src={imageUrl}
                alt={section.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                quality={75}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-500/20 mix-blend-overlay" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl transition-opacity duration-700" />
          </div>
        </div>
      </div>
    </section>
  )
})
