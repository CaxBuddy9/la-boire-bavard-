import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'

export const metadata = {
  title: "Le séjour — Petit-déjeuner, piscine & bien-être — La Boire Bavard",
  description: "Une journée à La Boire Bavard : petit-déjeuner gourmand fait avec des produits locaux, piscine en saison (mai–sept, 9h–22h), pergola sous le mûrier, planche du soir sur réservation.",
}

const PRODUCTS = [
  { icon: '✦', name: 'Viennoiseries & pains du jour',  desc: 'Cuits chaque matin, croustillants à souhait' },
  { icon: '✿', name: 'Les Délices de Flo',             desc: 'Confitures artisanales cuites au chaudron à Montreuil-Bellay, à base de fruits du Val de Loire' },
  { icon: '◉', name: 'Yaourts maison',                  desc: 'Préparés sur place, doux et onctueux' },
  { icon: '❧', name: 'Fruits de saison & jus',          desc: 'Fruits & légumes du Petit Jardin à Brissac · orange pressée maison, pomme artisanale' },
  { icon: '◇', name: 'Boissons chaudes',                desc: 'Café, thé, chocolat chaud' },
]

const PLANCHE = [
  'Saucisson sec',
  'Chiffonade de chorizo',
  'Fromages affinés du Maine-et-Loire',
  'Spécialité du jour de Sandrine',
  'Pain frais & condiments',
]

const BOISSONS = [
  { cat: 'Sans alcool',   items: ['Coca-Cola', 'Coca Zero', 'Sprite', 'Perrier', 'Jus de fruits', 'Sirops à l\'eau'] },
  { cat: 'Bières',        items: ['La Piautre — bière locale de l\'Anjou (blonde / ambrée)'] },
  { cat: 'Vins de Loire', items: ['Vin blanc de Savennières', 'Rosé d\'Anjou', 'Rouge du Layon', 'Verre · pichet · bouteille'] },
]

const SAISONS = [
  { s: 'Printemps', mois: 'Avril – Juin', dispo: 'Jardin & terrasse · Piscine dès mai',          ico: '🌿' },
  { s: 'Été',       mois: 'Juil – Août',  dispo: 'Piscine 9h–22h · Pergola sous le mûrier',       ico: '☀️' },
  { s: 'Automne',   mois: 'Sept – Oct',   dispo: 'Piscine jusqu\'à fin sept. · Couleurs d\'automne', ico: '🍂' },
  { s: 'Hiver',     mois: 'Nov – Mars',   dispo: 'Cocon au chaud · Lecture · Jardin endormi',      ico: '❄️' },
]

export default function SejourPage() {
  return (
    <>
      <Nav />
      <main>

        {/* Hero */}
        <section className="relative h-[70vh] flex items-end pb-16 overflow-hidden">
          <Image
            src="/photos/exterieur/maison-exterieure-piscine.jpg"
            alt="La Boire Bavard — piscine, jardin, art de vivre"
            fill priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a0e]/90 via-[#0d1a0e]/30 to-transparent" />
          <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
            <p className="label-caps mb-3">L'art de vivre · Anjou</p>
            <h1 className="font-serif font-normal text-white leading-none"
              style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}>
              Le séjour
            </h1>
            <p className="font-sans text-[0.7rem] tracking-[0.25em] uppercase text-gold/80 mt-4">
              Petit-déjeuner · Piscine · Pergola · Planche du soir
            </p>
          </div>
        </section>

        {/* Intro : une journée chez nous */}
        <section style={{ background: '#0f1a10', padding: '80px 32px' }}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="label-caps mb-4">Une journée à La Boire Bavard</p>
            <div className="gold-line mx-auto mb-8" />
            <blockquote className="font-serif italic mb-8"
              style={{ fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', lineHeight: 1.5, color: 'rgba(253,252,249,.8)' }}>
              « Ici, le temps s'arrête. Le matin sent le pain chaud, l'après-midi sent l'eau de la piscine, et le soir on partage une planche sous la pergola. »
            </blockquote>
            <p className="font-sans text-[1.05rem] leading-[1.85]" style={{ color: 'rgba(255,255,255,.55)' }}>
              Inclus dans chaque nuit : le petit-déjeuner gourmand chaque matin et l'accès libre à la piscine en saison et au jardin.
              Accueil chaleureux et séjour reposant. Et le soir, en option sur réservation, Sandrine vous prépare une planche pour prolonger la soirée.
            </p>
          </div>
        </section>

        {/* ═══════════════ LE MATIN ═══════════════ */}
        <section style={{ background: '#1a150a', padding: '90px 32px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="label-caps mb-3">Le matin · 8h – 10h</p>
              <h2 className="font-serif font-normal"
                style={{ fontSize: 'clamp(2rem,3.8vw,3rem)', color: 'rgba(253,252,249,.9)' }}>
                Le petit-déjeuner gourmand
              </h2>
              <p className="font-body mt-5 max-w-2xl mx-auto text-[1.05rem] leading-[1.85]" style={{ color: 'rgba(255,255,255,.6)' }}>
                Chaque matin, nous vous invitons à partager un moment de douceur et de convivialité autour d'un petit-déjeuner servi dans notre grande cuisine familiale ou, aux beaux jours, sous la pergola à l'ombre du mûrier, avec vue sur le jardin et la piscine.
              </p>
              <p className="font-body mt-4 max-w-2xl mx-auto text-[1.05rem] leading-[1.85]" style={{ color: 'rgba(255,255,255,.6)' }}>
                Respectueux des traditions françaises, il est préparé avec des produits frais, locaux et de saison, soigneusement sélectionnés auprès de producteurs de la région.
              </p>
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
            <p className="font-body text-center max-w-2xl mx-auto mt-12 text-[0.98rem] leading-[1.85]" style={{ color: 'rgba(255,255,255,.5)' }}>
              Pour les amateurs de saveurs salées, une sélection de charcuteries et de fromages est proposée sur demande.
            </p>
            <p className="font-serif italic text-center mt-4 text-gold/70 text-[1.1rem]">
              Un réveil tout en gourmandise et simplicité.
            </p>
          </div>
        </section>

        {/* Cuisine familiale */}
        <div className="grid md:grid-cols-2 min-h-[55vh]">
          <div className="relative min-h-[50vw] md:min-h-0 overflow-hidden">
            <Image src="/photos/petitdej/cuisine-01.jpeg" alt="Cuisine familiale" fill className="object-cover" sizes="50vw" />
          </div>
          <div style={{ background: '#1a150a' }} className="flex flex-col justify-center px-8 py-16 md:px-16">
            <p className="label-caps mb-5">La grande cuisine</p>
            <h2 className="font-serif font-normal text-cream leading-tight mb-6"
              style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)' }}>
              Cuisine familiale<br />
              <em className="italic text-white/55" style={{ fontSize: '0.85em' }}>au cœur de la maison</em>
            </h2>
            <div className="gold-line mb-6" />
            <p className="font-body text-white/65 text-[1rem] leading-[1.85]">
              Notre cuisine, chaleureuse et authentique, allie le charme des pierres apparentes, des tomettes anciennes et des matériaux traditionnels. Lumineuse et accueillante, elle offre un cadre paisible où l'on se sent immédiatement comme à la maison — c'est ici que Sandrine prépare chaque matin pains et viennoiseries.
            </p>
          </div>
        </div>

        {/* ═══════════════ LE JOUR ═══════════════ */}
        <div className="grid md:grid-cols-2 min-h-[70vh]">
          <div className="relative min-h-[50vw] md:min-h-0 overflow-hidden">
            <Image src="/photos/exterieur/maison-exterieure-piscine.jpg" alt="Piscine et jardin" fill className="object-cover" sizes="50vw" />
          </div>
          <div style={{ background: '#141f15' }} className="flex flex-col justify-center px-8 py-20 md:px-16">
            <p className="label-caps mb-5">Le jour · 9h – 22h · Mai – Sept</p>
            <h2 className="font-serif font-normal text-white leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}>
              La piscine
            </h2>
            <div className="gold-line mb-8" />
            <p className="font-sans text-white/60 text-[1.05rem] leading-[1.85] mb-5">
              La piscine est accessible en accès libre aux hôtes de 9h à 22h. Elle donne directement
              sur la terrasse en pierre de Solnhofen et le jardin — un cadre de carte postale.
            </p>
            <p className="font-sans text-white/60 text-[1.05rem] leading-[1.85] mb-5">
              Transats et parasols sont mis à disposition. Ouverture selon la météo, de mai à fin septembre.
            </p>
            <p className="font-sans text-white/45 text-[0.9rem] italic leading-[1.7] mb-8">
              Piscine sécurisée mais non surveillée — la baignade s'effectue sous la responsabilité des hôtes.
              Les enfants doivent être accompagnés d'un adulte.
            </p>
            <div className="flex flex-wrap gap-4">
              <div style={{ background: 'rgba(255,255,255,.07)', padding: '14px 22px', textAlign: 'center' }}>
                <div className="font-serif text-gold text-2xl">Plein air</div>
                <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/40 mt-1">jardin & terrasse</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,.07)', padding: '14px 22px', textAlign: 'center' }}>
                <div className="font-serif text-gold text-2xl">9h–22h</div>
                <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/40 mt-1">accès libre</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,.07)', padding: '14px 22px', textAlign: 'center' }}>
                <div className="font-serif text-gold text-2xl">Mai–Sept</div>
                <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/40 mt-1">ouverture</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pergola sous le mûrier */}
        <div className="grid md:grid-cols-2 min-h-[60vh]">
          <div style={{ background: '#0d1a0d' }} className="flex flex-col justify-center px-8 py-20 md:px-16 order-2 md:order-1">
            <p className="label-caps mb-5">Aux beaux jours</p>
            <h2 className="font-serif font-normal text-white leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}>
              La pergola sous le mûrier
            </h2>
            <div className="gold-line mb-8" />
            <p className="font-sans text-white/60 text-[1.05rem] leading-[1.85] mb-5">
              À l'ombre du mûrier, la pergola est l'un de nos endroits favoris : on y prend le petit-déjeuner aux beaux jours
              et on y lit tranquillement à l'abri du soleil.
            </p>
            <p className="font-sans text-white/60 text-[1.05rem] leading-[1.85] mb-8">
              Vue sur le jardin et la piscine, ambiance douce et lumière filtrée — un moment hors du temps.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Pergola ombragée', 'À l\'ombre du mûrier', 'Petit-déj aux beaux jours', 'Lecture au calme'].map(tag => (
                <span key={tag}
                  style={{ border: '1px solid rgba(196,160,80,.25)', padding: '6px 14px' }}
                  className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-white/55">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="relative min-h-[50vw] md:min-h-0 overflow-hidden order-1 md:order-2">
            <Image src="/photos/exterieur/terrasse-pierre-01.jpeg" alt="Terrasse en pierre et jardin" fill className="object-cover" sizes="50vw" />
          </div>
        </div>

        {/* Jardin & nature */}
        <section style={{ background: '#0f1a10', padding: '80px 32px' }}>
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
                { ico: '🌳', titre: 'Jardin arboré',     desc: 'Un jardin arboré et paysagé, avec des espaces ombragés naturels à proximité immédiate de la piscine.' },
                { ico: '🦋', titre: 'Nature & calme',    desc: 'Un cadre calme et verdoyant, à 25 minutes d\'Angers, où l\'on entend surtout les oiseaux.' },
                { ico: '🚲', titre: 'Balades & vélo',    desc: 'De nombreux sentiers et circuits à vélo au départ de la maison, vers les coteaux viticoles et les bords de Loire.' },
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

        {/* ═══════════════ LE SOIR ═══════════════ */}
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
          <div className="bg-forest flex flex-col justify-center px-8 py-20 md:px-16">
            <p className="label-caps mb-5">Le soir · sur réservation</p>
            <h2 className="font-serif font-normal text-cream leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}>
              La planche du soir
            </h2>
            <div className="gold-line mb-8" />
            <p className="font-body text-white/70 text-[1.05rem] leading-[1.9] mb-5">
              Pour ceux qui souhaitent prolonger la soirée en douceur, nous proposons une planche gourmande à partager — préparée avec des produits locaux et de saison, issus de fournisseurs que nous connaissons et apprécions.
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
                <div className="font-serif text-gold text-2xl">24 €</div>
                <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/45 mt-1">pour 2 · 1 verre chacun</div>
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
        <section style={{ background: '#0f0d09', padding: '80px 32px' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="label-caps mb-3">À déguster</p>
              <h2 className="font-serif font-normal"
                style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}>
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

        {/* Saisons */}
        <section style={{ background: '#0a1209', padding: '80px 32px' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="label-caps mb-3">Quand venir ?</p>
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
        <section style={{ background: '#0f1a10', padding: '90px 32px', textAlign: 'center' }}>
          <p className="label-caps mb-4">Inclus dans votre séjour</p>
          <h2 className="font-serif font-normal mb-4"
            style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.9)' }}>
            90 €/nuit · Petit-déjeuner inclus
          </h2>
          <p className="font-sans text-white/45 mb-10 text-[1rem]">
            Piscine · Pergola · Jardin · Planche du soir en option
          </p>
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
