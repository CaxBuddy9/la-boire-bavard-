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

  function isInRange(d: Date) {
    if (!checkinDate) return false
    const end = open === 'out' && hoverDate ? hoverDate : checkoutDate
    if (!end) return false
    return d > checkinDate && d < end
  }
  function isStart(d: Date) { return !!checkinDate && sameDay(d, checkinDate) }
  function isEnd(d: Date)   { return !!checkoutDate && sameDay(d, checkoutDate) }
  function isPast(d: Date)  { return d < today }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay    = getFirstDayOfWeek(year, month)
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

  const gold = '#c4a050'

  return (
    <div style={{ position: 'relative' }}>

      {/* Champs affichage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
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
              background: open === key ? 'rgba(196,160,80,.12)' : 'rgba(255,255,255,.04)',
              border: `1px solid ${open === key ? 'rgba(196,160,80,.6)' : 'rgba(255,255,255,.1)'}`,
              padding: '11px 14px',
              cursor: 'pointer',
              transition: 'all .15s',
              borderRadius: 3,
            }}
          >
            <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.42rem', letterSpacing: '.32em', textTransform: 'uppercase', color: open === key ? gold : 'rgba(196,160,80,.45)', marginBottom: 5 }}>
              {label}
            </p>
            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '.92rem', color: value ? 'rgba(255,255,255,.92)' : 'rgba(255,255,255,.22)' }}>
              {value ? formatDisplay(value) : '— — —'}
            </p>
          </button>
        ))}
      </div>

      {/* Calendrier dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', left: 0, right: 0, zIndex: 100,
          background: 'linear-gradient(160deg, #232b22 0%, #1c2419 100%)',
          border: '1px solid rgba(196,160,80,.22)',
          boxShadow: '0 20px 60px rgba(0,0,0,.7), 0 0 0 1px rgba(196,160,80,.06)',
          padding: '22px 20px 18px',
          borderRadius: 4,
        }}>

          {/* Titre */}
          <p style={{
            fontFamily: 'var(--font-raleway)', fontSize: '.42rem', letterSpacing: '.35em',
            textTransform: 'uppercase', color: 'rgba(196,160,80,.65)',
            textAlign: 'center', marginBottom: 18,
          }}>
            {open === 'in' ? 'Date d\'arrivée' : 'Date de départ'}
          </p>

          {/* Navigation mois */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <button type="button" onClick={prevMonth} style={{
              background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)',
              color: 'rgba(196,160,80,.7)', cursor: 'pointer',
              fontSize: '1rem', width: 32, height: 32, borderRadius: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>‹</button>
            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.05rem', color: 'rgba(255,255,255,.88)', letterSpacing: '.03em' }}>
              {MONTHS_FR[month]} <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '.9rem' }}>{year}</span>
            </p>
            <button type="button" onClick={nextMonth} style={{
              background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)',
              color: 'rgba(196,160,80,.7)', cursor: 'pointer',
              fontSize: '1rem', width: 32, height: 32, borderRadius: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>›</button>
          </div>

          {/* Jours de semaine */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
            {DAYS_FR.map(d => (
              <p key={d} style={{
                textAlign: 'center', fontFamily: 'var(--font-raleway)',
                fontSize: '.42rem', letterSpacing: '.12em', textTransform: 'uppercase',
                color: 'rgba(196,160,80,.35)', padding: '3px 0',
              }}>
                {d}
              </p>
            ))}
          </div>

          {/* Grille jours */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
            {cells.map((d, i) => {
              if (!d) return <div key={i} />
              const past    = isPast(d)
              const start   = isStart(d)
              const end     = isEnd(d)
              const range   = isInRange(d)
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
                    padding: '8px 0',
                    border: isToday && !start && !end ? '1px solid rgba(196,160,80,.35)' : '1px solid transparent',
                    borderRadius: start || end ? 3 : range ? 0 : 3,
                    cursor: past ? 'default' : 'pointer',
                    background: start || end
                      ? gold
                      : range
                        ? 'rgba(196,160,80,.14)'
                        : 'transparent',
                    color: start || end
                      ? '#111'
                      : past
                        ? 'rgba(255,255,255,.15)'
                        : isToday
                          ? gold
                          : 'rgba(255,255,255,.75)',
                    fontFamily: 'var(--font-raleway)',
                    fontSize: '.8rem',
                    fontWeight: start || end ? 700 : isToday ? 600 : 400,
                    transition: 'background .12s, color .12s',
                  }}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </div>

          {/* Résumé dates sélectionnées */}
          {(checkin || checkout) && (
            <div style={{
              marginTop: 16, paddingTop: 14,
              borderTop: '1px solid rgba(255,255,255,.07)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.6rem', color: 'rgba(255,255,255,.35)' }}>
                {checkin ? `↗ ${formatDisplay(checkin)}` : ''}
              </p>
              <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.6rem', color: checkout ? gold : 'rgba(255,255,255,.2)' }}>
                {checkout ? `↙ ${formatDisplay(checkout)}` : open === 'out' ? 'Choisir le départ…' : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
