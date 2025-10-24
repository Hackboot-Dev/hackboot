'use client'

import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
}

const PARTICLE_COLORS = [
  'rgba(139, 92, 246, 0.45)',
  'rgba(6, 182, 212, 0.45)',
  'rgba(16, 185, 129, 0.45)',
]

function createParticles(
  width: number,
  height: number,
  count: number,
): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    size: Math.random() * 2.2 + 0.8,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
  }))
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReducedMotion) {
      return
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const particleCount = isMobile ? 18 : 32
    const connectionThreshold = isMobile ? 110 : 150

    let dpr = window.devicePixelRatio || 1

    let particles = createParticles(
      canvas.width || window.innerWidth,
      canvas.height || window.innerHeight,
      particleCount,
    )

    let animationFrame = 0

    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = createParticles(window.innerWidth, window.innerHeight, particleCount)
    }

    resizeCanvas()

    const draw = () => {
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.restore()

      particles.forEach((particle, index) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x <= 0 || particle.x >= window.innerWidth) {
          particle.vx *= -1
        }
        if (particle.y <= 0 || particle.y >= window.innerHeight) {
          particle.vy *= -1
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex++) {
          const other = particles[otherIndex]
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.hypot(dx, dy)

          if (distance < connectionThreshold) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${
              0.12 * (1 - distance / connectionThreshold)
            })`
            ctx.lineWidth = 0.35 / dpr
            ctx.stroke()
          }
        }
      })

      animationFrame = requestAnimationFrame(draw)
    }

    animationFrame = requestAnimationFrame(draw)

    window.addEventListener('resize', resizeCanvas)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-25"
      style={{ zIndex: 0 }}
    />
  )
}
