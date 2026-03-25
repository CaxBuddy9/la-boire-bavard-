import Link from 'next/link'
import Image from 'next/image'
import {
  LogoLLA, LogoDestinationAnjou, LogoQualiteTourisme,
  LogoOfficeTourisme, LogoVignobles, LogoAccueilVelo,
  LogoLoireVelo, LogoEcoAttitude,
} from '@/components/TourismLogos'

const NAV = [
  { href: '/',                label: 'Accueil' },
  { href: '/propriete',       label: 'La propriété' },
  { href: '/chambres',        label: 'Chambres' },
  { href: '/bienetre',        label: 'Bien-être' },
  { href: '/petitdej',        label: 'Petit-déjeuner' },
  { href: '/avis',            label: 'Avis' },
  { href: '/contact',         label: 'Contact & Accès' },
  { href: '/mentions-legales',label: 'Mentions légales' },
]

const LABELS = [
  { href: 'https://www.loire-layon-aubance.fr', C: LogoLLA,              label: 'Loire Layon Aubance' },
  { href: 'https://anjou-vignoble-villages.com', C: LogoDestinationAnjou, label: 'Destination Anjou' },
  { href: null,                                  C: LogoQualiteTourisme,  label: 'Qualité Tourisme' },
  { href: null,                                  C: LogoOfficeTourisme,   label: 'Office de Tourisme' },
  { href: null,                                  C: LogoVignobles,        label: 'Vignobles & Découvertes' },
  { href: null,                                  C: LogoAccueilVelo,      label: 'Accueil Vélo' },
  { href: 'https://www.loireavelo.fr',           C: LogoLoireVelo,        label: 'La Loire à Vélo' },
  { href: null,                                  C: LogoEcoAttitude,      label: 'Éco Attitude' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#0d110e' }} className="font-sans">
      <div className="max-w-5xl mx-auto px-8 py-12 text-center">

        <div className="font-serif text-white text-xl tracking-wide mb-1">La Boire Bavard</div>
        <div className="text-[0.52rem] tracking-[0.38em] uppercase mb-8" style={{ color: 'rgba(196,160,80,.5)' }}>
          Chambres d&apos;Hôtes · Anjou
        </div>

        {/* Gold line */}
        <div style={{ width: 48, height: 1, background: 'rgba(196,160,80,.5)', margin: '0 auto 32px' }} />

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href}
              className="text-[0.58rem] tracking-[0.2em] uppercase text-white/40 hover:text-gold transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Tous les logos — une seule rangée avec barres dorées */}
        <div className="flex justify-center items-center gap-x-4 mb-10 overflow-x-hidden"
          style={{ opacity: 0.45, flexWrap: 'nowrap' }}>
          <span style={{ width: 32, height: 1, background: 'rgba(196,160,80,.6)', flexShrink: 0 }} />
          {LABELS.map(({ href, C, label }) => href ? (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
              className="hover:opacity-100 transition-opacity"
              style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
            >
              <C />
            </a>
          ) : (
            <span key={label} title={label} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <C />
            </span>
          ))}
          <a href="https://golfangers.fr" target="_blank" rel="noopener noreferrer"
            className="hover:opacity-100 transition-opacity"
            style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
          >
            <Image src="/logos/golf-angers.png" alt="Golf d'Angers" height={36} width={120}
              className="object-contain w-auto" style={{ height: 36, mixBlendMode: 'screen' }}
            />
          </a>
          <span style={{ width: 32, height: 1, background: 'rgba(196,160,80,.6)', flexShrink: 0 }} />
        </div>

        {/* Séparateur gold */}
        <div style={{ width: '100%', height: 1, background: 'rgba(196,160,80,.1)', marginBottom: 24 }} />

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[0.68rem] text-white/35 mb-6">
          <a href="tel:0675786335" className="hover:text-gold transition-colors">06 75 78 63 35</a>
          <span style={{ color: 'rgba(255,255,255,.12)' }}>·</span>
          <a href="mailto:laboirebavard@gmail.com" className="hover:text-gold transition-colors">laboirebavard@gmail.com</a>
          <span style={{ color: 'rgba(255,255,255,.12)' }}>·</span>
          <a href="https://wa.me/33675786335" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">WhatsApp</a>
        </div>

        <p className="text-[0.54rem] tracking-[0.1em] text-white/20">
          © 2026 La Boire Bavard · 4 chemin de la Boire Bavard, 49320 Blaison-Saint-Sulpice
        </p>

      </div>
    </footer>
  )
}
