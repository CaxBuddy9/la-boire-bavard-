import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStripe, PRICE_PER_NIGHT, TABLE_HOTES_PRICE } from '@/lib/stripe'

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// Convertit DD/MM/YYYY ou YYYY-MM-DD → YYYY-MM-DD
function toISO(s: string): string | null {
  if (!s) return null
  if (s.includes('-') && s.split('-')[0].length === 4) return s
  const [d, m, y] = s.split('/')
  if (!d || !m || !y) return null
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}

export async function POST(req: NextRequest) {
  try {
    const { nuits, chambre, arrive, depart, pers, nom, email, tel, tableHotes } = await req.json()

    if (!nuits || nuits < 1) {
      return NextResponse.json({ error: 'Nombre de nuits invalide' }, { status: 400 })
    }

    const tableHotesTotal = tableHotes ? Math.round(pers || 2) * TABLE_HOTES_PRICE * nuits : 0
    const amount = Math.round(nuits * PRICE_PER_NIGHT * 100) + tableHotesTotal * 100

    const paymentIntent = await getStripe().paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        chambre:    chambre      || '',
        arrive:     arrive       || '',
        depart:     depart       || '',
        pers:       String(pers  || 2),
        nom:        nom          || '',
        email:      email        || '',
        tel:        tel          || '',
        tableHotes: tableHotes ? 'oui' : 'non',
      },
      description: `La Boire Bavard — ${chambre} · ${nuits} nuit${nuits > 1 ? 's' : ''} · ${arrive} → ${depart}${tableHotes ? ' · Table d\'hôtes' : ''}`,
      receipt_email: email || undefined,
    })

    // Insérer immédiatement en "pending" pour bloquer les dates dès la création du paiement
    const checkIn  = toISO(arrive)
    const checkOut = toISO(depart)
    if (checkIn && checkOut) {
      const supabase = getSupabaseAdmin()
      if (supabase) {
        await supabase.from('reservations').insert({
          room_id:               chambre || 'inconnu',
          guest_name:            nom     || 'Inconnu',
          guest_email:           email   || '',
          guest_phone:           tel     || '',
          check_in:              checkIn,
          check_out:             checkOut,
          guests:                Number(pers) || 2,
          total_price:           Math.round(amount / 100),
          status:                'pending',
          stripe_payment_intent: paymentIntent.id,
          table_hotes:           tableHotes === true,
        })
      }
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: any) {
    console.error('[checkout] Error:', err.message)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
