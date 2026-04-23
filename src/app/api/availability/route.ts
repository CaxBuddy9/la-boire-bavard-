import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ROOMS } from '@/lib/rooms'

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const missing: string[] = []
  if (!url) missing.push('SUPABASE_URL')
  if (!key) missing.push('SUPABASE_SERVICE_ROLE_KEY/ANON_KEY')
  if (missing.length) throw new Error(`Variables manquantes : ${missing.join(', ')}`)
  return createClient(url!, key!)
}

const VALID_ROOMS = ROOMS.map(r => r.name)

function isValidDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s).getTime())
}

export async function GET(req: NextRequest) {
  const chambre = req.nextUrl.searchParams.get('chambre')
  const arrive  = req.nextUrl.searchParams.get('arrive')
  const depart  = req.nextUrl.searchParams.get('depart')

  try {
    const supabase = getSupabase()

    // Mode 1 : ?chambre=X → plages réservées pour un calendrier
    if (chambre) {
      if (!VALID_ROOMS.includes(chambre)) {
        return NextResponse.json({ booked: [] })
      }
      const { data, error } = await supabase
        .from('reservations')
        .select('check_in, check_out')
        .eq('room_id', chambre)
        .in('status', ['pending', 'paid', 'confirmed'])
      if (error) throw error
      return NextResponse.json({ booked: data ?? [] })
    }

    // Mode 2 : ?arrive=X&depart=Y → chambres prises sur cette période
    if (arrive && depart) {
      if (!isValidDate(arrive) || !isValidDate(depart) || depart <= arrive) {
        return NextResponse.json({ taken: [] })
      }
      const { data, error } = await supabase
        .from('reservations')
        .select('room_id')
        .in('status', ['pending', 'paid', 'confirmed'])
        .lt('check_in', depart)
        .gt('check_out', arrive)
      if (error) throw error
      const taken = [...new Set((data ?? []).map((r: any) => r.room_id))]
      return NextResponse.json({ taken })
    }

    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
  } catch (e: any) {
    console.error('[availability]', e?.message)
    return NextResponse.json({ booked: [], taken: [] })
  }
}
