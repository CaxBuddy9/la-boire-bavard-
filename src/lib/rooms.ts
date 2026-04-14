export type RoomColor = {
  bg: string        // fond principal (page chambre + livret)
  accent: string    // couleur accent
  accentRgb: string // accent en rgb pour rgba()
}

export const ROOM_COLORS: Record<string, RoomColor> = {
  jardin:  { bg: '#0a1a0c', accent: '#c4a050', accentRgb: '196,160,80'  }, // vert forêt + or
  cedre:   { bg: '#120c1a', accent: '#c4907a', accentRgb: '196,144,122' }, // plum nuit + rose
  vallee:  { bg: '#081420', accent: '#4aa8c0', accentRgb: '74,168,192'  }, // bleu Loire + teal
  potager: { bg: '#0c1808', accent: '#88b558', accentRgb: '136,181,88'  }, // vert nuit + herbe
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
      '/photos/chambre-jardin-ensemble.jpg',
      '/photos/chambre-jardin-lit-terrasse.jpg',
      '/photos/chambre-jardin-cheminee.jpg',
      '/photos/chambre-jardin-console.jpg',
      '/photos/chambre-jardin-entree.jpg',
      '/photos/chambre-jardin-cheminee-rideau.jpg',
      '/photos/chambre-jardin-vue-ensemble.jpg',
      '/photos/chambre-jardin-lit-gros-plan.jpg',
      '/photos/chambre-jardin-porte-jardin.jpg',
      '/photos/chambre-jardin-lumineux.jpg',
      '/photos/chambre-jardin-large.jpg',
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
    images: ['/photos/photo2.jpg', '/photos/photo7.jpg', '/photos/photo8.jpg'],
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
    images: ['/photos/photo3.jpg', '/photos/photo5.jpg', '/photos/photo9.jpg'],
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
    images: ['/photos/photo4.jpg', '/photos/photo6.jpg', '/photos/photo8.jpg'],
    character: 'Tranquille & ressourçante',
    color: ROOM_COLORS.potager,
  },
]

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug)
}
