'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ROOMS } from '@/lib/rooms'

const ALL = [
  { value: '', label: 'Sans préférence', image: null, features: [] },
  ...ROOMS.map(r => ({ value: r.name, label: r.name, image: r.images[0], features: r.features.slice(0, 4), tagline: r.tagline, capacity: `${r.capacityMin}–${r.capacityMax} pers.` }))
]

export default function RoomPicker({ name = 'chambre' }: { name?: string }) {
  const [open, setOpen]     = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [selected, setSelected] = useState(0)

  const S = { gold: '#c4a050', border: 'rgba(196,160,80,.25)', bg: '#1e2a1c', dim: 'rgba(184,192,180,.5)' }

  return (
    <div style={{ position: 'relative' }}>
      <input type="hidden" name={name} value={ALL[selected].value} />

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
          borderBottom: `1px solid ${S.border}`, color: 'rgba(255,255,255,.7)',
          padding: '12px 16px', fontFamily: 'var(--font-raleway)', fontSize: '.9rem', cursor: 'pointer',
        }}
      >
        <span>{ALL[selected].label}</span>
        <span style={{ color: S.gold, fontSize: '.65rem' }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: '#141c14', border: `1px solid ${S.border}`, borderTop: 'none',
          boxShadow: '0 20px 60px rgba(0,0,0,.6)',
        }}>
          {ALL.map((room, i) => (
            <div
              key={room.value || 'any'}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { setSelected(i); setOpen(false) }}
              style={{
                padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                background: hovered === i ? 'rgba(196,160,80,.08)' : selected === i ? 'rgba(196,160,80,.05)' : 'transparent',
                borderBottom: i < ALL.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none',
                transition: 'background .15s',
              }}
            >
              {/* Miniature photo */}
              {room.image && (
                <div style={{ width: 48, height: 36, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                  <Image src={room.image} alt={room.label} fill className="object-cover" sizes="48px" />
                </div>
              )}
              {!room.image && <div style={{ width: 48, height: 36, background: 'rgba(255,255,255,.04)', flexShrink: 0 }} />}

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.82rem', color: selected === i ? S.gold : 'rgba(255,255,255,.75)', fontWeight: selected === i ? 600 : 400 }}>
                  {room.label}
                </p>
                {'tagline' in room && (
                  <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.6rem', color: 'rgba(184,192,180,.4)', marginTop: 2 }}>
                    {room.tagline} · {room.capacity}
                  </p>
                )}
              </div>

              {/* Hover preview — features */}
              {hovered === i && room.features.length > 0 && (
                <div style={{
                  position: 'absolute', left: '100%', top: 0, marginLeft: 8, zIndex: 60,
                  background: '#0d110e', border: `1px solid ${S.border}`,
                  boxShadow: '0 20px 60px rgba(0,0,0,.8)',
                  width: 260, overflow: 'hidden',
                  pointerEvents: 'none',
                }}>
                  {room.image && (
                    <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
                      <Image src={room.image} alt={room.label} fill className="object-cover" sizes="260px" />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,17,14,.9) 0%, transparent 60%)' }} />
                      <p style={{ position: 'absolute', bottom: 12, left: 14, fontFamily: 'var(--font-playfair)', fontSize: '.95rem', color: 'white' }}>{room.label}</p>
                    </div>
                  )}
                  <div style={{ padding: '14px 16px' }}>
                    {'capacity' in room && (
                      <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: S.gold, marginBottom: 10 }}>
                        {room.capacity}
                      </p>
                    )}
                    {room.features.map(f => (
                      <p key={f} style={{ fontFamily: 'var(--font-raleway)', fontSize: '.72rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.9 }}>
                        <span style={{ color: S.gold, marginRight: 6 }}>→</span>{f}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
