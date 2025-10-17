import gamingProductsData from '@/data/gaming-products.json'

export interface ProductVariant {
  id: string
  name: string
  tier: string
  gpu: string
  ram: string
  cpu: string
  description: string
  features: string[]
  protection: string
  updates: string
  pricing: {
    hourly: number
    monthly: number
  }
  sla: string
  support_level: string
  badges: string[]
  image: string
}

export interface GamingProduct {
  id: string
  slug: string
  name: string
  game: string
  category: string
  description: string
  longDescription: string
  variants: ProductVariant[]
  reviews: {
    average: number
    count: number
  }
  discount: {
    active: boolean
    percentage: number
    code: string
  }
  status: string
}

export const gamingProducts: GamingProduct[] = gamingProductsData as GamingProduct[]

export function getAllGamingProducts(): GamingProduct[] {
  return gamingProducts
}

export function getGamingProductBySlug(slug: string): GamingProduct | undefined {
  return gamingProducts.find(p => p.slug === slug)
}

export function getGamingProductsByGame(game: string): GamingProduct[] {
  return gamingProducts.filter(p => p.game === game)
}

export function getDiscountedGamingProducts(): GamingProduct[] {
  return gamingProducts.filter(p => p.discount.active)
}

export function getVariantById(product: GamingProduct, variantId: string): ProductVariant | undefined {
  return product.variants.find(v => v.id === variantId)
}

export function getDefaultVariant(product: GamingProduct): ProductVariant | undefined {
  return product.variants[0]
}
