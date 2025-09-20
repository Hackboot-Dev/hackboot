'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const technologies = [
  'React', 'Next.js', 'TypeScript', 'Three.js', 'GSAP',
  'Framer Motion', 'Tailwind CSS', 'WebGL', 'Node.js',
  'GraphQL', 'Prisma', 'Docker', 'Kubernetes', 'AWS',
]

export default function InfiniteScroll() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const scrollContent = scrollContainer.querySelector('.scroll-content') as HTMLElement
    if (!scrollContent) return

    const clone = scrollContent.cloneNode(true) as HTMLElement
    scrollContainer.appendChild(clone)

    let scrollPos = 0
    const scroll = () => {
      scrollPos += 1
      if (scrollPos >= scrollContent.offsetWidth) {
        scrollPos = 0
      }
      scrollContainer.scrollLeft = scrollPos
      requestAnimationFrame(scroll)
    }

    const animationId = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <section className="py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
          Technologies We Master
        </h2>
        <p className="text-gray-400">Powered by cutting-edge tools and frameworks</p>
      </motion.div>

      <div
        ref={scrollRef}
        className="relative flex overflow-x-hidden scrollbar-hide"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      >
        <div className="scroll-content flex gap-8 pr-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex-shrink-0"
            >
              <div className="px-8 py-4 glass-effect rounded-full whitespace-nowrap hover:bg-white/10 transition-all cursor-pointer">
                <span className="text-lg font-medium">{tech}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}