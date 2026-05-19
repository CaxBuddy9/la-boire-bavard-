import type { Metadata } from 'next'
import { buildQRDataUri } from '@/lib/qr'

export const metadata: Metadata = {
  title: "Cartes d'accueil — La Boire Bavard",
  robots: { index: false, follow: false },
}

const BASE_URL      = 'https://la-boire-bavard.vercel.app'
const WIFI_RESEAU   = 'Livebox-D6B0'
const WIFI_PASSWORD = 'LSjfprSMoDSZCMp9xY'
const WIFI_QR_DATA  = `WIFI:T:WPA;S:${WIFI_RESEAU};P:${WIFI_PASSWORD};;`

// ─── À COMPLÉTER ────────────────────────────────────────────────────────────
const CODE_JARDIN = 'À COMPLÉTER'
const TEL         = '06 75 78 63 35'           // Sandrine — téléphone du site
const TEL2        = 'À COMPLÉTER'              // 2ᵉ contact
const ADRESSE     = '4 chemin de la Boire Bavard · 49320 Blaison-Saint-Sulpice'

// Une identité de couleur par chambre — tons riches et élégants
const ROOMS = [
  { id: 'jardin', label: 'Côté Jardin', accent: '#d98c5f', ink: '#4a2418', verso: '#8a3f28', qr: '#3a1d12' }, // terre cuite chaude
  { id: 'cedre',  label: 'Côté Cèdre',  accent: '#c8aa66', ink: '#2c3a30', verso: '#2f4536', qr: '#1e2a22' }, // vert cèdre profond + or
  { id: 'vallee', label: 'Côté Vallée', accent: '#79b4c6', ink: '#1d3a47', verso: '#234a5c', qr: '#13313d' }, // bleu Loire
]

const card = {
  width: '100mm', height: '70mm', borderRadius: '3mm', overflow: 'hidden',
  position: 'relative' as const, boxShadow: '0 2px 12px rgba(0,0,0,.16)', margin: '0 auto',
}

export default function CartesPage() {
  return (
    <main style={{ fontFamily: 'Georgia, serif', background: '#e8e3d8', minHeight: '100vh', padding: '26px 16px' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          main { background: #fff !important; padding: 0 !important; }
          .card-row { page-break-inside: avoid; }
        }
      `}</style>

      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <div className="no-print" style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.55rem', color: '#2a2018', margin: '0 0 8px' }}>Cartes d&apos;accueil</h1>
          <p style={{ fontSize: '0.85rem', color: '#6a6258', margin: 0, lineHeight: 1.65 }}>
            Une carte par chambre — recto (infos + QR codes) et verso (couleur de la chambre).<br />
            Imprimez, découpez, et collez le recto et le verso dos à dos. Ctrl + P pour imprimer.
          </p>
        </div>

        {ROOMS.map((room) => {
          const guideQr = buildQRDataUri(`${BASE_URL}/guide/${room.id}`, room.qr)
          const wifiQr  = buildQRDataUri(WIFI_QR_DATA, room.qr)
          const miniLabel = { fontFamily: 'Arial, sans-serif', fontSize: '1.85mm', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: room.accent }
          const tag = (s: string) => <strong style={{ color: room.accent, fontFamily: 'Arial, sans-serif', fontSize: '1.7mm', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{s}</strong>

          return (
            <div key={room.id} className="card-row" style={{ marginBottom: 30 }}>

              {/* ── RECTO ── */}
              <div style={{ ...card, background: '#fffdf8', border: '0.3mm solid rgba(0,0,0,.12)', marginBottom: '4mm' }}>
                <div style={{ height: '5mm', background: room.accent }} />
                <div style={{ padding: '3.5mm 6mm 0' }}>
                  <p style={{ margin: 0, fontFamily: 'Arial, sans-serif', fontSize: '2mm', letterSpacing: '0.32em', textTransform: 'uppercase', color: room.accent }}>
                    La Boire Bavard
                  </p>
                  <p style={{ margin: '0.5mm 0 0', fontSize: '5.2mm', color: room.ink, fontStyle: 'italic' }}>{room.label}</p>

                  {/* QR codes + WiFi */}
                  <div style={{ display: 'flex', gap: '4mm', marginTop: '2.8mm', alignItems: 'flex-start' }}>
                    {[{ q: guideQr, l: 'Carnet' }, { q: wifiQr, l: 'WiFi' }].map(({ q, l }) => (
                      <div key={l} style={{ textAlign: 'center' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={q} alt={`QR ${l}`} style={{ width: '21mm', height: '21mm', display: 'block' }} />
                        <p style={{ ...miniLabel, color: room.ink, margin: '0.8mm 0 0' }}>{l}</p>
                      </div>
                    ))}
                    <div style={{ flex: 1, fontSize: '2.5mm', color: room.ink, lineHeight: 1.4 }}>
                      <p style={{ margin: '0 0 1.8mm' }}><span style={miniLabel}>Réseau WiFi</span><br />{WIFI_RESEAU}</p>
                      <p style={{ margin: 0, wordBreak: 'break-all' }}><span style={miniLabel}>Mot de passe</span><br />{WIFI_PASSWORD}</p>
                    </div>
                  </div>

                  {/* Infos pratiques */}
                  <div style={{ marginTop: '2.6mm', paddingTop: '2.2mm', borderTop: `0.3mm solid ${room.accent}40`, fontSize: '2.15mm', color: room.ink, lineHeight: 1.7 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{tag('Arrivée')} dès 16h</span>
                      <span>{tag('Départ')} avant 10h</span>
                      <span>{tag('Petit-déj')} 8h–10h</span>
                    </div>
                    <div>{tag('Code jardin')} {CODE_JARDIN}</div>
                    <div>{tag('Contacts')} Sandrine {TEL} · {TEL2}</div>
                    <div style={{ color: `${room.ink}99` }}>{ADRESSE}</div>
                  </div>
                </div>
              </div>

              {/* ── VERSO ── */}
              <div style={{ ...card, background: room.verso, border: `0.3mm solid ${room.accent}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 38%, ${room.accent}22 0%, transparent 62%)` }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/icon-192.png" alt="" style={{ width: '21mm', height: '21mm', position: 'relative' }} />
                <p style={{ margin: '2.5mm 0 0', fontSize: '5.6mm', color: '#fffdf8', fontStyle: 'italic', position: 'relative' }}>La Boire Bavard</p>
                <div style={{ width: '13mm', height: '0.4mm', background: room.accent, margin: '2mm 0', position: 'relative' }} />
                <p style={{ margin: 0, fontFamily: 'Arial, sans-serif', fontSize: '2.4mm', letterSpacing: '0.26em', textTransform: 'uppercase', color: room.accent, position: 'relative' }}>
                  {room.label}
                </p>
                <p style={{ margin: '3.5mm 0 0', fontSize: '3mm', color: 'rgba(253,252,249,.7)', position: 'relative' }}>{TEL}</p>
              </div>

            </div>
          )
        })}
      </div>
    </main>
  )
}
