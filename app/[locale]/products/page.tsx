'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllGamingProducts, GamingProduct } from '@/lib/gaming-products'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronDown, Filter, Grid, List, Search, Tag, TrendingUp, Star, Clock, Calendar, CalendarDays, Sparkles, Zap, X, SlidersHorizontal } from 'lucide-react'
import dynamic from 'next/dynamic'
import Portal from '@/components/Portal'
import { useI18n } from '@/lib/i18n-simple'
import ProductImage from '@/components/ProductImage'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-dark" />,
  ssr: false
})

type PricingPeriod = 'hourly' | 'monthly'

export default function ProductsPage() {
  const params = useParams()
  const locale = params?.locale as string || 'fr'
  const { t } = useI18n()

  const [products, setProducts] = useState<GamingProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<GamingProduct[]>([])
  const [selectedGame, setSelectedGame] = useState('all')
  const [selectedTier, setSelectedTier] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [pricingPeriod, setPricingPeriod] = useState<PricingPeriod>('monthly')
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const pricingButtonRef = useRef<HTMLButtonElement>(null)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  useEffect(() => {
    const allProducts = getAllGamingProducts()
    setProducts(allProducts)
    setFilteredProducts(allProducts)
  }, [])

  // Get unique games and tiers
  const games = ['all', ...new Set(products.map(p => p.game))]
  const tiers = ['all', ...new Set(products.flatMap(p => p.variants.map(v => v.tier)))]

  // Sort options
  const sortOptions = [
    { label: t?.products?.filter?.sortOptions?.name || 'Nom (A-Z)', value: 'name' },
    { label: t?.products?.filter?.sortOptions?.priceAsc || 'Prix (croissant)', value: 'price-asc' },
    { label: t?.products?.filter?.sortOptions?.priceDesc || 'Prix (décroissant)', value: 'price-desc' },
    { label: t?.products?.filter?.sortOptions?.gpu || 'Performance GPU', value: 'gpu' },
    { label: t?.products?.filter?.sortOptions?.rating || 'Note', value: 'rating' }
  ]

  // Pricing period options
  const pricingOptions = [
    { value: 'hourly' as PricingPeriod, label: t?.products?.pricing?.hourly || 'Par heure', icon: Clock, suffix: t?.products?.pricing?.perHour || '/h' },
    { value: 'monthly' as PricingPeriod, label: t?.products?.pricing?.monthly || 'Par mois', icon: Calendar, suffix: t?.products?.pricing?.perMonth || '/mois' }
  ]

  // Get price for current period (first variant)
  const getPrice = useCallback((product: GamingProduct) => {
    return product.variants[0]?.pricing[pricingPeriod] || 0
  }, [pricingPeriod])

  // Get price suffix
  const getPriceSuffix = useCallback(() => {
    return pricingOptions.find(opt => opt.value === pricingPeriod)?.suffix || ''
  }, [pricingPeriod, pricingOptions])

  // Filter products
  useEffect(() => {
    let filtered = [...products]

    // Game filter
    if (selectedGame !== 'all') {
      filtered = filtered.filter(p => p.game === selectedGame)
    }

    // Tier filter
    if (selectedTier !== 'all') {
      filtered = filtered.filter(p => p.variants.some(v => v.tier === selectedTier))
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.game.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-asc':
          return getPrice(a) - getPrice(b)
        case 'price-desc':
          return getPrice(b) - getPrice(a)
        case 'gpu':
          const gpuOrder = ['RTX 4090', 'RTX 4080', 'RTX 4070 Ti', 'RTX 3080 Ti', 'RTX 3080', 'RTX 3070 Ti']
          return gpuOrder.indexOf(a.variants[0]?.gpu || '') - gpuOrder.indexOf(b.variants[0]?.gpu || '')
        case 'rating':
          return b.reviews.average - a.reviews.average
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [selectedGame, selectedTier, searchQuery, sortBy, products, pricingPeriod, getPrice])

  return (
    <div className="min-h-screen bg-dark pt-24 flex flex-col">
      <div className="container mx-auto px-6 flex-1 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-display font-bold gradient-text mb-4">
            {t?.products?.title || 'Solutions Gaming Premium'}
          </h1>
          <p className="text-gray-400 text-lg">
            {t?.products?.subtitle || 'Configurations haute performance pour dominer vos jeux préférés'}
          </p>
        </motion.div>


        {/* Mobile Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 md:hidden"
        >
          <div className="glass-effect rounded-xl p-3">
            <div className="flex items-center gap-2">
              {/* Search Toggle */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="p-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
              >
                <Search className="w-5 h-5 text-purple-400" />
              </button>

              {/* Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-all"
              >
                <SlidersHorizontal className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">{t?.products?.filters || 'Filtres'}</span>
                {(selectedGame !== 'all' || selectedTier !== 'all') && (
                  <span className="ml-1 px-1.5 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                    {[selectedGame !== 'all' && selectedGame, selectedTier !== 'all' && selectedTier].filter(Boolean).length}
                  </span>
                )}
              </button>

              {/* View Mode Toggle */}
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expandable Search */}
            <AnimatePresence>
              {isMobileSearchOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder={t?.products?.search || 'Rechercher...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none text-white placeholder-gray-500"
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Desktop Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 hidden md:block"
        >
          <div className="glass-effect rounded-xl p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Search */}
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t?.products?.search || 'Rechercher...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none text-white text-sm placeholder-gray-500"
                  />
                </div>
                {/* Results count */}
                <span className="text-sm text-gray-400">
                  {filteredProducts.length} {filteredProducts.length > 1 ? t?.products?.configurationsPlural : t?.products?.configurations}
                </span>
              </div>

              {/* Right side - Controls */}
              <div className="flex items-center gap-3">
                {/* Pricing Period Dropdown */}
                <div className="relative">
                  <button
                    ref={pricingButtonRef}
                    onClick={() => {
                      if (pricingButtonRef.current) {
                        const rect = pricingButtonRef.current.getBoundingClientRect()
                        setDropdownPosition({
                          top: rect.bottom + 8,
                          left: rect.right - 192 // 192px = w-48
                        })
                      }
                      setIsPricingOpen(!isPricingOpen)
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="hidden md:inline">{t?.products?.billing || 'Facturation'}</span>
                    <span className="text-xs text-purple-400 hidden md:inline">
                      ({pricingOptions.find(opt => opt.value === pricingPeriod)?.label})
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isPricingOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">{t?.products?.filters || 'Filtres'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
                    {/* Game Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t?.products?.filter?.game || 'Jeu'}
                      </label>
                      <select
                        value={selectedGame}
                        onChange={(e) => setSelectedGame(e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      >
                        {games.map(game => (
                          <option key={game} value={game} className="bg-gray-900">
                            {game === 'all' ? (t?.products?.filter?.allGames || 'Tous les jeux') : game}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tier Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t?.products?.filter?.tier || 'Tier'}
                      </label>
                      <select
                        value={selectedTier}
                        onChange={(e) => setSelectedTier(e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      >
                        {tiers.map(tier => (
                          <option key={tier} value={tier} className="bg-gray-900">
                            {tier === 'all' ? (t?.products?.filter?.allTiers || 'Tous les tiers') : tier.charAt(0).toUpperCase() + tier.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t?.products?.filter?.sortBy || 'Trier par'}
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value} className="bg-gray-900">
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>

        {/* Products Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-6' : 'space-y-4'}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/${locale}/products/${product.slug}`}>
                  {viewMode === 'grid' ? (
                    // Grid View Card
                    <div className="group glass-effect rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 md:hover:-translate-y-1">
                      <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
                        <ProductImage
                          productSlug={product.slug}
                          productName={product.name}
                          fallbackImage={product.variants[0]?.image || '/images/valorant-hero.png'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.variants[0]?.badges.length > 0 && (
                          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                            {product.variants[0]?.badges.slice(0, 2).map((badge, i) => (
                              <span key={i} className="px-2 py-1 bg-purple-500/80 text-white text-xs rounded-full">
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="p-3 md:p-4">
                        <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                          <span className="text-[10px] md:text-xs text-purple-400 uppercase tracking-wide truncate">
                            {product.game}
                          </span>
                          <span className="hidden md:inline text-xs text-gray-500">•</span>
                          <div className="flex items-center gap-0.5 md:gap-1 ml-auto">
                            <Star className="w-2.5 md:w-3 h-2.5 md:h-3 text-yellow-500 fill-current" />
                            <span className="text-[10px] md:text-xs text-gray-400">{product.reviews.average}</span>
                          </div>
                        </div>
                        <h3 className="text-sm md:text-lg font-semibold text-white mb-1 md:mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex flex-wrap gap-1 md:gap-2 mb-1.5 md:mb-2">
                          <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 bg-blue-500/20 text-blue-400 rounded">
                            {product.variants[0]?.gpu.replace('RTX ', '')}
                          </span>
                          <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 bg-green-500/20 text-green-400 rounded">
                            {product.variants[0]?.ram}
                          </span>
                        </div>
                        <p className="hidden md:block text-xs text-gray-500 mb-3">
                          {product.variants.length} {product.variants.length > 1 ? 'versions' : 'version'}
                        </p>
                        <div className="flex flex-col gap-3">
                          <div>
                            <div className="text-2xl font-bold gradient-text">
                              {getPrice(product).toFixed(2)}€
                            </div>
                            <div className="text-xs text-gray-400">
                              {getPriceSuffix()}
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                          >
                            {t?.products?.view || 'Voir'}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View Card
                    <div className="group glass-effect rounded-xl p-4 md:p-6 hover:border-purple-500/50 transition-all duration-300">
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        <div className="w-full md:w-48 h-48 md:h-64 rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/20 to-indigo-900/20 flex-shrink-0">
                          <ProductImage
                            productSlug={product.slug}
                            productName={product.name}
                            gameName={product.game}
                            fallbackImage={product.variants[0]?.image || '/images/valorant-hero.png'}
                            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-purple-400 uppercase tracking-wide">
                                  {product.game}
                                </span>
                                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                                  {product.variants.length} {product.variants.length > 1 ? 'versions' : 'version'}
                                </span>
                                {product.variants[0]?.badges.slice(0, 2).map((badge, i) => (
                                  <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                                    {badge}
                                  </span>
                                ))}
                              </div>
                              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                {product.name}
                              </h3>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold gradient-text">
                                {getPrice(product).toFixed(2)}€{getPriceSuffix()}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-400 mb-3">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-3 mb-3 text-sm">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                              {product.variants[0]?.gpu}
                            </span>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                              {product.variants[0]?.ram}
                            </span>
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
                              {product.variants[0]?.cpu}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-300">{product.reviews.average}/5</span>
                                <span className="text-sm text-gray-500">({product.reviews.count} {t?.products?.labels?.reviews || 'avis'})</span>
                              </div>
                              <div className="text-sm text-gray-400">
                                {product.variants.length} variants • {product.variants[0]?.support_level} {t?.products?.labels?.support || 'support'}
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                            >
                              {t?.products?.viewDetails || 'Voir les détails'}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No results */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              {t?.products?.noResults || 'Aucune configuration trouvée'}
            </h3>
            <p className="text-gray-400">
              {t?.products?.noResultsDescription || 'Essayez de modifier vos filtres ou votre recherche'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <Portal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] md:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-gray-900 border-l border-white/10 z-[10000] md:hidden overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">{t?.products?.filters || 'Filtres'}</h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Filters Content */}
              <div className="p-4 space-y-6">
                {/* Results Count */}
                <div className="text-center py-2 px-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <span className="text-sm text-purple-400 font-medium">
                    {filteredProducts.length} {filteredProducts.length > 1 ? t?.products?.configurationsPlural : t?.products?.configurations}
                  </span>
                </div>

                {/* Pricing Period */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    {t?.products?.billing || 'Période de facturation'}
                  </label>
                  <div className="space-y-2">
                    {pricingOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <button
                          key={option.value}
                          onClick={() => setPricingPeriod(option.value)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                            pricingPeriod === option.value
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="flex-1 text-left">{option.label}</span>
                          <span className="text-xs text-gray-500">{option.suffix}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Game Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    {t?.products?.filter?.game || 'Jeu'}
                  </label>
                  <select
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    {games.map(game => (
                      <option key={game} value={game} className="bg-gray-900">
                        {game === 'all' ? (t?.products?.filter?.allGames || 'Tous les jeux') : game}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tier Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    {t?.products?.filter?.tier || 'Tier'}
                  </label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    {tiers.map(tier => (
                      <option key={tier} value={tier} className="bg-gray-900">
                        {tier === 'all' ? (t?.products?.filter?.allTiers || 'Tous les tiers') : tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    {t?.products?.filter?.sortBy || 'Trier par'}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value} className="bg-gray-900">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Apply Button */}
                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                  >
                    {t?.products?.applyFilters || 'Appliquer les filtres'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedGame('all')
                      setSelectedTier('all')
                      setSortBy('name')
                      setSearchQuery('')
                    }}
                    className="w-full py-3 bg-white/5 text-gray-300 font-medium rounded-lg hover:bg-white/10 transition-all"
                  >
                    {t?.products?.resetFilters || 'Réinitialiser'}
                  </button>
                </div>
              </div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>

      {/* Pricing Dropdown Portal */}
      {isPricingOpen && (
        <Portal>
          <div className="fixed inset-0 z-[9998]" onClick={() => setIsPricingOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed w-48 bg-black/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl z-[9999]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`
            }}
          >
            {pricingOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setPricingPeriod(option.value)
                    setIsPricingOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors ${
                    pricingPeriod === option.value
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{option.label}</span>
                  <span className="text-xs text-gray-500">{option.suffix}</span>
                </button>
              )
            })}
          </motion.div>
        </Portal>
      )}
    </div>
  )
}