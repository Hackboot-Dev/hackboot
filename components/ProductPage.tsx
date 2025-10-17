'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Shield, Zap, Users, ChevronLeft, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Product } from '@/lib/products'

interface ProductPageProps {
  product: Product
}

export default function ProductPage({ product }: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [productImages, setProductImages] = useState<string[]>([product.images.main])
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly' | 'yearly' | 'lifetime'>('monthly')
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  useEffect(() => {
    // Fetch dynamic images from the API
    const fetchProductImages = async () => {
      try {
        const response = await fetch(`/api/products/${product.slug}/images`)
        const data = await response.json()

        if (data.images && data.images.length > 0) {
          setProductImages(data.images)
        }
      } catch (error) {
        console.error('Error fetching product images:', error)
      }
    }

    fetchProductImages()
  }, [product.slug])

  const getDiscountedPrice = (price: string) => {
    if (!product.discount.active) return price
    const numPrice = parseFloat(price)
    const discounted = numPrice * (1 - product.discount.percentage / 100)
    return discounted.toFixed(2)
  }

  const plans = [
    { id: 'monthly', name: 'Mensuel', price: product.pricing.monthly, popular: false },
    { id: 'quarterly', name: 'Trimestriel', price: product.pricing.quarterly, popular: false },
    { id: 'yearly', name: 'Annuel', price: product.pricing.yearly, popular: true },
    { id: 'lifetime', name: 'À vie', price: product.pricing.lifetime, popular: false },
  ]

  return (
    <div className="min-h-screen bg-dark pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          <Link href={`/${locale}`} className="text-gray-400 hover:text-white transition">
            Accueil
          </Link>
          <span className="text-gray-500">/</span>
          <Link href={`/${locale}/products`} className="text-gray-400 hover:text-white transition">
            Produits
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-white">{product.name}</span>
        </nav>
      </div>

      {/* Product Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden bg-gray-900/50">
                <img
                  src={productImages[selectedImage] || product.images.main}
                  alt={product.name}
                  className="w-full h-auto max-h-[600px] object-contain"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {product.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-accent/90 backdrop-blur-sm text-white text-xs font-medium rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Gallery Thumbnails */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.slice(0, 8).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-accent' : 'border-transparent hover:border-gray-600'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-auto max-h-24 object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-accent text-sm font-medium">{product.category.toUpperCase()}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400 text-sm">{product.usage}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-xl text-gray-300">{product.description}</p>
            </div>

            {/* Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.reviews.average)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white font-medium">{product.reviews.average}</span>
              <span className="text-gray-400">({product.reviews.count} avis)</span>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id as any)}
                    className={`relative p-3 rounded-lg border transition-all ${
                      selectedPlan === plan.id
                        ? 'border-accent bg-accent/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-accent text-xs text-white rounded-full">
                        Populaire
                      </span>
                    )}
                    <div className="text-sm font-medium">{plan.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {product.discount.active ? (
                        <>
                          <span className="line-through">{plan.price}€</span>
                          <span className="text-accent ml-1">{getDiscountedPrice(plan.price)}€</span>
                        </>
                      ) : (
                        `${plan.price}€`
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {product.discount.active && (
                <div className="flex items-center justify-center p-2 bg-accent/10 rounded-lg">
                  <span className="text-accent text-sm font-medium">
                    -{product.discount.percentage}% avec le code {product.discount.code}
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-accent hover:bg-accent/80 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                  Acheter maintenant
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="px-6 py-3 glass-effect hover:bg-white/10 rounded-lg font-medium transition-all">
                  Essai gratuit
                </button>
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-2 pt-4 border-t border-gray-800">
              <h3 className="font-medium mb-3">Points clés</h3>
              {product.features.slice(0, 4).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent mt-0.5" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="mt-16 space-y-16">
          {/* Long Description */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">À propos de {product.name}</h2>
            <p className="text-lg text-gray-300 leading-relaxed">{product.longDescription}</p>
          </motion.section>

          {/* Features Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Fonctionnalités complètes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.features.map((feature, idx) => (
                <div key={idx} className="p-6 glass-effect rounded-xl hover:bg-white/5 transition-all">
                  <Zap className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-medium mb-2">{feature}</h3>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Use Cases */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold mb-8">Cas d&apos;utilisation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.use_cases.map((useCase, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-accent" />
                  <span className="text-gray-300">{useCase}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Specifications */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-8">Spécifications techniques</h2>
            <div className="glass-effect rounded-xl p-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-gray-400 text-sm mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</dt>
                    <dd className="text-white font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.section>

          {/* Reviews */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8">Avis clients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.testimonials.map((review, idx) => (
                <div key={idx} className="p-6 glass-effect rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{review.author}</span>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center py-16"
          >
            <h2 className="text-4xl font-bold mb-6">Prêt à commencer ?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d&apos;utilisateurs satisfaits et transformez votre expérience dès aujourd&apos;hui.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-4 bg-accent hover:bg-accent/80 rounded-lg font-medium transition-all">
                Acheter maintenant
              </button>
              <button className="px-8 py-4 glass-effect hover:bg-white/10 rounded-lg font-medium transition-all">
                Contacter les ventes
              </button>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}