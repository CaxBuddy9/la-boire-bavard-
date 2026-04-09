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
  const [open, setOpen] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setOpen(true), 1800)   // portes s'ouvrent
    const t2 = setTimeout(() => setGone(true), 3100)   // overlay retiré du DOM
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <>
      {/* ── Contenu de la page — toujours rendu, caché derrière les portes ── */}
      {children}

      {/* ── Overlay double porte ── */}
      {!gone && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            overflow: 'hidden', pointerEvents: open ? 'none' : 'all',
          }}
        >
          {/* Porte gauche */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: '50%', height: '100%',
            background: 'linear-gradient(180deg, #162b1a 0%, #0e1f10 100%)',
            transform: open ? 'translateX(-100%)' : 'translateX(0)',
            transition: 'transform 1.25s cubic-bezier(0.76, 0, 0.24, 1)',
          }}>
            {/* Poignée gauche */}
            <div style={{
              position: 'absolute', top: '50%', right: '14px',
              transform: 'translateY(-50%)',
              width: '6px', height: '52px',
              background: '#c4a050', borderRadius: '3px',
              opacity: open ? 0 : 0.85,
              transition: 'opacity 0.3s ease',
            }} />
          </div>

          {/* Porte droite */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '50%', height: '100%',
            background: 'linear-gradient(180deg, #162b1a 0%, #0e1f10 100%)',
            transform: open ? 'translateX(100%)' : 'translateX(0)',
            transition: 'transform 1.25s cubic-bezier(0.76, 0, 0.24, 1)',
          }}>
            {/* Poignée droite */}
            <div style={{
              position: 'absolute', top: '50%', left: '14px',
              transform: 'translateY(-50%)',
              width: '6px', height: '52px',
              background: '#c4a050', borderRadius: '3px',
              opacity: open ? 0 : 0.85,
              transition: 'opacity 0.3s ease',
            }} />
          </div>

          {/* Filet d'or central (jointure des portes) */}
          <div style={{
            position: 'absolute', top: 0, left: '50%',
            width: '1px', height: '100%',
            background: 'rgba(196,160,80,0.5)',
            transform: 'translateX(-0.5px)',
          }} />

          {/* ── Logo + Bienvenue — centré, disparaît au moment de l'ouverture ── */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', zIndex: 1,
            opacity: open ? 0 : 1,
            transition: 'opacity 0.45s ease',
            pointerEvents: 'none',
            width: '260px',
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.25rem' }}>
              <LogoSVG height={130} />
            </div>

            {/* Ligne or */}
            <div style={{ width: '36px', height: '1px', background: '#c4a050', margin: '1rem auto 1.25rem' }} />

            {/* Bienvenue */}
            <p style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: '2.2rem',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'white',
              margin: 0,
              lineHeight: 1,
            }}>
              Bienvenue
            </p>

            {/* Nom de la chambre */}
            <p style={{
              color: '#c4a050',
              fontSize: '0.7rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginTop: '0.75rem',
            }}>
              {roomName}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
