'use client'

import { motion } from 'framer-motion'

export default function MorphingShape() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Morphing blob 1 */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent)',
        }}
        animate={{
          x: [0, 100, 0, -100, 0],
          y: [0, -100, 100, -50, 0],
          scale: [1, 1.2, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        initial={{ top: '20%', left: '10%' }}
      />

      {/* Morphing blob 2 */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15), transparent)',
        }}
        animate={{
          x: [0, -150, 50, 100, 0],
          y: [0, 100, -50, 100, 0],
          scale: [1, 0.9, 1.3, 0.85, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        initial={{ bottom: '30%', right: '15%' }}
      />

      {/* Morphing blob 3 */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15), transparent)',
        }}
        animate={{
          x: [0, 80, -120, 60, 0],
          y: [0, -80, -120, 80, 0],
          scale: [1, 1.1, 0.9, 1.2, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        initial={{ top: '50%', left: '50%' }}
      />
    </div>
  )
}
