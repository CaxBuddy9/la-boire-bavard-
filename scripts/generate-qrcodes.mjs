/**
 * Génère les QR codes pour le carnet de séjour
 * Usage : node scripts/generate-qrcodes.mjs
 */

import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─── À adapter si le domaine change ──────────────────────────────────────────
const BASE_URL  = 'https://la-boire-bavard.vercel.app'
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'LA BOIRE BAVARD WEBSITE')
// ─────────────────────────────────────────────────────────────────────────────

const CHAMBRES = [
  { id: 'jardin',  label: 'Cote-Jardin'  },
  { id: 'cedre',   label: 'Cote-Cedre'   },
  { id: 'vallee',  label: 'Cote-Vallee'  },
  { id: 'potager', label: 'Cote-Potager' },
]

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        downloadFile(res.headers.location, dest).then(resolve).catch(reject)
        return
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
    }).on('error', (err) => {
      fs.unlink(dest, () => {})
      reject(err)
    })
  })
}

// ─── WiFi pour QR code de connexion directe ──────────────────────────────────
const WIFI_SSID     = 'Livebox-D6B0'
const WIFI_PASSWORD = 'LSjfprSMoDSZCMp9xY'
const WIFI_TYPE     = 'WPA'   // WPA, WEP, ou nopass
// ─────────────────────────────────────────────────────────────────────────────

console.log('📱 Génération des QR codes...\n')

// 1. QR codes carnet de séjour (un par chambre)
for (const chambre of CHAMBRES) {
  const pageUrl = `${BASE_URL}/guide/${chambre.id}`
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=20&color=1a3320&bgcolor=faf7f2&data=${encodeURIComponent(pageUrl)}`
  const outputPath = path.join(OUTPUT_DIR, `QR-${chambre.label}.png`)

  try {
    await downloadFile(qrApiUrl, outputPath)
    console.log(`✅  QR-${chambre.label}.png  →  ${pageUrl}`)
  } catch (err) {
    console.error(`❌  Erreur pour ${chambre.label} :`, err.message)
  }
}

// 2. QR code WiFi — connexion directe au réseau
// Format standard reconnu par iOS et Android sans app
const wifiData = `WIFI:T:${WIFI_TYPE};S:${WIFI_SSID};P:${WIFI_PASSWORD};;`
const wifiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=20&color=1a3320&bgcolor=faf7f2&data=${encodeURIComponent(wifiData)}`
const wifiOutputPath = path.join(OUTPUT_DIR, 'QR-WiFi-Connexion-Directe.png')

try {
  await downloadFile(wifiQrUrl, wifiOutputPath)
  console.log(`✅  QR-WiFi-Connexion-Directe.png  →  réseau "${WIFI_SSID}"`)
} catch (err) {
  console.error('❌  Erreur QR WiFi :', err.message)
}

console.log(`\n📁 Fichiers enregistrés dans :\n   ${OUTPUT_DIR}`)
console.log('\n💡 Pour changer le mot de passe WiFi, modifiez WIFI_PASSWORD dans ce script.')
console.log('   Relancez ensuite : node scripts/generate-qrcodes.mjs')
