import { I18nProvider } from '@/lib/i18n-simple'

export async function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }, { locale: 'et' }]
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <I18nProvider initialLocale={locale as 'fr' | 'en' | 'et'}>
      {children}
    </I18nProvider>
  )
}