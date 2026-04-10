import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import GuideIntro from '@/components/GuideIntro'
import GuideClient from '@/components/guide/GuideClient'
import type { RoomTheme } from '@/components/guide/GuideClient'

const ROOMS = {
  jardin: {
    name: 'Côté Jardin',
    emoji: '🌿',
    bg: '#1a3320',
    theme: {
      pageBg: '#0b1e0c',
      topbarBg: '#0f2510',
      topbarBorder: 'rgba(232,168,56,.18)',
      accent: '#e8a838',
      accentRgb: '232,168,56',
      cardBg: 'rgba(255,255,255,.05)',
      cardBorder: 'rgba(232,168,56,.12)',
      cardShadow: 'none',
      heading: '#fdfcf9',
      text: 'rgba(253,252,249,.88)',
      textSub: 'rgba(253,252,249,.58)',
      textMuted: 'rgba(253,252,249,.38)',
      divider: 'rgba(255,255,255,.08)',
      wifiBg: '#0f2510',
      byeBg: '#0f2510',
      pillBg: 'rgba(232,168,56,.12)',
      pillActiveBg: '#e8a838',
      pillActiveText: '#0b1e0c',
      navBg: 'rgba(11,30,12,.96)',
      navBorder: 'rgba(232,168,56,.15)',
      navActive: '#e8a838',
      navInactive: 'rgba(253,252,249,.38)',
    } satisfies RoomTheme,
    details: [
      { fr: "La terrasse privée s'ouvre directement depuis la chambre", en: "The private terrace opens directly from your room", es: "La terraza privada se abre directamente desde la habitación", pt: "O terraço privado abre diretamente do seu quarto" },
      { fr: "La cheminée est disponible sur demande à Sandrine", en: "The fireplace is available on request from Sandrine", es: "La chimenea está disponible a petición de Sandrine", pt: "A lareira está disponível a pedido da Sandrine" },
      { fr: "Grande chambre familiale jusqu'à 4 personnes", en: "Spacious family room for up to 4 guests", es: "Amplia habitación familiar para hasta 4 personas", pt: "Quarto familiar espaçoso para até 4 hóspedes" },
    ],
  },
  cedre: {
    name: 'Côté Cèdre',
    emoji: '🌲',
    bg: '#1e2f18',
    theme: {
      pageBg: '#08091a',
      topbarBg: '#0c0d20',
      topbarBorder: 'rgba(196,144,122,.18)',
      accent: '#c4907a',
      accentRgb: '196,144,122',
      cardBg: 'rgba(255,255,255,.05)',
      cardBorder: 'rgba(196,144,122,.12)',
      cardShadow: 'none',
      heading: '#fdfcf9',
      text: 'rgba(253,252,249,.88)',
      textSub: 'rgba(253,252,249,.58)',
      textMuted: 'rgba(253,252,249,.38)',
      divider: 'rgba(255,255,255,.08)',
      wifiBg: '#0e0e22',
      byeBg: '#0e0e22',
      pillBg: 'rgba(196,144,122,.12)',
      pillActiveBg: '#c4907a',
      pillActiveText: '#08091a',
      navBg: 'rgba(8,9,26,.96)',
      navBorder: 'rgba(196,144,122,.15)',
      navActive: '#c4907a',
      navInactive: 'rgba(253,252,249,.38)',
    } satisfies RoomTheme,
    details: [
      { fr: "Accès direct à la piscine chauffée depuis la chambre", en: "Direct access to the heated pool from your room", es: "Acceso directo a la piscina climatizada desde la habitación", pt: "Acesso direto à piscina aquecida desde o quarto" },
      { fr: "Baignoire à votre disposition pour vous détendre", en: "Bathtub available for your relaxation", es: "Bañera a su disposición para relajarse", pt: "Banheira à sua disposição para relaxar" },
      { fr: "Chambre romantique sous le cèdre centenaire", en: "Romantic room beneath the century-old cedar tree", es: "Habitación romántica bajo el cedro centenario", pt: "Quarto romântico sob o cedro centenário" },
    ],
  },
  vallee: {
    name: 'Côté Vallée',
    emoji: '🏞️',
    bg: '#1a2830',
    theme: {
      pageBg: '#eef4f6',
      topbarBg: '#ffffff',
      topbarBorder: 'rgba(42,138,154,.15)',
      accent: '#2a8a9a',
      accentRgb: '42,138,154',
      cardBg: '#ffffff',
      cardBorder: 'transparent',
      cardShadow: '0 2px 14px rgba(0,0,0,.07)',
      heading: '#1a2832',
      text: '#1a2832',
      textSub: '#5a7080',
      textMuted: '#8a9ea8',
      divider: '#e4edf2',
      wifiBg: '#1a2832',
      byeBg: '#1a2832',
      pillBg: '#ddedf2',
      pillActiveBg: '#2a8a9a',
      pillActiveText: '#ffffff',
      navBg: 'rgba(238,244,246,.97)',
      navBorder: 'rgba(42,138,154,.2)',
      navActive: '#2a8a9a',
      navInactive: '#8a9ea8',
    } satisfies RoomTheme,
    details: [
      { fr: "Vue panoramique sur la Loire et les vignes", en: "Panoramic view over the Loire and the vineyards", es: "Vista panorámica sobre el Loira y los viñedos", pt: "Vista panorâmica sobre o Loire e os vinhedos" },
      { fr: "Entrée indépendante via votre escalier privatif", en: "Private entrance via your own staircase", es: "Entrada independiente por su propia escalera privada", pt: "Entrada independente pela sua escadaria privada" },
      { fr: "Le lever du soleil sur la Loire est splendide d'ici", en: "The sunrise over the Loire is breathtaking from here", es: "El amanecer sobre el Loira es espléndido desde aquí", pt: "O nascer do sol sobre o Loire é esplêndido daqui" },
    ],
  },
  potager: {
    name: 'Côté Potager',
    emoji: '🌱',
    bg: '#1e2f16',
    theme: {
      pageBg: '#130e07',
      topbarBg: '#1a1208',
      topbarBorder: 'rgba(138,181,120,.15)',
      accent: '#8ab578',
      accentRgb: '138,181,120',
      cardBg: 'rgba(255,255,255,.05)',
      cardBorder: 'rgba(138,181,120,.12)',
      cardShadow: 'none',
      heading: '#fdfcf9',
      text: 'rgba(253,252,249,.88)',
      textSub: 'rgba(253,252,249,.58)',
      textMuted: 'rgba(253,252,249,.38)',
      divider: 'rgba(255,255,255,.08)',
      wifiBg: '#1a1208',
      byeBg: '#1a1208',
      pillBg: 'rgba(138,181,120,.12)',
      pillActiveBg: '#8ab578',
      pillActiveText: '#130e07',
      navBg: 'rgba(19,14,7,.96)',
      navBorder: 'rgba(138,181,120,.12)',
      navActive: '#8ab578',
      navInactive: 'rgba(253,252,249,.38)',
    } satisfies RoomTheme,
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
