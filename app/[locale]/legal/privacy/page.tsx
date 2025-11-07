'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import SiteHeader from '@/components/SiteHeader'
import { Shield } from 'lucide-react'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-24 bg-black" />,
  ssr: false,
})

export default function PrivacyPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/legal/privacy.md')
      .then((res) => res.text())
      .then((text) => {
        setContent(text)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error loading privacy policy:', err)
        setIsLoading(false)
      })
  }, [])

  const formatMarkdown = (text: string) => {
    return text
      .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold mb-6 mt-8 gradient-text">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-3xl font-bold mb-4 mt-8 text-white">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-2xl font-semibold mb-3 mt-6 text-gray-100">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-purple-400 hover:text-purple-300 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^- (.+)$/gm, '<li class="ml-6 mb-2">$1</li>')
      .replace(/^---$/gm, '<hr class="border-t border-white/10 my-8" />')
      .split('\n')
      .map((line) => {
        if (
          line.trim() &&
          !line.startsWith('#') &&
          !line.startsWith('-') &&
          !line.startsWith('<') &&
          !line.startsWith('---')
        ) {
          return `<p class="mb-4 text-gray-300 leading-relaxed">${line}</p>`
        }
        return line
      })
      .join('\n')
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SiteHeader />

      <div className="fixed inset-0 opacity-[0.05] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(56, 189, 248, 0.15), transparent 50%)',
          }}
        />
      </div>

      <main className="relative pt-28 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-purple-300 bg-white/5 border border-purple-500/40 rounded-full">
              <Shield className="w-4 h-4" />
              Document Légal
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-black">Politique de Confidentialité</h1>
          </div>

          <div className="glass-effect rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-12">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <div
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
