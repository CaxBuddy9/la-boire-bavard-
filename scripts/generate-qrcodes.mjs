/**
 * QR codes personnalisés La Boire Bavard
 * Nouveau logo PNG officiel centré · Modules ronds · Cadre chambre
 * Usage : node scripts/generate-qrcodes.mjs
 */

import QRCode from 'qrcode'
import { Resvg } from '@resvg/resvg-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BASE_URL   = 'https://la-boire-bavard.vercel.app'
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'LA BOIRE BAVARD WEBSITE')

const WIFI_SSID     = 'Livebox-D6B0'
const WIFI_PASSWORD = 'LSjfprSMoDSZCMp9xY'
const WIFI_TYPE     = 'WPA'

// ─── Nouveau logo LBBA (SVG inline — viewBox recadré 675×1400) ────────────────
const logoSvgPath = path.join(__dirname, '..', 'public', 'logo-lbba.svg')
const LOGO_DATA_URI = `data:image/svg+xml;base64,${fs.readFileSync(logoSvgPath).toString('base64')}`

// ─── Couleurs par chambre ─────────────────────────────────────────────────────
const ROOM_COLORS = {
  jardin:  { bg: '#1a3320', label: 'Côté Jardin',  emoji: '🌿' },
  cedre:   { bg: '#1e2f18', label: 'Côté Cèdre',   emoji: '🌲' },
  vallee:  { bg: '#1a2830', label: 'Côté Vallée',  emoji: '🏞️' },
  potager: { bg: '#1e2f16', label: 'Côté Potager', emoji: '🌱' },
  wifi:    { bg: '#1a3320', label: 'WiFi',          emoji: '📶' },
}

function isFinder(r, c, n) {
  return (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7)
}

function buildQRSvg(data, roomId, label, emoji) {
  const qr      = QRCode.create(data, { errorCorrectionLevel: 'H' })
  const modules = qr.modules.data
  const n       = qr.modules.size

  const M       = 14
  const MARGIN  = 4
  const qrSize  = n * M
  const svgW    = (n + MARGIN * 2) * M
  const FRAME_H = 72

  const svgH    = svgW + FRAME_H
  const off     = MARGIN * M

  const color = ROOM_COLORS[roomId] || ROOM_COLORS.wifi

  // ── Zone logo : 28% de n, centré ──────────────────────────────────────────
  const logoN   = Math.round(n * 0.28)
  const logoS   = Math.floor((n - logoN) / 2)
  const logoE   = logoS + logoN

  // ── Modules ───────────────────────────────────────────────────────────────
  let dots = ''
  let finders = ''

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!modules[r * n + c]) continue
      if (c >= logoS && c < logoE && r >= logoS && r < logoE) continue

      const cx = off + c * M + M / 2
      const cy = off + r * M + M / 2

      if (isFinder(r, c, n)) {
        finders += `<rect x="${cx - M/2}" y="${cy - M/2}" width="${M}" height="${M}"
          rx="${M * 0.25}" fill="#1a3320"/>`
      } else {
        dots += `<circle cx="${cx}" cy="${cy}" r="${M * 0.42}" fill="#1a3320"/>`
      }
    }
  }

  const finderStyle = (row, col) => {
    const x = off + col * M
    const y = off + row * M
    const s = 7 * M
    const r = M * 1.2
    return `
      <rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${r}"
            fill="none" stroke="#1a3320" stroke-width="${M * 0.5}"/>
      <rect x="${x + M*1.5}" y="${y + M*1.5}" width="${s - M*3}" height="${s - M*3}"
            rx="${r * 0.5}" fill="#1a3320"/>`
  }

  const finderOverlays = `
    ${finderStyle(0, 0)}
    ${finderStyle(0, n - 7)}
    ${finderStyle(n - 7, 0)}
  `

  // ── Nouveau logo LBBA centré ──────────────────────────────────────────────
  // Le PNG fait 2048×1494 mais le logo réel est en portrait dans la zone centrale
  // On utilise preserveAspectRatio pour le centrer proprement
  const lSize  = logoN * M
  const lX     = off + logoS * M
  const lY     = off + logoS * M
  const pad    = lSize * 0.06

  const logo = `
    <rect x="${lX}" y="${lY}" width="${lSize}" height="${lSize}"
          rx="${lSize * 0.15}" fill="#faf7f2"/>
    <image href="${LOGO_DATA_URI}"
           x="${lX + pad}" y="${lY + pad}"
           width="${lSize - pad * 2}" height="${lSize - pad * 2}"
           preserveAspectRatio="xMidYMid meet"/>`

  // ── Cadre bas ─────────────────────────────────────────────────────────────
  const frame = `
    <rect x="0" y="${svgW}" width="${svgW}" height="${FRAME_H}"
          fill="${color.bg}" rx="0"/>
    <rect x="${svgW * 0.1}" y="${svgW + 1}" width="${svgW * 0.8}" height="1.5"
          fill="#c4a050" opacity="0.6"/>
    <text x="${svgW / 2}" y="${svgW + 28}"
          text-anchor="middle" font-size="20" font-family="serif">${emoji}</text>
    <text x="${svgW / 2}" y="${svgW + 50}"
          text-anchor="middle" font-size="16" font-weight="600"
          font-family="Georgia, serif" fill="white" letter-spacing="1">${label}</text>
    <text x="${svgW / 2}" y="${svgW + 66}"
          text-anchor="middle" font-size="9"
          font-family="Arial, sans-serif" fill="#c4a050" letter-spacing="2">
      LA BOIRE BAVARD · ANJOU
    </text>`

  const border = `
    <rect x="1" y="1" width="${svgW - 2}" height="${svgH - 2}"
          rx="16" fill="none" stroke="#c4a050" stroke-width="2" opacity="0.5"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg"
     width="${svgW}" height="${svgH}"
     viewBox="0 0 ${svgW} ${svgH}">
  <rect width="${svgW}" height="${svgH}" fill="#faf7f2" rx="16"/>
  ${dots}
  ${finderOverlays}
  ${logo}
  ${frame}
  ${border}
</svg>`
}

// ─── Génération ───────────────────────────────────────────────────────────────
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })
for (const f of fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith('QR-'))) {
  fs.unlinkSync(path.join(OUTPUT_DIR, f))
}

console.log('📱 Génération des QR codes avec le nouveau logo PNG...\n')

const CHAMBRES = [
  { id: 'jardin',  label: 'Cote-Jardin'  },
  { id: 'cedre',   label: 'Cote-Cedre'   },
  { id: 'vallee',  label: 'Cote-Vallee'  },
  { id: 'potager', label: 'Cote-Potager' },
]

function svgToPng(svgStr, outputPath) {
  const resvg = new Resvg(svgStr, { fitTo: { mode: 'width', value: 800 } })
  const png   = resvg.render().asPng()
  fs.writeFileSync(outputPath, png)
}

for (const { id, label } of CHAMBRES) {
  const url   = `${BASE_URL}/guide/${id}`
  const room  = ROOM_COLORS[id]
  const svg   = buildQRSvg(url, id, room.label, room.emoji)
  const dest  = path.join(OUTPUT_DIR, `QR-${label}.png`)
  svgToPng(svg, dest)
  console.log(`✅  QR-${label}.png`)
}

const wifiData = `WIFI:T:${WIFI_TYPE};S:${WIFI_SSID};P:${WIFI_PASSWORD};;`
const wifiSvg  = buildQRSvg(wifiData, 'wifi', 'WiFi · Livebox-D6B0', '📶')
svgToPng(wifiSvg, path.join(OUTPUT_DIR, 'QR-WiFi.png'))
console.log('✅  QR-WiFi.png')

console.log(`\n📁 ${OUTPUT_DIR}`)
console.log('💡 Ouvrir dans Chrome → Ctrl+P pour imprimer')
