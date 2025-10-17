'use client'

import React, { useState, useRef, useEffect, memo, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'et', name: 'Eesti' },
]

export default memo(function LanguageSelectorFast() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Extraire la locale de l'URL directement
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

    // Utiliser startTransition pour un changement fluide
    startTransition(() => {
      const newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`)
      router.push(newPath)
    })
  }

  return (
    <>
      <div ref={dropdownRef} className="relative z-50">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          disabled={isPending}
          className={`flex items-center gap-2 px-4 py-2 glass-effect rounded-lg hover:bg-white/10 transition-all ${
            isPending ? 'opacity-50 cursor-wait' : ''
          }`}
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {currentLang.code.toUpperCase()}
          </span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {isOpen && !isPending && (
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

      {/* Loader global pendant le changement */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-dark/90 backdrop-blur-md flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <motion.div
                  className="w-16 h-16 border-4 border-accent/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute top-0 left-0 w-16 h-16 border-4 border-accent border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <p className="text-sm text-gray-400">Chargement...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
})