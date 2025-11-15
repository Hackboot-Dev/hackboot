import { Metadata } from 'next'
import { getPageMetadata } from '@/lib/metadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return getPageMetadata('/premium', locale as 'fr' | 'en' | 'et')
}

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
