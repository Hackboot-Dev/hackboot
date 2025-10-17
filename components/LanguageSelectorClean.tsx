'use client'

import React, { useState, useRef, useEffect, memo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Globe, ChevronDown, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'et', name: 'Eesti' },
]

export default memo(function LanguageSelectorClean() {
  const [isOpen, setIsOpen] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const [selectedLang, setSelectedLang] = useState<string | null>(null)
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

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === currentLocale || isChanging) {
      setIsOpen(false)
      return
    }

    // Fermer le menu immédiatement
    setIsOpen(false)
    setIsChanging(true)
    setSelectedLang(newLocale)

    // Créer un overlay avec loader
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      background-color: rgb(17, 24, 39);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    `

    const loaderContainer = document.createElement('div')
    loaderContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    `

    // Loader animé
    const loader = document.createElement('div')
    loader.style.cssText = `
      width: 48px;
      height: 48px;
      border: 4px solid rgba(99, 102, 241, 0.2);
      border-top-color: rgb(99, 102, 241);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `

    // Texte du loader
    const loadingText = document.createElement('div')
    loadingText.style.cssText = `
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      font-weight: 500;
    `
    loadingText.textContent = 'Changement de langue...'

    // Animation CSS
    const style = document.createElement('style')
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)

    loaderContainer.appendChild(loader)
    loaderContainer.appendChild(loadingText)
    overlay.appendChild(loaderContainer)
    document.body.appendChild(overlay)

    // Fade in
    requestAnimationFrame(() => {
      overlay.style.opacity = '1'
    })

    // Attendre un peu pour montrer le loader
    await new Promise(resolve => setTimeout(resolve, 500))

    // Naviguer
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`)
    router.push(newPath)

    // Attendre que la navigation soit terminée
    await new Promise(resolve => setTimeout(resolve, 300))

    // Fade out et nettoyer
    overlay.style.opacity = '0'
    setTimeout(() => {
      overlay.remove()
      style.remove()
      setIsChanging(false)
      setSelectedLang(null)
    }, 300)
  }

  return (
    <div ref={dropdownRef} className="relative z-50">
      <motion.button
        whileHover={{ scale: isChanging ? 1 : 1.02 }}
        whileTap={{ scale: isChanging ? 1 : 0.98 }}
        onClick={() => !isChanging && setIsOpen(!isOpen)}
        disabled={isChanging}
        className={`flex items-center gap-2 px-4 py-2 glass-effect rounded-lg transition-all ${
          isChanging ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
        }`}
      >
        {isChanging ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Globe className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {selectedLang || currentLang.code.toUpperCase()}
        </span>
        {!isChanging && (
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && !isChanging && (
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
  )
})