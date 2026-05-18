import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/sections/Nav'
import Footer from '@/components/sections/Footer'
import {
  featuredPost,
  gridPosts,
  formatDate,
  facebookEmbedUrl,
  type BlogPost,
} from '@/lib/blog'

export const metadata = {
  title: 'Journal — La Boire Bavard',
  description:
    "Vidéos des alentours, balades dans le vignoble de l'Anjou et vie de la maison d'hôtes. " +
    'Le journal de La Boire Bavard, à Blaison-Saint-Sulpice.',
  openGraph: {
    title: 'Journal — La Boire Bavard',
    description: "Vidéos des alentours et vie de la maison d'hôtes en Anjou.",
    images: ['/photos/exterieur/propriete-jardin-cedre.jpg'],
  },
}

function VideoCard({ post }: { post: BlogPost }) {
  return (
    <article
      style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.12)' }}
      className="flex flex-col overflow-hidden"
    >
      {/* Lecteur vidéo 16:9 */}
      <div className="relative w-full aspect-video bg-[#0a1209]">
        {post.youtubeId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${post.youtubeId}`}
            title={post.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <>
            <Image src={post.poster} alt={post.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
            <div className="absolute inset-0 bg-[#0d1a0e]/55" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span
                style={{ border: '1px solid rgba(196,160,80,.5)' }}
                className="w-14 h-14 rounded-full flex items-center justify-center text-gold text-xl"
              >
                ▶
              </span>
              <span className="font-sans text-[0.55rem] tracking-[0.22em] uppercase text-white/55">
                Vidéo bientôt disponible
              </span>
            </div>
          </>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-sans text-[0.55rem] tracking-[0.2em] uppercase text-gold">{post.category}</span>
          <span className="text-white/15">·</span>
          <span className="font-sans text-[0.55rem] tracking-[0.12em] uppercase text-white/35">
            {formatDate(post.date)}
          </span>
        </div>
        <h2 className="font-serif font-normal text-white text-xl leading-snug mb-3">{post.title}</h2>
        <p className="font-sans text-[0.9rem] leading-[1.7] text-white/50">{post.excerpt}</p>
      </div>
    </article>
  )
}

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <article className="grid lg:grid-cols-[320px_1fr] gap-10 items-center">
      {/* Reel Facebook — format vertical */}
      <div className="mx-auto w-full max-w-[320px]">
        {post.facebookReel ? (
          <div
            className="relative w-full overflow-hidden bg-[#0a1209]"
            style={{ aspectRatio: '320 / 569', border: '1px solid rgba(196,160,80,.18)' }}
          >
            <iframe
              src={facebookEmbedUrl(post.facebookReel)}
              title={post.title}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              scrolling="no"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : (
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '320 / 569' }}>
            <Image src={post.poster} alt={post.title} fill className="object-cover" sizes="320px" />
          </div>
        )}
      </div>

      {/* Texte */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-sans text-[0.58rem] tracking-[0.24em] uppercase text-gold">À la une</span>
          <span className="text-white/15">·</span>
          <span className="font-sans text-[0.58rem] tracking-[0.16em] uppercase text-white/40">{post.category}</span>
        </div>
        <h2 className="font-serif font-normal text-white leading-tight mb-5"
          style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)' }}>
          {post.title}
        </h2>
        <div className="gold-line mb-6" />
        <p className="font-sans text-[1.02rem] leading-[1.85] text-white/60 mb-6">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-sans text-[0.6rem] tracking-[0.14em] uppercase text-white/35">
            {formatDate(post.date)}
          </span>
          {post.sourceUrl && (
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[0.6rem] tracking-[0.14em] uppercase text-gold hover:text-white transition-colors"
            >
              Source : {post.sourceLabel ?? "voir l'article"} ↗
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main>

        {/* Hero */}
        <section className="relative h-[60vh] flex items-end pb-16 overflow-hidden">
          <Image
            src="/photos/exterieur/propriete-jardin-cedre.jpg"
            alt="Le parc de La Boire Bavard"
            fill priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a0e]/95 via-[#0d1a0e]/40 to-transparent" />
          <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
            <p className="label-caps mb-3">Vidéos & balades</p>
            <h1 className="font-serif font-normal text-white leading-none"
              style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}>
              Le Journal
            </h1>
          </div>
        </section>

        {/* Intro */}
        <section style={{ background: '#0f1a10', padding: '72px 52px' }}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="label-caps mb-4">Au fil des saisons</p>
            <div className="gold-line mx-auto mb-8" />
            <p className="font-sans text-[1.05rem] leading-[1.85]" style={{ color: 'rgba(255,255,255,.55)' }}>
              Bienvenue dans notre journal. Au fil des semaines, nous y partageons des vidéos des alentours —
              vignobles de l'Anjou, bords de Loire, villages de tuffeau — et des instants de vie à la maison.
              De quoi imaginer votre prochain séjour avant même d'arriver.
            </p>
          </div>
        </section>

        {/* Article à la une */}
        {featuredPost && (
          <section style={{ background: '#0a1209', padding: '64px 52px' }}>
            <div className="max-w-6xl mx-auto">
              <FeaturedPost post={featuredPost} />
            </div>
          </section>
        )}

        {/* Grille des vidéos */}
        {gridPosts.length > 0 && (
          <section style={{ background: '#0f1a10', padding: '64px 52px 96px' }}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                <p className="label-caps mb-3">À découvrir aussi</p>
                <h2 className="font-serif font-normal"
                  style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', color: 'rgba(253,252,249,.85)' }}>
                  Autres vidéos
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {gridPosts.map(post => (
                  <VideoCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{ background: '#0a1209', padding: '80px 52px', textAlign: 'center' }}>
          <p className="label-caps mb-4">Envie de venir voir par vous-même ?</p>
          <h2 className="font-serif font-normal mb-4"
            style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: 'rgba(253,252,249,.85)' }}>
            Réservez votre séjour
          </h2>
          <p className="font-sans text-white/45 mb-10 text-[1rem]">
            4 chambres de charme au cœur de l'Anjou · Petit-déjeuner inclus
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/chambres" className="btn-gold">Voir les chambres</Link>
            <Link href="/contact" className="btn-ghost">Nous contacter</Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
