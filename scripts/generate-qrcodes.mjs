/**
 * Génère les QR codes avec le logo BB centré
 * Usage : node scripts/generate-qrcodes.mjs
 */

import QRCode from 'qrcode'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─── À modifier si le domaine change ─────────────────────────────────────────
const BASE_URL   = 'https://la-boire-bavard.vercel.app'
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'LA BOIRE BAVARD WEBSITE')
// ─────────────────────────────────────────────────────────────────────────────

// ─── Identifiants WiFi ───────────────────────────────────────────────────────
const WIFI_SSID     = 'Livebox-D6B0'
const WIFI_PASSWORD = 'LSjfprSMoDSZCMp9xY'
const WIFI_TYPE     = 'WPA'
// ─────────────────────────────────────────────────────────────────────────────

const CHAMBRES = [
  { id: 'jardin',  label: 'Cote-Jardin'  },
  { id: 'cedre',   label: 'Cote-Cedre'   },
  { id: 'vallee',  label: 'Cote-Vallee'  },
  { id: 'potager', label: 'Cote-Potager' },
]

// ─── Monogramme BB extrait du Logo.tsx ───────────────────────────────────────
const BB_PATHS = `
  <rect x="78" y="18" width="8" height="118" rx="2" fill="#b8922a"/>
  <rect x="60" y="18" width="20" height="6"  rx="1.5" fill="#b8922a"/>
  <rect x="60" y="76" width="20" height="5"  rx="1.5" fill="#b8922a"/>
  <rect x="60" y="130" width="20" height="6" rx="1.5" fill="#b8922a"/>
  <path d="M86,18 Q44,18 44,47 Q44,76 86,76"    stroke="#b8922a" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M86,76 Q36,76 36,103 Q36,136 86,136"  stroke="#b8922a" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="114" y="18" width="8" height="118" rx="2" fill="#b8922a"/>
  <rect x="120" y="18" width="20" height="6"  rx="1.5" fill="#b8922a"/>
  <rect x="120" y="76" width="20" height="5"  rx="1.5" fill="#b8922a"/>
  <rect x="120" y="130" width="20" height="6" rx="1.5" fill="#b8922a"/>
  <path d="M114,18 Q156,18 156,47 Q156,76 114,76"   stroke="#b8922a" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M114,76 Q164,76 164,103 Q164,136 114,136" stroke="#b8922a" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="94" y="14"  width="12" height="4" rx="2" fill="#b8922a" opacity=".5"/>
  <rect x="94" y="128" width="12" height="4" rx="2" fill="#b8922a" opacity=".5"/>
`
// Le monogramme occupe environ x:36–164, y:14–136 dans le viewBox 200x320

async function generateQR(data, outputPath) {
  const svgStr = await QRCode.toString(data, {
    type: 'svg',
    margin: 3,
    errorCorrectionLevel: 'H',   // 30% de récupération — permet d'avoir un logo au centre
    color: { dark: '#1a3320', light: '#faf7f2' },
  })

  // Dimensions du QR généré
  const vbMatch = svgStr.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/)
  const W = vbMatch ? parseFloat(vbMatch[1]) : 41
  const H = vbMatch ? parseFloat(vbMatch[2]) : 41

  // Zone logo : 26% de la taille du QR, centrée
  const size   = W * 0.26
  const pad    = size * 0.15
  const total  = size + pad * 2
  const lx     = (W - total) / 2
  const ly     = (H - total) / 2

  const logoOverlay = `
  <!-- Fond blanc arrondi -->
  <rect x="${lx}" y="${ly}" width="${total}" height="${total}"
        rx="${total * 0.14}" fill="#faf7f2"/>
  <!-- Monogramme BB (viewBox partiel : x36–164, y14–136) -->
  <svg x="${lx + pad}" y="${ly + pad}"
       width="${size}" height="${size}"
       viewBox="36 14 128 122"
       preserveAspectRatio="xMidYMid meet">
    ${BB_PATHS}
  </svg>`

  const finalSvg = svgStr.replace('</svg>', logoOverlay + '\n</svg>')
  const svgPath  = outputPath.replace(/\.png$/, '.svg')
  fs.writeFileSync(svgPath, finalSvg, 'utf8')
}

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })

console.log('📱 Génération des QR codes avec logo BB...\n')

// QR codes carnet de séjour
for (const { id, label } of CHAMBRES) {
  const url  = `${BASE_URL}/guide/${id}`
  const dest = path.join(OUTPUT_DIR, `QR-${label}.svg`)
  await generateQR(url, dest)
  console.log(`✅  QR-${label}.svg  →  ${url}`)
}

// QR code WiFi (connexion directe)
const wifiData = `WIFI:T:${WIFI_TYPE};S:${WIFI_SSID};P:${WIFI_PASSWORD};;`
await generateQR(wifiData, path.join(OUTPUT_DIR, 'QR-WiFi-Connexion-Directe.svg'))
console.log(`✅  QR-WiFi-Connexion-Directe.svg  →  réseau "${WIFI_SSID}"`)

console.log(`\n📁 Fichiers SVG dans :\n   ${OUTPUT_DIR}`)
console.log('\n💡 Ouvrez chaque fichier .svg dans Chrome puis Fichier → Imprimer.')
console.log('   SVG = qualité parfaite à toutes les tailles.\n')
console.log('⚠️  Si le domaine Vercel change, modifiez BASE_URL ligne 13.')
