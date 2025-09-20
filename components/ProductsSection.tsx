'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, Crown, Check, ChevronRight } from 'lucide-react'
import productsData from '@/products.json'
import { useI18n } from '@/lib/i18n'

type Product = {
  usage: string
  description: string
  use_cases: string[]
  features: string[]
  target_audience: string
  highlight: string
}

function ProductCard({
  product,
  productKey,
  index
}: {
  product: Product
  productKey: string
  index: number
}) {
  const { t } = useI18n()
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const getIcon = (key: string) => {
    if (key.includes('phantom') || key.includes('reaper')) return Shield
    if (key.includes('dominion') || key.includes('oblivion')) return Zap
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

  const Icon = getIcon(productKey)
  const gradient = getGradient(index)
  const gameName = productKey.split('-')[1].toUpperCase()
  const productName = productKey.split('-')[2].charAt(0).toUpperCase() + productKey.split('-')[2].slice(1)

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

        <motion.div
          className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-xl opacity-30`} />
        </motion.div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-6 h-6 text-accent" />
                <span className="text-xs font-medium text-gray-400">{gameName}</span>
              </div>
              <h3 className="text-2xl font-display font-bold mb-1">{productName}</h3>
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
          >
            {t.products.viewDetails}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProductsSection() {
  const { t } = useI18n()
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setProducts(productsData as Record<string, Product>)
  }, [])

  const filteredProducts = Object.entries(products).filter(([key]) => {
    if (filter === 'all') return true
    return key.includes(filter)
  })

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
                {t.products.filter[game as keyof typeof t.products.filter]}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {filteredProducts.map(([key, product], index) => (
              <ProductCard
                key={key}
                product={product}
                productKey={key}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}