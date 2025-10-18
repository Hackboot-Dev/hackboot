'use client'

import React, { useState, useRef, useEffect, memo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Globe, ChevronDown, Loader2 } from 'lucide-react'

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'et', name: 'Eesti' },
]

export default memo(function LanguageSelectorSimplest() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const currentLocale = pathname.split('/')[1] || 'fr'
  const currentLang = languages.find((l) => l.code === currentLocale) || languages[0]

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
    setIsLoading(true)
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <div ref={dropdownRef} className="relative z-50">
      <button
        onClick={() => !isLoading && setIsOpen((open) => !open)}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl transition-all duration-300 ${
          isLoading ? 'opacity-70 cursor-wait' : 'hover:bg-white/20 hover:border-white/30'
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        ) : (
          <Globe className="w-4 h-4 text-white" />
        )}
        <span className="text-sm font-semibold text-white">{currentLang.code.toUpperCase()}</span>
        {!isLoading && (
          <ChevronDown
            className={`w-3 h-3 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {isOpen && !isLoading && (
        <div className="absolute top-full mt-2 right-0 w-48 bg-black/95 backdrop-blur-2xl border border-white/20 rounded-xl overflow-hidden shadow-xl shadow-black/50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-3 flex items-center gap-3 transition-colors duration-200 text-left ${
                currentLocale === lang.code ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-gray-200'
              }`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold">{lang.name}</p>
                <p className="text-xs text-gray-400">{lang.code.toUpperCase()}</p>
              </div>
              {currentLocale === lang.code && (
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
})
