import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const missing: string[] = []
  if (!url) missing.push('SUPABASE_URL')
  if (!key) missing.push('SUPABASE_SERVICE_ROLE_KEY')
  if (missing.length) throw new Error(`Variables manquantes : ${missing.join(', ')}`)
  return createClient(url!, key!)
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sanitize(s: unknown, maxLen = 200): string {
  if (typeof s !== 'string') return ''
  return s.trim().slice(0, maxLen)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const prenom  = sanitize(body.prenom, 100)
    const nom     = sanitize(body.nom, 100)
    const email   = sanitize(body.email, 200)
    const tel     = sanitize(body.tel, 30)
    const chambre = sanitize(body.chambre, 100)
    const message = sanitize(body.message, 2000)
    const arrivee = sanitize(body.arrivee, 20)
    const depart  = sanitize(body.depart, 20)
    const adultes = Math.max(1, Math.min(10, Number(body.adultes) || 2))

    // Validation obligatoire
    if (!prenom || !nom) {
      return NextResponse.json({ error: 'Prénom et nom requis' }, { status: 400 })
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const guestName = `${prenom} ${nom}`.trim()
    const today = new Date().toISOString().split('T')[0]

    const { error } = await getSupabaseAdmin()
      .from('reservations')
      .insert({
        room_id:     chambre || 'Sans préférence',
        guest_name:  guestName,
        guest_email: email,
        guest_phone: tel,
        check_in:    arrivee || today,
        check_out:   depart  || today,
        guests:      adultes,
        total_price: 0,
        status:      'pending',
        message,
      })

    if (error) {
      console.error('[contact] Supabase insert:', error.message)
      return NextResponse.json({ error: `Envoi : ${error.message}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[contact] Exception:', e?.message)
    return NextResponse.json({ error: e?.message || 'Requête invalide' }, { status: 400 })
  }
}
