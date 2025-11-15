import { Metadata } from 'next'

const BASE_URL = 'https://hackboot.com'

type Locale = 'fr' | 'en' | 'et'

interface PageMetadata {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
}

const METADATA_BY_LOCALE: Record<string, Record<Locale, PageMetadata>> = {
  // Home page
  home: {
    fr: {
      title: 'Hackboot - Plateforme Cloud Gaming Premium | RTX 4090 & Anti-Cheat',
      description:
        'Plateforme cloud gaming révolutionnaire avec VMs RTX 4090, latence <5ms. Solutions gaming professionnelles pour Valorant, Warzone, Apex Legends. Infrastructure européenne GDPR.',
      keywords: [
        'cloud gaming',
        'cloud gaming platform',
        'RTX 4090 cloud',
        'gaming VM rental',
        'valorant cloud gaming',
        'warzone cloud hosting',
        'low latency gaming',
        'european gaming cloud',
        'GDPR gaming cloud',
        'anti-cheat bypass cloud',
        'dedicated gaming servers',
        'gaming VPS Europe',
      ],
      ogImage: '/og-images/home-fr.png',
    },
    en: {
      title: 'Hackboot - Premium Cloud Gaming Platform | RTX 4090 & Anti-Cheat',
      description:
        'Revolutionary cloud gaming platform with RTX 4090 VMs, <5ms latency. Professional gaming solutions for Valorant, Warzone, Apex Legends. European GDPR-compliant infrastructure.',
      keywords: [
        'cloud gaming',
        'cloud gaming platform',
        'RTX 4090 cloud',
        'gaming VM rental',
        'valorant cloud gaming',
        'warzone cloud hosting',
        'low latency gaming',
        'european gaming cloud',
        'GDPR gaming cloud',
        'anti-cheat bypass cloud',
        'dedicated gaming servers',
        'gaming VPS Europe',
      ],
      ogImage: '/og-images/home-en.png',
    },
    et: {
      title: 'Hackboot - Premium Cloud Gaming Platvorm | RTX 4090 & Anti-Cheat',
      description:
        'Revolutsiooniline cloud gaming platvorm RTX 4090 VMidega, <5ms latentsus. Professionaalsed gaming lahendused Valorant, Warzone, Apex Legends. Euroopa GDPR-nõuetele vastav taristu.',
      keywords: [
        'cloud gaming',
        'cloud gaming platform',
        'RTX 4090 cloud',
        'gaming VM rental',
        'valorant cloud gaming',
        'warzone cloud hosting',
        'low latency gaming',
        'european gaming cloud',
        'GDPR gaming cloud',
        'Estonia gaming cloud',
      ],
      ogImage: '/og-images/home-et.png',
    },
  },

  // Services page
  services: {
    fr: {
      title: 'Services Cloud Gaming Pro | Infrastructure & Sécurité | Hackboot',
      description:
        'Services professionnels cloud gaming : infrastructure 12 régions, GPU RTX 4090 dédiés, support 24/7, sécurité kernel-level. Solutions sur-mesure pour équipes esports et joueurs pro.',
      keywords: [
        'services cloud gaming',
        'infrastructure gaming professionnelle',
        'RTX 4090 dedicated servers',
        'esports cloud solutions',
        'gaming infrastructure Europe',
        '24/7 gaming support',
        'kernel-level security',
        'professional gaming VPS',
        'low ping gaming servers',
        'competitive gaming cloud',
      ],
    },
    en: {
      title: 'Pro Cloud Gaming Services | Infrastructure & Security | Hackboot',
      description:
        'Professional cloud gaming services: 12-region infrastructure, dedicated RTX 4090 GPUs, 24/7 support, kernel-level security. Custom solutions for esports teams and pro gamers.',
      keywords: [
        'cloud gaming services',
        'professional gaming infrastructure',
        'RTX 4090 dedicated servers',
        'esports cloud solutions',
        'gaming infrastructure Europe',
        '24/7 gaming support',
        'kernel-level security',
        'professional gaming VPS',
        'low ping gaming servers',
        'competitive gaming cloud',
      ],
    },
    et: {
      title: 'Pro Cloud Gaming Teenused | Infrastruktuur & Turvalisus | Hackboot',
      description:
        'Professionaalsed cloud gaming teenused: 12-piirkonna infrastruktuur, pühendatud RTX 4090 GPU-d, 24/7 tugi, kernel-taseme turvalisus.',
      keywords: [
        'cloud gaming services',
        'professional gaming infrastructure',
        'RTX 4090 dedicated servers',
        'esports cloud solutions',
        'Estonia gaming cloud',
      ],
    },
  },

  // Products page
  products: {
    fr: {
      title: 'Configurations Gaming Cloud | RTX 4090, 4080, 4070 Ti | Hackboot',
      description:
        'Découvrez nos configurations cloud gaming haute performance : RTX 4090 pour Valorant (400+ FPS), Warzone, Apex. VMs gaming optimisées avec latence garantie <5ms. À partir de 15€/mois.',
      keywords: [
        'gaming configurations cloud',
        'RTX 4090 gaming VM',
        'RTX 4080 cloud gaming',
        'valorant 400 fps cloud',
        'warzone cloud gaming',
        'apex legends cloud',
        'high performance gaming VM',
        'gaming VM pricing',
        'monthly gaming VPS',
        'hourly gaming servers',
      ],
    },
    en: {
      title: 'Cloud Gaming Configurations | RTX 4090, 4080, 4070 Ti | Hackboot',
      description:
        'Discover our high-performance cloud gaming configurations: RTX 4090 for Valorant (400+ FPS), Warzone, Apex. Optimized gaming VMs with guaranteed <5ms latency. From €15/month.',
      keywords: [
        'gaming configurations cloud',
        'RTX 4090 gaming VM',
        'RTX 4080 cloud gaming',
        'valorant 400 fps cloud',
        'warzone cloud gaming',
        'apex legends cloud',
        'high performance gaming VM',
        'gaming VM pricing',
        'monthly gaming VPS',
        'hourly gaming servers',
      ],
    },
    et: {
      title: 'Cloud Gaming Konfiguratsioonid | RTX 4090, 4080, 4070 Ti | Hackboot',
      description:
        'Avasta meie kõrge jõudlusega cloud gaming konfiguratsioonid: RTX 4090 Valorant (400+ FPS), Warzone, Apex. Optimeeritud gaming VMid garanteeritud <5ms latentsusega.',
      keywords: [
        'gaming configurations cloud',
        'RTX 4090 gaming VM',
        'valorant 400 fps cloud',
        'Estonia gaming cloud',
      ],
    },
  },

  // About page
  about: {
    fr: {
      title: 'Notre Histoire | VMCloud Group - Leader Cloud Gaming Europe | Hackboot',
      description:
        "De la marketplace gaming à la plateforme cloud révolutionnaire. 1500+ clients, 25+ pays, 99.9% uptime. Découvrez l'histoire de Hackboot et notre acquisition par VMCloud Group OÜ.",
      keywords: [
        'hackboot histoire',
        'VMCloud Group',
        'cloud gaming company',
        'Estonia tech company',
        'gaming platform history',
        'esports infrastructure provider',
        'European gaming leader',
        'ISO 27001 gaming',
        'SOC 2 compliance gaming',
      ],
    },
    en: {
      title: 'Our Story | VMCloud Group - European Cloud Gaming Leader | Hackboot',
      description:
        'From gaming marketplace to revolutionary cloud platform. 1500+ clients, 25+ countries, 99.9% uptime. Discover Hackboot history and our acquisition by VMCloud Group OÜ.',
      keywords: [
        'hackboot history',
        'VMCloud Group',
        'cloud gaming company',
        'Estonia tech company',
        'gaming platform history',
        'esports infrastructure provider',
        'European gaming leader',
        'ISO 27001 gaming',
        'SOC 2 compliance gaming',
      ],
    },
    et: {
      title: 'Meie Lugu | VMCloud Group - Euroopa Cloud Gaming Liider | Hackboot',
      description:
        'Mängude turuplatsist revolutsioonilise cloud platvormini. 1500+ klienti, 25+ riiki, 99.9% uptime. Avasta Hackboot ajalugu ja meie omandamine VMCloud Group OÜ poolt.',
      keywords: [
        'hackboot history',
        'VMCloud Group',
        'cloud gaming company',
        'Estonia tech company',
        'Estonian gaming platform',
      ],
    },
  },

  // Contact page
  contact: {
    fr: {
      title: 'Contact | Support 24/7 & Ventes | Hackboot Cloud Gaming',
      description:
        'Contactez notre équipe : support technique 24/7, devis personnalisé, questions commerciales. Temps de réponse <5 min. Email, téléphone, Discord disponibles.',
      keywords: [
        'contact hackboot',
        'support cloud gaming',
        '24/7 gaming support',
        'gaming technical support',
        'cloud gaming sales',
        'custom gaming quote',
        'gaming infrastructure contact',
      ],
    },
    en: {
      title: 'Contact | 24/7 Support & Sales | Hackboot Cloud Gaming',
      description:
        'Contact our team: 24/7 technical support, custom quote, business inquiries. <5 min response time. Email, phone, Discord available.',
      keywords: [
        'contact hackboot',
        'cloud gaming support',
        '24/7 gaming support',
        'gaming technical support',
        'cloud gaming sales',
        'custom gaming quote',
        'gaming infrastructure contact',
      ],
    },
    et: {
      title: 'Kontakt | 24/7 Tugi & Müük | Hackboot Cloud Gaming',
      description:
        'Võta ühendust meie meeskonnaga: 24/7 tehniline tugi, kohandatud pakkumine, äripäringud. <5 min vastuse aeg.',
      keywords: [
        'contact hackboot',
        'cloud gaming support',
        '24/7 gaming support',
        'Estonia gaming support',
      ],
    },
  },

  // Games page
  games: {
    fr: {
      title: 'Jeux Supportés | 100+ Jeux Cloud Gaming | Hackboot',
      description:
        'Catalogue complet de 100+ jeux supportés : Valorant, Warzone, Apex Legends, Fortnite, CS2, Overwatch 2, Destiny 2, Battlefield. Performances optimales garanties.',
      keywords: [
        'cloud gaming games',
        'valorant cloud',
        'warzone cloud',
        'apex legends cloud',
        'fortnite cloud gaming',
        'cs2 cloud gaming',
        'supported games cloud',
        'gaming catalog',
      ],
    },
    en: {
      title: 'Supported Games | 100+ Cloud Gaming Titles | Hackboot',
      description:
        'Complete catalog of 100+ supported games: Valorant, Warzone, Apex Legends, Fortnite, CS2, Overwatch 2, Destiny 2, Battlefield. Guaranteed optimal performance.',
      keywords: [
        'cloud gaming games',
        'valorant cloud',
        'warzone cloud',
        'apex legends cloud',
        'fortnite cloud gaming',
        'cs2 cloud gaming',
        'supported games cloud',
        'gaming catalog',
      ],
    },
    et: {
      title: 'Toetatud Mängud | 100+ Cloud Gaming Pealkirja | Hackboot',
      description:
        'Täielik kataloog 100+ toetatud mängust: Valorant, Warzone, Apex Legends, Fortnite, CS2, Overwatch 2, Destiny 2, Battlefield.',
      keywords: [
        'cloud gaming games',
        'valorant cloud',
        'supported games cloud',
      ],
    },
  },

  // Premium page
  premium: {
    fr: {
      title: 'Offres Premium Cloud Gaming | Plans & Tarifs | Hackboot',
      description:
        'Plans premium cloud gaming : Starter (15€/mois), Pro (45€/mois), Elite (120€/mois). RTX 4090, support prioritaire, 0% détection. Essai gratuit 7 jours.',
      keywords: [
        'cloud gaming pricing',
        'gaming subscription plans',
        'premium gaming cloud',
        'RTX 4090 pricing',
        'monthly gaming plans',
        'gaming cloud trial',
        'competitive gaming subscription',
      ],
    },
    en: {
      title: 'Premium Cloud Gaming Plans | Pricing & Plans | Hackboot',
      description:
        'Premium cloud gaming plans: Starter (€15/mo), Pro (€45/mo), Elite (€120/mo). RTX 4090, priority support, 0% detection. 7-day free trial.',
      keywords: [
        'cloud gaming pricing',
        'gaming subscription plans',
        'premium gaming cloud',
        'RTX 4090 pricing',
        'monthly gaming plans',
        'gaming cloud trial',
        'competitive gaming subscription',
      ],
    },
    et: {
      title: 'Premium Cloud Gaming Plaanid | Hinnakujundus | Hackboot',
      description:
        'Premium cloud gaming plaanid: Starter (15€/kuu), Pro (45€/kuu), Elite (120€/kuu). RTX 4090, prioriteetne tugi, 0% tuvastamine.',
      keywords: [
        'cloud gaming pricing',
        'gaming subscription plans',
        'premium gaming cloud',
        'Estonia gaming pricing',
      ],
    },
  },
}

export function getPageMetadata(
  pathname: string,
  locale: Locale = 'fr'
): Metadata {
  // Determine page key from pathname
  let pageKey = 'home'
  if (pathname.includes('/services')) pageKey = 'services'
  else if (pathname.includes('/products') && !pathname.includes('/products/')) pageKey = 'products'
  else if (pathname.includes('/about')) pageKey = 'about'
  else if (pathname.includes('/contact')) pageKey = 'contact'
  else if (pathname.includes('/games')) pageKey = 'games'
  else if (pathname.includes('/premium')) pageKey = 'premium'

  const pageData = METADATA_BY_LOCALE[pageKey]?.[locale] || METADATA_BY_LOCALE.home[locale]

  const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords.join(', '),
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      url: `${BASE_URL}/${locale}${pathname}`,
      siteName: 'Hackboot',
      images: [
        {
          url: pageData.ogImage || '/og-image.png',
          width: 1200,
          height: 630,
          alt: pageData.title,
        },
      ],
      locale: locale === 'fr' ? 'fr_FR' : locale === 'en' ? 'en_US' : 'et_EE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.title,
      description: pageData.description,
      images: [pageData.ogImage || '/og-image.png'],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}${pathname}`,
      languages: {
        fr: `${BASE_URL}/fr${pathname}`,
        en: `${BASE_URL}/en${pathname}`,
        et: `${BASE_URL}/et${pathname}`,
      },
    },
  }

  return metadata
}
