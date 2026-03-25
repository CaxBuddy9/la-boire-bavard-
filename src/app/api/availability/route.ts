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
  if (!chambre) return NextResponse.json({ error: 'chambre requis' }, { status: 400 })

  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('reservations')
      .select('check_in, check_out')
      .eq('room_id', chambre)
      .in('status', ['pending', 'paid', 'confirmed'])

    if (error) throw error

    return NextResponse.json({ booked: data ?? [] })
  } catch (err: any) {
    return NextResponse.json({ booked: [] })
  }
}
