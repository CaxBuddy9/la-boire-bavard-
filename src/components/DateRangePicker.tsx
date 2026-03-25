'use client'
import { useState } from 'react'

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS_FR   = ['Lu','Ma','Me','Je','Ve','Sa','Di']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfWeek(year: number, month: number) {
  return (new Date(year, month, 1).getDay() + 6) % 7
}
function toISO(d: Date) {
  return d.toISOString().split('T')[0]
}
function parseISO(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

type Props = {
  checkin: string
  checkout: string
  onCheckin: (v: string) => void
  onCheckout: (v: string) => void
}

export default function DateRangePicker({ checkin, checkout, onCheckin, onCheckout }: Props) {
  const today = new Date(); today.setHours(0,0,0,0)
  const [open,      setOpen]  = useState<'in'|'out'|null>(null)
  const [year,      setYear]  = useState(today.getFullYear())
  const [month,     setMonth] = useState(today.getMonth())
  const [hoverDay,  setHover] = useState<Date|null>(null)

  const checkinDate  = checkin  ? parseISO(checkin)  : null
  const checkoutDate = checkout ? parseISO(checkout) : null

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  function selectDay(d: Date) {
    if (open === 'in') {
      onCheckin(toISO(d))
      if (checkoutDate && d >= checkoutDate) onCheckout('')
      setOpen('out')
    } else if (open === 'out') {
      if (checkinDate && d <= checkinDate) {
        onCheckin(toISO(d))
        onCheckout('')
      } else {
        onCheckout(toISO(d))
        setOpen(null)
      }
    }
  }

  function isInRange(d: Date) {
    if (!checkinDate) return false
    const end = open === 'out' && hoverDay ? hoverDay : checkoutDate
    if (!end) return false
    return d > checkinDate && d < end
  }
  function isStart(d: Date) { return !!checkinDate  && sameDay(d, checkinDate) }
  function isEnd(d: Date)   { return !!checkoutDate && sameDay(d, checkoutDate) }
  function isPast(d: Date)  { return d < today }
  function isHovered(d: Date) { return !!hoverDay && sameDay(d, hoverDay) }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay    = getFirstDayOfWeek(year, month)
  const cells: (Date|null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function formatDisplay(iso: string) {
    const d = parseISO(iso)
    return `${d.getDate()} ${MONTHS_FR[d.getMonth()].slice(0,3)}. ${d.getFullYear()}`
  }

  const GOLD = '#c4a050'

  return (
    <div style={{ position: 'relative' }}>

      {/* ── Champs Arrivée / Départ ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {([
          { key: 'in'  as const, label: 'Arrivée',  value: checkin },
          { key: 'out' as const, label: 'Départ',   value: checkout },
        ]).map(({ key, label, value }) => {
          const active = open === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setOpen(open === key ? null : key)}
              style={{
                textAlign: 'left',
                background: active ? 'rgba(196,160,80,.13)' : 'rgba(255,255,255,.05)',
                border: `1px solid ${active ? 'rgba(196,160,80,.55)' : 'rgba(255,255,255,.12)'}`,
                padding: '7px 10px',
                cursor: 'pointer',
                transition: 'border-color .15s, background .15s',
                borderRadius: 2,
              }}
            >
              <p style={{
                fontFamily: 'var(--font-raleway)', fontSize: '.38rem',
                letterSpacing: '.28em', textTransform: 'uppercase',
                color: active ? GOLD : 'rgba(196,160,80,.4)',
                marginBottom: 3,
              }}>
                {label}
              </p>
              <p style={{
                fontFamily: 'var(--font-playfair)', fontSize: '.78rem',
                color: value ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.2)',
              }}>
                {value ? formatDisplay(value) : '— — —'}
              </p>
            </button>
          )
        })}
      </div>

      {/* ── Calendrier ── */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 200,
          background: '#2c3829',
          border: '1px solid rgba(196,160,80,.3)',
          boxShadow: '0 16px 48px rgba(0,0,0,.6)',
          padding: '20px 18px 16px',
          borderRadius: 4,
        }}>

          {/* Indication sélection */}
          <p style={{
            fontFamily: 'var(--font-raleway)', fontSize: '.42rem',
            letterSpacing: '.3em', textTransform: 'uppercase',
            color: GOLD, textAlign: 'center', marginBottom: 16,
          }}>
            {open === 'in' ? "Choisir l'arrivée" : 'Choisir le départ'}
          </p>

          {/* ← Mois Année → */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <button type="button" onClick={prevMonth} style={{
              background: 'rgba(255,255,255,.08)', border: 'none',
              color: 'rgba(255,255,255,.6)', cursor: 'pointer',
              width: 30, height: 30, fontSize: '1.1rem', borderRadius: 2,
            }}>‹</button>
            <p style={{
              fontFamily: 'var(--font-playfair)', fontSize: '1rem',
              color: 'rgba(255,255,255,.9)',
            }}>
              {MONTHS_FR[month]}{' '}
              <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem' }}>{year}</span>
            </p>
            <button type="button" onClick={nextMonth} style={{
              background: 'rgba(255,255,255,.08)', border: 'none',
              color: 'rgba(255,255,255,.6)', cursor: 'pointer',
              width: 30, height: 30, fontSize: '1.1rem', borderRadius: 2,
            }}>›</button>
          </div>

          {/* En-têtes jours */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
            {DAYS_FR.map(d => (
              <p key={d} style={{
                textAlign: 'center',
                fontFamily: 'var(--font-raleway)',
                fontSize: '.42rem', letterSpacing: '.12em', textTransform: 'uppercase',
                color: 'rgba(196,160,80,.5)', paddingBottom: 4,
              }}>
                {d}
              </p>
            ))}
          </div>

          {/* Grille jours */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {cells.map((d, i) => {
              if (!d) return <div key={i} />

              const past    = isPast(d)
              const start   = isStart(d)
              const end     = isEnd(d)
              const range   = isInRange(d)
              const hover   = !past && isHovered(d)
              const isToday = sameDay(d, today)

              let bg = 'transparent'
              if (start || end) bg = GOLD
              else if (hover && !range) bg = 'rgba(196,160,80,.25)'
              else if (range) bg = hover ? 'rgba(196,160,80,.3)' : 'rgba(196,160,80,.15)'

              let color = 'rgba(255,255,255,.78)'
              if (start || end) color = '#111'
              else if (past) color = 'rgba(255,255,255,.18)'
              else if (isToday) color = GOLD
              else if (hover) color = 'white'

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => { if (!past) selectDay(d) }}
                  onMouseEnter={() => { if (!past) setHover(d) }}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    padding: '8px 0',
                    border: isToday && !start && !end
                      ? '1px solid rgba(196,160,80,.4)'
                      : '1px solid transparent',
                    borderRadius: 2,
                    cursor: past ? 'default' : 'pointer',
                    background: bg,
                    color,
                    fontFamily: 'var(--font-raleway)',
                    fontSize: '.8rem',
                    fontWeight: start || end ? 700 : 400,
                    transition: 'background .1s, color .1s',
                    textAlign: 'center',
                  }}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </div>

          {/* Résumé en bas */}
          <div style={{
            marginTop: 14, paddingTop: 12,
            borderTop: '1px solid rgba(255,255,255,.08)',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span style={{ fontFamily: 'var(--font-raleway)', fontSize: '.6rem', color: checkin ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.2)' }}>
              {checkin ? `↗ ${formatDisplay(checkin)}` : 'Arrivée non définie'}
            </span>
            <span style={{ fontFamily: 'var(--font-raleway)', fontSize: '.6rem', color: checkout ? GOLD : 'rgba(255,255,255,.2)' }}>
              {checkout ? `↙ ${formatDisplay(checkout)}` : open === 'out' ? 'Cliquez sur le départ…' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
