import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'
import Link from 'next/link'

export const metadata = {
  title: "Avis — La Boire Bavard",
  description: "Découvrez les avis de nos hôtes. Note 9.9/10 sur Booking.com et avis 5★ sur Google.",
}

// ⚠️ Pour ajouter un avis récent (Google ou Booking) : copiez un bloc ci-dessous,
// collez le texte EXACT, l'auteur, la date et la source ('Google' ou 'Booking.com').
const AVIS = [
  {
    text: "Très bon accueil de Sandrine et Jean-Marc. Chambre agréable et calme, petit-déjeuner copieux et savoureux. Un séjour reposant, à recommander.",
    author: 'Morgane Coupliere',
    city: '',
    date: 'Avr. 2026',
    source: 'Google',
    stars: 5,
  },
  {
    text: "Un endroit paisible au cœur de l'Anjou. La piscine et le jardin sont très agréables et l'accueil est vraiment chaleureux. On reviendra avec plaisir.",
    author: 'Hôte vérifié',
    city: '',
    date: 'Avr. 2026',
    source: 'Google',
    stars: 5,
  },
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
              Exceptionnel · Booking.com & Google
            </p>
            <div className="flex justify-center gap-2 mb-10">
              {Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-gold text-lg">✦</span>)}
            </div>
            <div className="gold-line mx-auto mb-10" />
            <div className="grid grid-cols-3 gap-8">
              {[{ val: '9.9', label: 'Note Booking' }, { val: '200+', label: 'Avis clients' }, { val: '98%', label: 'Recommandent' }].map((s) => (
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
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {AVIS.map((a, i) => (
                <div key={i} className="relative" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.14)', padding: '2.5rem 2rem' }}>
                  <span className="absolute top-4 left-6 font-serif leading-none select-none" style={{ fontSize: '4rem', color: 'rgba(196,160,80,.15)' }}>&ldquo;</span>
                  {a.source && (
                    <span className="absolute top-5 right-5 font-sans" style={{ fontSize: '.5rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(196,160,80,.7)', border: '1px solid rgba(196,160,80,.3)', borderRadius: 3, padding: '3px 8px' }}>{a.source}</span>
                  )}
                  <p className="font-body leading-relaxed pt-6 mb-6" style={{ fontSize: '1.05rem', color: 'rgba(253,252,249,.7)' }}>{a.text}</p>
                  <div style={{ borderTop: '1px solid rgba(196,160,80,.15)', paddingTop: '1rem' }}>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: a.stars }).map((_, j) => <span key={j} className="text-gold text-xs">✦</span>)}
                    </div>
                    <p className="font-sans font-medium text-gold" style={{ fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase' }}>{a.author}</p>
                    <p className="font-sans mt-0.5" style={{ fontSize: '.6rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)' }}>{a.city ? `${a.city} · ` : ''}{a.date}</p>
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
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact" className="btn-gold">Réserver votre séjour</Link>
            <a href="https://www.google.com/travel/search?q=la%20boire%20bavard&ap=ugEHcmV2aWV3cw" target="_blank" rel="noopener noreferrer" className="btn-ghost">Laisser un avis</a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
