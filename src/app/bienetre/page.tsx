import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'

export const metadata = {
  title: "Bien-être & Nature — La Boire Bavard",
  description: "Piscine chauffée, spa, sauna finlandais et jardins. Un espace de détente au cœur de l'Anjou, à La Boire Bavard.",
}

const SAISONS = [
  { s: 'Printemps', mois: 'Avril – Juin', dispo: 'Jardin & terrasse · Piscine dès mai', ico: '🌿' },
  { s: 'Été',       mois: 'Juil – Août',  dispo: 'Piscine · Spa · Terrasse & barbecue', ico: '☀️' },
  { s: 'Automne',   mois: 'Sept – Oct',   dispo: 'Piscine jusqu\'à fin sept. · Sauna', ico: '🍂' },
  { s: 'Hiver',     mois: 'Nov – Mars',   dispo: 'Sauna & spa · Cheminées allumées', ico: '❄️' },
]

export default function BienetreePage() {
  return (
    <>
      <Nav />
      <main>

        {/* Hero */}
        <section className="relative h-[70vh] flex items-end pb-16 overflow-hidden">
          <Image
            src="/photos/chambres/potager/chambre-potager-pierre.jpg"
            alt="Piscine La Boire Bavard"
            fill priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a0e]/90 via-[#0d1a0e]/30 to-transparent" />
          <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
            <p className="label-caps mb-3">Détente & nature</p>
            <h1 className="font-serif font-normal text-white leading-none"
              style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}>
              Bien-être
            </h1>
          </div>
        </section>

        {/* Intro */}
        <section style={{ background: '#0f1a10', padding: '80px 52px' }}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="label-caps mb-4">Un espace pour se poser</p>
            <div className="gold-line mx-auto mb-8" />
            <blockquote className="font-serif italic mb-8"
              style={{ fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', lineHeight: 1.5, color: 'rgba(253,252,249,.8)' }}>
              "Ici, le temps s'arrête. La piscine, le jardin, le sauna — tout invite à ralentir."
            </blockquote>
            <p className="font-sans text-[1.05rem] leading-[1.85]" style={{ color: 'rgba(255,255,255,.5)' }}>
              La Boire Bavard n'est pas seulement un endroit où dormir. C'est un espace où se ressourcer —
              entre baignades dans la piscine chauffée, sessions de sauna et promenades dans le jardin centenaire.
            </p>
          </div>
        </section>

        {/* Piscine */}
        <div className="grid md:grid-cols-2 min-h-[70vh]">
          <div className="relative min-h-[50vw] md:min-h-0 overflow-hidden">
            <Image src="/photos/chambres/jardin/chambre-jardin-combles.jpg" alt="Piscine chauffée" fill className="object-cover" sizes="50vw" />
          </div>
          <div style={{ background: '#141f15' }} className="flex flex-col justify-center px-12 py-20 md:px-16">
            <p className="label-caps mb-5">Mai – Septembre</p>
            <h2 className="font-serif font-normal text-white leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}>
              La piscine chauffée
            </h2>
            <div className="gold-line mb-8" />
            <p className="font-sans text-white/60 text-[1.05rem] leading-[1.85] mb-5">
              Chauffée à 28°C, la piscine est accessible en accès libre aux hôtes. Elle donne directement
              sur la terrasse en tuffeau et le jardin arboré — un cadre de carte postale.
            </p>
            <p className="font-sans text-white/60 text-[1.05rem] leading-[1.85] mb-10">
              Transats, parasols et douche extérieure sont mis à disposition. Ouverture selon la météo
              de mai à fin septembre.
            </p>
            <div className="flex flex-wrap gap-4">
              <div style={{ background: 'rgba(255,255,255,.07)', padding: '16px 24px', textAlign: 'center' }}>
                <div className="font-serif text-gold text-2xl">28°C</div>
                <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/40 mt-1">température</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,.07)', padding: '16px 24px', textAlign: 'center' }}>
                <div className="font-serif text-gold text-2xl">Libre</div>
                <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/40 mt-1">accès hôtes</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,.07)', padding: '16px 24px', textAlign: 'center' }}>
                <div className="font-serif text-gold text-2xl">Mai–Sept</div>
                <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/40 mt-1">ouverture</div>
              </div>
            </div>
          </div>
        </div>

        {/* Spa / Sauna */}
        <div className="grid md:grid-cols-2 min-h-[70vh]">
          <div style={{ background: '#0d1a0d' }} className="flex flex-col justify-center px-12 py-20 md:px-16 order-2 md:order-1">
            <p className="label-caps mb-5">Toute l'année</p>
            <h2 className="font-serif font-normal text-white leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}>
              Spa & sauna finlandais
            </h2>
            <div className="gold-line mb-8" />
            <p className="font-sans text-white/60 text-[1.05rem] leading-[1.85] mb-5">
              Le spa privatif et le sauna finlandais sont disponibles sur réservation, inclus dans votre séjour.
              Idéal en arrière-saison, après une journée de vélo sur les bords de Loire ou de visite des châteaux.
            </p>
            <p className="font-sans text-white/60 text-[1.05rem] leading-[1.85] mb-10">
              Pensez à réserver votre créneau auprès de Sandrine — en général 1h à 1h30 par session.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Sauna finlandais', 'Spa privatif', 'Sur réservation', 'Inclus dans le séjour'].map(tag => (
                <span key={tag}
                  style={{ border: '1px solid rgba(196,160,80,.25)', padding: '6px 14px' }}
                  className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-white/55">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="relative min-h-[50vw] md:min-h-0 overflow-hidden order-1 md:order-2">
            <Image src="/photos/exterieur/propriete-jacuzzi-terrasse.jpg" alt="Spa et sauna" fill className="object-cover" sizes="50vw" />
          </div>
        </div>

        {/* Jardin & nature */}
        <section style={{ background: '#0f1a10', padding: '80px 52px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="label-caps mb-3">1 hectare</p>
              <h2 className="font-serif font-normal"
                style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}>
                Le jardin & la nature
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { ico: '🌳', titre: 'Parc arboré', desc: 'Cèdres centenaires, tilleuls et chênes. Un parc à l\'ancienne qui donne son caractère à la propriété.' },
                { ico: '🥕', titre: 'Potager clos',  desc: 'Le jardin potager historique alimenté les petits-déjeuners en été. Vous pouvez vous y promener librement.' },
                { ico: '🦋', titre: 'Nature & silence', desc: 'Pas de voisins immédiats. Le seul bruit est celui des oiseaux. Un vrai luxe à 25 minutes d\'Angers.' },
              ].map(item => (
                <div key={item.titre}
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.12)', padding: '2rem' }}>
                  <span className="text-2xl block mb-4">{item.ico}</span>
                  <h3 className="font-serif font-normal text-lg mb-3" style={{ color: 'rgba(253,252,249,.9)' }}>{item.titre}</h3>
                  <p className="font-sans text-[0.9rem] leading-[1.7]" style={{ color: 'rgba(255,255,255,.45)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Saisons */}
        <section style={{ background: '#0a1209', padding: '80px 52px' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="label-caps mb-3">Disponibilités</p>
              <h2 className="font-serif font-normal"
                style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}>
                Selon les saisons
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {SAISONS.map(s => (
                <div key={s.s}
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.12)', padding: '1.8rem 1.5rem' }}>
                  <div className="text-3xl mb-4">{s.ico}</div>
                  <div className="font-serif text-gold text-xl mb-1">{s.s}</div>
                  <div className="font-sans text-[0.58rem] tracking-[0.16em] uppercase text-white/35 mb-5">{s.mois}</div>
                  <p className="font-sans text-[0.82rem] leading-[1.65]" style={{ color: 'rgba(255,255,255,.5)' }}>{s.dispo}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#0f1a10', padding: '80px 52px', textAlign: 'center' }}>
          <p className="label-caps mb-4">Tout inclus dans votre séjour</p>
          <h2 className="font-serif font-normal mb-4"
            style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}>
            Piscine · Spa · Sauna · Jardin
          </h2>
          <p className="font-sans text-white/45 mb-10 text-[1rem]">88 €/nuit · Petit-déjeuner inclus · Accès libre aux espaces bien-être</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/chambres" className="btn-gold">Choisir une chambre</Link>
            <Link href="/contact" className="btn-ghost">Nous contacter</Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
