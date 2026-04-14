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

// ── Panel "Ce soir" — hôtes du jour ────────────────────────────────────────
type GuestRequest = {
  id: string
  room: string
  type: 'diet' | 'dinner' | 'spa'
  data: Record<string, unknown>
  lang: string
  created_at: string
}

const ROOM_SLUGS: { slug: string; name: string; emoji: string; color: string }[] = [
  { slug: 'jardin',  name: 'Côté Jardin',  emoji: '🌿', color: '#6db87a' },
  { slug: 'cedre',   name: 'Côté Cèdre',   emoji: '🌲', color: '#c4907a' },
  { slug: 'vallee',  name: 'Côté Vallée',  emoji: '🏞️', color: '#7ab8c4' },
  { slug: 'potager', name: 'Côté Potager', emoji: '🌱', color: '#8ab578' },
]

function HotesPanel() {
  const [requests, setRequests] = useState<GuestRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const load = async () => {
    try {
      const res = await fetch('/api/guide/request')
      const json = await res.json()
      if (json.data) {
        setRequests(json.data)
        setLastUpdate(new Date())
      }
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 20000)
    return () => clearInterval(interval)
  }, [])

  const getForRoom = (slug: string, type: GuestRequest['type']) => {
    return requests
      .filter(r => r.room === slug && r.type === type)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))[0]
  }

  const totalDiets   = requests.filter(r => r.type === 'diet').length
  const totalDinners = requests.filter(r => r.type === 'dinner').length
  const totalSpas    = requests.filter(r => r.type === 'spa').length
  const anyData      = totalDiets + totalDinners + totalSpas > 0

  return (
    <div>
      {/* En-tête + résumé */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#f5f0e8', marginBottom: 4 }}>
            Ce soir &amp; demain matin
          </div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,.3)', letterSpacing: '0.1em' }}>
            Demandes des hôtes · mise à jour automatique toutes les 20s
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {lastUpdate && (
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,.2)' }}>
              {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button onClick={load} style={{ background: 'none', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.4)', fontSize: '0.7rem', padding: '5px 10px', cursor: 'pointer', fontFamily: 'system-ui' }}>
            ↻
          </button>
        </div>
      </div>

      {/* Résumé rapide */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
          {[
            { icon: '🥗', label: 'Régimes alimentaires', count: totalDiets, color: '#6db87a' },
            { icon: '🍽️', label: 'Dîners réservés', count: totalDinners, color: '#c4a050' },
            { icon: '🛁', label: 'Jacuzzi / Spa réservé', count: totalSpas, color: '#7ab8c4' },
          ].map(k => (
            <div key={k.label} style={{ background: '#131a13', border: `1px solid ${k.count > 0 ? k.color + '40' : 'rgba(255,255,255,.07)'}`, borderRadius: 4, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{k.icon}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: k.count > 0 ? k.color : 'rgba(255,255,255,.2)', marginBottom: 3 }}>{k.count}</div>
              <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{k.label}</div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.3)', padding: 40 }}>Chargement…</div>
      ) : !anyData ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>💤</div>
          <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '0.85rem' }}>Aucune demande pour le moment.</div>
          <div style={{ color: 'rgba(255,255,255,.2)', fontSize: '0.75rem', marginTop: 6 }}>Les hôtes qui scannent leur QR code apparaîtront ici.</div>
        </div>
      ) : (
        /* Cartes par chambre */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ROOM_SLUGS.map(room => {
            const diet   = getForRoom(room.slug, 'diet')
            const dinner = getForRoom(room.slug, 'dinner')
            const spa    = getForRoom(room.slug, 'spa')
            const hasAny = diet || dinner || spa
            if (!hasAny) return null

            const diets   = (diet?.data?.diets as string[]) || []
            const dinnerTime = dinner?.data?.time as string
            const dinnerGuests = dinner?.data?.guests as number
            const spaSlot = spa?.data?.slot as string

            return (
              <div key={room.slug} style={{ background: '#131a13', border: `1px solid ${room.color}30`, borderRadius: 4, overflow: 'hidden' }}>
                {/* En-tête chambre */}
                <div style={{ background: `${room.color}14`, borderBottom: `1px solid ${room.color}25`, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.2rem' }}>{room.emoji}</span>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#f5f0e8' }}>{room.name}</span>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: room.color, marginLeft: 'auto' }}>
                    {[diet && 'régime', dinner && 'dîner', spa && 'spa'].filter(Boolean).join(' · ')}
                  </span>
                </div>
                {/* Contenu */}
                <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: diets.length > 0 ? '1fr 1fr 1fr' : dinnerTime || spaSlot ? '1fr 1fr' : '1fr', gap: 16 }}>
                  {/* Régimes */}
                  {diets.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6db87a', marginBottom: 8 }}>🥗 Petit-déjeuner</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {diets.map((d: string) => (
                          <span key={d} style={{ fontSize: '0.72rem', background: 'rgba(109,184,122,.12)', border: '1px solid rgba(109,184,122,.25)', color: '#6db87a', padding: '3px 8px', borderRadius: 3 }}>
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Dîner */}
                  {dinnerTime && (
                    <div>
                      <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4a050', marginBottom: 8 }}>🍽️ Dîner ce soir</div>
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#c4a050' }}>{dinnerTime}</div>
                      {dinnerGuests && (
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,.4)', marginTop: 4 }}>{dinnerGuests} pers. · 25 €/pers.</div>
                      )}
                    </div>
                  )}
                  {/* Spa */}
                  {spaSlot && (
                    <div>
                      <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7ab8c4', marginBottom: 8 }}>🛁 Jacuzzi</div>
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#7ab8c4' }}>{spaSlot}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,.4)', marginTop: 4 }}>
                        {(() => {
                          const lang = spa?.lang
                          if (lang === 'en') return 'Slot booked'
                          if (lang === 'es') return 'Reservado'
                          if (lang === 'pt') return 'Reservado'
                          return 'Créneau réservé'
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Note info */}
      <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(196,160,80,.04)', border: '1px solid rgba(196,160,80,.1)', borderRadius: 4, fontSize: '0.72rem', color: 'rgba(255,255,255,.3)', lineHeight: 1.6 }}>
        <strong style={{ color: 'rgba(196,160,80,.5)' }}>Comment ça marche ?</strong><br />
        Vos hôtes scannent le QR code de leur chambre et renseignent leurs préférences alimentaires, réservent le dîner ou choisissent un créneau spa. Leurs demandes apparaissent ici en temps réel.
        <br />Pour que ça fonctionne, créez la table <code style={{ fontFamily: 'monospace', color: 'rgba(196,160,80,.6)' }}>guest_requests</code> dans votre tableau de bord Supabase (voir instructions).
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

// ── Facturation ────────────────────────────────────────────────────────────
const PRICE_NUIT  = 88
const PRICE_TABLE = 25
const TAXE_SEJOUR = 0.83

function fmtDateFact(iso: string) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
function nightsFact(a: string, d: string) {
  if (!a || !d) return 0
  return Math.max(0, Math.round((new Date(d).getTime() - new Date(a).getTime()) / 86400000))
}
function pad4(n: number) { return String(n).padStart(4, '0') }

function FacturationPanel() {
  const today = new Date().toISOString().split('T')[0]
  const [num,         setNum]         = useState(`LBB-${new Date().getFullYear()}-${pad4(1)}`)
  const [dateFacture, setDateFacture] = useState(today)
  const [nom,         setNom]         = useState('')
  const [prenom,      setPrenom]      = useState('')
  const [adresse,     setAdresse]     = useState('')
  const [email,       setEmail]       = useState('')
  const [chambre,     setChambre]     = useState('Côté Jardin')
  const [arrive,      setArrive]      = useState('')
  const [depart,      setDepart]      = useState('')
  const [pers,        setPers]        = useState(2)
  const [tableHotes,  setTableHotes]  = useState(0)
  const [note,        setNote]        = useState('')

  const n = nightsFact(arrive, depart)
  const lignes = [
    { label: `Chambre ${chambre} — ${n} nuit${n > 1 ? 's' : ''} × ${PRICE_NUIT} €`, qty: n, pu: PRICE_NUIT, total: n * PRICE_NUIT },
    ...(tableHotes > 0 ? [{ label: `Table d'hôtes — ${tableHotes} convive${tableHotes > 1 ? 's' : ''}`, qty: tableHotes, pu: PRICE_TABLE, total: tableHotes * PRICE_TABLE }] : []),
    ...(n > 0 ? [{ label: `Taxe de séjour — ${pers} pers. × ${n} nuit${n > 1 ? 's' : ''} × ${TAXE_SEJOUR} €`, qty: pers * n, pu: TAXE_SEJOUR, total: Math.round(pers * n * TAXE_SEJOUR * 100) / 100 }] : []),
  ]
  const total = lignes.reduce((s, l) => s + l.total, 0)

  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8"/>
      <title>Facture ${num} — La Boire Bavard</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:system-ui,sans-serif;color:#1a1a1a;background:#fff;padding:48px;max-width:800px;margin:auto}
        .hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;padding-bottom:22px;border-bottom:2px solid #c4a050}
        .logo{font-family:Georgia,serif;font-size:1.6rem;color:#1a3220}
        .sub{font-size:0.62rem;letter-spacing:0.24em;text-transform:uppercase;color:#c4a050;margin-top:4px}
        .etab{font-size:0.78rem;color:#555;line-height:1.7;margin-top:8px}
        .fnum{font-family:Georgia,serif;font-size:1.1rem;color:#1a3220;text-align:right}
        .fdate{font-size:0.78rem;color:#777;margin-top:6px;text-align:right}
        .stitle{font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;color:#c4a050;margin-bottom:10px}
        .cbox{background:#f8f6f0;padding:16px 20px;border-left:3px solid #c4a050;margin-bottom:30px}
        .cname{font-family:Georgia,serif;font-size:1.05rem;margin-bottom:4px}
        .cdet{font-size:0.82rem;color:#555;line-height:1.6}
        .sbar{display:flex;flex-wrap:wrap;gap:20px 32px;margin-bottom:28px;padding:14px 20px;background:#1a3220;color:#fff}
        .sitem label{font-size:0.54rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(196,160,80,.8);display:block;margin-bottom:3px}
        .sitem span{font-size:0.88rem}
        table{width:100%;border-collapse:collapse;margin-bottom:22px}
        thead tr{border-bottom:1px solid #c4a050}
        th{font-size:0.58rem;letter-spacing:0.14em;text-transform:uppercase;color:#888;padding:8px 0;text-align:left;font-weight:400}
        th.r,td.r{text-align:right}
        td{padding:11px 0;font-size:0.85rem;border-bottom:1px solid #eee;vertical-align:top}
        .gline{height:2px;background:linear-gradient(90deg,#c4a050,transparent);margin-bottom:14px}
        .ttl{display:flex;justify-content:flex-end}
        .ttl table{width:auto}
        .ttl td{border:none;padding:5px 0}
        .ttl td:first-child{padding-right:40px;font-size:0.8rem;color:#777}
        .ttl td:last-child{font-size:0.8rem;color:#777;text-align:right}
        .ttl tr.big td{padding-top:14px;font-family:Georgia,serif;font-size:1.15rem;color:#1a3220;border-top:2px solid #1a3220}
        .notebox{background:#f8f6f0;padding:14px 18px;font-size:0.8rem;color:#555;line-height:1.6;margin-top:24px;border-left:2px solid #ddd}
        .foot{margin-top:44px;padding-top:18px;border-top:1px solid #eee;font-size:0.7rem;color:#aaa;text-align:center;line-height:1.8}
      </style></head><body>
      <div class="hd">
        <div>
          <div class="logo">La Boire Bavard</div>
          <div class="sub">Chambres d'Hôtes · Anjou</div>
          <div class="etab">4 chemin de la Boire Bavard, Lieu-dit La Hutte<br/>49320 Blaison-Saint-Sulpice<br/>06 75 78 63 35 · laboirebavard@gmail.com</div>
        </div>
        <div><div class="fnum">Facture ${num}</div><div class="fdate">Émise le ${fmtDateFact(dateFacture)}</div></div>
      </div>
      <div class="stitle">Facturé à</div>
      <div class="cbox">
        <div class="cname">${prenom} ${nom}</div>
        <div class="cdet">${adresse ? adresse + '<br/>' : ''}${email}</div>
      </div>
      ${n > 0 ? `<div class="sbar">${[['Chambre',chambre],['Arrivée',fmtDateFact(arrive)],['Départ',fmtDateFact(depart)],['Durée',n+' nuit'+(n>1?'s':'')],['Personnes',String(pers)]].map(([l,v])=>`<div class="sitem"><label>${l}</label><span>${v}</span></div>`).join('')}</div>` : ''}
      <table><thead><tr><th>Prestation</th><th class="r">Qté</th><th class="r">P.U.</th><th class="r">Total</th></tr></thead>
      <tbody>${lignes.map(l=>`<tr><td>${l.label}</td><td class="r" style="color:#777">${l.qty}</td><td class="r" style="color:#777">${l.pu.toFixed(2)} €</td><td class="r" style="font-weight:500">${l.total.toFixed(2)} €</td></tr>`).join('')}</tbody></table>
      <div class="gline"></div>
      <div class="ttl"><table><tr><td>Sous-total</td><td>${total.toFixed(2)} €</td></tr><tr><td>TVA</td><td>Non applicable</td></tr><tr class="big"><td>Total TTC</td><td>${total.toFixed(2)} €</td></tr></table></div>
      ${note ? `<div class="notebox"><strong style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:#888">Note</strong><br/>${note}</div>` : ''}
      <div class="foot">La Boire Bavard · 4 chemin de la Boire Bavard · 49320 Blaison-Saint-Sulpice<br/>Sandrine · 06 75 78 63 35 · laboirebavard@gmail.com<br/>Micro-entreprise · TVA non applicable — art. 293B du CGI</div>
    </body></html>`)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 400)
  }

  const inp: React.CSSProperties = { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(196,160,80,.2)', color: '#f5f0e8', fontFamily: 'system-ui, sans-serif', fontSize: '0.82rem', padding: '7px 10px', width: '100%', outline: 'none' }
  const lbl: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 }
  const cap: React.CSSProperties = { fontSize: '0.52rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(196,160,80,.55)' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
      {/* Formulaire */}
      <div style={{ background: '#131a13', border: '1px solid rgba(196,160,80,.15)', padding: 20 }}>
        <p style={{ fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c4a050', marginBottom: 16 }}>Nouvelle facture</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <label style={lbl}><span style={cap}>N° facture</span><input style={inp} value={num} onChange={e => setNum(e.target.value)} /></label>
          <label style={lbl}><span style={cap}>Date</span><input style={{...inp, colorScheme:'dark'}} type="date" value={dateFacture} onChange={e => setDateFacture(e.target.value)} /></label>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,.06)', margin: '12px 0' }} />
        <p style={{ ...cap, marginBottom: 10 }}>Client</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <label style={lbl}><span style={cap}>Prénom</span><input style={inp} value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Marie" /></label>
          <label style={lbl}><span style={cap}>Nom</span><input style={inp} value={nom} onChange={e => setNom(e.target.value)} placeholder="Dupont" /></label>
        </div>
        <label style={{...lbl, marginBottom: 10}}><span style={cap}>Adresse</span><input style={inp} value={adresse} onChange={e => setAdresse(e.target.value)} /></label>
        <label style={{...lbl, marginBottom: 14}}><span style={cap}>Email</span><input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
        <div style={{ height: 1, background: 'rgba(255,255,255,.06)', margin: '12px 0' }} />
        <p style={{ ...cap, marginBottom: 10 }}>Séjour</p>
        <label style={{...lbl, marginBottom: 10}}>
          <span style={cap}>Chambre</span>
          <select style={inp} value={chambre} onChange={e => setChambre(e.target.value)}>
            {['Côté Jardin','Côté Cèdre','Côté Vallée','Côté Potager'].map(r => <option key={r}>{r}</option>)}
          </select>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <label style={lbl}><span style={cap}>Arrivée</span><input style={{...inp, colorScheme:'dark'}} type="date" value={arrive} onChange={e => setArrive(e.target.value)} /></label>
          <label style={lbl}><span style={cap}>Départ</span><input style={{...inp, colorScheme:'dark'}} type="date" value={depart} onChange={e => setDepart(e.target.value)} /></label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <label style={lbl}><span style={cap}>Personnes</span><input style={inp} type="number" min={1} max={4} value={pers} onChange={e => setPers(+e.target.value)} /></label>
          <label style={lbl}><span style={cap}>Table d'hôtes</span><input style={inp} type="number" min={0} max={20} value={tableHotes} onChange={e => setTableHotes(+e.target.value)} /></label>
        </div>
        <label style={{...lbl, marginBottom: 16}}><span style={cap}>Note</span><textarea style={{...inp, resize:'vertical', minHeight:52}} value={note} onChange={e => setNote(e.target.value)} placeholder="Remise, message…" /></label>
        <button onClick={handlePrint} style={{ width:'100%', padding:'10px 0', background:'transparent', border:'1px solid #c4a050', color:'#c4a050', fontFamily:'system-ui,sans-serif', fontSize:'0.62rem', letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer' }}>
          🖨 Imprimer / PDF
        </button>
      </div>

      {/* Prévisualisation */}
      <div style={{ background: '#fff', color: '#1a1a1a', padding: '40px 44px', boxShadow: '0 4px 40px rgba(0,0,0,.5)' }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32, paddingBottom:20, borderBottom:'2px solid #c4a050' }}>
          <div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:'1.5rem', color:'#1a3220' }}>La Boire Bavard</div>
            <div style={{ fontSize:'0.62rem', letterSpacing:'0.24em', textTransform:'uppercase', color:'#c4a050', marginTop:4 }}>Chambres d'Hôtes · Anjou</div>
            <div style={{ fontSize:'0.77rem', color:'#555', lineHeight:1.7, marginTop:8 }}>4 chemin de la Boire Bavard<br/>49320 Blaison-Saint-Sulpice<br/>06 75 78 63 35</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'Georgia,serif', fontSize:'1rem', color:'#1a3220' }}>Facture {num}</div>
            <div style={{ fontSize:'0.75rem', color:'#777', marginTop:5 }}>Émise le {fmtDateFact(dateFacture)}</div>
          </div>
        </div>
        {/* Client */}
        <div style={{ background:'#f8f6f0', padding:'14px 18px', borderLeft:'3px solid #c4a050', marginBottom:24 }}>
          <div style={{ fontFamily:'Georgia,serif', fontSize:'1rem', marginBottom:3 }}>{prenom || nom ? `${prenom} ${nom}`.trim() : <span style={{color:'#aaa'}}>Nom du client</span>}</div>
          <div style={{ fontSize:'0.8rem', color:'#555', lineHeight:1.6 }}>{adresse && <>{adresse}<br/></>}{email}</div>
        </div>
        {/* Séjour */}
        {n > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:'16px 28px', background:'#1a3220', color:'#fff', padding:'12px 18px', marginBottom:24 }}>
            {[['Chambre',chambre],['Arrivée',fmtDateFact(arrive)],['Départ',fmtDateFact(depart)],['Durée',`${n} nuit${n>1?'s':''}`],['Pers.',String(pers)]].map(([l,v])=>(
              <div key={l}><div style={{ fontSize:'0.53rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(196,160,80,.8)', marginBottom:2 }}>{l}</div><div style={{ fontSize:'0.85rem' }}>{v}</div></div>
            ))}
          </div>
        )}
        {/* Tableau */}
        <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:18 }}>
          <thead><tr style={{ borderBottom:'1px solid #c4a050' }}>
            {['Prestation','Qté','P.U.','Total'].map(h => <th key={h} style={{ fontSize:'0.58rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#888', padding:'7px 0', textAlign: h==='Prestation'?'left':'right', fontWeight:400 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {lignes.map((l,i) => (
              <tr key={i}>
                <td style={{ padding:'10px 0', fontSize:'0.84rem', borderBottom:'1px solid #eee' }}>{l.label}</td>
                <td style={{ padding:'10px 0', fontSize:'0.84rem', borderBottom:'1px solid #eee', textAlign:'right', color:'#777' }}>{l.qty}</td>
                <td style={{ padding:'10px 0', fontSize:'0.84rem', borderBottom:'1px solid #eee', textAlign:'right', color:'#777' }}>{l.pu.toFixed(2)} €</td>
                <td style={{ padding:'10px 0', fontSize:'0.84rem', borderBottom:'1px solid #eee', textAlign:'right', fontWeight:500 }}>{l.total.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ height:2, background:'linear-gradient(90deg,#c4a050,transparent)', marginBottom:12 }} />
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <table style={{ borderCollapse:'collapse' }}>
            <tbody>
              <tr><td style={{ paddingRight:36, paddingBottom:6, fontSize:'0.78rem', color:'#777' }}>Sous-total</td><td style={{ fontSize:'0.78rem', color:'#777', textAlign:'right' }}>{total.toFixed(2)} €</td></tr>
              <tr><td style={{ paddingRight:36, paddingBottom:10, fontSize:'0.78rem', color:'#777' }}>TVA</td><td style={{ fontSize:'0.78rem', color:'#777', textAlign:'right' }}>Non applicable</td></tr>
              <tr style={{ borderTop:'2px solid #1a3220' }}>
                <td style={{ paddingRight:36, paddingTop:12, fontFamily:'Georgia,serif', fontSize:'1.05rem', color:'#1a3220' }}>Total TTC</td>
                <td style={{ paddingTop:12, fontFamily:'Georgia,serif', fontSize:'1.2rem', color:'#1a3220', textAlign:'right' }}>{total.toFixed(2)} €</td>
              </tr>
            </tbody>
          </table>
        </div>
        {note && <div style={{ background:'#f8f6f0', padding:'12px 16px', fontSize:'0.78rem', color:'#555', lineHeight:1.6, marginTop:20, borderLeft:'2px solid #ddd' }}>{note}</div>}
        <div style={{ marginTop:36, paddingTop:16, borderTop:'1px solid #eee', fontSize:'0.68rem', color:'#aaa', textAlign:'center', lineHeight:1.8 }}>
          La Boire Bavard · 49320 Blaison-Saint-Sulpice · Sandrine · 06 75 78 63 35<br/>
          Micro-entreprise · TVA non applicable — art. 293B du CGI
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
  const [tab, setTab] = useState<'reservations'|'planning'|'cesoir'|'facturation'>('reservations')
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
          <button style={{ ...tabBtn(tab === 'cesoir'), borderColor: tab === 'cesoir' ? 'rgba(122,184,196,.4)' : undefined, color: tab === 'cesoir' ? '#7ab8c4' : undefined, background: tab === 'cesoir' ? 'rgba(122,184,196,.1)' : undefined }} onClick={() => setTab('cesoir')}>
            🛎 Ce soir
          </button>
          <button style={{ ...tabBtn(tab === 'facturation'), borderColor: tab === 'facturation' ? 'rgba(196,160,80,.4)' : undefined }} onClick={() => setTab('facturation')}>
            🧾 Facturation
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

        {/* ── Onglet Facturation ── */}
        {tab === 'facturation' && <FacturationPanel />}

        {/* ── Onglet Ce soir ── */}
        {tab === 'cesoir' && <HotesPanel />}

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
