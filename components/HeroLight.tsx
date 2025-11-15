'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'

export default function HeroLight() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { t, locale } = useI18n()

  useEffect(() => {
    const title = titleRef.current
    if (!title) return

    const text = t?.hero?.title || ''
    title.innerHTML = ''
    text.split('').forEach((char, index) => {
      const span = document.createElement('span')
      span.textContent = char
      span.style.display = 'inline-block'
      span.style.transition = 'transform 350ms ease, opacity 350ms ease'
      span.style.transitionDelay = `${index * 35}ms`
      span.style.transform = 'translateY(18px)'
      span.style.opacity = '0'
      title.appendChild(span)
      requestAnimationFrame(() => {
        span.style.transform = 'translateY(0)'
        span.style.opacity = '1'
      })
    })
  }, [t?.hero?.title, locale])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-16 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-12 -right-28 w-[26rem] h-[26rem] bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="mb-6 inline-flex items-center justify-center px-8 py-3 glass-effect rounded-full border border-white/10">
          <span className="text-base md:text-lg font-semibold gradient-text">
            {t?.hero?.badge || ''}
          </span>
        </div>

        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-display font-bold mb-6"
        >
          {t?.hero?.title || ''}
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto transition-opacity duration-700 delay-200">
          {t?.hero?.subtitle || ''}
        </p>

        <div className="flex items-center justify-center w-full">
          <Link
            href={`/${locale}/premium`}
            className="px-8 py-4 bg-accent text-white rounded-full transition-transform duration-300 hover:-translate-y-1 hover:bg-accent/90"
          >
            {t?.hero?.getStarted || ''}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center text-white/60 animate-bounce">
        <ChevronDown className="w-8 h-8" />
      </div>

    </section>
  )
}
