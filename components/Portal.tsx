'use client'

import { useEffect, useState, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: ReactNode
  selector?: string
}

export default function Portal({ children, selector = '#portal-root' }: PortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    let portalRoot = document.querySelector(selector)
    if (!portalRoot) {
      portalRoot = document.createElement('div')
      portalRoot.setAttribute('id', selector.substring(1))
      document.body.appendChild(portalRoot)
    }

    return () => {
      setMounted(false)
    }
  }, [selector])

  if (!mounted) return null

  const portalRoot = document.querySelector(selector)
  if (!portalRoot) return null

  return createPortal(children, portalRoot)
}