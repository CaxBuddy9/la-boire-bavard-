import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SLUG_TO_ROOM: Record<string, string> = {
  jardin:  'Côté Jardin',
  cedre:   'Côté Cèdre',
  vallee:  'Côté Vallée',
  potager: 'Côté Potager',
}

const PLATFORMS = ['BOOKING', 'AGODA', 'TRIPADVISOR']

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase non configuré')
  return createClient(url, key) as ReturnType<typeof createClient>
}

function parseICal(text: string) {
  const events: { uid: string; start: string; end: string }[] = []
  const blocks = text.split('BEGIN:VEVENT')
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i]
    const uidMatch   = block.match(/UID:([^\r\n]+)/)
    const startMatch = block.match(/DTSTART(?:;[^:]+)?:(\d{8})/)
    const endMatch   = block.match(/DTEND(?:;[^:]+)?:(\d{8})/)
    if (!uidMatch || !startMatch || !endMatch) continue
    const toISO = (s: string) => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
    events.push({
      uid:   uidMatch[1].trim(),
      start: toISO(startMatch[1]),
      end:   toISO(endMatch[1]),
    })
  }
  return events
}

async function syncRoom(slug: string) {
  const roomName = SLUG_TO_ROOM[slug]
  if (!roomName) throw new Error(`Slug inconnu : ${slug}`)

  const supabase = getSupabase()
  const allEvents: { uid: string; start: string; end: string; platform: string }[] = []

  // Collecter les événements de toutes les plateformes configurées
  for (const platform of PLATFORMS) {
    // Supporte ICAL_JARDIN_BOOKING_URL et l'ancien format ICAL_JARDIN_URL
    const envKey = `ICAL_${slug.toUpperCase()}_${platform}_URL`
    const legacyKey = `ICAL_${slug.toUpperCase()}_URL`
    const url = process.env[envKey] || (platform === 'BOOKING' ? process.env[legacyKey] : undefined)
    if (!url) continue

    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) {
        console.warn(`[sync-ical] ${slug}/${platform}: HTTP ${res.status}`)
        continue
      }
      const text = await res.text()
      const events = parseICal(text)
      allEvents.push(...events.map(e => ({ ...e, platform })))
    } catch (e) {
      console.warn(`[sync-ical] ${slug}/${platform}: ${String(e)}`)
    }
  }

  // Supprimer les anciens blocs de sync pour cette chambre
  await supabase
    .from('reservations')
    .delete()
    .eq('room_id', roomName)
    .eq('guest_email', 'ical-sync@external')

  if (allEvents.length === 0) return { slug, synced: 0 }

  // Dédupliquer par UID (au cas où une réservation apparaît dans 2 exports)
  const seen = new Set<string>()
  const unique = allEvents.filter(e => {
    if (seen.has(e.uid)) return false
    seen.add(e.uid)
    return true
  })

  const rows = unique.map(e => ({
    room_id:               roomName,
    guest_name:            `Sync iCal – ${e.platform}`,
    guest_email:           'ical-sync@external',
    guest_phone:           '',
    check_in:              e.start,
    check_out:             e.end,
    guests:                1,
    total_price:           0,
    status:                'confirmed',
    stripe_payment_intent: e.uid,
    message:               `Import automatique iCal (${e.platform})`,
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from('reservations').insert(rows as any)
  if (error) throw error

  return { slug, synced: unique.length }
}

// GET /api/sync-ical?key=VOTRE_CLE — synchronise toutes les chambres configurées
// Appelé automatiquement par le cron Vercel toutes les heures
export async function GET(req: NextRequest) {
  const key     = req.nextUrl.searchParams.get('key')
  const syncKey = process.env.ICAL_SYNC_KEY
  if (!syncKey || key !== syncKey) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const results = []
  const errors  = []

  for (const slug of Object.keys(SLUG_TO_ROOM)) {
    try {
      results.push(await syncRoom(slug))
    } catch (e) {
      errors.push({ slug, error: e instanceof Error ? e.message : JSON.stringify(e) })
    }
  }

  return NextResponse.json({ ok: true, results, errors, synced_at: new Date().toISOString() })
}

// POST /api/sync-ical — synchronise une chambre spécifique
// Body: { key: "...", room: "jardin" }
export async function POST(req: NextRequest) {
  const body    = await req.json().catch(() => ({}))
  const syncKey = process.env.ICAL_SYNC_KEY
  if (!syncKey || body.key !== syncKey) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { room } = body
  if (!room) {
    return NextResponse.json({ error: 'Paramètre manquant : room' }, { status: 400 })
  }

  try {
    const result = await syncRoom(room)
    return NextResponse.json({ ok: true, ...result, synced_at: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
