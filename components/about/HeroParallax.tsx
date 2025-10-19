'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

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
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  return (
    <div ref={containerRef} className="relative overflow-hidden min-h-[80vh] flex items-center">
      {/* Background effects */}
      <div className="absolute inset-0">
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.2)_0%,_transparent_60%)]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ scale }}
        className="container mx-auto px-6 py-24 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full mb-6"
          >
            <span className="text-sm font-medium text-purple-300">{badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6"
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
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
