'use client'
import { useState, useRef, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'
import RoomPicker from '@/components/RoomPicker'
import DateRangePicker from '@/components/DateRangePicker'
import CustomSelect from '@/components/CustomSelect'
import Breadcrumbs from '@/components/Breadcrumbs'
const S = { slate: '#1a2318', slate2: '#222b20', gold: '#c4a050', cream: 'rgba(240,235,225,.75)', dim: 'rgba(184,192,180,.5)', border: 'rgba(196,160,80,.25)' }

const ACCESS = [
  { icon: '◇', title: 'En voiture', lines: [<><strong>Depuis Angers</strong> — 25 min via D751</>, <><strong>Depuis Saumur</strong> — 20 min via D952</>, <><strong>GPS :</strong> 4 ch. de la Boire Bavard, 49320</>] },
  { icon: '❧', title: 'En train', lines: ['Gare d\'Angers-Saint-Laud (TGV)', 'Puis taxi ou location de vélo', 'Navette possible sur demande'] },
  { icon: '≋', title: 'À vélo', lines: ['Loire à Vélo — itinéraire EV6 à 2 km', 'Anjou à Vélo accessible directement', 'Stationnement vélos sécurisé sur place'] },
]

function ContactInner() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Pré-remplissage depuis les params URL (venant de /chambres ou /paiement)
  const defaultArrivee = searchParams.get('arrive') || ''
  const defaultDepart  = searchParams.get('depart')  || ''
  const defaultChambre = searchParams.get('chambre') || ''

  const [arrivee,      setArrivee]      = useState(defaultArrivee)
  const [depart,       setDepart]       = useState(defaultDepart)
  const [chambre,      setChambre]      = useState(defaultChambre)
  const [adultes,      setAdultes]      = useState('2')
  const [prenom,       setPrenom]       = useState('')
  const [nom,          setNom]          = useState('')
  const [email,        setEmail]        = useState('')
  const [bookedRanges, setBookedRanges] = useState<{check_in:string,check_out:string}[]>([])
  const [takenRooms,   setTakenRooms]   = useState<string[]>([])

  // Quand la chambre change → charge les dates bloquées pour ce calendrier
  useEffect(() => {
    if (!chambre) { setBookedRanges([]); return }
    fetch(`/api/availability?chambre=${encodeURIComponent(chambre)}`)
      .then(r => r.json())
      .then(d => { if (d.booked) setBookedRanges(d.booked) })
      .catch(() => {})
  }, [chambre])

  // Quand les dates changent → charge quelles chambres sont prises
  useEffect(() => {
    if (!arrivee || !depart) { setTakenRooms([]); return }
    fetch(`/api/availability?arrive=${arrivee}&depart=${depart}`)
      .then(r => r.json())
      .then(d => { if (d.taken) setTakenRooms(d.taken) })
      .catch(() => {})
  }, [arrivee, depart])

  const formValid = prenom.trim() !== '' && nom.trim() !== '' && email.trim() !== ''

  function buildPaiementUrl() {
    const nuits = arrivee && depart
      ? Math.max(1, Math.round((new Date(depart).getTime() - new Date(arrivee).getTime()) / 86400000))
      : 1
    const fullNom = `${prenom} ${nom}`.trim()
    const tel = (formRef.current?.elements.namedItem('tel') as HTMLInputElement)?.value || ''
    const params = new URLSearchParams({ chambre, arrive: arrivee, depart, nuits: String(nuits), pers: adultes, nom: fullNom, email, tel })
    return `/paiement?${params.toString()}`
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)
    const form = formRef.current!
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement)?.value || ''
    const tel     = (form.elements.namedItem('tel')     as HTMLInputElement)?.value || ''
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, nom, email, tel, arrivee, depart, adultes, chambre, message }),
      })
    } catch {}
    setSent(true)
    setSending(false)
  }

  const inputCls = 'w-full px-3 py-2 font-sans text-sm focus:outline-none transition-colors'
  const labelCls = 'block font-sans text-[0.58rem] tracking-[0.28em] uppercase mb-2'

  return (
    <>
      <Nav />
      <Breadcrumbs items={[{ name: 'Contact & Accès', path: '/contact' }]} />
      <main>
        {/* Hero header — sombre */}
        <div style={{ background: S.slate, padding: 'clamp(100px,14vw,140px) clamp(16px,5vw,52px) 70px', position: 'relative', overflow: 'hidden' }}>
          {/* Photo de fond + voile */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Image src="/photos/exterieur/celeste-maison-piscine-jardin.jpg" alt="" fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,28,20,.78) 0%, rgba(20,28,20,.86) 60%, rgba(34,43,32,.96) 100%)' }} />
          </div>
          <div style={{ overflow: 'hidden', position: 'absolute', bottom: -20, left: -10, right: 0, pointerEvents: 'none', zIndex: 1 }}>
          <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(6rem,18vw,18vw)', lineHeight: .85, color: 'rgba(255,255,255,.04)', whiteSpace: 'nowrap', fontWeight: 400 }}>CONTACT</span>
          </div>
          <p style={{ position: 'relative', zIndex: 2, fontSize: '.58rem', letterSpacing: '.42em', textTransform: 'uppercase', color: S.gold, fontFamily: 'var(--font-raleway)', marginBottom: 14 }}>Nous avons hâte de vous accueillir</p>
          <h1 style={{ position: 'relative', zIndex: 2, fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, color: 'white', lineHeight: 1.05 }}>
            Écrivez-nous,<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.6)' }}>nous sommes à votre écoute</em>
          </h1>
          <p style={{ position: 'relative', zIndex: 2, fontFamily: 'var(--font-garamond)', fontSize: 'clamp(.95rem,1.2vw,1.05rem)', color: 'rgba(240,235,225,.8)', maxWidth: 580, marginTop: 22, lineHeight: 1.8 }}>
            Sandrine & Jean-Marc se font un plaisir de répondre à chaque demande dans les plus brefs délais. Une question sur les chambres, les dates ou la planche du soir ? N'hésitez pas — par mail, par téléphone ou par WhatsApp.
          </p>
        </div>

        {/* Formulaire + sidebar */}
        <div style={{ background: S.slate2, padding: 'clamp(32px,6vw,70px) clamp(16px,5vw,52px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,420px),1fr))', gap: 40 }}>

            {/* Formulaire */}
            <div>
              {sent ? (
                <div style={{ background: 'rgba(196,160,80,.08)', border: `1px solid ${S.border}`, padding: 48, textAlign: 'center' }}>
                  <span style={{ color: S.gold, fontSize: '2rem', display: 'block', marginBottom: 20 }}>✦</span>
                  <h2 style={{ fontFamily: 'var(--font-playfair)', color: 'white', fontSize: '1.8rem', fontWeight: 400, marginBottom: 12 }}>Message envoyé · merci !</h2>
                  <p style={{ color: S.dim, fontFamily: 'var(--font-garamond)', fontSize: '1.05rem', lineHeight: 1.75 }}>
                    Sandrine & Jean-Marc vous répondent dans les 24 heures.
                  </p>
                  <button onClick={() => setSent(false)} style={{ marginTop: 28, fontFamily: 'var(--font-raleway)', fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase', border: `1px solid ${S.border}`, color: S.gold, padding: '10px 28px', background: 'none', cursor: 'pointer' }}>
                    Nouveau message
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 20, marginBottom: 20 }}>
                    <div>
                      <label style={{ color: S.dim, fontFamily: 'var(--font-raleway)' }} className={labelCls}>Prénom *</label>
                      <input name="prenom" required value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Marie"
                        style={{ background: 'rgba(255,255,255,.06)', border: `1px solid rgba(255,255,255,.1)`, color: 'white', borderBottom: `1px solid ${S.border}` }}
                        className={inputCls} />
                    </div>
                    <div>
                      <label style={{ color: S.dim, fontFamily: 'var(--font-raleway)' }} className={labelCls}>Nom *</label>
                      <input name="nom" required value={nom} onChange={e => setNom(e.target.value)} placeholder="Dupont"
                        style={{ background: 'rgba(255,255,255,.06)', border: `1px solid rgba(255,255,255,.1)`, color: 'white', borderBottom: `1px solid ${S.border}` }}
                        className={inputCls} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 20, marginBottom: 20 }}>
                    <div>
                      <label style={{ color: S.dim, fontFamily: 'var(--font-raleway)' }} className={labelCls}>Email *</label>
                      <input name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="marie@exemple.fr"
                        style={{ background: 'rgba(255,255,255,.06)', border: `1px solid rgba(255,255,255,.1)`, color: 'white', borderBottom: `1px solid ${S.border}` }}
                        className={inputCls} />
                    </div>
                    <div>
                      <label style={{ color: S.dim, fontFamily: 'var(--font-raleway)' }} className={labelCls}>Téléphone</label>
                      <input name="tel" type="tel" placeholder="06 XX XX XX XX"
                        style={{ background: 'rgba(255,255,255,.06)', border: `1px solid rgba(255,255,255,.1)`, color: 'white', borderBottom: `1px solid ${S.border}` }}
                        className={inputCls} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 20, marginBottom: 20 }}>
                    <div>
                      <label style={{ color: S.dim, fontFamily: 'var(--font-raleway)' }} className={labelCls}>Adultes *</label>
                      <CustomSelect
                        name="adultes"
                        value={adultes}
                        onChange={setAdultes}
                        options={[1,2,3,4,5,6].map(n => ({ value: String(n), label: `${n} adulte${n>1?'s':''}` }))}
                      />
                    </div>
                    <div>
                      <label style={{ color: S.dim, fontFamily: 'var(--font-raleway)' }} className={labelCls}>Chambre souhaitée</label>
                      <RoomPicker name="chambre" onSelect={setChambre} takenRooms={takenRooms} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ color: S.dim, fontFamily: 'var(--font-raleway)' }} className={labelCls}>Dates souhaitées</label>
                    <input type="hidden" name="arrivee" value={arrivee} />
                    <input type="hidden" name="depart"  value={depart} />
                    <DateRangePicker
                      checkin={arrivee}
                      checkout={depart}
                      onCheckin={setArrivee}
                      onCheckout={setDepart}
                      bookedRanges={bookedRanges}
                    />
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ color: S.dim, fontFamily: 'var(--font-raleway)' }} className={labelCls}>Message</label>
                    <textarea name="message" rows={4} placeholder="Questions, occasions spéciales, demandes particulières..."
                      style={{ background: 'rgba(255,255,255,.06)', border: `1px solid rgba(255,255,255,.1)`, color: 'white', borderBottom: `1px solid ${S.border}`, resize: 'vertical', width: '100%', padding: '12px 16px', fontFamily: 'var(--font-raleway)', fontSize: '.9rem' }} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                    <button type="submit" disabled={sending}
                      style={{ background: S.gold, color: '#111', fontFamily: 'var(--font-raleway)', fontSize: '.68rem', letterSpacing: '.24em', textTransform: 'uppercase', border: 'none', padding: '16px 40px', cursor: 'pointer', opacity: sending ? .6 : 1 }}>
                      {sending ? 'Envoi...' : 'Envoyer le message'}
                    </button>
                    <button type="button"
                      disabled={!formValid}
                      onClick={() => formValid && router.push(buildPaiementUrl())}
                      title={!formValid ? 'Remplissez prénom, nom et email d\'abord' : ''}
                      style={{ background: 'transparent', border: `1px solid ${formValid ? 'rgba(196,160,80,.5)' : 'rgba(255,255,255,.12)'}`, color: formValid ? S.gold : 'rgba(255,255,255,.2)', fontFamily: 'var(--font-raleway)', fontSize: '.68rem', letterSpacing: '.24em', textTransform: 'uppercase', padding: '16px 32px', cursor: formValid ? 'pointer' : 'default', transition: 'all .2s' }}>
                      Confirmer ma résa →
                    </button>
                  </div>
                  <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.65rem', color: 'rgba(184,192,180,.3)', marginTop: 12 }}>Réponse sous 24h · Aucun paiement en ligne · Règlement sur place</p>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <aside>
              {/* Photo d'accueil */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', marginBottom: 24, overflow: 'hidden', border: `1px solid ${S.border}` }}>
                <Image src="/photos/exterieur/celeste-rose-cle-paradis.jpg" alt="Bienvenue à La Boire Bavard" fill sizes="(max-width:768px) 100vw, 420px" style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,18,14,.85) 0%, transparent 55%)' }} />
                <p style={{ position: 'absolute', bottom: 16, left: 18, right: 18, fontFamily: 'var(--font-playfair)', fontSize: '1.05rem', color: '#f4eedf', lineHeight: 1.3 }}>
                  Votre chambre vous attend<br /><em style={{ fontStyle: 'italic', color: 'rgba(196,160,80,.85)', fontSize: '.85rem' }}>« Paradis »</em>
                </p>
              </div>

              <div style={{ border: `1px solid ${S.border}`, padding: 32, marginBottom: 24 }}>
                <p style={{ fontSize: '.56rem', letterSpacing: '.4em', textTransform: 'uppercase', color: S.gold, fontFamily: 'var(--font-raleway)', marginBottom: 22 }}>Coordonnées</p>
                {[
                  { lbl: 'Adresse', val: '4 chemin de la Boire Bavard\n49320 Blaison-Saint-Sulpice' },
                  { lbl: 'Téléphone', val: '06 75 78 63 35', href: 'tel:0675786335' },
                  { lbl: 'Email', val: 'contact@laboirebavard.com', href: 'mailto:contact@laboirebavard.com' },
                ].map(({ lbl, val, href }) => (
                  <div key={lbl} style={{ marginBottom: 18 }}>
                    <p style={{ fontSize: '.52rem', letterSpacing: '.28em', textTransform: 'uppercase', color: 'rgba(184,192,180,.35)', fontFamily: 'var(--font-raleway)', marginBottom: 4 }}>{lbl}</p>
                    {href
                      ? <a href={href} style={{ color: S.dim, fontFamily: 'var(--font-garamond)', fontSize: '.95rem', textDecoration: 'none' }}>{val}</a>
                      : <p style={{ color: S.dim, fontFamily: 'var(--font-garamond)', fontSize: '.95rem', whiteSpace: 'pre-line' }}>{val}</p>
                    }
                  </div>
                ))}
                <a href="https://wa.me/33675786335" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(37,211,102,.7)', fontFamily: 'var(--font-raleway)', fontSize: '.72rem', letterSpacing: '.12em', textDecoration: 'none', marginTop: 8 }}>
                  ◇ WhatsApp
                </a>
              </div>

              <div style={{ border: `1px solid ${S.border}`, padding: 32 }}>
                <p style={{ fontSize: '.56rem', letterSpacing: '.4em', textTransform: 'uppercase', color: S.gold, fontFamily: 'var(--font-raleway)', marginBottom: 18 }}>Infos pratiques</p>
                {['Check-in à partir de 16h','Check-out avant 10h','Petit-déjeuner 7h30–9h30','Parking privé gratuit à l\'entrée de la propriété','Animaux non acceptés','Taxe de séjour : 0,83 €/pers./nuit, réglée sur place','Annulation gratuite jusqu\'à 4 jours avant l\'arrivée','Planche du soir 24€ pour 2 (sur résa)'].map(info => (
                  <p key={info} style={{ color: S.dim, fontFamily: 'var(--font-raleway)', fontSize: '.78rem', lineHeight: 1.7, marginBottom: 6 }}>
                    <span style={{ color: S.gold, marginRight: 8 }}>→</span>{info}
                  </p>
                ))}
              </div>
            </aside>
          </div>
        </div>

        {/* ═══ SECTION ACCÈS — sombre avec carte ═══ */}
        <div style={{ background: '#141c14', padding: 'clamp(40px,8vw,80px) clamp(16px,5vw,52px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,440px),1fr))', gap: 70, alignItems: 'start', maxWidth: '100%' }}>
          {/* Gauche : infos accès */}
          <div>
            <p style={{ fontSize: '.56rem', letterSpacing: '.4em', textTransform: 'uppercase', color: S.gold, fontFamily: 'var(--font-raleway)', marginBottom: 16 }}>Comment nous trouver</p>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 400, color: 'white', marginBottom: 22, lineHeight: 1.2 }}>
              Accès &<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.4)' }}>itinéraire</em>
            </h2>
            <div style={{ width: 40, height: 1, background: 'rgba(196,160,80,.4)', marginBottom: 32 }} />

            {ACCESS.map((a) => (
              <div key={a.title} style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
                <span style={{ color: S.gold, fontSize: '1.1rem', flexShrink: 0, marginTop: 2 }}>{a.icon}</span>
                <div>
                  <p style={{ fontSize: '.56rem', letterSpacing: '.28em', textTransform: 'uppercase', color: S.gold, fontFamily: 'var(--font-raleway)', marginBottom: 8 }}>{a.title}</p>
                  {a.lines.map((l, i) => (
                    <p key={i} style={{ color: 'rgba(184,192,180,.6)', fontFamily: 'var(--font-raleway)', fontSize: '.82rem', lineHeight: 1.75 }}>{l}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* GPS box */}
            <div style={{ marginTop: 8, padding: '16px 20px', background: 'rgba(196,160,80,.07)', borderLeft: `2px solid rgba(196,160,80,.4)` }}>
              <p style={{ fontSize: '.5rem', letterSpacing: '.32em', textTransform: 'uppercase', color: S.gold, fontFamily: 'var(--font-raleway)', marginBottom: 6 }}>Coordonnées GPS</p>
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '1rem', color: 'rgba(240,235,225,.8)' }}>47.3952° N, 0.3690° O</p>
              <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.72rem', color: 'rgba(184,192,180,.4)', marginTop: 4 }}>4 chemin de la Boire Bavard, 49320 Blaison-Saint-Sulpice</p>
            </div>
          </div>

          {/* Droite : carte Maps */}
          <div style={{ position: 'relative' }}>
            {/* Coins dorés */}
            {(['tl','tr','bl','br'] as const).map((pos) => (
              <span key={pos} style={{
                position: 'absolute', width: 22, height: 22, zIndex: 2,
                ...(pos === 'tl' ? { top: 0, left: 0 } : pos === 'tr' ? { top: 0, right: 0 } : pos === 'bl' ? { bottom: 0, left: 0 } : { bottom: 0, right: 0 }),
                borderTop: pos.startsWith('t') ? `2px solid ${S.gold}` : undefined,
                borderBottom: pos.startsWith('b') ? `2px solid ${S.gold}` : undefined,
                borderLeft: pos.endsWith('l') ? `2px solid ${S.gold}` : undefined,
                borderRight: pos.endsWith('r') ? `2px solid ${S.gold}` : undefined,
              }} />
            ))}
            <div style={{ padding: 10 }}>
              {/* ⚠️ COORDONNÉES VERROUILLÉES — vérifiées sur OpenStreetMap (Impasse du Clos de la Hutte, lieu-dit La Hutte, Blaison-Saint-Sulpice, 49320).
                  Position réelle : 47.3952 N, -0.3690 O (confirmée par le client via Google Maps). NE PAS modifier sans regéocoder l'adresse. */}
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-0.3890%2C47.3852%2C-0.3490%2C47.4052&layer=mapnik&marker=47.3952%2C-0.3690"
                style={{ width: '100%', aspectRatio: '4/3', border: 'none', display: 'block', filter: 'grayscale(30%) contrast(0.92)' }}
                loading="lazy"
                title="Carte La Boire Bavard"
              />
            </div>
            {/* Pin card */}
            <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 3, background: 'rgba(12,18,14,.92)', backdropFilter: 'blur(12px)', border: `1px solid rgba(196,160,80,.3)`, padding: '16px 20px', maxWidth: 220 }}>
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '1rem', fontWeight: 400, color: '#f4eedf', letterSpacing: '.06em', marginBottom: 6 }}>La Boire Bavard</p>
              <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.62rem', color: 'rgba(184,192,200,.55)', lineHeight: 1.65, marginBottom: 12 }}>
                4 chemin de la Boire Bavard<br />49320 Blaison-Saint-Sulpice
              </p>
              <a href="https://www.google.com/maps/dir/?api=1&destination=47.3952,-0.3690" target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-raleway)', fontSize: '.6rem', letterSpacing: '.12em', textTransform: 'uppercase', color: S.gold, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                ◇ Itinéraire Google Maps
              </a>
              <a href="https://wa.me/33675786335" target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-raleway)', fontSize: '.6rem', letterSpacing: '.12em', textTransform: 'uppercase', color: S.gold, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                ◇ WhatsApp
              </a>
            </div>
          </div>
        </div>
        {/* ═══ SECTION ACCESSIBILITÉ ═══ */}
        <div style={{ background: '#111009', padding: 'clamp(40px,8vw,80px) clamp(16px,5vw,52px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ fontSize: '.56rem', letterSpacing: '.4em', textTransform: 'uppercase', color: S.gold, fontFamily: 'var(--font-raleway)', marginBottom: 14, textAlign: 'center' }}>Pour tous nos hôtes</p>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 400, color: 'white', marginBottom: 10, lineHeight: 1.2, textAlign: 'center' }}>
              Accessibilité & confort
            </h2>
            <div style={{ width: 40, height: 1, background: 'rgba(196,160,80,.4)', margin: '0 auto 48px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
              {[
                {
                  icon: '◇',
                  title: 'Bon à savoir',
                  items: [
                    'Chambres Côté Jardin et Côté Cèdre de plain-pied',
                    'Parking à l\'entrée de la propriété, en retrait des chambres',
                    'Allées extérieures stabilisées (gravier compact)',
                    'Pas de marche à l\'entrée principale',
                    'Animaux d\'assistance acceptés',
                    'Prévenez-nous avant votre arrivée pour tout besoin spécifique',
                  ],
                },
              ].map((bloc) => (
                <div key={bloc.title} style={{ background: 'rgba(255,255,255,.035)', border: '1px solid rgba(196,160,80,.14)', padding: '28px 28px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <span style={{ color: S.gold, fontSize: '1.1rem' }}>{bloc.icon}</span>
                    <p style={{ fontSize: '.56rem', letterSpacing: '.28em', textTransform: 'uppercase', color: S.gold, fontFamily: 'var(--font-raleway)' }}>{bloc.title}</p>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {bloc.items.map((item) => (
                      <li key={item} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: 'rgba(196,160,80,.4)', fontSize: '.7rem', flexShrink: 0, marginTop: 3 }}>→</span>
                        <span style={{ color: 'rgba(184,192,180,.6)', fontFamily: 'var(--font-raleway)', fontSize: '.8rem', lineHeight: 1.7 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bandeau contact accessibilité */}
            <div style={{ background: 'rgba(196,160,80,.07)', border: '1px solid rgba(196,160,80,.2)', padding: '28px 36px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
              <div>
                <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.15rem', color: 'rgba(240,235,225,.85)', marginBottom: 6 }}>
                  Un besoin particulier ?
                </p>
                <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.78rem', color: 'rgba(184,192,180,.5)', lineHeight: 1.6 }}>
                  Sandrine & Jean-Marc adaptent votre séjour à vos besoins. N'hésitez pas à les appeler directement.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="tel:0675786335"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', background: S.gold, color: '#111', padding: '12px 24px', textDecoration: 'none', display: 'inline-block' }}>
                  📞 Nous appeler
                </a>
                <a href="https://wa.me/33675786335" target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', border: `1px solid rgba(196,160,80,.4)`, color: S.gold, padding: '12px 24px', textDecoration: 'none', display: 'inline-block' }}>
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#1a2318' }} />}>
      <ContactInner />
    </Suspense>
  )
}
