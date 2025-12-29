"use server"

import { cookies } from "next/headers"
import bcrypt from "bcrypt"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Types
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  bio?: string
  location?: string
  createdAt: string
}

export interface AuthResponse {
  success: boolean
  error?: string
  user?: User
}

// Hash du mot de passe avec bcrypt
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Vérifier le mot de passe
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string,
  location?: string,
): Promise<AuthResponse> {
  try {
    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single()

    if (existingUser) {
      return { success: false, error: "Cet email est déjà utilisé" }
    }

    // Hasher le mot de passe
    const passwordHash = await hashPassword(password)

    // Créer l'utilisateur
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .insert({
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        phone,
        location,
        avatar_url: null,
        bio: "",
      })
      .select()
      .single()

    if (error || !user) {
      return { success: false, error: "Erreur lors de la création du compte" }
    }

    // Créer une session
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 jours

    const { data: session, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .insert({
        user_id: user.id,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (sessionError || !session) {
      return { success: false, error: "Erreur lors de la création de la session" }
    }

    // Définir le cookie
    const cookieStore = await cookies()
    cookieStore.set("session", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        location: user.location,
        createdAt: user.created_at,
      },
    }
  } catch (error) {
    console.error("SignUp error:", error)
    return { success: false, error: "Une erreur est survenue" }
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    // Récupérer l'utilisateur
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (error || !user) {
      return { success: false, error: "Email ou mot de passe incorrect" }
    }

    // Vérifier le mot de passe
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return { success: false, error: "Email ou mot de passe incorrect" }
    }

    // Créer une session
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 jours

    const { data: session, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .insert({
        user_id: user.id,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (sessionError || !session) {
      return { success: false, error: "Erreur lors de la création de la session" }
    }

    // Définir le cookie
    const cookieStore = await cookies()
    cookieStore.set("session", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        location: user.location,
        createdAt: user.created_at,
      },
    }
  } catch (error) {
    console.error("SignIn error:", error)
    return { success: false, error: "Une erreur est survenue" }
  }
}

export async function signOut(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session")?.value

    if (sessionId) {
      // Supprimer la session de la base de données
      await supabaseAdmin.from("sessions").delete().eq("id", sessionId)
      cookieStore.delete("session")
    }
  } catch (error) {
    console.error("SignOut error:", error)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session")?.value

    if (!sessionId) return null

    // Récupérer la session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select("user_id, expires_at")
      .eq("id", sessionId)
      .single()

    if (sessionError || !session) return null

    // Vérifier si la session a expiré
    if (new Date(session.expires_at) < new Date()) {
      // Supprimer la session expirée
      await supabaseAdmin.from("sessions").delete().eq("id", sessionId)
      return null
    }

    // Récupérer l'utilisateur
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", session.user_id)
      .single()

    if (userError || !user) return null

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      location: user.location,
      createdAt: user.created_at,
    }
  } catch (error) {
    console.error("GetCurrentUser error:", error)
    return null
  }
}

export async function updateProfile(
  firstName: string,
  lastName: string,
  phone?: string,
  location?: string,
  bio?: string,
  avatarUrl?: string,
): Promise<AuthResponse> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Vous devez être connecté" }
    }

    const { data: updatedUser, error } = await supabaseAdmin
      .from("users")
      .update({
        first_name: firstName,
        last_name: lastName,
        phone,
        location,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error || !updatedUser) {
      return { success: false, error: "Erreur lors de la mise à jour du profil" }
    }

    return {
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        phone: updatedUser.phone,
        avatarUrl: updatedUser.avatar_url,
        bio: updatedUser.bio,
        location: updatedUser.location,
        createdAt: updatedUser.created_at,
      },
    }
  } catch (error) {
    console.error("UpdateProfile error:", error)
    return { success: false, error: "Une erreur est survenue" }
  }
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Vous devez être connecté" }
    }

    // Récupérer l'utilisateur avec le hash du mot de passe
    const { data: userWithHash, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("password_hash")
      .eq("id", user.id)
      .single()

    if (fetchError || !userWithHash) {
      return { success: false, error: "Utilisateur non trouvé" }
    }

    // Vérifier le mot de passe actuel
    const isValid = await verifyPassword(currentPassword, userWithHash.password_hash)
    if (!isValid) {
      return { success: false, error: "Mot de passe actuel incorrect" }
    }

    // Hasher le nouveau mot de passe
    const newPasswordHash = await hashPassword(newPassword)

    // Mettre à jour le mot de passe
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (updateError || !updatedUser) {
      return { success: false, error: "Erreur lors de la mise à jour du mot de passe" }
    }

    return {
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        phone: updatedUser.phone,
        avatarUrl: updatedUser.avatar_url,
        bio: updatedUser.bio,
        location: updatedUser.location,
        createdAt: updatedUser.created_at,
      },
    }
  } catch (error) {
    console.error("UpdatePassword error:", error)
    return { success: false, error: "Une erreur est survenue" }
  }
}
