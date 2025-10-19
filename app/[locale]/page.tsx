'use client'

import dynamic from 'next/dynamic'
import { Suspense, lazy } from 'react'
import SiteHeader from '@/components/SiteHeader'

// Hero léger par défaut, 3D optionnelle
const HeroLight = dynamic(() => import('@/components/HeroLight'), {
  ssr: true,
  loading: () => <div className="min-h-screen flex items-center justify-center bg-dark" />
})

// Version 3D à charger seulement si demandé
const Hero3D = dynamic(() => import('@/components/Hero'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center bg-dark" />
})

// Lazy loading avec intersection observer
const ParallaxSectionI18n = dynamic(
  () => import('@/components/ParallaxSectionI18n'),
  {
    loading: () => <div className="min-h-[50vh] bg-dark animate-pulse" />,
    ssr: false
  }
)

const InteractiveCards = dynamic(
  () => import('@/components/InteractiveCards'),
  {
    loading: () => <div className="min-h-[50vh] bg-dark animate-pulse" />,
    ssr: false
  }
)

const InfiniteScroll = dynamic(
  () => import('@/components/InfiniteScroll'),
  {
    loading: () => <div className="h-32 bg-dark" />,
    ssr: false
  }
)

const ProductsSection = dynamic(
  () => import('@/components/ProductsSection'),
  {
    loading: () => <div className="min-h-[50vh] bg-dark animate-pulse" />,
    ssr: false
  }
)

const Footer = dynamic(
  () => import('@/components/Footer'),
  {
    loading: () => <div className="h-32 bg-dark" />,
    ssr: false
  }
)

export default function Home() {
  return (
    <main className="relative">
      <SiteHeader />

      <Suspense fallback={<div className="min-h-screen" />}>
        <HeroLight />
      </Suspense>

      <Suspense fallback={<div className="min-h-[50vh] bg-dark" />}>
        <ParallaxSectionI18n
          sectionKey="gaming"
          imageUrl="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
        />
      </Suspense>

      <Suspense fallback={<div className="min-h-[50vh] bg-dark" />}>
        <InteractiveCards />
      </Suspense>

      <Suspense fallback={<div className="min-h-[50vh] bg-dark" />}>
        <ParallaxSectionI18n
          sectionKey="security"
          imageUrl="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop"
          reverse
        />
      </Suspense>

      <Suspense fallback={<div className="h-32 bg-dark" />}>
        <InfiniteScroll />
      </Suspense>

      <Suspense fallback={<div className="min-h-[50vh] bg-dark" />}>
        <ProductsSection />
      </Suspense>

      <Suspense fallback={<div className="min-h-[50vh] bg-dark" />}>
        <ParallaxSectionI18n
          sectionKey="cloud"
          imageUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"
        />
      </Suspense>

      <Suspense fallback={<div className="h-32 bg-dark" />}>
        <Footer />
      </Suspense>
    </main>
  )
}