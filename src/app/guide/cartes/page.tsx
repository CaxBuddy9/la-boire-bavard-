import type { Metadata } from 'next'
import { buildQRDataUri } from '@/lib/qr'
import { ROOM_COLORS } from '@/lib/rooms'

export const metadata: Metadata = {
  title: "Cartes d'accueil hôtes — La Boire Bavard",
  robots: { index: false, follow: false },
}

const BASE_URL = 'https://la-boire-bavard.vercel.app'

// ─── À COMPLÉTER ────────────────────────────────────────────────────────────
// Renseignez ici les infos manquantes : elles apparaîtront sur les 3 cartes.
const INFO = {
  codeJardin:        'À COMPLÉTER',          // code du portail / accès jardin
  contactNom:        'Sandrine',
  contactTel:        '06 75 78 63 35',
  contact2Nom:       'En cas d’absence', // ex. « Maman » — second contact
  contact2Tel:       'À COMPLÉTER',
}

const WIFI_RESEAU   = 'Livebox-D6B0'
const WIFI_PASSWORD = 'LSjfprSMoDSZCMp9xY'

const CHAMBRES = [
  { id: 'jardin', label: 'Côté Jardin', emoji: '🌿' },
  { id: 'cedre',  label: 'Côté Cèdre',  emoji: '🌲' },
  { id: 'vallee', label: 'Côté Vallée', emoji: '🏞️' },
]

const labelCaps: React.CSSProperties = {
  fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase',
  fontFamily: 'Arial, sans-serif', fontWeight: 700, margin: 0,
}

export default function CartesAccueilPage() {
  return (
    <main style={{
      fontFamily: 'Georgia, serif',
      background: 'linear-gradient(160deg, #f5f0e8 0%, #ede8dc 100%)',
      minHeight: '100vh',
      padding: '2.5rem 1.5rem',
    }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          main { background: #fff !important; padding: 0 !important; }
        }
      `}</style>

      <div style={{ maxWidth: 620, margin: '0 auto' }}>

        {/* Note (non imprimée) */}
        <div className="no-print" style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.7rem', color: '#1a3320', margin: '0 0 0.5rem' }}>
            Cartes d&apos;accueil — à remettre aux hôtes
          </h1>
          <p style={{ color: '#6a6a6a', fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>
            Imprimez cette page, découpez les 3 cartes et donnez à chaque hôte celle de sa chambre.<br />
            Pour compléter le code du jardin et le 2ᵉ contact, éditez{' '}
            <code style={{ fontFamily: 'monospace', color: '#1a3320' }}>src/app/guide/cartes/page.tsx</code>.
          </p>
        </div>

        {/* 3 cartes */}
        {CHAMBRES.map(({ id, label, emoji }) => {
          const c = ROOM_COLORS[id]
          const guideUrl = `${BASE_URL}/guide/${id}`
          const guideQr  = buildQRDataUri(guideUrl, '#1a3320')

          return (
            <div key={id} style={{
              background: '#fffdf8',
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid rgba(196,160,80,0.3)',
              boxShadow: '0 4px 18px rgba(0,0,0,0.1)',
              marginBottom: '1.5rem',
              pageBreakInside: 'avoid',
            }}>
              {/* En-tête chambre */}
              <div style={{ background: c.bg, padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ ...labelCaps, color: c.accent }}>La Boire Bavard</p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', color: '#fffdf8', margin: '0.15rem 0 0' }}>
                    {emoji} {label}
                  </p>
                </div>
                <p style={{ ...labelCaps, color: 'rgba(255,255,255,0.55)' }}>Bienvenue</p>
              </div>

              {/* Corps */}
              <div style={{ padding: '1.35rem 1.5rem' }}>

                {/* 2 QR codes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={guideQr} alt={`QR carnet ${label}`} width={138} height={138} style={{ display: 'block', margin: '0 auto', borderRadius: 8 }} />
                    <p style={{ ...labelCaps, color: '#1a3320', marginTop: '0.5rem' }}>Carnet d&apos;accueil</p>
                    <p style={{ fontSize: '0.72rem', color: '#8a8a8a', margin: '0.15rem 0 0' }}>Infos, conseils, carte</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/photos/wifi-qr-lbb.png" alt="QR WiFi" width={138} height={138} style={{ display: 'block', margin: '0 auto', borderRadius: 8 }} />
                    <p style={{ ...labelCaps, color: '#1a3320', marginTop: '0.5rem' }}>Connexion WiFi</p>
                    <p style={{ fontSize: '0.72rem', color: '#8a8a8a', margin: '0.15rem 0 0' }}>Scan = connexion auto</p>
                  </div>
                </div>

                {/* WiFi détaillé */}
                <div style={{ background: '#f5f0e8', borderRadius: 10, padding: '0.7rem 0.9rem', marginBottom: '0.9rem', display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ ...labelCaps, color: '#9a8a72' }}>Réseau WiFi</p>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.92rem', color: '#2a2018', margin: '0.1rem 0 0', fontWeight: 700 }}>{WIFI_RESEAU}</p>
                  </div>
                  <div>
                    <p style={{ ...labelCaps, color: '#9a8a72' }}>Mot de passe</p>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.92rem', color: '#2a2018', margin: '0.1rem 0 0', fontWeight: 700 }}>{WIFI_PASSWORD}</p>
                  </div>
                </div>

                {/* Infos pratiques */}
                {[
                  { l: 'Code du jardin', v: INFO.codeJardin },
                  { l: INFO.contactNom, v: INFO.contactTel },
                  { l: INFO.contact2Nom, v: INFO.contact2Tel },
                  { l: 'Arrivée / Départ', v: 'Dès 16h00  ·  avant 10h00' },
                  { l: 'Petit-déjeuner', v: '8h00 – 10h00' },
                ].map(({ l, v }) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', padding: '0.4rem 0', borderBottom: '1px dotted rgba(26,51,32,0.18)' }}>
                    <span style={{ ...labelCaps, color: '#9a8a72' }}>{l}</span>
                    <span style={{
                      fontSize: '0.92rem', color: v === 'À COMPLÉTER' ? '#c4603a' : '#2a2018',
                      fontWeight: 700, textAlign: 'right',
                    }}>{v}</span>
                  </div>
                ))}

                {/* Adresse */}
                <p style={{ fontSize: '0.76rem', color: '#8a8a8a', margin: '0.85rem 0 0', textAlign: 'center', fontStyle: 'italic' }}>
                  4 chemin de la Boire Bavard, La Hutte · 49320 Blaison-Saint-Sulpice
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
