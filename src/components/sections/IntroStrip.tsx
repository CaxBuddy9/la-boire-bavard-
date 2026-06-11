'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useT } from '@/context/LangContext'

export default function IntroStrip() {
  const t = useT()

  const stats = [
    { n: '9.9', l: t('Note Google', 'Google rating') },
    { n: '90€', l: t('La nuit', 'Per night') },
    { n: '3',   l: t('Chambres', 'Rooms') },
  ]

  return (
    <div className="grid md:grid-cols-2 min-h-[80vh]">
      {/* Photo */}
      <div className="relative overflow-hidden min-h-[50vh] md:min-h-full">
        <Image
          src="/photos/chambres/jardin/chambre-jardin-blanc-04.jpeg"
          alt="Chambre Côté Jardin — lit avec vue sur le jardin"
          fill
          className="object-cover transition-transform duration-700 hover:scale-[1.03]"
          sizes="(max-width:768px) 100vw, 50vw"
        />
      </div>

      {/* Texte */}
      <div className="bg-forest flex flex-col justify-center px-4 sm:px-8 md:px-16 py-10 md:py-20 lg:px-20">
        <p className="label-caps-dark mb-5">{t('Le mot des hôtes', 'A word from your hosts')}</p>
        <h2 className="font-serif font-normal text-cream leading-tight mb-6"
          style={{ fontSize: 'clamp(1.6rem,2.6vw,2.3rem)' }}
        >
          {t('Sandrine & Jean-Marc,', 'Sandrine & Jean-Marc,')}<br />
          <em className="italic text-white/65">{t('un nouveau chapitre', 'a new chapter')}</em>
        </h2>
        <div className="gold-line mb-6" />
        <p className="font-body text-white/80 text-[1.05rem] leading-[1.85] mb-4">
          {t(
            "Après plus de 20 ans à La Rochelle, entre océan et grand air, nous avons choisi de commencer un nouveau chapitre en Anjou — une région que nous aimons pour sa douceur de vivre, ses paysages et son authenticité.",
            "After more than 20 years in La Rochelle, between ocean and fresh air, we chose to start a new chapter in Anjou — a region we love for its gentle pace of life, its landscapes and its authenticity."
          )}
        </p>
        <p className="font-body text-white/80 text-[1.05rem] leading-[1.85] mb-4">
          {t(
            "Nous avons eu un coup de cœur pour La Boire Bavard, où nous avons désormais la joie de vous accueillir.",
            "We fell in love with La Boire Bavard, where we are now delighted to welcome you."
          )}
        </p>
        <div className="border-l-2 pl-5 mb-10" style={{ borderColor: 'rgba(196,160,80,.55)' }}>
          <p className="font-serif italic text-white/75 leading-[1.7]"
            style={{ fontSize: 'clamp(1.1rem,1.7vw,1.35rem)' }}
          >
            {t(
              "Nous tenons enfin à remercier Maryline et Jean-Paul pour le travail et la passion qu'ils ont consacrés à ce lieu.",
              "Finally, we want to thank Maryline and Jean-Paul for all the work and passion they devoted to this place."
            )}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="font-serif text-gold text-[2.4rem] font-normal">{s.n}</div>
              <div className="font-sans text-[0.58rem] tracking-[0.22em] uppercase text-white/40 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
