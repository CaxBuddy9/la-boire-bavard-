import type { Metadata, Viewport } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Playfair_Display, Raleway, EB_Garamond } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import MeteoWidget from '@/components/MeteoWidget'
import { LangProvider } from '@/context/LangContext'
import RegisterSW from '@/components/RegisterSW'
import PageTransition from '@/components/PageTransition'

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
  description: "Maison d'hôtes de charme entre Angers et Saumur. Piscine chauffée, jacuzzi, petit-déjeuner gourmand. Note 9.9/10 · 88 €/nuit.",
  verification: {
    google: 'siMyIWDcGoVyg9ERTP0Ff4WLyoO4NqADvZt4J69m5oI',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "La Boire Bavard — Chambres d'Hôtes en Anjou",
    description: "Maison d'hôtes de charme entre Angers et Saumur. Piscine chauffée, jacuzzi, petit-déjeuner gourmand.",
    images: ['/photos/exterieur/maison-facade-printemps.jpg'],
    siteName: "La Boire Bavard — Chambres d'Hôtes",
    locale: 'fr_FR',
    type: 'website',
    url: 'https://laboirebavard.com',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0f0a',
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: "La Boire Bavard — Chambres d'Hôtes",
  alternateName: 'La Boire Bavard',
  url: 'https://laboirebavard.com',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BedAndBreakfast',
  name: 'La Boire Bavard',
  description: "Maison d'hôtes de charme entre Angers et Saumur. Piscine chauffée, jacuzzi, petit-déjeuner gourmand. Note 9.9/10.",
  url: 'https://laboirebavard.com',
  telephone: '+33675786335',
  email: 'contact@laboirebavard.com',
  priceRange: '88€',
  currenciesAccepted: 'EUR',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '4 chemin de la Boire Bavard, Lieu-dit La Hutte',
    addressLocality: 'Blaison-Saint-Sulpice',
    postalCode: '49320',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 47.368,
    longitude: -0.511,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '9.9',
    bestRating: '10',
    ratingCount: '50',
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Piscine chauffée',      value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Jacuzzi',                value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Petit-déjeuner inclus', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'WiFi gratuit',          value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Table d\'hôtes',        value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Jardin',                value: true },
  ],
  hasMap: 'https://maps.google.com/?q=47.368,-0.511',
  image: 'https://laboirebavard.com/photos/exterieur/maison-facade-printemps.jpg',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${raleway.variable} ${garamond.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LangProvider>
          <PageTransition>{children}</PageTransition>
          <WhatsAppFloat />
          <MeteoWidget />
          <RegisterSW />
        </LangProvider>
      </body>
      <GoogleAnalytics gaId="G-29W0QG3LH5" />
      <SpeedInsights />
      {process.env.NEXT_PUBLIC_CLARITY_ID && (
        <Script id="clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");
        `}</Script>
      )}
    </html>
  )
}
