import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QR Codes chambres — La Boire Bavard',
  robots: { index: false, follow: false },
}

// URL de base du site — mettre le vrai domaine Vercel quand en prod
const BASE_URL = 'https://la-boire-bavard.vercel.app'

const CHAMBRES = [
  { id: 'jardin',  label: 'Côté Jardin',  emoji: '🌿', couleur: '#1a3320' },
  { id: 'cedre',   label: 'Côté Cèdre',   emoji: '🌲', couleur: '#1e2a18' },
  { id: 'vallee',  label: 'Côté Vallée',  emoji: '🏞️', couleur: '#1a2830' },
  { id: 'potager', label: 'Côté Potager', emoji: '🌱', couleur: '#1e2d16' },
]

export default function QRCodesPage() {
  return (
    <main style={{
      fontFamily: 'Georgia, serif',
      background: '#f5f0e8',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: '#1a3320', marginBottom: '0.5rem' }}>
            Livrets d'accueil — QR Codes
          </h1>
          <p style={{ color: '#6a6a6a', fontSize: '0.9rem' }}>
            Imprimez cette page et découpez chaque QR code pour l'afficher dans la chambre correspondante.
          </p>
        </div>

        {/* Grille 2×2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
        }}>
          {CHAMBRES.map(({ id, label, emoji, couleur }) => {
            const url = `${BASE_URL}/guide/${id}`
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(url)}`
            return (
              <div key={id} style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                pageBreakInside: 'avoid',
              }}>
                {/* En-tête coloré */}
                <div style={{
                  background: couleur,
                  padding: '1rem',
                  textAlign: 'center',
                  color: 'white',
                }}>
                  <span style={{ fontSize: '1.75rem' }}>{emoji}</span>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 500, marginTop: '0.25rem' }}>
                    {label}
                  </h2>
                  <p style={{ fontSize: '0.7rem', color: '#c4a050', marginTop: '0.2rem' }}>
                    La Boire Bavard
                  </p>
                </div>

                {/* QR Code */}
                <div style={{ padding: '1.25rem', textAlign: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrUrl}
                    alt={`QR code livret d'accueil ${label}`}
                    width={220}
                    height={220}
                    style={{ display: 'block', margin: '0 auto' }}
                  />
                  <p style={{
                    fontSize: '0.65rem',
                    color: '#8a8a8a',
                    marginTop: '0.75rem',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                  }}>
                    {url}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#1a3320',
                    marginTop: '0.5rem',
                    fontStyle: 'italic',
                  }}>
                    Scannez pour accéder au livret
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Instructions */}
        <div style={{
          marginTop: '2rem',
          padding: '1.25rem',
          background: '#1a3320',
          borderRadius: '12px',
          color: '#ddd8d0',
          fontSize: '0.85rem',
          lineHeight: 1.7,
        }}>
          <strong style={{ color: '#c4a050' }}>Comment utiliser ces QR codes :</strong><br />
          1. Imprimez cette page (de préférence en couleur)<br />
          2. Découpez chaque carte et plastifiez-la si possible<br />
          3. Placez le QR code dans la chambre correspondante (bureau, table de nuit...)<br />
          4. Les hôtes n'ont qu'à scanner avec leur téléphone — sans appli à télécharger
        </div>

        {/* Rappel domaine */}
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#9a9a9a', marginTop: '1.5rem' }}>
          ⚠️ Si vous changez de domaine, mettez à jour <code>BASE_URL</code> dans{' '}
          <code>src/app/guide/qrcodes/page.tsx</code>
        </p>

      </div>
    </main>
  )
}
