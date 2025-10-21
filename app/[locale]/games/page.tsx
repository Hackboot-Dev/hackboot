'use client'

import { useState, useEffect, useMemo } from 'react'
import { getAllGamingProducts, type GamingProduct } from '@/lib/gaming-products'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Search, X, Gamepad2, ArrowRight, Shield, Users, ChevronDown, AlertCircle } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useI18n } from '@/lib/i18n-simple'
import ProductImage from '@/components/ProductImage'
import SiteHeader from '@/components/SiteHeader'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-black" />,
  ssr: false,
})

const INITIAL_COMMUNITY_GAMES_DISPLAY = 12
const LOAD_MORE_INCREMENT = 12

const isTestMode = process.env.NEXT_PUBLIC_SHOW_TEST_GAMES === 'true'

const hasValidImage = (game: GamingProduct): boolean => {
  if (game.optimizationLevel === 'community') {
    return !!(game.gfnData?.iconUrl || game.gfnData?.logoUrl)
  }
  return !!(game.variants.length > 0 && game.variants[0]?.image)
}

export default function GamesPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { t } = useI18n()

  const [games, setGames] = useState<GamingProduct[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [displayedCommunityCount, setDisplayedCommunityCount] = useState(INITIAL_COMMUNITY_GAMES_DISPLAY)

  useEffect(() => {
    const allProducts = getAllGamingProducts()
    const validGames = isTestMode ? allProducts : allProducts.filter(hasValidImage)
    setGames(validGames)
  }, [])

  const { nativeGames, communityGames, displayedCommunityGames } = useMemo(() => {
    const filtered = searchQuery.trim()
      ? games.filter(
          (game) =>
            game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : games

    const native = filtered.filter((g) => g.optimizationLevel === 'native')
    const community = filtered.filter((g) => g.optimizationLevel === 'community')
    const displayed = searchQuery.trim() ? community : community.slice(0, displayedCommunityCount)

    return {
      nativeGames: native,
      communityGames: community,
      displayedCommunityGames: displayed,
    }
  }, [games, searchQuery, displayedCommunityCount])

  const totalFilteredGames = nativeGames.length + communityGames.length
  const hasMoreCommunityGames = displayedCommunityGames.length < communityGames.length

  const loadMoreGames = () => {
    setDisplayedCommunityCount((prev) => prev + LOAD_MORE_INCREMENT)
  }

  return (
    <div className="min-h-screen bg-black text-white animate-fade-in">
      <SiteHeader />
      {isTestMode && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/90 backdrop-blur-sm border border-orange-400 rounded-full shadow-lg">
            <AlertCircle className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">MODE TEST - Affichage de tous les jeux</span>
          </div>
        </div>
      )}
      <main className="pt-24">
        <section className="container mx-auto px-6 py-20 text-center animate-scale-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full border border-white/10 mb-6">
            <Gamepad2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-200">{t.games?.badge || 'Jeux disponibles'}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 gradient-text">{t.games?.title || 'Jeux'}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            {t.games?.subtitle || 'Accédez à nos environnements gaming optimisés pour les titres populaires.'}
          </p>
          <div className="max-w-xl mx-auto text-left">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.games?.search || 'Rechercher un jeu...'}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500 focus:outline-none text-white placeholder-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg"
                  aria-label={t.games?.clear || 'Effacer'}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              {totalFilteredGames}{' '}
              {totalFilteredGames > 1 ? t.games?.results?.plural || 'jeux disponibles' : t.games?.results?.singular || 'jeu disponible'}
            </p>
          </div>
        </section>

        {nativeGames.length > 0 && (
          <section className="container mx-auto px-6 pb-16 animate-slide-up">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full border border-purple-500/30 mb-4">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-200">
                  {t.games?.nativeBadge || 'Optimisés Hackboot'}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-white">
                {t.games?.nativeTitle || 'Jeux Supportés Nativement'}
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                {t.games?.nativeDescription || 'Jeux entièrement pris en charge et optimisés à 100% par Hackboot. Build privés, support premium et mises à jour garanties.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {nativeGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/${locale}/products/${game.slug}`}
                  className="group glass-effect rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="aspect-[2/3] sm:aspect-[3/4] relative bg-gradient-to-br from-purple-900/10 to-indigo-900/10 overflow-hidden">
                    <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-purple-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                      {t.games?.nativeLabel || 'Premium'}
                    </div>
                    <div className="absolute inset-0 overflow-hidden">
                      <ProductImage
                        productSlug={game.slug}
                        productName={game.name}
                        gameName={game.game}
                        fallbackImage={game.variants[0]?.image || '/images/valorant-hero.png'}
                        className="w-full h-full object-contain sm:object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                        {game.name}
                      </h3>
                      <p className="text-xs text-gray-300 line-clamp-2">
                        {game.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {communityGames.length > 0 && (
          <section className="bg-white/[0.02] py-16">
            <div className="container mx-auto px-6">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full border border-white/10 mb-4">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">
                    {t.games?.communityBadge || 'Catalogue Étendu'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white">
                  {t.games?.communityTitle || 'Jeux Communautaires'}
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                  {t.games?.communityDescription || 'Large catalogue de jeux supportés avec configurations cloud standards. Support communautaire et mises à jour régulières.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl mx-auto">
                {displayedCommunityGames.map((game) => (
                  <Link
                    key={game.id}
                    href={`/${locale}/products/${game.slug}`}
                    className="group glass-effect rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex">
                      <div className="aspect-video w-2/5 relative bg-gradient-to-br from-gray-800/20 to-gray-900/20 flex-shrink-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                          <ProductImage
                            productSlug={game.slug}
                            productName={game.name}
                            gameName={game.game}
                            fallbackImage={game.variants[0]?.image || '/images/valorant-hero.png'}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 pointer-events-none" />
                      </div>
                      <div className="flex-1 p-4 md:p-5 flex flex-col justify-center">
                        <h3 className="text-base md:text-lg font-semibold text-white mb-2 group-hover:text-gray-300 transition-colors line-clamp-1">
                          {game.name}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                          {game.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="px-2 py-1 bg-white/5 rounded">Standard</span>
                          <span>•</span>
                          <span>{t.games?.available || 'Disponible'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {hasMoreCommunityGames && (
                <div className="text-center mt-10">
                  <button
                    onClick={loadMoreGames}
                    className="group inline-flex items-center gap-3 px-6 py-3 glass-effect rounded-lg border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-sm font-medium text-white">
                      {t.games?.loadMore || 'Charger plus de jeux'}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 group-hover:text-white transition-colors">
                      <span className="text-xs">
                        ({displayedCommunityGames.length}/{communityGames.length})
                      </span>
                      <ChevronDown className="w-4 h-4 animate-bounce" />
                    </div>
                  </button>
                  <p className="text-xs text-gray-500 mt-3">
                    {communityGames.length - displayedCommunityGames.length} {t.games?.remaining || 'jeux restants'}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
