'use client'

import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TestDataBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[9998] bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm border-b border-yellow-400/30"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-white animate-pulse" />
            <div className="text-white text-sm font-medium">
              <span className="font-bold">ATTENTION:</span> Ce site utilise actuellement des données de test à des fins de développement.
              Les produits affichés sont fictifs et seront remplacés par les vraies données prochainement.
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-all"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}