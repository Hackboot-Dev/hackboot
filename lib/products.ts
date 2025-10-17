import productsData from '@/data/products-enhanced.json'

export interface Product {
  id: string
  slug: string
  name: string
  category: string
  price: string
  currency: string
  usage: string
  description: string
  longDescription: string
  use_cases: string[]
  features: string[]
  specifications: {
    compatibility: string
    ram: string
    storage: string
    processor: string
    network: string
  }
  target_audience: string
  highlight: string
  images: {
    main: string
    gallery: string[]
  }
  videos: {
    demo: string
    tutorial: string
  }
  reviews: {
    average: number
    count: number
    testimonials: {
      author: string
      rating: number
      comment: string
    }[]
  }
  seo: {
    title: string
    metaDescription: string
    keywords: string[]
    ogImage: string
    canonical: string
  }
  pricing: {
    monthly: string
    quarterly: string
    yearly: string
    lifetime: string
  }
  badges: string[]
  stock: boolean
  discount: {
    active: boolean
    percentage: number
    code: string
  }
}

export type Products = Record<string, Product>

export const products: Products = productsData as Products

export function getAllProducts(): Product[] {
  return Object.values(products)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products[slug]
}

export function getProductsByCategory(category: string): Product[] {
  return Object.values(products).filter(p => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return Object.values(products).filter(p => p.badges.includes('Best Seller') || p.badges.includes('Populaire'))
}

export function getDiscountedProducts(): Product[] {
  return Object.values(products).filter(p => p.discount.active)
}