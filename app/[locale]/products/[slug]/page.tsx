import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NativeGamingProductPage from '@/components/NativeGamingProductPage'
import CommunityGamingProductPage from '@/components/CommunityGamingProductPage'
import { getGamingProductBySlug, getAllGamingProducts } from '@/lib/gaming-products'

interface Props {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export async function generateStaticParams() {
  const products = getAllGamingProducts()
  const locales = ['fr', 'en', 'et']

  return locales.flatMap(locale =>
    products.map(product => ({
      locale,
      slug: product.slug
    }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const product = getGamingProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found - Hackboot',
      description: 'The requested product was not found.'
    }
  }

  // Generate SEO-optimized keywords (avoid "cheat" for Google)
  const seoKeywords = [
    product.name,
    product.game,
    `${product.game} cloud gaming`,
    'cloud gaming VM',
    'gaming performance',
    'high FPS gaming',
    product.variants[0]?.gpu || 'RTX 4090',
    'gaming optimization',
    'competitive gaming',
    ...product.variants.slice(0, 2).map(v => v.tier),
  ].filter(Boolean)

  // Optimize title for SEO (60 chars max)
  const seoTitle = `${product.name} Cloud Gaming | ${product.game} | Hackboot`

  // Optimize description (150-160 chars for best SERP display)
  const seoDescription = `${product.description.slice(0, 140)}... ${product.variants[0]?.gpu} VM, optimized for competitive ${product.game} gaming.`

  // Dynamic locale mapping
  const localeMap: Record<string, string> = {
    'fr': 'fr_FR',
    'en': 'en_US',
    'et': 'et_EE'
  }

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords.join(', '),
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [
        {
          url: product.variants[0]?.image || '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${product.name} - ${product.game} Cloud Gaming`
        }
      ],
      type: 'website',
      siteName: 'Hackboot',
      locale: localeMap[locale] || 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [product.variants[0]?.image || '/og-image.png'],
      creator: '@hackboot',
    },
    alternates: {
      canonical: `https://hackboot.com/${locale}/products/${slug}`,
      languages: {
        'fr': `https://hackboot.com/fr/products/${slug}`,
        'en': `https://hackboot.com/en/products/${slug}`,
        'et': `https://hackboot.com/et/products/${slug}`
      }
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    }
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const product = getGamingProductBySlug(slug)

  if (!product) {
    notFound()
  }

  if (product.optimizationLevel === 'native') {
    return <NativeGamingProductPage product={product} />
  }

  return <CommunityGamingProductPage product={product} />
}