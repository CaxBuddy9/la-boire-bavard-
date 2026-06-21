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
    features: ['Entrée indépendante', 'Terrasse privée', 'Accès jardin', 'Lit double ou 2 lits jumeaux', 'Lit enfant sur demande', 'Salle d\'eau privative', 'TV', 'Plateau de courtoisie — thé, tisane, café, eau', 'Articles de toilette', 'Non-fumeur', 'Piscine', 'WiFi', 'Petit-déjeuner inclus'],
    images: [
      '/photos/chambres/jardin/celeste-jardin-lit-cheminee.jpg',
      '/photos/chambres/jardin/celeste-jardin-lit-coussins.jpg',
      '/photos/chambres/jardin/celeste-jardin-lit-serviettes.jpg',
      '/photos/chambres/jardin/celeste-jardin-lit-detail.jpg',
    ],
    character: 'Lumineuse & terrasse',
    color: ROOM_COLORS.jardin,
  },
  {
    id: 'cedre',
    slug: 'cote-cedre',
    name: 'Côté Cèdre',
    tagline: 'Dépendance & belles poutres',
    description: 'Côté Cèdre est une dépendance indépendante de la maison principale, à quelques pas du grand cèdre. Pierres apparentes, belles poutres anciennes et matériaux authentiques composent un cocon chaleureux, à la fois rustique et raffiné. La salle d\'eau avec baignoire est ouverte sur la chambre. Une atmosphère romantique et intime, idéale pour un séjour en amoureux ou une parenthèse au calme.',
    capacityMin: 1,
    capacityMax: 2,
    pricePerNight: 90,
    features: ['Dépendance indépendante', 'Belles poutres', 'Pierres apparentes', 'Lit double', 'Salle d\'eau avec baignoire, ouverte sur la chambre', 'TV', 'Plateau de courtoisie — thé, tisane, café, eau', 'Articles de toilette', 'Non-fumeur', 'Accès piscine', 'WiFi', 'Petit-déjeuner inclus'],
    images: [
      '/photos/chambres/cedre/celeste-cedre-lit-baignoire-commode.jpg',
      '/photos/chambres/cedre/celeste-cedre-lit-chevets.jpg',
      '/photos/chambres/cedre/celeste-cedre-baignoire-vue-jardin.jpg',
      '/photos/chambres/cedre/celeste-cedre-lit-velux.jpg',
      '/photos/chambres/cedre/celeste-cedre-baignoire-lit.jpg',
      '/photos/chambres/cedre/celeste-cedre-baignoire-douchette.jpg',
      '/photos/chambres/cedre/celeste-cedre-coussins.jpg',
      '/photos/chambres/cedre/celeste-cedre-chevet-lampe.jpg',
      '/photos/chambres/cedre/celeste-cedre-plateau-bouilloire.jpg',
      '/photos/chambres/cedre/celeste-cedre-bureau-cannage.jpg',
      '/photos/chambres/cedre/celeste-cedre-robinet-baignoire.jpg',
      '/photos/chambres/cedre/celeste-cedre-serviettes-lit.jpg',
      '/photos/chambres/cedre/celeste-cedre-serviette-baignoire.jpg',
    ],
    character: 'Romantique & intime',
    color: ROOM_COLORS.cedre,
  },
  {
    id: 'vallee',
    slug: 'cote-vallee',
    name: 'Côté Vallée',
    tagline: 'Cocon sous les toits',
    description: 'Nichée sous les toits, cette chambre est un petit cocon plein de charme : tuffeau, poutraison et beaux volumes y créent une ambiance douillette et reposante. On y accède par un bel escalier extérieur en pierre. À noter, les plafonds sont en pente — nous la recommandons aux voyageurs de taille moyenne afin de circuler en tout confort (plus de précisions sur demande). Lit double ou deux lits jumeaux selon vos besoins.',
    capacityMin: 1,
    capacityMax: 2,
    pricePerNight: 90,
    features: ['Entrée indépendante', 'Escalier extérieur en pierre', 'Tuffeau & poutres', 'Plafonds en pente', 'Lit double ou 2 lits jumeaux', 'Lit enfant sur demande', 'Salle d\'eau privative', 'TV', 'Plateau de courtoisie — thé, tisane, café, eau', 'Articles de toilette', 'Non-fumeur', 'WiFi', 'Petit-déjeuner inclus'],
    images: [
      '/photos/chambres/vallee/chambre-vallee-lit-cheminee.jpeg',
      '/photos/chambres/vallee/chambre-vallee-lit-coussins.jpeg',
      '/photos/chambres/vallee/chambre-vallee-lit-douche.jpeg',
      '/photos/chambres/vallee/chambre-vallee-salle-eau.jpeg',
      '/photos/chambres/vallee/chambre-vallee-fenetre.jpeg',
      '/photos/chambres/vallee/chambre-vallee-bureau.jpeg',
      '/photos/exterieur/escalier-vallee.jpeg',
    ],
    character: 'Cocon sous les toits',
    color: ROOM_COLORS.vallee,
  },
]

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug)
}
