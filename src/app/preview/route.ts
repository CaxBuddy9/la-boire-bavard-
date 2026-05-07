import { NextRequest, NextResponse } from 'next/server'

// GET /preview?key=SECRET → pose le cookie bypass et redirige vers l'accueil
export async function GET(req: NextRequest) {
  const key    = req.nextUrl.searchParams.get('key')
  const secret = process.env.PREVIEW_SECRET || 'lbb-preview-2026'

  if (key !== secret) {
    return NextResponse.redirect(new URL('/bientot', req.url))
  }

  const res = NextResponse.redirect(new URL('/', req.url))
  res.cookies.set('lbb_preview', secret, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    path: '/',
  })
  return res
}
