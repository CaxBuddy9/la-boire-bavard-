'use client'

import { useEffect, useState } from 'react'
import { LogoSVG } from './Logo'

export default function GuideIntro({
  children,
  roomName,
}: {
  children: React.ReactNode
  roomName: string
}) {
  const [phase, setPhase] = useState<'show' | 'opening' | 'done'>('show')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('opening'), 2200)
    const t2 = setTimeout(() => setPhase('done'), 3800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <>
      {children}

      {phase !== 'done' && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            perspective: '1400px',
            perspectiveOrigin: '50% 50%',
            overflow: 'hidden',
          }}
        >
          {/* ── PORTE GAUCHE ── */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '50%', height: '100%',
            transformOrigin: '0% 50%',
            transform: phase === 'opening' ? 'rotateY(-105deg)' : 'rotateY(0deg)',
            transition: 'transform 1.5s cubic-bezier(0.65, 0, 0.35, 1)',
            transformStyle: 'preserve-3d',
          }}>
            {/* Face avant */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(160deg, #1e3a22 0%, #122018 100%)',
              boxShadow: 'inset -6px 0 24px rgba(0,0,0,0.5)',
            }}>
              {/* Moulure haut */}
              <div style={{ position: 'absolute', top: 24, left: 20, right: 20, height: '28%', border: '1px solid rgba(196,160,80,0.25)', borderRadius: '3px' }} />
              {/* Moulure bas */}
              <div style={{ position: 'absolute', bottom: 24, left: 20, right: 20, height: '38%', border: '1px solid rgba(196,160,80,0.25)', borderRadius: '3px' }} />
              {/* Poignée gauche */}
              <div style={{
                position: 'absolute', top: '50%', right: 18,
                transform: 'translateY(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <div style={{ width: 8, height: 50, background: 'linear-gradient(180deg, #e0c070 0%, #a07828 100%)', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }} />
                <div style={{ width: 14, height: 5, background: '#c4a050', borderRadius: 2, opacity: 0.7 }} />
              </div>
            </div>
            {/* Tranche latérale (épaisseur de la porte) */}
            <div style={{
              position: 'absolute', top: 0, right: -16, width: 16, height: '100%',
              background: '#0a1510',
              transform: 'rotateY(90deg)',
              transformOrigin: 'left center',
            }} />
          </div>

          {/* ── PORTE DROITE ── */}
          <div style={{
            position: 'absolute',
            top: 0, right: 0,
            width: '50%', height: '100%',
            transformOrigin: '100% 50%',
            transform: phase === 'opening' ? 'rotateY(105deg)' : 'rotateY(0deg)',
            transition: 'transform 1.5s cubic-bezier(0.65, 0, 0.35, 1)',
            transformStyle: 'preserve-3d',
          }}>
            {/* Face avant */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(200deg, #1e3a22 0%, #122018 100%)',
              boxShadow: 'inset 6px 0 24px rgba(0,0,0,0.5)',
            }}>
              {/* Moulure haut */}
              <div style={{ position: 'absolute', top: 24, left: 20, right: 20, height: '28%', border: '1px solid rgba(196,160,80,0.25)', borderRadius: '3px' }} />
              {/* Moulure bas */}
              <div style={{ position: 'absolute', bottom: 24, left: 20, right: 20, height: '38%', border: '1px solid rgba(196,160,80,0.25)', borderRadius: '3px' }} />
              {/* Poignée droite */}
              <div style={{
                position: 'absolute', top: '50%', left: 18,
                transform: 'translateY(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <div style={{ width: 8, height: 50, background: 'linear-gradient(180deg, #e0c070 0%, #a07828 100%)', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }} />
                <div style={{ width: 14, height: 5, background: '#c4a050', borderRadius: 2, opacity: 0.7 }} />
              </div>
            </div>
            {/* Tranche (épaisseur) */}
            <div style={{
              position: 'absolute', top: 0, left: -16, width: 16, height: '100%',
              background: '#0a1510',
              transform: 'rotateY(-90deg)',
              transformOrigin: 'right center',
            }} />
          </div>

          {/* ── FOND derrière les portes ── */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: -1,
            background: '#0a1208',
          }} />

          {/* ── Jointure centrale ── */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', zIndex: 10,
            width: 2, height: '100%',
            background: 'linear-gradient(180deg, transparent 5%, rgba(196,160,80,0.7) 20%, rgba(196,160,80,0.7) 80%, transparent 95%)',
            transform: 'translateX(-1px)',
          }} />

          {/* ── Logo + Bienvenue — disparaît à l'ouverture ── */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: phase === 'opening' ? 0 : 1,
            transform: phase === 'opening' ? 'scale(0.92)' : 'scale(1)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            pointerEvents: 'none',
            textAlign: 'center',
            padding: '0 2rem',
          }}>
            <LogoSVG height={148} />
            <div style={{ width: 44, height: 1, background: '#c4a050', margin: '1.5rem auto 1.5rem', opacity: 0.8 }} />
            <p style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: 'clamp(1.8rem, 6vw, 2.6rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'white',
              margin: 0,
              letterSpacing: '0.02em',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}>
              Bienvenue
            </p>
            <p style={{
              color: '#c4a050',
              fontSize: '0.72rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              marginTop: '0.9rem',
            }}>
              {roomName}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
