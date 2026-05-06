import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase non configuré')
  return createClient(url, key)
}

// Convertit dd/mm/yyyy ou yyyy-mm-dd → yyyy-mm-dd
function parseDate(s: string): string | null {
  if (!s) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const match = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null
  const [, d, m, y] = match
  const date = new Date(`${y}-${m}-${d}`)
  if (isNaN(date.getTime())) return null
  return `${y}-${m}-${d}`
}

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature') ?? ''
  const secret    = process.env.STRIPE_WEBHOOK_SECRET

  // En production, la signature est OBLIGATOIRE
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[webhook] STRIPE_WEBHOOK_SECRET non configuré')
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }
  }

  let event: any

  if (secret) {
    try {
      event = getStripe().webhooks.constructEvent(body, signature, secret)
    } catch {
      return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
    }
  } else {
    // Dev uniquement — jamais en production
    try { event = JSON.parse(body) } catch {
      return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
    }
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi   = event.data.object
    const meta = pi.metadata || {}

    const checkIn  = parseDate(meta.arrive)
    const checkOut = parseDate(meta.depart)

    if (!checkIn || !checkOut) {
      console.warn('[webhook] Dates manquantes dans metadata')
      return NextResponse.json({ received: true })
    }

    try {
      const supabase = getSupabaseAdmin()

      const { data: existing } = await supabase
        .from('reservations')
        .select('id')
        .eq('stripe_payment_intent', pi.id)
        .maybeSingle()

      if (existing?.id) {
        await supabase.from('reservations').update({ status: 'paid' }).eq('id', existing.id)
      } else {
        await supabase.from('reservations').insert({
          room_id:               meta.chambre       || 'inconnu',
          guest_name:            meta.nom           || 'Inconnu',
          guest_email:           meta.email         || '',
          guest_phone:           meta.tel           || '',
          check_in:              checkIn,
          check_out:             checkOut,
          guests:                Math.max(1, Number(meta.pers) || 2),
          total_price:           Math.round(pi.amount / 100),
          status:                'paid',
          stripe_payment_intent: pi.id,
          table_hotes:           meta.tableHotes === 'oui',
        })
      }
    } catch (err: any) {
      console.error('[webhook] Erreur Supabase:', err.message)
    }
  }

  return NextResponse.json({ received: true })
}
