'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import SiteHeader from '@/components/SiteHeader'

const HeroLight = dynamic(() => import('@/components/HeroLight'), {
  ssr: true,
  loading: () => <div className="min-h-screen flex items-center justify-center bg-dark" />
})

const StatsBar = dynamic(
  () => import('@/components/StatsBar'),
  {
    loading: () => <div className="h-32 bg-dark animate-pulse" />,
    ssr: false
  }
)

const InteractiveGamesCarousel = dynamic(
  () => import('@/components/InteractiveGamesCarousel'),
  {
    loading: () => <div className="h-96 bg-dark animate-pulse" />,
    ssr: false
  }
)

const UnifiedFeaturesSection = dynamic(
  () => import('@/components/UnifiedFeaturesSection'),
  {
    loading: () => <div className="min-h-[60vh] bg-dark animate-pulse" />,
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

const ProductsSection = dynamic(
  () => import('@/components/ProductsSection'),
  {
    loading: () => <div className="min-h-[50vh] bg-dark animate-pulse" />,
    ssr: false
  }
)

const PremiumPlansSection = dynamic(
  () => import('@/components/PremiumPlansSection'),
  {
    loading: () => <div className="min-h-[60vh] bg-dark animate-pulse" />,
    ssr: false
  }
)

const SocialProofSection = dynamic(
  () => import('@/components/SocialProofSection'),
  {
    loading: () => <div className="min-h-[60vh] bg-dark animate-pulse" />,
    ssr: false
  }
)

const FAQSection = dynamic(
  () => import('@/components/FAQSection'),
  {
    loading: () => <div className="min-h-[60vh] bg-dark animate-pulse" />,
    ssr: false
  }
)

const FinalCTASection = dynamic(
  () => import('@/components/FinalCTASection'),
  {
    loading: () => <div className="min-h-[40vh] bg-dark animate-pulse" />,
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
    <main className="relative animate-fade-in">
      <SiteHeader />

      <Suspense fallback={<div className="min-h-screen" />}>
        <div className="animate-scale-in">
          <HeroLight />
        </div>
      </Suspense>

      <Suspense fallback={<div className="h-32 bg-dark" />}>
        <div className="animate-fade-in">
          <StatsBar />
        </div>
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-dark" />}>
        <div className="animate-fade-in">
          <InteractiveGamesCarousel />
        </div>
      </Suspense>

      <Suspense fallback={<div className="min-h-[60vh] bg-dark" />}>
        <div className="animate-slide-up">
          <UnifiedFeaturesSection />
        </div>
      </Suspense>

      <Suspense fallback={<div className="min-h-[50vh] bg-dark" />}>
        <div className="animate-scale-in">
          <InteractiveCards />
        </div>
      </Suspense>

      <Suspense fallback={<div className="min-h-[50vh] bg-dark" />}>
        <div className="animate-slide-up">
          <ProductsSection />
        </div>
      </Suspense>

      <Suspense fallback={<div className="min-h-[60vh] bg-dark" />}>
        <div className="animate-scale-in">
          <PremiumPlansSection />
        </div>
      </Suspense>

      <Suspense fallback={<div className="min-h-[60vh] bg-dark" />}>
        <div className="animate-fade-in">
          <SocialProofSection />
        </div>
      </Suspense>

      <Suspense fallback={<div className="min-h-[60vh] bg-dark" />}>
        <div className="animate-slide-up">
          <FAQSection />
        </div>
      </Suspense>

      <Suspense fallback={<div className="min-h-[40vh] bg-dark" />}>
        <div className="animate-scale-in">
          <FinalCTASection />
        </div>
      </Suspense>

      <Suspense fallback={<div className="h-32 bg-dark" />}>
        <div className="animate-fade-in">
          <Footer />
        </div>
      </Suspense>
    </main>
  )
}