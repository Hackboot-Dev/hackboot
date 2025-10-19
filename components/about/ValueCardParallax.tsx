'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface Value {
  icon: LucideIcon
  title: string
  description: string
  gradient: string
}

interface ValueCardParallaxProps {
  values: Value[]
}

export default function ValueCardParallax({ values }: ValueCardParallaxProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {values.map((value, index) => (
        <ValueCard key={value.title} value={value} index={index} />
      ))}
    </div>
  )
}

function ValueCard({ value, index }: { value: Value; index: number }) {
  const Icon = value.icon
  const cardRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all h-full relative overflow-hidden">
        {/* Animated background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
        />

        <div className="relative z-10">
          <motion.div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>

          <h3 className="text-xl font-black mb-3 text-white group-hover:text-purple-300 transition-colors">
            {value.title}
          </h3>

          <p className="text-sm text-gray-400 leading-relaxed">
            {value.description}
          </p>
        </div>

        {/* Decorative corner */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      </div>
    </motion.div>
  )
}
