import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const MAINTENANCE = true

export function middleware(request: NextRequest) {
  if (!MAINTENANCE) return NextResponse.next()

  const { pathname } = request.nextUrl

  // Laisser passer : page bientot elle-même, API, admin, fichiers statiques
  if (
    pathname.startsWith('/bientot') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next/')
  ) {
    return NextResponse.next()
  }

  // Réécrire vers /bientot sans changer l'URL visible, avec 503 pour les crawlers
  const response = NextResponse.rewrite(new URL('/bientot', request.url))
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  response.headers.set('Retry-After', '86400')
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|icons|photos|manifest|robots|sitemap).*)'],
}
