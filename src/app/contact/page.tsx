'use client'
import { useState, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'
import RoomPicker from '@/components/RoomPicker'
const S = { slate: '#1a2318', slate2: '#222b20', gold: '#c4a050', cream: 'rgba(240,235,225,.75)', dim: 'rgba(184,192,180,.5)', border: 'rgba(196,160,80,.25)' }

const ACCESS = [
  { icon: '◇', title: 'En voiture', lines: [<><strong>Depuis Angers</strong> — 25 min via D751</>, <><strong>Depuis Saumur</strong> — 20 min via D952</>, <><strong>GPS :</strong> 4 ch. de la Boire Bavard, 49320</>] },
  { icon: '❧', title: 'En train', lines: ['Gare d\'Angers-Saint-Laud (TGV)', 'Puis taxi ou location de vélo', 'Navette possible sur demande à Sandrine'] },
  { icon: '≋', title: 'À vélo', lines: ['Loire à Vélo — itinéraire EV6 à 2 km', 'Anjou à Vélo accessible directement', 'Stationnement vélos sécurisé sur place'] },
]

function ContactInner() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const searchParams = useSearchParams()

  // Pré-remplissage depuis les params URL (venant de /paiement)
  const defaultArrivee = searchParams.get('arrive') || ''
  const defaultDepart  = searchParams.get('depart')  || ''
  const defaultChambre = searchParams.get('chambre') || ''
  const defaultPers    = searchParams.get('pers')    || '2'

  function buildPaiementUrl() {
    const form = formRef.current
    const arrivee = (form?.elements.namedItem('arrivee') as HTMLInputElement)?.value || ''
    const depart  = (form?.elements.namedItem('depart')  as HTMLInputElement)?.value || ''
    const chambre = (form?.elements.namedItem('chambre') as HTMLInputElement)?.value || ''
    const adultes = (form?.elements.namedItem('adultes') as HTMLSelectElement)?.value || '2'
    const params  = new URLSearchParams({ chambre, arrive: arrivee, depart, pers: adultes })
    return `/paiement?${params.toString()}`
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 800))
    setSent(true)
    setSending(false)
  }

  const inputCls = 'w-full px-3 py-2 font-sans text-sm focus:outline-none transition-colors'
  const labelCls = 'block font-sans text-[0.58rem] tracking-[0.28em] uppercase mb-2'

  return (
    <>
      <Nav />
      <main>
        {/* Hero header — sombre */}
        <div style={{ background: S.slate, padding: '140px 52px 70px', position: 'relative', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', bottom: -20, left: -10, fontFamily: 'var(--font-playfair)', fontSize: '18vw', lineHeight: .85, color: 'rgba(255,255,255,.025)', pointerEvents: 'none', whiteSpace: 'nowrap', fontWeight: 400 }}>CONTACT</span>
          <p style={{ fontSize: '.58rem', letterSpacing: '.42em', textTransform: 'uppercase', color: S.gold, fontFamily: 'var(--font-raleway)', marginBottom: 14 }}>Réservation</p>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, color: 'white', lineHeight: 1.05 }}>
            Contact &<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.45)' }}>Disponibilités</em>
          </h1>
        </div>

        {/* Formulaire + sidebar */}
        <div style={{ background: S.slate2, padding: '70px 52px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 60 }}>

            {/* Formulaire */}
            <div>
              {sent ? (
                <div style={{ background: 'rgba(196,160,80,.08)', border: `1px solid ${S.border}`, padding: 48, textAlign: 'center' }}>
                  <span style={{ color: S.gold, fontSize: '2rem', display: 'block', marginBottom: 20 }}>✦</span>
                  <h2 style={{ fontFamily: 'var(--font-playfair)', color: 'white', fontSize: '1.8rem', fontWeight: 400, marginBottom: 12 }}>Message envoyé</h2>
                  <p style={{ color: S.dim, fontFamily: 'var(--font-garamond)', fontSize: '1.05rem', lineHeight: 1.75 }}>
                    Sandrine vous répondra dans les 24 heures.
                  </p>
                  <button onClick={() => setSent(false)} style={{ marginTop: 28, fontFamily: 'var(--font-raleway)', fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase', border: `1px solid ${S.border}`, color: S.gold, padding: '10px 28px', background: 'none', cursor: 'pointer' }}>
                    Nouveau message
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                    {[['prenom','Prénom *','Marie',true],['nom','Nom *','Dupont',true]].map(([name,label,ph,req]) => (
                      <div key={name as string}>
                        <label style={{ ...{ color: S.dim }, fontFamily: 'var(--font-raleway)' }} className={labelCls}>{label}</label>
                        <input name={name as string} required={!!req} placeholder={ph as string}
                          style={{ background: 'rgba(255,255,255,.06)', border: `1px solid rgba(255,255,255,.1)`, color: 'white', borderBottom: `1px solid ${S.border}` }}
                          className={inputCls} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                    {[['email','Email *','marie@exemple.fr',true,'email'],['tel','Téléphone','06 XX XX XX XX',false,'tel']].map(([name,label,ph,req,type]) => (
                      <div key={name as string}>
                        <label style={{ color: S.dim, fontFamily: 'var(--font-raleway)' }} className={labelCls}>{label}</label>
                        <input name={name as string} type={type as string} required={!!req} placeholder={ph as string}
                          style={{ background: 'rgba(255,255,255,.06)', border: `1px solid rgba(255,255,255,.1)`, color: 'white', borderBottom: `1px solid ${S.border}` }}
                          className={inputCls} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                    {([['arrivee','Arrivée souhaitée', defaultArrivee],['depart','Départ souhaité', defaultDepart]] as [string,string,string][]).map(([name,label,def]) => (
                      <div key={name}>
                        <label style={{ color: S.dim, fontFamily: 'var(--font-raleway)' }} className={labelCls}>{label}</label>
                        <input name={name} type="date" defaultValue={def}
                          style={{ background: 'rgba(255,255,255,.06)', border: `1px solid rgba(255,255,255,.1)`, color: 'rgba(255,255,255,.6)', borderBottom: `1px solid ${S.border}`, colorScheme: 'dark' }}
                          className={inputCls} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                    <div>
                      <label style={{ color: S.dim, fontFamily: 'var(--font-raleway)' }} className={labelCls}>Adultes *</label>
                      <select name="adultes" required style={{ background: '#1e2a1c', border: `1px solid rgba(255,255,255,.1)`, color: 'rgba(255,255,255,.7)', borderBottom: `1px solid ${S.border}` }} className={inputCls}>
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} adulte{n>1?'s':''}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ color: S.dim, fontFamily: 'var(--font-raleway)' }} className={labelCls}>Chambre souhaitée</label>
                      <RoomPicker name="chambre" />
                    </div>
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
                    <Link href={buildPaiementUrl()} onClick={(e) => { e.preventDefault(); window.location.href = buildPaiementUrl() }}
                      style={{ background: 'transparent', border: `1px solid rgba(196,160,80,.5)`, color: S.gold, fontFamily: 'var(--font-raleway)', fontSize: '.68rem', letterSpacing: '.24em', textTransform: 'uppercase', padding: '16px 32px', textDecoration: 'none', display: 'inline-block', cursor: 'pointer' }}>
                      Payer en ligne →
                    </Link>
                  </div>
                  <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.65rem', color: 'rgba(184,192,180,.3)', marginTop: 12 }}>Réponse sous 24h · Données confidentielles · ou réservation directe par paiement en ligne</p>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <aside>
              <div style={{ border: `1px solid ${S.border}`, padding: 32, marginBottom: 24 }}>
                <p style={{ fontSize: '.56rem', letterSpacing: '.4em', textTransform: 'uppercase', color: S.gold, fontFamily: 'var(--font-raleway)', marginBottom: 22 }}>Coordonnées</p>
                {[
                  { lbl: 'Adresse', val: '4 chemin de la Boire Bavard\n49320 Blaison-Saint-Sulpice' },
                  { lbl: 'Téléphone', val: '06 75 78 63 35', href: 'tel:0675786335' },
                  { lbl: 'Email', val: 'laboirebavard@gmail.com', href: 'mailto:laboirebavard@gmail.com' },
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
                {['Check-in à partir de 16h','Check-out avant 11h','Petit-déjeuner 8h–10h','Parking privé gratuit','Animaux non acceptés','Table d\'hôtes vendredi (25€)'].map(info => (
                  <p key={info} style={{ color: S.dim, fontFamily: 'var(--font-raleway)', fontSize: '.78rem', lineHeight: 1.7, marginBottom: 6 }}>
                    <span style={{ color: S.gold, marginRight: 8 }}>→</span>{info}
                  </p>
                ))}
              </div>
            </aside>
          </div>
        </div>

        {/* ═══ SECTION ACCÈS — sombre avec carte ═══ */}
        <div style={{ background: '#141c14', padding: '80px 52px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 70, alignItems: 'start', maxWidth: '100%' }}>
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
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '1rem', color: 'rgba(240,235,225,.8)' }}>47.3680° N, 0.5110° O</p>
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
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2719.8!2d-0.5134!3d47.3672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4817c5e7e7e7e7e7%3A0x0!2zNDcuMzY3MiwgLTAuNTEzNA!5e0!3m2!1sfr!2sfr!4v1711234567890!5m2!1sfr!2sfr"
                style={{ width: '100%', aspectRatio: '4/3', border: 'none', display: 'block', filter: 'grayscale(40%) contrast(0.88) sepia(10%)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Carte La Boire Bavard"
              />
            </div>
            {/* Pin card */}
            <div style={{ position: 'absolute', bottom: 28, left: 28, zIndex: 3, background: 'rgba(12,18,14,.92)', backdropFilter: 'blur(12px)', border: `1px solid rgba(196,160,80,.3)`, padding: '16px 20px', maxWidth: 220 }}>
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '1rem', fontWeight: 400, color: '#f4eedf', letterSpacing: '.06em', marginBottom: 6 }}>La Boire Bavard</p>
              <p style={{ fontFamily: 'var(--font-raleway)', fontSize: '.62rem', color: 'rgba(184,192,200,.55)', lineHeight: 1.65, marginBottom: 12 }}>
                4 chemin de la Boire Bavard<br />49320 Blaison-Saint-Sulpice
              </p>
              <a href="https://wa.me/33675786335" target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-raleway)', fontSize: '.6rem', letterSpacing: '.12em', textTransform: 'uppercase', color: S.gold, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                ◇ WhatsApp
              </a>
            </div>
          </div>
        </div>
        {/* ═══ SECTION ACCESSIBILITÉ ═══ */}
        <div style={{ background: '#111009', padding: '80px 52px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ fontSize: '.56rem', letterSpacing: '.4em', textTransform: 'uppercase', color: S.gold, fontFamily: 'var(--font-raleway)', marginBottom: 14, textAlign: 'center' }}>Pour tous nos hôtes</p>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 400, color: 'white', marginBottom: 10, lineHeight: 1.2, textAlign: 'center' }}>
              Accessibilité
            </h2>
            <div style={{ width: 40, height: 1, background: 'rgba(196,160,80,.4)', margin: '0 auto 48px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
              {[
                {
                  icon: '◇',
                  title: 'Mobilité réduite',
                  items: [
                    'Parking accessible directement devant les chambres',
                    'Chambre Côté Jardin en rez-de-chaussée, plain-pied',
                    'Chambre Côté Cèdre accessible de plain-pied',
                    'Allées extérieures stabilisées (gravier compact)',
                    'Salle de bain adaptable sur demande préalable',
                  ],
                },
                {
                  icon: '❧',
                  title: 'Équipements & services',
                  items: [
                    'Accès piscine avec marches larges + main courante',
                    'Petit-déjeuner servi en chambre si nécessaire',
                    'Accompagnement à l\'arrivée par Sandrine',
                    'Animaux d\'assistance acceptés',
                    'Téléphone disponible sur demande',
                  ],
                },
                {
                  icon: '≋',
                  title: 'Informations pratiques',
                  items: [
                    'Contactez Sandrine avant votre arrivée pour tout besoin spécifique',
                    'Chambres du rez-de-chaussée réservables en priorité',
                    'Dépose & embarquement facilité à l\'entrée',
                    'Stationnement PMR à 10 m des chambres',
                    'Pas de marche à l\'entrée principale',
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
                  Sandrine est disponible pour adapter votre séjour à vos besoins. Contactez-la directement.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="tel:0675786335"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', background: S.gold, color: '#111', padding: '12px 24px', textDecoration: 'none', display: 'inline-block' }}>
                  📞 Appeler Sandrine
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
