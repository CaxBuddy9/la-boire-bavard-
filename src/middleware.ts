import { NextRequest, NextResponse } from 'next/server'

const MAINTENANCE = true

const PUBLIC_PATHS = ['/bientot', '/_next', '/favicon', '/manifest', '/icons', '/api']

export function middleware(req: NextRequest) {
  if (!MAINTENANCE) return NextResponse.next()

  const { pathname } = req.nextUrl
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next()

  return NextResponse.redirect(new URL('/bientot', req.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
