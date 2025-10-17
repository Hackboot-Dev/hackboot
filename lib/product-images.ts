// Product images mapping
// Maps game names to their hero images

export const gameHeroImages: Record<string, string> = {
  'Valorant': '/images/valorant-hero.png',
  'League of Legends': '/images/league-of-legends-hero.png',
  'CS2': '/images/cs2-hero.png',
  'Counter-Strike 2': '/images/cs2-hero.png',
  'Overwatch 2': '/images/valorant-hero.png', // Using valorant as placeholder for now
  'Fortnite': '/images/league-of-legends-hero.png', // Using LoL as placeholder
  'Apex Legends': '/images/cs2-hero.png', // Using CS2 as placeholder
  'Call of Duty': '/images/valorant-hero.png', // Using valorant as placeholder
  'PUBG': '/images/league-of-legends-hero.png', // Using LoL as placeholder
  'Minecraft': '/images/cs2-hero.png', // Using CS2 as placeholder
  'World of Warcraft': '/images/valorant-hero.png', // Using valorant as placeholder
  'Rocket League': '/images/league-of-legends-hero.png', // Using LoL as placeholder
}

// Get hero image for a specific game
export function getGameHeroImage(gameName: string): string {
  return gameHeroImages[gameName] || '/images/valorant-hero.png' // Default fallback
}

// Product-specific images (for individual configurations)
export const productImages: Record<string, string> = {
  // Valorant
  'valorant-starter': '/images/valorant-hero.png',
  'valorant-competitive': '/images/valorant-hero.png',
  'valorant-ultimate': '/images/valorant-hero.png',
  'valorant-champion': '/images/valorant-hero.png',

  // CS2
  'cs2-starter': '/images/cs2-hero.png',
  'cs2-competitive': '/images/cs2-hero.png',
  'cs2-ultimate': '/images/cs2-hero.png',
  'cs2-global-elite': '/images/cs2-hero.png',

  // League of Legends
  'lol-bronze': '/images/league-of-legends-hero.png',
  'lol-silver': '/images/league-of-legends-hero.png',
  'lol-gold': '/images/league-of-legends-hero.png',
  'lol-diamond': '/images/league-of-legends-hero.png',
  'lol-challenger': '/images/league-of-legends-hero.png',

  // Overwatch 2
  'overwatch-bronze': '/images/valorant-hero.png',
  'overwatch-gold': '/images/valorant-hero.png',
  'overwatch-diamond': '/images/valorant-hero.png',
  'overwatch-master': '/images/valorant-hero.png',
  'overwatch-grandmaster': '/images/valorant-hero.png',

  // Fortnite
  'fortnite-starter': '/images/league-of-legends-hero.png',
  'fortnite-builder': '/images/league-of-legends-hero.png',
  'fortnite-champion': '/images/league-of-legends-hero.png',
  'fortnite-victory-royale': '/images/league-of-legends-hero.png',

  // Apex Legends
  'apex-bronze': '/images/cs2-hero.png',
  'apex-silver': '/images/cs2-hero.png',
  'apex-gold': '/images/cs2-hero.png',
  'apex-platinum': '/images/cs2-hero.png',
  'apex-predator': '/images/cs2-hero.png',
}

// Get product image by slug
export function getProductImage(productSlug: string): string {
  return productImages[productSlug] || '/images/valorant-hero.png'
}