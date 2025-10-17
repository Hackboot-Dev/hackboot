'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import LanguageSelectorSimplest from '@/components/LanguageSelectorSimplest'
import Logo from '@/components/Logo'
import { useI18n } from '@/lib/i18n-simple'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t, locale: activeLocale } = useI18n()
  const router = useRouter()

  const locale = useMemo(() => {
    if (activeLocale) {
      return activeLocale
    }

    const segments = pathname?.split('/') ?? []
    const potentialLocale = segments[1]
    if (potentialLocale && ['fr', 'en', 'et'].includes(potentialLocale)) {
      return potentialLocale
    }

    return 'fr'
  }, [activeLocale, pathname])

  const basePath = `/${locale}`

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: t?.nav?.home || 'Accueil', href: basePath },
    { name: t?.nav?.games || 'Jeux', href: `${basePath}/games` },
    { name: t?.nav?.services || 'Services', href: `${basePath}/services` },
    { name: t?.nav?.about || 'À propos', href: `${basePath}/about` },
    { name: t?.nav?.contact || 'Contact', href: `${basePath}/contact` }
  ]

  const isActive = (href: string) => {
    if (!pathname) return false

    if (href === basePath) {
      return pathname === basePath || pathname === `${basePath}/`
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-2xl saturate-150 border-b border-white/20'
            : 'bg-black/30 backdrop-blur-md'
        }`}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={basePath} className="flex items-center">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    isActive(item.href)
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive(item.href) && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-500 transition-opacity duration-300" />
                  )}
                </Link>
              ))}

              {/* Language Selector */}
              <div className="ml-4">
                <LanguageSelectorSimplest />
              </div>

              {/* CTA Button */}
              <button
                type="button"
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-lg hover:shadow-purple-500/25 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => router.push(`${basePath}/premium`)}
              >
                {t?.nav?.getStarted || 'Commencer'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center glass-effect rounded-lg"
            >
              <span
                className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-white mt-1 transition-opacity duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-white mt-1 transition-transform duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fermer le menu"
          />
          <div
            id="mobile-menu"
            className="fixed top-0 right-0 bottom-0 w-72 bg-black backdrop-blur-2xl saturate-150 border-l border-white/20 z-50 md:hidden shadow-2xl shadow-black/50 transition-transform duration-300"
          >
            <div className="p-6 pt-20">
              <div className="space-y-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-lg font-medium transition-colors duration-300 ${
                      isActive(item.href)
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center">
                      {isActive(item.href) && (
                        <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-full mr-3" />
                      )}
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Language Selector for Mobile */}
              <div className="mt-6 px-2">
                <LanguageSelectorSimplest />
              </div>

              <button
                type="button"
                className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  router.push(`${basePath}/premium`)
                }}
              >
                {t?.nav?.getStarted || 'Commencer'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Header
