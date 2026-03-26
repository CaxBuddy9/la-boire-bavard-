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

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.05)',
  border: '1px solid rgba(255,255,255,.1)',
  color: '#f5f0e8',
  padding: '11px 14px',
  fontSize: '0.85rem',
  fontFamily: 'var(--font-raleway)',
  fontWeight: 300,
  outline: 'none',
  width: '100%',
}

export default function BookingCard({ roomName, capacityMax }: Props) {
  const [checkin,      setCheckin]      = useState('')
  const [checkout,     setCheckout]     = useState('')
  const [persons,      setPersons]      = useState(2)
  const [nom,          setNom]          = useState('')
  const [email,        setEmail]        = useState('')
  const [tel,          setTel]          = useState('')
  const [shake,        setShake]        = useState(false)
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([])
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
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

  const datesOk   = nights > 0
  const contactOk = nom.trim().length > 0 && email.trim().includes('@')

  const handleReserve = async () => {
    if (!datesOk) {
      pickerRef.current?.openCheckin()
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    if (!contactOk) return

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chambre: roomName,
          arrive:  fmtDate(checkin),
          depart:  fmtDate(checkout),
          nuits:   nights,
          pers:    persons,
          nom,
          email,
          tel,
        }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); setLoading(false); return }

      // Stocker le clientSecret en session pour que /paiement saute l'étape 1
      sessionStorage.setItem('lbb_clientSecret', data.clientSecret)
      sessionStorage.setItem('lbb_total', String(total))

      const p = new URLSearchParams({
        chambre: roomName,
        arrive:  fmtDate(checkin),
        depart:  fmtDate(checkout),
        nuits:   String(nights),
        pers:    String(persons),
        nom,
        email,
        tel,
      })
      router.push(`/paiement?${p.toString()}`)
    } catch {
      setError('Impossible de contacter le serveur.')
      setLoading(false)
    }
  }

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

      {/* 1 · Dates */}
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

      {datesOk && (
        <>
          <div style={{ height: 1, background: 'rgba(196,160,80,.08)', margin: '18px 0' }}/>

          {/* 2 · Voyageurs */}
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

          {/* 3 · Vos coordonnées */}
          <div style={{ marginBottom: 18 }}>
            <p style={{
              fontFamily: 'var(--font-raleway)',
              fontSize: '.44rem',
              letterSpacing: '.28em',
              textTransform: 'uppercase',
              color: 'rgba(196,160,80,.5)',
              marginBottom: 10,
            }}>
              3 · Vos coordonnées
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                value={nom}
                onChange={e => setNom(e.target.value)}
                placeholder="Nom complet *"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(196,160,80,.5)')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,.1)')}
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email *"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(196,160,80,.5)')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,.1)')}
              />
              <input
                type="tel"
                value={tel}
                onChange={e => setTel(e.target.value)}
                placeholder="Téléphone"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(196,160,80,.5)')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,.1)')}
              />
            </div>
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

      {/* Erreur API */}
      {error && (
        <div style={{
          background: 'rgba(224,112,112,.1)', border: '1px solid rgba(224,112,112,.3)',
          padding: '10px 14px', marginBottom: 14,
          fontFamily: 'var(--font-raleway)', fontSize: '.72rem', color: '#e07070',
        }}>
          {error}
        </div>
      )}

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 6 }}>
        <button
          onClick={handleReserve}
          disabled={loading || (datesOk && !contactOk)}
          style={{
            width: '100%',
            textAlign: 'center',
            background: (datesOk && !contactOk) ? 'rgba(196,160,80,.35)' : loading ? 'rgba(196,160,80,.6)' : '#c4a050',
            color: '#0d110e',
            border: 'none',
            fontFamily: 'var(--font-raleway)',
            fontSize: '.62rem',
            letterSpacing: '.28em',
            textTransform: 'uppercase',
            fontWeight: 700,
            padding: '16px',
            cursor: (loading || (datesOk && !contactOk)) ? 'default' : 'pointer',
            transition: 'all .2s',
          }}
        >
          {loading
            ? 'Chargement…'
            : datesOk
              ? (contactOk ? `Payer · ${total} €` : 'Remplissez vos coordonnées ↑')
              : 'Réserver cette chambre'}
        </button>
        <Link
          href={`/contact?chambre=${encodeURIComponent(roomName)}${checkin ? `&arrive=${checkin}` : ''}${checkout ? `&depart=${checkout}` : ''}${persons ? `&pers=${persons}` : ''}`}
          style={{
            width: '100%',
            textAlign: 'center',
            background: 'transparent',
            color: 'rgba(196,160,80,.6)',
            border: '1px solid rgba(196,160,80,.25)',
            fontFamily: 'var(--font-raleway)',
            fontSize: '.56rem',
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            fontWeight: 500,
            padding: '11px',
            textDecoration: 'none',
            display: 'block',
          }}
        >
          Contacter Sandrine
        </Link>
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
