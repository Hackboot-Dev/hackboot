'use client'

import { Target, Eye, Zap } from 'lucide-react'
import { useReveal } from '@/lib/hooks/useReveal'

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
        <RevealCard
          icon={Target}
          title={mission.title}
          description={mission.description}
          gradient="from-purple-500 to-violet-600"
          borderHover="hover:border-purple-500/30"
          backgroundHover="from-purple-500/10"
          index={0}
        />

        <RevealCard
          icon={Eye}
          title={vision.title}
          description={vision.description}
          gradient="from-cyan-500 to-blue-600"
          borderHover="hover:border-cyan-500/30"
          backgroundHover="from-cyan-500/10"
          index={1}
        />
      </div>

      {/* Manifesto */}
      {manifesto && (
        <Manifesto
          title={manifesto.title}
          points={manifesto.points}
        />
      )}
    </div>
  )
}

interface RevealCardProps {
  icon: typeof Target
  title: string
  description: string
  gradient: string
  borderHover: string
  backgroundHover: string
  index: number
}

function RevealCard({
  icon: Icon,
  title,
  description,
  gradient,
  borderHover,
  backgroundHover,
  index,
}: RevealCardProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`relative group transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-x-0' : index % 2 === 0 ? 'opacity-0 -translate-x-8' : 'opacity-0 translate-x-8'
      }`}
    >
      <div
        className={`glass-effect rounded-3xl p-8 border border-white/10 ${borderHover} transition-all h-full relative overflow-hidden`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${backgroundHover} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center transition-transform duration-700 ease-out group-hover:rotate-[360deg]`}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-black text-white">{title}</h3>
          </div>

          <p className="text-gray-300 leading-relaxed text-lg">{description}</p>
        </div>
      </div>
    </div>
  )
}

function Manifesto({ title, points }: { title: string; points: string[] }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.25 })

  return (
    <div
      ref={ref}
      className={`relative group transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="glass-effect rounded-3xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center transition-transform duration-700 ease-out group-hover:rotate-[360deg]">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-black text-white">{title}</h3>
          </div>

          <ul className="grid md:grid-cols-2 gap-4">
            {points.map((point, index) => (
              <li
                key={index}
                style={{ transitionDelay: `${index * 80}ms` }}
                className={`flex items-start gap-3 text-gray-300 transition-all duration-500 ease-out ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 mt-2 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
