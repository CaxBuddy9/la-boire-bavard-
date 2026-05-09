import { Resend } from 'resend'

const FROM_NAME = 'Sandrine — La Boire Bavard'
const FROM_EMAIL = 'contact@laboirebavard.com'
export const FROM = `${FROM_NAME} <${FROM_EMAIL}>`
export const NOTIF_TO = FROM_EMAIL

let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string
  subject: string
  html: string
  replyTo?: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[mailer] RESEND_API_KEY manquant — email non envoyé')
    return
  }
  const { error } = await getResend().emails.send({
    from: FROM,
    to,
    replyTo,
    subject,
    html,
  })
  if (error) console.error('[mailer] Resend error:', error)
}

// Notification WhatsApp via CallMeBot (gratuit, sans inscription)
export async function notifyWhatsApp(message: string) {
  const phone  = process.env.SANDRINE_WHATSAPP   // ex: 33675786335
  const apiKey = process.env.CALLMEBOT_APIKEY
  if (!phone || !apiKey) return
  try {
    const encoded = encodeURIComponent(message)
    await fetch(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apiKey}`)
  } catch (e) {
    console.warn('[whatsapp] Notification échouée:', e)
  }
}
