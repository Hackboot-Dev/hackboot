'use client'

import React, { useRef, useEffect, memo } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n-simple'

const technologies = [
  'Valorant', 'Fortnite', 'Call of Duty', 'Apex Legends', 'CS2',
  'League of Legends', 'Overwatch 2', 'Rainbow Six', 'Warzone',
  'PUBG', 'Rocket League', 'GTA V', 'FIFA 24', 'Minecraft',
]

export default memo(function InfiniteScroll() {
  const { t } = useI18n()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const scrollContent = scrollContainer.querySelector('.scroll-content') as HTMLElement
    if (!scrollContent) return

    const clone = scrollContent.cloneNode(true) as HTMLElement
    scrollContainer.appendChild(clone)

    let scrollPos = 0
    let animationId: number

    const scroll = () => {
      scrollPos += 0.5  // Réduit la vitesse de défilement
      if (scrollPos >= scrollContent.offsetWidth) {
        scrollPos = 0
      }
      scrollContainer.scrollLeft = scrollPos
      animationId = requestAnimationFrame(scroll)
    }

    // Démarrer seulement si l'utilisateur préfère les animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(scroll)
    }
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <section className="py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
          {t.games.title}
        </h2>
        <p className="text-gray-400">{t.games.subtitle}</p>
      </motion.div>

      <div
        ref={scrollRef}
        className="relative flex overflow-x-hidden scrollbar-hide"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      >
        <div className="scroll-content flex gap-8 pr-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex-shrink-0"
            >
              <div className="px-8 py-4 glass-effect rounded-full whitespace-nowrap hover:bg-white/10 transition-all cursor-pointer">
                <span className="text-lg font-medium">{tech}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})