'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { Canvas } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei'
import { ChevronDown } from 'lucide-react'

function AnimatedSphere() {
  return (
    <Sphere visible args={[1, 100, 200]} scale={2.5}>
      <MeshDistortMaterial
        color="#0066FF"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0.4}
        metalness={0.1}
      />
    </Sphere>
  )
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    if (!titleRef.current) return

    const chars = titleRef.current.textContent!.split('')
    titleRef.current.innerHTML = ''

    chars.forEach((char, index) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.display = 'inline-block'
      span.className = 'char'
      titleRef.current!.appendChild(span)
    })

    gsap.fromTo(
      '.char',
      {
        opacity: 0,
        y: 100,
        rotationX: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.02,
      }
    )

    gsap.to('.floating-element', {
      y: -20,
      duration: 2,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
      stagger: {
        amount: 0.5,
      },
    })
  }, [])

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ opacity }}
    >
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AnimatedSphere />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <motion.div className="relative z-10 text-center px-4" style={{ y }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 floating-element"
        >
          <div className="inline-block px-6 py-2 glass-effect rounded-full">
            <span className="text-sm font-medium gradient-text">
              Welcome to the Future
            </span>
          </div>
        </motion.div>

        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-display font-bold mb-6 perspective-1000"
        >
          HACKBOOT
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto floating-element"
        >
          Pushing boundaries through innovative digital experiences
          and cutting-edge technology solutions
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center floating-element"
        >
          <button className="px-8 py-4 bg-accent text-white rounded-full hover:bg-accent/80 transition-all hover-lift font-medium">
            Explore Innovation
          </button>
          <button className="px-8 py-4 glass-effect rounded-full hover:bg-white/10 transition-all hover-lift font-medium">
            Learn More
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-white/50" />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>
    </motion.section>
  )
}