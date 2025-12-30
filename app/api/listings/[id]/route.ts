import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'utilisateur connecté
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 })
    }

    const { id } = await params
    const listingId = parseInt(id, 10)

    if (isNaN(listingId)) {
      return NextResponse.json({ success: false, error: "ID d'annonce invalide" }, { status: 400 })
    }

    // Vérifier que l'annonce existe et appartient à l'utilisateur
    const { data: existingListing, error: fetchError } = await supabaseAdmin
      .from("listings")
      .select("user_id")
      .eq("id", listingId)
      .single()

    if (fetchError || !existingListing) {
      return NextResponse.json({ success: false, error: "Annonce introuvable" }, { status: 404 })
    }

    if (existingListing.user_id !== user.id) {
      return NextResponse.json({ success: false, error: "Vous n'êtes pas autorisé à modifier cette annonce" }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      categoryId,
      price,
      priceNegotiable,
      condition,
      location,
      images, // Array of base64 strings (nouvelles images) ou URLs existantes
      existingImages, // URLs des images existantes à conserver
      departureCity,
      arrivalCity,
      skills,
      experience,
      whatsappNumber,
    } = body

    // Validation
    if (!title || !description || !categoryId || !location) {
      return NextResponse.json(
        { success: false, error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      )
    }

    // Mettre à jour l'annonce dans Supabase
    const { error: updateError } = await supabaseAdmin
      .from("listings")
      .update({
        category_id: parseInt(categoryId),
        title: title.trim(),
        description: description.trim(),
        price: price ? parseFloat(price) : null,
        price_negotiable: priceNegotiable || false,
        condition: condition || null,
        location: location.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId)

    if (updateError) {
      console.error("Erreur lors de la mise à jour de l'annonce:", updateError)
      return NextResponse.json(
        { success: false, error: "Erreur lors de la mise à jour de l'annonce" },
        { status: 500 }
      )
    }

    // Gérer les images
    const finalImageUrls: string[] = []

    // Conserver les images existantes si spécifiées
    if (existingImages && Array.isArray(existingImages)) {
      finalImageUrls.push(...existingImages)
    }

    // Uploader les nouvelles images vers Supabase Storage
    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageData = images[i]
        
        // Si c'est déjà une URL (image existante), l'ajouter directement
        if (typeof imageData === 'string' && (imageData.startsWith('http') || imageData.startsWith('https'))) {
          if (!finalImageUrls.includes(imageData)) {
            finalImageUrls.push(imageData)
          }
          continue
        }
        
        // Sinon, c'est une nouvelle image en base64
        const base64Data = imageData.split(",")[1] || imageData
        const buffer = Buffer.from(base64Data, "base64")
        
        // Générer un nom de fichier unique
        const fileName = `listing-${listingId}-${i}-${Date.now()}.jpg`
        const filePath = `listings/${user.id}/${fileName}`

        // Upload vers Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from("listings")
          .upload(filePath, buffer, {
            contentType: "image/jpeg",
            upsert: false,
          })

        if (uploadError) {
          console.error("Erreur lors de l'upload de l'image:", uploadError)
          continue // Continuer avec les autres images même si une échoue
        }

        // Obtenir l'URL publique de l'image
        const { data: urlData } = supabaseAdmin.storage
          .from("listings")
          .getPublicUrl(filePath)

        if (urlData?.publicUrl) {
          finalImageUrls.push(urlData.publicUrl)
        }
      }
    }

    // Supprimer toutes les images existantes de la base de données
    const { error: deleteImagesError } = await supabaseAdmin
      .from("listing_images")
      .delete()
      .eq("listing_id", listingId)

    if (deleteImagesError) {
      console.error("Erreur lors de la suppression des images:", deleteImagesError)
    }

    // Sauvegarder les nouvelles URLs des images dans la base de données
    if (finalImageUrls.length > 0) {
      const imageRecords = finalImageUrls.map((url, index) => ({
        listing_id: listingId,
        image_url: url,
        display_order: index,
      }))

      const { error: imagesError } = await supabaseAdmin
        .from("listing_images")
        .insert(imageRecords)

      if (imagesError) {
        console.error("Erreur lors de la sauvegarde des images:", imagesError)
        // Ne pas échouer la mise à jour de l'annonce si les images échouent
      }
    }

    return NextResponse.json({
      success: true,
      listingId,
      message: "Annonce mise à jour avec succès",
    })
  } catch (error: any) {
    console.error("Erreur API updateListing:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Erreur serveur" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'utilisateur connecté
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 })
    }

    const { id } = await params
    const listingId = parseInt(id, 10)

    if (isNaN(listingId)) {
      return NextResponse.json({ success: false, error: "ID d'annonce invalide" }, { status: 400 })
    }

    // Vérifier que l'annonce existe et appartient à l'utilisateur
    const { data: existingListing, error: fetchError } = await supabaseAdmin
      .from("listings")
      .select("user_id")
      .eq("id", listingId)
      .single()

    if (fetchError || !existingListing) {
      return NextResponse.json({ success: false, error: "Annonce introuvable" }, { status: 404 })
    }

    if (existingListing.user_id !== user.id) {
      return NextResponse.json({ success: false, error: "Vous n'êtes pas autorisé à supprimer cette annonce" }, { status: 403 })
    }

    // Récupérer les images de l'annonce pour les supprimer du storage
    const { data: listingImages } = await supabaseAdmin
      .from("listing_images")
      .select("image_url")
      .eq("listing_id", listingId)

    // Supprimer les images du storage Supabase
    if (listingImages && listingImages.length > 0) {
      for (const image of listingImages) {
        try {
          // Extraire le chemin du fichier depuis l'URL
          const url = new URL(image.image_url)
          const pathParts = url.pathname.split('/')
          const bucketName = pathParts[1] // 'storage' ou le nom du bucket
          const filePath = pathParts.slice(2).join('/') // Le reste du chemin
          
          // Si le bucket est 'listings', supprimer le fichier
          if (bucketName === 'listings' || url.pathname.includes('/listings/')) {
            const actualPath = url.pathname.split('/listings/')[1]
            if (actualPath) {
              await supabaseAdmin.storage
                .from("listings")
                .remove([actualPath])
            }
          }
        } catch (error) {
          console.error("Erreur lors de la suppression de l'image du storage:", error)
          // Continuer même si la suppression d'une image échoue
        }
      }
    }

    // Supprimer l'annonce (les images seront supprimées automatiquement grâce à ON DELETE CASCADE)
    const { error: deleteError } = await supabaseAdmin
      .from("listings")
      .delete()
      .eq("id", listingId)

    if (deleteError) {
      console.error("Erreur lors de la suppression de l'annonce:", deleteError)
      return NextResponse.json(
        { success: false, error: "Erreur lors de la suppression de l'annonce" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Annonce supprimée avec succès",
    })
  } catch (error: any) {
    console.error("Erreur API deleteListing:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Erreur serveur" },
      { status: 500 }
    )
  }
}

