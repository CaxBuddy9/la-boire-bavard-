import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Raleway, EB_Garamond } from 'next/font/google'
import './globals.css'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import MeteoWidget from '@/components/MeteoWidget'
import { LangProvider } from '@/context/LangContext'
import RegisterSW from '@/components/RegisterSW'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-raleway',
  display: 'swap',
})

const garamond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-garamond',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "La Boire Bavard — Chambres d'Hôtes en Anjou",
  description: "Maison d'hôtes de charme entre Angers et Saumur. Piscine chauffée, spa, petit-déjeuner gourmand. Note 9.9/10 · 88 €/nuit.",
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/icons/icon-192.png',
  },
  openGraph: {
    title: "La Boire Bavard — Chambres d'Hôtes en Anjou",
    description: "Maison d'hôtes de charme entre Angers et Saumur. Piscine chauffée, spa, petit-déjeuner gourmand.",
    images: ['/photos/exterieur/maison-facade-printemps.jpg'],
    locale: 'fr_FR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0f0a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${raleway.variable} ${garamond.variable}`}>
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
