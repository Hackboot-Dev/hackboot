'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useState } from 'react'

export default function LegalSection() {
  const { t } = useI18n()
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const legalPoints = t.about.legal.points || []

  return (
    <section className="relative py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10
                       border border-yellow-500/20 rounded-full px-6 py-3 mb-8">
            <span className="text-yellow-400">⚖️ {t.about.legal.badge}</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400
                       bg-clip-text text-transparent">
            {t.about.legal.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t.about.legal.subtitle}
          </p>
        </motion.div>

        {/* Main Legal Info Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12 p-12 bg-gradient-to-br from-yellow-900/10 to-orange-900/10
                   rounded-3xl border border-yellow-500/20 backdrop-blur-xl"
        >
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">
                {t.about.legal.jurisdiction.title}
              </h3>
              <p className="text-gray-300 mb-6">
                {t.about.legal.jurisdiction.description}
              </p>
              <div className="space-y-3">
                {t.about.legal.jurisdiction.benefits.map((benefit: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400
                                  flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs text-black">✓</span>
                    </div>
                    <p className="text-gray-400">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🌍</span>
                {t.about.legal.market.title}
              </h3>
              <p className="text-gray-300 mb-6">
                {t.about.legal.market.description}
              </p>
              <div className="p-6 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl
                            border border-red-500/20">
                <p className="text-sm text-orange-300">
                  ⚠️ {t.about.legal.market.warning}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Legal Points Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {legalPoints.map((point: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setExpandedCard(expandedCard === index ? null : index)}
              className="relative cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800
                            rounded-3xl opacity-90" />
              <div className="relative p-8 rounded-3xl border border-gray-700 hover:border-yellow-500
                            transition-all duration-300">
                <div className="text-3xl mb-4">{point.icon}</div>
                <h4 className="text-xl font-bold mb-3">{point.title}</h4>
                <p className="text-gray-400 mb-4">{point.description}</p>

                {expandedCard === index && point.details && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="pt-4 border-t border-gray-700"
                  >
                    <p className="text-sm text-gray-500">{point.details}</p>
                  </motion.div>
                )}

                {point.status && (
                  <div className="mt-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs
                                   ${point.status === 'active'
                                     ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                     : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      {point.status === 'active' ? t.about.legal.active : t.about.legal.pending}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Compliance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-gradient-to-br from-blue-900/10 to-purple-900/10
                   rounded-3xl border border-blue-500/20"
        >
          <h3 className="text-3xl font-bold mb-8 text-center">
            {t.about.legal.compliance.title}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.about.legal.compliance.items.map((item: any, index: number) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl
                         border border-gray-700 hover:border-blue-500 transition-all text-center"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}