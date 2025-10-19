'use client'

import { motion } from 'framer-motion'
import { Target, Eye, Zap } from 'lucide-react'

interface MissionVisionProps {
  mission: {
    title: string
    description: string
  }
  vision: {
    title: string
    description: string
  }
  manifesto?: {
    title: string
    points: string[]
  }
}

export default function MissionVision({
  mission,
  vision,
  manifesto,
}: MissionVisionProps) {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          <div className="glass-effect rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-all h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Target className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-3xl font-black text-white">
                  {mission.title}
                </h3>
              </div>

              <p className="text-gray-300 leading-relaxed text-lg">
                {mission.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          <div className="glass-effect rounded-3xl p-8 border border-white/10 hover:border-cyan-500/30 transition-all h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Eye className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-3xl font-black text-white">{vision.title}</h3>
              </div>

              <p className="text-gray-300 leading-relaxed text-lg">
                {vision.description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Manifesto */}
      {manifesto && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group"
        >
          <div className="glass-effect rounded-3xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-3xl font-black text-white">
                  {manifesto.title}
                </h3>
              </div>

              <ul className="grid md:grid-cols-2 gap-4">
                {manifesto.points.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 mt-2 flex-shrink-0" />
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
