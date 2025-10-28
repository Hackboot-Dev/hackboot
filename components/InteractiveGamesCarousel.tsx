'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAllGamingProducts, type GamingProduct } from '@/lib/gaming-products'
import { useI18n } from '@/lib/i18n-simple'
import { Sparkles } from 'lucide-react'

export default function InteractiveGamesCarousel() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { t } = useI18n()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [products] = useState<GamingProduct[]>(() => getAllGamingProducts())

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleGameClick = (product: GamingProduct, e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault()
      return
    }
    router.push(`/${locale}/products/${product.slug}`)
  }

  const gamesTitle = t.gamesCarousel?.title ?? 'Jeux Disponibles'
  const gamesSubtitle = t.gamesCarousel?.subtitle ?? 'Clique ou déplace pour explorer notre catalogue de jeux'

  return (
    <section className="py-20 overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3), transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.3), transparent 50%)`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600">
          {gamesTitle}
        </h2>
        <p className="text-gray-400 text-lg">{gamesSubtitle}</p>
      </div>

      <div
        ref={scrollRef}
        className="relative overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex gap-6 px-8 pb-4 w-max">
          {products.map((product) => {
            const isPulseForge = product.optimizationLevel === 'native'
            return (
              <div
                key={product.id}
                onClick={(e) => handleGameClick(product, e)}
                className={`
                  relative group flex-shrink-0 w-72 rounded-2xl overflow-hidden
                  transition-all duration-300 hover:scale-105 hover:shadow-2xl
                  ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}
                  ${isPulseForge
                    ? 'border-2 border-pink-500/50 shadow-lg shadow-pink-500/20'
                    : 'border border-white/10'
                  }
                `}
              >
                {/* Badge PulseForge */}
                {isPulseForge && (
                  <div className="absolute top-3 right-3 z-20 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white">PULSEFORGE</span>
                  </div>
                )}

                {/* Image du jeu */}
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20">
                  {product.variants[0]?.image ? (
                    <img
                      src={product.variants[0].image}
                      alt={product.game}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-black text-white/20">{product.game[0]}</span>
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    isPulseForge
                      ? 'from-black via-transparent to-pink-500/20'
                      : 'from-black via-transparent to-purple-500/20'
                  }`} />
                </div>

                {/* Contenu */}
                <div className={`p-5 ${
                  isPulseForge
                    ? 'bg-gradient-to-br from-pink-950/40 to-purple-950/40 backdrop-blur-xl'
                    : 'bg-black/60 backdrop-blur-xl'
                }`}>
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                    {product.game}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        isPulseForge
                          ? 'bg-pink-500/20 text-pink-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {product.category}
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      isPulseForge ? 'text-pink-400' : 'text-purple-400'
                    }`}>
                      {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  isPulseForge
                    ? 'bg-gradient-to-br from-pink-500/10 to-purple-600/10'
                    : 'bg-gradient-to-br from-purple-500/10 to-indigo-600/10'
                }`} />
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push(`/${locale}/games`)}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-purple-500/30"
        >
          {t.gamesCarousel?.viewAll ?? 'Voir tous les jeux'}
        </button>
      </div>
    </section>
  )
}
