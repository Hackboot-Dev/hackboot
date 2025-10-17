'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'
import LanguageSelectorSimplest from '@/components/LanguageSelectorSimplest'

export default function HeroLight() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { t, locale } = useI18n()

  useEffect(() => {
    if (!titleRef.current || !t?.hero?.title) return

    const text = t.hero.title || ''
    titleRef.current.textContent = ''

    text.split('').forEach((char, i) => {
      const span = document.createElement('span')
      span.textContent = char
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      span.style.transform = 'translateY(20px)'
      span.style.transition = `all 0.5s ease ${i * 0.05}s`
      titleRef.current!.appendChild(span)

      setTimeout(() => {
        span.style.opacity = '1'
        span.style.transform = 'translateY(0)'
      }, 100)
    })
  }, [t?.hero?.title, locale])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Orbes flottants supplémentaires pour le Hero */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="inline-block px-8 py-3 glass-effect rounded-full">
            <span className="text-base md:text-lg font-semibold gradient-text">
              {t?.hero?.badge || ''}
            </span>
          </div>
        </motion.div>

        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-display font-bold mb-6"
        >
          {t?.hero?.title || ''}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          {t?.hero?.subtitle || ''}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-8 py-4 bg-accent text-white rounded-full hover:bg-accent/80 transition-all font-medium">
            {t?.hero?.getStarted || ''}
          </button>
          <button className="px-8 py-4 glass-effect rounded-full hover:bg-white/10 transition-all font-medium">
            {t?.hero?.watchDemo || ''}
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-white/50" />
      </motion.div>

    </section>
  )
}