import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
import AnimatedBackground from '@/components/AnimatedBackground'
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
  title: {
    default: 'Hackboot - Premium Cloud Gaming Platform | RTX 4090 & Anti-Cheat',
    template: '%s | Hackboot'
  },
  description: 'Revolutionary cloud gaming platform with RTX 4090 VMs, <5ms latency. Professional gaming solutions for Valorant, Warzone, Apex Legends. European GDPR-compliant infrastructure.',
  keywords: 'cloud gaming, cloud gaming platform, RTX 4090 cloud, gaming VM rental, valorant cloud gaming, warzone cloud hosting, low latency gaming, european gaming cloud, GDPR gaming cloud, anti-cheat bypass cloud, dedicated gaming servers, gaming VPS Europe, Estonia gaming cloud, VMCloud Group',
  authors: [{ name: 'Hackboot Team', url: 'https://hackboot.com' }],
  creator: 'Hackboot - VMCloud Group OÜ',
  publisher: 'VMCloud Group OÜ',
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/favicon.ico' },
    ],
  },
  openGraph: {
    title: 'Hackboot - Premium Cloud Gaming Platform | RTX 4090 & Anti-Cheat',
    description: 'Revolutionary cloud gaming platform with RTX 4090 VMs, <5ms latency. Professional gaming solutions for Valorant, Warzone, Apex Legends.',
    url: 'https://hackboot.com',
    siteName: 'Hackboot',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hackboot Cloud Gaming Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hackboot - Premium Cloud Gaming Platform',
    description: 'Revolutionary cloud gaming with RTX 4090 VMs, <5ms latency. Professional gaming solutions.',
    images: ['/og-image.png'],
    creator: '@hackboot',
  },
  verification: {
    google: 'google-site-verification-code-here',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6404SH7E8J"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6404SH7E8J');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <AnimatedBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}