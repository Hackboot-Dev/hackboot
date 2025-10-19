'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { CheckCircle } from 'lucide-react'

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
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={containerRef} className="relative max-w-4xl mx-auto">
      {/* Vertical line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10">
        <motion.div
          className="w-full bg-gradient-to-b from-purple-500 via-cyan-500 to-emerald-500"
          style={{ height: lineHeight }}
        />
      </div>

      {/* Timeline events */}
      <div className="space-y-12">
        {events.map((event, index) => {
          const Icon = event.icon
          const isLeft = index % 2 === 0

          return (
            <motion.div
              key={`${event.year}-${event.title}`}
              initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`relative flex items-center ${
                isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex-col md:gap-8`}
            >
              {/* Content */}
              <div
                className={`flex-1 ${
                  isLeft ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
                } text-left w-full md:w-auto`}
              >
                <motion.div
                  className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-cyan-600 rounded-full text-xs font-bold">
                      {event.year}
                    </div>
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>

                  <h3 className="text-2xl font-black mb-2 text-white">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{event.description}</p>

                  {event.achievements && event.achievements.length > 0 && (
                    <ul className="space-y-2">
                      {event.achievements.map((achievement, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-gray-300"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </div>

              {/* Center dot */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center border-4 border-black"
                  whileInView={{ scale: [0, 1.2, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>
              </div>

              {/* Spacer for opposite side */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
