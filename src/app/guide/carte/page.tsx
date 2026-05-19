import type { Metadata } from 'next'
import { MENU } from '@/lib/menu'

export const metadata: Metadata = {
  title: 'Carte Boissons & Snacks — La Boire Bavard',
  robots: { index: false, follow: false },
}

export default function CartePage() {
  return (
    <main style={{
      fontFamily: 'Georgia, serif',
      background: 'linear-gradient(160deg, #f5f0e8 0%, #ede8dc 100%)',
      minHeight: '100vh',
      padding: '2.5rem 1.5rem',
    }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          main { background: #fff !important; padding: 0 !important; }
        }
      `}</style>

      {/* ── Carte ── */}
      <div style={{
        maxWidth: 560,
        margin: '0 auto',
        background: '#fffdf8',
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        border: '1px solid rgba(196,160,80,0.25)',
        pageBreakInside: 'avoid',
      }}>
        {/* En-tête */}
        <div style={{ background: 'linear-gradient(160deg, #1a3320 0%, #0e1a10 100%)', padding: '2.25rem 2rem 1.85rem', textAlign: 'center' }}>
          <p style={{ color: '#c4a050', fontSize: '0.62rem', letterSpacing: '0.32em', textTransform: 'uppercase', margin: '0 0 0.65rem' }}>
            La Boire Bavard
          </p>
          <h1 style={{ color: '#fffdf8', fontSize: '2rem', fontWeight: 400, margin: 0, fontStyle: 'italic' }}>
            Boissons &amp; Snacks
          </h1>
          <div style={{ width: 44, height: 1, background: '#c4a050', margin: '1rem auto 0' }} />
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', margin: '0.85rem 0 0', fontStyle: 'italic' }}>
            Servez-vous — réglez avec Sandrine
          </p>
        </div>

        {/* Sections */}
        <div style={{ padding: '1.85rem 2rem 2rem' }}>
          {MENU.map((section, si) => (
            <div key={si} style={{ marginBottom: si < MENU.length - 1 ? '1.85rem' : 0 }}>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a3320', margin: '0 0 0.9rem', fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>
                {section.emoji} {section.cat.fr}
              </p>
              {section.items.map((item, ii) => (
                <div key={ii} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem',
                  padding: '0.65rem 0',
                  borderBottom: ii < section.items.length - 1 ? '1px dotted rgba(26,51,32,0.22)' : 'none',
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '1rem', color: '#2a2018' }}>{item.name.fr}</p>
                    <p style={{ margin: '0.12rem 0 0', fontSize: '0.76rem', color: '#9a8a72', fontStyle: 'italic' }}>{item.name.en}</p>
                  </div>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#c4603a', whiteSpace: 'nowrap' }}>{item.price}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Pied */}
        <div style={{ background: '#1a3320', padding: '1rem 2rem', textAlign: 'center' }}>
          <p style={{ color: '#c4a050', fontSize: '0.72rem', margin: 0, letterSpacing: '0.05em' }}>
            06 75 78 63 35 · La Boire Bavard, Anjou
          </p>
        </div>
      </div>

      {/* Note (non imprimée) */}
      <div className="no-print" style={{
        maxWidth: 560, margin: '1.5rem auto 0', padding: '1rem 1.25rem',
        background: '#1a3320', borderRadius: 12, color: '#ddd8d0', fontSize: '0.8rem', lineHeight: 1.65,
      }}>
        <strong style={{ color: '#c4a050' }}>Carte à imprimer :</strong> imprimez cette page et placez-la dans
        chaque chambre ou dans le salon. Pour modifier les prix ou les articles, éditez{' '}
        <code style={{ fontFamily: 'monospace', color: 'rgba(196,160,80,.7)' }}>src/lib/menu.ts</code>{' '}
        — le livret numérique et cette carte se mettent à jour ensemble.
      </div>
    </main>
  )
}
