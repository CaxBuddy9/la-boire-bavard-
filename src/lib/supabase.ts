import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types de base
export type Reservation = {
  id: string
  created_at: string
  room_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'paid'
  stripe_payment_intent?: string
  message?: string
}

export type GuestbookEntry = {
  id: string
  created_at: string
  author: string
  city?: string
  room?: string
  message: string
  rating: number
  approved: boolean
}

export type Room = {
  id: string
  slug: string
  name: string
  description: string
  capacity_min: number
  capacity_max: number
  price_per_night: number
  features: string[]
  images: string[]
}
