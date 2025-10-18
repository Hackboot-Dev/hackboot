'use client'

import React, { useState, useEffect, memo, useMemo, useCallback } from 'react'
import { Shield, Zap, Crown, Check, ChevronRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'
import { usePathname, useRouter } from 'next/navigation'
import { getAllProducts, type Product } from '@/lib/products'

const gradients = [
  'from-blue-500 to-purple-500',
  'from-green-500 to-cyan-500',
  'from-orange-500 to-red-500',
  'from-purple-500 to-pink-500',
  'from-yellow-500 to-orange-500',
  'from-indigo-500 to-blue-500',
]

function getIcon(slug: string) {
  if (slug.includes('alpha')) return Shield
  if (slug.includes('beta')) return Zap
  return Crown
}

const ProductCard = memo(function ProductCard({ product, index }: { product: Product; index: number }) {
  const { t } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [productImage, setProductImage] = useState<string | null>(null)

  const locale = pathname.split('/')[1] || 'fr'
  const Icon = getIcon(product.slug)
  const gradient = gradients[index % gradients.length]

  useEffect(() => {
    let cancelled = false
    const fetchProductImage = async () => {
      try {
        const response = await fetch(`/api/products/${product.slug}/images`)
        const data = await response.json()
        if (!cancelled && data.images && data.images.length > 0) {
          setProductImage(data.images[0])
        }
      } catch (error) {
        console.error('Error fetching product image:', error)
      }
    }
    fetchProductImage()
    return () => {
      cancelled = true
    }
  }, [product.slug])

  const handleNavigate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      router.push(`/${locale}/products/${product.slug}`)
    },
    [locale, product.slug, router]
  )

  return (
    <div
      className="relative group"
      onClick={() => setIsOpen((previous) => !previous)}
    >
      <div className="relative h-full p-6 rounded-2xl glass-effect overflow-hidden cursor-pointer">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />

        <div className="relative z-10 space-y-4">
          {productImage && (
            <div className="relative w-full mb-4 rounded-lg overflow-hidden">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              {product.discount.active && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                  -{product.discount.percentage}%
                </span>
              )}
            </div>
          )}

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="w-6 h-6 text-accent" />
                <span className="text-xs font-medium text-gray-400">{product.category.toUpperCase()}</span>
              </div>
              <h3 className="text-2xl font-display font-bold">{product.name}</h3>
              <p className="text-sm text-accent font-medium">{product.usage}</p>
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{product.description}</p>

          <div className="p-3 bg-accent/10 rounded-lg border border-accent/20 text-sm text-accent flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {product.highlight}
          </div>

          <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} overflow-hidden`}>
            <div className="min-h-0 space-y-4 pt-4 border-t border-white/10">
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">{t.products.labels.features}:</h4>
                <div className="space-y-1">
                  {product.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                      <Check className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">{t.products.labels.useCases}:</h4>
                <div className="flex flex-wrap gap-1">
                  {product.use_cases.slice(0, 3).map((useCase, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-white/5 rounded-full text-gray-400">
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-accent to-accent/80 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors duration-300 hover:from-accent/90 hover:to-accent/70"
            onClick={handleNavigate}
          >
            {t.products.viewDetails}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
})

export default memo(function ProductsSection() {
  const { t } = useI18n()
  const [products, setProducts] = useState<Product[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setProducts(getAllProducts())
  }, [])

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        if (filter === 'all') return true
        return product.category === filter || product.slug.includes(filter)
      }),
    [products, filter]
  )

  const games = ['all', 'overwatch', 'warzone', 'valorant']

  return (
    <section className="min-h-[60vh] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-3">
              {t.products.home.title}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              {t.products.home.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {games.map((game) => (
              <button
                key={game}
                onClick={() => setFilter(game)}
                className={`px-4 py-2 rounded-full border transition-colors duration-300 ${
                  filter === game ? 'bg-accent text-white border-accent' : 'border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                {game === 'all' ? t.products.home.filters.all : game.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
})
