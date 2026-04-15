'use client'
import { useT } from '@/context/LangContext'

const AVIS = [
  {
    fr: "Le cadre est exceptionnel, entre vallée et vignoble. La table d'hôtes du vendredi soir restera un grand souvenir.",
    en: "The setting is exceptional, between valley and vineyard. The Friday evening table d'hôtes will remain a treasured memory.",
    author: 'Laurent', city: 'Lyon', date: { fr: 'Mai 2024', en: 'May 2024' },
  },
  {
    fr: "Troisième séjour et toujours la même magie. La vue sur la Loire au lever du soleil depuis Côté Vallée — inoubliable.",
    en: "Our third stay and still the same magic. The Loire sunrise view from Côté Vallée — unforgettable.",
    author: 'Isabelle & Renaud', city: 'Nantes', date: { fr: 'Sept. 2023', en: 'Sept. 2023' },
  },
  {
    fr: "Sandrine est une hôtesse aux petits soins. Nous avons fêté nos 10 ans de mariage ici — magique et intime.",
    en: "Sandrine is an attentive host. We celebrated our 10th wedding anniversary here — magical and intimate.",
    author: 'Camille & Jérôme', city: 'Rennes', date: { fr: 'Juil. 2024', en: 'Jul. 2024' },
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
            {t('Exceptionnel · 200+ avis · Booking.com', 'Exceptional · 200+ reviews · Booking.com')}
          </p>
          <div className="flex justify-center gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="star-gold" style={{ animationDelay: `${i * 0.25}s` }}>✦</span>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {AVIS.map((a, i) => (
            <div key={i} className="bg-white p-8 border border-gold/10 relative">
              <span className="absolute top-4 left-6 font-serif text-6xl text-gold/15 leading-none select-none">"</span>
              <p className="font-body text-ink/75 leading-relaxed text-[1.02rem] pt-6 mb-6">
                {t(a.fr, a.en)}
              </p>
              <div className="border-t border-gold/15 pt-4">
                <p className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-gold font-medium">{a.author}</p>
                <p className="font-sans text-[0.6rem] tracking-widest uppercase text-stone mt-0.5">
                  {a.city} · {t(a.date.fr, a.date.en)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
