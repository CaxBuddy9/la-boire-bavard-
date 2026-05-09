import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, notifyWhatsApp, NOTIF_TO } from '@/lib/mailer'

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase non configuré')
  return createClient(url, key)
}

function parseDate(s: string): string | null {
  if (!s) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const match = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null
  const [, d, m, y] = match
  return `${y}-${m}-${d}`
}

function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const CHAMBRES_LABELS: Record<string, string> = {
  jardin:  'Côté Jardin',
  cedre:   'Côté Cèdre',
  vallee:  'Côté Vallée',
  potager: 'Côté Potager',
}

async function sendConfirmationEmail(meta: Record<string, string>, checkIn: string, checkOut: string, totalEur: number) {
  const guestEmail = meta.email
  const guestName  = meta.nom || 'Cher hôte'
  const chambreLib = CHAMBRES_LABELS[meta.chambre] || meta.chambre || '—'
  const nuits      = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
  const tableHotes = meta.tableHotes === 'oui'

  if (guestEmail) {
    await sendEmail({
      to: guestEmail,
      subject: `✅ Réservation confirmée — ${chambreLib} · ${fmtDate(checkIn)}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#f5f0e8;padding:36px;border-radius:8px;">
          <h1 style="color:#1a3220;font-size:24px;margin:0 0 4px">Réservation confirmée ✓</h1>
          <p style="color:#c4a050;font-size:13px;margin:0 0 28px;letter-spacing:.08em;text-transform:uppercase">La Boire Bavard · Anjou</p>
          <p style="font-size:16px;color:#2a2a2a;line-height:1.8">Merci ${guestName.split(' ')[0]}, votre paiement a bien été reçu. Nous vous attendons avec impatience !</p>
          <div style="margin:28px 0;padding:20px;background:#1a3220;border-radius:8px;color:#f0e8d4;">
            <p style="margin:0 0 12px;color:#c4a050;font-size:12px;letter-spacing:.1em;text-transform:uppercase">Votre réservation</p>
            <table style="width:100%;font-size:15px;line-height:2;">
              <tr><td style="color:rgba(240,232,212,.6);width:140px">Chambre</td><td style="font-weight:500">${chambreLib}</td></tr>
              <tr><td style="color:rgba(240,232,212,.6)">Arrivée</td><td>${fmtDate(checkIn)}</td></tr>
              <tr><td style="color:rgba(240,232,212,.6)">Départ</td><td>${fmtDate(checkOut)}</td></tr>
              <tr><td style="color:rgba(240,232,212,.6)">Durée</td><td>${nuits} nuit${nuits > 1 ? 's' : ''}</td></tr>
              <tr><td style="color:rgba(240,232,212,.6)">Voyageurs</td><td>${meta.pers || '2'} pers.</td></tr>
              ${tableHotes ? `<tr><td style="color:rgba(240,232,212,.6)">Table d'hôtes</td><td>Incluse ✓</td></tr>` : ''}
              <tr><td style="color:rgba(240,232,212,.6)">Total payé</td><td style="color:#c4a050;font-weight:600">${totalEur} €</td></tr>
            </table>
          </div>
          <div style="margin:24px 0;padding:16px;border-left:3px solid #c4a050;font-size:14px;color:#2a2a2a;line-height:1.8;">
            <strong style="display:block;margin-bottom:6px;color:#1a3220">Infos pratiques</strong>
            4 chemin de la Boire Bavard, Lieu-dit La Hutte<br>49320 Blaison-Saint-Sulpice<br>
            📞 <a href="tel:+33675786335" style="color:#c4a050">06 75 78 63 35</a><br>
            💬 <a href="https://wa.me/33675786335" style="color:#c4a050">WhatsApp</a>
          </div>
          <p style="font-size:13px;color:#999;margin-top:24px;line-height:1.7">En cas de question, répondez directement à cet email.<br><em>La Boire Bavard — Maison d'hôtes de charme en Anjou</em></p>
        </div>`,
    })
  }

  await sendEmail({
    to: NOTIF_TO,
    replyTo: guestEmail,
    subject: `💳 Paiement reçu — ${chambreLib} · ${fmtDate(checkIn)} → ${fmtDate(checkOut)}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#f5f0e8;padding:32px;border-radius:8px;">
        <h2 style="color:#1a3220;font-size:20px;margin:0 0 8px">Nouveau paiement reçu ✓</h2>
        <p style="color:#c4a050;font-size:12px;margin:0 0 20px;text-transform:uppercase;letter-spacing:.08em">La Boire Bavard</p>
        <table style="width:100%;font-size:15px;line-height:2.2;border-collapse:collapse;">
          <tr><td style="color:#666;width:130px">Client</td><td style="color:#1a2e1a;font-weight:500">${guestName}</td></tr>
          <tr><td style="color:#666">Email</td><td><a href="mailto:${guestEmail}" style="color:#c4a050">${guestEmail || '—'}</a></td></tr>
          ${meta.tel ? `<tr><td style="color:#666">Téléphone</td><td><a href="tel:${meta.tel}" style="color:#c4a050">${meta.tel}</a></td></tr>` : ''}
          <tr><td style="color:#666">Chambre</td><td>${chambreLib}</td></tr>
          <tr><td style="color:#666">Arrivée</td><td>${fmtDate(checkIn)}</td></tr>
          <tr><td style="color:#666">Départ</td><td>${fmtDate(checkOut)}</td></tr>
          <tr><td style="color:#666">Nuits</td><td>${nuits}</td></tr>
          <tr><td style="color:#666">Voyageurs</td><td>${meta.pers || '2'} pers.</td></tr>
          ${tableHotes ? `<tr><td style="color:#666">Table d'hôtes</td><td>Oui ✓</td></tr>` : ''}
          <tr><td style="color:#666">Montant</td><td style="color:#1a3220;font-weight:700;font-size:18px">${totalEur} €</td></tr>
        </table>
      </div>`,
  })

  await notifyWhatsApp(
    `💳 Paiement reçu - ${guestName} · ${chambreLib} · ${fmtDate(checkIn)} → ${fmtDate(checkOut)} · ${totalEur}€`
  )
}

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature') ?? ''
  const secret    = process.env.STRIPE_WEBHOOK_SECRET

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

      // Envoi des emails de confirmation
      await sendConfirmationEmail(meta, checkIn, checkOut, Math.round(pi.amount / 100))
    } catch (err: any) {
      console.error('[webhook] Erreur:', err.message)
    }
  }

  return NextResponse.json({ received: true })
}
