'use client'

import React from 'react'
import Image from 'next/image'
import { Gamepad2, Shield, Cloud } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'

export default function UnifiedFeaturesSection() {
  const { t } = useI18n()
  const sections = t.sections || {}

  const features = [
    {
      key: 'gaming',
      icon: Gamepad2,
      imageUrl: '/images/features/cloud-gaming.png',
      gradient: 'from-purple-500 to-pink-500',
      data: sections.gaming || {}
    },
    {
      key: 'security',
      icon: Shield,
      imageUrl: '/images/features/security-shield.webp',
      gradient: 'from-blue-500 to-cyan-500',
      data: sections.security || {}
    },
    {
      key: 'cloud',
      icon: Cloud,
      imageUrl: '/images/features/cloud-infrastructure.png',
      gradient: 'from-green-500 to-emerald-500',
      data: sections.cloud || {}
    }
  ]

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-6 py-2 glass-effect rounded-full border border-white/10 text-accent font-semibold mb-4">
            {t.unifiedFeatures?.badge || 'Pourquoi Hackboot'}
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            {t.unifiedFeatures?.title || 'Excellence sur tous les fronts'}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t.unifiedFeatures?.subtitle || 'Gaming, sécurité et infrastructure cloud de classe mondiale'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.key}
                className="group relative h-full"
              >
                <div className="relative h-full flex flex-col glass-effect rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={feature.imageUrl}
                      alt={feature.data.title || ''}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      quality={75}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 mix-blend-overlay`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex flex-col flex-1">
                    <span className={`text-sm font-semibold uppercase tracking-wider bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                      {feature.data.subtitle || ''}
                    </span>
                    <h3 className="text-2xl font-display font-bold">
                      {feature.data.title || ''}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm flex-1">
                      {feature.data.description || ''}
                    </p>
                    <button className={`px-4 py-2 rounded-lg bg-gradient-to-r ${feature.gradient} bg-opacity-10 text-white text-sm font-medium transition-all duration-300 hover:bg-opacity-20 hover:translate-x-1 flex items-center gap-2 mt-auto`}>
                      {t.hero?.getStarted || 'En savoir plus'}
                      <span>→</span>
                    </button>
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
