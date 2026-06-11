import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminCookie } from '../login/route'

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const missing: string[] = []
  if (!url) missing.push('SUPABASE_URL')
  if (!key) missing.push('SUPABASE_SERVICE_ROLE_KEY')
  if (missing.length) throw new Error(`Variables manquantes : ${missing.join(', ')}`)
  return createClient(url!, key!)
}

function requireAdmin(req: NextRequest) {
  if (!verifyAdminCookie(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  return null
}

const VALID_STATUSES = ['pending', 'confirmed', 'paid', 'cancelled']

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if (auth) return auth

  try {
    const { data, error } = await getSupabaseAdmin()
      .from('reservations')
      .select('*')
      .order('check_in', { ascending: true })

    if (error) return NextResponse.json({ error: `BDD : ${error.message}` }, { status: 500 })
    return NextResponse.json({ data: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req)
  if (auth) return auth

  try {
    const body = await req.json()

    // Validation basique
    if (!body.room_id || !body.guest_name || !body.check_in || !body.check_out) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }
    if (body.check_out <= body.check_in) {
      return NextResponse.json({ error: 'Date de départ doit être après l\'arrivée' }, { status: 400 })
    }

    const { error } = await getSupabaseAdmin()
      .from('reservations')
      .insert({
        room_id:     body.room_id,
        guest_name:  body.guest_name,
        guest_email: body.guest_email || '',
        guest_phone: body.guest_phone || '',
        check_in:    body.check_in,
        check_out:   body.check_out,
        guests:      Math.max(1, Math.min(10, Number(body.guests) || 2)),
        total_price: Math.max(0, Number(body.total_price) || 0),
        status:      VALID_STATUSES.includes(body.status) ? body.status : 'confirmed',
        table_hotes: body.table_hotes === true,
      })

    if (error) return NextResponse.json({ error: `Insertion : ${error.message}` }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Requête invalide' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const auth = requireAdmin(req)
  if (auth) return auth

  try {
    const { id } = await req.json()
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    const { error } = await getSupabaseAdmin()
      .from('reservations')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: `Suppression : ${error.message}` }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Requête invalide' }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
  const auth = requireAdmin(req)
  if (auth) return auth

  try {
    const body = await req.json()
    const { id } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    // Champs modifiables depuis le calendrier admin
    const update: Record<string, unknown> = {}
    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
      }
      update.status = body.status
    }
    if (body.room_id     !== undefined) update.room_id     = String(body.room_id)
    if (body.guest_name  !== undefined) update.guest_name  = String(body.guest_name)
    if (body.guest_email !== undefined) update.guest_email = String(body.guest_email)
    if (body.guest_phone !== undefined) update.guest_phone = String(body.guest_phone)
    if (body.check_in    !== undefined) update.check_in    = String(body.check_in)
    if (body.check_out   !== undefined) update.check_out   = String(body.check_out)
    if (body.guests      !== undefined) update.guests      = Math.max(1, Math.min(10, Number(body.guests) || 2))
    if (body.total_price !== undefined) update.total_price = Math.max(0, Number(body.total_price) || 0)
    if (body.table_hotes !== undefined) update.table_hotes = body.table_hotes === true

    if (update.check_in && update.check_out && String(update.check_out) <= String(update.check_in)) {
      return NextResponse.json({ error: 'Date de départ doit être après l\'arrivée' }, { status: 400 })
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'Rien à mettre à jour' }, { status: 400 })
    }

    const { error } = await getSupabaseAdmin()
      .from('reservations')
      .update(update)
      .eq('id', id)

    if (error) return NextResponse.json({ error: `Mise à jour : ${error.message}` }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Requête invalide' }, { status: 400 })
  }
}
