'use client'
import { useState, useRef, useEffect } from 'react'

type Option = { value: string; label: string }

type Props = {
  options: Option[]
  value: string
  onChange: (value: string) => void
  name?: string
}

export default function CustomSelect({ options, value, onChange, name }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value) || options[0]
  const GOLD = '#c4a050'

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {name && <input type="hidden" name={name} value={value} />}

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(255,255,255,.06)',
          border: `1px solid ${open ? 'rgba(196,160,80,.5)' : 'rgba(255,255,255,.1)'}`,
          borderBottom: `1px solid ${open ? GOLD : 'rgba(196,160,80,.25)'}`,
          color: 'white', padding: '8px 12px',
          fontFamily: 'var(--font-raleway)', fontSize: '.9rem',
          cursor: 'pointer', transition: 'border-color .15s',
        }}
      >
        <span>{selected?.label}</span>
        <span style={{ color: GOLD, fontSize: '.65rem', marginLeft: 8 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: '#141c14',
          border: '1px solid rgba(196,160,80,.25)', borderTop: 'none',
          boxShadow: '0 12px 40px rgba(0,0,0,.6)',
          maxHeight: 240, overflowY: 'auto',
        }}>
          {options.map(opt => {
            const isSelected = opt.value === value
            return (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                style={{
                  padding: '10px 14px', cursor: 'pointer',
                  fontFamily: 'var(--font-raleway)', fontSize: '.88rem',
                  color: isSelected ? GOLD : 'rgba(255,255,255,.75)',
                  fontWeight: isSelected ? 600 : 400,
                  background: isSelected ? 'rgba(196,160,80,.08)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,.04)',
                  transition: 'background .12s',
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'rgba(196,160,80,.06)' }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                {opt.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
