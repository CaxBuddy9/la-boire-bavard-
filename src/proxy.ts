import { NextRequest, NextResponse } from 'next/server'

const MAINTENANCE   = true
const BYPASS_COOKIE = 'lbb_preview'
const BYPASS_PATHS  = ['/bientot', '/guide', '/_next', '/favicon', '/manifest', '/icons', '/api', '/preview', '/robots.txt', '/sitemap.xml', '/apple-touch-icon']

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (BYPASS_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  if (MAINTENANCE) {
    const secret = process.env.PREVIEW_SECRET || 'lbb-preview-2026'
    const cookie = req.cookies.get(BYPASS_COOKIE)?.value
    if (cookie === secret) return NextResponse.next()

    // Rewrite (pas redirect) pour conserver l'URL et éviter les signaux 3xx vers Google
    const response = NextResponse.rewrite(new URL('/bientot', req.url))
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    response.headers.set('Retry-After', '86400')
    return response
  }

  const token = req.cookies.get('admin_token')?.value
  if (pathname.startsWith('/api/admin') && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg|favicon.png|icons|manifest.json).*)'],
}
