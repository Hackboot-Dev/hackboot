'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface WaveTransitionProps {
  isTransitioning: boolean
  onComplete?: () => void
}

export default function WaveTransitionSimple({ isTransitioning, onComplete }: WaveTransitionProps) {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <>
          {/* Vague principale */}
          <motion.div
            className="fixed inset-0 z-[200] pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            exit={{ opacity: 0 }}
            transition={{
              x: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
              opacity: { duration: 0.3 }
            }}
            onAnimationComplete={onComplete}
          >
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
                  <stop offset="50%" stopColor="rgba(99, 102, 241, 0.8)" />
                  <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                </linearGradient>
              </defs>

              {/* Vague avec courbe naturelle */}
              <path
                fill="url(#wave1)"
                d="M-10,0
                   C10,20 20,40 10,50
                   C0,60 10,80 -10,100
                   L110,100
                   C90,80 100,60 110,50
                   C100,40 90,20 110,0
                   Z"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 2,0; 0,0"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </motion.div>

          {/* Deuxième vague décalée */}
          <motion.div
            className="fixed inset-0 z-[199] pointer-events-none opacity-60"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            exit={{ opacity: 0 }}
            transition={{
              x: { duration: 1.3, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] },
              opacity: { duration: 0.3 }
            }}
          >
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(147, 51, 234, 0)" />
                  <stop offset="50%" stopColor="rgba(147, 51, 234, 0.6)" />
                  <stop offset="100%" stopColor="rgba(147, 51, 234, 0)" />
                </linearGradient>
              </defs>

              <path
                fill="url(#wave2)"
                d="M-10,20
                   C10,40 20,60 10,70
                   C0,80 10,95 -10,100
                   L110,100
                   C90,95 100,80 110,70
                   C100,60 90,40 110,20
                   Z"
              />
            </svg>
          </motion.div>

          {/* Particules */}
          <div className="fixed inset-0 z-[201] pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                initial={{
                  x: '-5%',
                  y: `${20 + Math.random() * 60}%`,
                  scale: 0
                }}
                animate={{
                  x: '105%',
                  y: `${20 + Math.random() * 60}%`,
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.05,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              />
            ))}
          </div>
        </>
      )}
    </AnimatePresence>
  )
}