'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import LanguageSelectorSimplest from '@/components/LanguageSelectorSimplest'
import Logo from '@/components/Logo'
import { useI18n } from '@/lib/i18n-simple'

const HeaderFixed = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { t, locale } = useI18n()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!t || !t.nav) {
    return null
  }

  const buildHref = (path: string) => {
    const currentLocale = locale || 'fr'
    if (path === '/') {
      return `/${currentLocale}`
    }
    return `/${currentLocale}${path}`
  }

  const navigation = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.games, href: '/games' },
    { name: t.nav.services, href: '/services' },
    { name: t.nav.about, href: '/about' },
    { name: t.nav.contact, href: '/contact' },
  ]

  const isActive = (href: string) => {
    const fullHref = buildHref(href)
    return pathname === fullHref
  }

  const handleStart = () => {
    router.push(buildHref('/premium'))
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10' : 'bg-gradient-to-b from-black/70 to-transparent'
        }`}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={buildHref('/')} className="relative z-10">
              <Logo />
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={buildHref(item.href)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href) ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="ml-4">
                <LanguageSelectorSimplest />
              </div>

              <button
                onClick={handleStart}
                className="ml-4 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-semibold rounded-full transition-transform duration-300 hover:-translate-y-0.5"
              >
                {t.nav.getStarted}
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="md:hidden relative w-11 h-11 flex flex-col justify-center items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl transition-all"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white mt-1 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white mt-1 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-gradient-to-b from-black to-gray-900 border-l border-white/10 z-50 p-8 pt-20 space-y-6 overflow-y-auto">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 rounded-lg"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <LanguageSelectorSimplest />

            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={buildHref(item.href)}
                  className={`block px-4 py-3 rounded-xl transition-colors duration-200 ${
                    isActive(item.href) ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false)
                handleStart()
              }}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full text-white font-semibold"
            >
              {t.nav.getStarted}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default HeaderFixed
