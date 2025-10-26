'use client'

import { useEffect, useRef, useState } from 'react'
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const { ref: badgeRef, isVisible: badgeVisible } = useReveal<HTMLDivElement>({ threshold: 0.4 })
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLHeadingElement>({ threshold: 0.4 })
  const { ref: subtitleRef, isVisible: subtitleVisible } = useReveal<HTMLParagraphElement>({ threshold: 0.4 })

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const node = containerRef.current
    if (!node) {
      return
    }

    let frame = 0
    const updateProgress = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const maxDistance = rect.height + viewportHeight
      const distance = Math.min(Math.max(viewportHeight - rect.top, 0), maxDistance)
      const progress = distance / maxDistance
      setScrollProgress(Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 1) : 0)
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      if (frame) {
        cancelAnimationFrame(frame)
      }
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  const translateY = `${scrollProgress * 50 * -1}px`
  const heroOpacity = 1 - scrollProgress * 0.25
  const heroScale = 1 - scrollProgress * 0.05

  return (
    <div ref={containerRef} className="relative overflow-hidden min-h-[80vh] flex items-center">
      <div className="absolute inset-0">
        <div
          style={{
            transform: `translateY(${translateY})`,
            opacity: heroOpacity,
          }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.2)_0%,_transparent_60%)] transition-[transform,opacity] duration-500 ease-out"
        />
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl motion-safe:animate-[hero-glow-a_24s_linear_infinite] motion-reduce:hidden"
          style={{ transform: `scale(${heroScale})` }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl motion-safe:animate-[hero-glow-b_28s_linear_infinite] motion-reduce:hidden"
          style={{ transform: `scale(${heroScale})` }}
        />
      </div>

      <div
        className="container mx-auto px-6 py-24 relative z-10"
        style={{
          transform: `scale(${heroScale})`,
          transition: 'transform 400ms ease-out',
        }}
      >
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
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
              {title}
            </span>
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

          <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-700 ease-out ${
              isMounted ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full motion-safe:animate-[scroll-indicator_1.5s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
