import Image from 'next/image'
import Link from 'next/link'

export default function IntroStrip() {
  return (
    <div className="grid md:grid-cols-2 min-h-[80vh]">
      {/* Photo */}
      <div className="relative overflow-hidden min-h-[50vh] md:min-h-full">
        <Image
          src="/photos/photo5.jpg"
          alt="La longère de la Boire Bavard"
          fill
          className="object-cover transition-transform duration-700 hover:scale-[1.03]"
          sizes="(max-width:768px) 100vw, 50vw"
        />
      </div>

      {/* Texte */}
      <div className="bg-forest flex flex-col justify-center px-4 sm:px-8 md:px-16 py-10 md:py-20 lg:px-20">
        <p className="label-caps mb-5">Notre maison</p>
        <h2 className="font-serif font-normal text-cream leading-tight mb-6"
          style={{ fontSize: 'clamp(2rem,3.5vw,3rem)' }}
        >
          Une longère angevine<br />
          <em className="italic text-white/65">au fil de la Loire</em>
        </h2>
        <div className="gold-line mb-6" />
        <p className="font-body text-white/65 text-[1.05rem] leading-[1.85] mb-4">
          Nichée entre vignoble et val de Loire, La Boire Bavard est une maison d'hôtes de caractère
          où Sandrine vous accueille avec passion. Quatre chambres d'exception, un jardin généreux,
          une piscine chauffée, un spa — tout est pensé pour votre bien-être.
        </p>
        <p className="font-body text-white/65 text-[1.05rem] leading-[1.85] mb-10">
          Le petit-déjeuner maison, préparé chaque matin avec les produits du jardin et du marché,
          est un moment à part entière.
        </p>
        <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
          {[
            { n: '9.9', l: 'Note Booking' },
            { n: '88€', l: 'La nuit' },
            { n: '4', l: 'Chambres' },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-serif text-gold text-[2.4rem] font-normal">{s.n}</div>
              <div className="font-sans text-[0.58rem] tracking-[0.22em] uppercase text-white/40 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
