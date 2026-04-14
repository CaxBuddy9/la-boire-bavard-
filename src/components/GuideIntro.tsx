'use client'

import { useEffect, useState } from 'react'
import { LogoSVG } from './Logo'

type Phase = 'enter' | 'show' | 'opening' | 'fadeout' | 'done'

export default function GuideIntro({ children, roomName }: { children: React.ReactNode; roomName: string }) {
  const [phase, setPhase] = useState<Phase>('enter')

  useEffect(() => {
    const t0 = setTimeout(() => setPhase('show'),    60)
    const t1 = setTimeout(() => setPhase('opening'), 1200)
    const t2 = setTimeout(() => setPhase('fadeout'), 2500)
    const t3 = setTimeout(() => setPhase('done'),    3100)
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (phase === 'done') return <>{children}</>

  const isOpen = phase === 'opening' || phase === 'fadeout'
  const isFading = phase === 'fadeout'

  return (
    <>
      {children}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          overflow: 'hidden',
          opacity: isFading ? 0 : 1,
          transition: isFading ? 'opacity 0.7s ease' : undefined,
        }}
      >
        <style>{`
          @keyframes logoAppear {
            from { opacity: 0; transform: translateY(12px) scale(0.95); }
            to   { opacity: 1; transform: translateY(0)   scale(1); }
          }
          @keyframes lightPulse {
            0%, 100% { opacity: 0.6; }
            50%       { opacity: 1; }
          }
          @keyframes crackGlow {
            0%   { opacity: 0; box-shadow: none; }
            40%  { opacity: 1; box-shadow: 0 0 12px 4px rgba(196,160,80,0.5); }
            100% { opacity: 1; box-shadow: 0 0 40px 20px rgba(196,160,80,0.9), 0 0 120px 60px rgba(255,220,120,0.4); }
          }
        `}</style>

        {/* ── FOND DERRIÈRE LES PORTES ── */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, #2a5030 0%, #0a1208 60%)',
        }} />

        {/* ── LUMIÈRE QUI JAILLIT À L'OUVERTURE ── */}
        {isOpen && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(255,220,120,0.22) 0%, transparent 60%)',
            animation: 'lightPulse 1.5s ease',
          }} />
        )}

        {/* Perspective wrapper */}
        <div style={{
          position: 'absolute', inset: 0,
          perspective: '2800px',
          perspectiveOrigin: '50% 48%',
        }}>
          {/* ── PORTE GAUCHE ── */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: '50%', height: '100%',
            transformOrigin: '0% 50%',
            transform: isOpen ? 'rotateY(-105deg)' : 'rotateY(0deg)',
            transition: isOpen ? 'transform 1.1s cubic-bezier(0.6, 0.05, 0.15, 1)' : undefined,
            transformStyle: 'preserve-3d',
          }}>
            {/* Face porte gauche */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(105deg, #253a28 0%, #162018 55%, #0e1a10 100%)',
              boxShadow: 'inset -8px 0 32px rgba(0,0,0,0.6)',
            }}>
              {/* Moulure haute */}
              <div style={{ position:'absolute', top:20, left:18, right:18, height:'26%', border:'1px solid rgba(196,160,80,0.2)', borderRadius:2 }}>
                <div style={{ position:'absolute', inset:6, border:'1px solid rgba(196,160,80,0.1)', borderRadius:1 }} />
              </div>
              {/* Moulure basse */}
              <div style={{ position:'absolute', bottom:20, left:18, right:18, height:'42%', border:'1px solid rgba(196,160,80,0.2)', borderRadius:2 }}>
                <div style={{ position:'absolute', inset:8, border:'1px solid rgba(196,160,80,0.1)', borderRadius:1 }} />
              </div>
              {/* Filet doré haut */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg, transparent, rgba(196,160,80,0.4), transparent)' }} />
              {/* Poignée */}
              <div style={{
                position:'absolute', top:'50%', right:16,
                transform:'translateY(-50%)',
                display:'flex', flexDirection:'column', alignItems:'center', gap:5,
              }}>
                <div style={{ width:7, height:54, background:'linear-gradient(180deg, #e8cc78 0%, #b08830 50%, #a07020 100%)', borderRadius:3.5, boxShadow:'0 2px 12px rgba(0,0,0,0.6), 0 0 6px rgba(196,160,80,0.3)' }} />
                <div style={{ width:13, height:4, background:'#c4a050', borderRadius:2, opacity:0.75 }} />
              </div>
              {/* Reflet lumière gauche */}
              <div style={{ position:'absolute', top:0, left:0, width:'30%', height:'100%', background:'linear-gradient(90deg, rgba(255,255,255,0.04), transparent)', borderRadius:'0 100% 100% 0' }} />
            </div>
            {/* Épaisseur porte gauche */}
            <div style={{
              position:'absolute', top:0, right:-18, width:18, height:'100%',
              background:'linear-gradient(90deg, #060e08, #0e1a10)',
              transform:'rotateY(90deg)',
              transformOrigin:'left center',
            }} />
          </div>

          {/* ── PORTE DROITE ── */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '50%', height: '100%',
            transformOrigin: '100% 50%',
            transform: isOpen ? 'rotateY(105deg)' : 'rotateY(0deg)',
            transition: isOpen ? 'transform 1.1s cubic-bezier(0.6, 0.05, 0.15, 1)' : undefined,
            transformStyle: 'preserve-3d',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(255deg, #253a28 0%, #162018 55%, #0e1a10 100%)',
              boxShadow: 'inset 8px 0 32px rgba(0,0,0,0.6)',
            }}>
              <div style={{ position:'absolute', top:20, left:18, right:18, height:'26%', border:'1px solid rgba(196,160,80,0.2)', borderRadius:2 }}>
                <div style={{ position:'absolute', inset:6, border:'1px solid rgba(196,160,80,0.1)', borderRadius:1 }} />
              </div>
              <div style={{ position:'absolute', bottom:20, left:18, right:18, height:'42%', border:'1px solid rgba(196,160,80,0.2)', borderRadius:2 }}>
                <div style={{ position:'absolute', inset:8, border:'1px solid rgba(196,160,80,0.1)', borderRadius:1 }} />
              </div>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg, transparent, rgba(196,160,80,0.4), transparent)' }} />
              {/* Poignée */}
              <div style={{
                position:'absolute', top:'50%', left:16,
                transform:'translateY(-50%)',
                display:'flex', flexDirection:'column', alignItems:'center', gap:5,
              }}>
                <div style={{ width:7, height:54, background:'linear-gradient(180deg, #e8cc78 0%, #b08830 50%, #a07020 100%)', borderRadius:3.5, boxShadow:'0 2px 12px rgba(0,0,0,0.6), 0 0 6px rgba(196,160,80,0.3)' }} />
                <div style={{ width:13, height:4, background:'#c4a050', borderRadius:2, opacity:0.75 }} />
              </div>
              <div style={{ position:'absolute', top:0, right:0, width:'30%', height:'100%', background:'linear-gradient(270deg, rgba(255,255,255,0.04), transparent)', borderRadius:'100% 0 0 100%' }} />
            </div>
            <div style={{
              position:'absolute', top:0, left:-18, width:18, height:'100%',
              background:'linear-gradient(270deg, #060e08, #0e1a10)',
              transform:'rotateY(-90deg)',
              transformOrigin:'right center',
            }} />
          </div>
        </div>

        {/* ── JOINTURE : intégrée au flux, disparaît avec les portes ── */}
        <div style={{
          position:'absolute', top:0, left:'50%', zIndex:20,
          width:2, height:'100%',
          transform:'translateX(-1px)',
          opacity: isOpen ? 0 : 1,
          transition: isOpen ? 'opacity 0.3s ease' : undefined,
          background:'linear-gradient(180deg, transparent 3%, rgba(196,160,80,0.65) 15%, rgba(196,160,80,0.65) 85%, transparent 97%)',
          animation: !isOpen && phase === 'show' ? 'crackGlow 2.4s ease forwards' : undefined,
        }} />

        {/* ── LOGO + BIENVENUE ── */}
        <div style={{
          position:'absolute', inset:0, zIndex:15,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
          transition: isOpen ? 'opacity 0.4s ease, transform 0.4s ease' : undefined,
          pointerEvents:'none',
          textAlign:'center',
        }}>
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'center',
            width:160, height:160,
            animation: phase === 'show' ? 'logoAppear 0.8s ease forwards' : undefined,
            opacity: phase === 'enter' ? 0 : 1,
          }}>
            <LogoSVG height={140} />
          </div>
          <div style={{ width:44, height:1, background:'#c4a050', margin:'1.2rem auto', opacity:0.85 }} />
          <p style={{
            fontFamily:'var(--font-playfair, Georgia, serif)',
            fontSize:'clamp(1.7rem, 5.5vw, 2.4rem)',
            fontStyle:'italic', fontWeight:400,
            color:'#fff', margin:0, letterSpacing:'0.02em',
            animation: phase === 'show' ? 'logoAppear 0.9s 0.15s ease both' : undefined,
            opacity: phase === 'enter' ? 0 : 1,
          }}>
            Bienvenue
          </p>
          <p style={{
            color:'#c4a050', fontSize:'0.65rem',
            letterSpacing:'0.3em', textTransform:'uppercase', marginTop:'0.75rem',
            animation: phase === 'show' ? 'logoAppear 0.9s 0.3s ease both' : undefined,
            opacity: phase === 'enter' ? 0 : 1,
          }}>
            {roomName}
          </p>
        </div>
      </div>
    </>
  )
}
