import { NextRequest, NextResponse } from 'next/server'

const MAINTENANCE   = true
const BYPASS_COOKIE = 'lbb_preview'
const BYPASS_PATHS  = ['/bientot', '/_next', '/favicon', '/manifest', '/icons', '/api', '/preview']

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (BYPASS_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  if (MAINTENANCE) {
    // Bypass si cookie preview valide
    const secret = process.env.PREVIEW_SECRET || 'lbb-preview-2026'
    const cookie = req.cookies.get(BYPASS_COOKIE)?.value
    if (cookie === secret) return NextResponse.next()

    return NextResponse.redirect(new URL('/bientot', req.url))
  }

  // Protection des routes admin
  const token = req.cookies.get('admin_token')?.value
  if (pathname.startsWith('/api/admin') && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg|favicon.png|icons|manifest.json).*)'],
}
