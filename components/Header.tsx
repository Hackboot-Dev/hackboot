'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSelectorSimplest from '@/components/LanguageSelectorSimplest'
import Logo from '@/components/Logo'
import { useI18n } from '@/lib/i18n-simple'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useI18n()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: t?.nav?.home || 'Accueil', href: '/' },
    { name: t?.nav?.games || 'Jeux', href: '/games' },
    { name: t?.nav?.services || 'Services', href: '/services' },
    { name: t?.nav?.about || 'À propos', href: '/about' },
    { name: t?.nav?.contact || 'Contact', href: '/contact' }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/en' || pathname === '/fr'
    }
    return pathname?.includes(href)
  }

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-2xl saturate-150 border-b border-white/20'
            : 'bg-black/30 backdrop-blur-md'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
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
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-500"
                      layoutId="navbar-indicator"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </Link>
              ))}

              {/* Language Selector */}
              <div className="ml-4">
                <LanguageSelectorSimplest />
              </div>

              {/* CTA Button */}
              <motion.button
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t?.nav?.getStarted || 'Commencer'}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center group glass-effect rounded-lg"
            >
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`} />
              <span className={`block w-6 h-0.5 bg-white mt-1 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`} />
              <span className={`block w-6 h-0.5 bg-white mt-1 transition-all duration-300 ${
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
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-72 bg-black backdrop-blur-2xl saturate-150 border-l border-white/20 z-50 md:hidden shadow-2xl shadow-black/50"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
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
                      <motion.div
                        whileHover={{ x: 10 }}
                        className="flex items-center"
                      >
                        {isActive(item.href) && (
                          <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-full mr-3" />
                        )}
                        {item.name}
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* Language Selector for Mobile */}
                <div className="mt-6 px-2">
                  <LanguageSelectorSimplest />
                </div>

                <motion.button
                  className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t?.nav?.getStarted || 'Commencer'}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header