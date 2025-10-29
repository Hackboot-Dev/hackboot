'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Sparkles, ArrowRight, Zap } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'

export default function FinalCTASection() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { t } = useI18n()
  const finalCTA = t.finalCTA || {}

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-purple-600/20 to-pink-500/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="glass-effect rounded-3xl p-12 md:p-16 text-center border border-white/20 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent/20 to-purple-600/20 border border-accent/30 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">
              {finalCTA.badge || 'Prêt à commencer ?'}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-black mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-accent to-purple-400">
              {finalCTA.title || 'Rejoignez l\'élite du gaming'}
            </span>
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {finalCTA.subtitle || 'Commencez votre aventure avec Hackboot dès aujourd\'hui. Performances maximales, sécurité totale, support 24/7.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href={`/${locale}/premium`}
              className="group px-8 py-5 bg-gradient-to-r from-accent to-purple-600 text-white font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-accent/30 flex items-center justify-center gap-2"
            >
              {finalCTA.primaryButton || 'Commencer maintenant'}
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="group px-8 py-5 glass-effect rounded-full transition-all duration-300 hover:bg-white/10 hover:scale-105 border border-white/20 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 text-accent" />
              {finalCTA.secondaryButton || 'Parler à un expert'}
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>{finalCTA.feature1 || 'Installation en 5 minutes'}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>{finalCTA.feature2 || 'Sans engagement'}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>{finalCTA.feature3 || 'Support 24/7'}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {finalCTA.disclaimer || 'Plus de 100 000 joueurs nous font déjà confiance'}
          </p>
        </div>
      </div>
    </section>
  )
}
