import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import AnimatedBackground from '@/components/AnimatedBackground'
import TestDataBanner from '@/components/TestDataBanner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://hackboot.com'),
  title: 'Hackboot - Innovation & Digital Excellence',
  description: 'Experience the future of digital innovation',
  keywords: 'innovation, technology, digital transformation, web development',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#a855f7' },
    ],
  },
  openGraph: {
    title: 'Hackboot - Innovation & Digital Excellence',
    description: 'Experience the future of digital innovation',
    url: 'https://hackboot.com',
    siteName: 'Hackboot',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hackboot - Innovation & Digital Excellence',
    description: 'Experience the future of digital innovation',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>
        <TestDataBanner />
        <AnimatedBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}