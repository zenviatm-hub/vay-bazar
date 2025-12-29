import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization - ne crée le client que quand il est utilisé
// Cela évite les erreurs au build time si les variables d'environnement ne sont pas encore disponibles
let _supabaseAdmin: SupabaseClient | null = null

function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Vérification plus détaillée pour aider au débogage
    if (!supabaseUrl) {
      throw new Error(
        'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
        'Please add it in Vercel: Settings → Environment Variables'
      )
    }

    if (!supabaseServiceRoleKey) {
      throw new Error(
        'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
        'Please add it in Vercel: Settings → Environment Variables. ' +
        'Make sure to enable it for Production, Preview, and Development environments.'
      )
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

// Créer un Proxy qui intercepte tous les accès et initialise le client seulement au runtime
// Pendant le build, si les variables ne sont pas disponibles, on crée un client "dummy"
// qui lancera l'erreur seulement quand on essaie vraiment de l'utiliser
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    // Essayer d'obtenir le client réel
    try {
      const client = getSupabaseAdmin()
      return (client as any)[prop]
    } catch (error: any) {
      // Si l'erreur vient de variables manquantes et qu'on est en build,
      // créer un objet proxy qui reportera l'erreur seulement au runtime
      if (error.message?.includes('Missing') && process.env.NEXT_PHASE === 'phase-production-build') {
        // Pendant le build, retourner un objet qui reportera l'erreur au runtime
        if (prop === 'from' || prop === 'auth' || prop === 'storage') {
          return new Proxy({}, {
            get() {
              throw new Error(
                'Supabase client not initialized. Environment variables are missing. ' +
                'Please ensure all Supabase environment variables are configured in Vercel.'
              )
            }
          })
        }
      }
      // Sinon, propager l'erreur
      throw error
    }
  }
})

