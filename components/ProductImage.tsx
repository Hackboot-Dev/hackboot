'use client'

import { useState, useEffect } from 'react'
import { getGamingProductBySlug } from '@/lib/gaming-products'

interface ProductImageProps {
  productSlug: string
  productName: string
  fallbackImage?: string
  className?: string
  gameName?: string
}

export default function ProductImage({
  productSlug,
  productName,
  fallbackImage = '/images/valorant-hero.png',
  className = '',
  gameName
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(fallbackImage)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProductImage = () => {
      try {
        const product = getGamingProductBySlug(productSlug)

        if (product && product.variants.length > 0) {
          setImageSrc(product.variants[0].image)
        } else {
          setImageSrc(fallbackImage)
        }
      } catch (error) {
        console.error('Error loading product image:', error)
        setImageSrc(fallbackImage)
      } finally {
        setIsLoading(false)
      }
    }

    loadProductImage()
  }, [productSlug, fallbackImage])

  return (
    <>
      {isLoading && (
        <div className={`${className} bg-gradient-to-br from-purple-900/30 to-indigo-900/30 animate-pulse`} />
      )}
      <img
        src={imageSrc}
        alt={productName}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onError={() => setImageSrc(fallbackImage)}
      />
    </>
  )
}