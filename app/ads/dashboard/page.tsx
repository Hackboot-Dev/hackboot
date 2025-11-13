'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Image, Video, FileText, Sparkles } from 'lucide-react'

interface User {
  id: string
  username: string
  role: string
  permissions: string[]
}

export default function AdsDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('ads-token')

    if (!token) {
      router.push('/ads')
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUser(payload)
    } catch (error) {
      console.error('Invalid token:', error)
      router.push('/ads')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('ads-token')
    router.push('/ads')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const tools = [
    {
      id: 'social-images',
      name: 'Social Media Images',
      description: 'Generate images for social networks (Facebook, Instagram, Twitter)',
      icon: Image,
      gradient: 'from-blue-500 to-cyan-500',
      href: '/ads/dashboard/social-images',
      available: true,
    },
    {
      id: 'video-ads',
      name: 'Video Ads',
      description: 'Create video ads for YouTube, TikTok, and other platforms',
      icon: Video,
      gradient: 'from-purple-500 to-pink-500',
      href: '/ads/dashboard/video-ads',
      available: false,
    },
    {
      id: 'landing-pages',
      name: 'Landing Pages',
      description: 'Generate landing page mockups and prototypes',
      icon: FileText,
      gradient: 'from-orange-500 to-red-500',
      href: '/ads/dashboard/landing-pages',
      available: false,
    },
    {
      id: 'ai-generator',
      name: 'AI Content Generator',
      description: 'Generate ad copy and creative content with AI',
      icon: Sparkles,
      gradient: 'from-green-500 to-emerald-500',
      href: '/ads/dashboard/ai-generator',
      available: false,
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-16 -left-24 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-12 -right-28 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative z-10">
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-display font-bold gradient-text">ADS Dashboard</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Welcome back, <span className="text-purple-400">{user.username}</span>
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 glass-effect rounded-xl hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold mb-2">Creative Tools</h2>
            <p className="text-gray-400">Generate advertising content quickly and efficiently</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className={`relative group ${
                  tool.available
                    ? 'cursor-pointer hover:scale-[1.02]'
                    : 'cursor-not-allowed opacity-60'
                } transition-all duration-300`}
                onClick={() => {
                  if (tool.available) {
                    router.push(tool.href)
                  }
                }}
              >
                <div className="glass-effect rounded-2xl p-6 border border-white/10 h-full">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${tool.gradient} mb-4`}
                  >
                    <tool.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-display font-bold mb-2">{tool.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{tool.description}</p>

                  {!tool.available && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                      <span className="text-xs text-yellow-400 font-medium">Coming Soon</span>
                    </div>
                  )}

                  {tool.available && (
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm text-purple-400 font-medium">Open →</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 glass-effect rounded-2xl p-6 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Quick Tips</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Use the Social Media Images tool to create ads in various formats</li>
                  <li>• All generated content is automatically optimized for web</li>
                  <li>• Export in PNG, WEBP, or JPG formats with custom dimensions</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
