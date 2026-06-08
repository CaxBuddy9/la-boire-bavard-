export type RoomColor = {
  bg: string        // fond principal (page chambre + livret)
  accent: string    // couleur accent
  accentRgb: string // accent en rgb pour rgba()
}

export const ROOM_COLORS: Record<string, RoomColor> = {
  jardin:  { bg: '#180e08', accent: '#c4603a', accentRgb: '196,96,58'   }, // poutres bois + terracotta (tuiles, chaises rouges)
  cedre:   { bg: '#141210', accent: '#a89070', accentRgb: '168,144,112' }, // taupe doux + beige doré (mansarde gris/crème)
  vallee:  { bg: '#080e18', accent: '#5a9ab0', accentRgb: '90,154,176'  }, // nuit bleue feutrée (cocon sous les toits)
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
    tagline: 'Terrasse privée & jardin',
    description: 'Grande chambre lumineuse avec accès direct sur la terrasse et le jardin. Lit double ou deux lits jumeaux selon vos besoins. Une ancienne cheminée en pierre lui donne tout son cachet.',
    capacityMin: 1,
    capacityMax: 2,
    pricePerNight: 90,
    features: ['Terrasse privée', 'Accès jardin', 'Lit double ou 2 lits jumeaux', 'Lit enfant sur demande', 'Salle d\'eau privative', 'TV', 'Bouilloire thé & café', 'Articles de toilette', 'Non-fumeur', 'Piscine', 'WiFi', 'Petit-déjeuner inclus'],
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
    character: 'Lumineuse & terrasse',
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
    features: ['Dépendance indépendante', 'Belles poutres', 'Pierres apparentes', 'Lit double ou 2 lits jumeaux', 'Lit enfant sur demande', 'Salle d\'eau privative', 'TV', 'Bouilloire thé & café', 'Articles de toilette', 'Non-fumeur', 'Accès piscine', 'WiFi', 'Petit-déjeuner inclus'],
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
    tagline: 'Cocon sous les toits',
    description: 'Nichée sous les toits, cette chambre est un petit cocon plein de charme : tuffeau, poutraison et beaux volumes y créent une ambiance douillette et reposante. On y accède par un escalier extérieur en ardoise, gage d\'intimité. À noter, les plafonds sont en pente — nous la recommandons aux voyageurs de taille moyenne afin de circuler en tout confort (plus de précisions sur demande). Lit double ou deux lits jumeaux selon vos besoins.',
    capacityMin: 1,
    capacityMax: 2,
    pricePerNight: 90,
    features: ['Escalier extérieur en ardoise', 'Tuffeau & poutres', 'Plafonds en pente', 'Lit double ou 2 lits jumeaux', 'Lit enfant sur demande', 'Salle d\'eau privative', 'TV', 'Bouilloire thé & café', 'Articles de toilette', 'Non-fumeur', 'WiFi', 'Petit-déjeuner inclus'],
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
    character: 'Cocon sous les toits',
    color: ROOM_COLORS.vallee,
  },
]

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug)
}
