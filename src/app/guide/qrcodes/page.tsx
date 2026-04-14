import type { Metadata } from 'next'
import { buildQRDataUri } from '@/lib/qr'

export const metadata: Metadata = {
  title: 'QR Codes chambres — La Boire Bavard',
  robots: { index: false, follow: false },
}

const BASE_URL = 'https://la-boire-bavard.vercel.app'

const CHAMBRES = [
  { id: 'jardin',  label: 'Côté Jardin',  emoji: '🌿', couleur: '#1a3320', qrColor: '#1a3320' },
  { id: 'cedre',   label: 'Côté Cèdre',   emoji: '🌲', couleur: '#1e2a18', qrColor: '#08091a' },
  { id: 'vallee',  label: 'Côté Vallée',  emoji: '🏞️', couleur: '#1a2830', qrColor: '#1a2832' },
  { id: 'potager', label: 'Côté Potager', emoji: '🌱', couleur: '#1e2d16', qrColor: '#130e07' },
]

export default function QRCodesPage() {
  return (
    <main style={{
      fontFamily: 'Georgia, serif',
      background: 'linear-gradient(160deg, #f5f0e8 0%, #ede8dc 100%)',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      <style>{`
        @keyframes swing {
          0%, 100% { transform: rotate(-5deg); }
          50%       { transform: rotate(5deg);  }
        }
        @keyframes doorOpen {
          0%   { transform: perspective(800px) rotateY(0deg); }
          40%  { transform: perspective(800px) rotateY(-30deg); }
          70%  { transform: perspective(800px) rotateY(-28deg); }
          100% { transform: perspective(800px) rotateY(-30deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .door-panel  { transform-origin: left center; animation: doorOpen 1.8s cubic-bezier(.4,0,.2,1) 0.3s both; }
        .plaque-swing{ transform-origin: top center;  animation: swing 3.2s ease-in-out 2s infinite; }
        .fade-up     { animation: fadeUp 0.7s ease both; }
        .fade-up-1   { animation-delay: 0.9s; }
        .fade-up-2   { animation-delay: 1.1s; }
      `}</style>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* ── Animation porte ── */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <svg viewBox="0 0 260 360" width="200" height="277"
            style={{ display: 'inline-block', filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.22))' }}
            aria-hidden="true"
          >
            <rect x="10" y="0" width="240" height="360" rx="6" fill="#2a1f14"/>
            <rect x="10" y="340" width="240" height="20" rx="3" fill="#1e1510"/>
            <g className="door-panel">
              <rect x="16" y="6" width="228" height="334" rx="5" fill="#1a3320"/>
              <line x1="40"  y1="6" x2="40"  y2="340" stroke="#1e3d25" strokeWidth="1" opacity="0.4"/>
              <line x1="80"  y1="6" x2="80"  y2="340" stroke="#1e3d25" strokeWidth="1" opacity="0.4"/>
              <line x1="130" y1="6" x2="130" y2="340" stroke="#1e3d25" strokeWidth="1" opacity="0.3"/>
              <line x1="180" y1="6" x2="180" y2="340" stroke="#1e3d25" strokeWidth="1" opacity="0.3"/>
              <line x1="220" y1="6" x2="220" y2="340" stroke="#1e3d25" strokeWidth="1" opacity="0.4"/>
              <rect x="26"  y="16"  width="95"  height="150" rx="4" fill="#1e3d25" stroke="#2a4a30" strokeWidth="1.5"/>
              <rect x="139" y="16"  width="95"  height="150" rx="4" fill="#1e3d25" stroke="#2a4a30" strokeWidth="1.5"/>
              <rect x="26"  y="178" width="208" height="148" rx="4" fill="#1e3d25" stroke="#2a4a30" strokeWidth="1.5"/>
              <circle cx="130" cy="100" r="22" fill="#1a3320" stroke="#c4a050" strokeWidth="1.5"/>
              <text x="130" y="106" textAnchor="middle" fontSize="18" fontWeight="700"
                    fontFamily="Georgia, serif" fill="#c4a050">BB</text>
              <circle cx="190" cy="260" r="10" fill="#c4a050"/>
              <circle cx="190" cy="260" r="6"  fill="#b8922a"/>
              <circle cx="190" cy="260" r="2.5" fill="#c4a050"/>
              <rect x="186" y="240" width="8" height="42" rx="4" fill="#b8922a" opacity="0.7"/>
              <g className="plaque-swing">
                <line x1="190" y1="248" x2="190" y2="270" stroke="#b8922a" strokeWidth="1.5"/>
                <rect x="158" y="270" width="64" height="86" rx="8" fill="#faf7f2" stroke="#c4a050" strokeWidth="1.5"/>
                <g transform="translate(152.5,271.75) scale(0.375)">
                  <rect x="78" y="18" width="8"  height="118" rx="2"   fill="#b8922a"/>
                  <rect x="60" y="18" width="20" height="6"   rx="1.5" fill="#b8922a"/>
                  <rect x="60" y="76" width="20" height="5"   rx="1.5" fill="#b8922a"/>
                  <rect x="60" y="130" width="20" height="6"  rx="1.5" fill="#b8922a"/>
                  <path d="M86,18 Q44,18 44,47 Q44,76 86,76"    stroke="#b8922a" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M86,76 Q36,76 36,103 Q36,136 86,136" stroke="#b8922a" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="114" y="18" width="8"  height="118" rx="2"   fill="#b8922a"/>
                  <rect x="120" y="18" width="20" height="6"   rx="1.5" fill="#b8922a"/>
                  <rect x="120" y="76" width="20" height="5"   rx="1.5" fill="#b8922a"/>
                  <rect x="120" y="130" width="20" height="6"  rx="1.5" fill="#b8922a"/>
                  <path d="M114,18 Q156,18 156,47 Q156,76 114,76"    stroke="#b8922a" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M114,76 Q164,76 164,103 Q164,136 114,136" stroke="#b8922a" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="94" y="14"  width="12" height="4" rx="2" fill="#b8922a" opacity=".6"/>
                  <rect x="94" y="128" width="12" height="4" rx="2" fill="#b8922a" opacity=".6"/>
                </g>
                <rect x="164" y="322" width="52" height="1" fill="#c4a050" opacity="0.5"/>
                <text x="190" y="333" textAnchor="middle" fontSize="6.5"
                      fontFamily="Arial, sans-serif" fill="#1a3320" letterSpacing="0.8">SCANNEZ-MOI</text>
                <text x="190" y="349" textAnchor="middle" fontSize="5.5"
                      fontFamily="Arial, sans-serif" fill="#c4a050" letterSpacing="1">LA BOIRE BAVARD</text>
              </g>
            </g>
            <rect x="10" y="0" width="240" height="360" rx="6" fill="none" stroke="#c4a050" strokeWidth="1.5" opacity="0.4"/>
          </svg>
        </div>

        {/* En-tête */}
        <div className="fade-up fade-up-1" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: '#1a3320', marginBottom: '0.5rem' }}>
            Livrets d'accueil — QR Codes
          </h1>
          <p style={{ color: '#6a6a6a', fontSize: '0.9rem' }}>
            Imprimez et découpez chaque carte pour l'afficher dans la chambre correspondante.
          </p>
        </div>

        {/* Grille 2×2 — QR codes avec logo BB */}
        <div className="fade-up fade-up-2" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
        }}>
          {CHAMBRES.map(({ id, label, emoji, couleur, qrColor }) => {
            const url   = `${BASE_URL}/guide/${id}`
            const qrUri = buildQRDataUri(url, qrColor)
            return (
              <div key={id} style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                pageBreakInside: 'avoid',
              }}>
                <div style={{ background: couleur, padding: '1rem', textAlign: 'center', color: 'white' }}>
                  <span style={{ fontSize: '1.75rem' }}>{emoji}</span>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 500, marginTop: '0.25rem' }}>{label}</h2>
                  <p style={{ fontSize: '0.7rem', color: '#c4a050', marginTop: '0.2rem' }}>La Boire Bavard</p>
                </div>
                <div style={{ padding: '1.25rem', textAlign: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUri} alt={`QR code ${label}`} width={220} height={220}
                    style={{ display: 'block', margin: '0 auto' }} />
                  <p style={{ fontSize: '0.65rem', color: '#8a8a8a', marginTop: '0.75rem',
                    wordBreak: 'break-all', fontFamily: 'monospace' }}>{url}</p>
                  <p style={{ fontSize: '0.75rem', color: '#1a3320', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    Scannez pour accéder au livret
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#1a3320',
          borderRadius: '12px', color: '#ddd8d0', fontSize: '0.85rem', lineHeight: 1.7 }}>
          <strong style={{ color: '#c4a050' }}>Comment utiliser ces QR codes :</strong><br />
          1. Imprimez cette page (de préférence en couleur)<br />
          2. Découpez chaque carte et plastifiez-la si possible<br />
          3. Placez le QR code dans la chambre correspondante (bureau, table de nuit...)<br />
          4. Les hôtes n'ont qu'à scanner avec leur téléphone — sans appli à télécharger
        </div>
      </div>
    </main>
  )
}
