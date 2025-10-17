'use client'

import React, { useState, useRef, useEffect, memo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'et', name: 'Eesti' },
]

export default memo(function LanguageSelectorSimple() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const currentLocale = pathname.split('/')[1] || 'fr'
  const currentLang = languages.find(l => l.code === currentLocale) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) {
      setIsOpen(false)
      return
    }

    setIsOpen(false)
    setIsTransitioning(true)

    // Lancer l'animation de vague et naviguer IMMÉDIATEMENT
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`)

    // Petit délai pour voir le début de l'animation
    setTimeout(() => {
      router.push(newPath)
    }, 200)

    // Arrêter le loader après la navigation
    setTimeout(() => {
      setIsTransitioning(false)
    }, 1500)
  }

  return (
    <>
      <div ref={dropdownRef} className="relative z-50">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          disabled={isTransitioning}
          className={`flex items-center gap-2 px-4 py-2 glass-effect rounded-lg hover:bg-white/10 transition-all ${
            isTransitioning ? 'opacity-50 cursor-wait' : ''
          }`}
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {currentLang.code.toUpperCase()}
          </span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {isOpen && !isTransitioning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 w-48 glass-effect rounded-lg overflow-hidden"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-all text-left ${
                    currentLocale === lang.code ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{lang.name}</p>
                    <p className="text-xs text-gray-400">{lang.code.toUpperCase()}</p>
                  </div>
                  {currentLocale === lang.code && (
                    <div className="w-2 h-2 bg-accent rounded-full" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animation de vague SIMPLE qui se lance et c'est tout */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-[200] pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <svg
              className="absolute inset-0 h-full w-[150%]"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="rgba(99, 102, 241, 0.6)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                fill="url(#waveGrad)"
                d="M-20,0 C-10,25 -10,75 -20,100 L120,100 C110,75 110,25 120,0 Z"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
})