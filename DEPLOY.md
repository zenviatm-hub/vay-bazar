# Guide de déploiement sur Vercel

## Prérequis
- Un compte Vercel (gratuit) : https://vercel.com
- Un compte Supabase (gratuit) : https://supabase.com
- Git installé sur votre machine

## Étapes de déploiement

### 1. Préparer votre projet

Assurez-vous que votre projet est prêt :
- ✅ Toutes les dépendances sont installées (`npm install`)
- ✅ Le projet se build correctement (`npm run build`)
- ✅ Vous avez vos identifiants Supabase

### 2. Créer un compte Vercel

1. Allez sur https://vercel.com
2. Cliquez sur "Sign Up"
3. Connectez-vous avec GitHub, GitLab ou Bitbucket (recommandé pour le déploiement automatique)

### 3. Déployer votre projet

#### Option A : Via l'interface Vercel (Recommandé)

1. **Connecter votre repository Git**
   - Sur Vercel, cliquez sur "Add New..." → "Project"
   - Importez votre repository GitHub/GitLab/Bitbucket
   - Si votre code n'est pas encore sur Git :
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin <votre-repo-url>
     git push -u origin main
     ```

2. **Configurer le projet**
   - Framework Preset : Next.js (détecté automatiquement)
   - Root Directory : `./` (par défaut)
   - Build Command : `npm run build` (par défaut)
   - Output Directory : `.next` (par défaut)

3. **Ajouter les variables d'environnement**
   
   Dans la section "Environment Variables", ajoutez :
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
   SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
   ```
   
   ⚠️ **Important** : 
   - `NEXT_PUBLIC_SUPABASE_URL` : Trouvable dans Supabase → Settings → API → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Trouvable dans Supabase → Settings → API → Project API keys → anon public
   - `SUPABASE_SERVICE_ROLE_KEY` : Trouvable dans Supabase → Settings → API → Project API keys → service_role (⚠️ SECRET, ne jamais exposer côté client)

4. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez la fin du build (2-5 minutes)
   - Votre site sera disponible sur `votre-projet.vercel.app`

#### Option B : Via la CLI Vercel

1. **Installer la CLI Vercel**
   ```bash
   npm i -g vercel
   ```

2. **Se connecter**
   ```bash
   vercel login
   ```

3. **Déployer**
   ```bash
   vercel
   ```
   
   Suivez les instructions :
   - Link to existing project? → No (première fois)
   - Project name? → vay-bazar (ou le nom que vous voulez)
   - Directory? → ./
   - Override settings? → No

4. **Ajouter les variables d'environnement**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   ```

5. **Redéployer avec les variables**
   ```bash
   vercel --prod
   ```

### 4. Configuration Supabase pour la production

⚠️ **Important** : Vous devez configurer les URLs autorisées dans Supabase :

1. Allez sur Supabase → Authentication → URL Configuration
2. Ajoutez dans "Site URL" : `https://votre-projet.vercel.app`
3. Ajoutez dans "Redirect URLs" : 
   - `https://votre-projet.vercel.app/**`
   - `https://votre-projet.vercel.app/fr/**`
   - `https://votre-projet.vercel.app/ru/**`
   - `https://votre-projet.vercel.app/ce/**`

### 5. Vérifier le déploiement

Une fois déployé, votre site sera accessible sur :
- **URL principale** : `https://votre-projet.vercel.app`
- **URLs avec locales** : 
  - `https://votre-projet.vercel.app/fr`
  - `https://votre-projet.vercel.app/ru`
  - `https://votre-projet.vercel.app/ce`

## Déploiements automatiques

Vercel déploie automatiquement à chaque push sur votre branche principale :
- Chaque commit déclenche un nouveau déploiement
- Les pull requests créent des "preview deployments"
- Les déploiements sont gratuits et illimités

## Mise à jour du site

Pour mettre à jour votre site :
```bash
git add .
git commit -m "Description des changements"
git push
```

Vercel détectera automatiquement le push et redéploiera votre site.

## Support

- Documentation Vercel : https://vercel.com/docs
- Documentation Next.js sur Vercel : https://vercel.com/docs/frameworks/nextjs
- Support Vercel : https://vercel.com/support



