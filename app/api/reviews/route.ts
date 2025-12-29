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
    const { reviewedUserId, listingId, rating, title, comment } = body

    // Validation
    if (!reviewedUserId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Données invalides" },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur ne s'évalue pas lui-même
    if (user.id === reviewedUserId) {
      return NextResponse.json(
        { success: false, error: "Vous ne pouvez pas vous évaluer vous-même" },
        { status: 400 }
      )
    }

    // Vérifier si un avis existe déjà pour cette transaction
    if (listingId) {
      const { data: existing } = await supabaseAdmin
        .from("reviews")
        .select("id")
        .eq("reviewer_id", user.id)
        .eq("reviewed_user_id", reviewedUserId)
        .eq("listing_id", listingId)
        .single()

      if (existing) {
        return NextResponse.json(
          { success: false, error: "Vous avez déjà laissé un avis pour cette transaction" },
          { status: 400 }
        )
      }
    }

    // Créer l'avis
    const { data: review, error } = await supabaseAdmin
      .from("reviews")
      .insert({
        reviewer_id: user.id,
        reviewed_user_id: reviewedUserId,
        listing_id: listingId || null,
        rating,
        title: title?.trim() || null,
        comment: comment?.trim() || null,
        is_verified: false,
      })
      .select("id")
      .single()

    if (error || !review) {
      console.error("Erreur lors de la création de l'avis:", error)
      return NextResponse.json(
        { success: false, error: "Erreur lors de la création de l'avis" },
        { status: 500 }
      )
    }

    // Vérifier et attribuer des badges automatiquement
    await checkAndAssignBadges(reviewedUserId)

    return NextResponse.json({
      success: true,
      reviewId: review.id,
      message: "Avis créé avec succès",
    })
  } catch (error: any) {
    console.error("Erreur API createReview:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Erreur serveur" },
      { status: 500 }
    )
  }
}

// Fonction pour vérifier et attribuer des badges automatiquement
async function checkAndAssignBadges(userId: number) {
  try {
    // Compter les avis positifs (4-5 étoiles)
    const { count: positiveReviews } = await supabaseAdmin
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("reviewed_user_id", userId)
      .gte("rating", 4)

    // Compter le total des avis
    const { count: totalReviews } = await supabaseAdmin
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("reviewed_user_id", userId)

    // Compter les annonces vendues
    const { count: soldListings } = await supabaseAdmin
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "sold")

    // Badge "Fiable" : 10+ avis positifs
    if (positiveReviews && positiveReviews >= 10) {
      await supabaseAdmin
        .from("badges")
        .upsert(
          {
            user_id: userId,
            badge_type: "trusted",
          },
          { onConflict: "user_id,badge_type" }
        )
    }

    // Badge "Top Vendeur" : 5+ annonces vendues
    if (soldListings && soldListings >= 5) {
      await supabaseAdmin
        .from("badges")
        .upsert(
          {
            user_id: userId,
            badge_type: "top_seller",
          },
          { onConflict: "user_id,badge_type" }
        )
    }

    // Badge "Actif" : 3+ annonces actives
    const { count: activeListings } = await supabaseAdmin
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "active")

    if (activeListings && activeListings >= 3) {
      await supabaseAdmin
        .from("badges")
        .upsert(
          {
            user_id: userId,
            badge_type: "active",
          },
          { onConflict: "user_id,badge_type" }
        )
    }
  } catch (error) {
    console.error("Erreur lors de l'attribution des badges:", error)
  }
}



