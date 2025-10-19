'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface Achievement {
  icon: LucideIcon
  title: string
  value: string
  description: string
  gradient: string
}

interface AchievementGridProps {
  achievements: Achievement[]
}

export default function AchievementGrid({ achievements }: AchievementGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement, index) => {
        const Icon = achievement.icon
        return (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              type: 'spring',
              damping: 15,
            }}
            className="group perspective-1000"
          >
            <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all relative overflow-hidden preserve-3d">
              {/* Glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${achievement.gradient} opacity-0 group-hover:opacity-20 transition-opacity blur-xl`}
              />

              <div className="relative z-10">
                {/* Icon badge */}
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${achievement.gradient} flex items-center justify-center mb-4 relative`}
                  whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-8 h-8 text-white" />

                  {/* Pulse animation */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${achievement.gradient}`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                </motion.div>

                {/* Content */}
                <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
                  {achievement.value}
                </div>

                <h3 className="text-xl font-black text-white mb-2">
                  {achievement.title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {achievement.description}
                </p>
              </div>

              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
