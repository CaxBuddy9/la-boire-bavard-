import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error(`Supabase not configured (url=${!!url}, key=${!!key})`)
  return createClient(url, key)
}

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('reservations')
      .select('*')
      .order('check_in', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { error } = await getSupabaseAdmin()
      .from('reservations')
      .insert({
        room_id:     body.room_id,
        guest_name:  body.guest_name,
        guest_email: body.guest_email || '',
        guest_phone: body.guest_phone || '',
        check_in:    body.check_in,
        check_out:   body.check_out,
        guests:      Number(body.guests) || 2,
        total_price: Number(body.total_price) || 0,
        status:      body.status || 'confirmed',
        table_hotes: body.table_hotes || false,
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json()

    const VALID_STATUSES = ['pending', 'confirmed', 'paid', 'cancelled']
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const { error } = await getSupabaseAdmin()
      .from('reservations')
      .update({ status })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
