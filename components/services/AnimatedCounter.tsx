'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'

interface AnimatedCounterProps {
  value: string
  label: string
  duration?: number
}

export default function AnimatedCounter({
  value,
  label,
  duration = 1.25,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLSpanElement | null>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (textRef.current) {
      textRef.current.textContent = displayValue
    }
  }, [displayValue])

  useEffect(() => {
    if (!isInView) {
      return
    }

    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      )
      if (prefersReducedMotion.matches) {
        setDisplayValue(value)
        if (textRef.current) {
          textRef.current.textContent = value
        }
        return
      }
    }

    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''))
    const suffix = value.replace(/[0-9.]/g, '')

    if (Number.isNaN(numericValue)) {
      setDisplayValue(value)
      if (textRef.current) {
        textRef.current.textContent = value
      }
      return
    }

    const controls = animate(0, numericValue, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        const rounded = Math.round(latest)
        const formatted = `${rounded}${suffix}`
        if (textRef.current) {
          textRef.current.textContent = formatted
        }
      },
      onComplete: () => {
        setDisplayValue(value)
        if (textRef.current) {
          textRef.current.textContent = value
        }
      },
    })

    return () => {
      controls.stop()
    }
  }, [duration, isInView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="glass-effect rounded-xl px-6 py-4 border border-white/10"
    >
      <span
        ref={textRef}
        className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400"
      >
        {displayValue}
      </span>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </motion.div>
  )
}
