'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllGamingProducts, GamingProduct } from '@/lib/gaming-products'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Search, X, Gamepad2, ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useI18n } from '@/lib/i18n-simple'
import ProductImage from '@/components/ProductImage'
import HeaderFixed from '@/components/HeaderFixed'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-black" />,
  ssr: false
})

export default function GamesPage() {
  const params = useParams()
  const locale = params?.locale as string || 'fr'
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
    if (searchQuery) {
      const filtered = games.filter(game =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredGames(filtered)
    } else {
      setFilteredGames(games)
    }
  }, [searchQuery, games])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <HeaderFixed />

      {/* Background gradient */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-full mb-6"
            >
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Jeux Disponibles</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 gradient-text">
              JEUX
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Accédez à nos environnements gaming optimisés pour les titres les plus populaires
            </p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un jeu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl focus:border-purple-500 focus:outline-none text-white placeholder-gray-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-3">
                {filteredGames.length} {filteredGames.length > 1 ? 'jeux disponibles' : 'jeu disponible'}
              </p>
            </motion.div>
          </motion.div>

          {/* Games Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/${locale}/games/${game.slug}`}>
                    <div className="group glass-effect rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2">
                      {/* Image */}
                      <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
                        <ProductImage
                          productSlug={game.slug}
                          productName={game.name}
                          gameName={game.game}
                          fallbackImage={game.variants[0]?.image || '/images/valorant-hero.png'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                        {/* Game name overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-2xl font-black text-white mb-2 group-hover:text-purple-300 transition-colors">
                            {game.name}
                          </h3>
                          <p className="text-sm text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {game.description}
                          </p>
                        </div>

                        {/* Hover effect - Arrow */}
                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-wide text-purple-400 font-medium">
                            Disponible
                          </span>
                          <span className="text-xs text-gray-500">
                            {game.game}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No results */}
          {filteredGames.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                Aucun jeu trouvé
              </h3>
              <p className="text-gray-400 mb-6">
                Essayez de modifier votre recherche
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
              >
                Réinitialiser la recherche
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
