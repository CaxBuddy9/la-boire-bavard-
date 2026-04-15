'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useT } from '@/context/LangContext'

export default function IntroStrip() {
  const t = useT()

  const stats = [
    { n: '9.9', l: t('Note Booking', 'Booking rating') },
    { n: '88€', l: t('La nuit', 'Per night') },
    { n: '4',   l: t('Chambres', 'Rooms') },
  ]

  return (
    <div className="grid md:grid-cols-2 min-h-[80vh]">
      {/* Photo */}
      <div className="relative overflow-hidden min-h-[50vh] md:min-h-full">
        <Image
          src="/photos/chambres/jardin/chambre-jardin-lit-terrasse.jpg"
          alt="Chambre Côté Jardin — lit avec vue sur le jardin"
          fill
          className="object-cover transition-transform duration-700 hover:scale-[1.03]"
          sizes="(max-width:768px) 100vw, 50vw"
        />
      </div>

      {/* Texte */}
      <div className="bg-forest flex flex-col justify-center px-4 sm:px-8 md:px-16 py-10 md:py-20 lg:px-20">
        <p className="label-caps-dark mb-5">{t('Notre maison', 'Our home')}</p>
        <h2 className="font-serif font-normal text-cream leading-tight mb-6"
          style={{ fontSize: 'clamp(2rem,3.5vw,3rem)' }}
        >
          {t('Une longère angevine', 'An Anjou farmhouse')}<br />
          <em className="italic text-white/65">{t('au fil de la Loire', 'along the Loire')}</em>
        </h2>
        <div className="gold-line mb-6" />
        <p className="font-body text-white/80 text-[1.05rem] leading-[1.85] mb-4">
          {t(
            "Nichée entre vignoble et val de Loire, La Boire Bavard est une maison d'hôtes de caractère où Sandrine vous accueille avec passion. Quatre chambres d'exception, un jardin généreux, une piscine chauffée, un spa — tout est pensé pour votre bien-être.",
            "Nestled between vineyard and Loire valley, La Boire Bavard is a characterful bed & breakfast where Sandrine welcomes you with passion. Four exceptional rooms, a generous garden, a heated pool, a spa — everything is designed for your well-being."
          )}
        </p>
        <p className="font-body text-white/80 text-[1.05rem] leading-[1.85] mb-10">
          {t(
            "Le petit-déjeuner maison, préparé chaque matin avec les produits du jardin et du marché, est un moment à part entière.",
            "The homemade breakfast, prepared each morning with produce from the garden and the market, is a moment in itself."
          )}
        </p>
        <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
          {stats.map((s) => (
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
