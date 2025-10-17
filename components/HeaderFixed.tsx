'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSelectorSimplest from '@/components/LanguageSelectorSimplest'
import Logo from '@/components/Logo'
import { useI18n } from '@/lib/i18n-simple'

const HeaderFixed = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useI18n()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!t || !t.nav) {
    return null
  }

  const navigation = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.games, href: '/games' },
    { name: t.nav.services, href: '/services' },
    { name: t.nav.about, href: '/about' },
    { name: t.nav.contact, href: '/contact' }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/en' || pathname === '/fr' || pathname === '/et'
    }
    return pathname?.includes(href)
  }

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className={`absolute inset-0 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-2xl saturate-150 border-b border-white/10'
            : 'bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm'
        }`} />

        <nav className="relative container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative group"
                >
                  <span className={`text-sm font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}>
                    {item.name}
                  </span>

                  {/* Underline indicator */}
                  <motion.div
                    className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-500 ${
                      isActive(item.href) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    initial={false}
                    animate={{
                      scaleX: isActive(item.href) ? 1 : 0,
                      opacity: isActive(item.href) ? 1 : 0
                    }}
                    whileHover={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ))}

              {/* Language Selector */}
              <div className="ml-4">
                <LanguageSelectorSimplest />
              </div>

              {/* CTA Button */}
              <motion.button
                className="relative px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-semibold rounded-full overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">{t.nav.getStarted}</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-500"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-11 h-11 flex flex-col justify-center items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`} />
              <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`} />
              <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-80 bg-gradient-to-b from-black to-gray-900 backdrop-blur-2xl border-l border-white/10 z-50 md:hidden overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <span className="sr-only">Close menu</span>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-8 pt-20">
                {/* Navigation Links */}
                <div className="space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block"
                    >
                      <motion.div
                        className={`relative px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive(item.href)
                            ? 'bg-white/10'
                            : 'hover:bg-white/5'
                        }`}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center">
                          {isActive(item.href) && (
                            <motion.div
                              className="absolute left-0 w-1 h-8 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-r-full"
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          <span className={`text-lg font-medium ${
                            isActive(item.href)
                              ? 'text-white'
                              : 'text-gray-300'
                          }`}>
                            {item.name}
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-white/10" />

                {/* Language Selector for Mobile */}
                <div className="mb-6">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Language</p>
                  <LanguageSelectorSimplest />
                </div>

                {/* CTA Button */}
                <motion.button
                  className="relative w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl overflow-hidden group shadow-lg shadow-purple-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="relative z-10">{t.nav.getStarted}</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-500"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>

                {/* Footer info */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-xs text-gray-500 text-center">
                    © 2025 HACKBOOT. All rights reserved.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default HeaderFixed