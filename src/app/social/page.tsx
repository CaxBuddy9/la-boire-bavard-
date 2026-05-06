export const metadata = {
  title: "Kit Réseaux Sociaux — La Boire Bavard",
  robots: { index: false },
}

const POSTS = [
  {
    platform: 'Instagram',
    format: 'Carré 1:1 ou Portrait 4:5',
    category: 'Présentation',
    caption: `✨ Entre Loire et vignoble, une maison d'hôtes pas comme les autres.

La Boire Bavard, c'est 4 chambres de caractère, un petit-déjeuner gourmand, une piscine chauffée et une hôtesse qui pense à tout — Sandrine.

Note 9.9/10 sur Booking.com 🌿

📍 Blaison-Saint-Sulpice, Anjou
🔗 Réservation dans la bio

#chambreshotes #anjou #loirevalley #weekendgetaway #maisondecampagne #luxefrancais #loireavelo #anjoutourisme #vacancesenfrance #boutiquehôtel`,
  },
  {
    platform: 'Instagram',
    format: 'Carré 1:1',
    category: 'Chambre — Côté Cèdre',
    caption: `🌳 Dormir sous un cèdre centenaire.

La chambre Côté Cèdre, c'est l'accès direct à la piscine depuis la chambre, une baignoire, et une vue sur notre grand cèdre qui veille depuis 200 ans.

Faite pour les amoureux. 88€/nuit petit-déjeuner inclus.

📩 Réservation : lien en bio

#romantique #chambrehotes #anjou #semainedamour #escapadeamoureuse #loirevalley #weekendromantiqu #sejourangers #voyagefrance`,
  },
  {
    platform: 'Instagram',
    format: 'Carré 1:1',
    category: 'Petit-déjeuner',
    caption: `☀️ Le petit-déjeuner qui donne envie de ne pas partir.

Confitures maison, viennoiseries du boulanger, fromages locaux, fruits de saison... et la vue sur le jardin.

Inclus dans chaque nuit à La Boire Bavard 🧡

#petitdejeuner #breakfasttime #maisondehotes #anjou #produitsloc aux #foodfrance #gourmet #voyagegastronomie`,
  },
  {
    platform: 'Instagram',
    format: 'Reels / Stories',
    category: 'Teaser vidéo',
    caption: `La Loire à 2 km. La piscine chauffée. Le silence. 🌊

C'est ça, La Boire Bavard.

👉 Link in bio pour réserver votre séjour en Anjou.

#reels #anjou #loireavelo #piscine #naturefrance #slowtravel #visitefrancaise #loirevalley`,
  },
  {
    platform: 'Facebook',
    format: 'Post standard (1200×630)',
    category: 'Présentation complète',
    caption: `🏡 La Boire Bavard — Chambres d'Hôtes en Anjou

Niché entre la vallée de la Loire et les vignobles d'Anjou, notre domaine vous accueille dans 4 chambres d'exception, chacune avec sa personnalité : vue Loire, accès jardin, terrasse privée ou romantisme sous le grand cèdre.

✅ Note Exceptionnel 9.9/10 sur Booking
✅ Petit-déjeuner gourmand inclus — 88€/nuit
✅ Piscine chauffée, spa, jardin
✅ Table d'hôtes le vendredi soir (25€/pers.)
✅ À 25 min d'Angers, sur la Loire à Vélo

📞 06 75 78 63 35
📧 laboirebavard@gmail.com
🌐 Réservation en ligne disponible

Sandrine vous attend 🌿`,
  },
  {
    platform: 'Facebook',
    format: 'Post événementiel',
    category: 'Table d\'hôtes',
    caption: `🍷 Vendredi soir — Table d'Hôtes à La Boire Bavard

Sandrine vous régale avec les produits du jardin et du terroir anjou. Vins locaux, ambiance maison, convivialité garantie.

25€ par personne · Sur réservation uniquement
Ouvert aux hôtes présents ce soir-là.

Réservez votre séjour et signalez votre intérêt pour la table 👇

📞 06 75 78 63 35 | 💬 WhatsApp : wa.me/33675786335`,
  },
  {
    platform: 'Facebook',
    format: 'Post avis client',
    category: 'Témoignage',
    caption: `⭐⭐⭐⭐⭐ "Un lieu rare où le temps s'arrête. Sandrine a créé quelque chose d'exceptionnel."
— Claire & Antoine, Lyon

Merci pour ce beau témoignage 🙏

La Boire Bavard — 9.9/10 · Exceptionnel sur Booking.com
📍 Blaison-Saint-Sulpice, Anjou`,
  },
]

const HASHTAGS = {
  core: ['#laboirebavard', '#chambreshotes', '#anjou', '#loirevalley', '#maisondehotes'],
  tourisme: ['#anjoutourisme', '#loireavelo', '#vignobledanjou', '#sejourfrance', '#tourismefrance'],
  ambiance: ['#slowtravel', '#naturelovers', '#campagne', '#escapadecampagne', '#weekendfrancais'],
  hotel: ['#boutiquehote', '#luxurytravel', '#petitdej', '#piscine', '#bien-etre'],
}

const OG_SPECS = [
  { page: 'Accueil', file: '/photos/exterieur/maison-facade-printemps.jpg', title: "La Boire Bavard — Chambres d'Hôtes en Anjou", desc: "Maison d'hôtes de charme 9.9/10. Piscine, spa, petit-déjeuner gourmand. 88€/nuit." },
  { page: 'Chambres', file: '/photos/chambres/jardin/chambre-jardin-vue-ensemble-clair.jpeg', title: "4 Chambres — La Boire Bavard", desc: "Côté Jardin, Côté Cèdre, Côté Vallée, Côté Potager. Vue Loire, piscine, cheminée." },
  { page: 'Avis', file: '/photos/chambres/potager/chambre-potager-entree.jpeg', title: "Avis 9.9/10 — La Boire Bavard", desc: "200+ avis Exceptionnel. Découvrez ce que nos hôtes disent de leur séjour." },
  { page: 'Petit-déjeuner', file: '/photos/petitdej/petit-dejeuner-01.jpeg', title: "Petit-déjeuner Gourmand — La Boire Bavard", desc: "Confitures maison, viennoiseries fraîches, fromages locaux. Inclus dans chaque nuit." },
]

export default function SocialPage() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: '40px 24px', background: '#f9f9f7', color: '#111' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>Kit Réseaux Sociaux</h1>
      <p style={{ color: '#666', marginBottom: 40 }}>La Boire Bavard — Contenus prêts à publier sur Instagram & Facebook</p>

      {/* Posts */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 20, borderBottom: '2px solid #c4a050', paddingBottom: 8 }}>Posts prêts à copier</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 48 }}>
        {POSTS.map((p, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid #e5e5e3', padding: 24 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ background: p.platform === 'Instagram' ? '#e1306c' : '#1877f2', color: 'white', padding: '3px 10px', fontSize: '.72rem', fontWeight: 600 }}>{p.platform}</span>
              <span style={{ background: '#f5f0e8', color: '#7a6030', padding: '3px 10px', fontSize: '.72rem' }}>{p.format}</span>
              <span style={{ color: '#999', fontSize: '.72rem', alignSelf: 'center' }}>{p.category}</span>
            </div>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '.9rem', lineHeight: 1.7, color: '#222', margin: 0, borderLeft: '3px solid #c4a050', paddingLeft: 16 }}>
              {p.caption}
            </pre>
          </div>
        ))}
      </div>

      {/* Hashtags */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16, borderBottom: '2px solid #c4a050', paddingBottom: 8 }}>Banque de hashtags</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 48 }}>
        {Object.entries(HASHTAGS).map(([cat, tags]) => (
          <div key={cat} style={{ background: 'white', border: '1px solid #e5e5e3', padding: 16 }}>
            <p style={{ fontSize: '.65rem', letterSpacing: '.15em', textTransform: 'uppercase', color: '#c4a050', marginBottom: 10 }}>{cat}</p>
            {tags.map(t => (
              <span key={t} style={{ display: 'inline-block', marginRight: 6, marginBottom: 6, fontSize: '.78rem', color: '#444' }}>{t}</span>
            ))}
          </div>
        ))}
      </div>

      {/* OG Images */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16, borderBottom: '2px solid #c4a050', paddingBottom: 8 }}>Open Graph — partage liens</h2>
      <p style={{ color: '#666', fontSize: '.88rem', marginBottom: 16 }}>Ces métadonnées sont déjà configurées. Quand quelqu'un partage une URL du site sur Facebook/Instagram, voici l'aperçu qui s'affiche :</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
        {OG_SPECS.map((s, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid #e5e5e3', padding: 16, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 60, height: 44, background: '#f0ebe0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', color: '#999' }}>📷</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '.9rem', marginBottom: 2 }}>{s.title}</p>
              <p style={{ fontSize: '.8rem', color: '#666', marginBottom: 4 }}>{s.desc}</p>
              <p style={{ fontSize: '.7rem', color: '#c4a050' }}>Page : {s.page} · Image : {s.file}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Formats images */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16, borderBottom: '2px solid #c4a050', paddingBottom: 8 }}>Formats recommandés</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
        <thead>
          <tr style={{ background: '#f5f0e8' }}>
            {['Réseau', 'Format', 'Résolution', 'Usage'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600, color: '#7a6030' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ['Instagram', 'Carré', '1080×1080', 'Post feed principal'],
            ['Instagram', 'Portrait', '1080×1350', 'Feed — occupe plus de place'],
            ['Instagram', 'Story / Reels', '1080×1920', 'Stories et Reels'],
            ['Facebook', 'Post', '1200×630', 'Post standard + partage lien'],
            ['Facebook', 'Cover', '820×312', 'Photo de couverture page'],
            ['OG Image', 'Link preview', '1200×630', 'Aperçu quand on partage une URL'],
          ].map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee', background: i % 2 ? '#fafafa' : 'white' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '10px 12px', color: j === 0 ? '#333' : '#555' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: 32, padding: 16, background: '#fff8e8', border: '1px solid #c4a050', fontSize: '.85rem', color: '#7a6030' }}>
        💡 <strong>Conseil :</strong> Dès que vous avez les vraies photos de Sandrine, exportez-les en JPEG 1080px minimum, nommez-les explicitement (ex: <code>chambre-cote-cedre-piscine.jpg</code>), et utilisez-les en priorité sur les posts Instagram portrait 4:5 — ce format a les meilleurs taux d'engagement.
      </p>
    </div>
  )
}
