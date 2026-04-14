import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'

export const metadata = {
  title: "Petit-Déjeuner — La Boire Bavard",
  description: "Un petit-déjeuner gourmand préparé chaque matin par Sandrine avec les produits du jardin, du marché et des artisans locaux.",
}

const PRODUCTS = [
  { icon: '✦', name: 'Viennoiseries maison', desc: 'Croissants et pains au chocolat sortis du four chaque matin' },
  { icon: '✿', name: 'Confitures artisanales', desc: 'Fruits du jardin et du marché, recettes familiales' },
  { icon: '◉', name: 'Fromages du Maine-et-Loire', desc: 'Sélection de fromages locaux chez les producteurs de la région' },
  { icon: '◇', name: 'Œufs frais de la ferme', desc: 'Œufs du matin des poules d\'une ferme voisine' },
  { icon: '❧', name: 'Fruits et jus frais', desc: 'Jus pressé maison, fruits de saison du potager ou du marché' },
  { icon: '◈', name: 'Miel local', desc: 'Miel des ruches de l\'Anjou, récoltés par un apiculteur du village' },
]

export default function PetitDejPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative h-[60vh] flex items-end pb-16 overflow-hidden">
          <Image
            src="/photos/chambres/jardin/chambre-jardin-baignoire.jpg"
            alt="Petit-déjeuner La Boire Bavard"
            fill priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/25 to-transparent" />
          <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
            <p className="label-caps mb-3">Le matin</p>
            <h1 className="font-serif font-normal text-white leading-none"
              style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}
            >
              Le petit-déjeuner
            </h1>
          </div>
        </section>

        {/* Intro */}
        <section style={{ background: '#1a150a', padding: '80px 52px' }}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="label-caps mb-4">Inclus dans chaque nuit</p>
            <div className="gold-line mx-auto mb-8" />
            <blockquote className="font-serif italic mb-8"
              style={{ fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', lineHeight: 1.5, color: 'rgba(253,252,249,.8)' }}
            >
              "Le petit-déjeuner n'est pas un service, c'est un moment à part entière."
            </blockquote>
            <p className="font-body text-[1.05rem] leading-[1.85]" style={{ color: 'rgba(255,255,255,.55)' }}>
              Chaque matin, Sandrine prépare un buffet généreux avec les produits du jardin,
              du marché hebdomadaire d'Angers et des artisans de la région. C'est l'un des moments
              les plus appréciés du séjour selon nos visiteurs.
            </p>
          </div>
        </section>

        {/* Products */}
        <section style={{ background: '#111009', padding: '80px 52px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="label-caps mb-3">Au buffet</p>
              <h2 className="font-serif font-normal"
                style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}
              >
                Des produits soigneusement choisis
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {PRODUCTS.map((p) => (
                <div key={p.name} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.15)', padding: '2rem' }}>
                  <span className="text-gold text-xl block mb-4">{p.icon}</span>
                  <h3 className="font-serif font-normal text-lg mb-2" style={{ color: 'rgba(253,252,249,.9)' }}>{p.name}</h3>
                  <p className="font-body text-[0.9rem] leading-[1.7]" style={{ color: 'rgba(255,255,255,.48)' }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Table d'hôtes */}
        <div className="grid md:grid-cols-2 min-h-[60vh]">
          <div className="relative min-h-[50vw] md:min-h-0 overflow-hidden">
            <Image
              src="/photos/exterieur/maison-facade-piscine.jpg"
              alt="Table d'hôtes"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div className="bg-forest flex flex-col justify-center px-12 py-20 md:px-16">
            <p className="label-caps mb-5">Le vendredi soir</p>
            <h2 className="font-serif font-normal text-cream leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}
            >
              La table d'hôtes
            </h2>
            <div className="gold-line mb-8" />
            <p className="font-body text-white/65 text-[1.05rem] leading-[1.85] mb-5">
              Le vendredi soir, Sandrine ouvre sa table pour un dîner convivial en commun.
              Un menu unique à 25 €/pers. composé de produits locaux et de saison, accompagné
              des vins du vignoble voisin.
            </p>
            <p className="font-body text-white/65 text-[1.05rem] leading-[1.85] mb-10">
              Sur réservation uniquement — pensez à prévenir à l'avance pour vous garantir une place.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 px-6 py-4 text-center">
                <div className="font-serif text-gold text-2xl">25 €</div>
                <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/45 mt-1">par personne</div>
              </div>
              <div className="bg-white/10 px-6 py-4 text-center">
                <div className="font-serif text-gold text-2xl">Vendredi</div>
                <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/45 mt-1">sur réservation</div>
              </div>
            </div>
            <Link href="/contact" className="btn-ghost self-start mt-10">
              Réserver la table d'hôtes
            </Link>
          </div>
        </div>

        {/* CTA */}
        <section style={{ background: '#141209', padding: '80px 52px', textAlign: 'center' }}>
          <p className="label-caps mb-4">Inclus dans votre séjour</p>
          <h2 className="font-serif font-normal mb-8"
            style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}
          >
            88 € la nuit, petit-déjeuner inclus
          </h2>
          <Link href="/chambres" className="btn-gold">
            Choisir une chambre
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
