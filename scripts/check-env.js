// Script pour vérifier les variables d'environnement
// Usage: node scripts/check-env.js

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

console.log('🔍 Vérification des variables d\'environnement...\n')

let allPresent = true

requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    // Masquer la valeur pour la sécurité
    const masked = value.length > 20 
      ? value.substring(0, 10) + '...' + value.substring(value.length - 10)
      : '***'
    console.log(`✅ ${varName}: ${masked}`)
  } else {
    console.log(`❌ ${varName}: MANQUANTE`)
    allPresent = false
  }
})

console.log('')

if (allPresent) {
  console.log('✅ Toutes les variables d\'environnement sont présentes!')
  process.exit(0)
} else {
  console.log('❌ Certaines variables d\'environnement sont manquantes!')
  console.log('\n📝 Pour les ajouter sur Vercel:')
  console.log('1. Allez sur https://vercel.com/dashboard')
  console.log('2. Sélectionnez votre projet')
  console.log('3. Settings → Environment Variables')
  console.log('4. Ajoutez les variables manquantes')
  console.log('5. Cochez Production, Preview, et Development')
  console.log('6. Redéployez le projet')
  process.exit(1)
}

