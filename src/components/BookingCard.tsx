'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DateRangePicker from '@/components/DateRangePicker'

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
  const [checkin, setCheckin]   = useState('')
  const [checkout, setCheckout] = useState('')
  const [persons, setPersons]   = useState(2)
  const router = useRouter()

  const nights = (() => {
    if (!checkin || !checkout) return 0
    const d = (new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000
    return d > 0 ? d : 0
  })()
  const total = nights * 88
  const today = new Date().toISOString().split('T')[0]

  return (
    <div style={{
      background: '#0c0f0d',
      border: '1px solid rgba(196,160,80,.18)',
      padding: '28px 28px 24px',
      position: 'sticky',
      top: 90,
    }}>

      {/* Header */}
      <p style={{
        fontFamily: 'var(--font-raleway)',
        fontSize: '.5rem',
        letterSpacing: '.32em',
        textTransform: 'uppercase',
        color: 'rgba(196,160,80,.55)',
        marginBottom: 12,
      }}>
        Réservation
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 24 }}>
        <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', color: '#c4a050' }}>88 €</span>
        <span style={{ fontFamily: 'var(--font-raleway)', fontSize: '.72rem', color: 'rgba(255,255,255,.3)' }}>
          / nuit · petit-déjeuner inclus
        </span>
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: 'rgba(196,160,80,.12)', marginBottom: 22 }}/>

      {/* Dates — calendrier custom */}
      <div style={{ marginBottom: 10 }}>
        <DateRangePicker
          checkin={checkin}
          checkout={checkout}
          onCheckin={setCheckin}
          onCheckout={setCheckout}
        />
      </div>

      {/* Personnes */}
      <div style={{ marginBottom: 22 }}>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-raleway)',
          fontSize: '.48rem',
          letterSpacing: '.28em',
          textTransform: 'uppercase',
          color: 'rgba(196,160,80,.5)',
          marginBottom: 6,
        }}>
          Voyageurs
        </label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(196,160,80,.3)',
        }}>
          <button
            onClick={() => setPersons(Math.max(1, persons - 1))}
            style={{
              background: 'none', border: 'none',
              color: persons > 1 ? '#c4a050' : 'rgba(255,255,255,.15)',
              width: 36, height: 40, fontSize: '1.1rem',
              cursor: persons > 1 ? 'pointer' : 'default',
              padding: 0,
            }}
          >−</button>
          <span style={{
            flex: 1, textAlign: 'center',
            fontFamily: 'var(--font-raleway)',
            fontSize: '.85rem',
            color: 'rgba(255,255,255,.8)',
          }}>
            {persons} pers.
          </span>
          <button
            onClick={() => setPersons(Math.min(capacityMax, persons + 1))}
            style={{
              background: 'none', border: 'none',
              color: persons < capacityMax ? '#c4a050' : 'rgba(255,255,255,.15)',
              width: 36, height: 40, fontSize: '1.1rem',
              cursor: persons < capacityMax ? 'pointer' : 'default',
              padding: 0,
            }}
          >+</button>
        </div>
        <p style={{
          fontFamily: 'var(--font-raleway)',
          fontSize: '.58rem',
          color: 'rgba(255,255,255,.2)',
          marginTop: 4,
        }}>
          Capacité max · {capacityMax} personne{capacityMax > 1 ? 's' : ''}
        </p>
      </div>

      {/* Récapitulatif */}
      {nights > 0 && (
        <div style={{
          background: 'rgba(196,160,80,.05)',
          borderTop: '1px solid rgba(196,160,80,.15)',
          borderBottom: '1px solid rgba(196,160,80,.15)',
          padding: '14px 0',
          marginBottom: 18,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
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
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.25rem', color: '#c4a050' }}>
              {total} €
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.56rem', color: 'rgba(255,255,255,.2)', marginTop: 6 }}>
            Petit-déjeuner inclus · toutes taxes comprises
          </p>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => {
          if (nights > 0) {
            const p = new URLSearchParams({
              chambre: roomName,
              arrive:  fmtDate(checkin),
              depart:  fmtDate(checkout),
              nuits:   String(nights),
              pers:    String(persons),
            })
            router.push(`/paiement?${p.toString()}`)
          } else {
            router.push(`/contact?chambre=${encodeURIComponent(roomName)}`)
          }
        }}
        style={{
          display: 'block',
          width: '100%',
          textAlign: 'center',
          background: '#c4a050',
          color: '#0d110e',
          border: 'none',
          fontFamily: 'var(--font-raleway)',
          fontSize: '.6rem',
          letterSpacing: '.28em',
          textTransform: 'uppercase',
          fontWeight: 600,
          padding: '14px 24px',
          marginBottom: 8,
          cursor: 'pointer',
        }}
      >
        {nights > 0 ? `Réserver · ${total} €` : 'Demander une réservation'}
      </button>

      <p style={{
        textAlign: 'center',
        fontFamily: 'var(--font-raleway)',
        fontSize: '.55rem',
        color: 'rgba(255,255,255,.18)',
        marginBottom: 20,
      }}>
        {nights > 0 ? 'Paiement sécurisé · Annulation gratuite 48h avant' : 'Réponse sous 24h · Sans engagement'}
      </p>

      {/* Separator */}
      <div style={{ height: 1, background: 'rgba(255,255,255,.05)', marginBottom: 18 }}/>

      {/* Contacts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
