'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useState } from 'react'

export default function CultureSection() {
  const { t } = useI18n()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const principles = t.about.culture.principles || []

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10" />
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(147, 51, 234, 0.1)'}, transparent)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400
                       bg-clip-text text-transparent">
            {t.about.culture.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t.about.culture.subtitle}
          </p>
        </motion.div>

        {/* Main Philosophy Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-20 p-12 bg-gradient-to-br from-purple-900/20 to-pink-900/20
                   rounded-3xl border border-purple-500/20 backdrop-blur-xl"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-white">
                {t.about.culture.philosophy.title}
              </h3>
              <p className="text-xl text-gray-300 mb-8">
                {t.about.culture.philosophy.description}
              </p>
              <div className="flex flex-wrap gap-4">
                {['🚀', '💡', '🌍', '⚡'].map((emoji, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20
                             rounded-2xl flex items-center justify-center text-2xl"
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative h-80">
              <motion.div
                animate={{
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0"
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10
                              rounded-3xl backdrop-blur-xl transform perspective-1000 rotateY-45" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Culture Principles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {principles.map((principle: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20
                            rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

              <div className="relative p-8 bg-gradient-to-br from-gray-900/90 to-gray-800/90
                            rounded-3xl border border-gray-700 group-hover:border-purple-500
                            backdrop-blur-xl transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-4xl">{principle.icon}</div>
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 bg-purple-500 rounded-full"
                    />
                  )}
                </div>

                <h4 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400
                             bg-clip-text text-transparent">
                  {principle.title}
                </h4>

                <p className="text-gray-400 mb-4">
                  {principle.description}
                </p>

                {principle.details && (
                  <div className="space-y-2 mt-4 pt-4 border-t border-gray-700">
                    {principle.details.map((detail: string, detailIndex: number) => (
                      <div key={detailIndex} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-purple-400 rounded-full" />
                        <span className="text-sm text-gray-500">{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Work Style Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-gradient-to-br from-blue-900/20 to-purple-900/20
                   rounded-3xl border border-blue-500/20 backdrop-blur-xl"
        >
          <h3 className="text-3xl font-bold mb-8 text-center">
            {t.about.culture.workStyle.title}
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            {t.about.culture.workStyle.items.map((item: any, index: number) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}