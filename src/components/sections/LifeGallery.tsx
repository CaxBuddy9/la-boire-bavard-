'use client'
import PhotoGallery from '@/components/PhotoGallery'
import { useT } from '@/context/LangContext'

export default function LifeGallery() {
  const t = useT()

  const photos = [
    { src: '/photos/exterieur/celeste-maison-piscine-transats.jpg',   alt: t('La maison et la piscine au cœur du jardin', 'The house and pool in the garden') },
    { src: '/photos/exterieur/celeste-piscine-jardin-fleurs.jpg',     alt: t('La piscine bordée de fleurs', 'The pool framed by flowers') },
    { src: '/photos/exterieur/celeste-terrasse-pierre-table.jpg',     alt: t('La terrasse en pierre', 'The stone terrace') },
    { src: '/photos/exterieur/celeste-dependance-piscine-bistrot.jpg', alt: t('La dépendance côté piscine', 'The annexe by the pool') },
    { src: '/photos/exterieur/celeste-piscine-cedre-grand-arbre.jpg', alt: t('Le grand cèdre et la piscine', 'The great cedar and the pool') },
    { src: '/photos/exterieur/celeste-table-bistrot-piscine.jpg',     alt: t('Un coin détente au bord de l\'eau', 'A relaxing spot by the water') },
    { src: '/photos/exterieur/celeste-transat-piscine.jpg',           alt: t('Transat au soleil', 'A lounger in the sun') },
    { src: '/photos/exterieur/celeste-rose-cle-paradis.jpg',          alt: t('Une rose du jardin', 'A rose from the garden') },
  ]

  return (
    <section style={{ background: '#0d110e' }} className="py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="label-caps mb-3">{t("L'art de vivre", 'The art of living')}</p>
          <h2 className="font-serif font-normal" style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)', color: 'rgba(253,252,249,.88)' }}>
            {t('La maison', 'The house')}{' '}
            <em className="italic" style={{ color: 'rgba(255,255,255,.55)' }}>{t('& le jardin', '& garden')}</em>
          </h2>
          <div className="gold-line mx-auto mt-6" />
        </div>
        <PhotoGallery columns={4} photos={photos} />
      </div>
    </section>
  )
}
