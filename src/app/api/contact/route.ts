import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const missing: string[] = []
  if (!url) missing.push('SUPABASE_URL')
  if (!key) missing.push('SUPABASE_SERVICE_ROLE_KEY')
  if (missing.length) throw new Error(`Variables manquantes : ${missing.join(', ')}`)
  return createClient(url!, key!)
}

function getMailer() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) return null
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sanitize(s: unknown, maxLen = 200): string {
  if (typeof s !== 'string') return ''
  return s.trim().slice(0, maxLen)
}

const CHAMBRES_LABELS: Record<string, string> = {
  jardin:  'Côté Jardin',
  cedre:   'Côté Cèdre',
  vallee:  'Côté Vallée',
  potager: 'Côté Potager',
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

    if (!prenom || !nom) {
      return NextResponse.json({ error: 'Prénom et nom requis' }, { status: 400 })
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const guestName  = `${prenom} ${nom}`.trim()
    const today      = new Date().toISOString().split('T')[0]
    const chambreLib = CHAMBRES_LABELS[chambre] || chambre || 'Sans préférence'

    // ── Sauvegarde Supabase ──
    try {
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
      if (error) console.error('[contact] Supabase insert:', error.message)
    } catch (e: any) {
      console.error('[contact] Supabase error:', e?.message)
    }

    // ── Envoi Gmail ──
    const mailer = getMailer()
    if (mailer) {
      const gmailUser = process.env.GMAIL_USER!

      // Email de notification à Sandrine
      const notifHtml = `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#f5f0e8;padding:32px;border-radius:8px;">
          <h2 style="color:#1a3220;font-size:22px;margin:0 0 8px">Nouvelle demande de contact</h2>
          <p style="color:#c4a050;font-size:13px;margin:0 0 24px;letter-spacing:.06em;text-transform:uppercase">La Boire Bavard</p>
          <table style="width:100%;border-collapse:collapse;font-size:15px;">
            <tr><td style="padding:8px 0;color:#666;width:130px">Nom</td><td style="padding:8px 0;color:#1a2e1a;font-weight:500">${guestName}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0;color:#1a2e1a"><a href="mailto:${email}" style="color:#c4a050">${email}</a></td></tr>
            ${tel ? `<tr><td style="padding:8px 0;color:#666">Téléphone</td><td style="padding:8px 0;color:#1a2e1a"><a href="tel:${tel}" style="color:#c4a050">${tel}</a></td></tr>` : ''}
            ${chambreLib ? `<tr><td style="padding:8px 0;color:#666">Chambre</td><td style="padding:8px 0;color:#1a2e1a">${chambreLib}</td></tr>` : ''}
            ${arrivee ? `<tr><td style="padding:8px 0;color:#666">Arrivée</td><td style="padding:8px 0;color:#1a2e1a">${arrivee}</td></tr>` : ''}
            ${depart ? `<tr><td style="padding:8px 0;color:#666">Départ</td><td style="padding:8px 0;color:#1a2e1a">${depart}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#666">Voyageurs</td><td style="padding:8px 0;color:#1a2e1a">${adultes} pers.</td></tr>
          </table>
          ${message ? `<div style="margin-top:20px;padding:16px;background:#fff;border-left:3px solid #c4a050;border-radius:4px;font-size:15px;color:#2a2a2a;line-height:1.7">${message.replace(/\n/g, '<br>')}</div>` : ''}
          <p style="margin-top:24px;font-size:12px;color:#999">Répondre directement à cet email pour contacter ${prenom}.</p>
        </div>`

      await mailer.sendMail({
        from: `"La Boire Bavard" <${gmailUser}>`,
        to: gmailUser,
        replyTo: email,
        subject: `✉️ Demande de ${guestName}${chambreLib ? ` — ${chambreLib}` : ''}`,
        html: notifHtml,
      })

      // Email de confirmation au client
      const confirmHtml = `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#f5f0e8;padding:32px;border-radius:8px;">
          <h2 style="color:#1a3220;font-size:22px;margin:0 0 4px">Merci, ${prenom} !</h2>
          <p style="color:#c4a050;font-size:13px;margin:0 0 24px;letter-spacing:.06em;text-transform:uppercase">La Boire Bavard · Anjou</p>
          <p style="font-size:16px;color:#2a2a2a;line-height:1.8">Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.</p>
          <div style="margin:24px 0;padding:16px;background:#1a3220;border-radius:6px;color:#f0e8d4;font-size:14px;line-height:1.8;">
            <strong style="display:block;color:#c4a050;margin-bottom:8px">Récapitulatif</strong>
            ${chambreLib ? `<span>Chambre : ${chambreLib}</span><br>` : ''}
            ${arrivee ? `<span>Arrivée : ${arrivee}</span><br>` : ''}
            ${depart ? `<span>Départ : ${depart}</span><br>` : ''}
            <span>Voyageurs : ${adultes} pers.</span>
          </div>
          <p style="font-size:14px;color:#666;line-height:1.8">Pour toute question urgente :<br>
            📞 <a href="tel:+33675786335" style="color:#c4a050">06 75 78 63 35</a><br>
            💬 <a href="https://wa.me/33675786335" style="color:#c4a050">WhatsApp</a>
          </p>
          <p style="margin-top:24px;font-size:13px;color:#999">Sandrine — La Boire Bavard<br>4 chemin de la Boire Bavard · 49320 Blaison-Saint-Sulpice</p>
        </div>`

      await mailer.sendMail({
        from: `"Sandrine — La Boire Bavard" <${gmailUser}>`,
        to: email,
        subject: 'Votre demande a bien été reçue — La Boire Bavard',
        html: confirmHtml,
      })
    } else {
      console.warn('[contact] Gmail non configuré (GMAIL_USER / GMAIL_APP_PASSWORD manquants)')
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[contact] Exception:', e?.message)
    return NextResponse.json({ error: e?.message || 'Requête invalide' }, { status: 400 })
  }
}
