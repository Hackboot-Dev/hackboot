'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getSubscriptionPlans } from '@/lib/subscriptions'
import { useI18n } from '@/lib/i18n-simple'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'

export default function PremiumPlansSection() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { t } = useI18n()
  const plans = getSubscriptionPlans()
  const premiumSignupContent = t.premiumSignup ?? {}
  const planTranslations = (premiumSignupContent.plans ?? {}) as Record<string, { name?: string; description?: string; features?: string[] }>

  const sectionTitle = t.premiumPlansSection?.title ?? 'Choisis Ton Plan Premium'
  const sectionSubtitle = t.premiumPlansSection?.subtitle ?? 'Des formules flexibles adaptées à tous les joueurs'
  const ctaButton = t.premiumPlansSection?.cta ?? 'Découvrir les offres'

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full mb-6">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Premium</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {sectionSubtitle}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const planContent = planTranslations[plan.id] ?? {}
            const planName = planContent.name ?? plan.name
            const planDescription = planContent.description ?? plan.description
            const planFeatures = Array.isArray(planContent.features) && planContent.features.length > 0
              ? planContent.features
              : plan.features
            const isPopular = plan.popular

            return (
              <div
                key={plan.id}
                className={`
                  relative group rounded-3xl p-8 transition-all duration-300 hover:scale-105
                  ${isPopular
                    ? 'bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-2 border-amber-500/50 shadow-xl shadow-amber-500/20'
                    : 'glass-effect border border-white/10'
                  }
                `}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full">
                    <span className="text-sm font-bold text-black">{premiumSignupContent.labels?.popular ?? 'Populaire'}</span>
                  </div>
                )}

                {/* Plan icon */}
                <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center ${
                  isPopular
                    ? 'bg-gradient-to-br from-amber-500 to-yellow-600'
                    : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                }`}>
                  {plan.id === 'élite' ? (
                    <Crown className="w-8 h-8 text-white" />
                  ) : plan.id === 'avantage' ? (
                    <Zap className="w-8 h-8 text-white" />
                  ) : (
                    <Sparkles className="w-8 h-8 text-white" />
                  )}
                </div>

                {/* Plan name */}
                <h3 className="text-2xl font-black text-white mb-2">{planName}</h3>
                <p className="text-sm text-gray-400 mb-6">{planDescription}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-black ${
                      isPopular ? 'text-amber-400' : 'text-white'
                    }`}>
                      {new Intl.NumberFormat(locale === 'en' ? 'en-US' : locale === 'et' ? 'et-EE' : 'fr-FR', {
                        style: 'currency',
                        currency: plan.currency,
                        minimumFractionDigits: plan.price % 1 === 0 ? 0 : 2
                      }).format(plan.price)}
                    </span>
                    <span className="text-gray-400">/{plan.billing}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {planFeatures.slice(0, 5).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        isPopular ? 'text-amber-400' : 'text-purple-400'
                      }`} />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={`/${locale}/premium/signup?plan=${plan.id}`}
                  className={`
                    block w-full py-4 rounded-xl font-bold text-center transition-all
                    ${isPopular
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black hover:scale-105 shadow-lg shadow-amber-500/30'
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                    }
                  `}
                >
                  {premiumSignupContent.labels?.select ?? 'Choisir cette offre'}
                </Link>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            href={`/${locale}/premium`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-purple-500/30"
          >
            {ctaButton}
            <Crown className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
