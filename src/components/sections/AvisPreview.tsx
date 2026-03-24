const AVIS = [
  {
    text: "Le cadre est exceptionnel, entre vallée et vignoble. La table d'hôtes du vendredi soir restera un grand souvenir.",
    author: 'Laurent',
    city: 'Lyon',
    date: 'Mai 2024',
  },
  {
    text: "Troisième séjour et toujours la même magie. La vue sur la Loire au lever du soleil depuis Côté Vallée — inoubliable.",
    author: 'Isabelle & Renaud',
    city: 'Nantes',
    date: 'Sept. 2023',
  },
  {
    text: "Sandrine est une hôtesse aux petits soins. Nous avons fêté nos 10 ans de mariage ici — magique et intime.",
    author: 'Camille & Jérôme',
    city: 'Rennes',
    date: 'Juil. 2024',
  },
]

export default function AvisPreview() {
  return (
    <section className="bg-cream py-24 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Score */}
        <div className="text-center mb-16">
          <p className="label-caps mb-3">Ce qu'ils en disent</p>
          <div className="font-serif text-forest" style={{ fontSize: 'clamp(3rem,5vw,4.5rem)' }}>
            9.9<span className="text-gold">/10</span>
          </div>
          <p className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-stone mt-2">
            Exceptionnel · 200+ avis · Booking.com
          </p>
          <div className="flex justify-center gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-gold">✦</span>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {AVIS.map((a, i) => (
            <div
              key={i}
              className="bg-white p-8 border border-gold/10 relative"
            >
              <span className="absolute top-4 left-6 font-serif text-6xl text-gold/15 leading-none select-none">"</span>
              <p className="font-body text-ink/75 leading-relaxed text-[1.02rem] pt-6 mb-6">
                {a.text}
              </p>
              <div className="border-t border-gold/15 pt-4">
                <p className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-gold font-medium">
                  {a.author}
                </p>
                <p className="font-sans text-[0.6rem] tracking-widest uppercase text-stone mt-0.5">
                  {a.city} · {a.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
