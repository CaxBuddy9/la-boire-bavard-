import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'La Boire Bavard',
  description: "Maison d'hôtes de charme en Anjou · Piscine chauffée · Petit-déjeuner gourmand · Entre Angers et Saumur",
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: '/apple-touch-icon.png',
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
