import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase non configuré')
  return createClient(url, key)
}

export async function GET(req: NextRequest) {
  const chambre = req.nextUrl.searchParams.get('chambre')
  const arrive  = req.nextUrl.searchParams.get('arrive')
  const depart  = req.nextUrl.searchParams.get('depart')

  try {
    const supabase = getSupabase()

    // Mode 1 : ?chambre=X → plages réservées pour une chambre (calendrier)
    if (chambre) {
      const { data, error } = await supabase
        .from('reservations')
        .select('check_in, check_out')
        .eq('room_id', chambre)
        .in('status', ['pending', 'paid', 'confirmed'])
      if (error) throw error
      return NextResponse.json({ booked: data ?? [] })
    }

    // Mode 2 : ?arrive=X&depart=Y → quelles chambres sont prises sur cette période
    if (arrive && depart) {
      const { data, error } = await supabase
        .from('reservations')
        .select('room_id')
        .in('status', ['pending', 'paid', 'confirmed'])
        .lt('check_in', depart)   // check_in < depart
        .gt('check_out', arrive)  // check_out > arrive
      if (error) throw error
      const taken = [...new Set((data ?? []).map((r: any) => r.room_id))]
      return NextResponse.json({ taken })
    }

    return NextResponse.json({ error: 'chambre ou arrive+depart requis' }, { status: 400 })
  } catch {
    return NextResponse.json({ booked: [], taken: [] })
  }
}
