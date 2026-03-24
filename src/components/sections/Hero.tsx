import Image from 'next/image'
import Link from 'next/link'
import { LogoWatermark } from '@/components/Logo'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Image Ken Burns */}
      <Image
        src="/photos/photo5.jpg"
        alt="La Boire Bavard"
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
        <p className="label-caps mb-6 animate-[rise_0.8s_0.15s_both]">
          Chambres d'Hôtes · Anjou · France
        </p>

        <h1 className="font-serif font-normal leading-none mb-5 animate-[rise_0.8s_0.3s_both]"
          style={{ fontSize: 'clamp(4rem,9vw,8rem)', letterSpacing: '-0.01em' }}
        >
          La Boire<br />
          <em className="font-serif italic text-white/65">Bavard</em>
        </h1>

        <p className="font-sans text-[0.72rem] tracking-[0.38em] uppercase text-white/50 mb-14 animate-[rise_0.8s_0.45s_both]">
          4 chemin de la Boire Bavard · 49320 Blaison-Saint-Sulpice
        </p>

        <div className="flex gap-4 justify-center animate-[rise_0.8s_0.6s_both]">
          <Link href="/chambres" className="btn-gold">Nos chambres</Link>
          <Link href="/contact" className="btn-ghost">Réserver</Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-9 left-1/2 animate-bob flex flex-col items-center gap-2">
        <div className="w-px h-11 bg-white/35" />
        <span className="font-sans text-[0.52rem] tracking-[0.3em] uppercase text-white/40">Défiler</span>
      </div>
    </section>
  )
}
