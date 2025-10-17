'use client'

import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'

export default function TestDataBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm border-b border-yellow-400/30 transition-transform duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-white text-sm font-medium">
          <AlertCircle className="w-5 h-5 animate-pulse" />
          <span>
            <strong>ATTENTION:</strong> Ce site utilise actuellement des données de test à des fins de développement. Les produits affichés sont fictifs et seront remplacés par les vraies données prochainement.
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  )
}
