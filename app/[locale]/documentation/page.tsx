'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import { BookOpen, Lock, ArrowRight } from 'lucide-react'

export default function DocumentationPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'

  const content = {
    fr: {
      badge: 'Documentation',
      title: 'Documentation Hackboot',
      subtitle: 'Accès réservé aux utilisateurs connectés',
      description: 'Pour accéder à notre documentation complète, vous devez être connecté avec un compte Hackboot.',
      loginButton: 'Se connecter',
      signupText: 'Pas encore de compte ?',
      signupLink: 'Créer un compte',
    },
    en: {
      badge: 'Documentation',
      title: 'Hackboot Documentation',
      subtitle: 'Access reserved for logged-in users',
      description: 'To access our complete documentation, you need to be logged in with a Hackboot account.',
      loginButton: 'Log in',
      signupText: "Don't have an account?",
      signupLink: 'Create an account',
    },
    et: {
      badge: 'Dokumentatsioon',
      title: 'Hackboot dokumentatsioon',
      subtitle: 'Juurdepääs ainult sisselogitud kasutajatele',
      description: 'Meie täielikule dokumentatsioonile juurdepääsuks peate olema Hackbooti kontoga sisse logitud.',
      loginButton: 'Logi sisse',
      signupText: 'Pole veel kontot?',
      signupLink: 'Loo konto',
    },
  }

  const t = content[locale as keyof typeof content] || content.fr

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
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

      <main className="relative pt-28 pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-purple-300 bg-white/5 border border-purple-500/40 rounded-full">
              <BookOpen className="w-4 h-4" />
              {t.badge}
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-black">
              {t.title}
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              {t.subtitle}
            </p>
          </div>

          <div className="glass-effect rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Lock className="w-10 h-10 text-purple-400" />
              </div>
            </div>

            <p className="text-lg text-gray-300 mb-8">
              {t.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={`/${locale}/login`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500 font-semibold text-white hover:shadow-lg hover:shadow-purple-900/40 transition-transform duration-300 hover:scale-[1.02]"
              >
                {t.loginButton}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="mt-8 text-sm text-gray-400">
              <p>
                {t.signupText}{' '}
                <Link
                  href={`/${locale}/premium/signup`}
                  className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4"
                >
                  {t.signupLink}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
