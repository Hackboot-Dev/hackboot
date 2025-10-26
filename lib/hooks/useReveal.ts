import { useEffect, useRef, useState } from 'react'

type RevealOptions = {
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
}

export function useReveal<T extends HTMLElement>(options?: RevealOptions) {
  const { rootMargin, threshold, once = true } = options ?? {}
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    if (once && isVisible) {
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              frame = requestAnimationFrame(() => {
                setIsVisible(true)
              })
            }
            if (once) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            frame = requestAnimationFrame(() => {
              setIsVisible(false)
            })
          }
        })
      },
      {
        rootMargin,
        threshold,
      },
    )

    observer.observe(node)

    return () => {
      if (frame) {
        cancelAnimationFrame(frame)
      }
      observer.disconnect()
    }
  }, [rootMargin, threshold, once, isVisible])

  return { ref, isVisible }
}
