'use client'

import { useState } from 'react'

const Logo = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative flex items-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`flex-shrink-0 transition-transform duration-500 ${isHovered ? 'rotate-[360deg]' : ''}`}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>

        <rect width="32" height="32" rx="6" fill="#0a0a0a" />
        <path
          d="M16 4 L26 10 L26 22 L16 28 L6 22 L6 10 Z"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M11 9 L11 23 M21 9 L21 23 M11 16 L21 16"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <span
        className={`ml-3 text-2xl font-display font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent whitespace-nowrap transition-all duration-300 ${
          isHovered ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
        }`}
      >
        HACKBOOT
      </span>

      <span
        className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 transition-all duration-300 ${
          isHovered ? 'w-full' : 'w-0'
        }`}
      />
    </div>
  )
}

export default Logo
