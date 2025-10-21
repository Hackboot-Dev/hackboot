'use client'

import { useMemo } from 'react'
import { Star, Check, ArrowRight, Users, Cloud } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import type { GamingProduct } from '@/lib/gaming-products'
import { getSubscriptionPlans } from '@/lib/subscriptions'
import type { SubscriptionPlan } from '@/lib/subscriptions'
import ProductImage from './ProductImage'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'

interface CommunityGamingProductPageProps {
  product: GamingProduct
}

type CommunityPageCopy = {
  breadcrumb: { home: string; games: string }
  badges: { catalog: string; support: string }
  subscription: { title: string; popular: string; viewDetails: string }
  configuration: { title: string; gpu: string; ram: string; cpu: string; support: string; supportValue: string }
  about: { title: string }
  featuresTitle: string
  benefits: { title: string; items: Array<{ title: string; description: string }> }
  cta: { button: string }
  reviewsLabel: string
}

export default function CommunityGamingProductPage({ product }: CommunityGamingProductPageProps) {
  const pathname = usePathname()
  const locale = pathname.split('/')[1]
  const { t } = useTranslation('common')

  const copy = t('communityProductPage', { returnObjects: true }) as CommunityPageCopy
  const subscriptionDescription = t('communityProductPage.subscription.description', { productName: product.name })
  const aboutTitle = t('communityProductPage.about.title', { productName: product.name })
  const ctaTitle = t('communityProductPage.cta.title', { game: product.game })
  const ctaDescription = t('communityProductPage.cta.description', { productName: product.name })
  const planTranslations = t('premiumSignup.plans', { returnObjects: true }) as Record<string, Partial<SubscriptionPlan>>

  const subscriptionPlans = getSubscriptionPlans()
  const localizedPlans = useMemo(
    () =>
      subscriptionPlans.map((plan) => {
        const override = planTranslations[plan.id]
        if (!override) {
          return plan
        }
        return {
          ...plan,
          ...override,
          features: override.features ?? plan.features
        }
      }),
    [subscriptionPlans, planTranslations]
  )
  const benefitIcons = [Cloud, Users, Check] as const
  const variant = product.variants[0]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href={`/${locale}`} className="text-gray-400 hover:text-white transition">
              {copy.breadcrumb.home}
            </Link>
            <span className="text-gray-500">/</span>
            <Link href={`/${locale}/games`} className="text-gray-400 hover:text-white transition">
              {copy.breadcrumb.games}
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-white">{product.name}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden glass-effect">
                <ProductImage
                  productSlug={product.slug}
                  productName={product.name}
                  gameName={product.game}
                  fallbackImage={variant.image}
                  className="w-full h-auto max-h-[600px] object-contain"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    {copy.badges.catalog}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/30">
                    {copy.badges.support}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400 text-sm">{product.game}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">{product.name}</h1>
                <p className="text-xl text-gray-300">{product.description}</p>
              </div>

              {product.reviews.count > 0 && (
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
                  <span className="text-gray-400">({product.reviews.count} {copy.reviewsLabel})</span>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="font-semibold text-xl">{copy.subscription.title}</h3>
                <p className="text-sm text-gray-400">{subscriptionDescription}</p>
                <div className="grid grid-cols-1 gap-4">
                  {localizedPlans.map((plan) => (
                    <Link
                      key={plan.id}
                      href={`/${locale}/premium/signup`}
                      className="relative p-5 rounded-xl border border-white/10 hover:border-blue-500/50 glass-effect transition-all group"
                    >
                      {plan.popular && (
                        <span className="absolute -top-3 left-4 px-3 py-1 bg-blue-500 text-xs text-white font-semibold rounded-full">
                          {copy.subscription.popular}
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg mb-1">{plan.name}</h4>
                          <p className="text-sm text-gray-400">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-400">{plan.price.toFixed(2)}€</div>
                          <div className="text-xs text-gray-500">{plan.billing}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center text-sm text-blue-400 group-hover:text-blue-300">
                        <span>{copy.subscription.viewDetails}</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <h3 className="font-semibold text-lg">{copy.configuration.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 glass-effect rounded-lg">
                    <span className="text-gray-400 text-xs block mb-1">{copy.configuration.gpu}</span>
                    <span className="text-white font-semibold">{variant.gpu}</span>
                  </div>
                  <div className="p-3 glass-effect rounded-lg">
                    <span className="text-gray-400 text-xs block mb-1">{copy.configuration.ram}</span>
                    <span className="text-white font-semibold">{variant.ram}</span>
                  </div>
                  <div className="p-3 glass-effect rounded-lg">
                    <span className="text-gray-400 text-xs block mb-1">{copy.configuration.cpu}</span>
                    <span className="text-white font-semibold">{variant.cpu}</span>
                  </div>
                  <div className="p-3 glass-effect rounded-lg">
                    <span className="text-gray-400 text-xs block mb-1">{copy.configuration.support}</span>
                    <span className="text-white font-semibold">{copy.configuration.supportValue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{aboutTitle}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{product.longDescription}</p>
            </div>
          </section>

          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.featuresTitle}</h2>
            </div>

            <div className="max-w-4xl mx-auto glass-effect rounded-2xl p-8 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {variant.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.benefits.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {copy.benefits.items.map((item, index) => {
                const Icon = benefitIcons[index] ?? Cloud
                return (
                  <div key={item.title} className="p-6 glass-effect rounded-xl border border-white/10 text-center">
                    <div className="inline-flex p-4 bg-blue-500/20 rounded-xl mb-4">
                      <Icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="text-center py-16 glass-effect rounded-2xl border border-white/10">
            <h2 className="text-4xl font-bold mb-6">{ctaTitle}</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{ctaDescription}</p>
            <Link
              href={`/${locale}/premium/signup`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all"
            >
              {copy.cta.button}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
