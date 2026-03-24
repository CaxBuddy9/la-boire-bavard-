import Stripe from 'stripe'

export const PRICE_PER_NIGHT = 88   // €
export const TABLE_HOTES_PRICE = 25 // € / pers

// Lazy init — only at request time, not at build time
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured')
  return new Stripe(key)
}
