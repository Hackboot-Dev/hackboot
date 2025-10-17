'use client'

import React, { useState, useRef, useEffect, memo } from 'react'
import { useI18n } from '@/lib/i18n-simple'
import { useRouter, usePathname } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'et', name: 'Eesti' },
]

export default memo(function LanguageSelector() {
  const { locale } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = languages.find((l) => l.code === locale) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (langCode: string) => {
    const newPath = pathname?.replace(/^\/(fr|en|et)(\/|$)/, `/${langCode}$2`) || `/${langCode}`
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative z-50">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 px-4 py-2 glass-effect rounded-lg hover:bg-white/10 transition-all"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-48 glass-effect rounded-lg overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors duration-200 ${
                locale === lang.code ? 'bg-white/5 text-white' : 'hover:bg-white/10 text-gray-200'
              }`}
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{lang.name}</p>
                <p className="text-xs text-gray-400">{lang.code.toUpperCase()}</p>
              </div>
              {locale === lang.code && <div className="w-2 h-2 bg-accent rounded-full" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
})
