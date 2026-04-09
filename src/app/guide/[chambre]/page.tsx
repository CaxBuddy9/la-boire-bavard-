import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import GuideIntro from '@/components/GuideIntro'

// ─── À modifier facilement ────────────────────────────────────────────────────
const WIFI_RESEAU   = 'LaBoireBavard'
const WIFI_PASSWORD = 'boire2024'
const CHECKIN       = '15h00'
const CHECKOUT      = '11h00'
const PETIT_DEJ     = '7h30 – 10h00'
const TABLE_PRIX    = '25 €'
// ─────────────────────────────────────────────────────────────────────────────

type GuideRoom = {
  name: string
  emoji: string
  bg: string
  mot: string          // mot d'ambiance affiché dans le header
  details: string[]
}

const ROOMS: Record<string, GuideRoom> = {
  jardin: {
    name: 'Côté Jardin',
    emoji: '🌿',
    bg: '#1a3320',
    mot: 'Cheminée & terrasse privée',
    details: [
      "La terrasse privée s'ouvre directement depuis votre chambre",
      "La cheminée est disponible sur demande, Sandrine s'en occupe",
      "Grande chambre familiale jusqu'à 4 personnes",
    ],
  },
  cedre: {
    name: 'Côté Cèdre',
    emoji: '🌲',
    bg: '#1e2f18',
    mot: 'Romance sous le grand cèdre',
    details: [
      "Accès direct à la piscine chauffée depuis la chambre",
      "Baignoire à votre disposition pour vous détendre",
      "Chambre romantique sous le cèdre centenaire",
    ],
  },
  vallee: {
    name: 'Côté Vallée',
    emoji: '🏞️',
    bg: '#1a2830',
    mot: 'Vue sur la Loire & les vignes',
    details: [
      "Vue panoramique sur la Loire et le vignoble depuis votre fenêtre",
      "Entrée indépendante via votre escalier privatif",
      "Le lever du soleil sur la Loire est absolument splendide d'ici",
    ],
  },
  potager: {
    name: 'Côté Potager',
    emoji: '🌱',
    bg: '#1e2f16',
    mot: 'Calme absolu face au jardin',
    details: [
      "Salle de bain privée séparée de la chambre",
      "Vue sur le potager et les herbes aromatiques",
      "Calme absolu, parfait pour se ressourcer vraiment",
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
    <GuideIntro roomName={room.name}>
      <div style={{ fontFamily: 'var(--font-raleway, Arial, sans-serif)', background: '#fdf8f0', minHeight: '100vh' }}>

        {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
        <div style={{
          background: room.bg,
          padding: '3.5rem 2rem 5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Cercle déco fond */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(196,160,80,0.06)', pointerEvents: 'none' }} />

          <p style={{ color: '#c4a050', fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            La Boire Bavard · Anjou
          </p>
          <div style={{ fontSize: '4rem', marginBottom: '0.75rem', lineHeight: 1 }}>{room.emoji}</div>
          <h1 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: 'clamp(2rem, 7vw, 2.8rem)',
            fontWeight: 400,
            color: 'white',
            margin: '0 0 0.5rem',
          }}>
            {room.name}
          </h1>
          <p style={{ color: '#8aaa7a', fontSize: '1rem', fontStyle: 'italic', margin: 0 }}>{room.mot}</p>
          <div style={{ width: 40, height: 2, background: '#c4a050', margin: '1.75rem auto 0', borderRadius: 1 }} />
        </div>

        {/* ── Vague de séparation ── */}
        <div style={{ background: room.bg, height: 40, position: 'relative' }}>
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, width: '100%', height: '100%' }}>
            <path d="M0,0 C360,40 1080,40 1440,0 L1440,40 L0,40 Z" fill="#fdf8f0" />
          </svg>
        </div>

        {/* ══ CONTENU ══════════════════════════════════════════════════════════ */}
        <div style={{ maxWidth: 540, margin: '0 auto', padding: '0.5rem 1.25rem 7rem' }}>

          {/* ── Mot de bienvenue de Sandrine ── */}
          <div style={{
            background: 'white',
            borderRadius: 20,
            padding: '1.75rem 1.5rem',
            marginBottom: '1.5rem',
            borderLeft: `5px solid ${room.bg}`,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <p style={{ fontSize: '1.1rem', color: '#2a2a2a', lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}>
              "Je suis heureuse de vous accueillir ici. Cette maison est la mienne et je mets tout en œuvre pour que votre séjour soit inoubliable. N'hésitez jamais à me demander quoi que ce soit."
            </p>
            <p style={{ fontSize: '0.9rem', color: '#c4a050', fontWeight: 700, margin: '1rem 0 0', letterSpacing: '0.05em' }}>
              — Sandrine
            </p>
          </div>

          {/* ── WiFi — section la plus visible ── */}
          <div style={{
            background: room.bg,
            borderRadius: 20,
            padding: '1.75rem 1.5rem',
            marginBottom: '1.5rem',
          }}>
            <p style={{ color: '#c4a050', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '1.25rem', textAlign: 'center' }}>
              📶 Connexion WiFi
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                <p style={{ color: '#8aaa7a', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem' }}>Réseau</p>
                <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', margin: 0, letterSpacing: '0.03em' }}>{WIFI_RESEAU}</p>
              </div>
              <div style={{ flex: 1, background: '#c4a050', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem' }}>Mot de passe</p>
                <p style={{ color: '#1a3320', fontSize: '1.3rem', fontWeight: 800, fontFamily: 'monospace', margin: 0, letterSpacing: '0.06em' }}>{WIFI_PASSWORD}</p>
              </div>
            </div>
          </div>

          {/* ── Infos pratiques (check-in / petit-dej) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.5rem' }}>
            <InfoCard emoji="🕐" label="Arrivée" valeur={`Dès ${CHECKIN}`} bg="#fff" accent={room.bg} />
            <InfoCard emoji="🚪" label="Départ" valeur={`Avant ${CHECKOUT}`} bg="#fff" accent={room.bg} />
            <InfoCard emoji="☕" label="Petit-déjeuner" valeur={PETIT_DEJ} bg="#fff" accent={room.bg} />
            <InfoCard emoji="🍽️" label="Table d'hôtes" valeur={`${TABLE_PRIX} / pers.`} bg="#fff" accent={room.bg} />
          </div>

          {/* ── Votre chambre ── */}
          <Section titre="Votre chambre" emoji={room.emoji} accent={room.bg}>
            {room.details.map((d, i) => <Ligne key={i} texte={d} />)}
          </Section>

          {/* ── Petit-déjeuner ── */}
          <Section titre="Le petit-déjeuner" emoji="☕" accent={room.bg}>
            <p style={pStyle}>
              Servi en salle ou en terrasse selon la météo, de <strong>7h30 à 10h00</strong>.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.875rem' }}>
              {["Confitures maison", "Viennoiseries", "Oeufs frais", "Fromages d'Anjou", "Jus de fruits", "Café · Thé · Chocolat"].map(item => (
                <span key={item} style={{
                  background: '#f5f0e6', color: '#3a3a3a', borderRadius: 20,
                  padding: '0.35rem 0.85rem', fontSize: '0.88rem', fontWeight: 500,
                }}>
                  {item}
                </span>
              ))}
            </div>
            <p style={{ ...pStyle, color: '#888', fontStyle: 'italic', marginTop: '0.875rem', fontSize: '0.9rem' }}>
              Régime alimentaire particulier ? Dites-le à Sandrine, elle s'adapte avec plaisir.
            </p>
          </Section>

          {/* ── Piscine ── */}
          <Section titre="Piscine & Bien-être" emoji="🏊" accent={room.bg}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.875rem' }}>
              <Badge label="Piscine chauffée" valeur="9h – 21h" />
              <Badge label="Spa & Sauna" valeur="Sur réservation" />
            </div>
            <Ligne texte="Douche avant d'entrer dans la piscine" />
            <Ligne texte="Serviettes de piscine disponibles sur demande" />
            <Ligne texte="Silence demandé après 22h" />
          </Section>

          {/* ── Table d'hôtes ── */}
          <Section titre="Dîner · Table d'hôtes" emoji="🍽️" accent={room.bg}>
            <p style={pStyle}>
              Sandrine prépare chaque soir un dîner fait maison autour de la grande table — produits du terroir angevin, légumes du potager, vins d'Anjou.
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              background: '#fff5f0', border: '2px solid #e07050',
              borderRadius: 14, padding: '1rem 1.25rem', marginTop: '1rem',
            }}>
              <span style={{ fontSize: '2rem' }}>⚠️</span>
              <div>
                <p style={{ fontSize: '1rem', color: '#b03020', fontWeight: 700, margin: 0 }}>Réservation avant 18h</p>
                <p style={{ fontSize: '0.88rem', color: '#904030', margin: '0.2rem 0 0' }}>Par WhatsApp ou directement auprès de Sandrine</p>
              </div>
            </div>
          </Section>

          {/* ── Bons plans ── */}
          <Section titre="À découvrir autour de vous" emoji="📍" accent={room.bg}>
            <Destination emoji="🍷" lieu="Vignobles d'Anjou" info="Coteaux de l'Aubance — à 5 min" />
            <Destination emoji="🚴" lieu="Loire à Vélo" info="Départ depuis la propriété" />
            <Destination emoji="🏰" lieu="Château de Brissac" info="Le plus haut de France — 10 min" />
            <Destination emoji="🏙️" lieu="Angers" info="Château, cathédrale, marché — 25 min" />
            <Destination emoji="🌸" lieu="Saumur" info="Caves, château, équitation — 35 min" />
            <Destination emoji="⛵" lieu="Bords de Loire" info="Balade à pied depuis la propriété" />
            <p style={{ ...pStyle, color: '#888', fontStyle: 'italic', marginTop: '0.875rem', fontSize: '0.9rem' }}>
              Sandrine connaît les meilleures tables et adresses — demandez-lui !
            </p>
          </Section>

          {/* ── Règles de la maison ── */}
          <Section titre="La maison" emoji="🏡" accent={room.bg}>
            <Ligne texte="Non-fumeur à l'intérieur (terrasse à disposition)" />
            <Ligne texte="Animaux non acceptés" />
            <Ligne texte="Nuisances sonores à éviter après 22h" />
            <Ligne texte="Clé à remettre à Sandrine avant de partir" />
          </Section>

          {/* ── Départ ── */}
          <Section titre="Avant de partir" emoji="👋" accent={room.bg}>
            <Ligne texte="Déposez la clé sur la porte ou remettez-la à Sandrine" />
            <Ligne texte="Fermez les volets et les fenêtres" />
            <Ligne texte="Un problème ? Signalez-le sans hésiter, ça arrive !" />
            <div style={{ background: '#f5f0e6', borderRadius: 14, padding: '1.25rem', marginTop: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.05rem', color: '#2a2a2a', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
                Merci d'avoir choisi La Boire Bavard.<br />
                <span style={{ color: '#c4a050', fontStyle: 'normal', fontWeight: 700 }}>Nous espérons vous revoir bientôt. 💛</span>
              </p>
            </div>
          </Section>

          {/* ── Avis ── */}
          <div style={{
            background: room.bg,
            borderRadius: 20,
            padding: '2rem 1.5rem',
            textAlign: 'center',
            marginBottom: '1rem',
          }}>
            <p style={{ color: '#c4a050', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Votre avis compte beaucoup
            </p>
            <p style={{ color: '#ddd', fontSize: '1.05rem', lineHeight: 1.75, margin: 0 }}>
              Un petit avis sur <strong style={{ color: 'white' }}>Booking.com</strong> ou <strong style={{ color: 'white' }}>Google</strong> aide enormément Sandrine à faire connaître la maison. Merci du cœur 🙏
            </p>
            <p style={{ color: '#7a9a6a', fontSize: '0.88rem', marginTop: '0.75rem' }}>Note actuelle : ⭐ 9,9 / 10</p>
          </div>

        </div>

        {/* ══ BARRE BAS ══════════════════════════════════════════════════════ */}
        <div style={{
          position: 'fixed', bottom: 0,
          left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 540,
          background: 'rgba(253,248,240,0.97)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          padding: '0.875rem 1.25rem 1rem',
          display: 'flex', gap: '0.75rem',
        }}>
          <a
            href="https://wa.me/33675786335"
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, background: '#25D366', color: 'white', borderRadius: 14, padding: '1rem 0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none', display: 'block', boxShadow: '0 4px 12px rgba(37,211,102,0.3)' }}
          >
            💬 WhatsApp
          </a>
          <a
            href="tel:+33675786335"
            style={{ flex: 1, background: room.bg, color: 'white', borderRadius: 14, padding: '1rem 0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none', display: 'block' }}
          >
            📞 Appeler
          </a>
        </div>

      </div>
    </GuideIntro>
  )
}

// ── Composants ──────────────────────────────────────────────────────────────

const pStyle: React.CSSProperties = { fontSize: '1rem', color: '#444', lineHeight: 1.75, marginTop: '0.25rem' }

function Section({ titre, emoji, accent, children }: { titre: string; emoji: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', borderRadius: 20, marginBottom: '1.25rem', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <div style={{ background: accent, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
        <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '1.2rem', fontWeight: 500, color: 'white', margin: 0 }}>{titre}</h2>
      </div>
      <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>{children}</div>
    </div>
  )
}

function InfoCard({ emoji, label, valeur, bg, accent }: { emoji: string; label: string; valeur: string; bg: string; accent: string }) {
  return (
    <div style={{ background: bg, borderRadius: 16, padding: '1.1rem 1rem', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', borderTop: `3px solid ${accent}` }}>
      <div style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{emoji}</div>
      <p style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.3rem' }}>{label}</p>
      <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{valeur}</p>
    </div>
  )
}

function Badge({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div style={{ flex: 1, background: '#f5f0e6', borderRadius: 10, padding: '0.6rem 0.75rem', textAlign: 'center' }}>
      <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 0.2rem' }}>{label}</p>
      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a3320', margin: 0 }}>{valeur}</p>
    </div>
  )
}

function Ligne({ texte }: { texte: string }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.45rem 0', fontSize: '1rem', color: '#333', lineHeight: 1.65 }}>
      <span style={{ color: '#c4a050', fontWeight: 700, flexShrink: 0, fontSize: '1.1rem', marginTop: '0.05rem' }}>·</span>
      <span>{texte}</span>
    </div>
  )
}

function Destination({ emoji, lieu, info }: { emoji: string; lieu: string; info: string }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.7rem 0.875rem', marginBottom: '0.5rem', background: '#fdf8f0', borderRadius: 12 }}>
      <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{emoji}</span>
      <div>
        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1a3320', margin: 0 }}>{lieu}</p>
        <p style={{ fontSize: '0.88rem', color: '#777', margin: '0.15rem 0 0' }}>{info}</p>
      </div>
    </div>
  )
}
