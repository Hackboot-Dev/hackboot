'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

interface ParallaxSectionProps {
  title: string
  subtitle: string
  description: string
  imageUrl: string
  reverse?: boolean
}

export default function ParallaxSection({
  title,
  subtitle,
  description,
  imageUrl,
  reverse = false,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex items-center justify-center px-4 py-20"
    >
      <div
        className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
          reverse ? 'lg:flex-row-reverse' : ''
        }`}
      >
        <motion.div
          style={{ scale }}
          className={`space-y-6 ${reverse ? 'lg:order-2' : ''}`}
        >
          <motion.div
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-medium">{subtitle}</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold mt-2">
              {title}
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-300 text-lg"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            <button className="px-6 py-3 bg-accent text-white rounded-full hover:bg-accent/80 transition-all hover-lift">
              Discover More
            </button>
            <button className="px-6 py-3 glass-effect rounded-full hover:bg-white/10 transition-all hover-lift">
              View Case Study
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y }}
          className={`relative ${reverse ? 'lg:order-1' : ''}`}
        >
          <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden glass-effect" style={{ position: 'relative' }}>
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/30 rounded-full blur-2xl" />
          <div className="absolute -top-6 -left-6 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </motion.div>
  )
}