'use client'

import { useEffect, useState } from 'react'

type Phase = 'in' | 'out' | 'done'

// Intro courte et sobre : logo + « Bienvenue » qui s'efface en ~1 s.
export default function GuideIntro({ children, roomName }: { children: React.ReactNode; roomName: string }) {
  const [phase, setPhase] = useState<Phase>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), 650)
    const t2 = setTimeout(() => setPhase('done'), 1050)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return <>{children}</>

  return (
    <>
      {children}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#f6f1e8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: phase === 'out' ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      >
        <style>{`
          @keyframes guideIntroIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div style={{ textAlign: 'center', animation: 'guideIntroIn 0.45s ease both' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon-192.png" alt="" width={82} height={82} style={{ display: 'block', margin: '0 auto' }} />
          <p style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: '1.7rem', fontStyle: 'italic', fontWeight: 400,
            color: '#2a2018', margin: '0.9rem 0 0',
          }}>
            Bienvenue
          </p>
          <p style={{
            fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase',
            color: '#b8922a', margin: '0.5rem 0 0',
          }}>
            {roomName}
          </p>
        </div>
      </div>
    </>
  )
}
