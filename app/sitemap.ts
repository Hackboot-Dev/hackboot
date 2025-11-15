import { MetadataRoute } from 'next'
import { getAllGamingProducts } from '@/lib/gaming-products'
import careersData from '@/data/careers.json'

const BASE_URL = 'https://hackboot.com'
const LOCALES = ['fr', 'en', 'et'] as const
const DEFAULT_LOCALE = 'fr'

type Locale = typeof LOCALES[number]

interface SitemapEntry {
  url: string
  lastModified?: Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

const STATIC_PAGES = [
  { path: '', priority: 1.0, changeFreq: 'daily' as const },
  { path: 'services', priority: 0.9, changeFreq: 'weekly' as const },
  { path: 'products', priority: 0.9, changeFreq: 'daily' as const },
  { path: 'about', priority: 0.8, changeFreq: 'monthly' as const },
  { path: 'contact', priority: 0.8, changeFreq: 'monthly' as const },
  { path: 'games', priority: 0.8, changeFreq: 'weekly' as const },
  { path: 'premium', priority: 0.9, changeFreq: 'weekly' as const },
  { path: 'premium/signup', priority: 0.7, changeFreq: 'monthly' as const },
  { path: 'api', priority: 0.7, changeFreq: 'monthly' as const },
  { path: 'documentation', priority: 0.7, changeFreq: 'weekly' as const },
  { path: 'support', priority: 0.7, changeFreq: 'monthly' as const },
  { path: 'careers', priority: 0.7, changeFreq: 'weekly' as const },
  { path: 'careers/apply', priority: 0.6, changeFreq: 'monthly' as const },
  { path: 'status', priority: 0.5, changeFreq: 'daily' as const },
  { path: 'login', priority: 0.4, changeFreq: 'yearly' as const },
  { path: 'forgot-password', priority: 0.3, changeFreq: 'yearly' as const },
  { path: 'legal/privacy', priority: 0.5, changeFreq: 'yearly' as const },
  { path: 'legal/compliance', priority: 0.5, changeFreq: 'yearly' as const },
  { path: 'legal/cookies', priority: 0.5, changeFreq: 'yearly' as const },
  { path: 'legal/terms', priority: 0.5, changeFreq: 'yearly' as const },
]

function generateLocalizedUrls(
  path: string,
  priority: number,
  changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
): SitemapEntry[] {
  return LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}${path ? `/${path}` : ''}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: SitemapEntry[] = []

  // Add static pages for all locales
  STATIC_PAGES.forEach(({ path, priority, changeFreq }) => {
    entries.push(...generateLocalizedUrls(path, priority, changeFreq))
  })

  // Add dynamic product pages
  try {
    const products = getAllGamingProducts()
    products.forEach((product) => {
      entries.push(
        ...generateLocalizedUrls(`products/${product.slug}`, 0.8, 'weekly')
      )
    })
  } catch (error) {
    console.error('Error loading gaming products for sitemap:', error)
  }

  // Add dynamic career pages
  try {
    const careers = careersData as Array<{ id: string; slug: string }>
    careers.forEach((career) => {
      entries.push(
        ...generateLocalizedUrls(`careers/${career.slug}`, 0.6, 'monthly')
      )
    })
  } catch (error) {
    console.error('Error loading careers for sitemap:', error)
  }

  return entries
}
