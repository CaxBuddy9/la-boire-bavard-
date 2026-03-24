'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Reservation } from '@/lib/supabase'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sandrine2026'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const STATUS_LABEL: Record<string, string> = {
  pending:   'En attente',
  confirmed: 'Confirmée',
  paid:      'Payée',
  cancelled: 'Annulée',
}

const STATUS_COLOR: Record<string, string> = {
  pending:   'rgba(196,160,80,.8)',
  confirmed: '#6db87a',
  paid:      '#6db87a',
  cancelled: '#e07070',
}

const ROOM_COLOR: Record<string, string> = {
  'Côté Jardin':   '#6db87a',
  'Côté Cèdre':    '#c4a050',
  'Côté Vallée':   '#7ab8c4',
  'Côté Potager':  '#b87ab8',
}

const ROOMS = ['Côté Jardin', 'Côté Cèdre', 'Côté Vallée', 'Côté Potager']

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS_FR   = ['Lu','Ma','Me','Je','Ve','Sa','Di']

function fmtDate(iso: string) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function nights(ci: string, co: string) {
  const d = (new Date(co).getTime() - new Date(ci).getTime()) / 86400000
  return d > 0 ? Math.round(d) : 0
}

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}

// ── Login ──────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pwd === ADMIN_PASSWORD) { onLogin() }
    else { setErr(true); setPwd('') }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0f0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        background: '#131a13', border: '1px solid rgba(196,160,80,.2)',
        padding: '48px 40px', width: '100%', maxWidth: 380,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🌿</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#f5f0e8', marginBottom: 4 }}>
            La Boire Bavard
          </div>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(196,160,80,.6)' }}>
            Espace Sandrine
          </div>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 8 }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={pwd}
              onChange={e => { setPwd(e.target.value); setErr(false) }}
              autoFocus
              style={{
                width: '100%', background: 'rgba(255,255,255,.05)',
                border: `1px solid ${err ? 'rgba(224,112,112,.5)' : 'rgba(255,255,255,.1)'}`,
                color: '#f5f0e8', padding: '12px 14px',
                fontSize: '1rem', outline: 'none',
                fontFamily: 'system-ui, sans-serif',
              }}
            />
            {err && <p style={{ color: '#e07070', fontSize: '0.75rem', marginTop: 6 }}>Mot de passe incorrect</p>}
          </div>
          <button type="submit" style={{
            width: '100%', background: '#c4a050', color: '#0a0f0a',
            border: 'none', padding: '13px', cursor: 'pointer',
            fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif', fontWeight: 600,
          }}>
            Accéder au dashboard
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Planning (Calendar) ─────────────────────────────────────────────────────
function Planning({ reservations }: { reservations: Reservation[] }) {
  const now = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [hoveredDay, setHoveredDay] = useState<string | null>(null)

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1) } else setMonth(m => m-1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1) } else setMonth(m => m+1) }

  // Build a map: date ISO → list of reservations active that day
  const dayMap: Record<string, Reservation[]> = {}
  for (const r of reservations) {
    if (r.status === 'cancelled') continue
    const ci = new Date(r.check_in)
    const co = new Date(r.check_out)
    const cur = new Date(ci)
    while (cur < co) {
      const key = cur.toISOString().split('T')[0]
      if (!dayMap[key]) dayMap[key] = []
      dayMap[key].push(r)
      cur.setDate(cur.getDate() + 1)
    }
  }

  // Days in month + offset
  const firstDay = new Date(year, month, 1)
  const totalDays = new Date(year, month + 1, 0).getDate()
  // Monday=0 offset
  const startOffset = (firstDay.getDay() + 6) % 7

  const todayIso = now.toISOString().split('T')[0]

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  // Upcoming tasks / arrivals this month
  const arrivals = reservations.filter(r => {
    if (r.status === 'cancelled') return false
    const ci = r.check_in
    return ci.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)
  }).sort((a, b) => a.check_in.localeCompare(b.check_in))

  const departures = reservations.filter(r => {
    if (r.status === 'cancelled') return false
    const co = r.check_out
    return co.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)
  }).sort((a, b) => a.check_out.localeCompare(b.check_out))

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button onClick={prevMonth} style={{ background: 'none', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.5)', padding: '6px 14px', cursor: 'pointer', fontFamily: 'system-ui' }}>←</button>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#f5f0e8' }}>
          {MONTHS_FR[month]} {year}
        </div>
        <button onClick={nextMonth} style={{ background: 'none', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.5)', padding: '6px 14px', cursor: 'pointer', fontFamily: 'system-ui' }}>→</button>
      </div>

      {/* Légende chambres */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        {ROOMS.map(r => (
          <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: 'rgba(255,255,255,.5)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: ROOM_COLOR[r], display: 'inline-block' }} />
            {r}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ background: '#131a13', border: '1px solid rgba(255,255,255,.07)', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          {DAYS_FR.map(d => (
            <div key={d} style={{ padding: '8px 0', textAlign: 'center', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.25)' }}>{d}</div>
          ))}
        </div>
        {/* Weeks */}
        {Array.from({ length: cells.length / 7 }, (_, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
            {cells.slice(wi*7, wi*7+7).map((day, di) => {
              const iso = day ? isoDate(year, month, day) : null
              const resos = iso ? (dayMap[iso] || []) : []
              const isToday = iso === todayIso
              const isHovered = iso === hoveredDay
              return (
                <div key={di}
                  onMouseEnter={() => iso && setHoveredDay(iso)}
                  onMouseLeave={() => setHoveredDay(null)}
                  style={{
                    minHeight: 56,
                    padding: '6px 5px 4px',
                    borderRight: di < 6 ? '1px solid rgba(255,255,255,.04)' : 'none',
                    borderBottom: wi < cells.length/7-1 ? '1px solid rgba(255,255,255,.04)' : 'none',
                    background: isToday ? 'rgba(196,160,80,.06)' : isHovered && resos.length > 0 ? 'rgba(255,255,255,.03)' : 'transparent',
                    position: 'relative',
                    cursor: resos.length > 0 ? 'pointer' : 'default',
                  }}>
                  {day && (
                    <>
                      <div style={{
                        fontSize: '0.72rem', fontWeight: isToday ? 700 : 400,
                        color: isToday ? '#c4a050' : 'rgba(255,255,255,.4)',
                        marginBottom: 4,
                      }}>{day}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {resos.map((r, ri) => (
                          <div key={ri} style={{
                            background: ROOM_COLOR[r.room_id] || '#c4a050',
                            opacity: 0.85,
                            borderRadius: 2,
                            padding: '1px 4px',
                            fontSize: '0.58rem',
                            color: '#0a0f0a',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {r.room_id.replace('Côté ', '')}
                          </div>
                        ))}
                      </div>
                      {/* Tooltip on hover */}
                      {isHovered && resos.length > 0 && (
                        <div style={{
                          position: 'absolute', zIndex: 20,
                          top: '100%', left: di > 3 ? 'auto' : 0, right: di > 3 ? 0 : 'auto',
                          background: '#1e2a1e', border: '1px solid rgba(196,160,80,.25)',
                          padding: '10px 12px', minWidth: 200,
                          fontSize: '0.75rem', color: '#f5f0e8',
                          boxShadow: '0 4px 20px rgba(0,0,0,.5)',
                        }}>
                          {resos.map((r, ri) => (
                            <div key={ri} style={{ marginBottom: ri < resos.length-1 ? 10 : 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                                <span style={{ width: 8, height: 8, borderRadius: 1, background: ROOM_COLOR[r.room_id] || '#c4a050', flexShrink: 0 }} />
                                <strong>{r.guest_name}</strong>
                              </div>
                              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '0.68rem', paddingLeft: 14 }}>
                                {r.room_id} · {nights(r.check_in, r.check_out)} nuit{nights(r.check_in, r.check_out)>1?'s':''}
                              </div>
                              <div style={{ color: 'rgba(255,255,255,.35)', fontSize: '0.65rem', paddingLeft: 14 }}>
                                {fmtDate(r.check_in)} → {fmtDate(r.check_out)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* À faire ce mois */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Arrivées */}
        <div style={{ background: '#131a13', border: '1px solid rgba(109,184,122,.15)', borderRadius: 4, padding: '16px 18px' }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6db87a', marginBottom: 12 }}>
            Arrivées · {MONTHS_FR[month]}
          </div>
          {arrivals.length === 0 ? (
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,.25)' }}>Aucune</div>
          ) : arrivals.map(r => (
            <div key={r.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 1, background: ROOM_COLOR[r.room_id] || '#c4a050', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: '#f5f0e8', fontWeight: 500 }}>{r.guest_name}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,.4)', paddingLeft: 16 }}>
                {fmtDate(r.check_in)} — {r.room_id}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.3)', paddingLeft: 16 }}>
                {r.guests} pers. · {nights(r.check_in, r.check_out)} nuit{nights(r.check_in, r.check_out)>1?'s':''} · {r.total_price} €
              </div>
              {r.guest_phone && (
                <a href={`tel:${r.guest_phone}`} style={{ display: 'inline-block', paddingLeft: 16, fontSize: '0.68rem', color: '#c4a050', textDecoration: 'none', marginTop: 3 }}>
                  {r.guest_phone}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Départs */}
        <div style={{ background: '#131a13', border: '1px solid rgba(196,160,80,.15)', borderRadius: 4, padding: '16px 18px' }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4a050', marginBottom: 12 }}>
            Départs · {MONTHS_FR[month]}
          </div>
          {departures.length === 0 ? (
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,.25)' }}>Aucun</div>
          ) : departures.map(r => (
            <div key={r.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 1, background: ROOM_COLOR[r.room_id] || '#c4a050', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: '#f5f0e8', fontWeight: 500 }}>{r.guest_name}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,.4)', paddingLeft: 16 }}>
                {fmtDate(r.check_out)} — {r.room_id}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.3)', paddingLeft: 16 }}>
                {r.guests} pers. · {nights(r.check_in, r.check_out)} nuit{nights(r.check_in, r.check_out)>1?'s':''} · {r.total_price} €
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState('')
  const [tab, setTab] = useState<'reservations'|'planning'>('reservations')
  const [filter, setFilter] = useState<'all'|'pending'|'confirmed'|'paid'|'cancelled'>('all')
  const [selected, setSelected] = useState<Reservation | null>(null)

  const load = async () => {
    setLoading(true)
    setDbError('')
    const { data, error } = await getSupabase()
      .from('reservations')
      .select('*')
      .order('check_in', { ascending: true })
    if (error) setDbError(error.message)
    setReservations(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: string) => {
    await getSupabase().from('reservations').update({ status }).eq('id', id)
    setReservations(r => r.map(x => x.id === id ? { ...x, status: status as any } : x))
    if (selected?.id === id) setSelected(s => s ? { ...s, status: status as any } : null)
  }

  const filtered = filter === 'all' ? reservations : reservations.filter(r => r.status === filter)

  const counts = {
    all:       reservations.length,
    pending:   reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    paid:      reservations.filter(r => r.status === 'paid').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  }

  // Prochaines arrivées (dans les 7 jours)
  const today = new Date()
  today.setHours(0,0,0,0)
  const in7 = new Date(today); in7.setDate(in7.getDate() + 7)
  const arriving = reservations.filter(r => {
    const d = new Date(r.check_in)
    return d >= today && d <= in7 && r.status !== 'cancelled'
  })

  const S: Record<string, React.CSSProperties> = {
    page:    { minHeight: '100vh', background: '#0a0f0a', fontFamily: 'system-ui, sans-serif', color: '#f5f0e8' },
    header:  { background: '#0f160f', borderBottom: '1px solid rgba(196,160,80,.15)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky' as const, top: 0, zIndex: 10 },
    main:    { padding: '20px', maxWidth: 900, margin: '0 auto' },
    card:    { background: '#131a13', border: '1px solid rgba(255,255,255,.07)', borderRadius: 4, padding: '16px 18px', marginBottom: 10, cursor: 'pointer' },
    stat:    { background: '#131a13', border: '1px solid rgba(255,255,255,.07)', borderRadius: 4, padding: '14px 16px', flex: 1, textAlign: 'center' as const },
    badge:   { display: 'inline-block', fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: 2 },
    btn:     { border: '1px solid rgba(255,255,255,.12)', background: 'none', color: 'rgba(255,255,255,.5)', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, padding: '6px 12px', cursor: 'pointer', fontFamily: 'system-ui, sans-serif' },
    btnGold: { background: '#c4a050', color: '#0a0f0a', border: 'none', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, padding: '6px 14px', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontWeight: 600 },
  }
  const tabBtn = (active: boolean): React.CSSProperties => ({
    background: active ? 'rgba(196,160,80,.12)' : 'none',
    border: active ? '1px solid rgba(196,160,80,.3)' : '1px solid rgba(255,255,255,.08)',
    color: active ? '#c4a050' : 'rgba(255,255,255,.4)',
    fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase',
    padding: '7px 16px', cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
  })

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#f5f0e8' }}>La Boire Bavard</span>
          <span style={{ fontSize: '0.6rem', color: 'rgba(196,160,80,.55)', letterSpacing: '0.2em', textTransform: 'uppercase', marginLeft: 12 }}>Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={load} style={S.btn}>↻ Actualiser</button>
          <button onClick={onLogout} style={S.btn}>Déconnexion</button>
        </div>
      </div>

      <div style={S.main}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button style={tabBtn(tab === 'reservations')} onClick={() => setTab('reservations')}>
            Réservations
          </button>
          <button style={tabBtn(tab === 'planning')} onClick={() => setTab('planning')}>
            Planning
          </button>
        </div>

        {/* Debug temporaire */}
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.3)', marginBottom: 10, padding: '8px 12px', background: 'rgba(255,255,255,.03)', borderRadius: 4 }}>
          URL: {process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0,30) || '⚠ manquante'} · Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0,10) || '⚠ manquante'} · Lignes: {reservations.length}
        </div>

        {/* Erreur Supabase */}
        {dbError && (
          <div style={{ background: 'rgba(224,112,112,.1)', border: '1px solid rgba(224,112,112,.3)', padding: '14px 18px', marginBottom: 20, borderRadius: 4, fontSize: '0.82rem', color: '#e07070' }}>
            ⚠ Erreur Supabase : {dbError}
          </div>
        )}

        {/* Alerte arrivées imminentes */}
        {arriving.length > 0 && (
          <div style={{ background: 'rgba(196,160,80,.08)', border: '1px solid rgba(196,160,80,.3)', padding: '14px 18px', marginBottom: 20, borderRadius: 4 }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4a050' }}>
              🔔 {arriving.length} arrivée{arriving.length > 1 ? 's' : ''} dans les 7 prochains jours
            </span>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {arriving.map(r => (
                <div key={r.id} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,.7)' }}>
                  {fmtDate(r.check_in)} — <strong style={{ color: '#f5f0e8' }}>{r.guest_name}</strong> · {r.room_id} · {nights(r.check_in, r.check_out)} nuit{nights(r.check_in, r.check_out) > 1 ? 's' : ''}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Onglet Planning ── */}
        {tab === 'planning' && (
          loading ? (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.3)', padding: 40 }}>Chargement…</div>
          ) : (
            <Planning reservations={reservations} />
          )
        )}

        {/* ── Onglet Réservations ── */}
        {tab === 'reservations' && (
          <>
            {/* Stats */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' as const }}>
              {([['all','Toutes'], ['pending','En attente'], ['paid','Payées'], ['cancelled','Annulées']] as const).map(([k, label]) => (
                <div key={k} onClick={() => setFilter(k as any)}
                  style={{ ...S.stat, cursor: 'pointer', border: filter === k ? '1px solid rgba(196,160,80,.4)' : '1px solid rgba(255,255,255,.07)' }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#c4a050' }}>{counts[k]}</div>
                  <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Liste */}
            {loading ? (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.3)', padding: 40, fontSize: '0.8rem' }}>Chargement…</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.3)', padding: 40, fontSize: '0.8rem' }}>Aucune réservation</div>
            ) : (
              filtered.map(r => (
                <div key={r.id} style={{ ...S.card, borderColor: selected?.id === r.id ? 'rgba(196,160,80,.35)' : 'rgba(255,255,255,.07)' }}
                  onClick={() => setSelected(selected?.id === r.id ? null : r)}>

                  {/* Ligne principale */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' as const }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: ROOM_COLOR[r.room_id] || '#c4a050', flexShrink: 0 }} />
                      <span style={{ ...S.badge, background: 'rgba(255,255,255,.05)', color: STATUS_COLOR[r.status] }}>
                        {STATUS_LABEL[r.status]}
                      </span>
                      <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#f5f0e8' }}>{r.guest_name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,.35)' }}>{r.room_id}</span>
                    </div>
                    <div style={{ textAlign: 'right' as const }}>
                      <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,.6)' }}>
                        {fmtDate(r.check_in)} → {fmtDate(r.check_out)}
                      </div>
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#c4a050' }}>{r.total_price} €</div>
                    </div>
                  </div>

                  {/* Détail expandé */}
                  {selected?.id === r.id && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.06)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 16, fontSize: '0.82rem' }}>
                        {[
                          ['Email', r.guest_email],
                          ['Téléphone', r.guest_phone || '—'],
                          ['Voyageurs', `${r.guests} pers.`],
                          ['Durée', `${nights(r.check_in, r.check_out)} nuit${nights(r.check_in, r.check_out) > 1 ? 's' : ''}`],
                          ['Total', `${r.total_price} €`],
                          ['Réservation', fmtDate(r.created_at?.split('T')[0] || '')],
                        ].map(([l, v]) => (
                          <div key={l}>
                            <span style={{ color: 'rgba(255,255,255,.3)', fontSize: '0.65rem', textTransform: 'uppercase' as const, letterSpacing: '0.15em' }}>{l}</span>
                            <div style={{ color: '#f5f0e8', marginTop: 2 }}>{v}</div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                        {r.status === 'pending' && (
                          <button style={S.btnGold} onClick={e => { e.stopPropagation(); updateStatus(r.id, 'confirmed') }}>
                            ✓ Confirmer
                          </button>
                        )}
                        {r.status !== 'cancelled' && (
                          <button style={{ ...S.btn, color: '#e07070', borderColor: 'rgba(224,112,112,.3)' }}
                            onClick={e => { e.stopPropagation(); updateStatus(r.id, 'cancelled') }}>
                            Annuler
                          </button>
                        )}
                        {r.guest_email && (
                          <a href={`mailto:${r.guest_email}?subject=Votre séjour à La Boire Bavard`}
                            onClick={e => e.stopPropagation()}
                            style={{ ...S.btn, textDecoration: 'none', display: 'inline-block' }}>
                            ✉ Email
                          </a>
                        )}
                        {r.guest_phone && (
                          <a href={`https://wa.me/${r.guest_phone.replace(/\D/g,'').replace(/^0/,'33')}`}
                            target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ ...S.btn, textDecoration: 'none', display: 'inline-block', color: '#6db87a', borderColor: 'rgba(109,184,122,.3)' }}>
                            💬 WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Page principale ────────────────────────────────────────────────────────
export default function AdminPage() {
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === '1') setAuth(true)
  }, [])

  const login  = () => { sessionStorage.setItem('admin_auth', '1'); setAuth(true) }
  const logout = () => { sessionStorage.removeItem('admin_auth'); setAuth(false) }

  return auth ? <Dashboard onLogout={logout} /> : <LoginScreen onLogin={login} />
}
