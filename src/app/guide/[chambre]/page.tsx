import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// ─── À modifier facilement ────────────────────────────────────────────────────
const WIFI_RESEAU   = 'LaBoireBavard'
const WIFI_PASSWORD = 'boire2024'
const CHECKIN       = '15h00'
const CHECKOUT      = '11h00'
const PETIT_DEJ     = '7h30 – 10h00'
const TABLE_PRIX    = '25 € par personne'
// ─────────────────────────────────────────────────────────────────────────────

type GuideRoom = {
  name: string
  emoji: string
  bg: string
  details: string[]
}

const ROOMS: Record<string, GuideRoom> = {
  jardin: {
    name: 'Côté Jardin',
    emoji: '🌿',
    bg: '#1a3320',
    details: [
      "Terrasse privée accessible directement depuis la chambre",
      "Cheminée disponible sur demande, Sandrine s'en occupe",
      "Grande chambre pour jusqu'à 4 personnes",
    ],
  },
  cedre: {
    name: 'Côté Cèdre',
    emoji: '🌲',
    bg: '#1e2f18',
    details: [
      "Accès direct à la piscine chauffée depuis la chambre",
      "Baignoire à votre disposition",
      "Chambre romantique sous le grand cèdre centenaire",
    ],
  },
  vallee: {
    name: 'Côté Vallée',
    emoji: '🏞️',
    bg: '#1a2830',
    details: [
      "Vue panoramique sur la Loire et les vignes",
      "Entrée privée par votre escalier personnel",
      "Le lever du soleil sur la Loire depuis ici est splendide",
    ],
  },
  potager: {
    name: 'Côté Potager',
    emoji: '🌱',
    bg: '#1e2f16',
    details: [
      "Salle de bain privée séparée de la chambre",
      "Vue sur le potager et les herbes aromatiques",
      "Calme absolu, parfait pour se ressourcer",
    ],
  },
}

type Props = { params: Promise<{ chambre: string }> }

export function generateStaticParams() {
  return ['jardin', 'cedre', 'vallee', 'potager'].map((chambre) => ({ chambre }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chambre } = await params
  const room = ROOMS[chambre]
  if (!room) return {}
  return {
    title: `Carnet de séjour · ${room.name} | La Boire Bavard`,
    description: `Bienvenue dans votre chambre ${room.name}. Toutes les informations pour votre séjour à La Boire Bavard en Anjou.`,
  }
}

export default async function GuidePage({ params }: Props) {
  const { chambre } = await params
  const room = ROOMS[chambre]
  if (!room) notFound()

  return (
    <main style={{ fontFamily: 'var(--font-raleway, Arial, sans-serif)', background: '#faf7f2', minHeight: '100vh' }}>

      {/* ══ EN-TÊTE ══════════════════════════════════════════════════════════ */}
      <header style={{ background: room.bg, color: 'white', padding: '2.5rem 1.5rem 2.5rem', textAlign: 'center' }}>
        <p style={{ color: '#c4a050', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          La Boire Bavard · Anjou
        </p>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>{room.emoji}</div>
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '2rem', fontWeight: 400, marginBottom: '0.25rem' }}>
          {room.name}
        </h1>
        <div style={{ width: '40px', height: '2px', background: '#c4a050', margin: '1rem auto' }} />
        <p style={{ fontSize: '1.1rem', color: '#ccc9c0', lineHeight: 1.6 }}>
          Bienvenue !<br />
          <span style={{ fontSize: '0.95rem', color: '#8aaa7a' }}>
            Sandrine est heureuse de vous accueillir.
          </span>
        </p>
      </header>

      {/* ══ CONTENU ══════════════════════════════════════════════════════════ */}
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1.25rem 8rem' }}>

        {/* ── WiFi ── priorité absolue, très visible */}
        <div style={{ background: room.bg, borderRadius: '16px', padding: '1.5rem', marginBottom: '1.25rem', textAlign: 'center' }}>
          <p style={{ color: '#c4a050', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            📶 WiFi
          </p>
          <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Réseau</p>
          <p style={{ color: 'white', fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
            {WIFI_RESEAU}
          </p>
          <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Mot de passe</p>
          <p style={{ color: '#c4a050', fontSize: '1.8rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
            {WIFI_PASSWORD}
          </p>
        </div>

        {/* ── Votre chambre ── */}
        <Bloc titre="Votre chambre" icon="🛏️">
          {room.details.map((d, i) => <Ligne key={i} texte={d} />)}
        </Bloc>

        {/* ── Petit-déjeuner ── */}
        <Bloc titre="Petit-déjeuner" icon="☕">
          <InfoLigne label="Horaires" valeur={PETIT_DEJ} />
          <p style={pStyle}>
            Servi en salle à manger ou en terrasse. Au menu : confitures maison, viennoiseries, oeufs frais, fromages d'Anjou, jus de fruits…
          </p>
          <p style={{ ...pStyle, color: '#888', fontStyle: 'italic', marginTop: '0.5rem' }}>
            Régime particulier ou allergie ? Dites-le à Sandrine, elle s'adapte.
          </p>
        </Bloc>

        {/* ── Piscine ── */}
        <Bloc titre="Piscine & Bien-être" icon="🏊">
          <InfoLigne label="Piscine chauffée" valeur="Ouverte de 9h à 21h" />
          <InfoLigne label="Spa & Sauna" valeur="Sur réservation" />
          <Ligne texte="Douche avant d'entrer dans le bassin" />
          <Ligne texte="Serviettes disponibles sur demande" />
          <Ligne texte="Silence après 22h par respect des autres hôtes" />
        </Bloc>

        {/* ── Table d'hôtes ── */}
        <Bloc titre="Dîner · Table d'hôtes" icon="🍽️">
          <InfoLigne label="Prix" valeur={TABLE_PRIX} />
          <p style={pStyle}>
            Sandrine prépare chaque soir un repas fait maison avec les produits du terroir angevin. Vins d'Anjou disponibles.
          </p>
          <div style={{ background: '#fff4f0', border: '2px solid #e07050', borderRadius: '10px', padding: '0.85rem 1rem', marginTop: '0.75rem' }}>
            <p style={{ fontSize: '1rem', color: '#c04020', fontWeight: 700, margin: 0 }}>
              Réservation avant 18h obligatoire
            </p>
            <p style={{ fontSize: '0.88rem', color: '#904020', margin: '0.25rem 0 0' }}>
              Contactez Sandrine par WhatsApp ou en venant la voir.
            </p>
          </div>
        </Bloc>

        {/* ── À visiter ── */}
        <Bloc titre="À visiter dans la région" icon="📍">
          <Destination emoji="🍷" lieu="Vignobles d'Anjou" info="Dégustation à 5 min" />
          <Destination emoji="🚴" lieu="Loire à Vélo" info="Départ depuis la propriété" />
          <Destination emoji="🏰" lieu="Château de Brissac" info="10 min en voiture" />
          <Destination emoji="🏙️" lieu="Angers" info="Centre historique · 25 min" />
          <Destination emoji="🌸" lieu="Saumur" info="Château & caves · 35 min" />
          <p style={{ ...pStyle, fontStyle: 'italic', color: '#888', marginTop: '0.75rem' }}>
            Sandrine connaît les meilleures adresses — demandez-lui !
          </p>
        </Bloc>

        {/* ── Horaires ── */}
        <Bloc titre="Arrivée & Départ" icon="🕐">
          <InfoLigne label="Arrivée (check-in)" valeur={`à partir de ${CHECKIN}`} />
          <InfoLigne label="Départ (check-out)" valeur={`avant ${CHECKOUT}`} />
          <Ligne texte="Clé à remettre à Sandrine en partant" />
          <Ligne texte="Non-fumeur à l'intérieur" />
          <Ligne texte="Animaux non acceptés" />
        </Bloc>

        {/* ── Au revoir ── */}
        <div style={{ background: '#1a3320', borderRadius: '16px', padding: '1.75rem', textAlign: 'center', marginBottom: '1.25rem' }}>
          <p style={{ color: '#c4a050', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Un avis, c'est précieux
          </p>
          <p style={{ color: '#ddd', fontSize: '1rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>
            Si votre séjour vous a plu, un avis sur <strong style={{ color: 'white' }}>Booking.com</strong> ou <strong style={{ color: 'white' }}>Google</strong> aide beaucoup Sandrine. Merci du fond du cœur 🙏
          </p>
          <p style={{ color: '#7a9a6a', fontSize: '0.85rem' }}>Note actuelle : ⭐ 9,9 / 10</p>
        </div>

        <p style={{ textAlign: 'center', color: '#c4a050', fontSize: '1rem', fontStyle: 'italic', fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
          Merci et à bientôt à La Boire Bavard 💛
        </p>

      </div>

      {/* ══ BARRE BAS — contacts ══════════════════════════════════════════════ */}
      <div style={{
        position: 'fixed', bottom: 0,
        left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '520px',
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid #ddd',
        padding: '0.875rem 1.25rem 1rem',
        display: 'flex', gap: '0.75rem',
      }}>
        <a
          href="https://wa.me/33675786335"
          target="_blank"
          rel="noopener noreferrer"
          style={{ flex: 1, background: '#25D366', color: 'white', borderRadius: '12px', padding: '1rem 0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'block' }}
        >
          💬 WhatsApp
        </a>
        <a
          href="tel:+33675786335"
          style={{ flex: 1, background: '#1a3320', color: 'white', borderRadius: '12px', padding: '1rem 0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'block' }}
        >
          📞 Appeler
        </a>
      </div>

    </main>
  )
}

// ── Composants ──────────────────────────────────────────────────────────────

const pStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  color: '#444',
  lineHeight: 1.7,
  marginTop: '0.5rem',
}

function Bloc({ titre, icon, children }: { titre: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '1.35rem 1.35rem 1rem', marginBottom: '1.25rem', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
      <h2 style={{
        fontFamily: 'var(--font-playfair, Georgia, serif)',
        fontSize: '1.2rem', fontWeight: 500, color: '#1a3320',
        marginBottom: '1rem',
        paddingBottom: '0.75rem', borderBottom: '1px solid #ece8e0',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
      }}>
        <span style={{ fontSize: '1.3rem' }}>{icon}</span> {titre}
      </h2>
      {children}
    </div>
  )
}

function InfoLigne({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid #f4f0ea' }}>
      <span style={{ fontSize: '0.95rem', color: '#666' }}>{label}</span>
      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1a3320' }}>{valeur}</span>
    </div>
  )
}

function Ligne({ texte }: { texte: string }) {
  return (
    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', padding: '0.4rem 0', fontSize: '0.95rem', color: '#333', lineHeight: 1.6 }}>
      <span style={{ color: '#c4a050', fontWeight: 700, flexShrink: 0, marginTop: '0.1rem' }}>·</span>
      <span>{texte}</span>
    </div>
  )
}

function Destination({ emoji, lieu, info }: { emoji: string; lieu: string; info: string }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.6rem 0.75rem', marginBottom: '0.4rem', background: '#faf7f2', borderRadius: '10px' }}>
      <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{emoji}</span>
      <div>
        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a3320', margin: 0 }}>{lieu}</p>
        <p style={{ fontSize: '0.85rem', color: '#777', margin: 0 }}>{info}</p>
      </div>
    </div>
  )
}
