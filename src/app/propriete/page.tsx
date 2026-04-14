import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'
import PhotoGallery from '@/components/PhotoGallery'

export const metadata = {
  title: "La Propriété — La Boire Bavard",
  description: "Découvrez la longère angevine de La Boire Bavard : piscine chauffée, spa, jardin, vignoble et val de Loire.",
}

const FEATURES = [
  { icon: '≋', title: 'Piscine chauffée', desc: 'Profitez de la piscine chauffée ouverte de mai à octobre, entourée d\'un jardin préservé.' },
  { icon: '∿', title: 'Spa & balnéo', desc: 'Jacuzzi privatisable sur demande — un moment de détente absolue après une journée de découvertes.' },
  { icon: '❧', title: 'Jardin & potager', desc: 'Un jardin généreux avec potager, verger et herbes aromatiques cueillis le matin pour votre petit-déjeuner.' },
  { icon: '✦', title: 'Vue Loire & vignoble', desc: 'La propriété est nichée entre la vallée de la Loire et les vignes de l\'Anjou, offrant des panoramas exceptionnels.' },
  { icon: '◇', title: 'Table d\'hôtes', desc: 'Le vendredi soir, Sandrine propose une table d\'hôtes à 25 €/pers. avec produits du jardin et vins locaux.' },
  { icon: '◉', title: 'Parkings & calme', desc: 'Parking privé, environnement rural, aucun bruit de circulation. Le calme absolu de la campagne angevine.' },
]

export default function PropriетеPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative h-[65vh] flex items-end pb-16 overflow-hidden">
          <Image
            src="/photos/propriete-jardin-cedre.jpg"
            alt="La propriété La Boire Bavard — jardin et cèdre centenaire"
            fill priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/30 to-transparent" />
          <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
            <p className="label-caps mb-3">Notre domaine</p>
            <h1 className="font-serif font-normal text-white leading-none"
              style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}
            >
              La propriété
            </h1>
          </div>
        </section>

        {/* Intro split */}
        <div className="grid md:grid-cols-2 min-h-[70vh]">
          <div className="relative min-h-[50vw] md:min-h-0 overflow-hidden">
            <Image
              src="/photos/maison-exterieure-fleurs.jpg"
              alt="La longère angevine de La Boire Bavard au printemps"
              fill
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              sizes="50vw"
            />
          </div>
          <div className="bg-forest flex flex-col justify-center px-12 py-20 md:px-16">
            <p className="label-caps mb-5">Notre maison</p>
            <h2 className="font-serif font-normal text-cream leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}
            >
              Une authentique longère<br />
              <em className="italic text-white/55">au cœur du val de Loire</em>
            </h2>
            <div className="gold-line mb-8" />
            <p className="font-body text-white/65 text-[1.05rem] leading-[1.85] mb-5">
              Nichée à Blaison-Saint-Sulpice, charmante Petite Cité de Caractère du Maine et Loire,
              La Boire Bavard vous accueille dans une belle longère pleine de charme. Pierres
              apparentes, tomettes anciennes, poutres blanches — chaque détail raconte l'histoire
              de cette demeure angevine.
            </p>
            <p className="font-body text-white/65 text-[1.05rem] leading-[1.85] mb-5">
              Sandrine a tout pensé pour votre confort : entrées indépendantes, salle d'eau
              privative, terrasse avec vue sur le jardin et la piscine, parking privé sécurisé.
              Un environnement calme et verdoyant, un accueil chaleureux, un séjour reposant.
            </p>
            <p className="font-body text-white/65 text-[1.05rem] leading-[1.85]">
              Nichée dans le Val de Loire classé au patrimoine de l'UNESCO, la propriété est
              le point de départ idéal pour explorer l'Anjou entre vignobles, châteaux et
              villages de caractère.
            </p>
          </div>
        </div>

        {/* Features grid */}
        <section style={{ background: '#111009', padding: '96px 52px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="label-caps mb-3">Les atouts</p>
              <h2 className="font-serif font-normal"
                style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}
              >
                Ce qui rend ce lieu unique
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {FEATURES.map((f) => (
                <div key={f.title} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.18)', padding: '2rem' }}>
                  <span className="text-gold text-2xl block mb-4">{f.icon}</span>
                  <h3 className="font-serif font-normal text-xl mb-3" style={{ color: 'rgba(253,252,249,.9)' }}>{f.title}</h3>
                  <p className="font-body text-[0.95rem] leading-[1.8]" style={{ color: 'rgba(255,255,255,.5)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section style={{ background: '#0d110e', padding: '80px 32px' }}>
          <div className="max-w-6xl mx-auto">
            <p className="label-caps mb-3 text-center">Galerie</p>
            <h2 className="font-serif font-normal text-center mb-12"
              style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: 'rgba(253,252,249,.8)' }}
            >
              En images
            </h2>
            <PhotoGallery
              columns={3}
              photos={[
                { src: '/photos/maison-exterieure-piscine.jpg', alt: 'Jardin et piscine' },
                { src: '/photos/maison-exterieure-fleurs.jpg', alt: 'La maison au printemps' },
                { src: '/photos/maison-exterieure-ete.jpg', alt: 'Vue extérieure été' },
                { src: '/photos/propriete-jardin-cedre.jpg', alt: 'Le jardin et le cèdre centenaire' },
                { src: '/photos/chambre-jardin-ensemble.jpg', alt: 'Chambre Côté Jardin' },
                { src: '/photos/chambre-jardin-lit-terrasse.jpg', alt: 'Lit avec vue sur le jardin' },
                { src: '/photos/chambre-jardin-cheminee.jpg', alt: 'Cheminée en tuffeau' },
                { src: '/photos/chambre-jardin-console.jpg', alt: 'Console et miroir' },
                { src: '/photos/chambre-jardin-entree.jpg', alt: 'Entrée depuis la terrasse' },
              ]}
            />
          </div>
        </section>

        {/* À proximité */}
        <section style={{ background: '#111009', padding: '80px 32px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="label-caps mb-3">Situation idéale</p>
              <h2 className="font-serif font-normal"
                style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: 'rgba(253,252,249,.85)' }}
              >
                Au cœur de l'Anjou
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12 mb-14">
              <div>
                <h3 className="font-serif text-gold text-xl mb-5">Activités & nature</h3>
                <ul className="space-y-3">
                  {[
                    'Loire à vélo — départ depuis la maison',
                    'Canot sur la Loire',
                    'Randonnées pédestres (GR3 accessible depuis le village)',
                    'Balades dans les vignes',
                    'Golf d\'Angers — 10 min',
                    'Dégustations chez les vignerons — 5 à 10 min',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 font-body text-[0.95rem]" style={{ color: 'rgba(255,255,255,.55)' }}>
                      <span className="text-gold mt-1 text-xs">✦</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-gold text-xl mb-5">Distances</h3>
                <ul className="space-y-3">
                  {[
                    { lieu: 'Blaison-Saint-Sulpice (centre)', dist: '2 min' },
                    { lieu: 'Bords de Loire', dist: '5 min' },
                    { lieu: 'Vignobles & dégustations', dist: '5–10 min' },
                    { lieu: 'Château de Brissac', dist: '10 min' },
                    { lieu: 'Angers — Château des Ducs', dist: '25 min' },
                    { lieu: 'Saumur — Château & caves', dist: '30 min' },
                    { lieu: 'Doué-la-Fontaine — Zoo Bioparc', dist: '30 min' },
                  ].map(({ lieu, dist }) => (
                    <li key={lieu} className="flex items-center justify-between font-body text-[0.95rem] border-b pb-2" style={{ color: 'rgba(255,255,255,.55)', borderColor: 'rgba(255,255,255,.07)' }}>
                      <span>{lieu}</span>
                      <span className="text-gold font-sans text-[0.8rem] tracking-wider ml-4 shrink-0">{dist}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="bg-forest py-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="label-caps mb-3">Adresse</p>
            <h2 className="font-serif font-normal text-white mb-6"
              style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}
            >
              Entre Angers et Saumur
            </h2>
            <div className="gold-line mx-auto mb-8" />
            <p className="font-body text-white/60 text-[1rem] leading-[1.8] mb-10">
              4 chemin de la Boire Bavard — Lieu-dit La Hutte<br />
              49320 Blaison-Saint-Sulpice
            </p>
            <Link href="/contact" className="btn-gold">
              Nous contacter
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
