import type { Metadata } from 'next'
import './globals.css'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import MeteoWidget from '@/components/MeteoWidget'
import { LangProvider } from '@/context/LangContext'

export const metadata: Metadata = {
  title: "La Boire Bavard — Chambres d'Hôtes en Anjou",
  description: "Maison d'hôtes de charme entre Angers et Saumur. Piscine chauffée, spa, petit-déjeuner gourmand. Note 9.9/10 · 88 €/nuit.",
  openGraph: {
    title: "La Boire Bavard — Chambres d'Hôtes en Anjou",
    description: "Maison d'hôtes de charme entre Angers et Saumur. Piscine chauffée, spa, petit-déjeuner gourmand.",
    images: ['/photos/photo5.jpg'],
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <LangProvider>
          {children}
          <WhatsAppFloat />
          <MeteoWidget />
        </LangProvider>
      </body>
    </html>
  )
}
