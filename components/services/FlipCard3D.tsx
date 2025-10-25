'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { animated, useSpring } from '@react-spring/web'
import type { LucideIcon } from 'lucide-react'
import { CheckCircle2 } from 'lucide-react'

interface FlipCard3DProps {
  icon: LucideIcon
  gradient: string
  iconColor: string
  title: string
  description: string
  bullets: string[]
  stats: { label: string; value: string }[]
  highlights: string[]
}

export default function FlipCard3D({
  icon: Icon,
  gradient,
  iconColor,
  title,
  description,
  bullets,
  stats,
  highlights,
}: FlipCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isInteractive, setIsInteractive] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const [spring, api] = useSpring(() => ({
    rotate: 0,
    config: { tension: 520, friction: 40, precision: 0.01 },
  }))

  useEffect(() => {
    if (typeof window === 'undefined') return
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setIsInteractive(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const target = isFlipped && !prefersReducedMotion ? 180 : 0
    api.start({ rotate: target, immediate: prefersReducedMotion })
  }, [api, isFlipped, prefersReducedMotion])

  const handlePointerEnter = () => {
    if (isInteractive) {
      setIsFlipped(true)
    }
  }

  const handlePointerLeave = () => {
    if (isInteractive) {
      setIsFlipped(false)
    }
  }

  const handleToggle = () => {
    if (!isInteractive) {
      setIsFlipped((prev) => !prev)
    }
  }

  return (
    <div
      className={`relative perspective-1000 ${
        isInteractive ? 'h-[420px]' : 'min-h-[420px]'
      }`}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onClick={handleToggle}
      onKeyDown={(event) => {
        if (!isInteractive && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          handleToggle()
        }
      }}
      role={isInteractive ? undefined : 'button'}
      aria-pressed={isInteractive ? undefined : isFlipped}
      tabIndex={isInteractive ? -1 : 0}
    >
      <animated.div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          transform: spring.rotate.to((angle) => `perspective(1400px) rotateY(${angle}deg)`),
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden glass-effect rounded-2xl p-6 border border-white/10"
          style={{
            backfaceVisibility: 'hidden',
            pointerEvents: isFlipped ? 'none' : 'auto',
          }}
        >
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>

          <h3 className={`text-2xl font-black mb-2 ${iconColor}`}>{title}</h3>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">{description}</p>

          <ul className="space-y-2 text-left">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                <CheckCircle2
                  className={`w-4 h-4 ${iconColor} flex-shrink-0 mt-0.5`}
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-xs text-gray-500 text-center">
            {isInteractive ? 'Survolez pour voir plus' : 'Touchez pour explorer'}
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden glass-effect rounded-2xl p-6 border border-white/10"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            pointerEvents: isFlipped ? 'auto' : 'none',
          }}
        >
          <h4 className={`text-xl font-black mb-4 ${iconColor}`}>Statistiques</h4>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/5 rounded-lg p-3 text-center border border-white/10"
              >
                <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
                <div className={`text-lg font-black ${iconColor}`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <h4 className={`text-sm font-bold mb-2 ${iconColor}`}>
            Fonctionnalités
          </h4>
          <div className="space-y-1 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
            {highlights.slice(0, 6).map((highlight, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-gray-300"
              >
                <div className={`w-1.5 h-1.5 rounded-full ${iconColor.replace('text-', 'bg-')}`} />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </animated.div>
    </div>
  )
}
