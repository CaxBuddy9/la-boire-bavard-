import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Mapping slug → nom en base
const SLUG_TO_ROOM: Record<string, string> = {
  jardin:  'Côté Jardin',
  cedre:   'Côté Cèdre',
  vallee:  'Côté Vallée',
  potager: 'Côté Potager',
}

// Variables d'env attendues pour chaque chambre :
// ICAL_JARDIN_URL, ICAL_CEDRE_URL, ICAL_VALLEE_URL, ICAL_POTAGER_URL
// ICAL_SYNC_KEY  ← clé secrète pour protéger l'endpoint

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase non configuré')
  return createClient(url, key)
}

// Parser iCal minimaliste (compatible Booking.com, Airbnb, Google Calendar)
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

async function syncRoom(slug: string, icalUrl: string, supabase: ReturnType<typeof createClient>) {
  const roomName = SLUG_TO_ROOM[slug]
  if (!roomName) throw new Error(`Slug inconnu : ${slug}`)

  // 1. Télécharger le calendrier externe
  const res = await fetch(icalUrl, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Échec téléchargement iCal ${slug}: ${res.status}`)
  const text = await res.text()

  // 2. Parser les événements
  const events = parseICal(text)

  // 3. Supprimer les anciens blocs de sync pour cette chambre
  //    (identifiés par guest_email = 'ical-sync@external')
  await supabase
    .from('reservations')
    .delete()
    .eq('room_id', roomName)
    .eq('guest_email', 'ical-sync@external')

  if (events.length === 0) return { slug, synced: 0 }

  // 4. Insérer les nouveaux blocs
  const rows = events.map(e => ({
    room_id:     roomName,
    guest_name:  `Sync iCal – ${slug}`,
    guest_email: 'ical-sync@external',
    guest_phone: '',
    check_in:    e.start,
    check_out:   e.end,
    guests:      1,
    total_price: 0,
    status:      'confirmed' as const,
    stripe_payment_intent: e.uid, // réutilisé pour stocker l'UID externe
    message:     `Import automatique iCal`,
  }))

  const { error } = await supabase.from('reservations').insert(rows)
  if (error) throw error

  return { slug, synced: events.length }
}

// GET /api/sync-ical?key=VOTRE_CLE — synchronise toutes les chambres configurées
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const syncKey = process.env.ICAL_SYNC_KEY

  if (!syncKey || key !== syncKey) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const supabase = getSupabase()
  const results = []
  const errors  = []

  for (const slug of Object.keys(SLUG_TO_ROOM)) {
    const icalUrl = process.env[`ICAL_${slug.toUpperCase()}_URL`]
    if (!icalUrl) continue // chambre non configurée → on skip

    try {
      const result = await syncRoom(slug, icalUrl, supabase)
      results.push(result)
    } catch (e) {
      errors.push({ slug, error: String(e) })
    }
  }

  return NextResponse.json({ ok: true, results, errors, synced_at: new Date().toISOString() })
}

// POST /api/sync-ical — synchronise une chambre spécifique
// Body: { key: "...", room: "jardin", url: "https://..." }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const syncKey = process.env.ICAL_SYNC_KEY

  if (!syncKey || body.key !== syncKey) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { room, url } = body
  if (!room || !url) {
    return NextResponse.json({ error: 'Paramètres manquants : room, url' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()
    const result = await syncRoom(room, url, supabase)
    return NextResponse.json({ ok: true, ...result, synced_at: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
