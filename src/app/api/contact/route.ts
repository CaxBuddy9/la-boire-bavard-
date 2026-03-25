import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { error } = await getSupabaseAdmin()
      .from('reservations')
      .insert({
        room_id:     body.chambre || 'Sans préférence',
        guest_name:  `${body.prenom || ''} ${body.nom || ''}`.trim(),
        guest_email: body.email || '',
        guest_phone: body.tel || '',
        check_in:    body.arrivee || new Date().toISOString().split('T')[0],
        check_out:   body.depart  || new Date().toISOString().split('T')[0],
        guests:      Number(body.adultes) || 2,
        total_price: 0,
        status:      'pending',
        message:     body.message || '',
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
