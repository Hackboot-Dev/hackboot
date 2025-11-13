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

    // Variation pattern for spacing (deterministic but appears random)
    const spacingPattern = [5, 6, 4, 7, 5, 6] // Average ~5.5 games between PulseForge
    let communityIndex = 0
    let pulseForgeIndex = 0
    let patternIndex = 0

    while (communityIndex < communityGames.length) {
      // Get spacing for this iteration (cycles through pattern)
      const gapSize = spacingPattern[patternIndex % spacingPattern.length]
      patternIndex++

      // Add a group of community games
      for (let i = 0; i < gapSize && communityIndex < communityGames.length; i++) {
        gamesList.push({
          game: communityGames[communityIndex].game,
          isPulseForge: false,
          slug: communityGames[communityIndex].slug
        })
        communityIndex++
      }

      // Add one PulseForge game (cycle through them)
      if (pulseForgeGames.length > 0) {
        const pulseForge = pulseForgeGames[pulseForgeIndex % pulseForgeGames.length]
        gamesList.push({
          game: pulseForge.game,
          isPulseForge: true,
          slug: pulseForge.slug
        })
        pulseForgeIndex++
      }
    }

    // Add remaining community games if any
    while (communityIndex < communityGames.length) {
      gamesList.push({
        game: communityGames[communityIndex].game,
        isPulseForge: false,
        slug: communityGames[communityIndex].slug
      })
      communityIndex++
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
          {gamesTitle}
        </h2>
        <p className="text-gray-500 text-base">{gamesSubtitle}</p>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex gap-3 animate-marquee whitespace-nowrap w-max">
          {games.map((item, index) => (
            <button
              key={`${item.game}-${index}`}
              onClick={() => handleGameClick(item.slug)}
              className={`
                relative px-6 py-3 rounded-full whitespace-nowrap
                transition-all duration-200 hover:scale-105
                cursor-pointer text-sm font-medium
                ${item.isPulseForge
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400 text-white'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/10'
                }
              `}
            >
              {item.isPulseForge && (
                <Sparkles className="w-4 h-4 text-purple-300 absolute -top-1 -right-1 animate-pulse" />
              )}
              {item.game}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => router.push(`/${locale}/games`)}
          className="px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 hover:border-white/20 transition-all text-sm"
        >
          {t.gamesCarousel?.viewAll ?? 'Voir tous les jeux'}
        </button>
      </div>
    </section>
  )
}
