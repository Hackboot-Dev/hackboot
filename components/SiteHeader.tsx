'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import LanguageSelectorSimplest from '@/components/LanguageSelectorSimplest'
import Logo from '@/components/Logo'
import { useI18n } from '@/lib/i18n-simple'

const SUPPORTED_LOCALES = ['fr', 'en', 'et'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

type NavItem = {
  key: string
  href: string
  label: string
}

const isSupportedLocale = (value: string | undefined): value is SupportedLocale => {
  return value ? SUPPORTED_LOCALES.includes(value as SupportedLocale) : false
}

const SiteHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { t, locale: activeLocale } = useI18n()

  const locale = useMemo(() => {
    if (isSupportedLocale(activeLocale)) {
      return activeLocale
    }
    const segments = pathname?.split('/') ?? []
    const candidate = segments[1]
    if (isSupportedLocale(candidate)) {
      return candidate
    }
    return 'fr'
  }, [activeLocale, pathname])

  const basePath = useMemo(() => `/${locale}`, [locale])

  const buildHref = useCallback(
    (path: string) => {
      if (path === '/') {
        return basePath
      }
      return `${basePath}${path}`
    },
    [basePath]
  )

  const navigation: NavItem[] = useMemo(() => {
    const navTranslations = t?.nav ?? {}
    return [
      { key: 'home', href: '/', label: navTranslations.home ?? 'Accueil' },
      { key: 'games', href: '/games', label: navTranslations.games ?? 'Jeux' },
      { key: 'services', href: '/services', label: navTranslations.services ?? 'Services' },
      { key: 'about', href: '/about', label: navTranslations.about ?? 'À propos' },
      { key: 'contact', href: '/contact', label: navTranslations.contact ?? 'Contact' }
    ]
  }, [t])

  const isActive = useCallback(
    (href: string) => {
      if (!pathname) {
        return false
      }
      const target = buildHref(href)
      if (href === '/') {
        return pathname === target || pathname === `${target}/`
      }
      return pathname === target || pathname.startsWith(`${target}/`)
    },
    [buildHref, pathname]
  )

  const handleStart = useCallback(() => {
    router.push(buildHref('/premium'))
  }, [buildHref, router])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((open) => !open)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const overlayTransition = useMemo(
    () => ({ duration: 0.25, ease: [0.4, 0, 0.2, 1] }),
    []
  )

  const panelTransition = useMemo(
    () => ({ type: 'spring', stiffness: 260, damping: 28, mass: 0.9 }),
    []
  )

  const ctaLabel = t?.nav?.getStarted ?? 'Commencer'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-2xl border-b border-white/10'
            : 'bg-black/40 backdrop-blur-xl'
        }`}
      >
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href={buildHref('/')} className="flex items-center gap-3 text-white">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={buildHref(item.href)}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href) ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isActive(item.href) && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-500" />
                )}
              </Link>
            ))}

            <LanguageSelectorSimplest />

            <button
              type="button"
              onClick={handleStart}
              className="ml-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-transform duration-300 hover:-translate-y-0.5"
            >
              {ctaLabel}
            </button>
          </div>

          <button
            type="button"
            className="md:hidden relative flex h-11 w-11 flex-col items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl transition-all"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-site-menu"
            aria-label="Toggle navigation"
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${
                isMobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : 'mt-1 opacity-100'
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${
                isMobileMenuOpen ? '-translate-y-1.5 -rotate-45' : 'mt-1'
              }`}
            />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.button
            key="mobile-site-overlay"
            type="button"
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl md:hidden"
            onClick={closeMobileMenu}
            aria-label="Close navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-site-panel"
            id="mobile-site-menu"
            className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-full overflow-y-auto border-l border-white/10 bg-black/95 px-6 pb-12 pt-20 shadow-2xl shadow-purple-900/40 md:hidden"
            initial={{ x: '100%', opacity: 0, scale: 0.96, rotate: 1.5 }}
            animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
            exit={{ x: '100%', opacity: 0, scale: 0.95, rotate: 1 }}
            transition={panelTransition}
          >
            <div className="mb-8">
              <LanguageSelectorSimplest />
            </div>

            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.key}
                  href={buildHref(item.href)}
                  className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors duration-200 ${
                    isActive(item.href) ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/10'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => {
                closeMobileMenu()
                handleStart()
              }}
              className="mt-10 w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-purple-500/30"
            >
              {ctaLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SiteHeader
