import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStripe, PRICE_PER_NIGHT, TABLE_HOTES_PRICE } from '@/lib/stripe'

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

function toISO(s: string): string | null {
  if (!s) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(s)
    return isNaN(d.getTime()) ? null : s
  }
  const match = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null
  const [, d, m, y] = match
  const date = new Date(`${y}-${m}-${d}`)
  if (isNaN(date.getTime())) return null
  return `${y}-${m}-${d}`
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sanitize(s: unknown, max = 200): string {
  return typeof s === 'string' ? s.trim().slice(0, max) : ''
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nuits, pers, tableHotes } = body
    const chambre = sanitize(body.chambre, 100)
    const arrive  = sanitize(body.arrive, 20)
    const depart  = sanitize(body.depart, 20)
    const nom     = sanitize(body.nom, 200)
    const email   = sanitize(body.email, 200)
    const tel     = sanitize(body.tel, 30)

    const nuitsNum = Number(nuits)
    if (!nuitsNum || nuitsNum < 1 || nuitsNum > 365)
      return NextResponse.json({ error: 'Nombre de nuits invalide' }, { status: 400 })
    if (!chambre)
      return NextResponse.json({ error: 'Chambre requise' }, { status: 400 })
    if (email && !isValidEmail(email))
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })

    const checkIn  = toISO(arrive)
    const checkOut = toISO(depart)
    if (!checkIn || !checkOut || checkOut <= checkIn)
      return NextResponse.json({ error: 'Dates invalides' }, { status: 400 })

    const persNum = Math.max(1, Math.min(10, Number(pers) || 2))
    const tableHotesBool = tableHotes === true
    const tableHotesTotal = tableHotesBool ? persNum * TABLE_HOTES_PRICE * nuitsNum : 0
    const totalAmount = Math.round(nuitsNum * PRICE_PER_NIGHT * 100) + tableHotesTotal * 100

    // Origine pour les URLs de retour
    const origin = req.headers.get('origin')
      || (req.headers.get('host') ? `https://${req.headers.get('host')}` : 'https://la-boire-bavard.vercel.app')

    const lineItems: any[] = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `La Boire Bavard — ${chambre}`,
            description: `${nuitsNum} nuit${nuitsNum > 1 ? 's' : ''} · ${arrive} → ${depart} · ${persNum} pers. · Petit-déjeuner inclus`,
          },
          unit_amount: Math.round(PRICE_PER_NIGHT * 100),
        },
        quantity: nuitsNum,
      },
    ]

    if (tableHotesBool) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Table d'hôtes`,
            description: `${persNum} pers. × ${nuitsNum} soir${nuitsNum > 1 ? 's' : ''}`,
          },
          unit_amount: TABLE_HOTES_PRICE * 100,
        },
        quantity: persNum * nuitsNum,
      })
    }

    const metadata = {
      chambre,
      arrive:     arrive     || '',
      depart:     depart     || '',
      pers:       String(persNum),
      nom:        nom        || '',
      email:      email      || '',
      tel:        tel        || '',
      tableHotes: tableHotesBool ? 'oui' : 'non',
    }

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: email && isValidEmail(email) ? email : undefined,
      payment_intent_data: {
        metadata,
        description: `La Boire Bavard — ${chambre} · ${nuitsNum} nuit${nuitsNum > 1 ? 's' : ''} · ${arrive} → ${depart}`,
        receipt_email: email && isValidEmail(email) ? email : undefined,
      },
      success_url: `${origin}/paiement/confirmation?nom=${encodeURIComponent(nom)}&chambre=${encodeURIComponent(chambre)}&arrive=${encodeURIComponent(arrive)}&depart=${encodeURIComponent(depart)}`,
      cancel_url: `${origin}/chambres`,
      locale: 'fr',
    })

    // Insérer en "pending" pour bloquer les dates
    const supabase = getSupabaseAdmin()
    if (supabase) {
      await supabase.from('reservations').insert({
        room_id:               chambre,
        guest_name:            nom     || 'Inconnu',
        guest_email:           email   || '',
        guest_phone:           tel     || '',
        check_in:              checkIn,
        check_out:             checkOut,
        guests:                persNum,
        total_price:           Math.round(totalAmount / 100),
        status:                'pending',
        stripe_payment_intent: (session.payment_intent as string) || session.id,
        table_hotes:           tableHotesBool,
      })
    }

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[checkout] Error:', err.message)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 })
  }
}
