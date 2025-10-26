'use client'

import type { LucideIcon } from 'lucide-react'
import { useReveal } from '@/lib/hooks/useReveal'

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
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.25 })

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`group transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
      }`}
    >
      <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all h-full relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
        />

        <div className="relative z-10">
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-3`}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>

          <h3 className="text-xl font-black mb-3 text-white group-hover:text-purple-300 transition-colors">
            {value.title}
          </h3>

          <p className="text-sm text-gray-400 leading-relaxed">{value.description}</p>
        </div>

        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      </div>
    </div>
  )
}
