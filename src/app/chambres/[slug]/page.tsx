import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'
import BookingCard from '@/components/BookingCard'
import { ROOMS, getRoomBySlug } from '@/lib/rooms'

export function generateStaticParams() {
  return ROOMS.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const room = getRoomBySlug(slug)
  if (!room) return {}
  return {
    title: `${room.name} — La Boire Bavard`,
    description: room.description,
  }
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const room = getRoomBySlug(slug)
  if (!room) notFound()

  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative h-[70vh] flex items-end pb-16 overflow-hidden">
          <Image
            src={room.images[0]}
            alt={room.name}
            fill priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/25 to-transparent" />
          <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
            <Link href="/chambres" className="inline-block font-sans text-[0.6rem] tracking-[0.2em] uppercase text-white/50 hover:text-gold mb-6 transition-colors">
              ← Toutes les chambres
            </Link>
            <p className="label-caps mb-3">
              {room.capacityMin === room.capacityMax
                ? `${room.capacityMin} personnes`
                : `${room.capacityMin}–${room.capacityMax} personnes`} · 88 €/nuit
            </p>
            <h1 className="font-serif font-normal text-white leading-none mb-3"
              style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}
            >
              {room.name}
            </h1>
            <p className="font-sans text-[0.7rem] tracking-[0.25em] uppercase text-gold/80">
              {room.tagline}
            </p>
          </div>
        </section>

        {/* Content */}
        <div style={{ background: '#111009' }} className="py-20 px-8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_380px] gap-16">
            {/* Left: description + gallery */}
            <div>
              <p className="label-caps mb-4">La chambre</p>
              <div className="gold-line mb-8" />
              <p className="font-body text-[1.08rem] leading-[1.9] mb-12" style={{ color: 'rgba(255,255,255,.65)' }}>
                {room.description}
              </p>

              {/* Features */}
              <h3 className="font-serif font-normal text-2xl mb-6" style={{ color: 'rgba(253,252,249,.85)' }}>Équipements</h3>
              <ul className="grid grid-cols-2 gap-3 mb-14">
                {room.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 font-sans text-[0.78rem] tracking-wide" style={{ color: 'rgba(255,255,255,.55)' }}>
                    <span className="text-gold text-xs">✦</span> {f}
                  </li>
                ))}
              </ul>

              {/* Gallery */}
              {room.images.length > 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {room.images.slice(1).map((src, i) => (
                    <div key={i} className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={src}
                        alt={`${room.name} — photo ${i + 2}`}
                        fill
                        className="object-cover hover:scale-[1.04] transition-transform duration-500"
                        sizes="(max-width:768px) 50vw, 30vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: booking card */}
            <aside>
              <BookingCard roomName={room.name} capacityMax={room.capacityMax} />
            </aside>
          </div>
        </div>

        {/* Other rooms */}
        <section style={{ background: '#0d110e' }} className="py-20 px-8">
          <div className="max-w-6xl mx-auto">
            <p className="label-caps mb-3 text-center">Également disponible</p>
            <h2 className="font-serif font-normal text-center mb-12"
              style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: 'rgba(253,252,249,.8)' }}
            >
              Les autres chambres
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {ROOMS.filter((r) => r.id !== room.id).map((r) => (
                <Link key={r.id} href={`/chambres/${r.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden mb-4">
                    <Image
                      src={r.images[0]}
                      alt={r.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-forest/40 group-hover:bg-forest/20 transition-colors" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="font-serif font-normal text-white text-xl">{r.name}</h3>
                      <p className="font-sans text-[0.58rem] tracking-widest uppercase text-gold/80 mt-1">{r.tagline}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
