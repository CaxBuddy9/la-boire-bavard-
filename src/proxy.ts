import { NextRequest, NextResponse } from 'next/server'

const MAINTENANCE = true

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Mode maintenance : redirige tout vers /bientot sauf les assets et la page elle-même
  if (MAINTENANCE) {
    const bypass = ['/bientot', '/_next', '/favicon', '/manifest', '/icons', '/api']
    if (!bypass.some(p => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL('/bientot', req.url))
    }
    return NextResponse.next()
  }

  // Protection des routes admin
  const token = req.cookies.get('admin_token')?.value
  if (pathname.startsWith('/api/admin') && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
