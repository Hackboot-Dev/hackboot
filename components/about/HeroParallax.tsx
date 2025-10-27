'use client'

import { useEffect, useState } from 'react'
import { useReveal } from '@/lib/hooks/useReveal'

interface HeroParallaxProps {
  badge: string
  title: string
  subtitle: string
  highlight?: string
}

export default function HeroParallax({
  badge,
  title,
  subtitle,
  highlight,
}: HeroParallaxProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { ref: badgeRef, isVisible: badgeVisible } = useReveal<HTMLDivElement>({ threshold: 0.4 })
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLHeadingElement>({ threshold: 0.4 })
  const { ref: subtitleRef, isVisible: subtitleVisible } = useReveal<HTMLParagraphElement>({ threshold: 0.4 })

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="relative overflow-hidden min-h-[70vh] flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18)_0%,_transparent_65%)]" />
      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div
            ref={badgeRef}
            style={{ transitionDelay: isMounted ? '100ms' : '0ms' }}
            className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full mb-6 transition-all duration-700 ease-out ${
              badgeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="text-sm font-medium text-purple-300">{badge}</span>
          </div>

          <h1
            ref={titleRef}
            style={{ transitionDelay: isMounted ? '200ms' : '0ms' }}
            className={`text-5xl md:text-7xl lg:text-8xl font-black mb-6 transition-all duration-700 ease-out ${
              titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">{title}</span>
            {highlight && (
              <>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">
                  {highlight}
                </span>
              </>
            )}
          </h1>

          <p
            ref={subtitleRef}
            style={{ transitionDelay: isMounted ? '300ms' : '0ms' }}
            className={`text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed transition-all duration-700 ease-out ${
              subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}
