'use client'
import { useT } from '@/context/LangContext'

export default function QuoteBand() {
  const t = useT()
  return (
    <section className="bg-cream-dark py-20 px-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_50%_50%,#c9a96e_0%,transparent_70%)]" />
      <div className="relative max-w-3xl mx-auto">
        <div className="font-serif text-gold/30 text-8xl leading-none mb-2 select-none">"</div>
        <blockquote className="font-serif font-normal text-ink italic"
          style={{ fontSize: 'clamp(1.5rem,2.8vw,2.2rem)', lineHeight: 1.45 }}
        >
          {t(
            "Un endroit rare où le temps s'arrête. Sandrine a créé quelque chose d'exceptionnel — entre une maison de famille et un havre de paix digne des plus belles adresses d'Anjou.",
            "A rare place where time stands still. Sandrine has created something exceptional — halfway between a family home and a haven of peace worthy of Anjou's finest addresses."
          )}
        </blockquote>
        <div className="gold-line mx-auto mt-8 mb-5" />
        <p className="font-sans text-[0.65rem] tracking-[0.3em] uppercase text-stone">
          Marie & Thomas · Paris · {t('Séjour juin 2024', 'Stay June 2024')}
        </p>
        <div className="flex justify-center gap-1 mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="star-gold text-sm" style={{ animationDelay: `${i * 0.3}s` }}>✦</span>
          ))}
        </div>
      </div>
    </section>
  )
}
