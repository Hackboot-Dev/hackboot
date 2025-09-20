'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Code, Palette, Rocket, Sparkles, Zap, Globe } from 'lucide-react'

const cards = [
  {
    title: 'Innovation',
    description: 'Pushing the boundaries of whats possible with cutting-edge technology',
    icon: Rocket,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Design',
    description: 'Creating beautiful, intuitive experiences that delight users',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Development',
    description: 'Building robust, scalable solutions with clean, efficient code',
    icon: Code,
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Performance',
    description: 'Optimizing every aspect for lightning-fast experiences',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    title: 'Magic',
    description: 'Adding that special touch that makes experiences unforgettable',
    icon: Sparkles,
    color: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Global',
    description: 'Reaching audiences worldwide with scalable solutions',
    icon: Globe,
    color: 'from-indigo-500 to-blue-500',
  },
]

function Card3D({ card, index }: { card: typeof cards[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['17.5deg', '-17.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-17.5deg', '17.5deg'])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
      }}
      className="relative group"
    >
      <div className="relative h-full p-8 rounded-2xl glass-effect overflow-hidden cursor-pointer">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        <div className="relative z-10">
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <card.icon className="w-12 h-12 text-accent" />
          </motion.div>

          <h3 className="text-2xl font-display font-bold mb-3">{card.title}</h3>
          <p className="text-gray-400">{card.description}</p>
        </div>

        <motion.div
          className="absolute bottom-4 right-4"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-accent">→</span>
        </motion.div>

        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-500 rounded-2xl blur-xl opacity-30" />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default function InteractiveCards() {
  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">
            What We Do
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Crafting digital experiences that inspire, engage, and transform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
          {cards.map((card, index) => (
            <Card3D key={index} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}