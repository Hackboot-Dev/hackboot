'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useState } from 'react'

export default function VisionSection() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('vision')

  const tabs = [
    { id: 'vision', label: t.about.vision.tab, icon: '👁️' },
    { id: 'mission', label: t.about.mission.tab, icon: '🎯' },
    { id: 'values', label: t.about.values.tab, icon: '💎' }
  ]

  return (
    <section className="relative py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400
                       bg-clip-text text-transparent">
            {t.about.vision.title}
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300
                       ${activeTab === tab.id
                         ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                         : 'bg-gray-900 text-gray-400 hover:text-white'}`}
            >
              <span className="text-2xl mr-3">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Vision Content */}
          {activeTab === 'vision' && (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6 text-white">
                  {t.about.vision.heading}
                </h3>
                <p className="text-xl text-gray-300 mb-6">
                  {t.about.vision.description}
                </p>
                <div className="space-y-4">
                  {t.about.vision.points.map((point: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <p className="text-gray-400">{point}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20
                              rounded-3xl backdrop-blur-xl" />
                <div className="absolute inset-4 bg-gradient-to-br from-blue-600/10 to-purple-600/10
                              rounded-2xl" />
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-48 h-48 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">👁️</span>
                </div>
              </div>
            </div>
          )}

          {/* Mission Content */}
          {activeTab === 'mission' && (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 order-2 md:order-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20
                              rounded-3xl backdrop-blur-xl" />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="text-6xl">🎯</span>
                </motion.div>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-3xl font-bold mb-6 text-white">
                  {t.about.mission.heading}
                </h3>
                <p className="text-xl text-gray-300 mb-6">
                  {t.about.mission.description}
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {t.about.mission.goals.map((goal: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl
                               border border-gray-700 hover:border-purple-500 transition-all"
                    >
                      <div className="text-2xl mb-2">{goal.icon}</div>
                      <h4 className="font-semibold mb-1">{goal.title}</h4>
                      <p className="text-sm text-gray-400">{goal.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Values Content */}
          {activeTab === 'values' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4 text-white">
                  {t.about.values.heading}
                </h3>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  {t.about.values.description}
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {t.about.values.list.map((value: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10
                                  rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl
                                  border border-gray-700 group-hover:border-blue-500 transition-all">
                      <div className="text-4xl mb-4">{value.icon}</div>
                      <h4 className="text-xl font-bold mb-3">{value.title}</h4>
                      <p className="text-gray-400">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}