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

export default memo(function LanguageSelectorInstant() {
  const [isOpen, setIsOpen] = useState(false)
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

    // Créer un overlay opaque immédiatement
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 z-[9999] bg-dark'
    overlay.style.opacity = '1'
    document.body.appendChild(overlay)

    // Créer l'élément de vague sur l'overlay
    const waveContainer = document.createElement('div')
    waveContainer.className = 'fixed inset-0 z-[10000] pointer-events-none'
    waveContainer.innerHTML = `
      <div class="wave-transition" style="
        position: fixed;
        inset: 0;
        width: 200%;
        height: 100%;
        background: linear-gradient(90deg,
          transparent 0%,
          rgba(99, 102, 241, 0.4) 25%,
          rgba(99, 102, 241, 1) 50%,
          rgba(99, 102, 241, 0.4) 75%,
          transparent 100%);
        transform: translateX(-100%);
        animation: waveSlide 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
      ">
      </div>
      <style>
        @keyframes waveSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      </style>
    `
    document.body.appendChild(waveContainer)

    // Naviguer juste avant la fin de l'animation
    setTimeout(() => {
      const newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`)
      router.push(newPath)
    }, 450)

    // Nettoyer après l'animation
    setTimeout(() => {
      overlay.remove()
      waveContainer.remove()
    }, 550)
  }

  return (
    <div ref={dropdownRef} className="relative z-50">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 glass-effect rounded-lg hover:bg-white/10 transition-all"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {currentLang.code.toUpperCase()}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
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