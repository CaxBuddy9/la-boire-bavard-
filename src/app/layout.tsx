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
  metadataBase: new URL('https://www.laboirebavard.com'),
  title: {
    default: "La Boire Bavard",
    template: "%s | La Boire Bavard"
  },
  description: "Maison d'hôtes de charme entre Angers et Saumur. Piscine, jardin arboré, petit-déjeuner gourmand. Note 9.9/10 Booking · 90 €/nuit.",
  // CHANGEMENT CLÉ : applicationName est l'un des signaux que Google utilise pour
  // afficher le « nom du site » (sitename) à la place du domaine dans les résultats.
  applicationName: "La Boire Bavard",
  // Renforce l'attribution éditoriale au nom de la maison (cohérence des signaux).
  authors: [{ name: "La Boire Bavard", url: "https://www.laboirebavard.com" }],
  creator: "La Boire Bavard",
  publisher: "La Boire Bavard",
  // Mots-clés ciblés maison d'hôtes / localisation (signal mineur mais propre).
  keywords: [
    "maison d'hôtes Anjou",
    "chambres d'hôtes Angers",
    "chambres d'hôtes Saumur",
    "Blaison-Saint-Sulpice",
    "bed and breakfast Loire",
    "La Boire Bavard",
  ],
  category: "Hébergement",
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'siMyIWDcGoVyg9ERTP0Ff4WLyoO4NqADvZt4J69m5oI',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon-128.png', type: 'image/png', sizes: '128x128' },
      { url: '/favicon-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    // Sur la home : titre = nom seul (pas de slogan) pour renforcer le sitename.
    title: "La Boire Bavard",
    description: "Maison d'hôtes de charme entre Angers et Saumur. Piscine, jardin arboré, petit-déjeuner gourmand.",
    // CHANGEMENT : image OG enrichie (dimensions + alt) → meilleur rendu social
    // et meilleure éligibilité aux aperçus riches.
    images: [
      {
        url: '/photos/exterieur/celeste-maison-piscine-transats.jpg',
        width: 1200,
        height: 630,
        alt: "La Boire Bavard — maison d'hôtes avec piscine en Anjou",
      },
    ],
    // og:site_name = signal n°1 du sitename Google, identique partout.
    siteName: "La Boire Bavard",
    locale: 'fr_FR',
    type: 'website',
    url: 'https://www.laboirebavard.com',
  },
  // CHANGEMENT : Twitter/X Card → titre = nom de la maison, jamais le domaine.
  twitter: {
    card: 'summary_large_image',
    title: "La Boire Bavard",
    description: "Maison d'hôtes de charme entre Angers et Saumur. Piscine, jardin arboré, petit-déjeuner gourmand.",
    images: ['/photos/exterieur/celeste-maison-piscine-transats.jpg'],
  },
  // CHANGEMENT : autorise explicitement les grands aperçus image/texte
  // (rich results) — aide l'affichage du nom + visuel dans Google.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'La Boire Bavard',
  alternateName: "Chambres d'Hôtes La Boire Bavard",
  url: 'https://www.laboirebavard.com',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BedAndBreakfast',
  name: 'La Boire Bavard',
  description: "Maison d'hôtes de charme entre Angers et Saumur. Piscine, jardin arboré, petit-déjeuner gourmand. Note 9.9/10.",
  url: 'https://www.laboirebavard.com',
  telephone: '+33675786335',
  email: 'contact@laboirebavard.com',
  priceRange: '90€',
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
    latitude: 47.3952,
    longitude: -0.3690,
  },
  logo: 'https://www.laboirebavard.com/icons/icon-192.png',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '9.9',
    bestRating: '10',
    ratingCount: '200',
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Piscine',               value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Petit-déjeuner inclus', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'WiFi gratuit',          value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Planche du soir',       value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Jardin',                value: true },
  ],
  hasMap: 'https://maps.google.com/?q=47.3952,-0.3690',
  image: 'https://www.laboirebavard.com/photos/exterieur/celeste-maison-piscine-transats.jpg',
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
