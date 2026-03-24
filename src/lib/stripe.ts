import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const PRICE_PER_NIGHT = 88 // €
export const TABLE_HOTES_PRICE = 25 // € / pers
