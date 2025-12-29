import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'utilisateur connecté
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 })
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
      images, // Array of base64 strings
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

    // Créer l'annonce dans Supabase
    const { data: listing, error: listingError } = await supabaseAdmin
      .from("listings")
      .insert({
        user_id: user.id,
        category_id: parseInt(categoryId),
        title: title.trim(),
        description: description.trim(),
        price: price ? parseFloat(price) : null,
        price_negotiable: priceNegotiable || false,
        condition: condition || null,
        location: location.trim(),
        status: "active",
      })
      .select("id")
      .single()

    if (listingError || !listing) {
      console.error("Erreur lors de la création de l'annonce:", listingError)
      return NextResponse.json(
        { success: false, error: "Erreur lors de la création de l'annonce" },
        { status: 500 }
      )
    }

    const listingId = listing.id

    // Uploader les images vers Supabase Storage
    const uploadedImageUrls: string[] = []
    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageData = images[i]
        
        // Convertir base64 en blob
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
          // Si le bucket n'existe pas, créer un message d'erreur plus clair
          if (uploadError.message?.includes("Bucket not found")) {
            console.error("Le bucket 'listings' n'existe pas dans Supabase Storage. Veuillez le créer dans le dashboard Supabase.")
          }
          continue // Continuer avec les autres images même si une échoue
        }

        // Obtenir l'URL publique de l'image
        const { data: urlData } = supabaseAdmin.storage
          .from("listings")
          .getPublicUrl(filePath)

        if (urlData?.publicUrl) {
          uploadedImageUrls.push(urlData.publicUrl)
        }
      }

      // Sauvegarder les URLs des images dans la base de données
      if (uploadedImageUrls.length > 0) {
        const imageRecords = uploadedImageUrls.map((url, index) => ({
          listing_id: listingId,
          image_url: url,
          display_order: index,
        }))

        const { error: imagesError } = await supabaseAdmin
          .from("listing_images")
          .insert(imageRecords)

        if (imagesError) {
          console.error("Erreur lors de la sauvegarde des images:", imagesError)
          // Ne pas échouer la création de l'annonce si les images échouent
        }
      }
    }

    return NextResponse.json({
      success: true,
      listingId,
      message: "Annonce créée avec succès",
    })
  } catch (error: any) {
    console.error("Erreur API createListing:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Erreur serveur" },
      { status: 500 }
    )
  }
}

