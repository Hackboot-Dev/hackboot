'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  Video,
  Sparkles,
  Type,
  Palette,
  Upload,
  X,
  Layers,
  Sliders,
  RotateCw,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'

interface Format {
  id: string
  name: string
  platform: string
  width: number
  height: number
  description: string
}

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  name: string
}

interface EffectConfig {
  id: string
  enabled: boolean
  targets: {
    title: boolean
    subtitle: boolean
    cta: boolean
    media: boolean
    background: boolean
  }
  duration: number
  delay: number
  intensity: number
}

interface EffectDefinition {
  id: string
  name: string
  description: string
  supportsIntensity: boolean
  defaultDuration: number
  availableTargets: ('title' | 'subtitle' | 'cta' | 'media' | 'background')[]
}

export default function SocialImagesPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null)
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'effects' | 'style'>('content')
  const [showTestBanner, setShowTestBanner] = useState(false)

  // Content
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [cta, setCta] = useState('')
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>('center')
  const [fontFamily, setFontFamily] = useState('inter')

  // Media
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([])
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Effects - New detailed system
  const [openEffectCategory, setOpenEffectCategory] = useState<string | null>('visual')
  const [visualEffects, setVisualEffects] = useState<Record<string, EffectConfig>>({})
  const [entranceEffects, setEntranceEffects] = useState<Record<string, EffectConfig>>({})
  const [textEffects, setTextEffects] = useState<Record<string, EffectConfig>>({})
  const [backgroundEffects, setBackgroundEffects] = useState<Record<string, EffectConfig>>({})

  // Style - Basic
  const [backgroundColor, setBackgroundColor] = useState('#000000')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [gradientEnabled, setGradientEnabled] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('hackboot-primary')

  // Style - Réglages du dégradé
  const [gradientAngle, setGradientAngle] = useState(135)
  const [gradientIntensity, setGradientIntensity] = useState(100)
  const [customGradientColors, setCustomGradientColors] = useState<string[]>(['#0066FF', '#8B5CF6'])

  // Style - Advanced Sliders
  const [mediaOpacity, setMediaOpacity] = useState(100)
  const [mediaBlur, setMediaBlur] = useState(0)
  const [overlayDarkness, setOverlayDarkness] = useState(30)
  const [titleSize, setTitleSize] = useState(60)
  const [textVerticalPosition, setTextVerticalPosition] = useState(50)
  const [backgroundScale, setBackgroundScale] = useState(100)

  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const fontOptions = [
    { id: 'inter', label: 'Inter', stack: "'Inter', sans-serif" },
    { id: 'manrope', label: 'Manrope', stack: "'Manrope', sans-serif" },
    { id: 'space-grotesk', label: 'Space Grotesk', stack: "'Space Grotesk', sans-serif" },
    { id: 'playfair', label: 'Playfair Display', stack: "'Playfair Display', serif" },
    { id: 'montserrat', label: 'Montserrat', stack: "'Montserrat', sans-serif" },
  ]

  const defaultTextLimits = { title: 120, subtitle: 220, cta: 45 }
  const formatTextLimits: Record<string, { title: number; subtitle: number; cta: number }> = {
    'ig-post': { title: 125, subtitle: 220, cta: 32 },
    'ig-story': { title: 110, subtitle: 180, cta: 32 },
    'fb-post': { title: 140, subtitle: 240, cta: 45 },
    'twitter-post': { title: 100, subtitle: 200, cta: 30 },
    'linkedin-post': { title: 150, subtitle: 260, cta: 45 },
    'youtube-thumbnail': { title: 80, subtitle: 140, cta: 28 },
  }

  useEffect(() => {
    const token = localStorage.getItem('ads-token')
    if (!token) {
      router.push('/ads')
    } else {
      setAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const dismissed = localStorage.getItem('ads-social-test-banner-dismissed')
    setShowTestBanner(dismissed !== 'true')
  }, [])

  const handleDismissBanner = () => {
    setShowTestBanner(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ads-social-test-banner-dismissed', 'true')
    }
  }

  const currentFontStack =
    fontOptions.find((option) => option.id === fontFamily)?.stack || fontOptions[0].stack

  const currentTextLimits = selectedFormat
    ? formatTextLimits[selectedFormat.id] || defaultTextLimits
    : defaultTextLimits

  const titleLimit = currentTextLimits.title
  const subtitleLimit = currentTextLimits.subtitle
  const ctaLimit = currentTextLimits.cta

  const titleRemaining = Math.max(titleLimit - title.length, 0)
  const subtitleRemaining = Math.max(subtitleLimit - subtitle.length, 0)
  const ctaRemaining = Math.max(ctaLimit - cta.length, 0)

  const alignmentClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[textAlignment]

  const ctaAlignmentClass =
    textAlignment === 'left' ? 'self-start' : textAlignment === 'right' ? 'self-end' : 'self-center'

  const workflowSteps = [
    { id: 'format', label: 'Format' },
    { id: 'content', label: 'Contenu' },
    { id: 'media', label: 'Média' },
    { id: 'effects', label: 'Effets' },
    { id: 'style', label: 'Style' },
    { id: 'export', label: 'Export' },
  ]

  const currentStepId = !selectedFormat ? 'format' : copied ? 'export' : activeTab
  const currentStepIndex = Math.max(
    workflowSteps.findIndex((step) => step.id === currentStepId),
    0
  )

  const getCounterClass = (remaining: number) =>
    remaining <= 10 ? 'text-amber-300' : 'text-gray-400'

  const effectTargetLabels: Record<string, string> = {
    title: 'Titre',
    subtitle: 'Sous-titre',
    cta: 'CTA',
    media: 'Média',
    background: 'Arrière-plan',
  }

  const formats: Format[] = [
    {
      id: 'ig-post',
      name: 'Instagram Post',
      platform: 'Instagram',
      width: 1080,
      height: 1080,
      description: 'Format carré idéal pour le fil Instagram',
    },
    {
      id: 'ig-story',
      name: 'Instagram Story',
      platform: 'Instagram',
      width: 1080,
      height: 1920,
      description: 'Format vertical pour stories Instagram',
    },
    {
      id: 'fb-post',
      name: 'Facebook Post',
      platform: 'Facebook',
      width: 1200,
      height: 630,
      description: 'Visuel standard pour publication Facebook',
    },
    {
      id: 'twitter-post',
      name: 'Twitter Post',
      platform: 'Twitter/X',
      width: 1200,
      height: 675,
      description: 'Visuel optimisé pour post Twitter/X',
    },
    {
      id: 'linkedin-post',
      name: 'LinkedIn Post',
      platform: 'LinkedIn',
      width: 1200,
      height: 627,
      description: 'Visuel adapté aux partages LinkedIn',
    },
    {
      id: 'youtube-thumbnail',
      name: 'YouTube Thumbnail',
      platform: 'YouTube',
      width: 1280,
      height: 720,
      description: 'Miniature recommandée pour YouTube',
    },
  ]

  // Templates basés sur la charte graphique Hackboot
  const templates = [
    {
      id: 'hackboot-primary',
      name: 'Hackboot Primary',
      colors: ['#0066FF', '#8B5CF6']
    },
    {
      id: 'hackboot-signature',
      name: 'Signature',
      colors: ['#A855F7', '#EC4899', '#6366F1']
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      colors: ['#000000', '#0A0A0A', '#1F1F1F']
    },
    {
      id: 'performance',
      name: 'Performance',
      colors: ['#10B981', '#06B6D4']
    },
    {
      id: 'premium',
      name: 'Premium',
      colors: ['#FDE047', '#FB923C']
    },
    {
      id: 'alert',
      name: 'Alert',
      colors: ['#F97316', '#EF4444']
    },
    {
      id: 'professional',
      name: 'Professional',
      colors: ['#6366F1', '#3B82F6']
    },
    {
      id: 'neon',
      name: 'Neon',
      colors: ['#22D3EE', '#A78BFA', '#EC4899']
    },
    {
      id: 'sunset',
      name: 'Sunset',
      colors: ['#F59E0B', '#EF4444', '#EC4899']
    },
    {
      id: 'ocean',
      name: 'Ocean',
      colors: ['#0EA5E9', '#06B6D4', '#14B8A6']
    },
    {
      id: 'forest',
      name: 'Forest',
      colors: ['#059669', '#10B981', '#34D399']
    },
    {
      id: 'purple-dream',
      name: 'Purple Dream',
      colors: ['#7C3AED', '#8B5CF6', '#A78BFA']
    },
  ]

  const [showAllTemplates, setShowAllTemplates] = useState(false)
  const displayedTemplates = showAllTemplates ? templates : templates.slice(0, 4)

  // Visual Effects Definitions (filters)
  const visualEffectDefinitions: EffectDefinition[] = [
    { id: 'blur', name: 'Blur', description: 'Apply blur filter', supportsIntensity: true, defaultDuration: 0, availableTargets: ['media', 'background'] },
    { id: 'grayscale', name: 'Grayscale', description: 'Convert to grayscale', supportsIntensity: true, defaultDuration: 0, availableTargets: ['media', 'background'] },
    { id: 'sepia', name: 'Sepia', description: 'Vintage sepia tone', supportsIntensity: true, defaultDuration: 0, availableTargets: ['media', 'background'] },
    { id: 'contrast', name: 'High Contrast', description: 'Increase contrast', supportsIntensity: true, defaultDuration: 0, availableTargets: ['media', 'background'] },
    { id: 'brightness', name: 'Brightness', description: 'Adjust brightness', supportsIntensity: true, defaultDuration: 0, availableTargets: ['media', 'background', 'title', 'subtitle', 'cta'] },
    { id: 'saturate', name: 'Saturate', description: 'Boost saturation', supportsIntensity: true, defaultDuration: 0, availableTargets: ['media', 'background'] },
    { id: 'glow', name: 'Glow', description: 'Add glow effect', supportsIntensity: true, defaultDuration: 0, availableTargets: ['media', 'title', 'subtitle', 'cta'] },
    { id: 'invert', name: 'Invert', description: 'Invert colors', supportsIntensity: true, defaultDuration: 0, availableTargets: ['media', 'background'] },
    { id: 'hue-rotate', name: 'Hue Rotate', description: 'Shift color hue', supportsIntensity: true, defaultDuration: 0, availableTargets: ['media', 'background'] },
    { id: 'opacity', name: 'Opacity', description: 'Control transparency', supportsIntensity: true, defaultDuration: 0, availableTargets: ['media', 'background', 'title', 'subtitle', 'cta'] },
    { id: 'shadow', name: 'Shadow', description: 'Add drop shadow', supportsIntensity: true, defaultDuration: 0, availableTargets: ['title', 'subtitle', 'cta', 'media'] },
  ]

  // Entrance Effects Definitions (animations)
  const entranceEffectDefinitions: EffectDefinition[] = [
    { id: 'fade-in', name: 'Fade In', description: 'Smooth fade entrance', supportsIntensity: false, defaultDuration: 800, availableTargets: ['title', 'subtitle', 'cta', 'media'] },
    { id: 'slide-up', name: 'Slide Up', description: 'Slide from bottom', supportsIntensity: false, defaultDuration: 600, availableTargets: ['title', 'subtitle', 'cta', 'media'] },
    { id: 'slide-down', name: 'Slide Down', description: 'Slide from top', supportsIntensity: false, defaultDuration: 600, availableTargets: ['title', 'subtitle', 'cta', 'media'] },
    { id: 'slide-left', name: 'Slide Left', description: 'Slide from right', supportsIntensity: false, defaultDuration: 600, availableTargets: ['title', 'subtitle', 'cta', 'media'] },
    { id: 'slide-right', name: 'Slide Right', description: 'Slide from left', supportsIntensity: false, defaultDuration: 600, availableTargets: ['title', 'subtitle', 'cta', 'media'] },
    { id: 'zoom-in', name: 'Zoom In', description: 'Scale from small', supportsIntensity: false, defaultDuration: 700, availableTargets: ['title', 'subtitle', 'cta', 'media'] },
    { id: 'zoom-out', name: 'Zoom Out', description: 'Scale from large', supportsIntensity: false, defaultDuration: 700, availableTargets: ['title', 'subtitle', 'cta', 'media'] },
    { id: 'bounce-in', name: 'Bounce In', description: 'Bouncy entrance', supportsIntensity: false, defaultDuration: 900, availableTargets: ['title', 'subtitle', 'cta', 'media'] },
    { id: 'flip-x', name: 'Flip Horizontal', description: '3D horizontal flip', supportsIntensity: false, defaultDuration: 800, availableTargets: ['title', 'subtitle', 'cta', 'media'] },
    { id: 'flip-y', name: 'Flip Vertical', description: '3D vertical flip', supportsIntensity: false, defaultDuration: 800, availableTargets: ['title', 'subtitle', 'cta', 'media'] },
    { id: 'rotate-in', name: 'Rotate In', description: 'Rotate while entering', supportsIntensity: false, defaultDuration: 800, availableTargets: ['title', 'subtitle', 'cta', 'media'] },
    { id: 'elastic', name: 'Elastic', description: 'Elastic bounce', supportsIntensity: false, defaultDuration: 1000, availableTargets: ['title', 'subtitle', 'cta', 'media'] },
    { id: 'swing', name: 'Swing', description: 'Swing entrance', supportsIntensity: false, defaultDuration: 1000, availableTargets: ['title', 'subtitle', 'cta'] },
  ]

  // Effets texte (animations)
  const textEffectDefinitions: EffectDefinition[] = [
    { id: 'typing', name: 'Typing', description: 'Typewriter effect', supportsIntensity: false, defaultDuration: 2000, availableTargets: ['title', 'subtitle'] },
    { id: 'glitch', name: 'Glitch', description: 'Digital glitch', supportsIntensity: true, defaultDuration: 300, availableTargets: ['title', 'subtitle', 'cta'] },
    { id: 'neon', name: 'Neon Glow', description: 'Pulsing neon', supportsIntensity: true, defaultDuration: 2000, availableTargets: ['title', 'subtitle', 'cta'] },
    { id: 'rainbow', name: 'Rainbow', description: 'Color cycle', supportsIntensity: false, defaultDuration: 3000, availableTargets: ['title', 'subtitle', 'cta'] },
    { id: 'wave', name: 'Wave', description: 'Wave motion', supportsIntensity: true, defaultDuration: 1000, availableTargets: ['title', 'subtitle', 'cta'] },
    { id: 'bounce', name: 'Bounce', description: 'Bouncing text', supportsIntensity: true, defaultDuration: 1000, availableTargets: ['title', 'subtitle', 'cta'] },
    { id: 'shake', name: 'Shake', description: 'Shake effect', supportsIntensity: true, defaultDuration: 500, availableTargets: ['title', 'subtitle', 'cta'] },
    { id: 'pulse', name: 'Pulse', description: 'Scale pulsing', supportsIntensity: true, defaultDuration: 1500, availableTargets: ['title', 'subtitle', 'cta'] },
    { id: 'flicker', name: 'Flicker', description: 'Light flicker', supportsIntensity: true, defaultDuration: 500, availableTargets: ['title', 'subtitle', 'cta'] },
    { id: 'blur-in', name: 'Blur In', description: 'Blur focus', supportsIntensity: true, defaultDuration: 1000, availableTargets: ['title', 'subtitle', 'cta'] },
    { id: 'gradient-shift', name: 'Gradient Text', description: 'Animated gradient', supportsIntensity: false, defaultDuration: 3000, availableTargets: ['title', 'subtitle', 'cta'] },
  ]

  // Effets de fond (animations)
  const backgroundEffectDefinitions: EffectDefinition[] = [
    { id: 'gradient-shift', name: 'Gradient Shift', description: 'Moving gradient', supportsIntensity: true, defaultDuration: 8000, availableTargets: ['background'] },
    { id: 'particles', name: 'Particles', description: 'Floating particles', supportsIntensity: true, defaultDuration: 20000, availableTargets: ['background'] },
    { id: 'waves', name: 'Waves', description: 'Wave pattern', supportsIntensity: true, defaultDuration: 15000, availableTargets: ['background'] },
    { id: 'stars', name: 'Stars', description: 'Starfield effect', supportsIntensity: true, defaultDuration: 30000, availableTargets: ['background'] },
    { id: 'rain', name: 'Rain', description: 'Rain drops', supportsIntensity: true, defaultDuration: 1000, availableTargets: ['background'] },
    { id: 'snow', name: 'Snow', description: 'Falling snow', supportsIntensity: true, defaultDuration: 10000, availableTargets: ['background'] },
    { id: 'scan-lines', name: 'Scan Lines', description: 'Retro scan lines', supportsIntensity: true, defaultDuration: 0, availableTargets: ['background'] },
    { id: 'ken-burns', name: 'Ken Burns', description: 'Slow zoom pan', supportsIntensity: true, defaultDuration: 10000, availableTargets: ['background', 'media'] },
    { id: 'parallax', name: 'Parallax', description: 'Depth parallax', supportsIntensity: true, defaultDuration: 0, availableTargets: ['background', 'media'] },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newMedia: MediaItem = {
          id: Math.random().toString(36).substr(2, 9),
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: e.target?.result as string,
          name: file.name,
        }
        setUploadedMedia((prev) => [...prev, newMedia])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveMedia = (id: string) => {
    setUploadedMedia((prev) => prev.filter((m) => m.id !== id))
    if (selectedMedia?.id === id) {
      setSelectedMedia(null)
    }
  }

  const handleCopyCode = () => {
    const code = `Visuel généré pour ${selectedFormat?.name}`
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Helper functions for effects
  const toggleEffect = (category: 'visual' | 'entrance' | 'text' | 'background', effectId: string) => {
    const stateSetter = {
      visual: setVisualEffects,
      entrance: setEntranceEffects,
      text: setTextEffects,
      background: setBackgroundEffects,
    }[category]

    const effectDefinitions = {
      visual: visualEffectDefinitions,
      entrance: entranceEffectDefinitions,
      text: textEffectDefinitions,
      background: backgroundEffectDefinitions,
    }[category]

    const definition = effectDefinitions.find(e => e.id === effectId)
    if (!definition) return

    stateSetter(prev => {
      const exists = prev[effectId]
      if (exists) {
        const { [effectId]: _, ...rest } = prev
        return rest
      }

      return {
        ...prev,
        [effectId]: {
          id: effectId,
          enabled: true,
          targets: {
            title: definition.availableTargets.includes('title'),
            subtitle: definition.availableTargets.includes('subtitle'),
            cta: definition.availableTargets.includes('cta'),
            media: definition.availableTargets.includes('media'),
            background: definition.availableTargets.includes('background'),
          },
          duration: definition.defaultDuration,
          delay: 0,
          intensity: 50,
        }
      }
    })
  }

  const updateEffectConfig = (
    category: 'visual' | 'entrance' | 'text' | 'background',
    effectId: string,
    updates: Partial<EffectConfig>
  ) => {
    const stateSetter = {
      visual: setVisualEffects,
      entrance: setEntranceEffects,
      text: setTextEffects,
      background: setBackgroundEffects,
    }[category]

    stateSetter(prev => ({
      ...prev,
      [effectId]: {
        ...prev[effectId],
        ...updates,
      }
    }))
  }

  const getEffectClasses = (target: 'title' | 'subtitle' | 'cta' | 'media' | 'background') => {
    const classes: string[] = []

    // Entrance effects
    Object.values(entranceEffects).forEach(effect => {
      if (effect.enabled && effect.targets[target]) {
        classes.push(`animate-${effect.id}`)
      }
    })

    // Text effects (only for text elements)
    if (['title', 'subtitle', 'cta'].includes(target)) {
      Object.values(textEffects).forEach(effect => {
        if (effect.enabled && effect.targets[target]) {
          classes.push(`animate-text-${effect.id}`)
        }
      })
    }

    // Effets d'arrière-plan
    if (target === 'background') {
      Object.values(backgroundEffects).forEach(effect => {
        if (effect.enabled && effect.targets[target]) {
          classes.push(`animate-bg-${effect.id}`)
        }
      })
    }

    return classes.join(' ')
  }

  const getEffectStyles = (target: 'title' | 'subtitle' | 'cta' | 'media' | 'background') => {
    let styles: React.CSSProperties = {}
    let filters: string[] = []

    // Visual effects
    Object.entries(visualEffects).forEach(([id, config]) => {
      if (!config.enabled || !config.targets[target]) return

      const intensity = config.intensity / 100

      switch (id) {
        case 'blur':
          filters.push(`blur(${intensity * 10}px)`)
          break
        case 'grayscale':
          filters.push(`grayscale(${intensity})`)
          break
        case 'sepia':
          filters.push(`sepia(${intensity})`)
          break
        case 'contrast':
          filters.push(`contrast(${1 + intensity})`)
          break
        case 'brightness':
          filters.push(`brightness(${1 + intensity})`)
          break
        case 'saturate':
          filters.push(`saturate(${1 + intensity})`)
          break
        case 'glow':
          filters.push(`drop-shadow(0 0 ${intensity * 20}px rgba(139, 92, 246, 0.8))`)
          break
        case 'invert':
          filters.push(`invert(${intensity})`)
          break
        case 'hue-rotate':
          filters.push(`hue-rotate(${intensity * 360}deg)`)
          break
        case 'opacity':
          styles.opacity = intensity
          break
        case 'shadow':
          styles.textShadow = `0 0 ${intensity * 20}px rgba(0, 0, 0, 0.5)`
          break
      }
    })

    if (filters.length > 0) {
      styles.filter = filters.join(' ')
    }

    // Animation durations and delays
    const allEffects = [...Object.values(entranceEffects), ...Object.values(textEffects), ...Object.values(backgroundEffects)]
    const activeEffects = allEffects.filter(e => e.enabled && e.targets[target])

    if (activeEffects.length > 0) {
      const firstEffect = activeEffects[0]
      styles.animationDuration = `${firstEffect.duration}ms`
      styles.animationDelay = `${firstEffect.delay}ms`
    }

    return styles
  }

  const getGradientStyle = () => {
    const intensity = gradientIntensity / 100

    // Utiliser les couleurs customisées
    const adjustedColors = customGradientColors.map(color => {
      // Ajuster l'intensité de chaque couleur
      const hex = color.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)

      const adjustedR = Math.round(r * intensity)
      const adjustedG = Math.round(g * intensity)
      const adjustedB = Math.round(b * intensity)

      return `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`
    })

    return {
      background: `linear-gradient(${gradientAngle}deg, ${adjustedColors.join(', ')})`
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setCustomGradientColors([...template.colors])
    }
  }

  const handleAddGradientColor = () => {
    if (customGradientColors.length < 5) {
      setCustomGradientColors([...customGradientColors, '#8B5CF6'])
    }
  }

  const handleRemoveGradientColor = (index: number) => {
    if (customGradientColors.length > 2) {
      const newColors = customGradientColors.filter((_, i) => i !== index)
      setCustomGradientColors(newColors)
    }
  }

  const handleUpdateGradientColor = (index: number, color: string) => {
    const newColors = [...customGradientColors]
    newColors[index] = color
    setCustomGradientColors(newColors)
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-16 -left-24 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-12 -right-28 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative z-10">
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/ads/dashboard')}
                className="p-2 glass-effect rounded-xl hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-display font-bold gradient-text">Créateur Social Media</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Composez des visuels publicitaires prêts pour chaque réseau social
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-6 space-y-4">
          {showTestBanner && (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-100">
              <div>
                <p className="text-sm font-semibold">Environnement de démonstration</p>
                <p className="text-xs text-amber-200/80">
                  Les données saisies sont automatiquement réinitialisées. Vous pouvez masquer cet avertissement une fois informé.
                </p>
              </div>
              <button
                onClick={handleDismissBanner}
                className="flex items-center gap-1 rounded-lg border border-amber-400/40 px-2 py-1 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Fermer
              </button>
            </div>
          )}

          {/* Format Selection */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-display font-bold">1. Choisir un format</h2>
              <p className="text-sm text-gray-400">Sélectionnez le réseau cible pour adapter les dimensions.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {formats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    selectedFormat?.id === format.id
                      ? 'bg-purple-500/10 border-purple-500/50 scale-105'
                      : 'glass-effect border-white/10 hover:border-white/20 hover:scale-102'
                  }`}
                >
                  <div className="font-semibold mb-1 text-sm">{format.name}</div>
                  <div className="text-xs text-gray-500">
                    {format.width} × {format.height}
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500">{format.description}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedFormat && (
            <div className="space-y-4">
              <div className="glass-effect rounded-xl border border-white/10 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  {workflowSteps.map((step, index) => {
                    const isActive = step.id === currentStepId
                    const isCompleted = index < currentStepIndex
                    const isExportStep = step.id === 'export'
                    const isUpcoming = !isActive && !isCompleted

                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          isActive
                            ? 'border-purple-400/60 bg-purple-500/20 text-purple-200'
                            : isCompleted || (isExportStep && copied)
                              ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                              : 'border-white/10 bg-white/5 text-gray-400'
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                            isCompleted || (isExportStep && copied)
                              ? 'bg-emerald-500/20 text-emerald-200'
                              : isActive
                                ? 'bg-purple-500/30 text-purple-200'
                                : 'bg-white/10 text-gray-300'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span>{step.label}</span>
                        {isUpcoming && !isExportStep && <span className="text-[10px] uppercase tracking-wide text-gray-500">à venir</span>}
                        {isExportStep && !copied && (
                          <span className="text-[10px] uppercase tracking-wide text-gray-500">
                            prêt
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
              {/* Left Panel - Controls */}
              <div className="space-y-3">
                {/* Tabs */}
                <div className="glass-effect rounded-xl p-1.5 border border-white/10">
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'content', icon: Type, label: 'Contenu' },
                      { id: 'media', icon: ImageIcon, label: 'Média' },
                      { id: 'effects', icon: Sparkles, label: 'Effets' },
                      { id: 'style', icon: Palette, label: 'Style' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                          activeTab === tab.id
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'hover:bg-white/5 text-gray-400'
                        }`}
                      >
                        <tab.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="glass-effect rounded-xl p-3 border border-white/10 max-h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar">
                  
                    
                  {activeTab === 'content' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold mb-1.5">Textes &amp; messages</h3>
                        <p className="text-xs text-gray-400">
                          Tous les champs se mettent à jour en direct dans l&apos;aperçu.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1.5">
                            Titre principal
                          </label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Saisissez un titre accrocheur"
                            maxLength={titleLimit}
                            className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                          />
                          <div className="mt-1 flex items-center justify-between text-[11px]">
                            <span className="text-gray-500">Recommandé : {titleLimit} caractères max.</span>
                            <span
                              className={`font-semibold ${getCounterClass(titleRemaining)}`}
                              aria-live="polite"
                            >
                              {titleRemaining} restants
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1.5">
                            Sous-titre
                          </label>
                          <textarea
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="Complétez votre promesse ou détaillez l&apos;offre"
                            rows={2}
                            maxLength={subtitleLimit}
                            className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                          />
                          <div className="mt-1 flex items-center justify-between text-[11px]">
                            <span className="text-gray-500">{subtitleLimit} caractères conseillés.</span>
                            <span
                              className={`font-semibold ${getCounterClass(subtitleRemaining)}`}
                              aria-live="polite"
                            >
                              {subtitleRemaining} restants
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1.5">
                            Appel à l&apos;action
                          </label>
                          <input
                            type="text"
                            value={cta}
                            onChange={(e) => setCta(e.target.value)}
                            placeholder="Ex. Télécharger maintenant, Découvrir l&apos;offre"
                            maxLength={ctaLimit}
                            className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                          />
                          <div className="mt-1 flex items-center justify-between text-[11px]">
                            <span className="text-gray-500">{ctaLimit} caractères maximum.</span>
                            <span
                              className={`font-semibold ${getCounterClass(ctaRemaining)}`}
                              aria-live="polite"
                            >
                              {ctaRemaining} restants
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 border-t border-white/10 pt-3">
                        <div className="flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-purple-400" />
                          <h4 className="text-xs font-semibold text-purple-400">Personnalisation typographique</h4>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-medium text-gray-300">Taille du titre</label>
                              <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg">
                                {titleSize}px
                              </span>
                            </div>
                            <input
                              type="range"
                              min="20"
                              max="120"
                              step="1"
                              value={titleSize}
                              onChange={(e) => setTitleSize(Number(e.target.value))}
                              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-purple-500/50"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-medium text-gray-300">Position verticale</label>
                              <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg">
                                {textVerticalPosition}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="1"
                              value={textVerticalPosition}
                              onChange={(e) => setTextVerticalPosition(Number(e.target.value))}
                              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-purple-500/50"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">Alignement du bloc texte</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'left', label: 'Gauche', icon: AlignLeft },
                                { id: 'center', label: 'Centre', icon: AlignCenter },
                                { id: 'right', label: 'Droite', icon: AlignRight },
                              ].map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => setTextAlignment(option.id as 'left' | 'center' | 'right')}
                                  aria-pressed={textAlignment === option.id}
                                  className={`flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                                    textAlignment === option.id
                                      ? 'border-purple-400/60 bg-purple-500/20 text-purple-200'
                                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                                  }`}
                                >
                                  <option.icon className="h-4 w-4" />
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">Police de caractères</label>
                            <div className="grid grid-cols-2 gap-2">
                              {fontOptions.map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => setFontFamily(option.id)}
                                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                                    fontFamily === option.id
                                      ? 'border-purple-400/60 bg-purple-500/15 text-white'
                                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                                  }`}
                                  style={{ fontFamily: option.stack }}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
{activeTab === 'media' && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold mb-2">Bibliothèque média</h3>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl hover:border-purple-500/50 transition-colors flex flex-col items-center gap-2 text-gray-400 hover:text-purple-400"
                      >
                        <Upload className="w-6 h-6" />
                        <span className="text-sm font-medium">Importer des images ou des vidéos</span>
                        <span className="text-xs">Formats acceptés : PNG, JPG, WebP, MP4, WebM</span>
                      </button>

                      {uploadedMedia.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-400">Médias importés</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {uploadedMedia.map((media) => (
                              <div
                                key={media.id}
                                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                  selectedMedia?.id === media.id
                                    ? 'border-purple-500 scale-105'
                                    : 'border-white/10 hover:border-white/30'
                                }`}
                                onClick={() => setSelectedMedia(media)}
                              >
                                {media.type === 'image' ? (
                                  <img
                                    src={media.url}
                                    alt={media.name}
                                    className="w-full h-24 object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-24 bg-white/5 flex items-center justify-center">
                                    <Video className="w-8 h-8 text-gray-400" />
                                  </div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveMedia(media.id)
                                  }}
                                  className="absolute top-1 right-1 p-1 bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Media Customization */}
                      {selectedMedia && (
                        <div className="pt-2 border-t border-white/10">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Sliders className="w-3.5 h-3.5 text-purple-400" />
                            <h4 className="text-xs font-semibold text-purple-400">Réglages du média</h4>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-300">
                                  Opacité
                                </label>
                                <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg">
                                  {mediaOpacity}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={mediaOpacity}
                                onChange={(e) => setMediaOpacity(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-purple-500/50"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-300">
                                  Flou de fond
                                </label>
                                <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg">
                                  {mediaBlur}px
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="20"
                                step="1"
                                value={mediaBlur}
                                onChange={(e) => setMediaBlur(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-purple-500/50"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-300">
                                  Intensité du voile
                                </label>
                                <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg">
                                  {overlayDarkness}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={overlayDarkness}
                                onChange={(e) => setOverlayDarkness(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-purple-500/50"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-300">
                                  Zoom arrière-plan
                                </label>
                                <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg">
                                  {backgroundScale}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="100"
                                max="150"
                                step="1"
                                value={backgroundScale}
                                onChange={(e) => setBackgroundScale(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-purple-500/50"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'effects' && (
                    <div className="space-y-2">
                      {/* Visual Effects Accordion */}
                      <div className="border border-purple-500/30 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setOpenEffectCategory(openEffectCategory === 'visual' ? null : 'visual')}
                          className="w-full flex items-center justify-between p-2.5 bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-bold text-purple-400">Filtres visuels</span>
                            <span className="text-xs text-gray-400">({Object.keys(visualEffects).length} actifs)</span>
                          </div>
                          {openEffectCategory === 'visual' ? (
                            <ChevronUp className="w-4 h-4 text-purple-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-purple-400" />
                          )}
                        </button>
                        {openEffectCategory === 'visual' && (
                          <div className="p-2 space-y-2 bg-white/5">
                            {visualEffectDefinitions.map((def) => {
                              const config = visualEffects[def.id]
                              const requiresMediaAsset = def.availableTargets.every((target) => target === 'media')
                              const disableToggle = requiresMediaAsset && !selectedMedia
                              return (
                                <div key={def.id} className="glass-effect rounded-lg p-2 border border-white/10">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <h4 className="text-xs font-bold text-white">{def.name}</h4>
                                      <p className="text-xs text-gray-400">{def.description}</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => toggleEffect('visual', def.id)}
                                      disabled={disableToggle}
                                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                        config?.enabled
                                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                                          : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                                      } ${disableToggle ? 'cursor-not-allowed opacity-40' : ''}`}
                                    >
                                      {config?.enabled ? 'ACTIF' : 'INACTIF'}
                                    </button>
                                  </div>
                                  {disableToggle && (
                                    <p className="text-[11px] text-amber-300/80">
                                      Importez un média pour appliquer ce filtre.
                                    </p>
                                  )}
                                  {config?.enabled && (
                                    <div className="space-y-2 mt-2 pt-2 border-t border-white/10">
                                      {/* Targets */}
                                      <div>
                                        <label className="text-xs font-medium text-gray-300 mb-1 block">Appliquer sur :</label>
                                        <div className="flex flex-wrap gap-1.5">
                                          {def.availableTargets.map((target) => (
                                            <button
                                              key={effectTargetLabels[target] ?? target}
                                              onClick={() => updateEffectConfig('visual', def.id, {
                                                targets: { ...config.targets, [target]: !config.targets[target] }
                                              })}
                                              className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                                                config.targets[target]
                                                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                                                  : 'bg-white/5 text-gray-500 border border-white/10'
                                              }`}
                                            >
                                              {effectTargetLabels[target] ?? target}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                      {/* Intensité */}
                                      {def.supportsIntensity && (
                                        <div>
                                          <div className="flex items-center justify-between mb-1">
                                            <label className="text-xs font-medium text-gray-300">Intensité</label>
                                            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                                              {config.intensity}%
                                            </span>
                                          </div>
                                          <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={config.intensity}
                                            onChange={(e) => updateEffectConfig('visual', def.id, { intensity: Number(e.target.value) })}
                                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Entrance Effects Accordion */}
                      <div className="border border-blue-500/30 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setOpenEffectCategory(openEffectCategory === 'entrance' ? null : 'entrance')}
                          className="w-full flex items-center justify-between p-2.5 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <RotateCw className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-bold text-blue-400">Animations d’entrée</span>
                            <span className="text-xs text-gray-400">({Object.keys(entranceEffects).length} actifs)</span>
                          </div>
                          {openEffectCategory === 'entrance' ? (
                            <ChevronUp className="w-4 h-4 text-blue-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-blue-400" />
                          )}
                        </button>
                        {openEffectCategory === 'entrance' && (
                          <div className="p-2 space-y-2 bg-white/5">
                            {entranceEffectDefinitions.map((def) => {
                              const config = entranceEffects[def.id]
                              const hasApplicableTarget = def.availableTargets.some((target) => {
                                if (target === 'media') return !!selectedMedia
                                if (target === 'title') return Boolean(title)
                                if (target === 'subtitle') return Boolean(subtitle)
                                if (target === 'cta') return Boolean(cta)
                                return false
                              })
                              const disableToggle = !hasApplicableTarget
                              return (
                                <div key={def.id} className="glass-effect rounded-lg p-2 border border-white/10">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <h4 className="text-xs font-bold text-white">{def.name}</h4>
                                      <p className="text-xs text-gray-400">{def.description}</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => toggleEffect('entrance', def.id)}
                                      disabled={disableToggle}
                                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                        config?.enabled
                                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                          : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                                      } ${disableToggle ? 'cursor-not-allowed opacity-40' : ''}`}
                                    >
                                      {config?.enabled ? 'ACTIF' : 'INACTIF'}
                                    </button>
                                  </div>
                                  {disableToggle && (
                                    <p className="text-[11px] text-amber-300/80">
                                      Ajoutez un texte ou un média pour activer cette animation.
                                    </p>
                                  )}
                                  {config?.enabled && (
                                    <div className="space-y-2 mt-2 pt-2 border-t border-white/10">
                                      {/* Targets */}
                                      <div>
                                        <label className="text-xs font-medium text-gray-300 mb-1 block">Appliquer sur :</label>
                                        <div className="flex flex-wrap gap-1.5">
                                          {def.availableTargets.map((target) => (
                                            <button
                                              key={effectTargetLabels[target] ?? target}
                                              onClick={() => updateEffectConfig('entrance', def.id, {
                                                targets: { ...config.targets, [target]: !config.targets[target] }
                                              })}
                                              className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                                                config.targets[target]
                                                  ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                                                  : 'bg-white/5 text-gray-500 border border-white/10'
                                              }`}
                                            >
                                              {effectTargetLabels[target] ?? target}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                      {/* Durée */}
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <label className="text-xs font-medium text-gray-300">Durée</label>
                                          <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                                            {config.duration}ms
                                          </span>
                                        </div>
                                        <input
                                          type="range"
                                          min="200"
                                          max="3000"
                                          step="100"
                                          value={config.duration}
                                          onChange={(e) => updateEffectConfig('entrance', def.id, { duration: Number(e.target.value) })}
                                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/50"
                                        />
                                      </div>
                                      {/* Délai */}
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <label className="text-xs font-medium text-gray-300">Délai</label>
                                          <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                                            {config.delay}ms
                                          </span>
                                        </div>
                                        <input
                                          type="range"
                                          min="0"
                                          max="2000"
                                          step="100"
                                          value={config.delay}
                                          onChange={(e) => updateEffectConfig('entrance', def.id, { delay: Number(e.target.value) })}
                                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/50"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Effets texte Accordion */}
                      <div className="border border-pink-500/30 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setOpenEffectCategory(openEffectCategory === 'text' ? null : 'text')}
                          className="w-full flex items-center justify-between p-2.5 bg-pink-500/10 hover:bg-pink-500/20 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Type className="w-4 h-4 text-pink-400" />
                            <span className="text-sm font-bold text-pink-400">Animations de texte</span>
                            <span className="text-xs text-gray-400">({Object.keys(textEffects).length} actifs)</span>
                          </div>
                          {openEffectCategory === 'text' ? (
                            <ChevronUp className="w-4 h-4 text-pink-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-pink-400" />
                          )}
                        </button>
                        {openEffectCategory === 'text' && (
                          <div className="p-2 space-y-2 bg-white/5">
                            {textEffectDefinitions.map((def) => {
                              const config = textEffects[def.id]
                              const hasApplicableTarget = def.availableTargets.some((target) => {
                                if (target === 'title') return Boolean(title)
                                if (target === 'subtitle') return Boolean(subtitle)
                                if (target === 'cta') return Boolean(cta)
                                return false
                              })
                              const disableToggle = !hasApplicableTarget
                              return (
                                <div key={def.id} className="glass-effect rounded-lg p-2 border border-white/10">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <h4 className="text-xs font-bold text-white">{def.name}</h4>
                                      <p className="text-xs text-gray-400">{def.description}</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => toggleEffect('text', def.id)}
                                      disabled={disableToggle}
                                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                        config?.enabled
                                          ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                                          : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                                      } ${disableToggle ? 'cursor-not-allowed opacity-40' : ''}`}
                                    >
                                      {config?.enabled ? 'ACTIF' : 'INACTIF'}
                                    </button>
                                  </div>
                                  {disableToggle && (
                                    <p className="text-[11px] text-amber-300/80">
                                      Ajoutez un titre, un sous-titre ou un CTA pour tester cet effet.
                                    </p>
                                  )}
                                  {config?.enabled && (
                                    <div className="space-y-2 mt-2 pt-2 border-t border-white/10">
                                      {/* Targets */}
                                      <div>
                                        <label className="text-xs font-medium text-gray-300 mb-1 block">Appliquer sur :</label>
                                        <div className="flex flex-wrap gap-1.5">
                                          {def.availableTargets.map((target) => (
                                            <button
                                              key={effectTargetLabels[target] ?? target}
                                              onClick={() => updateEffectConfig('text', def.id, {
                                                targets: { ...config.targets, [target]: !config.targets[target] }
                                              })}
                                              className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                                                config.targets[target]
                                                  ? 'bg-pink-500/30 text-pink-300 border border-pink-500/50'
                                                  : 'bg-white/5 text-gray-500 border border-white/10'
                                              }`}
                                            >
                                              {effectTargetLabels[target] ?? target}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                      {/* Durée */}
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <label className="text-xs font-medium text-gray-300">Durée</label>
                                          <span className="text-xs font-bold text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded">
                                            {config.duration}ms
                                          </span>
                                        </div>
                                        <input
                                          type="range"
                                          min="200"
                                          max="5000"
                                          step="100"
                                          value={config.duration}
                                          onChange={(e) => updateEffectConfig('text', def.id, { duration: Number(e.target.value) })}
                                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-pink-500/50"
                                        />
                                      </div>
                                      {/* Délai */}
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <label className="text-xs font-medium text-gray-300">Délai</label>
                                          <span className="text-xs font-bold text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded">
                                            {config.delay}ms
                                          </span>
                                        </div>
                                        <input
                                          type="range"
                                          min="0"
                                          max="2000"
                                          step="100"
                                          value={config.delay}
                                          onChange={(e) => updateEffectConfig('text', def.id, { delay: Number(e.target.value) })}
                                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-pink-500/50"
                                        />
                                      </div>
                                      {/* Intensité */}
                                      {def.supportsIntensity && (
                                        <div>
                                          <div className="flex items-center justify-between mb-1">
                                            <label className="text-xs font-medium text-gray-300">Intensité</label>
                                            <span className="text-xs font-bold text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded">
                                              {config.intensity}%
                                            </span>
                                          </div>
                                          <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={config.intensity}
                                            onChange={(e) => updateEffectConfig('text', def.id, { intensity: Number(e.target.value) })}
                                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-pink-500/50"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Effets de fond Accordion */}
                      <div className="border border-green-500/30 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setOpenEffectCategory(openEffectCategory === 'background' ? null : 'background')}
                          className="w-full flex items-center justify-between p-2.5 bg-green-500/10 hover:bg-green-500/20 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-bold text-green-400">Effets de fond</span>
                            <span className="text-xs text-gray-400">({Object.keys(backgroundEffects).length} actifs)</span>
                          </div>
                          {openEffectCategory === 'background' ? (
                            <ChevronUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-green-400" />
                          )}
                        </button>
                        {openEffectCategory === 'background' && (
                          <div className="p-2 space-y-2 bg-white/5">
                            {backgroundEffectDefinitions.map((def) => {
                              const config = backgroundEffects[def.id]
                              return (
                                <div key={def.id} className="glass-effect rounded-lg p-2 border border-white/10">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <h4 className="text-xs font-bold text-white">{def.name}</h4>
                                      <p className="text-xs text-gray-400">{def.description}</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => toggleEffect('background', def.id)}
                                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                        config?.enabled
                                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                          : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                                      }`}
                                    >
                                      {config?.enabled ? 'ACTIF' : 'INACTIF'}
                                    </button>
                                  </div>
                                  {config?.enabled && (
                                    <div className="space-y-2 mt-2 pt-2 border-t border-white/10">
                                      {/* Targets */}
                                      <div>
                                        <label className="text-xs font-medium text-gray-300 mb-1 block">Appliquer sur :</label>
                                        <div className="flex flex-wrap gap-1.5">
                                          {def.availableTargets.map((target) => (
                                            <button
                                              key={effectTargetLabels[target] ?? target}
                                              onClick={() => updateEffectConfig('background', def.id, {
                                                targets: { ...config.targets, [target]: !config.targets[target] }
                                              })}
                                              className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                                                config.targets[target]
                                                  ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                                                  : 'bg-white/5 text-gray-500 border border-white/10'
                                              }`}
                                            >
                                              {effectTargetLabels[target] ?? target}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                      {/* Durée */}
                                      {def.defaultDuration > 0 && (
                                        <div>
                                          <div className="flex items-center justify-between mb-1">
                                            <label className="text-xs font-medium text-gray-300">Durée</label>
                                            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                                              {config.duration}ms
                                            </span>
                                          </div>
                                          <input
                                            type="range"
                                            min="1000"
                                            max="30000"
                                            step="1000"
                                            value={config.duration}
                                            onChange={(e) => updateEffectConfig('background', def.id, { duration: Number(e.target.value) })}
                                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-green-500/50"
                                          />
                                        </div>
                                      )}
                                      {/* Intensité */}
                                      {def.supportsIntensity && (
                                        <div>
                                          <div className="flex items-center justify-between mb-1">
                                            <label className="text-xs font-medium text-gray-300">Intensité</label>
                                            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                                              {config.intensity}%
                                            </span>
                                          </div>
                                          <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={config.intensity}
                                            onChange={(e) => updateEffectConfig('background', def.id, { intensity: Number(e.target.value) })}
                                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-green-500/50"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'style' && (
                    <div className="space-y-3">
                      {/* Templates */}
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Thèmes colorés</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {displayedTemplates.map((template) => (
                            <button
                              key={template.id}
                              onClick={() => handleTemplateSelect(template.id)}
                              className={`relative p-3 rounded-lg overflow-hidden transition-all duration-300 ${
                                selectedTemplate === template.id
                                  ? 'ring-2 ring-purple-500 scale-105 shadow-lg shadow-purple-500/30'
                                  : 'hover:scale-102 hover:shadow-md'
                              }`}
                              style={{
                                background: `linear-gradient(135deg, ${template.colors.join(', ')})`
                              }}
                            >
                              <div className="relative z-10 backdrop-blur-sm bg-black/30 rounded-md p-1.5">
                                <span className="text-xs font-bold block text-center text-white drop-shadow-lg">
                                  {template.name}
                                </span>
                              </div>
                              {selectedTemplate === template.id && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        {!showAllTemplates && (
                          <button
                            onClick={() => setShowAllTemplates(true)}
                            className="w-full mt-2 py-1.5 glass-effect rounded-lg hover:bg-white/10 transition-all text-xs font-medium text-gray-400 hover:text-purple-400"
                          >
                            Afficher tout ({templates.length - 4} thèmes)
                          </button>
                        )}
                        {showAllTemplates && (
                          <button
                            onClick={() => setShowAllTemplates(false)}
                            className="w-full mt-2 py-1.5 glass-effect rounded-lg hover:bg-white/10 transition-all text-xs font-medium text-gray-400 hover:text-purple-400"
                          >
                            Réduire la liste
                          </button>
                        )}
                      </div>

                      {/* Gradient Color Management */}
                      <div className="pt-2 border-t border-white/10">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Palette className="w-3.5 h-3.5 text-purple-400" />
                          <h3 className="text-xs font-semibold text-purple-400">Couleurs personnalisées</h3>
                        </div>
                        <div className="space-y-1.5">
                          {customGradientColors.map((color, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                              <div className="relative">
                                <input
                                  type="color"
                                  value={color}
                                  onChange={(e) => handleUpdateGradientColor(index, e.target.value)}
                                  className="w-9 h-9 rounded-md cursor-pointer border border-white/20 hover:border-purple-500 transition-all"
                                  style={{ backgroundColor: color }}
                                />
                              </div>
                              <div className="flex-1 bg-white/5 border border-white/10 rounded-md px-2 py-1.5 text-xs font-mono text-gray-300 hover:bg-white/10 transition-colors">
                                {color.toUpperCase()}
                              </div>
                              {customGradientColors.length > 2 && (
                                <button
                                  onClick={() => handleRemoveGradientColor(index)}
                                  className="p-1.5 glass-effect rounded-md hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 transition-all"
                                  title="Supprimer la couleur"
                                >
                                  <Minus className="w-3 h-3 text-red-400" />
                                </button>
                              )}
                            </div>
                          ))}
                          {customGradientColors.length < 5 && (
                            <button
                              onClick={handleAddGradientColor}
                              className="w-full py-1.5 glass-effect rounded-md border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all flex items-center justify-center gap-1.5 text-xs font-medium text-gray-400 hover:text-purple-400"
                            >
                              <Plus className="w-3 h-3" />
                              Ajouter une couleur
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Réglages du dégradé */}
                      <div className="pt-2 border-t border-white/10">
                        <div className="flex items-center gap-1.5 mb-2">
                          <RotateCw className="w-3.5 h-3.5 text-purple-400" />
                          <h4 className="text-xs font-semibold text-purple-400">Réglages du dégradé</h4>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm font-medium text-gray-300">
                            Activer le dégradé
                          </label>
                          <button
                            onClick={() => setGradientEnabled(!gradientEnabled)}
                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                              gradientEnabled ? 'bg-purple-500 shadow-lg shadow-purple-500/30' : 'bg-gray-600'
                            }`}
                          >
                            <div
                              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                gradientEnabled ? 'translate-x-7' : ''
                              }`}
                            />
                          </button>
                        </div>

                        {gradientEnabled && (
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-sm font-medium text-gray-300">
                                  Angle du dégradé
                                </label>
                                <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg">
                                  {gradientAngle}°
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="360"
                                step="1"
                                value={gradientAngle}
                                onChange={(e) => setGradientAngle(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-purple-500/50"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-300">
                                  Intensité du dégradé
                                </label>
                                <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg">
                                  {gradientIntensity}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="150"
                                step="1"
                                value={gradientIntensity}
                                onChange={(e) => setGradientIntensity(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-purple-500/50"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Color Pickers */}
                      <div className="pt-2 border-t border-white/10">
                        <h4 className="text-xs font-semibold text-gray-300 mb-1.5">Couleurs personnalisées</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Arrière-plan
                            </label>
                            <input
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="w-full h-9 rounded-md cursor-pointer border border-white/10 hover:border-purple-500/50 transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Couleur du texte
                            </label>
                            <input
                              type="color"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="w-full h-9 rounded-md cursor-pointer border border-white/10 hover:border-purple-500/50 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm glass-effect rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copié&nbsp;!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>

                  <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg hover:opacity-90 transition-opacity">
                    <Download className="w-3.5 h-3.5" />
                    <span>Exporter</span>
                  </button>
                </div>
              </div>

              {/* Right Panel - Preview */}
              <div className="flex items-start justify-center">
                <div className="inline-flex flex-col glass-effect rounded-xl p-3 border border-white/10 sticky top-6">
                  <div className="flex items-center justify-between mb-2 w-full">
                    <div>
                      <h3 className="text-sm font-semibold">{selectedFormat.name}</h3>
                      <p className="text-xs text-gray-400">
                        {selectedFormat.width} × {selectedFormat.height}px
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">Aperçu</span>
                    </div>
                  </div>

                  <div
                    className="relative rounded-lg overflow-hidden"
                    style={{
                      aspectRatio: `${selectedFormat.width} / ${selectedFormat.height}`,
                      maxHeight: 'calc(100vh - 200px)',
                      width: selectedFormat.height > selectedFormat.width ? '300px' : '100%',
                      maxWidth: selectedFormat.height > selectedFormat.width ? '300px' : '600px',
                      ...(gradientEnabled && !selectedMedia ? getGradientStyle() : {}),
                      backgroundColor: !gradientEnabled && !selectedMedia ? backgroundColor : undefined,
                    }}
                  >
                    {/* Effets d'arrière-plan */}
                    <div
                      className={`absolute inset-0 ${getEffectClasses('background')}`}
                      style={getEffectStyles('background')}
                    >
                      {selectedMedia && (
                        <div
                          className={`absolute inset-0 ${getEffectClasses('media')}`}
                          style={{
                            ...getEffectStyles('media'),
                            opacity: mediaOpacity / 100,
                          }}
                        >
                          {selectedMedia.type === 'image' ? (
                            <img
                              src={selectedMedia.url}
                              alt="Arrière-plan"
                              className="w-full h-full object-cover"
                              style={{
                                transform: `scale(${backgroundScale / 100})`,
                                filter: `blur(${mediaBlur}px)`,
                              }}
                            />
                          ) : (
                            <video
                              src={selectedMedia.url}
                              className="w-full h-full object-cover"
                              style={{
                                transform: `scale(${backgroundScale / 100})`,
                                filter: `blur(${mediaBlur}px)`,
                              }}
                              autoPlay
                              loop
                              muted
                            />
                          )}
                          <div
                            className="absolute inset-0"
                            style={{
                              background: gradientEnabled
                                ? `linear-gradient(${gradientAngle}deg, rgba(0,0,0,${overlayDarkness / 200}), rgba(0,0,0,${overlayDarkness / 100}))`
                                : `rgba(0, 0, 0, ${overlayDarkness / 100})`
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Content Overlay */}
                    <div
                      className={`relative z-10 h-full flex flex-col gap-4 px-12 ${alignmentClasses}`}
                      style={{
                        justifyContent: textVerticalPosition === 50 ? 'center' : 'flex-start',
                        paddingTop: textVerticalPosition !== 50 ? `${textVerticalPosition}%` : undefined,
                        fontFamily: currentFontStack,
                      }}
                    >
                      {title && (
                        <h1
                          className={`font-display font-bold mb-4 ${getEffectClasses('title')}`}
                          style={{
                            ...getEffectStyles('title'),
                            color: textColor,
                            fontSize: `${titleSize}px`,
                            lineHeight: 1.2,
                          }}
                        >
                          {title}
                        </h1>
                      )}

                      {subtitle && (
                        <p
                          className={`opacity-90 ${getEffectClasses('subtitle')}`}
                          style={{
                            ...getEffectStyles('subtitle'),
                            color: textColor,
                            fontSize: `${titleSize * 0.35}px`,
                            lineHeight: 1.4,
                          }}
                        >
                          {subtitle}
                        </p>
                      )}

                      {cta && (
                        <button
                          className={`px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors ${getEffectClasses('cta')} ${ctaAlignmentClass}`}
                          style={{
                            ...getEffectStyles('cta'),
                            fontSize: `${titleSize * 0.28}px`
                          }}
                        >
                          {cta}
                        </button>
                      )}

                      {!title && !subtitle && !cta && !selectedMedia && (
                        <div className="text-gray-500">
                          <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                          <p>Commencez à composer votre visuel</p>
                          <p className="text-sm mt-2">Ajoutez du contenu, un média, des effets ou choisissez un style</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  </div>
)
}
