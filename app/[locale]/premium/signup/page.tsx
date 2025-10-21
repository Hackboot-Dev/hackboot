'use client'

import { useMemo, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import { getSubscriptionPlans, type SubscriptionPlan } from '@/lib/subscriptions'
import { Check, ArrowRight, Shield, Sparkles, Loader2, AlertCircle } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'

const plans = getSubscriptionPlans()

type PlanCopy = {
  name?: string
  description?: string
  billing?: string
  features?: string[]
}

export default function PremiumSignupPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { t } = useI18n()
  const premiumSignup = t.premiumSignup ?? {}
  const planTranslations = (premiumSignup.plans ?? {}) as Record<string, PlanCopy>
  const numberFormatLocale = locale === 'en' ? 'en-US' : locale === 'et' ? 'et-EE' : 'fr-FR'
  const formatPrice = useCallback(
    (plan: SubscriptionPlan) =>
      new Intl.NumberFormat(numberFormatLocale, {
        style: 'currency',
        currency: plan.currency,
        minimumFractionDigits: plan.price % 1 === 0 ? 0 : 2
      }).format(plan.price),
    [numberFormatLocale]
  )
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans.find((plan) => plan.popular)?.id || plans[0].id)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? plans[0],
    [selectedPlanId]
  )

  const selectedPlanContent = planTranslations[selectedPlan.id] ?? {}
  const selectedPlanName = selectedPlanContent.name ?? selectedPlan.name
  const selectedPlanBilling = selectedPlanContent.billing ?? selectedPlan.billing
  const selectedPlanFeatures = Array.isArray(selectedPlanContent.features) && selectedPlanContent.features.length > 0
    ? selectedPlanContent.features
    : selectedPlan.features

  const badgeLabel = premiumSignup.badge ?? 'Inscription configurateur'
  const pageTitle = premiumSignup.title ?? 'Active ton accès premium'
  const pageDescription = premiumSignup.description ?? "Choisis une formule, crée ton compte et démarre immédiatement sur l'infrastructure la plus performante du marché."
  const labels = premiumSignup.labels ?? {}
  const popularLabel = labels.popular ?? 'Populaire'
  const selectLabel = labels.select ?? 'Sélectionner'
  const formContent = premiumSignup.form ?? {}
  const formTitle = formContent.title ?? 'Complète ton inscription'
  const formDescription = formContent.description ?? 'Tu es à un pas de rejoindre la communauté Hackboot. Renseigne tes informations pour générer ton accès sécurisé.'
  const fields = formContent.fields ?? {}
  const firstnameField = fields.firstname ?? { label: 'Prénom', placeholder: 'Alex' }
  const lastnameField = fields.lastname ?? { label: 'Nom', placeholder: 'Dupont' }
  const emailField = fields.email ?? { label: 'Email professionnel', placeholder: 'alex@hackboot.gg' }
  const passwordField = fields.password ?? { label: 'Mot de passe', placeholder: '••••••••' }
  const confirmPasswordField = fields.confirmPassword ?? { label: 'Confirmer le mot de passe', placeholder: '••••••••' }
  const termsText = formContent.terms ?? "J'accepte les conditions générales et la politique de confidentialité."
  const submitText = formContent.submit ?? 'Valider mon inscription'
  const disclaimer = formContent.disclaimer ?? "En cliquant sur « Valider mon inscription », un conseiller te contactera pour finaliser l'accès à ton espace premium."
  const summaryContent = premiumSignup.summary ?? {}
  const summarySelectedLabel = summaryContent.selected ?? 'Formule sélectionnée'
  const contactContent = premiumSignup.contact ?? {}
  const contactText = contactContent.text ?? 'Déjà client ?'
  const contactLinkLabel = contactContent.link ?? 'Connecte-toi ici'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    setTimeout(() => {
      setIsLoading(false)
      setError('Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden animate-fade-in">
      <SiteHeader />

      <div className="fixed inset-0 opacity-[0.05] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(56, 189, 248, 0.15), transparent 50%)'
          }}
        />
      </div>

      <main className="relative pt-28 pb-24 animate-scale-in">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-scale-in">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-purple-300 bg-white/5 border border-purple-500/40 rounded-full">
              <Shield className="w-4 h-4" />
              {badgeLabel}
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black">
              {pageTitle}
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              {pageDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 animate-slide-up">
            {plans.map((plan) => {
              const planContent = planTranslations[plan.id] ?? {}
              const planName = planContent.name ?? plan.name
              const planDescription = planContent.description ?? plan.description
              const planBilling = planContent.billing ?? plan.billing
              const planFeatures = Array.isArray(planContent.features) && planContent.features.length > 0
                ? planContent.features
                : plan.features

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`group relative p-6 rounded-3xl border transition-all text-left flex flex-col gap-6 ${
                    selectedPlanId === plan.id
                      ? 'border-purple-500/80 bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-transparent shadow-lg shadow-purple-900/40'
                      : 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
                  }`}
                  aria-pressed={selectedPlanId === plan.id}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-xs font-semibold rounded-full">
                      {popularLabel}
                    </span>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-white">{planName}</h2>
                    <p className="text-sm text-gray-400 mt-2">{planDescription}</p>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-white">{formatPrice(plan)}</div>
                    <div className="text-sm text-gray-400">{planBilling}</div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {planFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-purple-300">{selectLabel}</span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform duration-300 ${
                        selectedPlanId === plan.id ? 'translate-x-1' : 'group-hover:translate-x-1'
                      }`}
                    />
                  </div>
                </button>
              )
            })}
          </div>

          <div className="glass-effect rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">{formTitle}</h2>
                <p className="text-gray-300 mb-8">
                  {formDescription}
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2" htmlFor="firstname">
                        {firstnameField.label}
                      </label>
                      <input
                        id="firstname"
                        name="firstname"
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none"
                        placeholder={firstnameField.placeholder}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2" htmlFor="lastname">
                        {lastnameField.label}
                      </label>
                      <input
                        id="lastname"
                        name="lastname"
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none"
                        placeholder={lastnameField.placeholder}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2" htmlFor="email">
                      {emailField.label}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none"
                      placeholder={emailField.placeholder}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2" htmlFor="password">
                        {passwordField.label}
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none"
                        placeholder={passwordField.placeholder}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2" htmlFor="confirmPassword">
                        {confirmPasswordField.label}
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none"
                        placeholder={confirmPasswordField.placeholder}
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-xl font-semibold mb-4">Informations de paiement</h3>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2" htmlFor="cardNumber">
                        Numéro de carte
                      </label>
                      <input
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        maxLength={19}
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2" htmlFor="expiryDate">
                          Date d&apos;expiration
                        </label>
                        <input
                          id="expiryDate"
                          name="expiryDate"
                          type="text"
                          maxLength={5}
                          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none"
                          placeholder="MM/AA"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2" htmlFor="cvv">
                          CVV
                        </label>
                        <input
                          id="cvv"
                          name="cvv"
                          type="text"
                          maxLength={3}
                          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input id="terms" name="terms" type="checkbox" className="mt-1 w-4 h-4 rounded border-white/20 bg-black/40" />
                    <label htmlFor="terms" className="text-sm text-gray-400">
                      {termsText}
                    </label>
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-200">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500 font-semibold text-white hover:shadow-lg hover:shadow-purple-900/40 transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        {submitText}
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="glass-effect rounded-2xl bg-black/60 border border-white/10 p-6 transition-colors duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-400">{summarySelectedLabel}</p>
                    <h3 className="text-2xl font-bold">{selectedPlanName}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-white">{formatPrice(selectedPlan)}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{selectedPlanBilling}</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-gray-300">
                  {selectedPlanFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 text-xs text-gray-500">
                  {disclaimer}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center text-sm text-gray-500 animate-fade-in">
            <p>
              {contactText}{' '}
              <Link href={`/${locale}/login`} className="text-purple-300 hover:text-purple-200 underline underline-offset-4">
                {contactLinkLabel}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
