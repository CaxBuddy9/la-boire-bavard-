import Image from 'next/image'
import Link from 'next/link'
import { ROOMS } from '@/lib/rooms'

const ROOM_IMAGES: Record<string, string> = {
  jardin:  '/photos/chambres/jardin/chambre-jardin-poutres.jpg',
  cedre:   '/photos/chambres/cedre/chambre-cedre-lit-taupe.jpg',
  vallee:  '/photos/chambres/potager/chambre-potager-pierre.jpg',
  potager: '/photos/chambres/jardin/chambre-jardin-combles.jpg',
}

export default function RoomsTeaser() {
  return (
    <section className="py-24 px-12 bg-cream">
      <div className="text-center mb-16">
        <p className="label-caps-dark mb-4">Hébergements</p>
        <h2 className="font-serif font-normal text-forest"
          style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)' }}
        >
          Quatre chambres,<br />
          <em className="italic">une maison</em>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5">
        {ROOMS.map((room) => (
          <Link
            key={room.id}
            href={`/chambres/${room.slug}`}
            className="group relative overflow-hidden aspect-[3/4] block"
          >
            <Image
              src={ROOM_IMAGES[room.id] ?? '/photos/chambres/jardin/chambre-jardin-poutres.jpg'}
              alt={room.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              sizes="(max-width:768px) 50vw, 25vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-transparent to-transparent" />
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="font-sans text-[0.55rem] tracking-[0.28em] uppercase text-gold mb-1">
                {room.capacityMin === room.capacityMax
                  ? `${room.capacityMin} pers.`
                  : `${room.capacityMin}–${room.capacityMax} pers.`}
              </p>
              <h3 className="font-serif font-normal text-white text-xl">{room.name}</h3>
              <p className="font-sans text-[0.6rem] tracking-widest uppercase text-white/60 mt-1">
                {room.character}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/chambres" className="btn-gold">
          Voir toutes les chambres
        </Link>
      </div>
    </section>
  )
}
