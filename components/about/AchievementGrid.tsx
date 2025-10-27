'use client'

import type { LucideIcon } from 'lucide-react'
import { useReveal } from '@/lib/hooks/useReveal'

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
          <AchievementCard
            key={achievement.title}
            achievement={achievement}
            index={index}
            Icon={Icon}
          />
        )
      })}
    </div>
  )
}

function AchievementCard({
  achievement,
  index,
  Icon,
}: {
  achievement: Achievement
  index: number
  Icon: LucideIcon
}) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.25 })

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`group transition-transform duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
      }`}
    >
      <div className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${achievement.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
        />

        <div className="relative z-10">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${achievement.gradient} flex items-center justify-center mb-4 transition-transform duration-300 ease-out group-hover:scale-105`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>

          <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
            {achievement.value}
          </div>

          <h3 className="text-xl font-black text-white mb-2">{achievement.title}</h3>

          <p className="text-sm text-gray-400 leading-relaxed">{achievement.description}</p>
        </div>

        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  )
}
