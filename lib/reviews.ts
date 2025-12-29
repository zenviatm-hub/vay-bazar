import { supabase } from "@/lib/supabase"

export interface Review {
  id: number
  reviewerId: number
  reviewedUserId: number
  listingId?: number
  rating: number // 1-5
  title?: string
  comment?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
  reviewerName?: string
  reviewerAvatar?: string
  listingTitle?: string
}

export interface Badge {
  id: number
  userId: number
  badgeType: "verified" | "trusted" | "top_seller" | "helpful" | "active"
  earnedAt: string
}

export interface UserStats {
  totalReviews: number
  averageRating: number
  badges: Badge[]
}

// Charger les avis d'un utilisateur
export async function getReviews(userId: number): Promise<Review[]> {
  try {
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("reviewed_user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erreur lors du chargement des avis:", error)
      return []
    }

    if (!reviews || reviews.length === 0) {
      return []
    }

    // Charger les informations des reviewers et listings
    const reviewsWithDetails = await Promise.all(
      reviews.map(async (review) => {
        // Charger le reviewer
        const { data: reviewer } = await supabase
          .from("users")
          .select("first_name, last_name, avatar_url")
          .eq("id", review.reviewer_id)
          .single()

        // Charger le listing si présent
        let listingTitle: string | undefined
        if (review.listing_id) {
          const { data: listing } = await supabase
            .from("listings")
            .select("title")
            .eq("id", review.listing_id)
            .single()
          listingTitle = listing?.title
        }

        return {
          id: review.id,
          reviewerId: review.reviewer_id,
          reviewedUserId: review.reviewed_user_id,
          listingId: review.listing_id || undefined,
          rating: review.rating,
          title: review.title || undefined,
          comment: review.comment || undefined,
          isVerified: review.is_verified || false,
          createdAt: review.created_at,
          updatedAt: review.updated_at,
          reviewerName: reviewer
            ? `${reviewer.first_name} ${reviewer.last_name}`
            : undefined,
          reviewerAvatar: reviewer?.avatar_url || undefined,
          listingTitle,
        }
      })
    )

    return reviewsWithDetails
  } catch (error) {
    console.error("Erreur getReviews:", error)
    return []
  }
}

// Charger les statistiques d'un utilisateur (avis + badges)
export async function getUserStats(userId: number): Promise<UserStats> {
  try {
    // Charger les avis
    const reviews = await getReviews(userId)

    // Calculer les statistiques
    const totalReviews = reviews.length
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0

    // Charger les badges
    const { data: badgesData, error: badgesError } = await supabase
      .from("badges")
      .select("*")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false })

    const badges: Badge[] =
      badgesData?.map((badge) => ({
        id: badge.id,
        userId: badge.user_id,
        badgeType: badge.badge_type as Badge["badgeType"],
        earnedAt: badge.earned_at,
      })) || []

    return {
      totalReviews,
      averageRating,
      badges,
    }
  } catch (error) {
    console.error("Erreur getUserStats:", error)
    return {
      totalReviews: 0,
      averageRating: 0,
      badges: [],
    }
  }
}

// Créer un avis
export async function createReview(
  reviewedUserId: number,
  listingId: number | undefined,
  rating: number,
  title?: string,
  comment?: string
): Promise<{ success: boolean; error?: string; reviewId?: number }> {
  try {
    // Vérifier que l'utilisateur est connecté (sera fait côté serveur)
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        reviewed_user_id: reviewedUserId,
        listing_id: listingId || null,
        rating,
        title: title?.trim() || null,
        comment: comment?.trim() || null,
        is_verified: false, // Pourra être vérifié plus tard si transaction confirmée
      })
      .select("id")
      .single()

    if (error) {
      console.error("Erreur lors de la création de l'avis:", error)
      return { success: false, error: error.message }
    }

    return { success: true, reviewId: data.id }
  } catch (error: any) {
    console.error("Erreur createReview:", error)
    return { success: false, error: error.message }
  }
}

// Attribuer un badge automatiquement (côté serveur)
export async function assignBadge(
  userId: number,
  badgeType: Badge["badgeType"]
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("badges").insert({
      user_id: userId,
      badge_type: badgeType,
    })

    if (error) {
      // Si le badge existe déjà, ce n'est pas une erreur
      if (error.code === "23505") {
        return { success: true }
      }
      console.error("Erreur lors de l'attribution du badge:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Erreur assignBadge:", error)
    return { success: false, error: error.message }
  }
}

