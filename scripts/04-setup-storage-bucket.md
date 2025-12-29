# Configuration du bucket Supabase Storage pour les images d'annonces

## Étapes pour créer le bucket "listings" dans Supabase

1. Connectez-vous à votre dashboard Supabase : https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans **Storage** dans le menu de gauche
4. Cliquez sur **New bucket**
5. Configurez le bucket :
   - **Name**: `listings`
   - **Public bucket**: ✅ **Activé** (pour que les images soient accessibles publiquement)
   - **File size limit**: 10 MB (ou plus selon vos besoins)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`
6. Cliquez sur **Create bucket**

## Configuration des politiques RLS (Row Level Security)

Après avoir créé le bucket, configurez les politiques de sécurité :

1. Allez dans **Storage** > **Policies** pour le bucket `listings`
2. Créez une politique pour permettre l'upload :
   - **Policy name**: `Allow authenticated uploads`
   - **Allowed operation**: `INSERT`
   - **Policy definition**: 
     ```sql
     (bucket_id = 'listings'::text) AND (auth.role() = 'authenticated'::text)
     ```
3. Créez une politique pour permettre la lecture publique :
   - **Policy name**: `Allow public read access`
   - **Allowed operation**: `SELECT`
   - **Policy definition**:
     ```sql
     bucket_id = 'listings'::text
     ```

## Alternative : Utiliser l'API Supabase

Vous pouvez aussi créer le bucket via l'API Supabase en utilisant le service role key, mais la méthode via le dashboard est plus simple et recommandée.



