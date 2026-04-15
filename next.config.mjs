/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'golfangers.fr' },
      { protocol: 'https', hostname: 'anjou-vignoble-villages.com' },
      { protocol: 'https', hostname: 'www.loireavelo.fr' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://*.stripe.com https://www.googletagmanager.com https://www.google-analytics.com",
              "frame-src https://js.stripe.com https://hooks.stripe.com https://m.stripe.com https://*.stripe.com https://www.openstreetmap.org",
              "connect-src 'self' https://js.stripe.com https://api.stripe.com https://r.stripe.com https://m.stripe.com https://*.stripe.com https://*.supabase.co wss://*.supabase.co https://api.open-meteo.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com",
              "img-src 'self' data: https:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.stripe.com",
              "font-src 'self' https://fonts.gstatic.com https://*.stripe.com",
              "worker-src 'self' blob: https://js.stripe.com https://*.stripe.com",
              "base-uri 'self'",
              "form-action 'self' https://stripe.com https://*.stripe.com",
            ].join('; '),
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
