'use client'
import { useState } from 'react'

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS_FR   = ['Lu','Ma','Me','Je','Ve','Sa','Di']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfWeek(year: number, month: number) {
  // 0=Mon … 6=Sun
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
  const [open, setOpen]       = useState<'in'|'out'|null>(null)
  const [year, setYear]       = useState(today.getFullYear())
  const [month, setMonth]     = useState(today.getMonth())
  const [hoverDate, setHover] = useState<Date|null>(null)

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

  const gold   = '#c4a050'
  const goldDim = 'rgba(196,160,80,.18)'

  function isInRange(d: Date) {
    if (!checkinDate) return false
    const end = open === 'out' && hoverDate ? hoverDate : checkoutDate
    if (!end) return false
    return d > checkinDate && d < end
  }
  function isStart(d: Date) { return !!checkinDate && sameDay(d, checkinDate) }
  function isEnd(d: Date)   { return !!checkoutDate && sameDay(d, checkoutDate) }
  function isPast(d: Date)  { return d < today }

  // Build calendar grid
  const daysInMonth  = getDaysInMonth(year, month)
  const firstDay     = getFirstDayOfWeek(year, month)
  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function formatDisplay(iso: string) {
    if (!iso) return null
    const d = parseISO(iso)
    return `${d.getDate()} ${MONTHS_FR[d.getMonth()].slice(0,3)}. ${d.getFullYear()}`
  }

  return (
    <div style={{ position: 'relative' }}>

      {/* Champs affichage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {([
          { key: 'in',  label: 'Arrivée',  value: checkin },
          { key: 'out', label: 'Départ',   value: checkout },
        ] as const).map(({ key, label, value }) => (
          <button
            key={key}
            type="button"
            onClick={() => setOpen(open === key ? null : key)}
            style={{
              textAlign: 'left',
              background: open === key ? 'rgba(196,160,80,.1)' : 'rgba(196,160,80,.04)',
              border: `1px solid ${open === key ? 'rgba(196,160,80,.5)' : 'rgba(196,160,80,.2)'}`,
              borderBottom: `2px solid ${open === key ? gold : 'rgba(196,160,80,.35)'}`,
              padding: '10px 14px',
              cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.44rem', letterSpacing: '.32em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 5 }}>
              {label}
            </p>
            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '.95rem', color: value ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.2)' }}>
              {value ? formatDisplay(value) : '— — —'}
            </p>
          </button>
        ))}
      </div>

      {/* Calendrier dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 100,
          background: '#0c0f0d',
          border: `1px solid rgba(196,160,80,.25)`,
          boxShadow: '0 24px 64px rgba(0,0,0,.9)',
          padding: '20px 18px 18px',
        }}>

          {/* Titre sélection */}
          <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.44rem', letterSpacing: '.32em', textTransform: 'uppercase', color: gold, textAlign: 'center', marginBottom: 16 }}>
            {open === 'in' ? 'Choisir la date d\'arrivée' : 'Choisir la date de départ'}
          </p>

          {/* Navigation mois */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <button type="button" onClick={prevMonth} style={{ background: 'none', border: 'none', color: 'rgba(196,160,80,.5)', cursor: 'pointer', fontSize: '1rem', padding: '4px 8px' }}>‹</button>
            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '1rem', color: 'rgba(255,255,255,.85)' }}>
              {MONTHS_FR[month]} {year}
            </p>
            <button type="button" onClick={nextMonth} style={{ background: 'none', border: 'none', color: 'rgba(196,160,80,.5)', cursor: 'pointer', fontSize: '1rem', padding: '4px 8px' }}>›</button>
          </div>

          {/* Jours de semaine */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
            {DAYS_FR.map(d => (
              <p key={d} style={{ textAlign: 'center', fontFamily: 'var(--font-raleway)', fontSize: '.45rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(196,160,80,.4)', padding: '4px 0' }}>
                {d}
              </p>
            ))}
          </div>

          {/* Grille jours */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {cells.map((d, i) => {
              if (!d) return <div key={i} />
              const past  = isPast(d)
              const start = isStart(d)
              const end   = isEnd(d)
              const range = isInRange(d)
              const isToday = sameDay(d, today)

              return (
                <button
                  key={i}
                  type="button"
                  disabled={past}
                  onClick={() => !past && selectDay(d)}
                  onMouseEnter={() => setHover(d)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    padding: '7px 0',
                    border: 'none',
                    borderRadius: 0,
                    cursor: past ? 'default' : 'pointer',
                    background: start || end
                      ? gold
                      : range
                        ? goldDim
                        : 'transparent',
                    color: start || end
                      ? '#111'
                      : past
                        ? 'rgba(255,255,255,.12)'
                        : isToday
                          ? gold
                          : 'rgba(255,255,255,.7)',
                    fontFamily: 'var(--font-raleway)',
                    fontSize: '.78rem',
                    fontWeight: start || end ? 600 : 400,
                    transition: 'background .1s, color .1s',
                    outline: isToday && !start && !end ? `1px solid rgba(196,160,80,.3)` : 'none',
                  }}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </div>

          {/* Légende */}
          {checkinDate && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.6rem', color: 'rgba(255,255,255,.3)' }}>
                {checkin && `Arrivée : ${formatDisplay(checkin)}`}
              </p>
              {checkout && (
                <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.6rem', color: gold }}>
                  {checkout && `Départ : ${formatDisplay(checkout)}`}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
