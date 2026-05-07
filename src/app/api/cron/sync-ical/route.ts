import { NextRequest, NextResponse } from 'next/server'

// Vercel cron endpoint — appelé automatiquement toutes les heures
// Protégé par CRON_SECRET (header Authorization: Bearer <secret>)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const syncKey = process.env.ICAL_SYNC_KEY
  if (!syncKey) {
    return NextResponse.json({ error: 'ICAL_SYNC_KEY manquant' }, { status: 500 })
  }

  const origin = req.nextUrl.origin
  const res = await fetch(`${origin}/api/sync-ical?key=${syncKey}`, {
    headers: { 'x-internal': '1' },
  })
  const data = await res.json()
  return NextResponse.json(data)
}
