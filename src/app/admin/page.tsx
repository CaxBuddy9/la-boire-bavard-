'use client'
import { useState, useEffect } from 'react'
import type { Reservation } from '@/lib/supabase'

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

// ── KPIs ───────────────────────────────────────────────────────────────────
function KPIs({ reservations }: { reservations: Reservation[] }) {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const monthPrefix = `${y}-${String(m+1).padStart(2,'0')}`

  const active = reservations.filter(r => r.status !== 'cancelled')
  const thisMonth = active.filter(r => r.check_in.startsWith(monthPrefix) || r.check_out.startsWith(monthPrefix))

  // Nuits occupées ce mois
  const daysInMonth = new Date(y, m+1, 0).getDate()
  let nightsOccupied = 0
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = isoDate(y, m, d)
    const occupied = active.some(r => iso >= r.check_in && iso < r.check_out)
    if (occupied) nightsOccupied++
  }
  const occupancy = Math.round((nightsOccupied / (daysInMonth * 4)) * 100) // 4 chambres

  // CA ce mois
  const revenueMonth = thisMonth.reduce((s, r) => s + r.total_price, 0)
  // CA année
  const revenueYear  = active.filter(r => r.check_in.startsWith(String(y))).reduce((s, r) => s + r.total_price, 0)
  // Durée moy
  const avgNights = active.length
    ? Math.round(active.reduce((s, r) => s + nights(r.check_in, r.check_out), 0) / active.length * 10) / 10
    : 0
  // Chambre star
  const roomCount: Record<string,number> = {}
  active.forEach(r => { roomCount[r.room_id] = (roomCount[r.room_id] || 0) + 1 })
  const topRoom = Object.entries(roomCount).sort((a,b) => b[1]-a[1])[0]

  const kpis = [
    { label: 'Taux occupation', value: `${occupancy} %`, sub: `ce mois (4 chambres)`, color: occupancy > 70 ? '#6db87a' : occupancy > 40 ? '#c4a050' : 'rgba(255,255,255,.5)' },
    { label: 'CA ce mois',     value: `${revenueMonth} €`, sub: MONTHS_FR[m], color: '#c4a050' },
    { label: `CA ${y}`,        value: `${revenueYear} €`,  sub: 'année en cours', color: '#c4a050' },
    { label: 'Durée moy.',     value: `${avgNights} nuits`, sub: 'par séjour', color: 'rgba(255,255,255,.7)' },
    { label: 'Chambre ★',      value: topRoom ? topRoom[0].replace('Côté ','') : '—', sub: topRoom ? `${topRoom[1]} résa` : '', color: topRoom ? ROOM_COLOR[topRoom[0]] : 'rgba(255,255,255,.5)' },
    { label: 'Résa totales',   value: String(active.length), sub: 'toutes périodes', color: 'rgba(255,255,255,.7)' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
      {kpis.map(k => (
        <div key={k.label} style={{ background: '#131a13', border: '1px solid rgba(255,255,255,.07)', borderRadius: 4, padding: '14px 16px' }}>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 6 }}>{k.label}</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: k.color, marginBottom: 2 }}>{k.value}</div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,.25)' }}>{k.sub}</div>
        </div>
      ))}
    </div>
  )
}

// ── Modal ajout réservation manuelle ───────────────────────────────────────
function AddReservationModal({ onClose, onSaved }: { onClose: () => void, onSaved: () => void }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    room_id: 'Côté Jardin', guest_name: '', guest_email: '', guest_phone: '',
    check_in: today, check_out: today, guests: 2, status: 'confirmed', table_hotes: false,
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const n = nights(form.check_in, form.check_out)
  const price = n * 88

  const F = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.guest_name || n <= 0) { setErr('Nom et dates valides requis.'); return }
    setSaving(true)
    setErr('')

    // Vérifier les conflits avant d'insérer
    try {
      const avail = await fetch(`/api/availability?arrive=${form.check_in}&depart=${form.check_out}`).then(r => r.json())
      if (avail.taken?.includes(form.room_id)) {
        setErr(`${form.room_id} est déjà réservée sur ces dates.`)
        setSaving(false)
        return
      }
    } catch {}

    const res = await fetch('/api/admin/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, total_price: price }),
    })
    const d = await res.json()
    if (d.error) { setErr(d.error); setSaving(false) }
    else { onSaved(); onClose() }
  }

  const inp: React.CSSProperties = {
    background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
    color: '#f5f0e8', padding: '9px 12px', fontSize: '0.85rem',
    fontFamily: 'system-ui', outline: 'none', width: '100%',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#131a13', border: '1px solid rgba(196,160,80,.2)', padding: '32px 28px', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#f5f0e8' }}>Ajouter une réservation</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Chambre */}
          <div>
            <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 6 }}>Chambre</label>
            <select value={form.room_id} onChange={e => F('room_id', e.target.value)} style={{ ...inp }}>
              {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Nom */}
          <div>
            <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 6 }}>Nom *</label>
            <input value={form.guest_name} onChange={e => F('guest_name', e.target.value)} placeholder="Marie Dupont" required style={inp} />
          </div>

          {/* Email + Tel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 6 }}>Email</label>
              <input type="email" value={form.guest_email} onChange={e => F('guest_email', e.target.value)} style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 6 }}>Téléphone</label>
              <input type="tel" value={form.guest_phone} onChange={e => F('guest_phone', e.target.value)} style={inp} />
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 6 }}>Arrivée *</label>
              <input type="date" value={form.check_in} onChange={e => F('check_in', e.target.value)} required style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 6 }}>Départ *</label>
              <input type="date" value={form.check_out} onChange={e => F('check_out', e.target.value)} required style={inp} />
            </div>
          </div>

          {/* Voyageurs + Statut */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 6 }}>Voyageurs</label>
              <input type="number" min={1} max={4} value={form.guests} onChange={e => F('guests', Number(e.target.value))} style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)', marginBottom: 6 }}>Statut</label>
              <select value={form.status} onChange={e => F('status', e.target.value)} style={inp}>
                <option value="confirmed">Confirmée</option>
                <option value="pending">En attente</option>
                <option value="paid">Payée</option>
              </select>
            </div>
          </div>

          {/* Table d'hôtes */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.82rem', color: 'rgba(255,255,255,.6)' }}>
            <input type="checkbox" checked={form.table_hotes} onChange={e => F('table_hotes', e.target.checked)} style={{ accentColor: '#c4a050', width: 16, height: 16 }} />
            Table d'hôtes
          </label>

          {/* Prix calculé */}
          {n > 0 && (
            <div style={{ background: 'rgba(196,160,80,.06)', border: '1px solid rgba(196,160,80,.15)', padding: '10px 14px', fontSize: '0.82rem', color: '#c4a050' }}>
              {n} nuit{n>1?'s':''} × 88 € = <strong>{price} €</strong>
            </div>
          )}

          {err && <div style={{ color: '#e07070', fontSize: '0.78rem' }}>{err}</div>}

          <button type="submit" disabled={saving} style={{
            background: '#c4a050', color: '#0a0f0a', border: 'none', padding: '12px',
            fontFamily: 'system-ui', fontSize: '0.65rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', fontWeight: 600, cursor: saving ? 'default' : 'pointer',
            opacity: saving ? 0.6 : 1,
          }}>
            {saving ? 'Enregistrement…' : 'Enregistrer la réservation'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Login ──────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErr(false)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      })
      const data = await res.json()
      if (data.ok) {
        onLogin()
      } else {
        setErr(true)
        setPwd('')
      }
    } catch {
      setErr(true)
      setPwd('')
    }
    setLoading(false)
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
          <button type="submit" disabled={loading} style={{
            width: '100%', background: '#c4a050', color: '#0a0f0a',
            border: 'none', padding: '13px', cursor: loading ? 'default' : 'pointer',
            fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif', fontWeight: 600,
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Vérification…' : 'Accéder au dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Planning Gantt ──────────────────────────────────────────────────────────
function Planning({ reservations }: { reservations: Reservation[] }) {
  const now = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [tooltip, setTooltip] = useState<{ r: Reservation, x: number, y: number } | null>(null)

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1) } else setMonth(m => m-1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1) } else setMonth(m => m+1) }

  const totalDays = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: totalDays }, (_, i) => i + 1)
  const todayIso = isoDate(now.getFullYear(), now.getMonth(), now.getDate())
  const CELL = 34
  const ROW_LABEL = 110

  const active = reservations.filter(r => r.status !== 'cancelled')

  function getBar(r: Reservation) {
    const monthStart = isoDate(year, month, 1)
    const monthEnd   = isoDate(year, month, totalDays)
    if (r.check_out <= monthStart || r.check_in > monthEnd) return null
    const startDay = r.check_in >= monthStart ? parseInt(r.check_in.split('-')[2]) - 1 : 0
    const endDay   = r.check_out <= monthEnd  ? parseInt(r.check_out.split('-')[2]) - 1 : totalDays
    return { startDay, span: Math.max(1, endDay - startDay) }
  }

  const monthPrefix = `${year}-${String(month+1).padStart(2,'0')}`
  const arrivals   = active.filter(r => r.check_in.startsWith(monthPrefix)).sort((a,b) => a.check_in.localeCompare(b.check_in))
  const departures = active.filter(r => r.check_out.startsWith(monthPrefix)).sort((a,b) => a.check_out.localeCompare(b.check_out))

  return (
    <div>
      {/* Nav mois */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button onClick={prevMonth} style={{ background: 'none', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.5)', padding: '6px 14px', cursor: 'pointer', fontFamily: 'system-ui' }}>←</button>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#f5f0e8' }}>{MONTHS_FR[month]} {year}</div>
        <button onClick={nextMonth} style={{ background: 'none', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.5)', padding: '6px 14px', cursor: 'pointer', fontFamily: 'system-ui' }}>→</button>
      </div>

      {/* Gantt */}
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <div style={{ minWidth: ROW_LABEL + CELL * totalDays }}>
          {/* En-tête jours */}
          <div style={{ display: 'flex', marginLeft: ROW_LABEL }}>
            {days.map(d => {
              const iso = isoDate(year, month, d)
              const isToday = iso === todayIso
              const dow = new Date(year, month, d).getDay()
              const isWeekend = dow === 0 || dow === 6
              return (
                <div key={d} style={{ width: CELL, flexShrink: 0, textAlign: 'center', fontSize: '0.6rem', paddingBottom: 6, color: isToday ? '#c4a050' : isWeekend ? 'rgba(255,255,255,.4)' : 'rgba(255,255,255,.25)', fontWeight: isToday ? 700 : 400, borderLeft: isToday ? '1px solid rgba(196,160,80,.4)' : '1px solid transparent' }}>
                  {d}
                </div>
              )
            })}
          </div>
          {/* Lignes chambres */}
          {ROOMS.map(roomName => {
            const roomResas = active.filter(r => r.room_id === roomName)
            return (
              <div key={roomName} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ width: ROW_LABEL, flexShrink: 0, paddingRight: 10, fontSize: '0.7rem', color: 'rgba(255,255,255,.55)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: ROOM_COLOR[roomName], flexShrink: 0 }} />
                  {roomName.replace('Côté ', '')}
                </div>
                <div style={{ position: 'relative', height: 36, flex: 1 }}>
                  <div style={{ display: 'flex', height: '100%' }}>
                    {days.map(d => {
                      const iso = isoDate(year, month, d)
                      const isToday = iso === todayIso
                      const dow = new Date(year, month, d).getDay()
                      const isWeekend = dow === 0 || dow === 6
                      return (
                        <div key={d} style={{ width: CELL, flexShrink: 0, height: '100%', background: isToday ? 'rgba(196,160,80,.06)' : isWeekend ? 'rgba(255,255,255,.015)' : 'transparent', borderLeft: isToday ? '1px solid rgba(196,160,80,.25)' : '1px solid rgba(255,255,255,.04)', borderTop: '1px solid rgba(255,255,255,.04)', borderBottom: '1px solid rgba(255,255,255,.04)' }} />
                      )
                    })}
                  </div>
                  {roomResas.map(r => {
                    const bar = getBar(r)
                    if (!bar) return null
                    const isPending = r.status === 'pending'
                    return (
                      <div key={r.id}
                        onMouseEnter={e => setTooltip({ r, x: e.clientX, y: e.clientY })}
                        onMouseLeave={() => setTooltip(null)}
                        style={{ position: 'absolute', top: 4, height: 28, left: bar.startDay * CELL + 2, width: bar.span * CELL - 4, background: ROOM_COLOR[roomName] || '#c4a050', opacity: isPending ? 0.5 : 0.88, borderRadius: 3, cursor: 'pointer', display: 'flex', alignItems: 'center', paddingLeft: 8, overflow: 'hidden', border: isPending ? '1px dashed rgba(255,255,255,.4)' : 'none' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#0a0f0a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {r.guest_name}{isPending ? ' · en attente' : ''}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Légende */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.65rem', color: 'rgba(255,255,255,.4)' }}>
          <div style={{ width: 24, height: 10, borderRadius: 2, background: 'rgba(109,184,122,.88)' }} /> Confirmée / Payée
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.65rem', color: 'rgba(255,255,255,.4)' }}>
          <div style={{ width: 24, height: 10, borderRadius: 2, background: 'rgba(255,255,255,.3)', border: '1px dashed rgba(255,255,255,.5)' }} /> En attente
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{ position: 'fixed', zIndex: 100, top: tooltip.y + 12, left: Math.min(tooltip.x + 8, window.innerWidth - 230), background: '#1e2a1e', border: '1px solid rgba(196,160,80,.3)', padding: '12px 14px', borderRadius: 4, fontSize: '0.78rem', color: '#f5f0e8', boxShadow: '0 8px 32px rgba(0,0,0,.6)', pointerEvents: 'none', minWidth: 200 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>{tooltip.r.guest_name}</div>
          <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '0.7rem', marginBottom: 3 }}>{tooltip.r.room_id}</div>
          <div style={{ color: '#c4a050', fontSize: '0.7rem', marginBottom: 3 }}>{fmtDate(tooltip.r.check_in)} → {fmtDate(tooltip.r.check_out)}</div>
          <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '0.68rem' }}>{tooltip.r.guests} pers. · {nights(tooltip.r.check_in, tooltip.r.check_out)} nuits · {tooltip.r.total_price} €</div>
          {tooltip.r.guest_phone && <div style={{ color: 'rgba(196,160,80,.7)', fontSize: '0.68rem', marginTop: 4 }}>{tooltip.r.guest_phone}</div>}
        </div>
      )}

      {/* Arrivées / Départs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#131a13', border: '1px solid rgba(109,184,122,.15)', borderRadius: 4, padding: '16px 18px' }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6db87a', marginBottom: 12 }}>Arrivées · {MONTHS_FR[month]}</div>
          {arrivals.length === 0 ? <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,.25)' }}>Aucune</div>
          : arrivals.map(r => (
            <div key={r.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ width: 8, height: 8, borderRadius: 1, background: ROOM_COLOR[r.room_id] || '#c4a050', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: '#f5f0e8', fontWeight: 500 }}>{r.guest_name}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.35)', paddingLeft: 16 }}>{fmtDate(r.check_in)} · {r.room_id} · {nights(r.check_in, r.check_out)} nuits</div>
              {r.guest_phone && <a href={`tel:${r.guest_phone}`} style={{ display: 'block', paddingLeft: 16, fontSize: '0.68rem', color: '#c4a050', textDecoration: 'none', marginTop: 2 }}>{r.guest_phone}</a>}
            </div>
          ))}
        </div>
        <div style={{ background: '#131a13', border: '1px solid rgba(196,160,80,.15)', borderRadius: 4, padding: '16px 18px' }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4a050', marginBottom: 12 }}>Départs · {MONTHS_FR[month]}</div>
          {departures.length === 0 ? <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,.25)' }}>Aucun</div>
          : departures.map(r => (
            <div key={r.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ width: 8, height: 8, borderRadius: 1, background: ROOM_COLOR[r.room_id] || '#c4a050', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: '#f5f0e8', fontWeight: 500 }}>{r.guest_name}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.35)', paddingLeft: 16 }}>{fmtDate(r.check_out)} · {r.room_id}</div>
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
  const [showAdd, setShowAdd] = useState(false)
  const [tab, setTab] = useState<'reservations'|'planning'>('reservations')
  const [filter, setFilter] = useState<'all'|'pending'|'confirmed'|'paid'|'cancelled'>('all')
  const [selected, setSelected] = useState<Reservation | null>(null)

  const load = async () => {
    setLoading(true)
    setDbError('')
    try {
      const res = await fetch('/api/admin/reservations')
      const json = await res.json()
      if (json.error) setDbError(json.error)
      else setReservations(json.data || [])
    } catch (err: any) {
      setDbError(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/reservations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setReservations(r => r.map(x => x.id === id ? { ...x, status: status as any } : x))
    if (selected?.id === id) setSelected(s => s ? { ...s, status: status as any } : null)
  }

  const deleteReservation = async (id: string) => {
    if (!confirm('Supprimer définitivement cette réservation ?')) return
    await fetch('/api/admin/reservations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setReservations(r => r.filter(x => x.id !== id))
    if (selected?.id === id) setSelected(null)
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
          <button onClick={() => setShowAdd(true)} style={S.btnGold}>+ Ajouter</button>
          <button onClick={load} style={S.btn}>↻ Actualiser</button>
          <button onClick={onLogout} style={S.btn}>Déconnexion</button>
        </div>
      </div>

      {showAdd && (
        <AddReservationModal onClose={() => setShowAdd(false)} onSaved={load} />
      )}

      <div style={S.main}>

        {/* KPIs */}
        {!loading && <KPIs reservations={reservations} />}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button style={tabBtn(tab === 'reservations')} onClick={() => setTab('reservations')}>
            Réservations
          </button>
          <button style={tabBtn(tab === 'planning')} onClick={() => setTab('planning')}>
            Planning
          </button>
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

                      {/* Message du client */}
                      {r.message && (
                        <div style={{ background: 'rgba(196,160,80,.06)', border: '1px solid rgba(196,160,80,.18)', padding: '12px 14px', marginBottom: 14, borderRadius: 3 }}>
                          <span style={{ color: 'rgba(196,160,80,.6)', fontSize: '0.6rem', textTransform: 'uppercase' as const, letterSpacing: '0.15em', display: 'block', marginBottom: 6 }}>Message</span>
                          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '0.82rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' as const }}>{r.message}</p>
                        </div>
                      )}

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
                        <button style={{ ...S.btn, color: 'rgba(200,80,80,.7)', borderColor: 'rgba(200,80,80,.2)' }}
                          onClick={e => { e.stopPropagation(); deleteReservation(r.id) }}>
                          🗑 Supprimer
                        </button>
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
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Check auth status by probing the protected API
    fetch('/api/admin/reservations')
      .then(res => {
        if (res.status === 200) setAuth(true)
        else setAuth(false)
      })
      .catch(() => setAuth(false))
      .finally(() => setChecking(false))
  }, [])

  const login = () => { setAuth(true) }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setAuth(false)
  }

  if (checking) return null

  return auth ? <Dashboard onLogout={logout} /> : <LoginScreen onLogin={login} />
}
