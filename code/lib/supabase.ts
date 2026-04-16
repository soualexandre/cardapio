import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

// Client-side Supabase client (usa a publishable key)
export const supabase = createClient(supabaseUrl, supabasePublishableKey)

// Server-side Supabase client com permissões elevadas (secret key)
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!secretKey) throw new Error('SUPABASE_SECRET_KEY não configurada')
  return createClient(supabaseUrl, secretKey)
}
