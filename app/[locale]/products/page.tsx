'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { getAllGamingProducts, type GamingProduct } from '@/lib/gaming-products'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronDown,
  Grid,
  List,
  Search,
  Tag,
  TrendingUp,
  Star,
  Clock,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useI18n } from '@/lib/i18n-simple'
import ProductImage from '@/components/ProductImage'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-dark" />,
  ssr: false,
})

type PricingPeriod = 'hourly' | 'monthly'

type ViewMode = 'grid' | 'list'

export default function ProductsPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { t } = useI18n()

  const [products, setProducts] = useState<GamingProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<GamingProduct[]>([])
  const [selectedGame, setSelectedGame] = useState('all')
  const [selectedTier, setSelectedTier] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [pricingPeriod, setPricingPeriod] = useState<PricingPeriod>('monthly')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const allProducts = getAllGamingProducts()
    setProducts(allProducts)
    setFilteredProducts(allProducts)
  }, [])

  const games = ['all', ...new Set(products.map((p) => p.game))]
  const tiers = ['all', ...new Set(products.flatMap((p) => p.variants.map((v) => v.tier)))]

  const sortOptions = [
    { label: t?.products?.filter?.sortOptions?.name || 'Nom (A-Z)', value: 'name' },
    { label: t?.products?.filter?.sortOptions?.priceAsc || 'Prix (croissant)', value: 'price-asc' },
    { label: t?.products?.filter?.sortOptions?.priceDesc || 'Prix (décroissant)', value: 'price-desc' },
    { label: t?.products?.filter?.sortOptions?.gpu || 'Performance GPU', value: 'gpu' },
    { label: t?.products?.filter?.sortOptions?.rating || 'Note', value: 'rating' },
  ]

  const pricingOptions = useMemo(
    () => [
      { value: 'hourly' as PricingPeriod, label: t?.products?.pricing?.hourly || 'Par heure', icon: Clock, suffix: t?.products?.pricing?.perHour || '/h' },
      { value: 'monthly' as PricingPeriod, label: t?.products?.pricing?.monthly || 'Par mois', icon: Calendar, suffix: t?.products?.pricing?.perMonth || '/mois' },
    ],
    [t?.products?.pricing]
  )

  const getPrice = useCallback(
    (product: GamingProduct) => product.variants[0]?.pricing[pricingPeriod] || 0,
    [pricingPeriod],
  )

  const priceSuffix = pricingOptions.find((opt) => opt.value === pricingPeriod)?.suffix || ''

  useEffect(() => {
    let next = [...products]

    if (selectedGame !== 'all') {
      next = next.filter((p) => p.game === selectedGame)
    }

    if (selectedTier !== 'all') {
      next = next.filter((p) => p.variants.some((v) => v.tier === selectedTier))
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      next = next.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.game.toLowerCase().includes(query),
      )
    }

    next.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return getPrice(a) - getPrice(b)
        case 'price-desc':
          return getPrice(b) - getPrice(a)
        case 'gpu': {
          const gpuOrder = ['RTX 4090', 'RTX 4080', 'RTX 4070 Ti', 'RTX 3080 Ti', 'RTX 3080', 'RTX 3070 Ti']
          return gpuOrder.indexOf(a.variants[0]?.gpu || '') - gpuOrder.indexOf(b.variants[0]?.gpu || '')
        }
        case 'rating':
          return b.reviews.average - a.reviews.average
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(next)
  }, [getPrice, products, searchQuery, selectedGame, selectedTier, sortBy])

  return (
    <div className="min-h-screen bg-dark pt-24 flex flex-col">
      <div className="container mx-auto px-6 flex-1 pb-20">
        <header className="mb-12 space-y-3">
          <h1 className="text-5xl font-display font-bold gradient-text">
            {t?.products?.title || 'Solutions Gaming Premium'}
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl">
            {t?.products?.subtitle || 'Configurations haute performance pour dominer vos jeux préférés'}
          </p>
        </header>

        <div className="glass-effect rounded-2xl border border-white/5 p-6 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t?.products?.search || 'Rechercher une configuration'}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-lg border transition-colors ${viewMode === 'grid' ? 'bg-purple-500 text-white border-purple-500' : 'border-white/10 text-gray-300 hover:bg-white/10'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg border transition-colors ${viewMode === 'list' ? 'bg-purple-500 text-white border-purple-500' : 'border-white/10 text-gray-300 hover:bg-white/10'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-400" />
                {t?.products?.filters || 'Filtres'}
              </label>
              <select
                value={selectedGame}
                onChange={(event) => setSelectedGame(event.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
              >
                {games.map((game) => (
                  <option key={game} value={game}>
                    {game === 'all' ? t?.products?.home?.filters?.all || 'Tous les jeux' : game}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                {t?.products?.filter?.tiers || 'Niveau'}
              </label>
              <select
                value={selectedTier}
                onChange={(event) => setSelectedTier(event.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
              >
                {tiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier === 'all' ? t?.products?.filter?.allTiers || 'Tous les tiers' : tier}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                {t?.products?.filter?.sort || 'Trier'}
              </label>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <ChevronDown className="w-4 h-4 text-purple-400" />
                {t?.products?.pricing?.label || 'Tarification'}
              </label>
              <div className="flex bg-white/5 border border-white/10 rounded-xl">
                {pricingOptions.map((option) => {
                  const Icon = option.icon
                  const isActive = pricingPeriod === option.value
                  return (
                    <button
                      key={option.value}
                      onClick={() => setPricingPeriod(option.value)}
                      className={`flex-1 px-3 py-2 text-sm rounded-xl transition-colors flex items-center justify-center gap-2 ${
                        isActive ? 'bg-purple-500 text-white' : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              {filteredProducts.length}{' '}
              {filteredProducts.length > 1 ? t?.products?.results?.plural || 'résultats' : t?.products?.results?.singular || 'résultat'}
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              {t?.products?.quality || 'Qualité certifiée Hackboot'}
            </span>
          </div>

          <div
            className={`grid gap-6 ${
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {filteredProducts.map((product) => {
              const price = getPrice(product)
              return (
                <article
                  key={product.slug}
                  className={`glass-effect border border-white/10 rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 ${
                    viewMode === 'list' ? 'md:flex md:items-center md:gap-6' : ''
                  }`}
                >
                  <div className={`${viewMode === 'list' ? 'md:w-1/3' : 'mb-4'} `}>
                    <ProductImage
                      productSlug={product.slug}
                      productName={product.name}
                      className="w-full rounded-xl bg-white/5"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          {product.category}
                        </p>
                        <h2 className="text-2xl font-display font-bold text-white">{product.name}</h2>
                        <p className="text-sm text-accent font-medium">{product.usage}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-white">
                          {price.toLocaleString(locale)} {priceSuffix}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                          <Zap className="w-4 h-4 text-accent" />
                          {product.variants[0]?.gpu}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                      {product.features.slice(0, 4).map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      {product.use_cases.slice(0, 3).map((useCase) => (
                        <span key={useCase} className="px-2 py-1 bg-white/5 rounded-full">
                          {useCase}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <Link
                        href={`/${locale}/products/${product.slug}`}
                        className="text-sm font-semibold text-accent hover:underline"
                      >
                        {t?.products?.viewDetails || 'Voir les détails'}
                      </Link>
                      <span className="text-xs text-gray-500">
                        {t?.products?.availability || 'Disponibilité immédiate'}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
