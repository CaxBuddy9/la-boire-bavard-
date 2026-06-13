'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/context/LangContext'

export default function BookingBand() {
  const t = useT()
  return (
    <section className="relative py-28 md:py-36 px-6 overflow-hidden">
      <Image
        src="/photos/exterieur/celeste-dependance-piscine-transats.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(13,20,14,.72) 0%, rgba(13,20,14,.84) 100%)' }} />
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <p className="label-caps mb-4">{t('Votre séjour vous attend', 'Your stay awaits')}</p>
        <h2 className="font-serif font-normal text-white mb-6" style={{ fontSize: 'clamp(2.2rem,4vw,3.4rem)', lineHeight: 1.1 }}>
          {t('Réservez votre parenthèse', 'Book your getaway')}<br />
          <em className="italic" style={{ color: 'rgba(255,255,255,.6)' }}>{t('en Anjou', 'in Anjou')}</em>
        </h2>
        <div className="gold-line mx-auto mb-8" />
        <p className="font-body text-white/75 text-[1.05rem] leading-[1.8] mb-10">
          {t(
            "Trois chambres de charme, une piscine au cœur du jardin et un accueil chaleureux signé Sandrine & Jean-Marc. Écrivez-nous pour vérifier les disponibilités.",
            'Three charming rooms, a pool in the heart of the garden and a warm welcome from Sandrine & Jean-Marc. Get in touch to check availability.'
          )}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/contact" className="btn-gold">{t('Réserver', 'Book')}</Link>
          <Link href="/chambres" className="btn-ghost">{t('Voir les chambres', 'View rooms')}</Link>
        </div>
      </div>
    </section>
  )
}
