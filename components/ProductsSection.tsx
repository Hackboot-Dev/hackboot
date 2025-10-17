'use client'

import React, { useState, useEffect, memo, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, Crown, Check, ChevronRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'
import { usePathname, useRouter } from 'next/navigation'
import { getAllProducts, type Product } from '@/lib/products'


const ProductCard = memo(function ProductCard({
  product,
  index
}: {
  product: Product
  index: number
}) {
  const { t } = useI18n()
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [productImage, setProductImage] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  useEffect(() => {
    const fetchProductImage = async () => {
      try {
        const response = await fetch(`/api/products/${product.slug}/images`)
        const data = await response.json()

        if (data.images && data.images.length > 0) {
          setProductImage(data.images[0]) // Prend la première image (main si elle existe)
        }
      } catch (error) {
        console.error('Error fetching product image:', error)
      }
    }

    fetchProductImage()
  }, [product.slug])

  const getIcon = (slug: string) => {
    if (slug.includes('alpha')) return Shield
    if (slug.includes('beta')) return Zap
    return Crown
  }

  const getGradient = (index: number) => {
    const gradients = [
      'from-blue-500 to-purple-500',
      'from-green-500 to-cyan-500',
      'from-orange-500 to-red-500',
      'from-purple-500 to-pink-500',
      'from-yellow-500 to-orange-500',
      'from-indigo-500 to-blue-500',
    ]
    return gradients[index % gradients.length]
  }

  const Icon = getIcon(product.slug)
  const gradient = getGradient(index)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <div className="relative h-full p-6 rounded-2xl glass-effect overflow-hidden cursor-pointer"
           onClick={() => setShowDetails(!showDetails)}>

        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />

        {isHovered && (
          <motion.div
            className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-xl opacity-30`} />
          </motion.div>
        )}

        <div className="relative z-10">
          {productImage && (
            <div className="relative w-full mb-4 rounded-lg overflow-hidden">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-auto object-contain"
              />
              {product.discount.active && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                  -{product.discount.percentage}%
                </span>
              )}
            </div>
          )}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-6 h-6 text-accent" />
                <span className="text-xs font-medium text-gray-400">{product.category.toUpperCase()}</span>
              </div>
              <h3 className="text-2xl font-display font-bold mb-1">{product.name}</h3>
              <p className="text-sm text-accent font-medium">{product.usage}</p>
            </div>
          </div>

          <p className="text-gray-400 mb-4 line-clamp-2">{product.description}</p>

          <div className="mb-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-sm font-medium text-accent flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {product.highlight}
            </p>
          </div>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">{t.products.labels.features}:</h4>
                    <div className="space-y-1">
                      {product.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-400">{feature}</span>
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
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-accent to-accent/80 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:from-accent/90 hover:to-accent/70 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/${locale}/products/${product.slug}`)
            }}
          >
            {t.products.viewDetails}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
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
    () => products.filter((product) => {
      if (filter === 'all') return true
      return product.category === filter || product.slug.includes(filter)
    }),
    [products, filter]
  )

  const games = ['all', 'overwatch', 'warzone', 'valorant']

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">
            {t.products.title}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            {t.products.subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {games.map((game) => (
              <button
                key={game}
                onClick={() => setFilter(game)}
                className={`px-4 py-2 rounded-full transition-all ${
                  filter === game
                    ? 'bg-accent text-white'
                    : 'glass-effect hover:bg-white/10'
                }`}
              >
                {String(t.products.filter[game as keyof typeof t.products.filter])}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
})