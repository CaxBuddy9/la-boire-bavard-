import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// Client Supabase avec service_role (accès total, server-side uniquement)
function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  return createClient(url, key)
}

// Désactiver le body parser — Stripe a besoin du raw body pour vérifier la signature
export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature') ?? ''
  const secret    = process.env.STRIPE_WEBHOOK_SECRET ?? ''

  let event: any

  // Vérifie la signature Stripe (sécurité)
  if (secret) {
    try {
      event = getStripe().webhooks.constructEvent(body, signature, secret)
    } catch (err: any) {
      console.error('[webhook] Signature invalide:', err.message)
      return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
    }
  } else {
    // Mode développement sans secret webhook
    event = JSON.parse(body)
  }

  // On écoute uniquement les paiements réussis
  if (event.type === 'payment_intent.succeeded') {
    const pi       = event.data.object
    const meta     = pi.metadata || {}

    // Convertir la date vers YYYY-MM-DD pour Supabase (supporte DD/MM/YYYY et YYYY-MM-DD)
    const parseDate = (s: string) => {
      if (!s) return null
      if (s.includes('-')) {
        // Format ISO yyyy-mm-dd (venant du formulaire contact)
        const parts = s.split('-')
        if (parts.length === 3 && parts[0].length === 4) return s
        return null
      }
      // Format dd/mm/yyyy (venant de BookingCard)
      const [d, m, y] = s.split('/')
      if (!d || !m || !y) return null
      return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`
    }

    const checkIn  = parseDate(meta.arrive)
    const checkOut = parseDate(meta.depart)

    if (!checkIn || !checkOut) {
      console.warn('[webhook] Dates manquantes dans metadata')
      return NextResponse.json({ received: true })
    }

    try {
      const supabase = getSupabaseAdmin()

      // Tenter de mettre à jour la ligne "pending" créée par /api/checkout
      const { data: existing } = await supabase
        .from('reservations')
        .select('id')
        .eq('stripe_payment_intent', pi.id)
        .maybeSingle()

      if (existing?.id) {
        await supabase.from('reservations').update({ status: 'paid' }).eq('id', existing.id)
      } else {
        // Fallback : insérer si la ligne n'existe pas encore
        const { error } = await supabase.from('reservations').insert({
          room_id:               meta.chambre        || 'inconnu',
          guest_name:            meta.nom            || 'Inconnu',
          guest_email:           meta.email          || '',
          guest_phone:           meta.tel            || '',
          check_in:              checkIn,
          check_out:             checkOut,
          guests:                Number(meta.pers)   || 2,
          total_price:           Math.round(pi.amount / 100),
          status:                'paid',
          stripe_payment_intent: pi.id,
          table_hotes:           meta.tableHotes === 'oui',
        })
        if (error) console.error('[webhook] Supabase insert error:', error.message)
      }
    } catch (err: any) {
      console.error('[webhook] Erreur Supabase:', err.message)
    }
  }

  return NextResponse.json({ received: true })
}
