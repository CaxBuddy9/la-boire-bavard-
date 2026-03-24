// Logo SVG — La Boire Bavard
// BB monogramme typographique avec tige botanique

const GOLD = '#b8922a'
const GREEN = '#3d6b28'
const LEAF  = '#2d5018'

export function LogoSVG({ height = 66, className = '' }: { height?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 320"
      style={{ height, width: 'auto', display: 'block', flexShrink: 0 }}
      className={className}
    >
      {/* ── Lettre B gauche (bumps à gauche) ── */}
      {/* Colonne verticale */}
      <rect x="78" y="18" width="8" height="118" rx="2" fill={GOLD}/>
      {/* Crossbars */}
      <rect x="60" y="18"  width="20" height="6"  rx="1.5" fill={GOLD}/>
      <rect x="60" y="76"  width="20" height="5"  rx="1.5" fill={GOLD}/>
      <rect x="60" y="130" width="20" height="6"  rx="1.5" fill={GOLD}/>
      {/* Bump haut gauche */}
      <path d="M86,18 Q44,18 44,47 Q44,76 86,76" stroke={GOLD} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Bump bas gauche */}
      <path d="M86,76 Q36,76 36,103 Q36,136 86,136" stroke={GOLD} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

      {/* ── Lettre B droite (bumps à droite) ── */}
      {/* Colonne verticale */}
      <rect x="114" y="18" width="8" height="118" rx="2" fill={GOLD}/>
      {/* Crossbars */}
      <rect x="120" y="18"  width="20" height="6"  rx="1.5" fill={GOLD}/>
      <rect x="120" y="76"  width="20" height="5"  rx="1.5" fill={GOLD}/>
      <rect x="120" y="130" width="20" height="6"  rx="1.5" fill={GOLD}/>
      {/* Bump haut droite */}
      <path d="M114,18 Q156,18 156,47 Q156,76 114,76" stroke={GOLD} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Bump bas droite */}
      <path d="M114,76 Q164,76 164,103 Q164,136 114,136" stroke={GOLD} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

      {/* ── Séparateur central doré ── */}
      <rect x="94" y="14" width="12" height="4" rx="2" fill={GOLD} opacity=".6"/>
      <rect x="94" y="128" width="12" height="4" rx="2" fill={GOLD} opacity=".6"/>

      {/* ── Tige botanique ── */}
      <rect x="97" y="142" width="6" height="6"  rx="2"   fill={GOLD}/>
      <rect x="98" y="148" width="4" height="150" rx="2"   fill={GOLD}/>
      {/* Nœud central */}
      <rect x="90" y="198" width="20" height="4" rx="2"   fill={GOLD}/>
      <rect x="92" y="202" width="16" height="3" rx="1.5" fill={GOLD} opacity=".4"/>
      {/* Fleur centrale */}
      <circle cx="100" cy="232" r="7" fill={GOLD}/>
      <circle cx="100" cy="232" r="3.5" fill="none" stroke="#7a5e18" strokeWidth="1.5"/>
      {/* Base */}
      <rect x="102" y="264" width="14" height="7"  rx="1.5" fill={GOLD}/>
      <rect x="102" y="280" width="20" height="7"  rx="1.5" fill={GOLD}/>
      <rect x="102" y="296" width="10" height="6"  rx="1.5" fill={GOLD}/>

      {/* ── Feuilles gauches ── */}
      {/* Grande branche gauche */}
      <path d="M98,155 C82,142 60,128 46,104 C32,78 38,50 56,42 C68,38 78,46 82,60" stroke={GREEN} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Petite branche gauche haute */}
      <path d="M56,42 C46,30 50,16 62,18 C70,20 72,36 62,44" stroke={GREEN} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      {/* Branche gauche basse */}
      <path d="M98,162 C74,172 52,196 46,226 C40,254 50,276 66,278" stroke={GREEN} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      {/* Feuille grande gauche */}
      <path d="M82,60 C68,50 60,36 68,26 C78,28 82,44 82,60Z" fill={GREEN} opacity=".9"/>
      <line x1="82" y1="60" x2="72" y2="28" stroke={LEAF} strokeWidth=".8" opacity=".6"/>
      {/* Feuille petite gauche haute */}
      <path d="M62,18 C54,6 58,-8 68,-6 C72,2 68,14 62,18Z" fill={GREEN} opacity=".9"/>
      <line x1="62" y1="18" x2="66" y2="-4" stroke={LEAF} strokeWidth=".8" opacity=".6"/>
      {/* Feuille milieu gauche */}
      <path d="M46,92 C34,84 28,70 34,58 C46,62 52,78 46,92Z" fill={GREEN} opacity=".8"/>
      {/* Feuille basse gauche */}
      <path d="M50,210 C38,204 32,190 38,178 C50,182 56,196 50,210Z" fill={GREEN} opacity=".75"/>
      <path d="M48,244 C36,238 30,224 36,212 C48,216 54,232 48,244Z" fill={GREEN} opacity=".7"/>
      {/* Petite feuille */}
      <path d="M98,180 C80,175 68,163 74,152 C86,154 98,168 98,180Z" fill={GREEN} opacity=".8"/>

      {/* ── Feuilles droites ── */}
      {/* Grande branche droite */}
      <path d="M102,155 C118,142 140,126 154,102 C168,76 162,48 144,40 C132,36 122,44 118,58" stroke={GREEN} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Petite branche droite haute */}
      <path d="M144,40 C154,28 150,14 138,16 C130,18 128,34 138,42" stroke={GREEN} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      {/* Branche droite basse */}
      <path d="M102,162 C126,172 148,198 154,228 C160,256 150,278 134,280" stroke={GREEN} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      {/* Feuille grande droite */}
      <path d="M118,58 C132,48 140,34 132,24 C122,26 118,42 118,58Z" fill={GREEN} opacity=".9"/>
      <line x1="118" y1="58" x2="128" y2="26" stroke={LEAF} strokeWidth=".8" opacity=".6"/>
      {/* Feuille petite droite haute */}
      <path d="M138,16 C146,4 142,-10 132,-8 C128,0 132,12 138,16Z" fill={GREEN} opacity=".9"/>
      <line x1="138" y1="16" x2="134" y2="-6" stroke={LEAF} strokeWidth=".8" opacity=".6"/>
      {/* Feuille milieu droite */}
      <path d="M154,90 C166,82 172,68 166,56 C154,60 148,76 154,90Z" fill={GREEN} opacity=".8"/>
      {/* Feuille basse droite */}
      <path d="M150,212 C162,206 168,192 162,180 C150,184 144,198 150,212Z" fill={GREEN} opacity=".75"/>
      <path d="M152,246 C164,240 170,226 164,214 C152,218 146,234 152,246Z" fill={GREEN} opacity=".7"/>
      {/* Petite feuille droite */}
      <path d="M102,180 C120,175 132,163 126,152 C114,154 102,168 102,180Z" fill={GREEN} opacity=".8"/>
    </svg>
  )
}

// Filigrane hero — blanc, opacity 0.10
export function LogoWatermark() {
  return (
    <svg
      viewBox="0 0 200 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', right: '6%', top: '50%', transform: 'translateY(-50%)', opacity: .10, height: 380, width: 'auto', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <rect x="78"  y="18" width="8"   height="118" rx="2"   fill="white"/>
      <rect x="114" y="18" width="8"   height="118" rx="2"   fill="white"/>
      <rect x="60"  y="18" width="20"  height="6"   rx="1.5" fill="white"/>
      <rect x="60"  y="76" width="20"  height="5"   rx="1.5" fill="white"/>
      <rect x="60"  y="130" width="20" height="6"   rx="1.5" fill="white"/>
      <rect x="120" y="18" width="20"  height="6"   rx="1.5" fill="white"/>
      <rect x="120" y="76" width="20"  height="5"   rx="1.5" fill="white"/>
      <rect x="120" y="130" width="20" height="6"   rx="1.5" fill="white"/>
      <path d="M86,18 Q44,18 44,47 Q44,76 86,76"     stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M86,76 Q36,76 36,103 Q36,136 86,136"  stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M114,18 Q156,18 156,47 Q156,76 114,76"  stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M114,76 Q164,76 164,103 Q164,136 114,136" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="97"  y="142" width="6"  height="6"   rx="2"   fill="white"/>
      <rect x="98"  y="148" width="4"  height="150" rx="2"   fill="white"/>
      <rect x="90"  y="198" width="20" height="4"   rx="2"   fill="white"/>
      <path d="M98,155 C82,142 60,128 46,104 C32,78 38,50 56,42 C68,38 78,46 82,60"   stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M102,155 C118,142 140,126 154,102 C168,76 162,48 144,40 C132,36 122,44 118,58" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M82,60 C68,50 60,36 68,26 C78,28 82,44 82,60Z"   fill="white" opacity=".5"/>
      <path d="M118,58 C132,48 140,34 132,24 C122,26 118,42 118,58Z" fill="white" opacity=".5"/>
      <path d="M62,18 C54,6 58,-8 68,-6 C72,2 68,14 62,18Z"   fill="white" opacity=".5"/>
      <path d="M138,16 C146,4 142,-10 132,-8 C128,0 132,12 138,16Z" fill="white" opacity=".5"/>
    </svg>
  )
}
