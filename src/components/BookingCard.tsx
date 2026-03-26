'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DateRangePicker, { DateRangePickerHandle } from '@/components/DateRangePicker'

type BookedRange = { check_in: string; check_out: string }

type Props = {
  roomName: string
  capacityMax: number
}

function fmtDate(iso: string) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export default function BookingCard({ roomName, capacityMax }: Props) {
  const [checkin,      setCheckin]      = useState('')
  const [checkout,     setCheckout]     = useState('')
  const [persons,      setPersons]      = useState(2)
  const [shake,        setShake]        = useState(false)
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([])
  const pickerRef = useRef<DateRangePickerHandle>(null)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/availability?chambre=${encodeURIComponent(roomName)}`)
      .then(r => r.json())
      .then(d => { if (d.booked) setBookedRanges(d.booked) })
      .catch(() => {})
  }, [roomName])

  const nights = (() => {
    if (!checkin || !checkout) return 0
    const d = (new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000
    return d > 0 ? d : 0
  })()
  const total = nights * 88

  const handleReserve = () => {
    if (nights <= 0) {
      pickerRef.current?.openCheckin()
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    const p = new URLSearchParams({
      chambre: roomName,
      arrive:  fmtDate(checkin),
      depart:  fmtDate(checkout),
      nuits:   String(nights),
      pers:    String(persons),
    })
    router.push(`/paiement?${p.toString()}`)
  }

  const datesOk = nights > 0

  return (
    <div style={{
      background: '#1e2b1c',
      border: '1px solid rgba(196,160,80,.25)',
      padding: '28px 28px 24px',
    }}>

      {/* Header */}
      <p style={{
        fontFamily: 'var(--font-raleway)',
        fontSize: '.5rem',
        letterSpacing: '.32em',
        textTransform: 'uppercase',
        color: 'rgba(196,160,80,.55)',
        marginBottom: 8,
      }}>
        Réservation
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 22 }}>
        <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', color: '#c4a050' }}>88 €</span>
        <span style={{ fontFamily: 'var(--font-raleway)', fontSize: '.72rem', color: 'rgba(255,255,255,.3)' }}>
          / nuit · petit-déjeuner inclus
        </span>
      </div>

      <div style={{ height: 1, background: 'rgba(196,160,80,.12)', marginBottom: 20 }}/>

      {/* Dates */}
      <div style={{ marginBottom: 4 }}>
        <p style={{
          fontFamily: 'var(--font-raleway)',
          fontSize: '.44rem',
          letterSpacing: '.28em',
          textTransform: 'uppercase',
          color: 'rgba(196,160,80,.5)',
          marginBottom: 8,
        }}>
          1 · Choisir les dates
        </p>
        <div style={{ animation: shake ? 'shake .4s ease' : 'none' }}>
          <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}`}</style>
          <DateRangePicker
            ref={pickerRef}
            checkin={checkin}
            checkout={checkout}
            onCheckin={setCheckin}
            onCheckout={setCheckout}
            bookedRanges={bookedRanges}
          />
        </div>
        {!checkin && (
          <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.58rem', color: 'rgba(196,160,80,.45)', marginTop: 8 }}>
            ↑ Cliquez sur Arrivée pour ouvrir le calendrier
          </p>
        )}
      </div>

      {/* Voyageurs */}
      {datesOk && (
        <>
          <div style={{ height: 1, background: 'rgba(196,160,80,.08)', margin: '18px 0' }}/>
          <div style={{ marginBottom: 18 }}>
            <p style={{
              fontFamily: 'var(--font-raleway)',
              fontSize: '.44rem',
              letterSpacing: '.28em',
              textTransform: 'uppercase',
              color: 'rgba(196,160,80,.5)',
              marginBottom: 10,
            }}>
              2 · Voyageurs
            </p>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: 'rgba(196,160,80,.05)',
              border: '1px solid rgba(196,160,80,.2)',
              borderRadius: 2,
            }}>
              <button
                onClick={() => setPersons(Math.max(1, persons - 1))}
                style={{
                  background: 'none', border: 'none',
                  color: persons > 1 ? '#c4a050' : 'rgba(255,255,255,.15)',
                  width: 40, height: 42, fontSize: '1.2rem',
                  cursor: persons > 1 ? 'pointer' : 'default',
                }}
              >−</button>
              <span style={{
                flex: 1, textAlign: 'center',
                fontFamily: 'var(--font-raleway)',
                fontSize: '.9rem',
                color: 'rgba(255,255,255,.85)',
              }}>
                {persons} pers.
              </span>
              <button
                onClick={() => setPersons(Math.min(capacityMax, persons + 1))}
                style={{
                  background: 'none', border: 'none',
                  color: persons < capacityMax ? '#c4a050' : 'rgba(255,255,255,.15)',
                  width: 40, height: 42, fontSize: '1.2rem',
                  cursor: persons < capacityMax ? 'pointer' : 'default',
                }}
              >+</button>
            </div>
            <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.56rem', color: 'rgba(255,255,255,.2)', marginTop: 4 }}>
              Max {capacityMax} personne{capacityMax > 1 ? 's' : ''}
            </p>
          </div>

          {/* Récap prix */}
          <div style={{
            background: 'rgba(196,160,80,.05)',
            border: '1px solid rgba(196,160,80,.15)',
            padding: '14px 16px',
            marginBottom: 18,
            borderRadius: 2,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-raleway)', fontSize: '.72rem', color: 'rgba(255,255,255,.35)' }}>
                88 € × {nights} nuit{nights > 1 ? 's' : ''}
              </span>
              <span style={{ fontFamily: 'var(--font-raleway)', fontSize: '.72rem', color: 'rgba(255,255,255,.5)' }}>
                {total} €
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-raleway)', fontSize: '.6rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)' }}>
                Total
              </span>
              <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.3rem', color: '#c4a050' }}>
                {total} €
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.55rem', color: 'rgba(255,255,255,.2)', marginTop: 5 }}>
              Petit-déjeuner inclus · toutes taxes comprises
            </p>
          </div>
        </>
      )}

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        <Link
          href={`/contact?chambre=${encodeURIComponent(roomName)}${checkin ? `&arrive=${checkin}` : ''}${checkout ? `&depart=${checkout}` : ''}${persons ? `&pers=${persons}` : ''}`}
          style={{
            flex: '0 0 auto',
            textAlign: 'center',
            background: 'transparent',
            color: '#c4a050',
            border: '1px solid rgba(196,160,80,.4)',
            fontFamily: 'var(--font-raleway)',
            fontSize: '.58rem',
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            fontWeight: 600,
            padding: '14px 16px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          Contacter
        </Link>
        <button
          onClick={handleReserve}
          style={{
            flex: 1,
            textAlign: 'center',
            background: datesOk ? '#c4a050' : 'rgba(196,160,80,.2)',
            color: datesOk ? '#0d110e' : 'rgba(196,160,80,.5)',
            border: datesOk ? 'none' : '1px solid rgba(196,160,80,.25)',
            fontFamily: 'var(--font-raleway)',
            fontSize: '.6rem',
            letterSpacing: '.28em',
            textTransform: 'uppercase',
            fontWeight: 600,
            padding: '14px 16px',
            cursor: 'pointer',
            transition: 'all .2s',
          }}
        >
          {datesOk ? `Réserver · ${total} €` : 'Sélectionner des dates'}
        </button>
      </div>

      {datesOk && (
        <p style={{
          textAlign: 'center',
          fontFamily: 'var(--font-raleway)',
          fontSize: '.55rem',
          color: 'rgba(255,255,255,.18)',
          marginBottom: 18,
        }}>
          Paiement sécurisé · Annulation gratuite 48h avant
        </p>
      )}

      <div style={{ height: 1, background: 'rgba(255,255,255,.05)', margin: '16px 0' }}/>

      {/* Contact secondaire */}
      <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.55rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.2)', marginBottom: 10 }}>
        Une question ?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { href: 'tel:0675786335',                icon: '✆', label: '06 75 78 63 35' },
          { href: 'mailto:laboirebavard@gmail.com', icon: '✉', label: 'laboirebavard@gmail.com' },
          { href: 'https://wa.me/33675786335',      icon: '◇', label: 'WhatsApp', external: true },
        ].map(({ href, icon, label, external }) => (
          <a
            key={href}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: 'var(--font-raleway)', fontSize: '.7rem',
              color: 'rgba(255,255,255,.35)', textDecoration: 'none',
            }}
            onMouseOver={e => (e.currentTarget.style.color = '#c4a050')}
            onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,.35)')}
          >
            <span style={{ color: 'rgba(196,160,80,.5)', width: 16, flexShrink: 0 }}>{icon}</span>
            {label}
          </a>
        ))}
      </div>

    </div>
  )
}
