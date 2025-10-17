'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface WaveTransitionProps {
  isTransitioning: boolean
  onComplete?: () => void
}

export default function WaveTransition({ isTransitioning, onComplete }: WaveTransitionProps) {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <>
          {/* Vague principale fluide */}
          <motion.div
            className="fixed inset-0 z-[200] pointer-events-none"
            initial={{ x: '-150%' }}
            animate={{ x: '100%' }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.8,
              ease: [0.32, 0, 0.67, 0]
            }}
            onAnimationComplete={onComplete}
            style={{ width: '200vw' }}
          >
            <svg
              className="absolute h-full"
              style={{ width: '200%', left: '-50%' }}
              preserveAspectRatio="none"
              viewBox="0 0 2000 1000"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="30%" stopColor="rgba(99, 102, 241, 0.1)" />
                  <stop offset="45%" stopColor="rgba(99, 102, 241, 0.6)" />
                  <stop offset="50%" stopColor="rgba(99, 102, 241, 0.9)" />
                  <stop offset="55%" stopColor="rgba(99, 102, 241, 0.6)" />
                  <stop offset="70%" stopColor="rgba(99, 102, 241, 0.1)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                <filter id="blur">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
                </filter>
              </defs>

              {/* Vague principale avec courbes naturelles */}
              <path
                fill="url(#waveGradient)"
                filter="url(#blur)"
                d="M0,200
                   C200,100 300,300 400,200
                   S600,100 800,200
                   S1000,300 1200,200
                   S1400,100 1600,200
                   S1800,300 2000,200
                   L2000,1000 L0,1000 Z"
              >
                <animate
                  attributeName="d"
                  values="
                    M0,200 C200,100 300,300 400,200 S600,100 800,200 S1000,300 1200,200 S1400,100 1600,200 S1800,300 2000,200 L2000,1000 L0,1000 Z;
                    M0,300 C200,200 300,400 400,300 S600,200 800,300 S1000,400 1200,300 S1400,200 1600,300 S1800,400 2000,300 L2000,1000 L0,1000 Z;
                    M0,200 C200,100 300,300 400,200 S600,100 800,200 S1000,300 1200,200 S1400,100 1600,200 S1800,300 2000,200 L2000,1000 L0,1000 Z"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Deuxième vague décalée */}
              <path
                fill="url(#waveGradient)"
                opacity="0.5"
                d="M0,400
                   C200,500 300,300 400,400
                   S600,500 800,400
                   S1000,300 1200,400
                   S1400,500 1600,400
                   S1800,300 2000,400
                   L2000,1000 L0,1000 Z"
              >
                <animate
                  attributeName="d"
                  values="
                    M0,400 C200,500 300,300 400,400 S600,500 800,400 S1000,300 1200,400 S1400,500 1600,400 S1800,300 2000,400 L2000,1000 L0,1000 Z;
                    M0,350 C200,450 300,250 400,350 S600,450 800,350 S1000,250 1200,350 S1400,450 1600,350 S1800,250 2000,350 L2000,1000 L0,1000 Z;
                    M0,400 C200,500 300,300 400,400 S600,500 800,400 S1000,300 1200,400 S1400,500 1600,400 S1800,300 2000,400 L2000,1000 L0,1000 Z"
                  dur="2s"
                  begin="0.3s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Troisième vague encore plus décalée */}
              <path
                fill="url(#waveGradient)"
                opacity="0.3"
                d="M0,600
                   C200,700 300,500 400,600
                   S600,700 800,600
                   S1000,500 1200,600
                   S1400,700 1600,600
                   S1800,500 2000,600
                   L2000,1000 L0,1000 Z"
              >
                <animate
                  attributeName="d"
                  values="
                    M0,600 C200,700 300,500 400,600 S600,700 800,600 S1000,500 1200,600 S1400,700 1600,600 S1800,500 2000,600 L2000,1000 L0,1000 Z;
                    M0,550 C200,650 300,450 400,550 S600,650 800,550 S1000,450 1200,550 S1400,650 1600,550 S1800,450 2000,550 L2000,1000 L0,1000 Z;
                    M0,600 C200,700 300,500 400,600 S600,700 800,600 S1000,500 1200,600 S1400,700 1600,600 S1800,500 2000,600 L2000,1000 L0,1000 Z"
                  dur="2s"
                  begin="0.6s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </motion.div>

          {/* Écume de la vague (mousse blanche) */}
          <motion.div
            className="fixed inset-0 z-[201] pointer-events-none"
            initial={{ x: '-150%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.8,
              delay: 0.1,
              ease: [0.32, 0, 0.67, 0]
            }}
            style={{ width: '200vw' }}
          >
            <svg
              className="absolute h-full opacity-30"
              style={{ width: '200%', left: '-50%' }}
              preserveAspectRatio="none"
              viewBox="0 0 2000 1000"
            >
              <defs>
                <linearGradient id="foamGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="40%" stopColor="transparent" />
                  <stop offset="48%" stopColor="rgba(255, 255, 255, 0.4)" />
                  <stop offset="52%" stopColor="rgba(255, 255, 255, 0.6)" />
                  <stop offset="60%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                fill="url(#foamGradient)"
                d="M0,250
                   C200,150 300,350 400,250
                   S600,150 800,250
                   S1000,350 1200,250
                   S1400,150 1600,250
                   S1800,350 2000,250
                   L2000,270
                   C1800,370 1600,170 1400,270
                   S1200,370 1000,270
                   S800,170 600,270
                   S400,370 200,270
                   L0,270 Z"
              />
            </svg>
          </motion.div>

          {/* Gouttelettes d'eau */}
          <div className="fixed inset-0 z-[202] pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 6 + 2,
                  height: Math.random() * 6 + 2,
                  background: `radial-gradient(circle, rgba(255,255,255,${Math.random() * 0.5 + 0.3}), transparent)`,
                }}
                initial={{
                  x: '-10%',
                  y: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  x: '110%',
                  y: `${20 + Math.random() * 60}%`,
                  scale: [1, 1.5, 0.5],
                }}
                transition={{
                  duration: Math.random() * 1.5 + 1,
                  delay: i * 0.02,
                  ease: [0.32, 0, 0.67, 0]
                }}
              />
            ))}
          </div>

          {/* Effet de flou temporaire sur le contenu */}
          <motion.div
            className="fixed inset-0 z-[198] backdrop-blur-sm pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </>
      )}
    </AnimatePresence>
  )
}