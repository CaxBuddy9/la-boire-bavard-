import { NextRequest, NextResponse } from 'next/server'
import { getStripe, PRICE_PER_NIGHT, TABLE_HOTES_PRICE } from '@/lib/stripe'

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
        chambre:     chambre       || '',
        arrive:      arrive        || '',
        depart:      depart        || '',
        pers:        String(pers   || 2),
        nom:         nom           || '',
        email:       email         || '',
        tel:         tel           || '',
        tableHotes:  tableHotes ? 'oui' : 'non',
      },
      description: `La Boire Bavard — ${chambre} · ${nuits} nuit${nuits > 1 ? 's' : ''} · ${arrive} → ${depart}${tableHotes ? ' · Table d\'hôtes' : ''}`,
      receipt_email: email || undefined,
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: any) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
