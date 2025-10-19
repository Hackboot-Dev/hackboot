'use client'

import { useState, useEffect } from 'react'
import { getAllGamingProducts, type GamingProduct } from '@/lib/gaming-products'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Search, X, Gamepad2, ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useI18n } from '@/lib/i18n-simple'
import ProductImage from '@/components/ProductImage'
import SiteHeader from '@/components/SiteHeader'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-black" />,
  ssr: false,
})

export default function GamesPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { t } = useI18n()

  const [games, setGames] = useState<GamingProduct[]>([])
  const [filteredGames, setFilteredGames] = useState<GamingProduct[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const allProducts = getAllGamingProducts()
    setGames(allProducts)
    setFilteredGames(allProducts)
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      setFilteredGames(
        games.filter(
          (game) =>
            game.name.toLowerCase().includes(query) ||
            game.game.toLowerCase().includes(query) ||
            game.description.toLowerCase().includes(query),
        ),
      )
    } else {
      setFilteredGames(games)
    }
  }, [searchQuery, games])

  return (
    <div className="min-h-screen bg-black text-white animate-fade-in">
      <SiteHeader />
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
              {filteredGames.length}{' '}
              {filteredGames.length > 1 ? t.games?.results?.plural || 'jeux disponibles' : t.games?.results?.singular || 'jeu disponible'}
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-20 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <Link key={game.id} href={`/${locale}/games/${game.slug}`} className="group glass-effect rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/40 transition-all duration-300">
                <div className="aspect-[3/4] relative bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
                  <ProductImage
                    productSlug={game.slug}
                    productName={game.name}
                    gameName={game.game}
                    fallbackImage={game.variants[0]?.image || '/images/valorant-hero.png'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                    <h3 className="text-2xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {game.name}
                    </h3>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {game.description}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between text-xs text-gray-400">
                  <span className="uppercase tracking-wide text-purple-300 font-medium">{t.games?.available || 'Disponible'}</span>
                  <span>{game.game}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
