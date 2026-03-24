'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// ── Formulaire interne ─────────────────────────────────────────────────────
function CheckoutForm({
  total, chambre, arrive, depart, nuits, pers,
}: {
  total: number
  chambre: string
  arrive: string
  depart: string
  nuits: number
  pers: number
}) {
  const stripe   = useStripe()
  const elements = useElements()
  const router   = useRouter()

  const [nom,    setNom]    = useState('')
  const [email,  setEmail]  = useState('')
  const [tel,    setTel]    = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [ready,  setReady]  = useState(false)

  const inputBase: React.CSSProperties = {
    background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(255,255,255,.1)',
    color: '#f5f0e8',
    padding: '13px 16px',
    fontSize: '0.9rem',
    fontFamily: 'Raleway, sans-serif',
    fontWeight: 300,
    outline: 'none',
    width: '100%',
    transition: 'border-color .2s',
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    if (!nom.trim() || !email.trim()) { setErrMsg('Nom et email obligatoires.'); return }

    setStatus('loading')
    setErrMsg('')

    // Mettre à jour les métadonnées avec nom/email via un appel au checkout
    await fetch('/api/checkout/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, email, tel }),
    }).catch(() => {})

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/paiement/confirmation?nom=${encodeURIComponent(nom)}&chambre=${encodeURIComponent(chambre)}&arrive=${encodeURIComponent(arrive)}&depart=${encodeURIComponent(depart)}`,
        payment_method_data: {
          billing_details: { name: nom, email, phone: tel || undefined },
        },
      },
    })

    if (error) {
      setStatus('error')
      setErrMsg(error.message || 'Paiement refusé.')
    }
  }

  return (
    <form onSubmit={submit} className="max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-[5fr_7fr] gap-0 items-start">

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
          <div className="flex justify-between"><span>88 € × {nuits}</span><span style={{ color: 'rgba(255,255,255,.85)' }}>{total} €</span></div>
          <div className="flex justify-between"><span>Petit-déjeuner</span><span style={{ color: '#c4a050' }}>Inclus</span></div>
        </div>
        <div style={{ height: 1, background: 'rgba(196,160,80,.2)', margin: '20px 0' }} />
        <div className="flex justify-between items-baseline">
          <span className="font-sans text-[0.62rem] tracking-[0.2em] uppercase text-white/40">Total</span>
          <span className="font-serif text-3xl text-gold">{total} €</span>
        </div>
        <p className="font-sans text-[0.72rem] text-white/30 mt-3">Annulation gratuite jusqu'à 48h avant l'arrivée.</p>
      </div>

      {/* Formulaire */}
      <div style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)', padding: '40px' }}>

        {/* Coordonnées */}
        <p className="label-caps mb-6">Vos informations</p>
        <div className="flex flex-col gap-5 mb-10">
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[0.52rem] tracking-[0.28em] uppercase" style={{ color: 'rgba(196,160,80,.55)' }}>Nom complet *</label>
            <input value={nom} onChange={e => setNom(e.target.value)}
              placeholder="Marie Dupont" style={inputBase}
              onFocus={e => (e.target.style.borderColor = 'rgba(196,160,80,.5)')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,.1)')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[0.52rem] tracking-[0.28em] uppercase" style={{ color: 'rgba(196,160,80,.55)' }}>Email *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="marie@email.fr" style={inputBase}
              onFocus={e => (e.target.style.borderColor = 'rgba(196,160,80,.5)')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,.1)')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[0.52rem] tracking-[0.28em] uppercase" style={{ color: 'rgba(196,160,80,.55)' }}>Téléphone</label>
            <input type="tel" value={tel} onChange={e => setTel(e.target.value)}
              placeholder="06 XX XX XX XX" style={inputBase}
              onFocus={e => (e.target.style.borderColor = 'rgba(196,160,80,.5)')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,.1)')}
            />
          </div>
        </div>

        {/* PaymentElement Stripe */}
        <p className="label-caps mb-6" style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 28 }}>
          Paiement sécurisé
        </p>
        <div style={{ marginBottom: 28 }}>
          <PaymentElement
            onReady={() => setReady(true)}
            options={{
              layout: 'tabs',
              fields: { billingDetails: { name: 'never', email: 'never' } },
            }}
          />
          {!ready && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.3)', fontSize: '0.8rem', padding: '20px 0' }}>
              Chargement du formulaire de paiement…
            </div>
          )}
        </div>

        <div style={{ background: 'rgba(196,160,80,.06)', border: '1px solid rgba(196,160,80,.15)', padding: '14px 18px', marginBottom: 28 }}
          className="font-sans text-[0.75rem] text-white/45 flex items-center gap-3">
          <span style={{ fontSize: '1rem' }}>🔒</span>
          <span>Paiement 100 % sécurisé par Stripe · Vos données bancaires ne transitent pas par nos serveurs.</span>
        </div>

        {errMsg && (
          <div style={{ background: 'rgba(224,112,112,.1)', border: '1px solid rgba(224,112,112,.3)', padding: '12px 16px', marginBottom: 20 }}
            className="font-sans text-[0.82rem] text-red-300">
            {errMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || !ready || status === 'loading'}
          style={{
            width: '100%',
            background: (!stripe || !ready || status === 'loading') ? 'rgba(196,160,80,.4)' : '#c4a050',
            color: '#111',
            border: 'none',
            padding: '16px 24px',
            fontFamily: 'Raleway, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            cursor: (!stripe || !ready || status === 'loading') ? 'default' : 'pointer',
            transition: 'background .2s',
          }}
        >
          {status === 'loading' ? 'Traitement…' : `Payer ${total} €`}
        </button>

        <p className="font-sans text-[0.7rem] text-white/25 text-center mt-4">
          En validant, vous acceptez nos{' '}
          <Link href="/mentions-legales" className="text-gold/60 hover:text-gold transition-colors underline underline-offset-2">
            conditions générales
          </Link>
        </p>
      </div>
    </form>
  )
}

// ── Wrapper clientSecret ────────────────────────────────────────────────────
function PaiementInner() {
  const params  = useSearchParams()
  const chambre = params.get('chambre') || 'Côté Jardin'
  const arrive  = params.get('arrive')  || ''
  const depart  = params.get('depart')  || ''
  const nuits   = Number(params.get('nuits') || 1)
  const pers    = Number(params.get('pers')  || 2)
  const total   = nuits * 88

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [fetchError,   setFetchError]   = useState('')

  useEffect(() => {
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuits, chambre, arrive, depart, pers }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) setFetchError(d.error)
        else setClientSecret(d.clientSecret)
      })
      .catch(() => setFetchError('Impossible de contacter le serveur de paiement.'))
  }, [nuits, chambre, arrive, depart, pers])

  if (fetchError) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div className="text-center max-w-md">
          <p className="font-sans text-[0.9rem] text-red-300 mb-6">{fetchError}</p>
          <Link href="/contact" className="btn-gold">Réserver par formulaire</Link>
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="font-sans text-[0.8rem] tracking-[0.2em] uppercase text-white/30">Chargement…</div>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#c4a050',
            colorBackground: '#131a13',
            colorText: '#f5f0e8',
            fontFamily: 'Raleway, sans-serif',
            borderRadius: '2px',
          },
        },
      }}
    >
      <CheckoutForm
        total={total}
        chambre={chambre}
        arrive={arrive}
        depart={depart}
        nuits={nuits}
        pers={pers}
      />
    </Elements>
  )
}

// ── Page principale ─────────────────────────────────────────────────────────
export default function PaiementPage() {
  return (
    <>
      <Nav />
      <main style={{ background: '#0e1510', minHeight: '100vh', paddingTop: 80 }}>
        <Suspense fallback={
          <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="font-sans text-[0.8rem] tracking-[0.2em] uppercase text-white/30">Chargement…</div>
          </div>
        }>
          <PaiementInner />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
