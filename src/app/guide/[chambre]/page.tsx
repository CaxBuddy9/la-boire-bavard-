import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import GuideIntro from '@/components/GuideIntro'
import GuideClient from '@/components/guide/GuideClient'
import type { RoomTheme } from '@/components/guide/GuideClient'
import { ROOM_COLORS, ROOMS as SITE_ROOMS } from '@/lib/rooms'

// Récupère la liste de photos d'une chambre depuis les données centrales
const galleryOf = (id: string): string[] =>
  SITE_ROOMS.find((r) => r.id === id)?.images ?? []

// Génère un thème complet depuis les couleurs centrales de rooms.ts
// Teinte claire propre à chaque chambre — le fond du livret rappelle la chambre
const ROOM_TINT: Record<string, { page: string; surface: string; card: string; ink: string; pillText: string }> = {
  jardin: { page: '#f8ede2', surface: '#fcf5ec', card: '#fffdf8', ink: '46,29,18', pillText: '#fff9f3' }, // crème terracotta chaude
  cedre:  { page: '#f1ede4', surface: '#f8f4ec', card: '#fffefa', ink: '42,36,27', pillText: '#2a241b' }, // greige taupe doux
  vallee: { page: '#eaf0f2', surface: '#f3f7f8', card: '#fbfdfe', ink: '24,37,47', pillText: '#f2f8fa' }, // bleu Loire clair
}

function makeTheme(id: string): RoomTheme {
  const c = ROOM_COLORS[id]
  const t = ROOM_TINT[id] ?? ROOM_TINT.jardin
  return {
    pageBg:        t.page,
    topbarBg:      t.surface,
    topbarBorder:  `rgba(${c.accentRgb},.3)`,
    accent:        c.accent,
    accentRgb:     c.accentRgb,
    cardBg:        t.card,
    cardBorder:    `rgba(${c.accentRgb},.24)`,
    cardShadow:    `0 6px 22px rgba(${t.ink},.08)`,
    heading:       `rgb(${t.ink})`,
    text:          `rgba(${t.ink},.86)`,
    textSub:       `rgba(${t.ink},.6)`,
    textMuted:     `rgba(${t.ink},.42)`,
    divider:       `rgba(${t.ink},.1)`,
    wifiBg:        t.card,
    byeBg:         c.bg,
    pillBg:        `rgba(${c.accentRgb},.13)`,
    pillActiveBg:  c.accent,
    pillActiveText: t.pillText,
    navBg:         t.surface,
    navBorder:     `rgba(${c.accentRgb},.24)`,
    navActive:     c.accent,
    navInactive:   `rgba(${t.ink},.4)`,
  }
}

const ROOMS = {
  jardin: {
    name: 'Côté Jardin',
    slug: 'jardin',
    emoji: '🌿',
    bg: ROOM_COLORS.jardin.bg,
    image: '/photos/chambres/jardin/chambre-jardin-blanc-04.jpeg',
    images: galleryOf('jardin'),
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
    image: '/photos/chambres/cedre/chambre-cedre-01.jpeg',
    images: galleryOf('cedre'),
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
    image: '/photos/chambres/vallee/chambre-vallee-01.jpeg',
    images: galleryOf('vallee'),
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
