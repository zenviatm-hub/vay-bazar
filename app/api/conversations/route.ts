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
    const { listingId, sellerId, message } = body

    // Validation
    if (!listingId || !sellerId || !message) {
      return NextResponse.json(
        { success: false, error: "Tous les champs sont requis" },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur ne contacte pas lui-même
    if (user.id === sellerId) {
      return NextResponse.json(
        { success: false, error: "Vous ne pouvez pas vous contacter vous-même" },
        { status: 400 }
      )
    }

    // Vérifier si une conversation existe déjà
    const { data: existing } = await supabaseAdmin
      .from("conversations")
      .select("id")
      .eq("listing_id", listingId)
      .eq("buyer_id", user.id)
      .eq("seller_id", sellerId)
      .single()

    let conversationId: number

    if (existing) {
      conversationId = existing.id
    } else {
      // Créer une nouvelle conversation
      const { data: newConversation, error: convError } = await supabaseAdmin
        .from("conversations")
        .insert({
          listing_id: listingId,
          buyer_id: user.id,
          seller_id: sellerId,
        })
        .select("id")
        .single()

      if (convError || !newConversation) {
        console.error("Erreur lors de la création de la conversation:", convError)
        return NextResponse.json(
          { success: false, error: "Erreur lors de la création de la conversation" },
          { status: 500 }
        )
      }

      conversationId = newConversation.id
    }

    // Envoyer le premier message
    const { error: messageError } = await supabaseAdmin.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: message.trim(),
      is_read: false,
    })

    if (messageError) {
      console.error("Erreur lors de l'envoi du message:", messageError)
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'envoi du message" },
        { status: 500 }
      )
    }

    // Mettre à jour last_message_at de la conversation
    await supabaseAdmin
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId)

    return NextResponse.json({
      success: true,
      conversationId,
      message: "Message envoyé avec succès",
    })
  } catch (error: any) {
    console.error("Erreur API createConversation:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Erreur serveur" },
      { status: 500 }
    )
  }
}

