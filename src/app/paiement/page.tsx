'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'

function PaymentForm() {
  const params = useSearchParams()
  const chambre = params.get('chambre') || 'Côté Jardin'
  const arrive  = params.get('arrive')  || ''
  const depart  = params.get('depart')  || ''
  const nuits   = Number(params.get('nuits') || 1)
  const pers    = Number(params.get('pers')  || 2)
  const total   = nuits * 88

  const [state, setState] = useState<'idle'|'loading'|'done'>('idle')
  const [errors, setErrors] = useState<Record<string,string>>({})

  const [form, setForm] = useState({
    nom: '', email: '', tel: '',
    card: '', expiry: '', cvv: '',
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value
    if (k === 'card')   v = v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
    if (k === 'expiry') v = v.replace(/\D/g,'').slice(0,4).replace(/^(\d{2})(\d)/,'$1/$2')
    if (k === 'cvv')    v = v.replace(/\D/g,'').slice(0,3)
    setForm(f => ({ ...f, [k]: v }))
    setErrors(er => ({ ...er, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string,string> = {}
    if (!form.nom.trim())   e.nom   = 'Requis'
    if (!form.email.trim()) e.email = 'Requis'
    if (form.card.replace(/\s/g,'').length < 16) e.card = 'Numéro incomplet'
    if (form.expiry.length < 5) e.expiry = 'Format MM/AA'
    if (form.cvv.length < 3)    e.cvv   = 'CVV requis'
    return e
  }

  const submit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setState('loading')
    // TODO: brancher Stripe PaymentIntent ici
    setTimeout(() => setState('done'), 1800)
  }

  const Field = ({ id, label, placeholder, type='text' }: { id: string, label: string, placeholder: string, type?: string }) => (
    <div className="flex flex-col gap-2">
      <label className="font-sans text-[0.52rem] tracking-[0.28em] uppercase"
        style={{ color: errors[id] ? '#e07070' : 'rgba(196,160,80,.55)' }}>
        {label}{errors[id] ? ` — ${errors[id]}` : ''}
      </label>
      <input
        type={type}
        value={(form as any)[id]}
        onChange={set(id)}
        placeholder={placeholder}
        autoComplete={id === 'card' ? 'cc-number' : id === 'expiry' ? 'cc-exp' : id === 'cvv' ? 'cc-csc' : 'on'}
        style={{
          background: 'rgba(255,255,255,.05)',
          border: `1px solid ${errors[id] ? 'rgba(224,112,112,.5)' : 'rgba(255,255,255,.1)'}`,
          color: '#f5f0e8',
          padding: '13px 16px',
          fontSize: '0.9rem',
          fontFamily: 'inherit',
          outline: 'none',
          width: '100%',
          transition: 'border-color .2s',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(196,160,80,.5)'}
        onBlur={e => e.target.style.borderColor = errors[id] ? 'rgba(224,112,112,.5)' : 'rgba(255,255,255,.1)'}
      />
    </div>
  )

  if (state === 'done') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 52px' }}>
        <div className="text-center max-w-md">
          <div style={{ fontSize: '3rem', marginBottom: 24 }}>✓</div>
          <p className="label-caps mb-3">Réservation confirmée</p>
          <h2 className="font-serif font-normal text-white mb-6" style={{ fontSize: '2rem' }}>
            À bientôt, La Boire Bavard !
          </h2>
          <p className="font-sans text-white/55 text-[0.95rem] leading-[1.8] mb-10">
            Un email de confirmation vous a été envoyé. Sandrine vous contactera dans les 24h pour finaliser votre séjour.
          </p>
          <Link href="/" className="btn-gold">Retour à l'accueil</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-[5fr_7fr] gap-0 items-start">

      {/* Récapitulatif */}
      <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.18)', padding: '40px 36px' }}
        className="md:sticky top-32">
        <p className="label-caps mb-5">Récapitulatif</p>
        <h2 className="font-serif font-normal text-white mb-2" style={{ fontSize: '1.5rem' }}>{chambre}</h2>
        <div style={{ height: 1, background: 'rgba(196,160,80,.2)', margin: '20px 0' }} />
        <div className="font-sans text-[0.85rem] flex flex-col gap-3" style={{ color: 'rgba(255,255,255,.55)' }}>
          {arrive && <div className="flex justify-between"><span>Arrivée</span><span style={{ color: 'rgba(255,255,255,.85)' }}>{arrive}</span></div>}
          {depart && <div className="flex justify-between"><span>Départ</span><span style={{ color: 'rgba(255,255,255,.85)' }}>{depart}</span></div>}
          <div className="flex justify-between"><span>Personnes</span><span style={{ color: 'rgba(255,255,255,.85)' }}>{pers}</span></div>
          <div className="flex justify-between"><span>Durée</span><span style={{ color: 'rgba(255,255,255,.85)' }}>{nuits} nuit{nuits > 1 ? 's' : ''}</span></div>
          <div className="flex justify-between"><span>Tarif / nuit</span><span style={{ color: 'rgba(255,255,255,.85)' }}>88 €</span></div>
          <div className="flex justify-between"><span>Petit-déjeuner</span><span style={{ color: '#c4a050' }}>Inclus</span></div>
        </div>
        <div style={{ height: 1, background: 'rgba(196,160,80,.2)', margin: '20px 0' }} />
        <div className="flex justify-between items-baseline">
          <span className="font-sans text-[0.62rem] tracking-[0.2em] uppercase text-white/40">Total</span>
          <span className="font-serif text-3xl text-gold">{total} €</span>
        </div>
        <p className="font-sans text-[0.72rem] text-white/30 mt-3">
          Annulation gratuite jusqu'à 48h avant l'arrivée.
        </p>
      </div>

      {/* Formulaire */}
      <div style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)', padding: '40px 40px' }}>
        <p className="label-caps mb-6">Vos informations</p>
        <div className="flex flex-col gap-5 mb-10">
          <Field id="nom"   label="Nom complet *" placeholder="Marie Dupont" />
          <Field id="email" label="Email *"        placeholder="marie@email.fr" type="email" />
          <Field id="tel"   label="Téléphone"      placeholder="06 XX XX XX XX" type="tel" />
        </div>

        <p className="label-caps mb-6" style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 28 }}>
          Paiement sécurisé
        </p>
        <div className="flex flex-col gap-5 mb-8">
          <Field id="card"   label="Numéro de carte *" placeholder="1234 5678 9012 3456" />
          <div className="grid grid-cols-2 gap-4">
            <Field id="expiry" label="Expiration *" placeholder="MM/AA" />
            <Field id="cvv"    label="CVV *"         placeholder="123" />
          </div>
        </div>

        <div style={{ background: 'rgba(196,160,80,.06)', border: '1px solid rgba(196,160,80,.15)', padding: '14px 18px', marginBottom: 28 }}
          className="font-sans text-[0.75rem] text-white/45 flex items-center gap-3">
          <span style={{ fontSize: '1rem' }}>🔒</span>
          <span>Paiement 100% sécurisé · Vos données bancaires ne sont jamais stockées sur nos serveurs.</span>
        </div>

        <button
          onClick={submit}
          disabled={state === 'loading'}
          style={{
            width: '100%',
            background: state === 'loading' ? 'rgba(196,160,80,.4)' : '#c4a050',
            color: '#111',
            border: 'none',
            padding: '16px 24px',
            fontFamily: 'var(--font-raleway)',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: state === 'loading' ? 'default' : 'pointer',
            transition: 'background .2s',
          }}
        >
          {state === 'loading' ? 'Traitement en cours…' : `Payer ${total} €`}
        </button>

        <p className="font-sans text-[0.7rem] text-white/25 text-center mt-4">
          En validant, vous acceptez nos{' '}
          <Link href="/mentions-legales" className="text-gold/60 hover:text-gold transition-colors underline underline-offset-2">
            conditions générales
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function PaiementPage() {
  return (
    <>
      <Nav />
      <main style={{ background: '#0e1510', minHeight: '100vh' }}>
        <div style={{ paddingTop: 80 }}>
          <PaymentForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
