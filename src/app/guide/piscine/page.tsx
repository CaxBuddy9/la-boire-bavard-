import type { Metadata } from 'next'
import PrintButton from '@/components/PrintButton'

export const metadata: Metadata = {
  title: 'Affichette piscine — La Boire Bavard',
  robots: { index: false, follow: false },
}

const FONT_TITLE = 'var(--font-playfair), Georgia, serif'
const FONT_LABEL = 'var(--font-raleway), Arial, sans-serif'
const FONT_BODY  = 'var(--font-garamond), Georgia, serif'
const GOLD = '#c4a050'
const FOREST = '#13211a'
const TERRA = '#c4603a'

export default function AffichettePiscinePage() {
  return (
    <main style={{
      fontFamily: FONT_BODY,
      background: 'linear-gradient(160deg, #f5f0e8 0%, #ece6d8 100%)',
      minHeight: '100vh',
      padding: '2.5rem 1.5rem',
    }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          main { background: #fff !important; padding: 0 !important; }
          @page { size: A4 portrait; margin: 18mm; }
        }
      `}</style>

      {/* ── Affichette ── */}
      <div style={{
        maxWidth: 540,
        margin: '0 auto',
        background: '#fffdf8',
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        border: `1px solid rgba(196,160,80,0.25)`,
        pageBreakInside: 'avoid',
      }}>
        {/* En-tête */}
        <div style={{ background: `linear-gradient(160deg, ${FOREST} 0%, #0c130d 100%)`, padding: '2.25rem 2rem 1.85rem', textAlign: 'center' }}>
          <p style={{ color: GOLD, fontSize: '0.6rem', letterSpacing: '0.34em', textTransform: 'uppercase', margin: '0 0 0.7rem', fontFamily: FONT_LABEL }}>
            La Boire Bavard
          </p>
          <h1 style={{ color: '#fffdf8', fontSize: '2.1rem', fontWeight: 400, margin: 0, fontStyle: 'italic', fontFamily: FONT_TITLE }}>
            Espace piscine
          </h1>
          <div style={{ width: 44, height: 1, background: GOLD, margin: '1rem auto 0' }} />
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', margin: '0.85rem 0 0', fontStyle: 'italic', fontFamily: FONT_BODY }}>
            Bienvenue · Merci de respecter ces consignes
          </p>
        </div>

        {/* Corps : 3 blocs */}
        <div style={{ padding: '2.2rem 2rem 2rem' }}>

          {/* NON FUMEUR */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1.4rem',
            padding: '1.4rem 1.2rem',
            background: 'rgba(196,96,58,0.07)',
            border: `1px solid rgba(196,96,58,0.25)`,
            borderRadius: 12,
            marginBottom: '1.2rem',
          }}>
            <div style={{
              fontSize: '2.6rem', lineHeight: 1, flexShrink: 0,
              width: 64, height: 64,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#fff', borderRadius: '50%',
              border: `2px solid ${TERRA}`,
            }}>🚭</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.64rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: TERRA, fontFamily: FONT_LABEL, fontWeight: 700 }}>
                Espace non-fumeur
              </p>
              <p style={{ margin: '0.35rem 0 0', fontSize: '1.55rem', color: '#2a2018', fontWeight: 400, fontStyle: 'italic', fontFamily: FONT_TITLE }}>
                Merci de ne pas fumer
              </p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#7a6a55', fontFamily: FONT_LABEL }}>
                No smoking · No fumar · Não fumar
              </p>
            </div>
          </div>

          {/* ARRIVÉE */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1.4rem',
            padding: '1.4rem 1.2rem',
            background: 'rgba(19,33,26,0.05)',
            border: `1px solid rgba(19,33,26,0.18)`,
            borderRadius: 12,
            marginBottom: '1.2rem',
          }}>
            <div style={{
              fontSize: '2rem', lineHeight: 1, flexShrink: 0,
              width: 64, height: 64,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: FOREST, borderRadius: '50%',
              color: GOLD, fontFamily: FONT_LABEL, fontWeight: 700,
            }}>→</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.64rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: FOREST, fontFamily: FONT_LABEL, fontWeight: 700 }}>
                Arrivées · Check-in
              </p>
              <p style={{ margin: '0.35rem 0 0', fontSize: '1.85rem', color: '#2a2018', fontWeight: 400, fontStyle: 'italic', fontFamily: FONT_TITLE }}>
                16 h – 20 h
              </p>
            </div>
          </div>

          {/* DÉPART */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1.4rem',
            padding: '1.4rem 1.2rem',
            background: 'rgba(19,33,26,0.05)',
            border: `1px solid rgba(19,33,26,0.18)`,
            borderRadius: 12,
          }}>
            <div style={{
              fontSize: '2rem', lineHeight: 1, flexShrink: 0,
              width: 64, height: 64,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: FOREST, borderRadius: '50%',
              color: GOLD, fontFamily: FONT_LABEL, fontWeight: 700,
            }}>←</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.64rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: FOREST, fontFamily: FONT_LABEL, fontWeight: 700 }}>
                Départs · Check-out
              </p>
              <p style={{ margin: '0.35rem 0 0', fontSize: '1.85rem', color: '#2a2018', fontWeight: 400, fontStyle: 'italic', fontFamily: FONT_TITLE }}>
                Avant 10 h
              </p>
            </div>
          </div>

        </div>

        {/* Pied */}
        <div style={{ background: FOREST, padding: '1rem 2rem', textAlign: 'center' }}>
          <p style={{ color: GOLD, fontSize: '0.72rem', margin: 0, letterSpacing: '0.05em', fontFamily: FONT_LABEL }}>
            Sandrine &amp; Jean-Marc · 06 75 78 63 35 · La Boire Bavard, Anjou
          </p>
        </div>
      </div>

      {/* Note + bouton imprimer (non imprimés) */}
      <div className="no-print" style={{
        maxWidth: 540, margin: '1.5rem auto 0', padding: '1rem 1.25rem',
        background: FOREST, borderRadius: 12, color: '#ddd8d0', fontSize: '0.82rem', lineHeight: 1.65,
        display: 'flex', flexDirection: 'column', gap: '0.8rem', fontFamily: FONT_LABEL,
      }}>
        <div>
          <strong style={{ color: GOLD }}>Affichette à imprimer :</strong> format A4 portrait, à plastifier
          et à placer près de la piscine (entrée, pergola, vestiaire).
        </div>
        <PrintButton />
      </div>
    </main>
  )
}
