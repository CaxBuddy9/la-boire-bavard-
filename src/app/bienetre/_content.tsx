'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useT } from '@/context/LangContext'

const SAISONS_DATA = [
  { key: 'spring', s_fr: 'Printemps', s_en: 'Spring', mois_fr: 'Avril – Juin', mois_en: 'Apr – Jun', dispo_fr: 'Jardin & terrasse · Piscine dès mai', dispo_en: 'Garden & terrace · Pool from May', ico: '🌿' },
  { key: 'summer', s_fr: 'Été',       s_en: 'Summer', mois_fr: 'Juil – Août',  mois_en: 'Jul – Aug', dispo_fr: 'Piscine · Spa · Terrasse & barbecue', dispo_en: 'Pool · Spa · Terrace & barbecue', ico: '☀️' },
  { key: 'autumn', s_fr: 'Automne',   s_en: 'Autumn', mois_fr: 'Sept – Oct',   mois_en: 'Sep – Oct', dispo_fr: "Piscine jusqu'à fin sept. · Sauna", dispo_en: 'Pool until end of Sept. · Sauna', ico: '🍂' },
  { key: 'winter', s_fr: 'Hiver',     s_en: 'Winter', mois_fr: 'Nov – Mars',   mois_en: 'Nov – Mar', dispo_fr: 'Sauna & spa · Cheminées allumées', dispo_en: 'Sauna & spa · Fireplaces lit', ico: '❄️' },
]

export default function BienetreContent() {
  const t = useT()

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[70vh] flex items-end pb-16 overflow-hidden">
        <Image
          src="/photos/chambres/potager/chambre-potager-pierre.jpg"
          alt={t('Piscine La Boire Bavard', 'Pool at La Boire Bavard')}
          fill priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a0e]/90 via-[#0d1a0e]/30 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
          <p className="label-caps mb-3">{t('Détente & nature', 'Relaxation & nature')}</p>
          <h1 className="font-serif font-normal text-white leading-none"
            style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}>
            {t('Bien-être', 'Wellness')}
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section style={{ background: '#0f1a10', padding: '80px 52px' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="label-caps mb-4">{t('Un espace pour se poser', 'A space to unwind')}</p>
          <div className="gold-line mx-auto mb-8" />
          <blockquote className="font-serif italic mb-8"
            style={{ fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', lineHeight: 1.5, color: 'rgba(253,252,249,.8)' }}>
            {t(
              '"Ici, le temps s\'arrête. La piscine, le jardin, le sauna — tout invite à ralentir."',
              '"Here, time stands still. The pool, the garden, the sauna — everything invites you to slow down."'
            )}
          </blockquote>
          <p className="font-sans text-[1.05rem] leading-[1.85]" style={{ color: 'rgba(255,255,255,.5)' }}>
            {t(
              "La Boire Bavard n'est pas seulement un endroit où dormir. C'est un espace où se ressourcer — entre baignades dans la piscine chauffée, sessions de sauna et promenades dans le jardin centenaire.",
              "La Boire Bavard is not just a place to sleep. It is a space to recharge — between swims in the heated pool, sauna sessions and walks through the century-old garden."
            )}
          </p>
        </div>
      </section>

      {/* Piscine */}
      <div className="grid md:grid-cols-2 min-h-[70vh]">
        <div className="relative min-h-[50vw] md:min-h-0 overflow-hidden">
          <Image src="/photos/chambres/jardin/chambre-jardin-combles.jpg" alt={t('Piscine chauffée', 'Heated pool')} fill className="object-cover" sizes="50vw" />
        </div>
        <div style={{ background: '#141f15' }} className="flex flex-col justify-center px-12 py-20 md:px-16">
          <p className="label-caps mb-5">{t('Mai – Septembre', 'May – September')}</p>
          <h2 className="font-serif font-normal text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}>
            {t('La piscine chauffée', 'The heated pool')}
          </h2>
          <div className="gold-line mb-8" />
          <p className="font-sans text-white/60 text-[1.05rem] leading-[1.85] mb-5">
            {t(
              "Chauffée à 28°C, la piscine est accessible en accès libre aux hôtes. Elle donne directement sur la terrasse en tuffeau et le jardin arboré — un cadre de carte postale.",
              "Heated to 28°C, the pool is freely accessible to guests. It opens directly onto the tuffeau stone terrace and the wooded garden — a picture-perfect setting."
            )}
          </p>
          <p className="font-sans text-white/60 text-[1.05rem] leading-[1.85] mb-10">
            {t(
              "Transats, parasols et douche extérieure sont mis à disposition. Ouverture selon la météo de mai à fin septembre.",
              "Sun loungers, parasols and an outdoor shower are provided. Open weather-permitting from May to late September."
            )}
          </p>
          <div className="flex flex-wrap gap-4">
            <div style={{ background: 'rgba(255,255,255,.07)', padding: '16px 24px', textAlign: 'center' }}>
              <div className="font-serif text-gold text-2xl">28°C</div>
              <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/40 mt-1">{t('température', 'temperature')}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.07)', padding: '16px 24px', textAlign: 'center' }}>
              <div className="font-serif text-gold text-2xl">{t('Libre', 'Free')}</div>
              <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/40 mt-1">{t('accès hôtes', 'guest access')}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.07)', padding: '16px 24px', textAlign: 'center' }}>
              <div className="font-serif text-gold text-2xl">{t('Mai–Sept', 'May–Sept')}</div>
              <div className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-white/40 mt-1">{t('ouverture', 'open season')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Spa / Sauna */}
      <div className="grid md:grid-cols-2 min-h-[70vh]">
        <div style={{ background: '#0d1a0d' }} className="flex flex-col justify-center px-12 py-20 md:px-16 order-2 md:order-1">
          <p className="label-caps mb-5">{t('Toute l\'année', 'Year-round')}</p>
          <h2 className="font-serif font-normal text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}>
            {t('Spa & sauna finlandais', 'Spa & Finnish sauna')}
          </h2>
          <div className="gold-line mb-8" />
          <p className="font-sans text-white/60 text-[1.05rem] leading-[1.85] mb-5">
            {t(
              "Le spa privatif et le sauna finlandais sont disponibles sur réservation, inclus dans votre séjour. Idéal en arrière-saison, après une journée de vélo sur les bords de Loire ou de visite des châteaux.",
              "The private spa and Finnish sauna are available on reservation, included in your stay. Perfect in the off-season, after a day cycling along the Loire or visiting châteaux."
            )}
          </p>
          <p className="font-sans text-white/60 text-[1.05rem] leading-[1.85] mb-10">
            {t(
              "Pensez à réserver votre créneau auprès de Sandrine — en général 1h à 1h30 par session.",
              "Remember to book your slot with Sandrine — usually 1h to 1.5h per session."
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              t('Sauna finlandais', 'Finnish sauna'),
              t('Spa privatif', 'Private spa'),
              t('Sur réservation', 'On reservation'),
              t('Inclus dans le séjour', 'Included in stay'),
            ].map(tag => (
              <span key={tag}
                style={{ border: '1px solid rgba(196,160,80,.25)', padding: '6px 14px' }}
                className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-white/55">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="relative min-h-[50vw] md:min-h-0 overflow-hidden order-1 md:order-2">
          <Image src="/photos/exterieur/propriete-jacuzzi-terrasse.jpg" alt={t('Spa et sauna', 'Spa and sauna')} fill className="object-cover" sizes="50vw" />
        </div>
      </div>

      {/* Jardin & nature */}
      <section style={{ background: '#0f1a10', padding: '80px 52px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="label-caps mb-3">1 {t('hectare', 'hectare')}</p>
            <h2 className="font-serif font-normal"
              style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}>
              {t('Le jardin & la nature', 'The garden & nature')}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                ico: '🌳',
                titre_fr: 'Parc arboré', titre_en: 'Tree-lined park',
                desc_fr: "Cèdres centenaires, tilleuls et chênes. Un parc à l'ancienne qui donne son caractère à la propriété.",
                desc_en: 'Century-old cedars, linden and oak trees. A classic park that gives the property its character.',
              },
              {
                ico: '🥕',
                titre_fr: 'Potager clos', titre_en: 'Walled kitchen garden',
                desc_fr: 'Le jardin potager historique alimenté les petits-déjeuners en été. Vous pouvez vous y promener librement.',
                desc_en: 'The historic kitchen garden supplies summer breakfasts. You are free to stroll through it.',
              },
              {
                ico: '🦋',
                titre_fr: 'Nature & silence', titre_en: 'Nature & silence',
                desc_fr: "Pas de voisins immédiats. Le seul bruit est celui des oiseaux. Un vrai luxe à 25 minutes d'Angers.",
                desc_en: 'No immediate neighbours. The only sound is birdsong. A true luxury 25 minutes from Angers.',
              },
            ].map(item => (
              <div key={item.titre_fr}
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.12)', padding: '2rem' }}>
                <span className="text-2xl block mb-4">{item.ico}</span>
                <h3 className="font-serif font-normal text-lg mb-3" style={{ color: 'rgba(253,252,249,.9)' }}>
                  {t(item.titre_fr, item.titre_en)}
                </h3>
                <p className="font-sans text-[0.9rem] leading-[1.7]" style={{ color: 'rgba(255,255,255,.45)' }}>
                  {t(item.desc_fr, item.desc_en)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Saisons */}
      <section style={{ background: '#0a1209', padding: '80px 52px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="label-caps mb-3">{t('Disponibilités', 'Availability')}</p>
            <h2 className="font-serif font-normal"
              style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}>
              {t('Selon les saisons', 'By season')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {SAISONS_DATA.map(s => (
              <div key={s.key}
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.12)', padding: '1.8rem 1.5rem' }}>
                <div className="text-3xl mb-4">{s.ico}</div>
                <div className="font-serif text-gold text-xl mb-1">{t(s.s_fr, s.s_en)}</div>
                <div className="font-sans text-[0.58rem] tracking-[0.16em] uppercase text-white/35 mb-5">{t(s.mois_fr, s.mois_en)}</div>
                <p className="font-sans text-[0.82rem] leading-[1.65]" style={{ color: 'rgba(255,255,255,.5)' }}>{t(s.dispo_fr, s.dispo_en)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0f1a10', padding: '80px 52px', textAlign: 'center' }}>
        <p className="label-caps mb-4">{t('Tout inclus dans votre séjour', 'All included in your stay')}</p>
        <h2 className="font-serif font-normal mb-4"
          style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}>
          {t('Piscine · Spa · Sauna · Jardin', 'Pool · Spa · Sauna · Garden')}
        </h2>
        <p className="font-sans text-white/45 mb-10 text-[1rem]">
          {t('88 €/nuit · Petit-déjeuner inclus · Accès libre aux espaces bien-être', '88 €/night · Breakfast included · Free access to wellness areas')}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/chambres" className="btn-gold">{t('Choisir une chambre', 'Choose a room')}</Link>
          <Link href="/contact" className="btn-ghost">{t('Nous contacter', 'Contact us')}</Link>
        </div>
      </section>
    </main>
  )
}
