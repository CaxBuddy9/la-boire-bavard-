import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'
import Link from 'next/link'

export const metadata = {
  title: "Avis — La Boire Bavard",
  description: "Découvrez les avis de nos hôtes. Note 9.9/10 sur Booking.com — Exceptionnel · 200+ avis.",
}

const AVIS = [
  { text: "Le cadre est exceptionnel, entre vallée et vignoble. La table d'hôtes du vendredi soir restera un grand souvenir. Sandrine est une hôtesse hors pair.", author: 'Laurent', city: 'Lyon', date: 'Mai 2024', stars: 5 },
  { text: "Troisième séjour et toujours la même magie. La vue sur la Loire au lever du soleil depuis Côté Vallée — inoubliable. On revient chaque année.", author: 'Isabelle & Renaud', city: 'Nantes', date: 'Sept. 2023', stars: 5 },
  { text: "Sandrine est une hôtesse aux petits soins. Nous avons fêté nos 10 ans de mariage ici — magique et intime. La chambre Côté Cèdre est un bijou.", author: 'Camille & Jérôme', city: 'Rennes', date: 'Juil. 2024', stars: 5 },
  { text: "Le petit-déjeuner est un festin. Confitures maison, viennoiseries fraîches, fromages locaux... On ne voulait plus partir ! Merci Sandrine.", author: 'Marie & Thomas', city: 'Paris', date: 'Juin 2024', stars: 5 },
  { text: "Un endroit hors du temps. La piscine chauffée, le spa, le jardin... tout est parfait. Idéal pour se ressourcer loin du bruit de la ville.", author: 'Sophie', city: 'Bordeaux', date: 'Août 2024', stars: 5 },
  { text: "Nous sommes venus pour le golf d'Angers, nous sommes repartis avec l'envie de tout quitter pour vivre ici. Quelle adresse !", author: 'Philippe & Christine', city: 'Strasbourg', date: 'Avr. 2024', stars: 5 },
  { text: "La chambre Côté Jardin a accueilli notre petite famille avec chaleur. Les enfants ont adoré le jardin. Le calme absolu — introuvable ailleurs.", author: 'Famille Bertrand', city: 'Toulouse', date: 'Juil. 2024', stars: 5 },
  { text: "Un lieu rare où le temps s'arrête. Sandrine a créé quelque chose d'exceptionnel — entre maison de famille et havre de paix.", author: 'Claire & Antoine', city: 'Lyon', date: 'Mai 2023', stars: 5 },
  { text: "Le vélo le long de la Loire, le retour à la maison d'hôtes... C'est le séjour parfait en Anjou. Tout était impeccable.", author: 'Michel & Françoise', city: 'Poitiers', date: 'Sept. 2024', stars: 5 },
]

export default function AvisPage() {
  return (
    <>
      <Nav />
      <main>

        {/* Hero score */}
        <section className="bg-forest py-28 px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(ellipse_at_50%_0%,#c9a96e_0%,transparent_65%)]" />
          <div className="relative max-w-3xl mx-auto">
            <p className="label-caps mb-6">Ils nous font confiance</p>
            <div className="font-serif text-white mb-2" style={{ fontSize: 'clamp(5rem,10vw,8rem)', lineHeight: 1 }}>
              9.9<span className="text-gold">/10</span>
            </div>
            <p className="font-sans text-[0.65rem] tracking-[0.3em] uppercase text-white/40 mb-6">
              Exceptionnel · 200+ avis · Booking.com
            </p>
            <div className="flex justify-center gap-2 mb-10">
              {Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-gold text-lg">✦</span>)}
            </div>
            <div className="gold-line mx-auto mb-10" />
            <div className="grid grid-cols-3 gap-8">
              {[{ val: '9.9', label: 'Note globale' }, { val: '200+', label: 'Avis clients' }, { val: '98%', label: 'Recommandent' }].map((s) => (
                <div key={s.label}>
                  <div className="font-serif text-gold text-3xl">{s.val}</div>
                  <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/35 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Avis grid */}
        <section style={{ background: '#0f0f0d', padding: '96px 52px' }}>
          <div className="max-w-6xl mx-auto">
            <p className="label-caps mb-3 text-center">Témoignages</p>
            <h2 className="font-serif font-normal text-center mb-16" style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}>
              Ce qu&apos;ils en disent
            </h2>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {AVIS.map((a, i) => (
                <div key={i} className="break-inside-avoid relative" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.14)', padding: '2rem' }}>
                  <span className="absolute top-4 left-6 font-serif leading-none select-none" style={{ fontSize: '4rem', color: 'rgba(196,160,80,.15)' }}>&ldquo;</span>
                  <p className="font-body leading-relaxed pt-6 mb-6" style={{ fontSize: '1rem', color: 'rgba(253,252,249,.65)' }}>{a.text}</p>
                  <div style={{ borderTop: '1px solid rgba(196,160,80,.15)', paddingTop: '1rem' }}>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: a.stars }).map((_, j) => <span key={j} className="text-gold text-xs">✦</span>)}
                    </div>
                    <p className="font-sans font-medium text-gold" style={{ fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase' }}>{a.author}</p>
                    <p className="font-sans mt-0.5" style={{ fontSize: '.6rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)' }}>{a.city} · {a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#141209', padding: '80px 52px', textAlign: 'center' }}>
          <p className="label-caps mb-4">Votre séjour vous attend</p>
          <h2 className="font-serif font-normal mb-8" style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}>
            Rejoignez nos hôtes satisfaits
          </h2>
          <Link href="/contact" className="btn-gold">Réserver votre séjour</Link>
        </section>

      </main>
      <Footer />
    </>
  )
}
