'use client'

import { useState, FormEvent } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import { useI18n } from '@/lib/i18n-simple'
import { Shield, Mail, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { t } = useI18n()
  const loginContent = t.login ?? {}

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        const apiError = data.error || ''

        if (apiError.toLowerCase().includes('incorrect') || apiError.toLowerCase().includes('invalid')) {
          setError(loginContent.errors?.invalidCredentials || loginContent.errors?.generic || 'Une erreur est survenue')
        } else {
          setError(loginContent.errors?.generic || 'Une erreur est survenue')
        }
      } else {
        window.location.href = `/${locale}/dashboard`
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(loginContent.errors?.generic || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const badge = loginContent.badge ?? 'Connexion sécurisée'
  const title = loginContent.title ?? 'Connexion'
  const subtitle = loginContent.subtitle ?? 'Accédez à votre espace Hackboot'
  const emailLabel = loginContent.form?.email?.label ?? 'Email'
  const emailPlaceholder = loginContent.form?.email?.placeholder ?? 'votre@email.com'
  const passwordLabel = loginContent.form?.password?.label ?? 'Mot de passe'
  const passwordPlaceholder = loginContent.form?.password?.placeholder ?? '••••••••'
  const forgotPassword = loginContent.form?.forgotPassword ?? 'Mot de passe oublié ?'
  const submitButton = loginContent.form?.submit ?? 'Se connecter'
  const submittingButton = loginContent.form?.submitting ?? 'Connexion...'
  const noAccount = loginContent.noAccount?.text ?? 'Pas encore de compte ?'
  const signupLink = loginContent.noAccount?.link ?? 'Créer un compte'

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

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300" htmlFor="password">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      {passwordLabel}
                    </div>
                  </label>
                  <Link
                    href={`/${locale}/forgot-password`}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {forgotPassword}
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors text-white"
                  placeholder={passwordPlaceholder}
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
                  <>
                    {submitButton}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-sm text-gray-400 animate-fade-in">
            <p>
              {noAccount}{' '}
              <Link
                href={`/${locale}/premium/signup`}
                className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4"
              >
                {signupLink}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
