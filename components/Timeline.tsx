'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useI18n } from '@/lib/i18n'

export default function Timeline() {
  const { t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  const events = [
    {
      year: '2023',
      title: t.about.timeline.event1.title,
      description: t.about.timeline.event1.description,
      color: 'from-blue-500 to-cyan-500',
      icon: '🎮'
    },
    {
      year: t.about.timeline.event2.year,
      title: t.about.timeline.event2.title,
      description: t.about.timeline.event2.description,
      color: 'from-purple-500 to-pink-500',
      icon: '💻'
    },
    {
      year: '2025',
      title: t.about.timeline.event3.title,
      description: t.about.timeline.event3.description,
      color: 'from-green-500 to-emerald-500',
      icon: '☁️'
    },
    {
      year: t.about.timeline.event4.year,
      title: t.about.timeline.event4.title,
      description: t.about.timeline.event4.description,
      color: 'from-yellow-500 to-orange-500',
      icon: '🚀'
    }
  ]

  return (
    <section ref={containerRef} className="relative py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400
                       bg-clip-text text-transparent">
            {t.about.timeline.title}
          </h2>
          <p className="text-xl text-gray-300">
            {t.about.timeline.subtitle}
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-800 -translate-x-1/2" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 -translate-x-1/2"
          />

          {/* Events */}
          <div className="space-y-24">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-8 rounded-2xl bg-gradient-to-br ${event.color} bg-opacity-10
                             border border-gray-700 hover:border-opacity-50 transition-all
                             ${index % 2 === 0 ? 'text-right' : 'text-left'}`}
                  >
                    <div className="text-4xl mb-4">{event.icon}</div>
                    <div className="text-3xl font-bold mb-2">{event.year}</div>
                    <h3 className="text-2xl font-semibold mb-3">{event.title}</h3>
                    <p className="text-gray-300">{event.description}</p>
                  </motion.div>
                </div>

                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, delay: index * 0.2 }}
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${event.color}`}
                  />
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${event.color}
                                 animate-ping opacity-30`} />
                </div>

                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}