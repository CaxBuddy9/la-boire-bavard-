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
    image: '/photos/chambres/jardin/chambre-jardin-blanc-04.jpeg',
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
      { fr: "Dépendance indépendante, à quelques pas de la maison", en: "Independent annexe, just steps from the main house", es: "Anexo independiente, a unos pasos de la casa", pt: "Anexo independente, a alguns passos da casa" },
      { fr: "Belles poutres et pierres apparentes, atmosphère authentique", en: "Beautiful beams and exposed stone, an authentic atmosphere", es: "Vigas y piedra vista, ambiente auténtico", pt: "Belas vigas e pedra à vista, atmosfera autêntica" },
      { fr: "Chambre romantique pour un séjour en amoureux", en: "Romantic room for a couple's getaway", es: "Habitación romántica para una escapada en pareja", pt: "Quarto romântico para uma escapada a dois" },
    ],
  },
  vallee: {
    name: 'Côté Vallée',
    slug: 'vallee',
    emoji: '🏞️',
    bg: ROOM_COLORS.vallee.bg,
    theme: makeTheme('vallee') satisfies RoomTheme,
    details: [
      { fr: "Vue panoramique sur les vignes de l'Anjou", en: "Panoramic view over the Anjou vineyards", es: "Vista panorámica sobre los viñedos del Anjou", pt: "Vista panorâmica sobre os vinhedos do Anjou" },
      { fr: "Entrée indépendante via votre escalier privatif", en: "Private entrance via your own staircase", es: "Entrada independiente por su propia escalera privada", pt: "Entrada independente pela sua escadaria privada" },
      { fr: "Belle poutre peinte en blanc, lumière douce", en: "Beautiful white-painted beam, soft light", es: "Hermosa viga pintada de blanco, luz suave", pt: "Bela viga pintada de branco, luz suave" },
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
