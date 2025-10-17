'use client'

import React, { useState, useRef, useEffect, memo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import WaveTransitionSimple from './WaveTransitionSimple'

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'et', name: 'Eesti' },
]

export default memo(function LanguageSelectorWave() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [pendingLocale, setPendingLocale] = useState<string | null>(null)
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
    setPendingLocale(newLocale)
    setIsTransitioning(true)

    // Faire disparaître le texte actuel progressivement
    const elements = document.querySelectorAll('h1, h2, h3, p, span:not(.no-transition), button, a')
    elements.forEach((el, index) => {
      const element = el as HTMLElement
      // Ne pas animer les éléments système
      if (element.closest('[role="dialog"]') || element.closest('.fixed')) return

      // Sauvegarder l'état original
      element.dataset.originalOpacity = element.style.opacity || '1'
      element.style.transition = `all 0.4s ease-out ${index * 0.002}s`
      element.style.opacity = '0'
      element.style.filter = 'blur(2px)'
      element.style.transform = 'translateX(-10px)'
    })

    // Naviguer quand la vague arrive au milieu
    setTimeout(() => {
      const newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`)
      router.push(newPath)
    }, 700)
  }

  const handleTransitionComplete = () => {
    // Faire réapparaître le texte avec effet de cascade
    setTimeout(() => {
      const elements = document.querySelectorAll('h1, h2, h3, p, span:not(.no-transition), button, a')
      elements.forEach((el, index) => {
        const element = el as HTMLElement
        if (element.closest('[role="dialog"]') || element.closest('.fixed')) return

        const originalOpacity = element.dataset.originalOpacity || '1'
        element.style.transition = `all 0.5s ease-out ${index * 0.002}s`
        element.style.opacity = originalOpacity
        element.style.filter = 'blur(0px)'
        element.style.transform = 'translateX(0)'

        // Nettoyer après l'animation
        setTimeout(() => {
          element.style.transition = ''
          element.style.filter = ''
          element.style.transform = ''
          delete element.dataset.originalOpacity
        }, 600)
      })

      setIsTransitioning(false)
      setPendingLocale(null)
    }, 100)
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

      <WaveTransitionSimple
        isTransitioning={isTransitioning}
        onComplete={handleTransitionComplete}
      />
    </>
  )
})