import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://hackboot.com'),
  title: 'Hackboot - Innovation & Digital Excellence',
  description: 'Experience the future of digital innovation',
  keywords: 'innovation, technology, digital transformation, web development',
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>
        <div className="noise"></div>
        {children}
      </body>
    </html>
  )
}