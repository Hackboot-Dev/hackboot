'use client'

import { useState, useEffect, useRef } from 'react'
import { getGamingProductBySlug } from '@/lib/gaming-products'
import { Gamepad2 } from 'lucide-react'

interface ProductImageProps {
  productSlug: string
  productName: string
  fallbackImage?: string
  className?: string
  gameName?: string
  lazy?: boolean
}

export default function ProductImage({
  productSlug,
  productName,
  fallbackImage = '/images/valorant-hero.png',
  className = '',
  gameName,
  lazy = true
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isVisible, setIsVisible] = useState(!lazy)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!lazy) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [lazy])

  useEffect(() => {
    if (!isVisible) return

    const loadProductImage = () => {
      try {
        const product = getGamingProductBySlug(productSlug)

        if (!product) {
          setHasError(true)
          setIsLoading(false)
          return
        }

        if (product.optimizationLevel === 'community' && product.gfnData) {
          const gfnUrl = product.gfnData.logoUrl || product.gfnData.iconUrl
          console.log('[ProductImage] Loading GFN image:', product.name, gfnUrl)
          setImageSrc(gfnUrl)
          setHasError(false)
          setIsLoading(false)
        } else if (product.variants.length > 0) {
          const localPath = product.variants[0].image
          console.log('[ProductImage] Loading local image:', product.name, localPath)
          setImageSrc(localPath)
          setHasError(false)
          setIsLoading(false)
        } else {
          console.warn('[ProductImage] No image source for:', product.name)
          setHasError(true)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('[ProductImage] Error:', error)
        setHasError(true)
        setIsLoading(false)
      }
    }

    loadProductImage()
  }, [productSlug, isVisible])

  const generatePlaceholder = () => {
    const firstLetter = (gameName || productName || 'G').charAt(0).toUpperCase()
    const colors = [
      'from-purple-600 to-indigo-700',
      'from-blue-600 to-cyan-700',
      'from-pink-600 to-rose-700',
      'from-green-600 to-emerald-700',
      'from-orange-600 to-amber-700',
      'from-red-600 to-pink-700'
    ]
    const colorIndex = firstLetter.charCodeAt(0) % colors.length

    return (
      <div className={`${className} bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center`}>
        <div className="text-center">
          <Gamepad2 className="w-12 h-12 text-white/40 mx-auto mb-2" />
          <div className="text-3xl font-bold text-white/90">{firstLetter}</div>
          <div className="text-xs text-white/60 mt-1 px-2 line-clamp-1">{gameName || productName}</div>
        </div>
      </div>
    )
  }

  return (
    <div ref={imgRef} className="relative w-full h-full">
      {isLoading && (
        <div className={`${className} bg-gradient-to-br from-gray-800/40 to-gray-900/40 animate-pulse flex items-center justify-center`}>
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && hasError && generatePlaceholder()}

      {!isLoading && !hasError && imageSrc && (
        <img
          src={imageSrc}
          alt={productName}
          className={className}
          onError={() => {
            setHasError(true)
            setImageSrc('')
          }}
          loading="lazy"
        />
      )}
    </div>
  )
}