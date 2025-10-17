'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import HeaderFixed from '@/components/HeaderFixed'
import { getSubscriptionPlans, type SubscriptionPlan } from '@/lib/subscriptions'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, Shield, Sparkles } from 'lucide-react'

const plans = getSubscriptionPlans()

const formatPrice = (plan: SubscriptionPlan) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: plan.currency,
    minimumFractionDigits: plan.price % 1 === 0 ? 0 : 2
  }).format(plan.price)

export default function PremiumSignupPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans.find((plan) => plan.popular)?.id || plans[0].id)

  const selectedPlan = useMemo(() => plans.find((plan) => plan.id === selectedPlanId) ?? plans[0], [selectedPlanId])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <HeaderFixed />

      <div className="fixed inset-0 opacity-[0.05] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(56, 189, 248, 0.15), transparent 50%)'
          }}
        />
      </div>

      <main className="relative pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-purple-300 bg-white/5 border border-purple-500/40 rounded-full">
              <Shield className="w-4 h-4" />
              Inscription configurateur
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black">
              Active ton accès premium
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Choisis une formule, crée ton compte et démarre immédiatement sur l&apos;infrastructure la plus performante du marché.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {plans.map((plan) => (
              <motion.button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlanId(plan.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`relative p-6 rounded-3xl border transition-all text-left flex flex-col gap-6 ${
                  selectedPlanId === plan.id
                    ? 'border-purple-500/80 bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-transparent shadow-lg shadow-purple-900/40'
                    : 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-xs font-semibold rounded-full">
                    Populaire
                  </span>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
                  <p className="text-sm text-gray-400 mt-2">{plan.description}</p>
                </div>
                <div>
                  <div className="text-4xl font-black text-white">{formatPrice(plan)}</div>
                  <div className="text-sm text-gray-400">{plan.billing}</div>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-purple-300">Sélectionner</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.button>
            ))}
          </div>

          <div className="glass-effect rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Complète ton inscription</h2>
                <p className="text-gray-300 mb-8">
                  Tu es à un pas de rejoindre la communauté Hackboot. Renseigne tes informations pour générer ton accès sécurisé.
                </p>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2" htmlFor="firstname">
                        Prénom
                      </label>
                      <input
                        id="firstname"
                        name="firstname"
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none"
                        placeholder="Alex"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2" htmlFor="lastname">
                        Nom
                      </label>
                      <input
                        id="lastname"
                        name="lastname"
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none"
                        placeholder="Dupont"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2" htmlFor="email">
                      Email professionnel
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none"
                      placeholder="alex@hackboot.gg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2" htmlFor="password">
                        Mot de passe
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2" htmlFor="confirmPassword">
                        Confirmer le mot de passe
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input id="terms" name="terms" type="checkbox" className="mt-1 w-4 h-4 rounded border-white/20 bg-black/40" />
                    <label htmlFor="terms" className="text-sm text-gray-400">
                      J&apos;accepte les conditions générales et la politique de confidentialité.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500 font-semibold text-white hover:shadow-lg hover:shadow-purple-900/40 transition-all flex items-center justify-center gap-2"
                  >
                    Valider mon inscription
                    <Sparkles className="w-5 h-5" />
                  </button>
                </form>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPlan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass-effect rounded-2xl bg-black/60 border border-white/10 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-400">Formule sélectionnée</p>
                      <h3 className="text-2xl font-bold">{selectedPlan.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-white">{formatPrice(selectedPlan)}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{selectedPlan.billing}</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm text-gray-300">
                    {selectedPlan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 text-xs text-gray-500">
                    En cliquant sur « Valider mon inscription », un conseiller te contactera pour finaliser l&apos;accès à ton espace premium.
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-16 text-center text-sm text-gray-500">
            <p>
              Déjà client ?{' '}
              <Link href={`/${locale}/login`} className="text-purple-300 hover:text-purple-200 underline underline-offset-4">
                Connecte-toi ici
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
