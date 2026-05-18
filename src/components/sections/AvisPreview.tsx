'use client'
import { useT } from '@/context/LangContext'

// ⚠️ TODO Sandrine — coller ici les textes EXACTS des 2 derniers avis Google
const AVIS = [
  {
    fr: "Accueil chaleureux, chambre magnifique et petit-déjeuner délicieux. Sandrine et Jean-Marc sont aux petits soins, séjour parfait.",
    en: "Warm welcome, beautiful room and delicious breakfast. Sandrine and Jean-Marc are wonderful hosts, a perfect stay.",
    author: 'Morgane Coupliere', city: '', date: { fr: 'Avr. 2026', en: 'Apr. 2026' },
  },
  {
    fr: "Un véritable havre de paix au cœur de l'Anjou. Piscine, jardin, calme — tout est réuni pour un moment inoubliable.",
    en: "A true haven of peace in the heart of Anjou. Pool, garden, peace — everything is set for an unforgettable moment.",
    author: 'Client récent', city: '', date: { fr: 'Avr. 2026', en: 'Apr. 2026' },
  },
]

export default function AvisPreview() {
  const t = useT()
  return (
    <section className="bg-cream py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="label-caps mb-3">{t('Ce qu\'ils en disent', 'What they say')}</p>
          <div className="font-serif text-forest" style={{ fontSize: 'clamp(3rem,5vw,4.5rem)' }}>
            9.9<span className="text-gold">/10</span>
          </div>
          <p className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-stone mt-2">
            {t('Exceptionnel · Google', 'Exceptional · Google')}
          </p>
          <div className="flex justify-center gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="star-gold" style={{ animationDelay: `${i * 0.25}s` }}>✦</span>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {AVIS.map((a, i) => (
            <div key={i} className="bg-white p-8 border border-gold/10 relative">
              <span className="absolute top-4 left-6 font-serif text-6xl text-gold/15 leading-none select-none">"</span>
              <p className="font-body text-ink/75 leading-relaxed text-[1.02rem] pt-6 mb-6">
                {t(a.fr, a.en)}
              </p>
              <div className="border-t border-gold/15 pt-4">
                <p className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-gold font-medium">{a.author}</p>
                <p className="font-sans text-[0.6rem] tracking-widest uppercase text-stone mt-0.5">
                  {a.city ? `${a.city} · ` : ''}{t(a.date.fr, a.date.en)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
