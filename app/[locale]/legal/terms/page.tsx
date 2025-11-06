'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import SiteHeader from '@/components/SiteHeader'
import { FileText } from 'lucide-react'

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-24 bg-black" />,
  ssr: false,
})

export default function TermsPage() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/legal/terms.md')
      .then((res) => res.text())
      .then((text) => {
        setContent(text)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading terms:', err)
        setLoading(false)
      })
  }, [])

  // Simple markdown to HTML converter for basic formatting
  const formatMarkdown = (text: string) => {
    return text
      // H1
      .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold mb-6 mt-8 gradient-text">$1</h1>')
      // H2
      .replace(/^## (.+)$/gm, '<h2 class="text-3xl font-bold mb-4 mt-8 text-white">$1</h2>')
      // H3
      .replace(/^### (.+)$/gm, '<h3 class="text-2xl font-semibold mb-3 mt-6 text-gray-100">$1</h3>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-purple-400 hover:text-purple-300 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Lists
      .replace(/^- (.+)$/gm, '<li class="ml-6 mb-2">$1</li>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="border-t border-white/10 my-8" />')
      // Paragraphs (lines that don't start with #, -, or are empty)
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
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />

      <div className="fixed inset-0 opacity-[0.05] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(56, 189, 248, 0.15), transparent 50%)'
          }}
        />
      </div>

      <main className="relative pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-purple-300 bg-white/5 border border-purple-500/40 rounded-full">
              <FileText className="w-4 h-4" />
              Légal
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-black">
              Conditions Générales
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Conditions d&apos;Utilisation et de Vente
            </p>
          </div>

          <div className="glass-effect rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-12">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <div
                className="prose prose-invert max-w-none"
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
