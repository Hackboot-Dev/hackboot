'use client'

import React, { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
    }> = []

    // Créer des particules
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Mettre à jour et dessiner les particules
      particles.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Rebondir sur les bords
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Dessiner la particule
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(99, 102, 241, 0.3)'
        ctx.fill()

        // Connecter les particules proches
        particles.slice(i + 1).forEach(otherParticle => {
          const distance = Math.sqrt(
            (particle.x - otherParticle.x) ** 2 +
            (particle.y - otherParticle.y) ** 2
          )

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 150)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    // Démarrer seulement si pas de préférence pour réduire les animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion) {
      animate()
    }

    // Redimensionner le canvas
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-50"
        style={{ pointerEvents: 'none' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5" />
    </div>
  )
}