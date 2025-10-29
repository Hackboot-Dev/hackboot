'use client'

import React, { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAllGamingProducts, type GamingProduct } from '@/lib/gaming-products'
import { useI18n } from '@/lib/i18n-simple'
import { Sparkles } from 'lucide-react'

export default function InteractiveGamesCarousel() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { t } = useI18n()

  const allProducts = useMemo(() => getAllGamingProducts(), [])

  const games = useMemo(() => {
    const pulseForgeGames = allProducts.filter(p => p.optimizationLevel === 'native')
    const communityGames = allProducts.filter(p => p.optimizationLevel !== 'native')

    const gamesList: Array<{game: string, isPulseForge: boolean, slug: string}> = []

    communityGames.forEach(p => {
      gamesList.push({ game: p.game, isPulseForge: false, slug: p.slug })
    })

    for (let i = 0; i < 3; i++) {
      pulseForgeGames.forEach(p => {
        gamesList.push({ game: p.game, isPulseForge: true, slug: p.slug })
      })
    }

    return [...gamesList, ...gamesList]
  }, [allProducts])

  const gamesTitle = t.gamesCarousel?.title ?? 'Jeux Disponibles'
  const gamesSubtitle = t.gamesCarousel?.subtitle ?? 'Clique ou déplace pour explorer notre catalogue de jeux'

  const handleGameClick = (slug: string) => {
    router.push(`/${locale}/products/${slug}`)
  }

  return (
    <section className="py-20 overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3), transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.3), transparent 50%)`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600">
          {gamesTitle}
        </h2>
        <p className="text-gray-400 text-lg">{gamesSubtitle}</p>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex gap-4 animate-marquee whitespace-nowrap w-max">
          {games.map((item, index) => (
            <button
              key={`${item.game}-${index}`}
              onClick={() => handleGameClick(item.slug)}
              className={`
                relative px-8 py-4 rounded-full whitespace-nowrap
                transition-all duration-300 hover:-translate-y-1 hover:scale-105
                cursor-pointer group
                ${item.isPulseForge
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-2 border-pink-500/50 shadow-lg shadow-pink-500/30'
                  : 'glass-effect border border-white/10'
                }
              `}
            >
              {item.isPulseForge && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}
              <span className={`text-lg font-bold ${
                item.isPulseForge
                  ? 'bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400'
                  : 'text-white'
              }`}>
                {item.game}
              </span>
              {item.isPulseForge && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/0 via-pink-500/20 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center relative z-10">
        <button
          onClick={() => router.push(`/${locale}/games`)}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-purple-500/30"
        >
          {t.gamesCarousel?.viewAll ?? 'Voir tous les jeux'}
        </button>
      </div>
    </section>
  )
}
