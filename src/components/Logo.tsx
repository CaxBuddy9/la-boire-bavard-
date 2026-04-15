// Logo officiel — La Boire Bavard
import Image from 'next/image'

export function LogoSVG({
  height = 66,
  className = '',
  variant = 'dark-bg',
}: {
  height?: number
  className?: string
  variant?: 'color' | 'dark-bg' | 'white'
}) {
  const style: React.CSSProperties = {
    display: 'block',
    flexShrink: 0,
    height,
    width: 'auto',
    ...(variant === 'white' && { filter: 'brightness(0) invert(1)' }),
  }

  return (
    <Image
      src="/logo-lbba.png"
      alt="La Boire Bavard"
      height={height}
      width={height}
      className={className}
      style={style}
      priority
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
      <Image
        src="/logo-lbba.png"
        alt=""
        height={380}
        width={380}
        style={{ height: 380, width: 'auto', display: 'block' }}
      />
    </div>
  )
}
