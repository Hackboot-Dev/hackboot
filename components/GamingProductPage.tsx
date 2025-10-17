'use client'

import { useState } from 'react'
import { Star, Shield, Zap, Check, ArrowRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { GamingProduct, ProductVariant } from '@/lib/gaming-products'

interface GamingProductPageProps {
  product: GamingProduct
}

export default function GamingProductPage({ product }: GamingProductPageProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0])
  const [selectedPlan, setSelectedPlan] = useState<'hourly' | 'monthly'>('monthly')
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  const plans = [
    { id: 'hourly', name: 'Horaire', price: selectedVariant.pricing.hourly, suffix: '/h' },
    { id: 'monthly', name: 'Mensuel', price: selectedVariant.pricing.monthly, suffix: '/mois', popular: true },
  ]

  return (
    <div className="min-h-screen bg-dark pt-20">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div key={selectedVariant.id} className="relative rounded-2xl overflow-hidden bg-gray-900/50 transition-transform duration-300">
              <img
                src={selectedVariant.image}
                alt={`${product.name} - ${selectedVariant.name}`}
                className="w-full h-auto max-h-[600px] object-contain"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {selectedVariant.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-accent/90 backdrop-blur-sm text-white text-xs font-medium rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-accent text-sm font-medium">{product.category.toUpperCase()}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400 text-sm">{product.game}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-xl text-gray-300">{product.description}</p>
            </div>

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

            {product.variants.length > 1 && (
              <div className="space-y-4 pt-4 border-t border-gray-800">
                <h3 className="font-medium text-lg">Choisissez votre version</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-4 rounded-lg border transition-all ${
                        selectedVariant.id === variant.id
                          ? 'border-accent bg-accent/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="font-medium mb-1">{variant.name}</div>
                      <div className="text-xs text-gray-400">{variant.tier}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-gray-800">
              <h3 className="font-medium text-lg">Choisissez votre abonnement</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id as any)}
                    className={`relative p-4 rounded-lg border transition-all ${
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
                    <div className="font-medium mb-1">{plan.name}</div>
                    <div className="text-sm">
                      <span className="font-bold">{plan.price.toFixed(2)}€{plan.suffix}</span>
                    </div>
                  </button>
                ))}
              </div>

              <button className="w-full px-6 py-4 bg-accent hover:bg-accent/80 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                Acheter maintenant
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-800">
              <h3 className="font-medium">Configuration {selectedVariant.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">GPU:</span>
                  <span className="ml-2 text-white">{selectedVariant.gpu}</span>
                </div>
                <div>
                  <span className="text-gray-400">RAM:</span>
                  <span className="ml-2 text-white">{selectedVariant.ram}</span>
                </div>
                <div>
                  <span className="text-gray-400">CPU:</span>
                  <span className="ml-2 text-white">{selectedVariant.cpu}</span>
                </div>
                <div>
                  <span className="text-gray-400">SLA:</span>
                  <span className="ml-2 text-white">{selectedVariant.sla}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-800">
              <h3 className="font-medium mb-3">Fonctionnalités</h3>
              {selectedVariant.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                <span className="font-medium">Protection:</span>
                <span className="text-gray-300">{selectedVariant.protection}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                <span className="font-medium">Mises à jour:</span>
                <span className="text-gray-300">{selectedVariant.updates}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-16">
          <section className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">À propos de {product.name}</h2>
            <p className="text-lg text-gray-300 leading-relaxed">{product.longDescription}</p>
          </section>

          {product.variants.length > 1 && (
            <section>
              <h2 className="text-3xl font-bold mb-8 text-center">Toutes nos versions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`p-6 glass-effect rounded-xl hover:bg-white/5 transition-all cursor-pointer ${
                      selectedVariant.id === variant.id ? 'ring-2 ring-accent' : ''
                    }`}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    <img src={variant.image} alt={variant.name} className="w-full h-48 object-contain mb-4 rounded-lg" />
                    <h3 className="font-bold text-xl mb-2">{variant.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{variant.description}</p>
                    <div className="text-accent font-bold text-lg">
                      À partir de {variant.pricing.hourly}€/h
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="text-center py-16">
            <h2 className="text-4xl font-bold mb-6">Prêt à dominer ?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de joueurs et transformez votre expérience de jeu dès aujourd&apos;hui.
            </p>
            <button className="px-8 py-4 bg-accent hover:bg-accent/80 rounded-lg font-medium transition-all">
              Acheter maintenant
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
