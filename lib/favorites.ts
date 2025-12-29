"use server"

import { getCurrentUser } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function toggleFavorite(listingId: number): Promise<{ success: boolean; isFavorite: boolean }> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, isFavorite: false }
  }

  try {
    // Vérifier si le favori existe déjà
    const { data: existingFavorite } = await supabaseAdmin
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("listing_id", listingId)
      .single()

    if (existingFavorite) {
      // Supprimer le favori
      const { error } = await supabaseAdmin
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("listing_id", listingId)

      if (error) {
        return { success: false, isFavorite: true }
      }

      return { success: true, isFavorite: false }
    } else {
      // Ajouter le favori
      const { error } = await supabaseAdmin.from("favorites").insert({
        user_id: user.id,
        listing_id: listingId,
      })

      if (error) {
        return { success: false, isFavorite: false }
      }

      return { success: true, isFavorite: true }
    }
  } catch (error) {
    console.error("ToggleFavorite error:", error)
    return { success: false, isFavorite: false }
  }
}

export async function getFavorites(): Promise<number[]> {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  try {
    const { data: favorites, error } = await supabaseAdmin
      .from("favorites")
      .select("listing_id")
      .eq("user_id", user.id)

    if (error || !favorites) {
      return []
    }

    return favorites.map((f) => f.listing_id)
  } catch (error) {
    console.error("GetFavorites error:", error)
    return []
  }
}

export async function isFavorite(listingId: number): Promise<boolean> {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  try {
    const { data: favorite } = await supabaseAdmin
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("listing_id", listingId)
      .single()

    return !!favorite
  } catch (error) {
    return false
  }
}
