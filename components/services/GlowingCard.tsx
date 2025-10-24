'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

interface GlowingCardProps {
  icon: LucideIcon
  gradient: string
  title: string
  description: string
  link: string
  linkLabel: string
}

export default function GlowingCard({
  icon: Icon,
  gradient,
  title,
  description,
  link,
  linkLabel,
}: GlowingCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const [isInteractive, setIsInteractive] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setIsInteractive(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const glowBackground = isInteractive
    ? `radial-gradient(520px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.16), transparent 45%)`
    : 'radial-gradient(520px circle at 50% 50%, rgba(139, 92, 246, 0.12), transparent 55%)'

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={isInteractive ? handleMouseMove : undefined}
      className="relative glass-effect rounded-2xl p-8 border border-white/10 group overflow-hidden"
      whileHover={isInteractive ? { scale: 1.015 } : undefined}
      whileTap={!isInteractive ? { scale: 0.99 } : undefined}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {/* Glowing effect */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
          isInteractive ? 'opacity-0 group-hover:opacity-100' : 'opacity-70'
        }`}
        style={{ background: glowBackground }}
      />

      <div className="relative z-10">
        <motion.div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6`}
          whileHover={isInteractive ? { rotate: 18, scale: 1.05 } : undefined}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        <h3 className="text-2xl font-black mb-3 text-white">{title}</h3>
        <p className="text-gray-400 mb-6 leading-relaxed">{description}</p>

        <Link
          href={link}
          className="inline-flex items-center gap-2 text-purple-400 font-semibold hover:text-purple-300 transition-colors group/link"
        >
          {linkLabel}
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}
