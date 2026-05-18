export type RoomColor = {
  bg: string        // fond principal (page chambre + livret)
  accent: string    // couleur accent
  accentRgb: string // accent en rgb pour rgba()
}

export const ROOM_COLORS: Record<string, RoomColor> = {
  jardin:  { bg: '#180e08', accent: '#c4603a', accentRgb: '196,96,58'   }, // poutres bois + terracotta (tuiles, chaises rouges)
  cedre:   { bg: '#141210', accent: '#a89070', accentRgb: '168,144,112' }, // taupe doux + beige doré (mansarde gris/crème)
  vallee:  { bg: '#080e18', accent: '#5a9ab0', accentRgb: '90,154,176'  }, // nuit bleue + Loire (vue panoramique)
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
    pricePerNight: 90,
    features: ['Cheminée', 'Terrasse privée', 'Accès jardin', 'Piscine', 'WiFi', 'Petit-déjeuner inclus'],
    images: [
      '/photos/chambres/jardin/chambre-jardin-blanc-04.jpeg',
      '/photos/chambres/jardin/chambre-jardin-blanc-01.jpeg',
      '/photos/chambres/jardin/chambre-jardin-blanc-05.jpeg',
      '/photos/chambres/jardin/chambre-jardin-blanc-07.jpeg',
      '/photos/chambres/jardin/chambre-jardin-blanc-02.jpeg',
      '/photos/chambres/jardin/chambre-jardin-blanc-08.jpeg',
      '/photos/chambres/jardin/chambre-jardin-blanc-06.jpeg',
      '/photos/chambres/jardin/chambre-jardin-blanc-03.jpeg',
      '/photos/chambres/jardin/chambre-jardin-blanc-09.jpeg',
    ],
    character: 'Familiale & lumineuse',
    color: ROOM_COLORS.jardin,
  },
  {
    id: 'cedre',
    slug: 'cote-cedre',
    name: 'Côté Cèdre',
    tagline: 'Dépendance & belles poutres',
    description: 'Côté Cèdre est une dépendance indépendante de la maison principale, nichée à quelques pas du grand cèdre. Pierres apparentes, belles poutres anciennes et matériaux authentiques composent un cocon chaleureux, à la fois rustique et raffiné. Une atmosphère romantique et intime, idéale pour un séjour en amoureux ou une parenthèse au calme.',
    capacityMin: 1,
    capacityMax: 2,
    pricePerNight: 90,
    features: ['Dépendance indépendante', 'Belles poutres', 'Pierres apparentes', 'Accès piscine', 'WiFi', 'Petit-déjeuner inclus'],
    images: [
      '/photos/chambres/cedre/chambre-cedre-01.jpeg',
      '/photos/chambres/cedre/chambre-cedre-02.jpeg',
      '/photos/chambres/cedre/chambre-cedre-03.jpeg',
      '/photos/chambres/cedre/chambre-cedre-04.jpeg',
      '/photos/chambres/cedre/chambre-cedre-05.jpeg',
      '/photos/chambres/cedre/chambre-cedre-06.jpeg',
      '/photos/chambres/cedre/chambre-cedre-07.jpeg',
      '/photos/chambres/cedre/chambre-cedre-08.jpeg',
      '/photos/chambres/cedre/chambre-cedre-09.jpeg',
      '/photos/chambres/cedre/chambre-cedre-10.jpeg',
      '/photos/chambres/cedre/chambre-cedre-11.jpeg',
    ],
    character: 'Romantique & intime',
    color: ROOM_COLORS.cedre,
  },
  {
    id: 'vallee',
    slug: 'cote-vallee',
    name: 'Côté Vallée',
    tagline: 'Vue sur les vignes',
    description: 'Chambre spacieuse avec vue panoramique sur les vignes de l\'Anjou. Escalier privé, salle de douche indépendante, belle poutre peinte en blanc — tout invite au calme et à la contemplation. Le matin, le soleil se lève sur le vignoble : un moment suspendu.',
    capacityMin: 1,
    capacityMax: 4,
    pricePerNight: 90,
    features: ['Vue sur les vignes', 'Escalier privé', 'Salle de douche', 'Piscine', 'WiFi', 'Petit-déjeuner inclus'],
    images: [
      '/photos/chambres/vallee/chambre-vallee-01.jpeg',
      '/photos/chambres/vallee/chambre-vallee-02.jpeg',
      '/photos/chambres/vallee/chambre-vallee-03.jpeg',
      '/photos/chambres/vallee/chambre-vallee-04.jpeg',
      '/photos/chambres/vallee/chambre-vallee-05.jpeg',
      '/photos/chambres/vallee/chambre-vallee-06.jpeg',
      '/photos/chambres/vallee/chambre-vallee-07.jpeg',
      '/photos/chambres/vallee/chambre-vallee-08.jpeg',
      '/photos/chambres/vallee/chambre-vallee-09.jpeg',
      '/photos/chambres/vallee/chambre-vallee-10.jpeg',
    ],
    character: 'Vue panoramique',
    color: ROOM_COLORS.vallee,
  },
]

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug)
}
