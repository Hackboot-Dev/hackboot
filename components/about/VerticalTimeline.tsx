'use client'

import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { CheckCircle } from 'lucide-react'
import { useReveal } from '@/lib/hooks/useReveal'

interface TimelineEvent {
  year: string
  title: string
  description: string
  icon: LucideIcon
  achievements?: string[]
}

interface VerticalTimelineProps {
  events: TimelineEvent[]
}

export default function VerticalTimeline({ events }: VerticalTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const progress = useScrollProgress(containerRef)

  return (
    <div ref={containerRef} className="relative max-w-4xl mx-auto">
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 overflow-hidden">
        <div
          className="w-full bg-gradient-to-b from-purple-500 via-cyan-500 to-emerald-500 origin-top"
          style={{
            transform: `scaleY(${progress})`,
            transition: 'transform 300ms ease-out',
          }}
        />
      </div>

      <div className="space-y-12">
        {events.map((event, index) => (
          <TimelineItem key={`${event.year}-${event.title}`} event={event} index={index} />
        ))}
      </div>
    </div>
  )
}

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const Icon = event.icon
  const isLeft = index % 2 === 0
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.3, rootMargin: '-120px' })

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 100}ms` }}
      className={`relative flex items-center ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-col md:gap-8 gap-6 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div
        className={`flex-1 ${
          isLeft ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
        } text-left w-full md:w-auto`}
      >
        <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-cyan-600 rounded-full text-xs font-bold">
              {event.year}
            </div>
            <Icon className="w-5 h-5 text-cyan-400" />
          </div>

          <h3 className="text-2xl font-black mb-2 text-white">{event.title}</h3>
          <p className="text-gray-400 mb-4">{event.description}</p>

          {event.achievements && event.achievements.length > 0 && (
            <ul className="space-y-2">
              {event.achievements.map((achievement, idx) => (
                <li
                  key={idx}
                  style={{ transitionDelay: `${idx * 70}ms` }}
                  className={`flex items-start gap-2 text-sm text-gray-300 transition-all duration-500 ease-out ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center border-4 border-black transition-all duration-500 ease-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>

      <div className="flex-1 hidden md:block" />
    </div>
  )
}

function useScrollProgress(ref: React.RefObject<HTMLDivElement>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    let frame = 0

    const updateProgress = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const maxDistance = rect.height + viewportHeight
      const distance = Math.min(Math.max(viewportHeight - rect.top, 0), maxDistance)
      const nextProgress = distance / maxDistance
      setProgress(Number.isFinite(nextProgress) ? Math.min(Math.max(nextProgress, 0), 1) : 0)
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      if (frame) {
        cancelAnimationFrame(frame)
      }
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [ref])

  return progress
}
