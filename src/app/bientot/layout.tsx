import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'La Boire Bavard',
  description: "Maison d'hôtes de charme en Anjou · Piscine chauffée · Petit-déjeuner gourmand · Entre Angers et Saumur",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon-192.png',
  },
  openGraph: {
    title: 'La Boire Bavard',
    description: "Maison d'hôtes de charme en Anjou · Piscine chauffée · Petit-déjeuner gourmand",
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function BientotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
