'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'
import DesignBackdrop from './DesignBackdrop'

type HeroMetric = {
  id: string
  value: string
  label: string
}

export default function HeroLight() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { t, locale } = useI18n()

  const metricFallback: HeroMetric[] = useMemo(
    () => [
      { id: 'latency', value: '<5ms', label: 'Latence moyenne mondiale' },
      { id: 'uptime', value: '99.9%', label: 'Disponibilité garantie' },
      { id: 'deploy', value: '45 sec', label: 'Déploiement moyen' },
    ],
    [],
  )

  const metrics = useMemo(() => {
    const source = Array.isArray(t?.hero?.metrics) ? t.hero.metrics : []
    return metricFallback.map((metric) => {
      const match = source.find((item: Partial<HeroMetric>) => item?.id === metric.id)
      return {
        ...metric,
        value: match?.value ?? metric.value,
        label: match?.label ?? metric.label,
      }
    })
  }, [metricFallback, t?.hero?.metrics])

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28">
      <DesignBackdrop position="absolute" variant="violet" intensity="strong" />

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

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/premium`}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white rounded-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/30"
          >
            {t?.hero?.getStarted || ''}
          </Link>
          <button className="px-8 py-4 glass-effect rounded-full transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10">
            {t?.hero?.watchDemo || ''}
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.id} className="glass-effect rounded-2xl px-6 py-5 text-left">
              <div className="text-3xl font-bold text-white">{metric.value}</div>
              <div className="text-sm text-gray-400">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
        <ChevronDown className="w-8 h-8" />
      </div>

    </section>
  )
}
