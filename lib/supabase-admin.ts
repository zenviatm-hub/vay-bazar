import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization - ne crée le client que quand il est utilisé
// Cela évite les erreurs au build time si les variables d'environnement ne sont pas encore disponibles
let _supabaseAdmin: SupabaseClient | null = null

function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase admin environment variables')
    }

    // Client pour les opérations serveur (avec service role key)
    // NE JAMAIS UTILISER CÔTÉ CLIENT
    _supabaseAdmin = createClient(
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
  return _supabaseAdmin
}

// Export avec Proxy pour maintenir la compatibilité avec le code existant
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as any)[prop]
  }
})

