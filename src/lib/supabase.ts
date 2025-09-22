import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  name: string | null
  google_id: string | null
  image: string | null
  created_at: string
}

export type Person = {
  id: number
  user_id: string
  name: string
  company: string | null
  email: string | null
  phone: string | null
  notes: string | null
  follow_up_date: string | null
  last_contact_date: string | null
  created_at: string
  updated_at: string
}
