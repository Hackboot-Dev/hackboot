'use client'

import { useMemo } from 'react'
import { Star, Check, ArrowRight, Users, Cloud } from 'lucide-react'
import Link from 'next/link'
import type { GamingProduct } from '@/lib/gaming-products'
import { getSubscriptionPlans } from '@/lib/subscriptions'
import type { SubscriptionPlan } from '@/lib/subscriptions'
import ProductImage from './ProductImage'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'
import { useI18n } from '@/lib/i18n-simple'
import { motion } from 'framer-motion'

const inViewFadeProps = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 }
} as const

const inViewSlideProps = {
  initial: { opacity: 0, x: -36 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.25 }
} as const

const inViewScaleProps = {
  initial: { opacity: 0, scale: 0.9, y: 18 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: { once: true, amount: 0.3 }
} as const

const inViewTiltProps = {
  initial: { opacity: 0, rotateX: -8, y: 24 },
  whileInView: { opacity: 1, rotateX: 0, y: 0 },
  viewport: { once: true, amount: 0.25 }
} as const

const hoverLiftProps = {
  whileHover: { y: -8, scale: 1.02 },
  whileTap: { scale: 0.98 }
} as const

const hoverGlowProps = {
  whileHover: { y: -6, scale: 1.01, boxShadow: '0px 16px 38px rgba(59, 130, 246, 0.35)' },
  whileTap: { scale: 0.99 }
} as const

const fadeTransition = { duration: 0.6, ease: 'easeOut' } as const

interface CommunityGamingProductPageProps {
  product: GamingProduct
}

type CommunityPageCopy = {
  breadcrumb: { home: string; games: string }
  badges: { catalog: string; support: string }
  subscription: { title: string; description: string; popular: string; viewDetails: string }
  about: { title: string }
  featuresTitle: string
  benefits: { title: string; items: Array<{ title: string; description: string }> }
  cta: { title: string; description: string; button: string }
  reviewsLabel: string
}

const formatMessage = (template?: string, replacements: Record<string, string> = {}) =>
  template
    ? Object.entries(replacements).reduce(
        (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
        template,
      )
    : undefined

export default function CommunityGamingProductPage({ product }: CommunityGamingProductPageProps) {
  const { t, locale } = useI18n()
  const copy = t.communityProductPage as CommunityPageCopy
  const planTranslations = t.premiumSignup?.plans as Record<string, Partial<SubscriptionPlan>> | undefined

  const subscriptionDescription =
    formatMessage(copy.subscription.description, { productName: product.name }) ??
    `Accédez à ${product.name} avec n'importe quel abonnement Hackboot`
  const aboutTitle =
    formatMessage(copy.about.title, { productName: product.name }) ?? `À propos de ${product.name}`
  const ctaTitle =
    formatMessage(copy.cta.title, { game: product.game }) ?? `Prêt à jouer à ${product.game} ?`
  const ctaDescription =
    formatMessage(copy.cta.description, { productName: product.name }) ??
    `Choisissez votre abonnement et accédez immédiatement à ${product.name}`

  const subscriptionPlans = getSubscriptionPlans()
  const localizedPlans = useMemo(
    () =>
      subscriptionPlans.map((plan) => {
        const override = planTranslations?.[plan.id]
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
            <motion.div className="space-y-4" {...inViewTiltProps} transition={{ ...fadeTransition, delay: 0.05 }}>
              <motion.div
                className="relative rounded-2xl overflow-hidden glass-effect"
                {...inViewScaleProps}
                transition={{ ...fadeTransition, delay: 0.1 }}
                {...hoverGlowProps}
              >
                <motion.div initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
                  <ProductImage
                    productSlug={product.slug}
                    productName={product.name}
                    gameName={product.game}
                    fallbackImage={variant.image}
                    className="w-full h-auto max-h-[600px] object-contain"
                  />
                </motion.div>
                <motion.div className="absolute top-4 left-4" initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}>
                  <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    {copy.badges.catalog}
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div className="space-y-6" {...inViewSlideProps} transition={{ ...fadeTransition, delay: 0.1 }}>
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
                <motion.div className="flex items-center gap-4" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
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
                </motion.div>
              )}

              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="font-semibold text-xl">{copy.subscription.title}</h3>
                <p className="text-sm text-gray-400">{subscriptionDescription}</p>
                <div className="grid grid-cols-1 gap-4">
                  {localizedPlans.map((plan, idx) => (
                    <Link key={plan.id} href={`/${locale}/premium/signup`} className="group block">
                      <motion.div
                        className="relative p-5 rounded-xl border border-white/10 glass-effect transition-all group-hover:border-blue-500/50"
                        {...inViewSlideProps}
                        transition={{ ...fadeTransition, delay: 0.2 + idx * 0.05 }}
                        {...hoverLiftProps}
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
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.section className="space-y-6" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.1 }}>
            <motion.div className="text-center" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.15 }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{aboutTitle}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{product.longDescription}</p>
            </motion.div>
          </motion.section>

          <motion.section {...inViewTiltProps} transition={{ ...fadeTransition, delay: 0.12 }}>
            <motion.div className="text-center mb-12" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.17 }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.featuresTitle}</h2>
            </motion.div>

            <motion.div
              className="max-w-4xl mx-auto glass-effect rounded-2xl p-8 border border-white/10"
              {...inViewScaleProps}
              transition={{ ...fadeTransition, delay: 0.2 }}
              {...hoverGlowProps}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {variant.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -14, rotateY: -8 }}
                    whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.35, ease: 'easeOut', delay: idx * 0.04 }}
                    whileHover={{ x: 4 }}
                  >
                    <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.section>

          <motion.section {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.14 }}>
            <motion.div className="text-center mb-12" {...inViewFadeProps} transition={{ ...fadeTransition, delay: 0.19 }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.benefits.title}</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {copy.benefits.items.map((item, index) => {
                const Icon = benefitIcons[index] ?? Cloud
                return (
                  <motion.div
                    key={item.title}
                    className="p-6 glass-effect rounded-xl border border-white/10 text-center"
                    {...inViewScaleProps}
                    transition={{ ...fadeTransition, delay: 0.22 + index * 0.05 }}
                    {...hoverGlowProps}
                  >
                    <div className="inline-flex p-4 bg-blue-500/20 rounded-xl mb-4">
                      <Icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          <motion.section
            className="text-center py-16 glass-effect rounded-2xl border border-white/10"
            {...inViewScaleProps}
            transition={{ ...fadeTransition, delay: 0.16 }}
            {...hoverGlowProps}
          >
            <h2 className="text-4xl font-bold mb-6">{ctaTitle}</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{ctaDescription}</p>
            <Link href={`/${locale}/premium/signup`} className="group inline-block">
              <motion.span
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 rounded-lg font-semibold transition-colors group-hover:bg-blue-600"
                whileHover={{ scale: 1.05, rotate: -0.5, boxShadow: '0px 18px 40px rgba(59, 130, 246, 0.35)' }}
                whileTap={{ scale: 0.97, rotate: 0 }}
              >
                {copy.cta.button}
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
