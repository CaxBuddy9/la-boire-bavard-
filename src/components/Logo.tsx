// Logo officiel — La Boire Bavard
// PNG fond transparent, couleurs or + vert natifs.

export function LogoSVG({
  height = 66,
  className = '',
  variant = 'dark-bg',
}: {
  height?: number
  className?: string
  /** dark-bg : logo couleurs natives (or+vert) sur fond sombre — par défaut
   *  color   : idem, fond clair
   *  white   : silhouette blanche pure */
  variant?: 'color' | 'dark-bg' | 'white'
}) {
  const style: React.CSSProperties = {
    display: 'block',
    flexShrink: 0,
    height,
    width: 'auto',
    ...(variant === 'white' && {
      filter: 'brightness(0) invert(1)',
    }),
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src="/logo-lbba.png"
      alt="La Boire Bavard"
      height={height}
      width={height}
      className={className}
      style={style}
    />
  )
}

// Filigrane hero — logo blanc très discret
export function LogoWatermark() {
  return (
    <div
      style={{
        position: 'absolute',
        right: '6%',
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: 0.08,
        pointerEvents: 'none',
        filter: 'brightness(0) invert(1)',
      }}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-lbba.png"
        alt=""
        style={{ height: 380, width: 'auto', display: 'block' }}
      />
    </div>
  )
}
