import { createClient } from '@supabase/supabase-js'

// Fonction pour créer le client Supabase admin
// Permet de vérifier les variables d'environnement uniquement au runtime
function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase admin environment variables')
  }

  // Client pour les opérations serveur (avec service role key)
  // NE JAMAIS UTILISER CÔTÉ CLIENT
  return createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Lazy initialization - ne crée le client que quand il est utilisé
let _supabaseAdmin: ReturnType<typeof createSupabaseAdmin> | null = null

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdmin>, {
  get(_target, prop) {
    if (!_supabaseAdmin) {
      _supabaseAdmin = createSupabaseAdmin()
    }
    return (_supabaseAdmin as any)[prop]
  }
})

