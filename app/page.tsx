'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Hero = dynamic(() => import('@/components/Hero'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>
})

const ParallaxSection = dynamic(() => import('@/components/ParallaxSection'))
const InteractiveCards = dynamic(() => import('@/components/InteractiveCards'))
const InfiniteScroll = dynamic(() => import('@/components/InfiniteScroll'))
const Footer = dynamic(() => import('@/components/Footer'))

export default function Home() {
  return (
    <main className="relative">
      <Suspense fallback={<div className="min-h-screen" />}>
        <Hero />
      </Suspense>

      <ParallaxSection
        title="Digital Innovation"
        subtitle="TRANSFORMING IDEAS"
        description="We blend creativity with technology to build experiences that captivate audiences and drive results. Our approach combines strategic thinking with flawless execution to deliver solutions that stand out in the digital landscape."
        imageUrl="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
      />

      <InteractiveCards />

      <ParallaxSection
        title="Creative Excellence"
        subtitle="DESIGN THAT MATTERS"
        description="Every pixel is crafted with purpose. We create visual experiences that not only look stunning but also serve a strategic purpose, ensuring your brand message resonates with your audience."
        imageUrl="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop"
        reverse
      />

      <InfiniteScroll />

      <ParallaxSection
        title="Future Forward"
        subtitle="NEXT GENERATION"
        description="Stay ahead of the curve with solutions built for tomorrow. We leverage emerging technologies and innovative approaches to ensure your digital presence remains cutting-edge and impactful."
        imageUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"
      />

      <Footer />
    </main>
  )
}