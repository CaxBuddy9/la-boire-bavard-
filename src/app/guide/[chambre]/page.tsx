import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import GuideIntro from '@/components/GuideIntro'
import GuideClient from '@/components/guide/GuideClient'

const ROOMS = {
  jardin: {
    name: 'Côté Jardin',
    emoji: '🌿',
    bg: '#1a3320',
    details: [
      { fr: "La terrasse privée s'ouvre directement depuis la chambre", en: "The private terrace opens directly from your room", es: "La terraza privada se abre directamente desde la habitación", pt: "O terraço privado abre diretamente do seu quarto" },
      { fr: "La cheminée est disponible sur demande", en: "The fireplace is available on request", es: "La chimenea está disponible a petición", pt: "A lareira está disponível a pedido" },
      { fr: "Grande chambre familiale jusqu'à 4 personnes", en: "Spacious family room for up to 4 guests", es: "Amplia habitación familiar para hasta 4 personas", pt: "Quarto familiar espaçoso para até 4 hóspedes" },
    ],
  },
  cedre: {
    name: 'Côté Cèdre',
    emoji: '🌲',
    bg: '#1e2f18',
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
    description: `Welcome to your room ${room.name}. Your digital guest guide for your stay at La Boire Bavard, Anjou.`,
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
