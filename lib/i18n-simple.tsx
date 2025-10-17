'use client'

import { createContext, useContext, ReactNode, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import frTranslations from '@/public/locales/fr/common.json'
import enTranslations from '@/public/locales/en/common.json'
import etTranslations from '@/public/locales/et/common.json'

type Locale = 'fr' | 'en' | 'et'
type Translations = typeof frTranslations

interface I18nContextType {
  locale: Locale
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
  const pathname = usePathname()

  // Obtenir la locale depuis l'URL
  const locale = useMemo(() => {
    const urlLocale = pathname?.split('/')[1] as Locale
    return ['fr', 'en', 'et'].includes(urlLocale) ? urlLocale : initialLocale
  }, [pathname, initialLocale])

  const t = translations[locale]

  const value = useMemo(
    () => ({ locale, t }),
    [locale, t]
  )

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (context === undefined) {
    // Retourner les traductions par défaut si pas de contexte
    return {
      locale: 'fr' as Locale,
      t: frTranslations as Translations
    }
  }
  return context
}

// Hook pour obtenir les traductions par locale sans contexte
export function getTranslations(locale: Locale = 'fr'): Translations {
  return translations[locale] || frTranslations
}