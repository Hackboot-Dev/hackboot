'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Hero = dynamic(() => import('@/components/Hero'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>
})

const ParallaxSectionI18n = dynamic(() => import('@/components/ParallaxSectionI18n'))
const InteractiveCards = dynamic(() => import('@/components/InteractiveCards'))
const InfiniteScroll = dynamic(() => import('@/components/InfiniteScroll'))
const ProductsSection = dynamic(() => import('@/components/ProductsSection'))
const Footer = dynamic(() => import('@/components/Footer'))

export default function Home() {
  return (
    <main className="relative">
      <Suspense fallback={<div className="min-h-screen" />}>
        <Hero />
      </Suspense>

      <ParallaxSectionI18n
        sectionKey="gaming"
        imageUrl="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
      />

      <InteractiveCards />

      <ParallaxSectionI18n
        sectionKey="security"
        imageUrl="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop"
        reverse
      />

      <InfiniteScroll />

      <ProductsSection />

      <ParallaxSectionI18n
        sectionKey="cloud"
        imageUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"
      />

      <Footer />
    </main>
  )
}