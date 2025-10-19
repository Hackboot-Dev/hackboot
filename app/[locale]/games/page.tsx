'use client'

import { useEffect, useMemo, useState, type ComponentType } from 'react'
import { getAllGamingProducts, type GamingProduct } from '@/lib/gaming-products'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Search, X, Gamepad2, ArrowRight, Shield, Zap, Globe2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useI18n } from '@/lib/i18n-simple'
import ProductImage from '@/components/ProductImage'
import SiteHeader from '@/components/SiteHeader'
import DesignBackdrop from '@/components/DesignBackdrop'

type Metric = {
  id: string
  value: string
  label: string
}

type Highlight = {
  id: string
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
}

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-black" />,
  ssr: false,
})

export default function GamesPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { t } = useI18n()

  const [games, setGames] = useState<GamingProduct[]>([])
  const [filteredGames, setFilteredGames] = useState<GamingProduct[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const metricFallback: Metric[] = useMemo(
    () => [
      { id: 'catalog', value: '45+', label: 'Environnements optimisés' },
      { id: 'latency', value: '<5ms', label: 'Latence moyenne UE' },
      { id: 'uptime', value: '99.9%', label: 'Disponibilité prouvée' },
    ],
    [],
  )

  const metrics = useMemo(() => {
    const source = Array.isArray(t.games?.metrics) ? t.games?.metrics : []
    return metricFallback.map((metric) => {
      const match = source.find((item: Partial<Metric>) => item?.id === metric.id)
      return {
        ...metric,
        value: match?.value ?? metric.value,
        label: match?.label ?? metric.label,
      }
    })
  }, [metricFallback, t.games?.metrics])

  const highlights = useMemo<Highlight[]>(() => {
    const defaults = {
      ranked: {
        id: 'ranked',
        title: 'Rank Ready',
        description: 'Configurations calibrées pour les parties classées avec monitoring en direct.',
      },
      secure: {
        id: 'secure',
        title: 'Indétectable',
        description: 'Protections multi-couches, HWID safe et mises à jour automatiques sur chaque patch.',
      },
      global: {
        id: 'global',
        title: 'Multi-régions',
        description: 'Réseau mondial pour jouer avec une latence minimale où que soit votre team.',
      },
    }

    const source = Array.isArray(t.games?.highlights)
      ? (t.games.highlights as Array<Partial<Pick<Highlight, 'id' | 'title' | 'description'>>>)
      : []

    return [
      { base: defaults.ranked, icon: Zap },
      { base: defaults.secure, icon: Shield },
      { base: defaults.global, icon: Globe2 },
    ].map(({ base, icon }) => {
      const override = source.find((item) => item?.id === base.id) ?? {}
      return {
        id: base.id,
        icon,
        title: typeof override.title === 'string' ? override.title : base.title,
        description: typeof override.description === 'string' ? override.description : base.description,
      }
    })
  }, [t.games?.highlights])

  const ctaContent = useMemo(() => ({
    title: t.games?.cta?.title ?? 'Besoin d’un setup custom ?',
    description:
      t.games?.cta?.description ??
      'Nos architectes peuvent préparer un environnement dédié avec vos jeux, mods et outils préférés en moins de 24h.',
    primary: t.games?.cta?.primary ?? 'Parler à un expert',
    secondary: t.games?.cta?.secondary ?? 'Explorer Premium',
  }), [t.games?.cta])

  useEffect(() => {
    const allProducts = getAllGamingProducts()
    setGames(allProducts)
    setFilteredGames(allProducts)
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      setFilteredGames(
        games.filter(
          (game) =>
            game.name.toLowerCase().includes(query) ||
            game.game.toLowerCase().includes(query) ||
            game.description.toLowerCase().includes(query),
        ),
      )
    } else {
      setFilteredGames(games)
    }
  }, [searchQuery, games])

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white animate-fade-in">
      <DesignBackdrop variant="aqua" intensity="soft" />
      <div className="relative z-10">
        <SiteHeader />
        <main className="pt-28">
          <section className="container mx-auto px-6 pb-16">
            <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] items-start">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-5 py-2 glass-effect rounded-full border border-white/10">
                  <Gamepad2 className="w-4 h-4 text-cyan-300" />
                  <span className="text-sm font-medium text-cyan-100">{t.games?.badge || 'Catalogue gaming'}</span>
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 gradient-text">
                    {t.games?.title || 'Jeux optimisés'}
                  </h1>
                  <p className="text-xl text-gray-300 max-w-2xl">
                    {t.games?.subtitle || 'Accédez à nos environnements gaming optimisés pour les titres populaires.'}
                  </p>
                  <p className="mt-4 text-base text-gray-400 max-w-2xl">
                    {t.games?.description ||
                      "Sélectionnez un environnement calibré pour dominer vos scrims, vos ranked ou vos lans. Chaque build est maintenu à jour et sécurisé par nos équipes."}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {metrics.map((metric) => (
                    <div key={metric.id} className="glass-effect rounded-2xl px-6 py-5">
                      <div className="text-3xl font-bold text-white">{metric.value}</div>
                      <p className="text-sm text-gray-400">{metric.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/${locale}/premium`}
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-8 py-4 text-base font-semibold text-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/30"
                  >
                    {ctaContent.secondary}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/${locale}/contact`}
                    className="flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold glass-effect transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10"
                  >
                    {ctaContent.primary}
                  </Link>
                </div>
              </div>

              <div className="grid gap-6">
                {highlights.map((highlight) => {
                  const Icon = highlight.icon
                  return (
                    <div key={highlight.id} className="glass-effect rounded-3xl border border-white/10 p-6 backdrop-blur-xl">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                        <Icon className="h-6 w-6 text-cyan-200" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white">{highlight.title}</h3>
                      <p className="mt-2 text-sm text-gray-400">{highlight.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-12">
            <div className="glass-effect rounded-3xl border border-white/10 p-6 sm:p-8">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-gray-400 sm:block" />
                <input
                  type="text"
                  placeholder={t.games?.search || 'Rechercher un jeu...'}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/60 px-5 py-4 pl-12 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none sm:pl-14"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl p-2 text-gray-400 transition hover:bg-white/10"
                    aria-label={t.games?.clear || 'Effacer'}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-500">
                {filteredGames.length}{' '}
                {filteredGames.length > 1
                  ? t.games?.results?.plural || 'jeux disponibles'
                  : t.games?.results?.singular || 'jeu disponible'}
              </p>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-24">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/${locale}/products/${game.slug}`}
                  className="group glass-effect rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900/20 via-indigo-900/20 to-purple-900/20">
                    <ProductImage
                      productSlug={game.slug}
                      productName={game.name}
                      gameName={game.game}
                      fallbackImage={game.variants[0]?.image || '/images/valorant-hero.png'}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                      <h3 className="text-2xl font-semibold text-white transition-colors group-hover:text-cyan-300">
                        {game.name}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-2">{game.description}</p>
                    </div>
                    <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      <ArrowRight className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-5 py-4 text-xs text-gray-400">
                    <span className="uppercase tracking-wide text-cyan-300">{t.games?.available || 'Disponible'}</span>
                    <span>{game.game}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="container mx-auto px-6 pb-24">
            <div className="glass-effect rounded-3xl border border-white/10 p-8 text-center sm:p-12">
              <h2 className="text-3xl font-bold text-white md:text-4xl">{ctaContent.title}</h2>
              <p className="mt-4 text-base text-gray-400 md:text-lg">{ctaContent.description}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={`/${locale}/contact`}
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-8 py-4 text-base font-semibold text-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/30"
                >
                  {ctaContent.primary}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href={`/${locale}/premium`}
                  className="flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold glass-effect transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  {ctaContent.secondary}
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  )
}
