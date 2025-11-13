'use client'

import { useState, FormEvent } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import { useI18n } from '@/lib/i18n-simple'
import { Shield, Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { t } = useI18n()
  const forgotPasswordContent = t.forgotPassword ?? {}

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setEmail('')
      } else {
        if (data.error?.toLowerCase().includes('invalid email')) {
          setError(forgotPasswordContent.errors?.invalidEmail || 'Email invalide')
        } else {
          setError(forgotPasswordContent.errors?.generic || 'Une erreur est survenue')
        }
      }
    } catch (err) {
      console.error('Forgot password error:', err)
      setError(forgotPasswordContent.errors?.generic || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const badge = forgotPasswordContent.badge ?? 'Récupération de compte'
  const title = forgotPasswordContent.title ?? 'Mot de passe oublié ?'
  const subtitle = forgotPasswordContent.subtitle ?? 'Pas de souci, on va t\'aider à récupérer ton compte'
  const emailLabel = forgotPasswordContent.form?.email?.label ?? 'Email'
  const emailPlaceholder = forgotPasswordContent.form?.email?.placeholder ?? 'votre@email.com'
  const submitButton = forgotPasswordContent.form?.submit ?? 'Envoyer le lien'
  const submittingButton = forgotPasswordContent.form?.submitting ?? 'Envoi en cours...'
  const backToLogin = forgotPasswordContent.backToLogin ?? 'Retour à la connexion'
  const successMessage = forgotPasswordContent.successMessage ?? 'Si un compte existe avec cette adresse email, un lien de réinitialisation a été envoyé.'
  const successNote = forgotPasswordContent.successNote ?? 'Vérifie ta boîte mail (et tes spams) dans quelques minutes.'

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
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-scale-in">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-purple-300 bg-white/5 border border-purple-500/40 rounded-full">
              <Shield className="w-4 h-4" />
              {badge}
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-black">
              {title}
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              {subtitle}
            </p>
          </div>

          <div className="glass-effect rounded-3xl border border-white/10 bg-white/5 p-8 animate-fade-in">
            {success ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{successMessage}</h3>
                  <p className="text-sm text-gray-400">{successNote}</p>
                </div>
                <Link
                  href={`/${locale}/login`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {backToLogin}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {emailLabel}
                    </div>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors text-white"
                    placeholder={emailPlaceholder}
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-shake">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500 font-semibold text-white hover:shadow-lg hover:shadow-purple-900/40 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {submittingButton}
                    </>
                  ) : (
                    submitButton
                  )}
                </button>

                <div className="text-center">
                  <Link
                    href={`/${locale}/login`}
                    className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {backToLogin}
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
