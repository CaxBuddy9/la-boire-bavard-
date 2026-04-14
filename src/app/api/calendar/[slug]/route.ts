import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SLUG_TO_ROOM: Record<string, string> = {
  jardin:  'Cote Jardin',
  cedre:   'Cote Cedre',
  vallee:  'Cote Vallee',
  potager: 'Cote Potager',
}

// Mapping slug → nom réel en base Supabase
const SLUG_TO_ROOM_ID: Record<string, string> = {
  jardin:  'Côté Jardin',
  cedre:   'Côté Cèdre',
  vallee:  'Côté Vallée',
  potager: 'Côté Potager',
}

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase non configure')
  return createClient(url, key)
}

function toICalDate(iso: string) {
  return iso.replace(/-/g, '')
}

function buildICal(slug: string, events: string) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//La Boire Bavard//FR',
    `X-WR-CALNAME:La Boire Bavard - ${SLUG_TO_ROOM[slug] ?? slug}`,
    'X-WR-TIMEZONE:Europe/Paris',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ]
  if (events) lines.push(events)
  lines.push('END:VCALENDAR')
  return lines.join('\r\n') + '\r\n'
}

function icalResponse(slug: string, body: string) {
  return new NextResponse(body, {
    headers: {
      'Content-Type':        'text/calendar; charset=utf-8',
      'Content-Disposition': `inline; filename="${slug}.ics"`,
      'Cache-Control':       'no-cache, no-store, must-revalidate',
    },
  })
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const cleanSlug = slug.replace(/\.ics$/i, '')

  const roomId = SLUG_TO_ROOM_ID[cleanSlug]
  if (!roomId) {
    return new NextResponse('Chambre introuvable', { status: 404 })
  }

  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('reservations')
      .select('id, check_in, check_out')
      .eq('room_id', roomId)
      .in('status', ['pending', 'confirmed', 'paid'])

    if (error) throw error

    const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z'

    const events = (data ?? []).map((r: { id: string; check_in: string; check_out: string }) => [
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${toICalDate(r.check_in)}`,
      `DTEND;VALUE=DATE:${toICalDate(r.check_out)}`,
      `UID:lbb-${r.id}@laboirebavard.fr`,
      'SUMMARY:Reserved - La Boire Bavard',
      `DTSTAMP:${now}`,
      'END:VEVENT',
    ].join('\r\n')).join('\r\n')

    return icalResponse(cleanSlug, buildICal(cleanSlug, events))

  } catch (e) {
    console.error('[calendar]', e)
    return icalResponse(cleanSlug, buildICal(cleanSlug, ''))
  }
}
