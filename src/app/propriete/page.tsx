import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'

export const metadata = {
  title: "La Propriété — La Boire Bavard",
  description: "Découvrez la longère angevine de La Boire Bavard : piscine chauffée, spa, jardin, vignoble et val de Loire.",
}

const FEATURES = [
  { icon: '≋', title: 'Piscine chauffée', desc: 'Profitez de la piscine chauffée ouverte de mai à octobre, entourée d\'un jardin préservé.' },
  { icon: '∿', title: 'Spa & balnéo', desc: 'Jacuzzi privatisable sur demande — un moment de détente absolue après une journée de découvertes.' },
  { icon: '❧', title: 'Jardin & potager', desc: 'Un jardin généreux avec potager, verger et herbes aromatiques cueillis le matin pour votre petit-déjeuner.' },
  { icon: '✦', title: 'Vue Loire & vignoble', desc: 'La propriété est nichée entre la vallée de la Loire et les vignes de l\'Anjou, offrant des panoramas exceptionnels.' },
  { icon: '◇', title: 'Table d\'hôtes', desc: 'Le vendredi soir, Sandrine propose une table d\'hôtes à 25 €/pers. avec produits du jardin et vins locaux.' },
  { icon: '◉', title: 'Parkings & calme', desc: 'Parking privé, environnement rural, aucun bruit de circulation. Le calme absolu de la campagne angevine.' },
]

export default function PropriетеPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative h-[65vh] flex items-end pb-16 overflow-hidden">
          <Image
            src="/photos/photo5.jpg"
            alt="La propriété La Boire Bavard"
            fill priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/30 to-transparent" />
          <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
            <p className="label-caps mb-3">Notre domaine</p>
            <h1 className="font-serif font-normal text-white leading-none"
              style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}
            >
              La propriété
            </h1>
          </div>
        </section>

        {/* Intro split */}
        <div className="grid md:grid-cols-2 min-h-[70vh]">
          <div className="relative min-h-[50vw] md:min-h-0 overflow-hidden">
            <Image
              src="/photos/photo6.jpg"
              alt="La longère angevine"
              fill
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              sizes="50vw"
            />
          </div>
          <div className="bg-forest flex flex-col justify-center px-12 py-20 md:px-16">
            <p className="label-caps mb-5">L'histoire</p>
            <h2 className="font-serif font-normal text-cream leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}
            >
              Une longère angevine<br />
              <em className="italic text-white/55">au fil du temps</em>
            </h2>
            <div className="gold-line mb-8" />
            <p className="font-body text-white/65 text-[1.05rem] leading-[1.85] mb-5">
              La Boire Bavard est une longère angevine typique du val de Loire, entièrement
              rénovée avec soin. Sandrine a mis des années à créer ce lieu unique où
              l'authenticité du bâti ancien dialogue avec tout le confort contemporain.
            </p>
            <p className="font-body text-white/65 text-[1.05rem] leading-[1.85]">
              Le nom vient d'un petit bras de Loire qui traversait autrefois la propriété.
              <em className="italic text-white/45"> Bavard</em>, comme un ruisseau qui murmure
              et raconte des histoires.
            </p>
          </div>
        </div>

        {/* Features grid */}
        <section style={{ background: '#111009', padding: '96px 52px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="label-caps mb-3">Les atouts</p>
              <h2 className="font-serif font-normal"
                style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}
              >
                Ce qui rend ce lieu unique
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {FEATURES.map((f) => (
                <div key={f.title} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.18)', padding: '2rem' }}>
                  <span className="text-gold text-2xl block mb-4">{f.icon}</span>
                  <h3 className="font-serif font-normal text-xl mb-3" style={{ color: 'rgba(253,252,249,.9)' }}>{f.title}</h3>
                  <p className="font-body text-[0.95rem] leading-[1.8]" style={{ color: 'rgba(255,255,255,.5)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section style={{ background: '#0d110e', padding: '80px 52px' }}>
          <div className="max-w-6xl mx-auto">
            <p className="label-caps mb-3 text-center">Galerie</p>
            <h2 className="font-serif font-normal text-center mb-12"
              style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: 'rgba(253,252,249,.8)' }}
            >
              En images
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['/photos/photo1.jpg', '/photos/photo2.jpg', '/photos/photo3.jpg',
                '/photos/photo4.jpg', '/photos/photo7.jpg', '/photos/photo8.jpg'].map((src, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={src}
                    alt={`La Boire Bavard — ${i + 1}`}
                    fill
                    className="object-cover hover:scale-[1.05] transition-transform duration-500"
                    sizes="(max-width:768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="bg-forest py-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="label-caps mb-3">Situation</p>
            <h2 className="font-serif font-normal text-white mb-6"
              style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}
            >
              Entre Angers et Saumur
            </h2>
            <div className="gold-line mx-auto mb-8" />
            <div className="grid md:grid-cols-3 gap-8 mb-12 text-center">
              {[
                { val: '25 min', label: 'D\'Angers' },
                { val: '20 min', label: 'De Saumur' },
                { val: '5 min', label: 'Des vignobles' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-serif text-gold text-3xl mb-1">{s.val}</div>
                  <div className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="font-body text-white/60 text-[1rem] leading-[1.8] mb-10">
              4 chemin de la Boire Bavard — 49320 Blaison-Saint-Sulpice
            </p>
            <Link href="/contact" className="btn-gold">
              Nous contacter
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
