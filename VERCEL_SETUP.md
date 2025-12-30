# Guide de configuration Vercel - Variables d'environnement

## ⚠️ PROBLÈME ACTUEL
L'erreur "Missing Supabase admin environment variables" signifie que les variables d'environnement ne sont **PAS configurées sur Vercel**.

## ✅ SOLUTION ÉTAPE PAR ÉTAPE

### Étape 1 : Ouvrir votre projet sur Vercel
1. Allez sur https://vercel.com/dashboard
2. Cliquez sur votre projet `vay-bazar`

### Étape 2 : Accéder aux variables d'environnement
1. Cliquez sur **"Settings"** (en haut)
2. Dans le menu de gauche, cliquez sur **"Environment Variables"**

### Étape 3 : Ajouter les 3 variables REQUISES

#### Variable 1 : NEXT_PUBLIC_SUPABASE_URL
- **Key** : `NEXT_PUBLIC_SUPABASE_URL`
- **Value** : `https://gfdggngmnpaaulapeprd.supabase.co`
- **Environments** : ✅ Cochez les 3 cases :
  - ✅ Production
  - ✅ Preview  
  - ✅ Development
- Cliquez sur **"Save"**

#### Variable 2 : NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key** : `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value** : (Copiez depuis votre fichier `.env.local` local)
  - Ouvrez `.env.local` dans votre éditeur
  - Copiez la valeur de `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Environments** : ✅ Cochez les 3 cases (Production, Preview, Development)
- Cliquez sur **"Save"**
- ⚠️ Ignorez l'avertissement de sécurité (c'est normal pour cette clé)

#### Variable 3 : SUPABASE_SERVICE_ROLE_KEY ⚠️ LA PLUS IMPORTANTE
- **Key** : `SUPABASE_SERVICE_ROLE_KEY`
- **Value** : (Copiez depuis votre fichier `.env.local` local)
  - Ouvrez `.env.local` dans votre éditeur
  - Copiez la valeur de `SUPABASE_SERVICE_ROLE_KEY`
- **Environments** : ✅ Cochez les 3 cases (Production, Preview, Development)
- Cliquez sur **"Save"**

### Étape 4 : Vérifier que les 3 variables sont présentes
Vous devriez voir dans la liste :
1. ✅ NEXT_PUBLIC_SUPABASE_URL
2. ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
3. ✅ SUPABASE_SERVICE_ROLE_KEY

### Étape 5 : Redéployer
1. Allez dans l'onglet **"Deployments"**
2. Cliquez sur les **"..."** (3 points) du dernier déploiement
3. Cliquez sur **"Redeploy"**
4. Ou faites un nouveau commit/push sur GitHub

## 🔍 VÉRIFICATION

Après le redéploiement, vérifiez :
- ✅ Le build réussit (pas d'erreur "Missing Supabase admin environment variables")
- ✅ Le site fonctionne correctement

## 📝 NOTES IMPORTANTES

- Les variables doivent être ajoutées **SUR VERCEL**, pas seulement dans `.env.local`
- `.env.local` fonctionne uniquement en local
- Sur Vercel, vous devez les ajouter manuellement dans l'interface
- **IMPORTANT** : Cochez bien les 3 environnements pour chaque variable !

## 🆘 SI ÇA NE MARCHE TOUJOURS PAS

1. Vérifiez que vous avez bien **3 variables** dans la liste
2. Vérifiez que chaque variable a les **3 environnements** cochés
3. Vérifiez que les **valeurs** sont correctes (pas d'espaces avant/après)
4. **Redéployez** après avoir ajouté les variables
5. Vérifiez les **logs de build** pour voir l'erreur exacte




