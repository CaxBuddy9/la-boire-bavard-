export default function QuoteBand() {
  return (
    <section className="bg-cream-dark py-20 px-8 text-center relative overflow-hidden">
      {/* Déco */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_50%_50%,#c9a96e_0%,transparent_70%)]" />

      <div className="relative max-w-3xl mx-auto">
        <div className="font-serif text-gold/30 text-8xl leading-none mb-2 select-none">"</div>
        <blockquote className="font-serif font-normal text-ink italic"
          style={{ fontSize: 'clamp(1.5rem,2.8vw,2.2rem)', lineHeight: 1.45 }}
        >
          Un endroit rare où le temps s'arrête. Sandrine a créé quelque chose d'exceptionnel —
          entre une maison de famille et un havre de paix digne des plus belles adresses d'Anjou.
        </blockquote>
        <div className="gold-line mx-auto mt-8 mb-5" />
        <p className="font-sans text-[0.65rem] tracking-[0.3em] uppercase text-stone">
          Marie & Thomas · Paris · Séjour juin 2024
        </p>
        <div className="flex justify-center gap-1 mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-gold text-sm">✦</span>
          ))}
        </div>
      </div>
    </section>
  )
}
