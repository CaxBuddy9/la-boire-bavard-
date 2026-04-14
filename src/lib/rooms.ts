export type RoomColor = {
  bg: string        // fond principal (page chambre + livret)
  accent: string    // couleur accent
  accentRgb: string // accent en rgb pour rgba()
}

export const ROOM_COLORS: Record<string, RoomColor> = {
  jardin:  { bg: '#180e08', accent: '#c4603a', accentRgb: '196,96,58'   }, // poutres bois + terracotta (tuiles, chaises rouges)
  cedre:   { bg: '#141210', accent: '#a89070', accentRgb: '168,144,112' }, // taupe doux + beige doré (mansarde gris/crème)
  vallee:  { bg: '#080e18', accent: '#5a9ab0', accentRgb: '90,154,176'  }, // nuit bleue + Loire (vue panoramique)
  potager: { bg: '#0e100c', accent: '#7aaa6a', accentRgb: '122,170,106' }, // noir doux + vert sauge (pierre blanche, jardin)
}

export type Room = {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  capacityMin: number
  capacityMax: number
  pricePerNight: number
  features: string[]
  images: string[]
  character: string
  color: RoomColor
}

export const ROOMS: Room[] = [
  {
    id: 'jardin',
    slug: 'cote-jardin',
    name: 'Côté Jardin',
    tagline: 'Cheminée & terrasse privée',
    description: 'Grande chambre lumineuse avec accès direct sur la terrasse et le jardin. La cheminée crée une atmosphère chaleureuse en toutes saisons. Idéale pour les familles ou les groupes jusqu\'à 4 personnes.',
    capacityMin: 1,
    capacityMax: 4,
    pricePerNight: 88,
    features: ['Cheminée', 'Terrasse privée', 'Accès jardin', 'Piscine', 'WiFi', 'Petit-déjeuner inclus'],
    images: [
      '/photos/chambres/jardin/chambre-jardin-ensemble.jpg',
      '/photos/chambres/jardin/chambre-jardin-lit-terrasse.jpg',
      '/photos/chambres/jardin/chambre-jardin-cheminee.jpg',
      '/photos/chambres/jardin/chambre-jardin-console.jpg',
      '/photos/chambres/jardin/chambre-jardin-entree.jpg',
      '/photos/chambres/jardin/chambre-jardin-cheminee-rideau.jpg',
      '/photos/chambres/jardin/chambre-jardin-vue-ensemble.jpg',
      '/photos/chambres/jardin/chambre-jardin-lit-gros-plan.jpg',
      '/photos/chambres/jardin/chambre-jardin-porte-jardin.jpg',
      '/photos/chambres/jardin/chambre-jardin-lumineux.jpg',
      '/photos/chambres/jardin/chambre-jardin-large.jpg',
    ],
    character: 'Familiale & lumineuse',
    color: ROOM_COLORS.jardin,
  },
  {
    id: 'cedre',
    slug: 'cote-cedre',
    name: 'Côté Cèdre',
    tagline: 'Romance sous le grand cèdre',
    description: 'Chambre romantique avec baignoire et accès direct à la piscine depuis la chambre. Le grand cèdre centenaire apporte ombre et sérénité. La chambre idéale pour un séjour en amoureux.',
    capacityMin: 1,
    capacityMax: 2,
    pricePerNight: 88,
    features: ['Baignoire', 'Accès piscine direct', 'Vue cèdre centenaire', 'WiFi', 'Petit-déjeuner inclus'],
    images: ['/photos/chambres/cedre/chambre-cedre-lit-taupe.jpg', '/photos/chambres/jardin/chambre-jardin-baignoire.jpg', '/photos/exterieur/maison-facade-piscine.jpg'],
    character: 'Romantique & intime',
    color: ROOM_COLORS.cedre,
  },
  {
    id: 'vallee',
    slug: 'cote-vallee',
    name: 'Côté Vallée',
    tagline: 'Vue sur la Loire & les vignes',
    description: 'Chambre spacieuse avec vue panoramique sur la vallée de la Loire et le vignoble. Escalier privé, salle de douche indépendante. Regarder le lever du soleil sur la Loire depuis cette chambre est un moment inoubliable.',
    capacityMin: 1,
    capacityMax: 4,
    pricePerNight: 88,
    features: ['Vue Loire', 'Escalier privé', 'Salle de douche', 'Piscine', 'WiFi', 'Petit-déjeuner inclus'],
    images: ['/photos/chambres/potager/chambre-potager-pierre.jpg', '/photos/exterieur/maison-facade-printemps.jpg', '/photos/chambres/potager/chambre-potager-sdb.jpg'],
    character: 'Vue panoramique',
    color: ROOM_COLORS.vallee,
  },
  {
    id: 'potager',
    slug: 'cote-potager',
    name: 'Côté Potager',
    tagline: 'Calme absolu face au jardin',
    description: 'Chambre au calme absolu donnant sur le potager et les herbes aromatiques. Salle de bain séparée, atmosphère reposante. Parfaite pour une déconnexion totale au cœur de l\'Anjou.',
    capacityMin: 1,
    capacityMax: 2,
    pricePerNight: 88,
    features: ['Vue potager', 'SdB séparée', 'Calme absolu', 'Piscine', 'WiFi', 'Petit-déjeuner inclus'],
    images: ['/photos/chambres/jardin/chambre-jardin-combles.jpg', '/photos/exterieur/propriete-jacuzzi-terrasse.jpg', '/photos/exterieur/maison-facade-piscine.jpg'],
    character: 'Tranquille & ressourçante',
    color: ROOM_COLORS.potager,
  },
]

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug)
}
