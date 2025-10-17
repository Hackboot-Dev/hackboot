import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import GamingProductPage from '@/components/GamingProductPage'
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
  const { slug } = await params
  const product = getGamingProductBySlug(slug)

  if (!product) {
    return {
      title: 'Produit non trouvé - HACKBOOT',
      description: 'Le produit demandé n\'a pas été trouvé.'
    }
  }

  return {
    title: `${product.name} - HACKBOOT Gaming`,
    description: product.description,
    keywords: [product.name, product.game, 'gaming', 'cheat', ...product.variants.map(v => v.name)],
    openGraph: {
      title: `${product.name} - HACKBOOT Gaming`,
      description: product.description,
      images: [
        {
          url: product.variants[0].image,
          width: 1200,
          height: 630,
          alt: product.name
        }
      ],
      type: 'website',
      siteName: 'HACKBOOT',
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - HACKBOOT Gaming`,
      description: product.description,
      images: [product.variants[0].image],
    },
    alternates: {
      canonical: `https://hackboot.com/fr/products/${slug}`,
      languages: {
        'fr': `/fr/products/${slug}`,
        'en': `/en/products/${slug}`,
        'et': `/et/products/${slug}`
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

  return <GamingProductPage product={product} />
}