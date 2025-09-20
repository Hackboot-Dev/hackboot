'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import frTranslations from '@/public/locales/fr/common.json'
import enTranslations from '@/public/locales/en/common.json'
import etTranslations from '@/public/locales/et/common.json'

type Locale = 'fr' | 'en' | 'et'
type Translations = typeof frTranslations

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const translations: Record<Locale, Translations> = {
  fr: frTranslations,
  en: enTranslations,
  et: etTranslations,
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({
  children,
  initialLocale = 'fr'
}: {
  children: ReactNode
  initialLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Get locale from URL
    const urlLocale = pathname.split('/')[1] as Locale
    if (urlLocale && ['fr', 'en', 'et'].includes(urlLocale)) {
      setLocaleState(urlLocale)
    }
  }, [pathname])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    // Navigate to new locale URL
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`)
    router.push(newPathname)
  }

  const t = translations[locale]

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}