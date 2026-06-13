import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'
import { ROOMS } from '@/lib/rooms'

export const metadata = {
  title: "Chambres — La Boire Bavard",
  description: "3 chambres de charme à La Boire Bavard. Piscine, jardin, vue sur la vallée. 90€/nuit petit-déjeuner inclus.",
}

// Une couleur par chambre, fidèle à son identité et bien distincte :
// Jardin = terracotta chaleureux · Cèdre = beige/taupe clair · Vallée = bleu nuit
const BG_STYLES = [
  // Côté Jardin — terracotta (poutres bois, tuiles, cheminée)
  { bg: '#7e3d24', color: 'white',   gold: 'rgba(255,221,196,.75)', divider: 'rgba(255,255,255,.32)', tagBorder: 'rgba(255,255,255,.28)', tagColor: 'rgba(255,255,255,.78)' },
  // Côté Cèdre — beige/taupe doré (dépendance, pierres, poutres)
  { bg: '#e8e0d2', color: '#2a2018', gold: '#9c7c4e',               divider: '#b8a37a',              tagBorder: 'rgba(60,45,25,.25)',    tagColor: '#3a2c1c' },
  // Côté Vallée — bleu nuit (cocon sous les toits)
  { bg: '#22323e', color: 'white',   gold: 'rgba(150,200,220,.8)',  divider: 'rgba(150,200,220,.35)', tagBorder: 'rgba(255,255,255,.25)', tagColor: 'rgba(220,235,242,.78)' },
]

export default function ChambresPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Header éditorial */}
        <div style={{ padding: '160px 52px 80px', background: '#111009', position: 'relative', overflow: 'hidden' }}>
          <span style={{
            position: 'absolute', bottom: -20, left: -10,
            fontFamily: 'var(--font-playfair)', fontSize: '22vw', lineHeight: .85,
            color: 'rgba(255,255,255,.03)', pointerEvents: 'none', whiteSpace: 'nowrap', fontWeight: 400,
          }}>CHAMBRES</span>
          <p className="label-caps" style={{ marginBottom: 16 }}>Hébergements</p>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(3rem,7vw,6rem)', fontWeight: 400, color: 'white', lineHeight: 1.05, maxWidth: 700 }}>
            Trois chambres,<br />
            <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.5)' }}>trois univers</em>
          </h1>
          <p style={{ marginTop: 28, maxWidth: 560, fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255,255,255,.5)', fontFamily: 'var(--font-garamond)' }}>
            Chaque chambre a son caractère propre. Toutes disposent d'une entrée indépendante
            et d'une salle d'eau privative, dans un cadre calme et verdoyant.
          </p>
        </div>

        {/* Chambres en alternance */}
        {ROOMS.map((room, i) => {
          const s = BG_STYLES[i]
          const reverse = i % 2 === 1
          return (
            <div key={room.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '70vh', direction: reverse ? 'rtl' : 'ltr' }}>
              {/* Image */}
              <div style={{ overflow: 'hidden', position: 'relative', direction: 'ltr', minHeight: '50vw' }}>
                <Image src={room.images[0]} alt={room.name} fill className="object-cover" sizes="50vw"
                  style={{ transition: 'transform .8s ease' }}
                />
                <span style={{
                  position: 'absolute', top: 28,
                  ...(reverse ? { right: 28 } : { left: 28 }),
                  background: '#b89a5a', color: 'white',
                  fontSize: '.55rem', letterSpacing: '.24em', textTransform: 'uppercase',
                  padding: '7px 14px', fontFamily: 'var(--font-raleway)',
                }}>
                  {room.capacityMin}–{room.capacityMax} pers.
                </span>
              </div>

              {/* Contenu */}
              <div style={{ background: s.bg, color: s.color, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '70px 64px', direction: 'ltr' }}>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '6rem', lineHeight: 1, opacity: .07, marginBottom: -20, color: s.color, fontWeight: 400 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p style={{ fontSize: '.58rem', letterSpacing: '.36em', textTransform: 'uppercase', color: s.gold, marginBottom: 14, fontFamily: 'var(--font-raleway)' }}>
                  {room.character}
                </p>
                <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem,3.2vw,2.8rem)', fontWeight: 400, lineHeight: 1.15, marginBottom: 14, color: s.color }}>
                  {room.name}
                </h2>
                <p style={{ fontSize: '.68rem', letterSpacing: '.2em', textTransform: 'uppercase', color: s.gold, marginBottom: 18, fontFamily: 'var(--font-raleway)' }}>
                  {room.tagline}
                </p>
                <div style={{ width: 48, height: 1, background: s.divider, margin: '4px 0 20px' }} />
                <p style={{ fontSize: '1rem', lineHeight: 1.8, opacity: .75, marginBottom: 24, fontFamily: 'var(--font-garamond)' }}>
                  {room.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                  {room.features.map((f) => (
                    <span key={f} style={{ fontSize: '.57rem', letterSpacing: '.14em', textTransform: 'uppercase', padding: '5px 12px', border: `1px solid ${s.tagBorder}`, color: s.tagColor, fontFamily: 'var(--font-raleway)' }}>
                      {f}
                    </span>
                  ))}
                </div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem', marginBottom: 28 }}>
                  {room.pricePerNight} € <span style={{ fontSize: '.7rem', fontFamily: 'var(--font-raleway)', opacity: .55 }}>/ nuit · petit-déjeuner inclus</span>
                </div>
                <Link href={`/chambres/${room.slug}`} style={{
                  display: 'inline-block', alignSelf: 'flex-start',
                  fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase',
                  background: '#b89a5a', color: 'white', padding: '13px 30px',
                  textDecoration: 'none', fontFamily: 'var(--font-raleway)',
                }}>
                  Voir la chambre →
                </Link>
              </div>
            </div>
          )
        })}

        {/* CTA */}
        <div style={{ background: '#111009', padding: '90px 52px', textAlign: 'center' }}>
          <p className="label-caps" style={{ marginBottom: 16 }}>Disponibilités</p>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'white', marginBottom: 32, fontWeight: 400 }}>
            Prêt pour votre séjour ?
          </h2>
          <Link href="/contact" className="btn-gold">Vérifier les disponibilités</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
