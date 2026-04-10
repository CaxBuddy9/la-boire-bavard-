// Génération QR code avec logo LBBA centré — server only
import QRCode from 'qrcode'
import fs from 'fs'
import path from 'path'

// Monogramme BB en or (viewbox 200×136)
const BB = `
  <rect x="78" y="18" width="8"  height="118" rx="2"   fill="#b8922a"/>
  <rect x="60" y="18" width="20" height="6"   rx="1.5" fill="#b8922a"/>
  <rect x="60" y="76" width="20" height="5"   rx="1.5" fill="#b8922a"/>
  <rect x="60" y="130" width="20" height="6"  rx="1.5" fill="#b8922a"/>
  <path d="M86,18 Q44,18 44,47 Q44,76 86,76"    stroke="#b8922a" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M86,76 Q36,76 36,103 Q36,136 86,136" stroke="#b8922a" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="114" y="18" width="8"  height="118" rx="2"   fill="#b8922a"/>
  <rect x="120" y="18" width="20" height="6"   rx="1.5" fill="#b8922a"/>
  <rect x="120" y="76" width="20" height="5"   rx="1.5" fill="#b8922a"/>
  <rect x="120" y="130" width="20" height="6"  rx="1.5" fill="#b8922a"/>
  <path d="M114,18 Q156,18 156,47 Q156,76 114,76"    stroke="#b8922a" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M114,76 Q164,76 164,103 Q164,136 114,136" stroke="#b8922a" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="94" y="14"  width="12" height="4" rx="2" fill="#b8922a" opacity=".6"/>
  <rect x="94" y="128" width="12" height="4" rx="2" fill="#b8922a" opacity=".6"/>
`

function isFinder(r: number, c: number, n: number) {
  return (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7)
}

export function buildQRSvg(data: string, darkColor = '#1a3320'): string {
  const qr      = QRCode.create(data, { errorCorrectionLevel: 'H' })
  const modules = qr.modules.data as Uint8Array
  const n       = qr.modules.size

  const M      = 14
  const MARGIN = 4
  const svgW   = (n + MARGIN * 2) * M
  const off    = MARGIN * M

  // Zone logo 28% centré
  const logoN = Math.round(n * 0.28)
  const logoS = Math.floor((n - logoN) / 2)
  const logoE = logoS + logoN

  let dots = '', finders = ''

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!modules[r * n + c]) continue
      if (c >= logoS && c < logoE && r >= logoS && r < logoE) continue
      const cx = off + c * M + M / 2
      const cy = off + r * M + M / 2
      if (isFinder(r, c, n)) {
        finders += `<rect x="${cx - M/2}" y="${cy - M/2}" width="${M}" height="${M}" rx="${M*0.25}" fill="${darkColor}"/>`
      } else {
        dots += `<circle cx="${cx}" cy="${cy}" r="${M*0.42}" fill="${darkColor}"/>`
      }
    }
  }

  const fs2 = (row: number, col: number) => {
    const x = off + col * M, y = off + row * M, s = 7 * M, rr = M * 1.2
    return `
      <rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${rr}" fill="none" stroke="${darkColor}" stroke-width="${M*0.5}"/>
      <rect x="${x+M*1.5}" y="${y+M*1.5}" width="${s-M*3}" height="${s-M*3}" rx="${rr*0.5}" fill="${darkColor}"/>`
  }

  const finderOverlays = fs2(0,0) + fs2(0,n-7) + fs2(n-7,0)

  // Logo BB centré
  const lSize = logoN * M
  const lX    = off + logoS * M
  const lY    = off + logoS * M
  const pad   = lSize * 0.10
  const inner = lSize - pad * 2
  const scale = inner / 128
  const bbH   = 122 * scale
  const tx    = lX + pad - 36 * scale
  const ty    = lY + pad + (inner - bbH) / 2 - 14 * scale

  const logo = `
    <rect x="${lX}" y="${lY}" width="${lSize}" height="${lSize}" rx="${lSize*0.15}" fill="#faf7f2"/>
    <g transform="translate(${tx.toFixed(1)},${ty.toFixed(1)}) scale(${scale.toFixed(4)})">
      ${BB}
    </g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgW}" width="${svgW}" height="${svgW}">
  <rect width="${svgW}" height="${svgW}" fill="#faf7f2" rx="12"/>
  ${dots}
  ${finderOverlays}
  ${logo}
</svg>`
}

export function buildQRDataUri(data: string, darkColor?: string): string {
  const svg = buildQRSvg(data, darkColor)
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}
