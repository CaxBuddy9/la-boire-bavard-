'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'

// Module-level init — stable across renders, safe in 'use client' files
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const TABLE_HOTES_PRICE = 25

// ── Formulaire de paiement (rendu après obtention du clientSecret) ─────────
function PayForm({ total, chambre, arrive, depart, nom, email }: {
  total: number; chambre: string; arrive: string; depart: string; nom: string; email: string
}) {
  const stripe   = useStripe()
  const elements = useElements()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setStatus('loading')
    setErrMsg('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/paiement/confirmation?nom=${encodeURIComponent(nom)}&chambre=${encodeURIComponent(chambre)}&arrive=${encodeURIComponent(arrive)}&depart=${encodeURIComponent(depart)}`,
        payment_method_data: { billing_details: { name: nom, email } },
      },
    })

    if (error) {
      setStatus('error')
      setErrMsg(error.message || 'Paiement refusé.')
    }
  }

  return (
    <form onSubmit={submit}>
      <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 20 }}>
        Paiement sécurisé
      </p>

      <div style={{ marginBottom: 24 }}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      <div style={{ background: 'rgba(196,160,80,.06)', border: '1px solid rgba(196,160,80,.15)', padding: '12px 16px', marginBottom: 24, fontSize: '0.75rem', color: 'rgba(255,255,255,.4)', display: 'flex', gap: 10, alignItems: 'center', fontFamily: 'var(--font-raleway)' }}>
        <span>🔒</span>
        <span>Vos données bancaires ne transitent pas par nos serveurs.</span>
      </div>

      {errMsg && (
        <div style={{ background: 'rgba(224,112,112,.1)', border: '1px solid rgba(224,112,112,.3)', padding: '12px 16px', marginBottom: 20, fontSize: '0.82rem', color: '#e07070', fontFamily: 'var(--font-raleway)' }}>
          {errMsg}
        </div>
      )}

      <button type="submit" disabled={!stripe || status === 'loading'} style={{
        width: '100%',
        background: (!stripe || status === 'loading') ? 'rgba(196,160,80,.4)' : '#c4a050',
        color: '#111', border: 'none', padding: '16px',
        fontFamily: 'var(--font-raleway)', fontSize: '0.65rem',
        letterSpacing: '0.2em', textTransform: 'uppercase' as const, fontWeight: 700,
        cursor: (!stripe || status === 'loading') ? 'default' : 'pointer',
      }}>
        {status === 'loading' ? 'Traitement…' : `Payer ${total} €`}
      </button>

      <p style={{ textAlign: 'center', fontFamily: 'var(--font-raleway)', fontSize: '0.7rem', color: 'rgba(255,255,255,.2)', marginTop: 12 }}>
        En validant, vous acceptez nos{' '}
        <Link href="/mentions-legales" style={{ color: 'rgba(196,160,80,.5)', textDecoration: 'underline' }}>conditions générales</Link>
      </p>
    </form>
  )
}

// ── Page principale ────────────────────────────────────────────────────────
function PaiementInner() {
  const params  = useSearchParams()
  const chambre = params.get('chambre') || 'Côté Jardin'
  const arrive  = params.get('arrive')  || ''
  const depart  = params.get('depart')  || ''
  const nuits   = Number(params.get('nuits') || 1)
  const pers    = Number(params.get('pers')  || 2)

  const [nom,          setNom]          = useState(params.get('nom')   || '')
  const [email,        setEmail]        = useState(params.get('email') || '')
  const [tel,          setTel]          = useState(params.get('tel')   || '')
  const [tableHotes,   setTableHotes]   = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [fetchError,   setFetchError]   = useState('')
  const [fetching,     setFetching]     = useState(false)
  const called = useRef(false)

  const tableHotesTotal = tableHotes ? pers * TABLE_HOTES_PRICE * nuits : 0
  const total = nuits * 88 + tableHotesTotal

  const fetchSecret = async (opts: { nom: string; email: string; tel: string; tableHotes: boolean }) => {
    setFetching(true)
    setFetchError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuits, chambre, arrive, depart, pers, ...opts }),
      })
      const d = await res.json()
      if (d.error) { setFetchError(d.error); setFetching(false); return }
      setClientSecret(d.clientSecret)
    } catch {
      setFetchError('Impossible de contacter le serveur.')
    }
    setFetching(false)
  }

  // go=1 : on vient de BookingCard avec toutes les infos — appel API immédiat
  useEffect(() => {
    if (params.get('go') !== '1' || called.current) return
    called.current = true
    fetchSecret({ nom, email, tel, tableHotes: false })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nom.trim() || !email.trim()) return
    fetchSecret({ nom, email, tel, tableHotes })
  }

  const inputBase: React.CSSProperties = {
    background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
    color: '#f5f0e8', padding: '13px 16px', fontSize: '0.9rem',
    fontFamily: 'var(--font-raleway)', fontWeight: 300, outline: 'none', width: '100%',
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-[5fr_7fr] gap-0 items-start">

      {/* Récapitulatif */}
      <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.18)', padding: '36px' }}
        className="md:sticky top-32">
        <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 16 }}>Récapitulatif</p>
        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem', color: '#f5f0e8', marginBottom: 4 }}>{chambre}</h2>
        <div style={{ height: 1, background: 'rgba(196,160,80,.2)', margin: '18px 0' }} />
        <div style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.85rem', color: 'rgba(255,255,255,.5)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {arrive && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Arrivée</span><span style={{ color: 'rgba(255,255,255,.85)' }}>{arrive}</span></div>}
          {depart && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Départ</span><span style={{ color: 'rgba(255,255,255,.85)' }}>{depart}</span></div>}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Personnes</span><span style={{ color: 'rgba(255,255,255,.85)' }}>{pers}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>88 € × {nuits} nuit{nuits>1?'s':''}</span><span style={{ color: 'rgba(255,255,255,.85)' }}>{nuits * 88} €</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Petit-déjeuner</span><span style={{ color: '#c4a050' }}>Inclus</span></div>
          {tableHotes && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Table d'hôtes × {nuits}</span><span style={{ color: 'rgba(255,255,255,.85)' }}>{tableHotesTotal} €</span></div>
          )}
        </div>
        <div style={{ height: 1, background: 'rgba(196,160,80,.2)', margin: '18px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)' }}>Total</span>
          <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', color: '#c4a050' }}>{total} €</span>
        </div>
        <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.7rem', color: 'rgba(255,255,255,.25)', marginTop: 10 }}>Annulation gratuite jusqu'à 48h avant l'arrivée.</p>
      </div>

      {/* Partie droite */}
      <div style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)', padding: '40px' }}>

        {fetchError && (
          <div style={{ background: 'rgba(224,112,112,.1)', border: '1px solid rgba(224,112,112,.3)', padding: '16px', marginBottom: 24, fontFamily: 'var(--font-raleway)', fontSize: '0.82rem', color: '#e07070' }}>
            {fetchError}
          </div>
        )}

        {/* Chargement */}
        {fetching && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(196,160,80,.7)' }}>
              Préparation du paiement…
            </p>
          </div>
        )}

        {/* Formulaire coordonnées — si pas encore de clientSecret et pas en chargement */}
        {!clientSecret && !fetching && (
          <form onSubmit={handleSubmit}>
            {/* Masquer les champs si go=1 (déjà remplis), sauf en cas d'erreur */}
            {(params.get('go') !== '1' || fetchError) && (
              <>
                <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 24 }}>
                  Vos coordonnées
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-raleway)', fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 8 }}>Nom complet *</label>
                    <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Marie Dupont" required style={inputBase}
                      onFocus={e => (e.target.style.borderColor = 'rgba(196,160,80,.5)')}
                      onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,.1)')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-raleway)', fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 8 }}>Email *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="marie@email.fr" required style={inputBase}
                      onFocus={e => (e.target.style.borderColor = 'rgba(196,160,80,.5)')}
                      onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,.1)')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-raleway)', fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 8 }}>Téléphone</label>
                    <input type="tel" value={tel} onChange={e => setTel(e.target.value)} placeholder="06 XX XX XX XX" style={inputBase}
                      onFocus={e => (e.target.style.borderColor = 'rgba(196,160,80,.5)')}
                      onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,.1)')} />
                  </div>
                </div>

                {/* Table d'hôtes */}
                <div style={{ background: 'rgba(196,160,80,.04)', border: '1px solid rgba(196,160,80,.15)', padding: '18px 20px', marginBottom: 24, borderRadius: 2 }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'pointer' }}>
                    <input type="checkbox" checked={tableHotes} onChange={e => setTableHotes(e.target.checked)}
                      style={{ marginTop: 3, accentColor: '#c4a050', width: 16, height: 16, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.82rem', color: '#f5f0e8', marginBottom: 4 }}>
                        Table d'hôtes <span style={{ color: '#c4a050' }}>+{TABLE_HOTES_PRICE} €/pers./soir</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.72rem', color: 'rgba(255,255,255,.4)' }}>
                        Dîner maison avec Sandrine · {pers} pers. × {nuits} soir{nuits>1?'s':''} = {pers * TABLE_HOTES_PRICE * nuits} €
                      </div>
                    </div>
                  </label>
                </div>
              </>
            )}

            <button type="submit" style={{
              width: '100%', background: '#c4a050', color: '#0d110e',
              border: 'none', padding: '16px', cursor: 'pointer',
              fontFamily: 'var(--font-raleway)', fontSize: '0.65rem',
              letterSpacing: '0.2em', textTransform: 'uppercase' as const, fontWeight: 700,
              marginBottom: 16,
            }}>
              Payer en ligne — {total} €
            </button>

            <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.62rem', color: 'rgba(255,255,255,.2)', textAlign: 'center', marginBottom: 16 }}>
              Paiement sécurisé Stripe · Annulation gratuite 48h avant
            </p>

            {params.get('go') !== '1' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
                  <span style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.56rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.2)' }}>ou</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
                </div>
                <Link href={`/contact?chambre=${encodeURIComponent(chambre)}&arrive=${encodeURIComponent(arrive)}&depart=${encodeURIComponent(depart)}&pers=${pers}`}
                  style={{
                    display: 'block', width: '100%', padding: '12px',
                    border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.35)',
                    fontFamily: 'var(--font-raleway)', fontSize: '0.58rem',
                    letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center',
                    textDecoration: 'none', background: 'transparent',
                  }}>
                  Contacter Sandrine (virement / chèque)
                </Link>
              </>
            )}
          </form>
        )}

        {/* Formulaire carte Stripe */}
        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              locale: 'fr',
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: '#c4a050',
                  colorBackground: '#1a2518',
                  colorText: '#f5f0e8',
                  colorDanger: '#e07070',
                  fontFamily: 'Raleway, system-ui, sans-serif',
                  borderRadius: '2px',
                },
              },
            }}
          >
            <PayForm total={total} chambre={chambre} arrive={arrive} depart={depart} nom={nom} email={email} />
          </Elements>
        )}
      </div>
    </div>
  )
}

export default function PaiementPage() {
  return (
    <>
      <Nav />
      <main style={{ background: '#0e1510', minHeight: '100vh', paddingTop: 80 }}>
        <Suspense fallback={
          <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)' }}>Chargement…</div>
          </div>
        }>
          <PaiementInner />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
