'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const Logo = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [rotation, setRotation] = useState(0)

  const handleMouseEnter = () => {
    setIsHovered(true)
    setRotation(rotation + 360)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div
      className="relative flex items-center cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="flex items-center"
        animate={{
          width: isHovered ? 'auto' : '40px'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Logo SVG Icon - Same as favicon */}
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
          animate={{ rotate: rotation }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7"/>
              <stop offset="50%" stopColor="#ec4899"/>
              <stop offset="100%" stopColor="#6366f1"/>
            </linearGradient>
          </defs>

          {/* Background */}
          <rect width="32" height="32" rx="6" fill="#0a0a0a"/>

          {/* Hexagon shape */}
          <path d="M16 4 L26 10 L26 22 L16 28 L6 22 L6 10 Z"
                stroke="url(#logoGradient)"
                strokeWidth="1.5"
                fill="none"/>

          {/* H Letter */}
          <path d="M11 9 L11 23 M21 9 L21 23 M11 16 L21 16"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                strokeLinecap="round"/>
        </motion.svg>

        {/* Text that appears on hover */}
        <motion.div
          className="overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isHovered ? 'auto' : 0,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <span className="ml-3 text-2xl font-display font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent whitespace-nowrap">
            HACKBOOT
          </span>
        </motion.div>
      </motion.div>

      {/* Animated underline */}
      <motion.div
        className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500"
        initial={{ width: '0%' }}
        animate={{
          width: isHovered ? '100%' : '0%'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut', delay: isHovered ? 0.1 : 0 }}
      />
    </div>
  )
}

export default Logo