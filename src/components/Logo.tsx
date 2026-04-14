// Logo — La Boire Bavard (SVG vectoriel officiel)
// viewBox recadré 675×1400 → ratio portrait ~0.482:1

// Filtre CSS → gold : brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(5deg)
// Filtre CSS → white : brightness(0) invert(1)

// eslint-disable-next-line @next/next/no-img-element
export function LogoSVG({
  height = 66,
  className = '',
  variant = 'color',
}: {
  height?: number
  className?: string
  variant?: 'color' | 'white' | 'gold'
}) {
  const width = Math.round(height * 0.482)
  const filter =
    variant === 'white'
      ? 'brightness(0) invert(1)'
      : variant === 'gold'
      ? 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(5deg)'
      : undefined

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-lbba.svg"
      alt="La Boire Bavard"
      height={height}
      width={width}
      className={className}
      style={{ display: 'block', flexShrink: 0, height, width: 'auto', filter }}
    />
  )
}

// Filigrane hero — logo blanc à 10% d'opacité
export function LogoWatermark() {
  return (
    <div
      style={{
        position: 'absolute',
        right: '6%',
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: 0.10,
        pointerEvents: 'none',
        filter: 'brightness(0) invert(1)',
      }}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-lbba.svg"
        alt=""
        style={{ height: 380, width: 'auto', display: 'block' }}
      />
    </div>
  )
}
