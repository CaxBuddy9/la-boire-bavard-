import type { Metadata } from 'next'
import './globals.css'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import MeteoWidget from '@/components/MeteoWidget'
import { LangProvider } from '@/context/LangContext'
import RegisterSW from '@/components/RegisterSW'

export const metadata: Metadata = {
  title: "La Boire Bavard — Chambres d'Hôtes en Anjou",
  description: "Maison d'hôtes de charme entre Angers et Saumur. Piscine chauffée, spa, petit-déjeuner gourmand. Note 9.9/10 · 88 €/nuit.",
  manifest: '/manifest.json',
  themeColor: '#0a0f0a',
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
          <RegisterSW />
        </LangProvider>
      </body>
    </html>
  )
}
