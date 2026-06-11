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
}

const ROOMS = ['Côté Jardin', 'Côté Cèdre', 'Côté Vallée']

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

// ── Modal ajout / modification de réservation ──────────────────────────────
function ReservationModal({ onClose, onSaved, initialDate, existing }: { onClose: () => void, onSaved: () => void, initialDate?: string, existing?: Reservation }) {
  const today = new Date().toISOString().split('T')[0]
  const start = initialDate || today
  const nextDay = (() => { const d = new Date(start); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0] })()
  const [form, setForm] = useState(existing ? {
    room_id: existing.room_id, guest_name: existing.guest_name,
    guest_email: existing.guest_email === 'ical-sync@external' ? '' : (existing.guest_email || ''),
    guest_phone: existing.guest_phone || '',
    check_in: existing.check_in, check_out: existing.check_out,
    guests: existing.guests, status: existing.status, table_hotes: !!existing.table_hotes,
  } : {
    room_id: 'Côté Jardin', guest_name: '', guest_email: '', guest_phone: '',
    check_in: start, check_out: nextDay, guests: 2, status: 'confirmed', table_hotes: false,
  })
  const [price, setPrice] = useState<number>(existing ? existing.total_price : nights(start, nextDay) * 88)
  const [priceTouched, setPriceTouched] = useState(!!existing)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const n = nights(form.check_in, form.check_out)

  // Tant que le prix n'a pas été modifié à la main, il suit les dates (n × 88 €)
  useEffect(() => {
    if (!priceTouched) setPrice(n > 0 ? n * 88 : 0)
  }, [n, priceTouched])

  const F = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.guest_name || n <= 0) { setErr('Nom et dates valides requis.'); return }
    setSaving(true)
    setErr('')

    // Vérifier les conflits avant d'insérer (sauf modification : la résa se chevauche elle-même)
    if (!existing) {
      try {
        const avail = await fetch(`/api/availability?arrive=${form.check_in}&depart=${form.check_out}`).then(r => r.json())
        if (avail.taken?.includes(form.room_id)) {
          setErr(`${form.room_id} est déjà réservée sur ces dates.`)
          setSaving(false)
          return
        }
      } catch {}
    }

    const res = await fetch('/api/admin/reservations', {
      method: existing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...(existing ? { id: existing.id } : {}), ...form, total_price: price }),
    })
    const d = await res.json()
    if (d.error) { setErr(d.error); setSaving(false) }
    else { onSaved(); onClose() }
  }

  const inp: React.CSSProperties = {
    background: 'rgba(60,48,34,.05)', border: '1px solid rgba(60,48,34,.1)',
    color: '#2a2018', padding: '9px 12px', fontSize: '0.85rem',
    fontFamily: 'system-ui', outline: 'none', width: '100%',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#ffffff', border: '1px solid rgba(196,160,80,.2)', padding: '32px 28px', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#2a2018' }}>{existing ? 'Modifier la réservation' : 'Ajouter une réservation'}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(60,48,34,.4)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Chambre */}
          <div>
            <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a7a2e', marginBottom: 6 }}>Chambre</label>
            <select value={form.room_id} onChange={e => F('room_id', e.target.value)} style={{ ...inp }}>
              {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Nom */}
          <div>
            <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a7a2e', marginBottom: 6 }}>Nom *</label>
            <input value={form.guest_name} onChange={e => F('guest_name', e.target.value)} placeholder="Marie Dupont" required style={inp} />
          </div>

          {/* Email + Tel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a7a2e', marginBottom: 6 }}>Email</label>
              <input type="email" value={form.guest_email} onChange={e => F('guest_email', e.target.value)} style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a7a2e', marginBottom: 6 }}>Téléphone</label>
              <input type="tel" value={form.guest_phone} onChange={e => F('guest_phone', e.target.value)} style={inp} />
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a7a2e', marginBottom: 6 }}>Arrivée *</label>
              <input type="date" value={form.check_in} onChange={e => F('check_in', e.target.value)} required style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a7a2e', marginBottom: 6 }}>Départ *</label>
              <input type="date" value={form.check_out} onChange={e => F('check_out', e.target.value)} required style={inp} />
            </div>
          </div>

          {/* Voyageurs + Statut */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a7a2e', marginBottom: 6 }}>Voyageurs</label>
              <input type="number" min={1} max={4} value={form.guests} onChange={e => F('guests', Number(e.target.value))} style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a7a2e', marginBottom: 6 }}>Statut</label>
              <select value={form.status} onChange={e => F('status', e.target.value)} style={inp}>
                <option value="confirmed">Confirmée</option>
                <option value="pending">En attente</option>
                <option value="paid">Payée</option>
              </select>
            </div>
          </div>

          {/* Table d'hôtes */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.82rem', color: 'rgba(60,48,34,.6)' }}>
            <input type="checkbox" checked={form.table_hotes} onChange={e => F('table_hotes', e.target.checked)} style={{ accentColor: '#c4a050', width: 16, height: 16 }} />
            Table d'hôtes
          </label>

          {/* Prix — modifiable à la main */}
          <div>
            <label style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a7a2e', marginBottom: 6 }}>Prix total (€)</label>
            <input type="number" min={0} step="0.01" value={price}
              onChange={e => { setPriceTouched(true); setPrice(Number(e.target.value)) }} style={inp} />
            {n > 0 && (
              <div style={{ fontSize: '0.72rem', color: 'rgba(60,48,34,.45)', marginTop: 6, lineHeight: 1.6 }}>
                Suggestion : {n} nuit{n>1?'s':''} × 88 € = {n * 88} €<br />
                + taxe de séjour {(form.guests * n * 0.83).toFixed(2)} € ({form.guests} pers. × {n} nuit{n>1?'s':''} × 0,83 €) — réglée sur place
              </div>
            )}
          </div>

          {err && <div style={{ color: '#e07070', fontSize: '0.78rem' }}>{err}</div>}

          <button type="submit" disabled={saving} style={{
            background: '#c4a050', color: '#0a0f0a', border: 'none', padding: '14px',
            fontFamily: 'system-ui', fontSize: '0.72rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', fontWeight: 600, cursor: saving ? 'default' : 'pointer',
            opacity: saving ? 0.6 : 1,
          }}>
            {saving ? 'Enregistrement…' : (existing ? 'Enregistrer les modifications' : 'Ajouter au calendrier')}
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
      minHeight: '100vh', background: '#f4f1ea',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        background: '#ffffff', border: '1px solid rgba(196,160,80,.2)',
        padding: '48px 40px', width: '100%', maxWidth: 380,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🌿</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#2a2018', marginBottom: 4 }}>
            La Boire Bavard
          </div>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9a7a2e' }}>
            Espace Sandrine
          </div>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a7a2e', marginBottom: 8 }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={pwd}
              onChange={e => { setPwd(e.target.value); setErr(false) }}
              autoFocus
              style={{
                width: '100%', background: 'rgba(60,48,34,.05)',
                border: `1px solid ${err ? 'rgba(224,112,112,.5)' : 'rgba(60,48,34,.1)'}`,
                color: '#2a2018', padding: '12px 14px',
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

// ── Calendrier mensuel (façon Google Agenda) ───────────────────────────────
function Calendrier({ reservations, onChanged }: { reservations: Reservation[], onChanged: () => void }) {
  const now = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [addDate,  setAddDate]  = useState<string | null>(null)
  const [selected, setSelected] = useState<Reservation | null>(null)
  const [editing,  setEditing]  = useState<Reservation | null>(null)

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1) } else setMonth(m => m-1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1) } else setMonth(m => m+1) }
  const goToday   = () => { setYear(now.getFullYear()); setMonth(now.getMonth()) }

  const totalDays = new Date(year, month + 1, 0).getDate()
  const todayIso = isoDate(now.getFullYear(), now.getMonth(), now.getDate())

  const active = reservations.filter(r => r.status !== 'cancelled')

  // Grille : semaines qui commencent le lundi
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7 // 0 = lundi
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const isExternal = (r: Reservation) => r.guest_email === 'ical-sync@external'
  // Pour les résas Booking : afficher le nom du client si la synchro l'a récupéré,
  // sinon « Booking · Chambre » (anciennes synchros ou simple blocage de dates)
  const guestLabel = (r: Reservation) => {
    if (!isExternal(r)) return r.guest_name
    const hasName = r.guest_name && !/^(sync ical|booking)/i.test(r.guest_name)
    return hasName ? r.guest_name : `Booking · ${r.room_id.replace('Côté ', '')}`
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/reservations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setSelected(null)
    onChanged()
  }
  const deleteReservation = async (id: string) => {
    if (!confirm('Supprimer définitivement cette réservation ?')) return
    await fetch('/api/admin/reservations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setSelected(null)
    onChanged()
  }

  const monthPrefix = `${year}-${String(month+1).padStart(2,'0')}`
  const arrivals   = active.filter(r => r.check_in.startsWith(monthPrefix)).sort((a,b) => a.check_in.localeCompare(b.check_in))
  const departures = active.filter(r => r.check_out.startsWith(monthPrefix)).sort((a,b) => a.check_out.localeCompare(b.check_out))

  return (
    <div>
      {/* Nav mois */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={prevMonth} style={{ background: 'none', border: '1px solid rgba(60,48,34,.25)', color: 'rgba(60,48,34,.75)', padding: '10px 22px', fontSize: '1.2rem', cursor: 'pointer', fontFamily: 'system-ui' }}>←</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.7rem', color: '#2a2018' }}>{MONTHS_FR[month]} {year}</div>
          <button onClick={goToday} style={{ background: 'none', border: '1px solid rgba(196,160,80,.4)', color: '#9a7a2e', padding: '5px 12px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'system-ui' }}>Aujourd'hui</button>
        </div>
        <button onClick={nextMonth} style={{ background: 'none', border: '1px solid rgba(60,48,34,.25)', color: 'rgba(60,48,34,.75)', padding: '10px 22px', fontSize: '1.2rem', cursor: 'pointer', fontFamily: 'system-ui' }}>→</button>
      </div>

      <div style={{ fontSize: '0.78rem', color: 'rgba(60,48,34,.45)', marginBottom: 14, textAlign: 'center' }}>
        Cliquez sur un jour vide pour ajouter une réservation · cliquez sur un nom pour voir le détail
      </div>

      {/* En-tête jours de la semaine */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 4 }}>
        {DAYS_FR.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(60,48,34,.45)', padding: '6px 0' }}>{d}</div>
        ))}
      </div>

      {/* Grille du mois */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 20 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`} style={{ minHeight: 96, background: 'rgba(60,48,34,.025)', borderRadius: 6 }} />
          const iso = isoDate(year, month, d)
          const isToday = iso === todayIso
          const isPast = iso < todayIso
          const dayResas = active.filter(r => iso >= r.check_in && iso < r.check_out)
          return (
            <div key={iso}
              onClick={() => setAddDate(iso)}
              style={{
                minHeight: 96, background: '#ffffff', borderRadius: 6, padding: '6px 6px 8px',
                border: isToday ? '2px solid #c4a050' : '1px solid rgba(60,48,34,.1)',
                opacity: isPast ? 0.55 : 1, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 3,
              }}>
              <div style={{
                fontSize: '0.82rem', fontWeight: isToday ? 700 : 500, marginBottom: 2,
                color: isToday ? '#c4a050' : 'rgba(60,48,34,.6)', textAlign: 'right',
              }}>
                {d}
              </div>
              {dayResas.map(r => {
                const isStart = iso === r.check_in
                const isPending = r.status === 'pending'
                return (
                  <div key={r.id}
                    onClick={e => { e.stopPropagation(); setSelected(r) }}
                    title={`${guestLabel(r)} · ${r.room_id}${isExternal(r) ? ' · via Booking.com' : ''}`}
                    style={{
                      background: ROOM_COLOR[r.room_id] || '#c4a050',
                      opacity: isPending ? 0.55 : 0.92,
                      border: isPending ? '1px dashed rgba(60,48,34,.5)' : 'none',
                      borderLeft: isExternal(r) ? '4px solid #3a6fd8' : undefined,
                      borderRadius: 4, padding: '3px 6px', cursor: 'pointer',
                      fontSize: '0.7rem', fontWeight: 600,
                      color: '#0a0f0a',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                    {isStart ? guestLabel(r) : '· · ·'}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Légende chambres */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {ROOMS.map(roomName => (
          <div key={roomName} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'rgba(60,48,34,.55)' }}>
            <div style={{ width: 18, height: 10, borderRadius: 2, background: ROOM_COLOR[roomName] }} /> {roomName}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'rgba(60,48,34,.55)' }}>
          <div style={{ width: 18, height: 10, borderRadius: 2, background: 'rgba(60,48,34,.15)', borderLeft: '4px solid #3a6fd8' }} /> Liseré bleu = via Booking.com (couleur = chambre)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'rgba(60,48,34,.55)' }}>
          <div style={{ width: 18, height: 10, borderRadius: 2, background: 'rgba(60,48,34,.2)', border: '1px dashed rgba(60,48,34,.5)' }} /> En attente
        </div>
      </div>

      {/* Modal ajout depuis un jour du calendrier */}
      {addDate && (
        <ReservationModal initialDate={addDate} onClose={() => setAddDate(null)} onSaved={onChanged} />
      )}

      {/* Modal modification */}
      {editing && (
        <ReservationModal existing={editing} onClose={() => setEditing(null)} onSaved={onChanged} />
      )}

      {/* Modal détail réservation */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#ffffff', border: '1px solid rgba(196,160,80,.2)', borderRadius: 6, padding: '28px 26px', width: '100%', maxWidth: 420 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: ROOM_COLOR[selected.room_id] || '#c4a050' }} />
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', color: '#2a2018' }}>{guestLabel(selected)}</span>
                {isExternal(selected) && <span style={{ fontSize: '0.6rem', background: '#3a6fd8', color: '#fff', borderRadius: 3, padding: '2px 7px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Booking.com</span>}
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(60,48,34,.4)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 18, fontSize: '0.85rem' }}>
              {[
                ['Chambre', selected.room_id],
                ['Statut', STATUS_LABEL[selected.status]],
                ['Arrivée', fmtDate(selected.check_in)],
                ['Départ', fmtDate(selected.check_out)],
                ['Nuits', String(nights(selected.check_in, selected.check_out))],
                ['Total', isExternal(selected) ? `${nights(selected.check_in, selected.check_out) * 88} €` : `${selected.total_price} €`],
                ['Téléphone', selected.guest_phone || '—'],
                ['Email', isExternal(selected) ? '—' : (selected.guest_email || '—')],
              ].map(([l, v]) => (
                <div key={l}>
                  <div style={{ color: 'rgba(60,48,34,.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{l}</div>
                  <div style={{ color: '#2a2018', marginTop: 2, wordBreak: 'break-word' }}>{v}</div>
                </div>
              ))}
            </div>
            {selected.message && (
              <div style={{ background: 'rgba(196,160,80,.06)', border: '1px solid rgba(196,160,80,.18)', padding: '10px 12px', marginBottom: 16, borderRadius: 3, fontSize: '0.8rem', color: 'rgba(60,48,34,.75)', whiteSpace: 'pre-wrap' }}>
                {selected.message}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {selected.status === 'pending' && (
                <button onClick={() => updateStatus(selected.id, 'confirmed')} style={{ background: '#c4a050', color: '#0a0f0a', border: 'none', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 14px', cursor: 'pointer', fontWeight: 600 }}>✓ Confirmer</button>
              )}
              <button onClick={() => { setEditing(selected); setSelected(null) }} style={{ background: 'none', border: '1px solid rgba(196,160,80,.5)', color: '#9a7a2e', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 14px', cursor: 'pointer', fontWeight: 600 }}>✎ Modifier</button>
              <button onClick={() => updateStatus(selected.id, 'cancelled')} style={{ background: 'none', border: '1px solid rgba(224,112,112,.35)', color: '#e07070', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 14px', cursor: 'pointer' }}>Annuler la résa</button>
              <button onClick={() => deleteReservation(selected.id)} style={{ background: 'none', border: '1px solid rgba(200,80,80,.25)', color: 'rgba(200,80,80,.75)', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 14px', cursor: 'pointer' }}>🗑 Supprimer</button>
              {selected.guest_phone && (
                <a href={`https://wa.me/${selected.guest_phone.replace(/\D/g,'').replace(/^0/,'33')}`} target="_blank" rel="noopener noreferrer"
                  style={{ border: '1px solid rgba(109,184,122,.35)', color: '#6db87a', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 14px', textDecoration: 'none' }}>💬 WhatsApp</a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Arrivées / Départs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#ffffff', border: '1px solid rgba(109,184,122,.15)', borderRadius: 4, padding: '16px 18px' }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6db87a', marginBottom: 12 }}>Arrivées · {MONTHS_FR[month]}</div>
          {arrivals.length === 0 ? <div style={{ fontSize: '0.78rem', color: 'rgba(60,48,34,.25)' }}>Aucune</div>
          : arrivals.map(r => (
            <div key={r.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(60,48,34,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ width: 8, height: 8, borderRadius: 1, background: ROOM_COLOR[r.room_id] || '#c4a050', flexShrink: 0 }} />
                <span style={{ fontSize: '1rem', color: '#2a2018', fontWeight: 600 }}>{r.guest_name}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(60,48,34,.35)', paddingLeft: 16 }}>{fmtDate(r.check_in)} · {r.room_id} · {nights(r.check_in, r.check_out)} nuits</div>
              {r.guest_phone && <a href={`tel:${r.guest_phone}`} style={{ display: 'block', paddingLeft: 16, fontSize: '0.68rem', color: '#c4a050', textDecoration: 'none', marginTop: 2 }}>{r.guest_phone}</a>}
            </div>
          ))}
        </div>
        <div style={{ background: '#ffffff', border: '1px solid rgba(196,160,80,.15)', borderRadius: 4, padding: '16px 18px' }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4a050', marginBottom: 12 }}>Départs · {MONTHS_FR[month]}</div>
          {departures.length === 0 ? <div style={{ fontSize: '0.78rem', color: 'rgba(60,48,34,.25)' }}>Aucun</div>
          : departures.map(r => (
            <div key={r.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(60,48,34,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ width: 8, height: 8, borderRadius: 1, background: ROOM_COLOR[r.room_id] || '#c4a050', flexShrink: 0 }} />
                <span style={{ fontSize: '1rem', color: '#2a2018', fontWeight: 600 }}>{r.guest_name}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(60,48,34,.35)', paddingLeft: 16 }}>{fmtDate(r.check_out)} · {r.room_id}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Facturation ────────────────────────────────────────────────────────────
type Ligne = { id: string; label: string; qty: number; pu: number }
const rid = () => Math.random().toString(36).slice(2, 9)
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
  const [prixNuit,      setPrixNuit]      = useState(PRICE_NUIT)
  const [prixTable,     setPrixTable]     = useState(PRICE_TABLE)
  const [taxeSejour,    setTaxeSejour]    = useState(TAXE_SEJOUR)
  const [lignes,        setLignes]        = useState<Ligne[]>([])
  const [customized,    setCustomized]    = useState(false)
  const [overrideOn,    setOverrideOn]    = useState(false)
  const [overrideTotal, setOverrideTotal] = useState(0)

  const n = nightsFact(arrive, depart)

  const buildAuto = (): Ligne[] => {
    const out: Ligne[] = []
    if (n > 0) out.push({ id: rid(), label: `Chambre ${chambre} — ${n} nuit${n > 1 ? 's' : ''}`, qty: n, pu: prixNuit })
    if (tableHotes > 0) out.push({ id: rid(), label: `Table d'hôtes — ${tableHotes} convive${tableHotes > 1 ? 's' : ''}`, qty: tableHotes, pu: prixTable })
    if (n > 0 && taxeSejour > 0) out.push({ id: rid(), label: `Taxe de séjour — ${pers} pers. × ${n} nuit${n > 1 ? 's' : ''}`, qty: pers * n, pu: taxeSejour })
    return out
  }

  useEffect(() => {
    if (!customized) setLignes(buildAuto())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chambre, arrive, depart, pers, tableHotes, prixNuit, prixTable, taxeSejour, customized])

  const updateLigne = (id: string, patch: Partial<Ligne>) => {
    setCustomized(true)
    setLignes(l => l.map(x => x.id === id ? { ...x, ...patch } : x))
  }
  const addLigne = () => {
    setCustomized(true)
    setLignes(l => [...l, { id: rid(), label: '', qty: 1, pu: 0 }])
  }
  const removeLigne = (id: string) => {
    setCustomized(true)
    setLignes(l => l.filter(x => x.id !== id))
  }
  const resetLignes = () => {
    setCustomized(false)
    setLignes(buildAuto())
  }

  const lignesView = lignes.map(l => ({ ...l, total: Math.round(l.qty * l.pu * 100) / 100 }))
  const subtotal = lignesView.reduce((s, l) => s + l.total, 0)
  const totalFinal = overrideOn ? overrideTotal : subtotal
  const adjustment = overrideOn ? totalFinal - subtotal : 0

  const printCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Inter:wght@300;400&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',system-ui,sans-serif;font-weight:300;color:#2c2c2c;background:#fff;max-width:820px;margin:auto;padding:52px}
    .wm{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:260px;height:260px;object-fit:contain;opacity:0.012;pointer-events:none}
    .top{text-align:center;margin-bottom:36px}
    .top img{width:64px;height:64px;object-fit:contain;margin-bottom:14px;display:block;margin-left:auto;margin-right:auto}
    .top-name{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.55rem;font-weight:300;color:#2c2c2c;letter-spacing:0.16em}
    .top-sub{font-size:0.42rem;letter-spacing:0.42em;text-transform:uppercase;color:#b8962a;margin-top:5px}
    .top-addr{font-size:0.68rem;color:#bbb;margin-top:10px;line-height:1.8;font-weight:300}
    .gold{display:block;width:40px;height:1px;background:#b8962a;margin:22px auto}
    .meta{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;padding-bottom:28px;border-bottom:1px solid #ebebeb}
    .meta-l .label{font-size:0.4rem;letter-spacing:0.36em;text-transform:uppercase;color:#b8962a;margin-bottom:8px}
    .meta-l .name{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.05rem;font-weight:400;color:#2c2c2c;margin-bottom:4px}
    .meta-l .detail{font-size:0.7rem;color:#aaa;line-height:1.85}
    .meta-r{text-align:right}
    .meta-r .ftitle{font-size:0.4rem;letter-spacing:0.36em;text-transform:uppercase;color:#b8962a;margin-bottom:6px}
    .meta-r .fnum{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.3rem;font-weight:300;color:#2c2c2c;letter-spacing:0.04em}
    .meta-r .fdate{font-size:0.68rem;color:#bbb;margin-top:5px}
    .sejour{display:flex;border-top:1px solid #ebebeb;border-bottom:1px solid #ebebeb;margin-bottom:32px;padding:16px 0}
    .si{flex:1;padding:0 20px;border-right:1px solid #ebebeb}
    .si:first-child{padding-left:0}
    .si:last-child{border-right:none}
    .sl{font-size:0.38rem;letter-spacing:0.3em;text-transform:uppercase;color:#b8962a;display:block;margin-bottom:5px}
    .sv{font-size:0.78rem;color:#2c2c2c;font-weight:300}
    table{width:100%;border-collapse:collapse;margin-bottom:0}
    th{font-size:0.38rem;letter-spacing:0.26em;text-transform:uppercase;color:#ccc;padding:9px 0;font-weight:400;border-bottom:1px solid #ebebeb;text-align:left}
    th:not(:first-child){text-align:right}
    td{padding:13px 0;font-size:0.78rem;border-bottom:1px solid #f5f5f5;color:#444;font-weight:300}
    td:not(:first-child){text-align:right}
    tbody tr:last-child td{border-bottom:none}
    .tot{display:flex;justify-content:flex-end;margin-top:24px}
    .tot-inner{width:240px}
    .trow{display:flex;justify-content:space-between;padding:6px 0;font-size:0.7rem;color:#bbb;font-weight:300}
    .trow.final{border-top:1px solid #2c2c2c;margin-top:6px;padding-top:14px}
    .trow.final span:first-child{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.05rem;font-weight:300;color:#2c2c2c}
    .trow.final span:last-child{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.15rem;font-weight:400;color:#b8962a}
    .note{border-top:1px solid #ebebeb;padding-top:16px;font-size:0.7rem;color:#aaa;line-height:1.8;margin-top:28px;font-weight:300}
    .foot{margin-top:48px;padding-top:18px;border-top:1px solid #ebebeb;text-align:center;font-size:0.6rem;color:#ccc;line-height:1.9;font-weight:300}
    @media print{body{padding:32px}.wm{position:fixed}}
  `

  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return
    const origin = window.location.origin
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8"/>
      <title>Facture ${num} — La Boire Bavard</title>
      <style>${printCSS}</style>
    </head><body>
      <img class="wm" src="${origin}/logo-lbba.png" alt=""/>
      <div class="top">
        <img src="${origin}/logo-lbba.png" alt=""/>
        <div class="top-name">La Boire Bavard</div>
        <div class="top-sub">Chambres d'Hôtes · Anjou</div>
        <div class="top-addr">4 chemin de la Boire Bavard, Lieu-dit La Hutte · 49320 Blaison-Saint-Sulpice<br/>06 75 78 63 35 · contact@laboirebavard.com</div>
      </div>
      <span class="gold"></span>
      <div class="meta">
        <div class="meta-l">
          <div class="label">Facturé à</div>
          <div class="name">${prenom} ${nom}</div>
          <div class="detail">${adresse ? adresse + '<br/>' : ''}${email || '—'}</div>
        </div>
        <div class="meta-r">
          <div class="ftitle">Facture</div>
          <div class="fnum">${num}</div>
          <div class="fdate">Émise le ${fmtDateFact(dateFacture)}</div>
        </div>
      </div>
      ${n > 0 ? `<div class="sejour">${[['Chambre',chambre],['Arrivée',fmtDateFact(arrive)],['Départ',fmtDateFact(depart)],['Durée',n+' nuit'+(n>1?'s':'')],['Personnes',String(pers)]].map(([l,v])=>`<div class="si"><span class="sl">${l}</span><span class="sv">${v}</span></div>`).join('')}</div>` : ''}
      <table>
        <thead><tr><th>Prestation</th><th>Qté</th><th>P.U.</th><th>Total</th></tr></thead>
        <tbody>${lignesView.map(l=>`<tr><td>${l.label}</td><td>${l.qty}</td><td>${l.pu.toFixed(2)} €</td><td>${l.total.toFixed(2)} €</td></tr>`).join('')}</tbody>
      </table>
      <div class="tot"><div class="tot-inner">
        <div class="trow"><span>Sous-total</span><span>${subtotal.toFixed(2)} €</span></div>
        ${adjustment !== 0 ? `<div class="trow"><span>${adjustment < 0 ? 'Remise' : 'Supplément'}</span><span>${adjustment.toFixed(2)} €</span></div>` : ''}
        <div class="trow"><span>TVA</span><span>Non applicable (art. 293B CGI)</span></div>
        <div class="trow final"><span>Total TTC</span><span>${totalFinal.toFixed(2)} €</span></div>
      </div></div>
      ${note ? `<div class="note">${note}</div>` : ''}
      <div class="foot">La Boire Bavard · 4 chemin de la Boire Bavard, Lieu-dit La Hutte · 49320 Blaison-Saint-Sulpice<br/>Sandrine · 06 75 78 63 35 · contact@laboirebavard.com · Micro-entreprise — TVA non applicable, art. 293B du CGI</div>
    </body></html>`)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 600)
  }

  const inp: React.CSSProperties = { background: 'rgba(60,48,34,.06)', border: '1px solid rgba(196,160,80,.2)', color: '#2a2018', fontFamily: 'system-ui, sans-serif', fontSize: '0.82rem', padding: '7px 10px', width: '100%', outline: 'none' }
  const lbl: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 }
  const cap: React.CSSProperties = { fontSize: '0.52rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9a7a2e' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
      {/* Formulaire */}
      <div style={{ background: '#ffffff', border: '1px solid rgba(196,160,80,.15)', padding: 20 }}>
        <p style={{ fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c4a050', marginBottom: 16 }}>Nouvelle facture</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <label style={lbl}><span style={cap}>N° facture</span><input style={inp} value={num} onChange={e => setNum(e.target.value)} /></label>
          <label style={lbl}><span style={cap}>Date</span><input style={{...inp, colorScheme:'light'}} type="date" value={dateFacture} onChange={e => setDateFacture(e.target.value)} /></label>
        </div>
        <div style={{ height: 1, background: 'rgba(60,48,34,.06)', margin: '12px 0' }} />
        <p style={{ ...cap, marginBottom: 10 }}>Client</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <label style={lbl}><span style={cap}>Prénom</span><input style={inp} value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Marie" /></label>
          <label style={lbl}><span style={cap}>Nom</span><input style={inp} value={nom} onChange={e => setNom(e.target.value)} placeholder="Dupont" /></label>
        </div>
        <label style={{...lbl, marginBottom: 10}}><span style={cap}>Adresse</span><input style={inp} value={adresse} onChange={e => setAdresse(e.target.value)} /></label>
        <label style={{...lbl, marginBottom: 14}}><span style={cap}>Email</span><input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
        <div style={{ height: 1, background: 'rgba(60,48,34,.06)', margin: '12px 0' }} />
        <p style={{ ...cap, marginBottom: 10 }}>Séjour</p>
        <label style={{...lbl, marginBottom: 10}}>
          <span style={cap}>Chambre</span>
          <select style={inp} value={chambre} onChange={e => setChambre(e.target.value)}>
            {['Côté Jardin','Côté Cèdre','Côté Vallée'].map(r => <option key={r}>{r}</option>)}
          </select>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <label style={lbl}><span style={cap}>Arrivée</span><input style={{...inp, colorScheme:'light'}} type="date" value={arrive} onChange={e => setArrive(e.target.value)} /></label>
          <label style={lbl}><span style={cap}>Départ</span><input style={{...inp, colorScheme:'light'}} type="date" value={depart} onChange={e => setDepart(e.target.value)} /></label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <label style={lbl}><span style={cap}>Personnes</span><input style={inp} type="number" min={1} max={4} value={pers} onChange={e => setPers(+e.target.value)} /></label>
          <label style={lbl}><span style={cap}>Table d'hôtes</span><input style={inp} type="number" min={0} max={20} value={tableHotes} onChange={e => setTableHotes(+e.target.value)} /></label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
          <label style={lbl}><span style={cap}>Prix/nuit €</span><input style={inp} type="number" min={0} step="0.01" value={prixNuit} onChange={e => setPrixNuit(+e.target.value)} /></label>
          <label style={lbl}><span style={cap}>Table €/pers</span><input style={inp} type="number" min={0} step="0.01" value={prixTable} onChange={e => setPrixTable(+e.target.value)} /></label>
          <label style={lbl}><span style={cap}>Taxe séj. €</span><input style={inp} type="number" min={0} step="0.01" value={taxeSejour} onChange={e => setTaxeSejour(+e.target.value)} /></label>
        </div>
        <label style={{...lbl, marginBottom: 16}}><span style={cap}>Note</span><textarea style={{...inp, resize:'vertical', minHeight:52}} value={note} onChange={e => setNote(e.target.value)} placeholder="Remise, message…" /></label>

        <div style={{ height: 1, background: 'rgba(60,48,34,.06)', margin: '4px 0 12px' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8 }}>
          <p style={cap}>Lignes ({lignes.length})</p>
          <button type="button" onClick={resetLignes} title="Régénérer depuis le séjour" style={{ background:'transparent', border:'1px solid rgba(196,160,80,.3)', color:'rgba(196,160,80,.85)', fontSize:'0.55rem', letterSpacing:'0.18em', textTransform:'uppercase', padding:'4px 8px', cursor:'pointer' }}>↺ Auto</button>
        </div>
        {lignes.map(l => (
          <div key={l.id} style={{ marginBottom: 8, padding: 8, background:'rgba(60,48,34,.03)', border:'1px solid rgba(196,160,80,.1)' }}>
            <input style={{...inp, marginBottom: 6, fontSize:'0.72rem'}} value={l.label} onChange={e => updateLigne(l.id, { label: e.target.value })} placeholder="Libellé" />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 28px', gap: 6, alignItems:'stretch' }}>
              <input style={{...inp, fontSize:'0.7rem', padding:'6px 8px'}} type="number" step="0.01" min={0} value={l.qty} onChange={e => updateLigne(l.id, { qty: +e.target.value })} placeholder="Qté" title="Quantité" />
              <input style={{...inp, fontSize:'0.7rem', padding:'6px 8px'}} type="number" step="0.01" min={0} value={l.pu} onChange={e => updateLigne(l.id, { pu: +e.target.value })} placeholder="P.U." title="Prix unitaire €" />
              <button type="button" onClick={() => removeLigne(l.id)} title="Supprimer" style={{ background:'transparent', border:'1px solid rgba(196,80,80,.3)', color:'rgba(220,120,120,.9)', fontSize:'0.7rem', cursor:'pointer' }}>✕</button>
            </div>
            <div style={{ marginTop:6, textAlign:'right', fontSize:'0.62rem', color:'rgba(60,48,34,.4)' }}>= {(Math.round(l.qty * l.pu * 100) / 100).toFixed(2)} €</div>
          </div>
        ))}
        <button type="button" onClick={addLigne} style={{ width:'100%', marginBottom: 12, padding:'7px 0', background:'transparent', border:'1px dashed rgba(196,160,80,.3)', color:'rgba(196,160,80,.75)', fontSize:'0.6rem', letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer' }}>+ Ajouter une ligne</button>

        <div style={{ height: 1, background: 'rgba(60,48,34,.06)', margin: '4px 0 12px' }} />
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', marginBottom: 10, color:'rgba(60,48,34,.65)' }}>
          <span>Sous-total</span><span>{subtotal.toFixed(2)} €</span>
        </div>
        <label style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 8, fontSize:'0.68rem', color:'rgba(60,48,34,.7)', cursor:'pointer' }}>
          <input type="checkbox" checked={overrideOn} onChange={e => { setOverrideOn(e.target.checked); if (e.target.checked) setOverrideTotal(subtotal) }} />
          Forcer le prix total
        </label>
        {overrideOn && (
          <input style={{...inp, marginBottom: 10}} type="number" step="0.01" min={0} value={overrideTotal} onChange={e => setOverrideTotal(+e.target.value)} placeholder="Total final €" />
        )}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 6, marginBottom: 16, paddingTop: 10, borderTop: '1px solid rgba(196,160,80,.3)' }}>
          <span style={{ ...cap, color:'#c4a050' }}>Total TTC</span>
          <span style={{ fontFamily:'Georgia,serif', fontSize:'1.05rem', color:'#c4a050' }}>{totalFinal.toFixed(2)} €</span>
        </div>

        <button onClick={handlePrint} style={{ width:'100%', padding:'10px 0', background:'transparent', border:'1px solid #c4a050', color:'#c4a050', fontFamily:'system-ui,sans-serif', fontSize:'0.62rem', letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer' }}>
          🖨 Imprimer / PDF
        </button>
      </div>

      {/* Prévisualisation */}
      <div style={{ background:'#fff', color:'#2c2c2c', boxShadow:'0 8px 60px rgba(0,0,0,.4)', position:'relative', fontFamily:"'Inter',system-ui,sans-serif", fontWeight:300, padding:'44px 48px' }}>
        {/* Filigrane */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-lbba.png" alt="" aria-hidden style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:260, height:260, objectFit:'contain', opacity:0.012, pointerEvents:'none' }} />

        {/* En-tête centré */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-lbba.png" alt="Logo" style={{ width:60, height:60, objectFit:'contain', display:'block', margin:'0 auto 12px' }} />
          <div style={{ fontFamily:'Georgia,serif', fontSize:'1.5rem', fontWeight:300, letterSpacing:'0.16em', color:'#2c2c2c' }}>La Boire Bavard</div>
          <div style={{ fontSize:'0.42rem', letterSpacing:'0.42em', textTransform:'uppercase', color:'#b8962a', marginTop:5 }}>Chambres d'Hôtes · Anjou</div>
          <div style={{ fontSize:'0.68rem', color:'#bbb', marginTop:8, lineHeight:1.8 }}>4 chemin de la Boire Bavard, Lieu-dit La Hutte · 49320 Blaison-Saint-Sulpice<br/>06 75 78 63 35 · contact@laboirebavard.com</div>
        </div>

        {/* Filet or */}
        <div style={{ width:40, height:1, background:'#b8962a', margin:'0 auto 28px' }} />

        {/* Méta : client + numéro facture */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32, paddingBottom:24, borderBottom:'1px solid #ebebeb' }}>
          <div>
            <div style={{ fontSize:'0.4rem', letterSpacing:'0.36em', textTransform:'uppercase', color:'#b8962a', marginBottom:8 }}>Facturé à</div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:'1.05rem', fontWeight:400, color:'#2c2c2c', marginBottom:4 }}>{prenom || nom ? `${prenom} ${nom}`.trim() : <span style={{color:'#ccc'}}>Nom du client</span>}</div>
            <div style={{ fontSize:'0.7rem', color:'#aaa', lineHeight:1.85 }}>{adresse && <>{adresse}<br/></>}{email || <span style={{color:'#ddd'}}>email</span>}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'0.4rem', letterSpacing:'0.36em', textTransform:'uppercase', color:'#b8962a', marginBottom:6 }}>Facture</div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:'1.3rem', fontWeight:300, color:'#2c2c2c', letterSpacing:'0.04em' }}>{num}</div>
            <div style={{ fontSize:'0.68rem', color:'#bbb', marginTop:5 }}>Émise le {fmtDateFact(dateFacture)}</div>
          </div>
        </div>

        {/* Séjour */}
        {n > 0 && (
          <div style={{ display:'flex', borderTop:'1px solid #ebebeb', borderBottom:'1px solid #ebebeb', marginBottom:28, padding:'14px 0' }}>
            {[['Chambre',chambre],['Arrivée',fmtDateFact(arrive)],['Départ',fmtDateFact(depart)],['Durée',`${n} nuit${n>1?'s':''}`],['Personnes',String(pers)]].map(([l,v], i, arr) => (
              <div key={l} style={{ flex:1, paddingLeft: i===0?0:16, paddingRight:16, borderRight: i < arr.length-1 ? '1px solid #ebebeb' : 'none' }}>
                <span style={{ fontSize:'0.38rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#b8962a', display:'block', marginBottom:5 }}>{l}</span>
                <span style={{ fontSize:'0.78rem', color:'#2c2c2c', fontWeight:300 }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tableau prestations */}
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Prestation','Qté','P.U.','Total'].map(h => (
                <th key={h} style={{ fontSize:'0.38rem', letterSpacing:'0.26em', textTransform:'uppercase', color:'#ccc', padding:'9px 0', fontWeight:400, borderBottom:'1px solid #ebebeb', textAlign: h==='Prestation'?'left':'right' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lignesView.map(l => (
              <tr key={l.id}>
                <td style={{ padding:'13px 0', fontSize:'0.78rem', borderBottom:'1px solid #f5f5f5', color:'#444', fontWeight:300 }}>{l.label || <span style={{color:'#ddd'}}>—</span>}</td>
                <td style={{ padding:'13px 0', fontSize:'0.78rem', borderBottom:'1px solid #f5f5f5', textAlign:'right', color:'#aaa', fontWeight:300 }}>{l.qty}</td>
                <td style={{ padding:'13px 0', fontSize:'0.78rem', borderBottom:'1px solid #f5f5f5', textAlign:'right', color:'#aaa', fontWeight:300 }}>{l.pu.toFixed(2)} €</td>
                <td style={{ padding:'13px 0', fontSize:'0.78rem', borderBottom:'1px solid #f5f5f5', textAlign:'right', color:'#444', fontWeight:300 }}>{l.total.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:22 }}>
          <div style={{ width:240 }}>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', fontSize:'0.7rem', color:'#bbb', fontWeight:300 }}><span>Sous-total</span><span>{subtotal.toFixed(2)} €</span></div>
            {adjustment !== 0 && (
              <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', fontSize:'0.7rem', color:'#bbb', fontWeight:300 }}><span>{adjustment < 0 ? 'Remise' : 'Supplément'}</span><span>{adjustment.toFixed(2)} €</span></div>
            )}
            <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', fontSize:'0.7rem', color:'#bbb', fontWeight:300 }}><span>TVA</span><span>Non applicable (art. 293B CGI)</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 0 6px', borderTop:'1px solid #2c2c2c', marginTop:6 }}>
              <span style={{ fontFamily:'Georgia,serif', fontSize:'1.05rem', fontWeight:300, color:'#2c2c2c' }}>Total TTC</span>
              <span style={{ fontFamily:'Georgia,serif', fontSize:'1.15rem', fontWeight:400, color:'#b8962a' }}>{totalFinal.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {note && <div style={{ borderTop:'1px solid #ebebeb', paddingTop:16, fontSize:'0.7rem', color:'#aaa', lineHeight:1.8, marginTop:28, fontWeight:300 }}>{note}</div>}

        {/* Footer */}
        <div style={{ marginTop:44, paddingTop:16, borderTop:'1px solid #ebebeb', textAlign:'center', fontSize:'0.6rem', color:'#ccc', lineHeight:1.9, fontWeight:300 }}>
          La Boire Bavard · 4 chemin de la Boire Bavard, Lieu-dit La Hutte · 49320 Blaison-Saint-Sulpice<br/>
          Sandrine · 06 75 78 63 35 · contact@laboirebavard.com · Micro-entreprise — TVA non applicable, art. 293B du CGI
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
  const [view, setView] = useState<'calendrier'|'facturation'>('calendrier')

  const load = async () => {
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

  // Auto-refresh silencieux : toutes les 60 s, on recharge en arrière-plan et on ne
  // met à jour l'écran QUE si les données ont réellement changé. Pas de spinner,
  // pas de re-rendu inutile → la page ne saute plus.
  const silentRefresh = async () => {
    try {
      const res = await fetch('/api/admin/reservations')
      const json = await res.json()
      if (!json.error) {
        const next = json.data || []
        setReservations(prev => JSON.stringify(prev) === JSON.stringify(next) ? prev : next)
      }
    } catch {}
  }

  useEffect(() => {
    load()
    const t = setInterval(silentRefresh, 60000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const btn: React.CSSProperties = { border: '1px solid rgba(60,48,34,.15)', background: 'none', color: 'rgba(60,48,34,.6)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '9px 14px', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', borderRadius: 4 }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f1ea', fontFamily: 'system-ui, sans-serif', color: '#2a2018' }}>

      {/* Header */}
      <div style={{ background: '#fdfaf2', borderBottom: '1px solid rgba(196,160,80,.15)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: '#2a2018' }}>La Boire Bavard</span>
          <span style={{ fontSize: '0.6rem', color: '#9a7a2e', letterSpacing: '0.2em', textTransform: 'uppercase', marginLeft: 12 }}>Calendrier des réservations</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => setShowAdd(true)} style={{ background: '#c4a050', color: '#0a0f0a', border: 'none', fontSize: '0.78rem', letterSpacing: '0.08em', padding: '10px 18px', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontWeight: 700, borderRadius: 4 }}>
            + Ajouter une réservation
          </button>
          <button onClick={() => setView(view === 'calendrier' ? 'facturation' : 'calendrier')} style={btn}>
            {view === 'calendrier' ? '🧾 Faire une facture' : '📅 Retour au calendrier'}
          </button>
          <button onClick={load} title="Rafraîchir" style={btn}>↻</button>
          <button onClick={onLogout} style={btn}>Sortir</button>
        </div>
      </div>

      {showAdd && (
        <ReservationModal onClose={() => setShowAdd(false)} onSaved={load} />
      )}

      <div style={{ padding: '24px 20px 60px', maxWidth: 1150, margin: '0 auto' }}>

        {/* Erreur Supabase */}
        {dbError && (
          <div style={{ background: 'rgba(224,112,112,.1)', border: '1px solid rgba(224,112,112,.3)', padding: '14px 18px', marginBottom: 20, borderRadius: 4, fontSize: '0.82rem', color: '#e07070' }}>
            ⚠ Erreur : {dbError}
          </div>
        )}

        {view === 'facturation' ? (
          <FacturationPanel />
        ) : loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(60,48,34,.3)', padding: 60 }}>Chargement du calendrier…</div>
        ) : (
          <Calendrier reservations={reservations} onChanged={load} />
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
