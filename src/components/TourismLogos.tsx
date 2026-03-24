// Logos institutionnels tourisme — SVG inline, toujours disponibles

export function LogoLLA() {
  return (
    <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg" style={{ height: 48, width: 'auto' }}>
      <rect width="120" height="60" fill="#1a2a5e" rx="3"/>
      <text x="60" y="24" textAnchor="middle" fontFamily="Georgia, serif" fontSize="18" fontWeight="700" fill="white" letterSpacing="2">lla</text>
      <line x1="12" y1="31" x2="108" y2="31" stroke="rgba(255,255,255,.3)" strokeWidth="0.5"/>
      <text x="60" y="41" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="5.5" fill="rgba(255,255,255,.75)" letterSpacing="1.5">LOIRE LAYON AUBANCE</text>
      <text x="60" y="51" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="4.5" fill="rgba(255,255,255,.5)" letterSpacing="1">COMMUNAUTÉ DE COMMUNES</text>
    </svg>
  )
}

export function LogoDestinationAnjou() {
  return (
    <svg viewBox="0 0 130 60" xmlns="http://www.w3.org/2000/svg" style={{ height: 48, width: 'auto' }}>
      {/* Losange mosaïque */}
      <polygon points="22,8 36,20 22,32 8,20" fill="#e63d2f"/>
      <polygon points="36,8 50,20 36,32 22,20" fill="#f5a623"/>
      <polygon points="22,24 36,36 22,48 8,36" fill="#4a9d3f"/>
      <polygon points="36,24 50,36 36,48 22,36" fill="#2a6db5"/>
      <text x="58" y="22" fontFamily="Arial, sans-serif" fontSize="5.5" fill="rgba(255,255,255,.5)" letterSpacing="1.5">Destination</text>
      <text x="58" y="34" fontFamily="Arial Black, Arial, sans-serif" fontSize="8.5" fontWeight="900" fill="white" letterSpacing="0.5">ANJOU VIGNOBLE</text>
      <text x="58" y="45" fontFamily="Arial Black, Arial, sans-serif" fontSize="8.5" fontWeight="900" fill="white" letterSpacing="0.5">ET VILLAGES</text>
    </svg>
  )
}

export function LogoQualiteTourisme() {
  return (
    <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" style={{ height: 48, width: 'auto' }}>
      {/* Ovale bleu */}
      <ellipse cx="50" cy="30" rx="46" ry="26" fill="none" stroke="#1e5fa8" strokeWidth="2"/>
      {/* Cygne/oiseau stylisé */}
      <path d="M35,35 Q38,22 48,24 Q55,24 58,28 Q62,22 68,23 Q72,24 70,30 Q68,34 62,33 Q55,30 48,33 Q42,35 35,35Z" fill="#1e5fa8"/>
      <text x="50" y="52" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="6" fill="#1e5fa8" letterSpacing="2" fontWeight="600">QUALITÉ TOURISME</text>
    </svg>
  )
}

export function LogoOfficeTourisme() {
  return (
    <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" style={{ height: 48, width: 'auto' }}>
      <rect width="100" height="60" fill="#1a3a5c" rx="2"/>
      <text x="50" y="19" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="6" fill="rgba(255,255,255,.7)" letterSpacing="1.5">OFFICE DE</text>
      <text x="50" y="30" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontSize="9" fontWeight="900" fill="white" letterSpacing="0.5">TOURISME</text>
      <text x="50" y="41" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="6" fill="rgba(255,255,255,.7)" letterSpacing="1.5">CLASSÉ</text>
      <rect x="12" y="46" width="76" height="1" fill="rgba(255,255,255,.2)" rx="0.5"/>
      <text x="50" y="54" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="4" fill="rgba(255,255,255,.4)" letterSpacing="1">★ ★ ★</text>
    </svg>
  )
}

export function LogoVignobles() {
  return (
    <svg viewBox="0 0 110 60" xmlns="http://www.w3.org/2000/svg" style={{ height: 48, width: 'auto' }}>
      {/* Cercle vert */}
      <circle cx="28" cy="30" r="24" fill="#3a7a2a"/>
      {/* Feuille de vigne */}
      <path d="M28,14 C20,18 14,26 18,34 C22,40 28,38 28,38 C28,38 34,40 38,34 C42,26 36,18 28,14Z" fill="rgba(255,255,255,.9)"/>
      <path d="M28,18 C24,22 22,28 24,32 C26,35 28,34 28,34 C28,34 30,35 32,32 C34,28 32,22 28,18Z" fill="#3a7a2a"/>
      <path d="M28,34 L28,44" stroke="rgba(255,255,255,.7)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M24,38 Q28,36 32,38" stroke="rgba(255,255,255,.5)" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Texte */}
      <text x="60" y="25" fontFamily="Georgia, serif" fontSize="8" fontStyle="italic" fill="white" letterSpacing="0.5">vignobles &amp;</text>
      <text x="60" y="37" fontFamily="Georgia, serif" fontSize="8" fontStyle="italic" fill="white" letterSpacing="0.5">découvertes</text>
      <text x="60" y="50" fontFamily="Arial, sans-serif" fontSize="5" fill="rgba(255,255,255,.45)" letterSpacing="1">ATOUT FRANCE</text>
    </svg>
  )
}

export function LogoAccueilVelo() {
  return (
    <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" style={{ height: 48, width: 'auto' }}>
      {/* Cercle */}
      <circle cx="28" cy="30" r="24" fill="none" stroke="#0066cc" strokeWidth="2.5"/>
      {/* Cycliste stylisé */}
      <circle cx="28" cy="16" r="3.5" fill="#0066cc"/>
      {/* Corps */}
      <path d="M28,20 L25,30 L20,38" stroke="#0066cc" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M28,20 L32,28 L36,30" stroke="#0066cc" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Vélo roues */}
      <circle cx="20" cy="40" r="6" fill="none" stroke="#0066cc" strokeWidth="1.8"/>
      <circle cx="36" cy="40" r="6" fill="none" stroke="#0066cc" strokeWidth="1.8"/>
      <line x1="20" y1="40" x2="28" y2="32" stroke="#0066cc" strokeWidth="1.2"/>
      <line x1="36" y1="40" x2="28" y2="32" stroke="#0066cc" strokeWidth="1.2"/>
      {/* Texte */}
      <text x="60" y="27" fontFamily="Arial Black, Arial, sans-serif" fontSize="8" fontWeight="900" fill="#0066cc" letterSpacing="0.5">ACCUEIL</text>
      <text x="60" y="39" fontFamily="Arial Black, Arial, sans-serif" fontSize="8" fontWeight="900" fill="#0066cc" letterSpacing="0.5">VÉLO</text>
      <text x="60" y="51" fontFamily="Arial, sans-serif" fontSize="4.5" fill="rgba(255,255,255,.4)" letterSpacing="1">Label national</text>
    </svg>
  )
}

export function LogoLoireVelo() {
  return (
    <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg" style={{ height: 48, width: 'auto' }}>
      {/* Vague Loire */}
      <path d="M8,36 Q20,24 32,32 Q44,40 56,28 Q68,16 80,26 Q90,34 100,28" stroke="#0077bb" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M8,42 Q20,30 32,38 Q44,46 56,34 Q68,22 80,32 Q90,40 100,34" stroke="#0077bb" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".4"/>
      {/* Vélo icon simple */}
      <circle cx="14" cy="22" r="4" fill="none" stroke="#0077bb" strokeWidth="1.5"/>
      <circle cx="26" cy="22" r="4" fill="none" stroke="#0077bb" strokeWidth="1.5"/>
      <path d="M14,22 L20,16 L26,22" stroke="#0077bb" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="20" cy="14" r="2" fill="#0077bb"/>
      {/* Texte */}
      <text x="36" y="18" fontFamily="Georgia, serif" fontSize="7" fontStyle="italic" fill="white" letterSpacing="0.3">La Loire</text>
      <text x="36" y="28" fontFamily="Georgia, serif" fontSize="7" fontStyle="italic" fill="white" letterSpacing="0.3">à Vélo</text>
      <text x="36" y="50" fontFamily="Arial, sans-serif" fontSize="4.5" fill="rgba(255,255,255,.35)" letterSpacing="1">EuroVelo 6</text>
    </svg>
  )
}

export function LogoEcoAttitude() {
  return (
    <svg viewBox="0 0 110 60" xmlns="http://www.w3.org/2000/svg" style={{ height: 48, width: 'auto' }}>
      {/* Feuille eco */}
      <path d="M22,44 C10,36 8,18 22,12 C36,8 46,18 44,32 C42,44 30,50 22,44Z" fill="#4a9d3f"/>
      <path d="M22,44 C18,36 16,28 20,20" stroke="rgba(255,255,255,.5)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M20,20 Q26,16 32,20" stroke="rgba(255,255,255,.4)" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M18,28 Q24,24 30,28" stroke="rgba(255,255,255,.4)" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Texte */}
      <text x="54" y="23" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="6" fill="rgba(255,255,255,.5)" letterSpacing="1">Adoptez l'</text>
      <text x="54" y="35" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontSize="9" fontWeight="900" fill="#4a9d3f" letterSpacing="0.5">éco attitude</text>
      <text x="54" y="47" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="4.5" fill="rgba(255,255,255,.35)" letterSpacing="1">Démarche éco-responsable</text>
    </svg>
  )
}
