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
        src="/photos/exterieur/maison-exterieure-piscine.jpg"
        alt="La Boire Bavard — vue extérieure jardin et piscine"
        fill priority
        className="object-cover animate-kenburns"
        sizes="100vw"
      />

      {/* Voile — plus léger */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(15,24,17,.58) 0%, rgba(15,24,17,.22) 55%, rgba(15,24,17,.45) 100%)' }} />

      {/* Particules dorées */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {([
          { top:'18%', left:'12%', d:'0s',   dur:'4.2s' },
          { top:'32%', left:'28%', d:'1.1s', dur:'5.0s' },
          { top:'55%', left:'8%',  d:'2.3s', dur:'4.6s' },
          { top:'70%', left:'42%', d:'0.5s', dur:'3.8s' },
          { top:'22%', left:'72%', d:'1.7s', dur:'5.2s' },
          { top:'48%', left:'85%', d:'0.9s', dur:'4.4s' },
          { top:'78%', left:'65%', d:'2.8s', dur:'4.0s' },
          { top:'14%', left:'52%', d:'1.4s', dur:'5.6s' },
          { top:'62%', left:'20%', d:'3.1s', dur:'4.8s' },
          { top:'40%', left:'93%', d:'0.3s', dur:'3.6s' },
        ] as {top:string;left:string;d:string;dur:string}[]).map((p, i) => (
          <div key={i} style={{
            position: 'absolute', top: p.top, left: p.left,
            fontSize: i % 3 === 0 ? '10px' : '7px',
            color: '#c4a050',
            animation: `float-up ${p.dur} ${p.d} ease-out infinite`,
            opacity: 0,
          }}>✦</div>
        ))}
      </div>

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
          <em className="font-serif italic" style={{ color: 'rgba(255,255,255,0.82)', animation: 'gold-shimmer 4s 1.5s ease-in-out infinite' }}>Bavard</em>
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
