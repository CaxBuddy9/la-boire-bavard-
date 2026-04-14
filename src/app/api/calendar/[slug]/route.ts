import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Mapping slug → nom en base
const SLUG_TO_ROOM: Record<string, string> = {
  jardin:  'Côté Jardin',
  cedre:   'Côté Cèdre',
  vallee:  'Côté Vallée',
  potager: 'Côté Potager',
}

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase non configuré')
  return createClient(url, key)
}

function toICalDate(iso: string) {
  return iso.replace(/-/g, '')
}

function buildICal(slug: string, roomName: string, events: string) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//La Boire Bavard//Site//FR',
    `X-WR-CALNAME:La Boire Bavard – ${roomName}`,
    'X-WR-TIMEZONE:Europe/Paris',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    events,
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')
}

function icalResponse(slug: string, body: string) {
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `inline; filename="${slug}.ics"`,
      'Cache-Control': 'no-cache, no-store',
    },
  })
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  // Accepte "jardin" et "jardin.ics"
  const cleanSlug = slug.replace(/\.ics$/i, '')
  const roomName = SLUG_TO_ROOM[cleanSlug]
  if (!roomName) {
    return new NextResponse('Chambre introuvable', { status: 404 })
  }

  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('reservations')
      .select('id, check_in, check_out')
      .eq('room_id', roomName)
      .in('status', ['pending', 'confirmed', 'paid'])

    if (error) throw error

    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const events = (data ?? []).map((r: { id: string; check_in: string; check_out: string }) => [
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${toICalDate(r.check_in)}`,
      `DTEND;VALUE=DATE:${toICalDate(r.check_out)}`,
      `UID:lbb-${r.id}@laboirebavard.fr`,
      'SUMMARY:Réservé – La Boire Bavard',
      `DTSTAMP:${now}`,
      'END:VEVENT',
    ].join('\r\n')).join('\r\n')

    return icalResponse(cleanSlug, buildICal(cleanSlug, roomName, events))

  } catch (e) {
    console.error('[calendar]', e)
    return icalResponse(cleanSlug, buildICal(cleanSlug, roomName, ''))
  }
}
