'use client'

import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <motion.div
          className="w-16 h-16 border-4 border-accent/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 border-4 border-accent border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.p
        className="absolute bottom-1/3 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading...
      </motion.p>
    </motion.div>
  )
}