import nativeProductsData from '@/data/gaming-products.json'
import communityProductsData from '@/data/gaming-products-community.json'

export interface ProductVariant {
  id: string
  name: string
  tier: string
  gpu: string
  ram: string
  cpu: string
  storage?: string
  motherboard?: string
  psu?: string
  cooling?: string
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
  optimizationLevel: 'native' | 'community'
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
  gallery?: string[]
  gfnData?: {
    playType: string
    minimumTier: string
    stores: string[]
    iconUrl: string
    logoUrl: string
  }
  technicalSpecs?: {
    performanceMetrics?: {
      avgFps: number
      minFps: number
      maxFps: number
      onePercentLow?: number
      latency: number
      inputLag: number
      frameTime: number
      cpuUsage: number
      gpuUsage: number
      ramUsage: number
      vramUsage: number
      powerDraw: number
      thermalCpu: number
      thermalGpu: number
    }
    augmentationSuite?: {
      awarenessIndex: number
      overlayRefresh: number
      adaptiveCoaching: number
      reactionTimeMs: number
      moduleCoverage: number
      tacticalFocus: number
      modules: string[]
      notes?: string
    }
    aimbotStats?: {
      predictionAccuracy: number
      smoothness: number
      fov: number
      targetSwitchTime: number
      headShotRate: number
      reactionTime: number
      boneSelection: string[]
      weaponSupport: number
    }
    fpsByResolution?: Array<{
      resolution: string
      avgFps: number
      minFps: number
      maxFps: number
      playability: string
      bottleneck: string
    }>
    qualityBreakdown?: Array<{
      resolution: string
      presets: {
        low: number
        medium: number
        high: number
        ultra: number
      }
    }>
    fpsThresholds?: Array<{
      resolution: string
      above30: number
      above60: number
      above90: number
      above120: number
      above144: number
    }>
    improvementTips?: string[]
    advice?: string
    heroSynergy?: Array<{
      hero: string
      overlayFocus: number
      clarityBoost: number
      preset: string
      trainingBoost: string
    }>
    espCapabilities?: {
      maxDistance: number
      updateRate: number
      playerTracking: boolean
      healthBars: boolean
      ultimateTracking: boolean
      abilityTracking: boolean
      distanceIndicators: boolean
      snapLines: boolean
      boxESP: boolean
      skeletonESP: boolean
      nameESP: boolean
      rankESP: boolean
    }
    securityMetrics?: {
      detectionRate: number
      banRate: number
      uptimePercentage: number
      avgResponseTime: number
      incidentsLastMonth: number
      securityUpdatesPerWeek: number
      encryptionLevel: string
      obfuscationLayers: number
      antiDebug: boolean
      antiVM: boolean
      kernelProtection: boolean
    }
    networkStats?: {
      serverLocations: number
      avgPing: number
      maxBandwidth: number
      packetLoss: number
      jitter: number
      ddosProtection: boolean
      encryption: string
    }
    compatibilityMatrix?: Array<{
      hero: string
      effectiveness: number
      headShotRate: number
      kda: number
      winRate: number
    }>
    updateHistory?: {
      totalUpdates: number
      lastUpdateDate: string
      avgUpdatesPerMonth: number
      criticalPatches: number
      securityPatches: number
      featureUpdates: number
      bugFixes: number
    }
    userStats?: {
      totalUsers: number
      activeUsersLast30Days: number
      avgSessionDuration: number
      avgGamesPerDay: number
      satisfactionScore: number
      recommendationRate: number
    }
  }
}

export const gamingProducts: GamingProduct[] = [
  ...(nativeProductsData as GamingProduct[]),
  ...(communityProductsData as GamingProduct[])
]

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
