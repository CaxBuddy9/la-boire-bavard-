'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'

const TABLE_HOTES_PRICE = 25

function PaiementInner() {
  const params  = useSearchParams()
  const chambre = params.get('chambre') || 'Côté Jardin'
  const arrive  = params.get('arrive')  || ''
  const depart  = params.get('depart')  || ''
  const nuits   = Number(params.get('nuits') || 1)
  const pers    = Number(params.get('pers')  || 2)

  const [nom,        setNom]        = useState(params.get('nom')   || '')
  const [email,      setEmail]      = useState(params.get('email') || '')
  const [tel,        setTel]        = useState(params.get('tel')   || '')
  const [tableHotes, setTableHotes] = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [fetchError, setFetchError] = useState('')
  const called = useRef(false)

  const tableHotesTotal = tableHotes ? pers * TABLE_HOTES_PRICE * nuits : 0
  const total = nuits * 88 + tableHotesTotal

  const callCheckout = async (opts: { nom: string; email: string; tel: string; tableHotes: boolean }) => {
    setLoading(true)
    setFetchError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nuits, chambre, arrive, depart, pers,
          nom: opts.nom, email: opts.email, tel: opts.tel,
          tableHotes: opts.tableHotes,
        }),
      })
      const d = await res.json()
      if (d.error) { setFetchError(d.error); setLoading(false); return }
      if (d.url) { window.location.href = d.url; return }
      setFetchError('Erreur inattendue. Veuillez réessayer.')
      setLoading(false)
    } catch {
      setFetchError('Impossible de contacter le serveur. Vérifiez votre connexion.')
      setLoading(false)
    }
  }

  // Auto-redirect si go=1 (venant de BookingCard avec toutes les infos)
  useEffect(() => {
    if (params.get('go') !== '1' || called.current) return
    called.current = true
    callCheckout({ nom, email, tel, tableHotes: false })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nom.trim() || !email.trim()) return
    callCheckout({ nom, email, tel, tableHotes })
  }

  const inputBase: React.CSSProperties = {
    background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
    color: '#f5f0e8', padding: '13px 16px', fontSize: '0.9rem',
    fontFamily: 'var(--font-raleway)', fontWeight: 300, outline: 'none', width: '100%',
  }

  const isAutoMode = params.get('go') === '1'

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

        {/* Mode auto (go=1) : chargement + redirection */}
        {isAutoMode && (
          <>
            {!fetchError && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(196,160,80,.7)', marginBottom: 16 }}>
                  {loading ? 'Redirection vers le paiement sécurisé Stripe…' : 'Préparation du paiement…'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'rgba(196,160,80,.5)',
                      animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite`,
                    }} />
                  ))}
                </div>
                <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
              </div>
            )}

            {fetchError && (
              <>
                <div style={{ background: 'rgba(224,112,112,.1)', border: '1px solid rgba(224,112,112,.3)', padding: '16px', marginBottom: 24, fontFamily: 'var(--font-raleway)', fontSize: '0.82rem', color: '#e07070' }}>
                  {fetchError}
                </div>
                <button
                  onClick={() => { called.current = false; callCheckout({ nom, email, tel, tableHotes: false }) }}
                  style={{
                    width: '100%', background: '#c4a050', color: '#0d110e',
                    border: 'none', padding: '14px', cursor: 'pointer',
                    fontFamily: 'var(--font-raleway)', fontSize: '0.62rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase' as const, fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  Réessayer
                </button>
                <Link href="/chambres" style={{
                  display: 'block', width: '100%', padding: '12px',
                  border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.35)',
                  fontFamily: 'var(--font-raleway)', fontSize: '0.58rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center',
                  textDecoration: 'none', background: 'transparent',
                }}>
                  Retour aux chambres
                </Link>
              </>
            )}
          </>
        )}

        {/* Mode manuel (pas de go=1) : formulaire complet */}
        {!isAutoMode && (
          <form onSubmit={handleSubmit}>
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

            {/* Option table d'hôtes */}
            <div style={{ background: 'rgba(196,160,80,.04)', border: '1px solid rgba(196,160,80,.15)', padding: '18px 20px', marginBottom: 24, borderRadius: 2 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'pointer' }}>
                <input type="checkbox" checked={tableHotes} onChange={e => setTableHotes(e.target.checked)}
                  style={{ marginTop: 3, accentColor: '#c4a050', width: 16, height: 16, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.82rem', color: '#f5f0e8', marginBottom: 4 }}>
                    Table d'hôtes <span style={{ color: '#c4a050' }}>+{TABLE_HOTES_PRICE} €/pers./soir</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.72rem', color: 'rgba(255,255,255,.4)' }}>
                    Dîner maison avec Sandrine · sur réservation · {pers} pers. × {nuits} soir{nuits>1?'s':''} = {pers * TABLE_HOTES_PRICE * nuits} €
                  </div>
                </div>
              </label>
            </div>

            {fetchError && (
              <div style={{ background: 'rgba(224,112,112,.1)', border: '1px solid rgba(224,112,112,.3)', padding: '12px 16px', marginBottom: 20, fontSize: '0.82rem', color: '#e07070', fontFamily: 'var(--font-raleway)' }}>
                {fetchError}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', background: loading ? 'rgba(196,160,80,.4)' : '#c4a050', color: '#0d110e',
              border: 'none', padding: '16px', cursor: loading ? 'default' : 'pointer',
              fontFamily: 'var(--font-raleway)', fontSize: '0.65rem',
              letterSpacing: '0.2em', textTransform: 'uppercase' as const, fontWeight: 700,
              marginBottom: 16,
            }}>
              {loading ? 'Redirection…' : `Payer en ligne — ${total} €`}
            </button>

            <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.62rem', color: 'rgba(255,255,255,.2)', textAlign: 'center', marginBottom: 16 }}>
              Paiement sécurisé Stripe · Annulation gratuite 48h avant
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
              <span style={{ fontFamily: 'var(--font-raleway)', fontSize: '0.56rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.2)' }}>ou</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
            </div>

            <Link href={`/contact?chambre=${encodeURIComponent(chambre)}&arrive=${encodeURIComponent(arrive)}&depart=${encodeURIComponent(depart)}&pers=${pers}${nom ? `&nom=${encodeURIComponent(nom)}` : ''}${email ? `&email=${encodeURIComponent(email)}` : ''}`}
              style={{
                display: 'block', width: '100%', padding: '12px',
                border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.35)',
                fontFamily: 'var(--font-raleway)', fontSize: '0.58rem',
                letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center',
                textDecoration: 'none', background: 'transparent',
              }}>
              Contacter Sandrine (virement / chèque)
            </Link>
          </form>
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
