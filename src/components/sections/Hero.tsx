'use client'
import Image from 'next/image'
import Link from 'next/link'
import { LogoSVG, LogoWatermark } from '@/components/Logo'
import { useT } from '@/context/LangContext'

export default function Hero() {
  const t = useT()

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Image Ken Burns */}
      <Image
        src="/photos/maison-exterieure-piscine.jpg"
        alt="La Boire Bavard — vue extérieure jardin et piscine"
        fill priority
        className="object-cover animate-kenburns"
        sizes="100vw"
      />

      {/* Voile */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(20,30,22,.7) 0%, rgba(20,30,22,.35) 60%, rgba(20,30,22,.55) 100%)' }} />

      {/* Filigrane logo BB */}
      <LogoWatermark />

      {/* Contenu */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <div className="flex justify-center mb-6 animate-[rise_0.9s_0s_both]">
          <LogoSVG height={120} variant="dark-bg" />
        </div>

        <p className="label-caps mb-5 animate-[rise_0.8s_0.2s_both]">
          {t("Chambres d'Hôtes · Anjou · France", 'Bed & Breakfast · Anjou · France')}
        </p>

        <h1 className="font-serif font-normal leading-none mb-5 animate-[rise_0.8s_0.35s_both]"
          style={{ fontSize: 'clamp(3rem,7vw,6.5rem)', letterSpacing: '-0.01em' }}
        >
          La Boire<br />
          <em className="font-serif italic text-white/65">Bavard</em>
        </h1>

        <p className="font-sans text-[0.72rem] tracking-[0.38em] uppercase text-white/50 mb-14 animate-[rise_0.8s_0.45s_both]">
          4 chemin de la Boire Bavard · 49320 Blaison-Saint-Sulpice
        </p>

        <div className="flex gap-4 justify-center animate-[rise_0.8s_0.6s_both]">
          <Link href="/chambres" className="btn-gold">{t('Nos chambres', 'Our rooms')}</Link>
          <Link href="/contact" className="btn-ghost">{t('Réserver', 'Book')}</Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-9 left-1/2 animate-bob flex flex-col items-center gap-2">
        <div className="w-px h-11 bg-white/35" />
        <span className="font-sans text-[0.52rem] tracking-[0.3em] uppercase text-white/40">{t('Défiler', 'Scroll')}</span>
      </div>
    </section>
  )
}
