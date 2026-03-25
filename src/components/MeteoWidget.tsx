'use client'
import { useEffect, useState } from 'react'

const WMO: Record<number, string> = {
  0:'☀️',1:'🌤',2:'⛅',3:'☁️',
  45:'🌫',48:'🌫',
  51:'🌦',53:'🌦',55:'🌧',61:'🌧',63:'🌧',65:'🌧',
  71:'❄️',73:'❄️',75:'❄️',
  80:'🌦',81:'🌦',82:'🌧',
  85:'🌨',86:'🌨',
  95:'⛈',96:'⛈',99:'⛈',
}

export default function MeteoWidget() {
  const [data, setData] = useState<{ temp: number; icon: string } | null>(null)

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=47.3933&longitude=-0.3710&current=temperature_2m,weathercode&timezone=Europe%2FParis&forecast_days=1')
      .then((r) => r.json())
      .then((d) => {
        setData({
          temp: Math.round(d.current.temperature_2m),
          icon: WMO[d.current.weathercode as number] ?? '🌡',
        })
      })
      .catch(() => {})
  }, [])

  if (!data) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '90px',
        right: '14px',
        zIndex: 8998,
        background: 'rgba(15,22,17,.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        color: 'rgba(240,235,225,.88)',
        padding: '6px 14px',
        fontFamily: 'var(--font-raleway)',
        fontSize: '.64rem',
        letterSpacing: '.12em',
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        border: '1px solid rgba(196,160,80,.22)',
        borderRadius: '3px',
        pointerEvents: 'none',
      }}
    >
      <span>{data.icon}</span>
      <strong>{data.temp}°C</strong>
      <span style={{ opacity: .5 }}>Blaison</span>
    </div>
  )
}
