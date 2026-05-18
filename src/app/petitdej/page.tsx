import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'

export const metadata = {
  title: "Petit-Déjeuner & Snacking — La Boire Bavard",
  description: "Un petit-déjeuner gourmand préparé chaque matin avec des produits frais, locaux et de saison. Planche du soir sur réservation à 18 €.",
}

const PRODUCTS = [
  { icon: '✦', name: 'Viennoiseries & pains du jour',  desc: 'Cuits chaque matin, croustillants à souhait' },
  { icon: '✿', name: 'Confitures artisanales',         desc: 'Recettes maison, fruits du jardin et du marché' },
  { icon: '◉', name: 'Yaourts maison',                  desc: 'Préparés sur place, doux et onctueux' },
  { icon: '❧', name: 'Fruits de saison & jus frais',   desc: 'Fruits du potager ou du marché, jus pressé maison' },
  { icon: '◇', name: 'Boissons chaudes',                desc: 'Café, thé, chocolat chaud · à votre rythme' },
  { icon: '◈', name: 'Sur demande, charcuteries & fromages', desc: 'Pour les amateurs de saveurs salées' },
]

const PLANCHE = [
  'Saucisson sec',
  'Chiffonade de chorizo',
  'Rillette de thon maison',
  'Fromages affinés du Maine-et-Loire',
  'Spécialité du jour de Sandrine',
  'Pain frais & condiments',
]

const BOISSONS = [
  { cat: 'Sans alcool',  items: ['Coca-Cola', 'Coca Zero', 'Sprite', 'Perrier', 'Jus de fruits', 'Sirops à l\'eau'] },
  { cat: 'Bières',       items: ['La Piautre — bière locale de l\'Anjou (blonde / ambrée)'] },
  { cat: 'Vins de Loire',items: ['Vin blanc de Savennières', 'Rosé d\'Anjou', 'Rouge du Layon', 'Verre · pichet · bouteille'] },
]

export default function PetitDejPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative h-[60vh] flex items-end pb-16 overflow-hidden">
          <Image
            src="/photos/petitdej/salle-petitdej-01.jpeg"
            alt="Petit-déjeuner La Boire Bavard"
            fill priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/25 to-transparent" />
          <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
            <p className="label-caps mb-3">Le matin · le soir</p>
            <h1 className="font-serif font-normal text-white leading-none"
              style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}
            >
              Petit-déjeuner<br />
              <em className="italic text-white/55" style={{ fontSize: '0.7em' }}>& planche du soir</em>
            </h1>
          </div>
        </section>

        {/* Intro — petit-déjeuner */}
        <section style={{ background: '#1a150a', padding: '80px 52px' }}>
          <div className="max-w-3xl mx-auto">
            <p className="label-caps mb-4 text-center">Inclus dans chaque nuit</p>
            <div className="gold-line mx-auto mb-10" />
            <p className="font-body text-[1.08rem] leading-[1.95] mb-6" style={{ color: 'rgba(255,255,255,.75)' }}>
              Chaque matin, nous vous invitons à partager un moment de douceur et de convivialité autour d'un petit-déjeuner servi dans notre grande cuisine familiale ou, aux beaux jours, sous la pergola, à l'ombre du mûrier, avec vue sur le jardin et la piscine.
            </p>
            <p className="font-body text-[1.05rem] leading-[1.9] mb-6" style={{ color: 'rgba(255,255,255,.6)' }}>
              Notre cuisine, chaleureuse et authentique, allie le charme des pierres apparentes, des tommettes anciennes et des matériaux traditionnels. Lumineuse et accueillante, elle offre un cadre paisible où l'on se sent immédiatement comme à la maison.
            </p>
            <p className="font-body text-[1.05rem] leading-[1.9]" style={{ color: 'rgba(255,255,255,.6)' }}>
              Respectueux des traditions françaises, notre petit-déjeuner est préparé avec des produits frais, locaux et de saison, soigneusement sélectionnés auprès de producteurs de la région — pour garantir qualité et authenticité.
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
                Un réveil tout en gourmandise
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

        {/* Cuisine familiale */}
        <div className="grid md:grid-cols-2 min-h-[55vh]">
          <div className="relative min-h-[50vw] md:min-h-0 overflow-hidden">
            <Image src="/photos/petitdej/cuisine-01.jpeg" alt="Cuisine familiale" fill className="object-cover" sizes="50vw" />
          </div>
          <div style={{ background: '#1a150a' }} className="flex flex-col justify-center px-12 py-16 md:px-16">
            <p className="label-caps mb-5">La grande cuisine</p>
            <h2 className="font-serif font-normal text-cream leading-tight mb-6"
              style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)' }}
            >
              Cuisine familiale<br />
              <em className="italic text-white/55" style={{ fontSize: '0.85em' }}>au cœur de la maison</em>
            </h2>
            <div className="gold-line mb-6" />
            <p className="font-body text-white/65 text-[1rem] leading-[1.85]">
              Une cuisine spacieuse, lumineuse, équipée d'un piano de cuisson — c'est ici que Sandrine prépare chaque matin pains, viennoiseries et confitures maison. Et c'est ici qu'on partage le petit-déjeuner aux beaux jours comme en hiver.
            </p>
          </div>
        </div>

        {/* Planche du soir */}
        <div className="grid md:grid-cols-2 min-h-[60vh]">
          <div className="relative min-h-[50vw] md:min-h-0 overflow-hidden">
            <Image
              src="/photos/petitdej/petitdej-table-01.jpeg"
              alt="Planche du soir"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div className="bg-forest flex flex-col justify-center px-12 py-20 md:px-16">
            <p className="label-caps mb-5">Le soir · sur réservation</p>
            <h2 className="font-serif font-normal text-cream leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}
            >
              La planche du soir
            </h2>
            <div className="gold-line mb-8" />
            <p className="font-body text-white/70 text-[1.05rem] leading-[1.9] mb-5">
              Pour ceux qui souhaitent prolonger la soirée en douceur, nous proposons une planche gourmande à partager — toute faite maison, avec des produits locaux, frais et de saison.
            </p>
            <p className="font-body text-white/55 text-[0.95rem] leading-[1.85] mb-6">
              <strong className="text-white/75">Au menu :</strong>
            </p>
            <ul className="mb-8 space-y-2">
              {PLANCHE.map((item) => (
                <li key={item} className="font-body text-white/65 text-[0.95rem] flex items-start gap-3">
                  <span className="text-gold mt-1 text-[0.7rem]">✦</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-white/10 px-6 py-4 text-center">
                <div className="font-serif text-gold text-2xl">18 €</div>
                <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/45 mt-1">avec un verre</div>
              </div>
              <div className="bg-white/10 px-6 py-4 text-center">
                <div className="font-serif text-gold text-2xl">Sur résa</div>
                <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/45 mt-1">prévenir Sandrine</div>
              </div>
            </div>
            <Link href="/contact" className="btn-ghost self-start">
              Réserver une planche
            </Link>
          </div>
        </div>

        {/* Carte boissons */}
        <section style={{ background: '#0f0d09', padding: '80px 52px' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="label-caps mb-3">À déguster</p>
              <h2 className="font-serif font-normal"
                style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}
              >
                Carte des boissons
              </h2>
              <p className="font-body mt-4 text-[0.95rem]" style={{ color: 'rgba(255,255,255,.4)' }}>
                Disponibles le soir, à régler sur place
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {BOISSONS.map((b) => (
                <div key={b.cat} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.15)', padding: '2rem' }}>
                  <h3 className="font-serif text-gold text-lg mb-4 font-normal">{b.cat}</h3>
                  <ul className="space-y-2">
                    {b.items.map((it) => (
                      <li key={it} className="font-body text-[0.92rem] leading-[1.7]" style={{ color: 'rgba(255,255,255,.6)' }}>
                        <span className="text-gold mr-2">·</span>{it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#141209', padding: '80px 52px', textAlign: 'center' }}>
          <p className="label-caps mb-4">Inclus dans votre séjour</p>
          <h2 className="font-serif font-normal mb-8"
            style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}
          >
            90 € la nuit, petit-déjeuner inclus
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
