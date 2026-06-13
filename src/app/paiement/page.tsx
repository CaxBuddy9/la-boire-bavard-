'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'

const PRIX_NUIT = 90

function ReservationInner() {
  const params  = useSearchParams()
  const chambre = params.get('chambre') || ''
  const arrive  = params.get('arrive')  || ''
  const depart  = params.get('depart')  || ''
  const nuits   = Math.max(1, Number(params.get('nuits') || 1))
  const pers    = Math.max(1, Number(params.get('pers')  || 2))

  const [nom,        setNom]        = useState(params.get('nom')   || '')
  const [email,      setEmail]      = useState(params.get('email') || '')
  const [tel,        setTel]        = useState(params.get('tel')   || '')
  const [message,    setMessage]    = useState('')
  const [status,     setStatus]     = useState<'idle'|'loading'|'sent'|'error'>('idle')
  const [errMsg,     setErrMsg]     = useState('')

  const totalNuits   = nuits * PRIX_NUIT
  const totalEstime  = totalNuits

  const slugFromName: Record<string,string> = {
    'Côté Jardin': 'jardin',
    'Côté Cèdre':  'cedre',
    'Côté Vallée': 'vallee',
  }
  const chambreSlug = slugFromName[chambre] || chambre.toLowerCase()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nom.trim() || !email.trim()) return
    setStatus('loading')
    setErrMsg('')

    const [prenom, ...rest] = nom.trim().split(' ')
    const nomFamille = rest.join(' ') || prenom

    const fullMessage = [
      `Demande de réservation pour ${chambre || 'une chambre'}`,
      arrive && depart ? `Du ${arrive} au ${depart} — ${nuits} nuit${nuits>1?'s':''}` : '',
      `${pers} personne${pers>1?'s':''}`,
      `Total estimé : ${totalEstime} € (paiement sur place)`,
      message ? `\nMessage du client :\n${message}` : '',
    ].filter(Boolean).join('\n')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom, nom: nomFamille, email, tel,
          chambre: chambreSlug,
          arrivee: arrive,
          depart,
          adultes: pers,
          message: fullMessage,
        }),
      })
      const d = await res.json().catch(() => ({}))
      if (!res.ok || d.error) {
        setStatus('error')
        setErrMsg(d.error || 'Impossible d\'envoyer la demande.')
        return
      }
      setStatus('sent')
    } catch {
      setStatus('error')
      setErrMsg('Impossible de contacter le serveur — réessayez plus tard.')
    }
  }

  const inputBase: React.CSSProperties = {
    background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
    color: '#f5f0e8', padding: '13px 16px', fontSize: '0.9rem',
    fontFamily: 'Raleway, sans-serif', fontWeight: 300, outline: 'none', width: '100%',
  }
  const labelBase: React.CSSProperties = {
    display: 'block', fontFamily: 'Raleway, sans-serif', fontSize: '0.52rem',
    letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)',
    marginBottom: 8,
  }

  // ── Page de confirmation après envoi ──
  if (status === 'sent') {
    return (
      <div className="max-w-3xl mx-auto px-8 py-24 text-center">
        <div style={{ background: 'rgba(196,160,80,.06)', border: '1px solid rgba(196,160,80,.2)', padding: '56px 32px' }}>
          <span style={{ color: '#c4a050', fontSize: '2.5rem', display: 'block', marginBottom: 24 }}>✦</span>
          <h1 style={{ fontFamily: 'Georgia, serif', color: '#f5f0e8', fontSize: '2rem', marginBottom: 16, fontWeight: 400 }}>
            Demande envoyée !
          </h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: 28 }}>
            Merci {nom.split(' ')[0]}, votre demande de réservation a bien été transmise.<br />
            Nous vous répondrons par email ou téléphone sous 24 heures pour confirmer votre séjour.
          </p>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '0.85rem', marginBottom: 36 }}>
            Le paiement se fera sur place à votre arrivée — par carte bancaire, espèces ou chèque.
          </p>
          <Link href="/" style={{
            display: 'inline-block', background: '#c4a050', color: '#0d110e',
            fontFamily: 'Raleway, sans-serif', fontSize: '0.7rem',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            padding: '14px 32px', textDecoration: 'none',
          }}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-16">

      {/* En-tête — clarté du processus */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 12 }}>
          Réservation · sans paiement en ligne
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem,3.2vw,2.6rem)', color: '#f5f0e8', fontWeight: 400, lineHeight: 1.2, marginBottom: 14 }}>
          Votre demande de réservation
        </h1>
        <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.92rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.75, maxWidth: 640 }}>
          Vérifiez votre récapitulatif, puis envoyez votre demande. Nous confirmons la disponibilité sous 24&nbsp;h ; le règlement se fait sur place à l'arrivée (carte, espèces ou chèque).
        </p>
      </div>

      <div className="grid md:grid-cols-[5fr_7fr] gap-0 items-start">

      {/* Récapitulatif */}
      <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.18)', padding: '36px' }}
        className="md:sticky top-32">
        <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 16 }}>Récapitulatif</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#f5f0e8', marginBottom: 4 }}>{chambre || 'Votre chambre'}</h2>
        <div style={{ height: 1, background: 'rgba(196,160,80,.2)', margin: '18px 0' }} />
        <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,.5)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {arrive && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Arrivée</span><span style={{ color: 'rgba(255,255,255,.85)' }}>{arrive}</span></div>}
          {depart && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Départ</span><span style={{ color: 'rgba(255,255,255,.85)' }}>{depart}</span></div>}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Personnes</span><span style={{ color: 'rgba(255,255,255,.85)' }}>{pers}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{PRIX_NUIT} € × {nuits} nuit{nuits>1?'s':''}</span><span style={{ color: 'rgba(255,255,255,.85)' }}>{totalNuits} €</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Petit-déjeuner</span><span style={{ color: '#c4a050' }}>Inclus</span></div>
        </div>
        <div style={{ height: 1, background: 'rgba(196,160,80,.2)', margin: '18px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)' }}>Total estimé</span>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#c4a050' }}>{totalEstime} €</span>
        </div>
        <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.7rem', color: 'rgba(255,255,255,.35)', marginTop: 14, lineHeight: 1.6 }}>
          Aucun paiement en ligne — vous réglez directement sur place (carte, espèces ou chèque).
        </p>
        <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.65rem', color: 'rgba(255,255,255,.25)', marginTop: 8 }}>Annulation gratuite jusqu'à 4 jours avant l'arrivée.</p>
      </div>

      {/* Formulaire */}
      <div style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)', padding: '40px' }}>
        <p className="label-caps" style={{ marginBottom: 12 }}>Confirmer ma réservation</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#f5f0e8', marginBottom: 24, fontWeight: 400, lineHeight: 1.3 }}>
          Vos coordonnées
        </h2>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '0.92rem', lineHeight: 1.75, marginBottom: 28 }}>
          Validez votre demande et nous vous répondrons sous 24h par email pour confirmer la disponibilité.
        </p>

        <form onSubmit={submit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24 }}>
            <div>
              <label style={labelBase}>Nom complet *</label>
              <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Marie Dupont" required style={inputBase}
                onFocus={e => (e.target.style.borderColor = 'rgba(196,160,80,.5)')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,.1)')} />
            </div>
            <div>
              <label style={labelBase}>Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="marie@email.fr" required style={inputBase}
                onFocus={e => (e.target.style.borderColor = 'rgba(196,160,80,.5)')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,.1)')} />
            </div>
            <div>
              <label style={labelBase}>Téléphone</label>
              <input type="tel" value={tel} onChange={e => setTel(e.target.value)} placeholder="06 XX XX XX XX" style={inputBase}
                onFocus={e => (e.target.style.borderColor = 'rgba(196,160,80,.5)')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,.1)')} />
            </div>
            <div>
              <label style={labelBase}>Message (facultatif)</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="Allergies, occasion spéciale, heure d'arrivée…"
                style={{ ...inputBase, resize: 'vertical', fontFamily: 'Raleway, sans-serif' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(196,160,80,.5)')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,.1)')} />
            </div>
          </div>

          {errMsg && (
            <div style={{ background: 'rgba(224,112,112,.1)', border: '1px solid rgba(224,112,112,.3)', padding: '12px 16px', marginBottom: 20, fontSize: '0.82rem', color: '#e07070' }}>
              {errMsg}
            </div>
          )}

          <button type="submit" disabled={status === 'loading'} style={{
            width: '100%', background: status === 'loading' ? 'rgba(196,160,80,.4)' : '#c4a050',
            color: '#0d110e', border: 'none', padding: '16px', cursor: status === 'loading' ? 'default' : 'pointer',
            fontFamily: 'Raleway, sans-serif', fontSize: '0.7rem',
            letterSpacing: '0.22em', textTransform: 'uppercase' as const, fontWeight: 600,
          }}>
            {status === 'loading' ? 'Envoi…' : 'Envoyer ma demande de réservation'}
          </button>

          <p style={{ textAlign: 'center', fontFamily: 'Raleway, sans-serif', fontSize: '0.7rem', color: 'rgba(255,255,255,.35)', marginTop: 14, lineHeight: 1.6 }}>
            Pas de paiement en ligne — nous vous confirmons la disponibilité et vous réglez sur place.
          </p>
          <p style={{ textAlign: 'center', fontFamily: 'Raleway, sans-serif', fontSize: '0.65rem', color: 'rgba(255,255,255,.22)', marginTop: 6 }}>
            En validant, vous acceptez nos{' '}
            <Link href="/mentions-legales" style={{ color: 'rgba(196,160,80,.5)', textDecoration: 'underline' }}>conditions générales</Link>
          </p>
        </form>
      </div>
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
            <div style={{ fontFamily: 'Raleway, sans-serif', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)' }}>Chargement…</div>
          </div>
        }>
          <ReservationInner />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
