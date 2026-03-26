import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

// Token stateless basé sur HMAC — fonctionne sur serverless sans état partagé
export function makeAdminToken(): string {
  const pw   = process.env.ADMIN_PASSWORD ?? ''
  const salt = process.env.ADMIN_SECRET   ?? 'lbb-fallback-salt'
  return createHmac('sha256', salt).update(pw).digest('hex')
}

export function verifyAdminCookie(req: NextRequest): boolean {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  // Comparaison constante pour éviter timing attacks
  const expected = makeAdminToken()
  if (token.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json({ error: 'Serveur mal configuré' }, { status: 500 })
    }

    // Délai fixe pour ralentir le brute force
    await new Promise(r => setTimeout(r, 400))

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Identifiant invalide' }, { status: 401 })
    }

    const token = makeAdminToken()
    const res   = NextResponse.json({ ok: true })
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }
}
