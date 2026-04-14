import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import GuideIntro from '@/components/GuideIntro'
import GuideClient from '@/components/guide/GuideClient'
import type { RoomTheme } from '@/components/guide/GuideClient'
import { ROOM_COLORS } from '@/lib/rooms'

// Génère un thème complet depuis les couleurs centrales de rooms.ts
function makeTheme(id: string): RoomTheme {
  const c = ROOM_COLORS[id]
  return {
    pageBg:        c.bg,
    topbarBg:      c.bg,
    topbarBorder:  `rgba(${c.accentRgb},.2)`,
    accent:        c.accent,
    accentRgb:     c.accentRgb,
    cardBg:        'rgba(255,255,255,.04)',
    cardBorder:    `rgba(${c.accentRgb},.14)`,
    cardShadow:    'none',
    heading:       '#fdfcf9',
    text:          'rgba(253,252,249,.88)',
    textSub:       'rgba(253,252,249,.58)',
    textMuted:     'rgba(253,252,249,.38)',
    divider:       'rgba(255,255,255,.08)',
    wifiBg:        c.bg,
    byeBg:         c.bg,
    pillBg:        `rgba(${c.accentRgb},.13)`,
    pillActiveBg:  c.accent,
    pillActiveText: c.bg,
    navBg:         `rgba(${c.bg.replace('#','').match(/.{2}/g)!.map(h=>parseInt(h,16)).join(',')}, .96)`,
    navBorder:     `rgba(${c.accentRgb},.15)`,
    navActive:     c.accent,
    navInactive:   'rgba(253,252,249,.35)',
  }
}

const ROOMS = {
  jardin: {
    name: 'Côté Jardin',
    slug: 'jardin',
    emoji: '🌿',
    bg: ROOM_COLORS.jardin.bg,
    image: '/photos/chambres/jardin/chambre-jardin-ensemble.jpg',
    theme: makeTheme('jardin') satisfies RoomTheme,
    details: [
      { fr: "La terrasse privée s'ouvre directement depuis la chambre", en: "The private terrace opens directly from your room", es: "La terraza privada se abre directamente desde la habitación", pt: "O terraço privado abre diretamente do seu quarto" },
      { fr: "La cheminée est disponible sur demande à Sandrine", en: "The fireplace is available on request from Sandrine", es: "La chimenea está disponible a petición de Sandrine", pt: "A lareira está disponível a pedido da Sandrine" },
      { fr: "Grande chambre familiale jusqu'à 4 personnes", en: "Spacious family room for up to 4 guests", es: "Amplia habitación familiar para hasta 4 personas", pt: "Quarto familiar espaçoso para até 4 hóspedes" },
    ],
  },
  cedre: {
    name: 'Côté Cèdre',
    slug: 'cedre',
    emoji: '🌲',
    bg: ROOM_COLORS.cedre.bg,
    theme: makeTheme('cedre') satisfies RoomTheme,
    details: [
      { fr: "Accès direct à la piscine chauffée depuis la chambre", en: "Direct access to the heated pool from your room", es: "Acceso directo a la piscina climatizada desde la habitación", pt: "Acesso direto à piscina aquecida desde o quarto" },
      { fr: "Baignoire à votre disposition pour vous détendre", en: "Bathtub available for your relaxation", es: "Bañera a su disposición para relajarse", pt: "Banheira à sua disposição para relaxar" },
      { fr: "Chambre romantique sous le cèdre centenaire", en: "Romantic room beneath the century-old cedar tree", es: "Habitación romántica bajo el cedro centenario", pt: "Quarto romântico sob o cedro centenário" },
    ],
  },
  vallee: {
    name: 'Côté Vallée',
    slug: 'vallee',
    emoji: '🏞️',
    bg: ROOM_COLORS.vallee.bg,
    theme: makeTheme('vallee') satisfies RoomTheme,
    details: [
      { fr: "Vue panoramique sur la Loire et les vignes", en: "Panoramic view over the Loire and the vineyards", es: "Vista panorámica sobre el Loira y los viñedos", pt: "Vista panorâmica sobre o Loire e os vinhedos" },
      { fr: "Entrée indépendante via votre escalier privatif", en: "Private entrance via your own staircase", es: "Entrada independiente por su propia escalera privada", pt: "Entrada independente pela sua escadaria privada" },
      { fr: "Le lever du soleil sur la Loire est splendide d'ici", en: "The sunrise over the Loire is breathtaking from here", es: "El amanecer sobre el Loira es espléndido desde aquí", pt: "O nascer do sol sobre o Loire é esplêndido daqui" },
    ],
  },
  potager: {
    name: 'Côté Potager',
    slug: 'potager',
    emoji: '🌱',
    bg: ROOM_COLORS.potager.bg,
    theme: makeTheme('potager') satisfies RoomTheme,
    details: [
      { fr: "Salle de bain privée séparée de la chambre", en: "Private bathroom separate from the bedroom", es: "Baño privado separado del dormitorio", pt: "Casa de banho privada separada do quarto" },
      { fr: "Vue sur le potager et les herbes aromatiques", en: "View over the kitchen garden and aromatic herbs", es: "Vista al huerto y las hierbas aromáticas", pt: "Vista para a horta e ervas aromáticas" },
      { fr: "Calme absolu, parfait pour se ressourcer", en: "Absolute quiet, perfect for unwinding", es: "Calma absoluta, ideal para desconectar", pt: "Calma absoluta, perfeito para descansar" },
    ],
  },
}

type Props = { params: Promise<{ chambre: string }> }

export function generateStaticParams() {
  return Object.keys(ROOMS).map((chambre) => ({ chambre }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chambre } = await params
  const room = ROOMS[chambre as keyof typeof ROOMS]
  if (!room) return {}
  return {
    title: `${room.name} · La Boire Bavard`,
    description: `Bienvenue dans votre chambre ${room.name}. Votre livret d'accueil numérique pour votre séjour à La Boire Bavard, Anjou.`,
  }
}

export default async function GuidePage({ params }: Props) {
  const { chambre } = await params
  const room = ROOMS[chambre as keyof typeof ROOMS]
  if (!room) notFound()

  return (
    <GuideIntro roomName={room.name}>
      <GuideClient room={room} />
    </GuideIntro>
  )
}
