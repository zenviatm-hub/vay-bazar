# Guide de déploiement sur Vercel via GitHub

## ✅ Étape 1 : Repository Git initialisé

Votre projet est maintenant prêt avec Git. Le commit initial a été créé.

## 📝 Étape 2 : Créer un repository sur GitHub

1. Allez sur https://github.com
2. Connectez-vous ou créez un compte
3. Cliquez sur le bouton **"+"** en haut à droite → **"New repository"**
4. Remplissez les informations :
   - **Repository name** : `vay-bazar` (ou le nom que vous préférez)
   - **Description** : "Plateforme de petites annonces multilingue"
   - **Visibility** : Public ou Private (au choix)
   - ⚠️ **NE COCHEZ PAS** "Add a README file", "Add .gitignore", ou "Choose a license" (on a déjà tout ça)
5. Cliquez sur **"Create repository"**

## 🔗 Étape 3 : Connecter votre projet local à GitHub

Après avoir créé le repository, GitHub vous affichera des instructions. Utilisez la section **"push an existing repository from the command line"**.

Exécutez ces commandes dans votre terminal (remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub) :

```bash
git remote add origin https://github.com/VOTRE_USERNAME/vay-bazar.git
git branch -M main
git push -u origin main
```

**Ou si vous utilisez SSH :**
```bash
git remote add origin git@github.com:VOTRE_USERNAME/vay-bazar.git
git branch -M main
git push -u origin main
```

## 🚀 Étape 4 : Déployer sur Vercel

### 4.1 Créer un compte Vercel

1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"** (recommandé)
4. Autorisez Vercel à accéder à votre compte GitHub

### 4.2 Importer votre projet

1. Sur le dashboard Vercel, cliquez sur **"Add New..."** → **"Project"**
2. Vous verrez la liste de vos repositories GitHub
3. Trouvez **"vay-bazar"** et cliquez sur **"Import"**

### 4.3 Configurer le projet

Vercel détectera automatiquement que c'est un projet Next.js. Les paramètres par défaut sont corrects :

- **Framework Preset** : Next.js ✅
- **Root Directory** : `./` ✅
- **Build Command** : `npm run build` ✅
- **Output Directory** : `.next` ✅
- **Install Command** : `npm install` ✅

### 4.4 ⚠️ IMPORTANT : Ajouter les variables d'environnement

**AVANT de cliquer sur "Deploy"**, vous devez ajouter les variables d'environnement :

1. Dans la section **"Environment Variables"**, cliquez pour ajouter des variables
2. Ajoutez ces 3 variables (une par une) :

   **Variable 1 :**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Votre URL Supabase (ex: `https://xxxxx.supabase.co`)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **Variable 2 :**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Votre clé anon Supabase
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **Variable 3 :**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Votre clé service_role Supabase (⚠️ SECRET)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

3. **Où trouver ces valeurs ?**
   - Allez sur https://supabase.com → Votre projet
   - Settings → API
   - **Project URL** = `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** = `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** = `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Ne jamais exposer côté client)

### 4.5 Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 2-5 minutes pendant le build
3. Une fois terminé, votre site sera disponible sur `votre-projet.vercel.app`

## 🔐 Étape 5 : Configurer Supabase pour la production

Après le déploiement, vous devez configurer Supabase pour accepter les requêtes depuis Vercel :

1. Allez sur Supabase → **Authentication** → **URL Configuration**
2. Dans **"Site URL"**, ajoutez : `https://votre-projet.vercel.app`
3. Dans **"Redirect URLs"**, ajoutez (une par ligne) :
   ```
   https://votre-projet.vercel.app/**
   https://votre-projet.vercel.app/fr/**
   https://votre-projet.vercel.app/ru/**
   https://votre-projet.vercel.app/ce/**
   ```
4. Cliquez sur **"Save"**

## ✅ Votre site est en ligne !

Votre site sera accessible sur :
- **URL principale** : `https://votre-projet.vercel.app`
- **URLs avec locales** :
  - `https://votre-projet.vercel.app/fr`
  - `https://votre-projet.vercel.app/ru`
  - `https://votre-projet.vercel.app/ce`

## 🔄 Mises à jour automatiques

Désormais, chaque fois que vous poussez du code sur GitHub :

```bash
git add .
git commit -m "Description des changements"
git push
```

Vercel détectera automatiquement le changement et redéploiera votre site ! 🎉

## 📚 Ressources

- Documentation Vercel : https://vercel.com/docs
- Documentation Next.js : https://nextjs.org/docs
- Support Vercel : https://vercel.com/support



