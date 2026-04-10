import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// POST — reçoit les demandes des hôtes (sans auth, données non sensibles)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { room, type, data, lang } = body

    if (!room || !type || !data) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    const validTypes = ['diet', 'dinner', 'spa']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Type invalide' }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) {
      // Supabase non configuré — on accepte quand même (dégradation gracieuse)
      return NextResponse.json({ ok: true, warning: 'non_persisté' })
    }

    const { error } = await supabase
      .from('guest_requests')
      .insert({
        room,
        type,
        data,
        lang: lang || 'fr',
        date: new Date().toISOString().split('T')[0],
      })

    if (error) {
      // Table peut ne pas exister encore — on ne plante pas
      console.error('guest_requests insert error:', error.message)
      return NextResponse.json({ ok: true, warning: error.message })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// GET — lecture pour l'admin (accessible depuis le dashboard)
export async function GET() {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ data: [], warning: 'Supabase non configuré' })
    }

    // Requêtes des 2 derniers jours (couvre les prefs faites la veille pour ce matin)
    const yesterday = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('guest_requests')
      .select('*')
      .gte('date', yesterday)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ data: [], warning: error.message })
    }

    return NextResponse.json({ data: data || [] })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
