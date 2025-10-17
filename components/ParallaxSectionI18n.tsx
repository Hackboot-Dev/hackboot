'use client'

import React, { useRef, memo } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useI18n } from '@/lib/i18n-simple'

interface ParallaxSectionProps {
  sectionKey: 'gaming' | 'security' | 'cloud'
  imageUrl: string
  reverse?: boolean
}

export default memo(function ParallaxSectionI18n({
  sectionKey,
  imageUrl,
  reverse = false
}: ParallaxSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const { t } = useI18n()
  const section = t.sections[sectionKey]

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  return (
    <motion.section
      ref={containerRef}
      className="min-h-screen flex items-center py-20 px-4"
      style={{ opacity }}
    >
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
            reverse ? 'lg:flex-row-reverse' : ''
          }`}
          style={{ scale }}
        >
          <motion.div className={`space-y-6 ${reverse ? 'lg:order-2' : ''}`}>
            <motion.div
              initial={{ opacity: 0, x: reverse ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium tracking-wider">
                {section.subtitle}
              </span>
              <h2 className="text-5xl md:text-7xl font-display font-bold mt-2 mb-6">
                {section.title}
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-300 leading-relaxed"
            >
              {section.description}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-accent text-white rounded-full hover:bg-accent/80 transition-all"
            >
              {t.hero.getStarted}
            </motion.button>
          </motion.div>

          <motion.div
            className={`relative ${reverse ? 'lg:order-1' : ''}`}
            style={{ y }}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-effect">
              <Image
                src={imageUrl}
                alt={section.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                quality={75}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-500/20 mix-blend-overlay" />
            </div>

            <motion.div
              className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
})