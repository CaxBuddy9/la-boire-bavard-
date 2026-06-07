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
      { fr: "Lit double ou deux lits jumeaux selon vos besoins", en: "Double bed or two twin beds to suit your needs", es: "Cama doble o dos camas individuales según sus necesidades", pt: "Cama de casal ou duas camas individuais conforme as suas necessidades" },
      { fr: "Chambre lumineuse pour 1 à 2 personnes · lit enfant sur demande", en: "Bright room for 1–2 guests · child bed on request", es: "Habitación luminosa para 1–2 personas · cama infantil a petición", pt: "Quarto luminoso para 1–2 hóspedes · cama de criança a pedido" },
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
      { fr: "Cocon sous les toits : tuffeau, poutraison et plafonds en pente", en: "A cocoon under the eaves: tuffeau stone, beams and sloping ceilings", es: "Un refugio bajo el tejado: piedra tuffeau, vigas y techos inclinados", pt: "Um refúgio sob o telhado: pedra tuffeau, vigas e tetos inclinados" },
      { fr: "Accès par un escalier extérieur en ardoise — entrée indépendante", en: "Access via an outdoor slate staircase — private entrance", es: "Acceso por una escalera exterior de pizarra — entrada independiente", pt: "Acesso por uma escada exterior em ardósia — entrada independente" },
      { fr: "1 lit double et 2 lits simples · recommandée aux voyageurs de taille moyenne", en: "1 double bed and 2 single beds · best suited to average-height guests", es: "1 cama doble y 2 camas individuales · recomendada para huéspedes de estatura media", pt: "1 cama de casal e 2 camas de solteiro · recomendada a hóspedes de estatura média" },
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
