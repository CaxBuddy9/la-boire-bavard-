// Fil d'Ariane SEO (BreadcrumbList) — fait afficher « La Boire Bavard › Chambres »
// dans Google au lieu de l'URL brute. Server Component, aucun rendu visuel :
// il injecte uniquement les données structurées que Google lit.
//
// Usage dans une page :
//   <Breadcrumbs items={[{ name: 'Chambres', path: '/chambres' }]} />
// (la racine « La Boire Bavard » est ajoutée automatiquement)

const BASE_URL = 'https://www.laboirebavard.com'

type Crumb = { name: string; path: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ name: 'La Boire Bavard', path: '/' }, ...items]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${BASE_URL}${crumb.path === '/' ? '' : crumb.path}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
