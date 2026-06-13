// Journal de La Boire Bavard — vidéos des alentours et vie de la maison.
//
// Pour ajouter une vidéo YouTube :
//   1. Mettre la vidéo en ligne sur YouTube.
//   2. Copier l'identifiant de l'URL — la partie après "v=".
//      Ex.  https://www.youtube.com/watch?v=dQw4w9WgXcQ  →  youtubeId: 'dQw4w9WgXcQ'
//   3. Ajouter un objet dans le tableau `blogPosts` ci-dessous.
//
// `featured: true` → l'article s'affiche en grand « à la une » en haut du Journal.
// Tant qu'aucune vidéo n'est renseignée, l'article affiche son image d'aperçu
// avec la mention « Vidéo bientôt disponible ».

export type BlogPost = {
  slug: string
  title: string
  date: string          // format ISO : 'AAAA-MM-JJ'
  category: string
  excerpt: string
  poster: string        // image d'aperçu (chemin dans /public)
  youtubeId?: string    // identifiant de la vidéo YouTube
  featured?: boolean    // mise en avant « à la une »
  sourceLabel?: string  // crédit de la source (ex. 'France 3 Centre-Val de Loire')
  sourceUrl?: string    // lien vers l'article d'origine
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'loire-confluences-label-ramsar',
    title: 'La Loire des Confluences décroche le label Ramsar',
    date: '2026-05-16',
    category: 'Les alentours',
    excerpt:
      "Entre Tours et Angers, la « Loire des Confluences » rejoint la liste internationale Ramsar " +
      "des zones humides d'une valeur exceptionnelle. Une belle reconnaissance pour ce fleuve sauvage " +
      'qui coule à quelques minutes de La Boire Bavard.',
    poster: '/photos/exterieur/celeste-piscine-facade.jpg',
    youtubeId: 'UftAoVLCOlw',
    featured: true,
    sourceLabel: 'France 3 Centre-Val de Loire',
    sourceUrl:
      'https://france3-regions.franceinfo.fr/centre-val-de-loire/indre-loire/entre-tours-et-angers-la-loire-des-confluences-decroche-le-label-ramsar-reconnaissance-internationale-pour-une-zone-humide-d-une-valeur-exceptionnelle-3347395.html',
  },
  {
    slug: 'vignobles-layon-velo',
    title: 'Les coteaux du Layon à vélo',
    date: '2026-05-15',
    category: 'Les alentours',
    excerpt:
      "Au départ de la maison, une boucle de 20 km serpente entre les vignes du Layon. " +
      'Pentes douces, villages de tuffeau et caves à visiter — l\'Anjou viticole comme on l\'aime.',
    poster: '/photos/exterieur/celeste-piscine-cedre-grand-arbre.jpg',
    youtubeId: '',
  },
  {
    slug: 'jardin-au-printemps',
    title: 'Le jardin se réveille',
    date: '2026-05-01',
    category: 'La maison',
    excerpt:
      "Iris en fleurs, grand cèdre et premières baignades : visite guidée du jardin de " +
      'La Boire Bavard aux beaux jours, là où nos hôtes aiment prendre le temps.',
    poster: '/photos/exterieur/celeste-piscine-jardin-fleurs.jpg',
    youtubeId: '',
  },
]

// Articles triés du plus récent au plus ancien.
export const sortedPosts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date))

// Article mis en avant (le premier marqué `featured`), s'il existe.
export const featuredPost = sortedPosts.find(p => p.featured)

// Articles affichés dans la grille (tout sauf l'article à la une).
export const gridPosts = sortedPosts.filter(p => p !== featuredPost)

// Met une date ISO en forme française : '2026-05-15' → '15 mai 2026'
export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
