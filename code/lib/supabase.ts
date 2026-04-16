import { createClient } from '@supabase/supabase-js'

// Aceita tanto os nomes recomendados do Next.js (NEXT_PUBLIC_*) quanto nomes alternativos
// (ex.: variáveis configuradas manualmente na Vercel).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  // Não loga valores, só a presença para não vazar segredo
  console.error('[Supabase] Variáveis obrigatórias ausentes', {
    hasNextPublicUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasNextPublicPublishableKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    hasSupabasePublishableKey: !!process.env.SUPABASE_PUBLISHABLE_KEY,
  })
  throw new Error('Supabase não configurado: defina SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY (ou NEXT_PUBLIC_*)')
}

// Log de diagnóstico para ambiente de produção
if (typeof window === 'undefined') {
  console.log('[Supabase] Inicializando cliente', {
    nodeEnv: process.env.NODE_ENV,
    hasUrl: !!(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL),
    hasPublishableKey: !!(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY
    ),
    hasSecretKey: !!process.env.SUPABASE_SECRET_KEY,
  })
}

// Client-side Supabase client (usa a publishable key)
export const supabase = createClient(supabaseUrl, supabasePublishableKey)

// Server-side Supabase client com permissões elevadas (secret key)
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!secretKey) {
    console.error('[Supabase] createAdminClient chamado sem SUPABASE_SECRET_KEY configurada')
    throw new Error('SUPABASE_SECRET_KEY não configurada')
  }
  console.log('[Supabase] createAdminClient criado com sucesso')
  return createClient(supabaseUrl, secretKey)
}
