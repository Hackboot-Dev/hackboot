'use client'

import React, { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'
import LanguageSelector from '@/components/LanguageSelector'

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { t } = useI18n()

  useEffect(() => {
    const title = titleRef.current
    if (!title) return

    title.classList.remove('opacity-0', 'translate-y-6')
    const letters = Array.from(title.querySelectorAll('span'))
    if (letters.length === 0 && title.textContent) {
      const text = title.textContent
      title.textContent = ''
      text.split('').forEach((char, index) => {
        const span = document.createElement('span')
        span.textContent = char
        span.style.display = 'inline-block'
        span.style.transition = 'transform 400ms ease, opacity 400ms ease'
        span.style.transitionDelay = `${index * 40}ms`
        span.style.transform = 'translateY(20px)'
        span.style.opacity = '0'
        title.appendChild(span)
        requestAnimationFrame(() => {
          span.style.transform = 'translateY(0)'
          span.style.opacity = '1'
        })
      })
    } else {
      requestAnimationFrame(() => {
        letters.forEach((letter, index) => {
          const el = letter as HTMLSpanElement
          el.style.transitionDelay = `${index * 40}ms`
          el.classList.add('opacity-100')
          el.classList.remove('opacity-0')
        })
      })
    }
  }, [t?.hero?.title])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-black/95 to-black pt-24">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-10 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 -right-40 w-[28rem] h-[28rem] bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12)_0%,_transparent_55%)]" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl w-full">
        <div className="inline-flex items-center justify-center px-6 py-3 mb-6 glass-effect rounded-full border border-white/10 backdrop-blur">
          <span className="text-base md:text-lg font-semibold gradient-text transition-opacity duration-700">
            {t?.hero?.badge || ''}
          </span>
        </div>

        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight opacity-0 translate-y-6"
        >
          {t?.hero?.title || ''}
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto transition-opacity duration-700 delay-200">
          {t?.hero?.subtitle || ''}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-accent text-white rounded-full transition-transform duration-300 hover:-translate-y-1 hover:bg-accent/90">
            {t?.hero?.getStarted || ''}
          </button>
          <button className="px-8 py-4 glass-effect rounded-full transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10">
            {t?.hero?.watchDemo || ''}
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
        <ChevronDown className="w-8 h-8" />
      </div>

      <div className="absolute top-6 right-6 z-20">
        <LanguageSelector />
      </div>
    </section>
  )
}
