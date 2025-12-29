import { supabase } from "@/lib/supabase"

export interface Conversation {
  id: number
  listingId: number
  listingTitle: string
  listingImage?: string
  otherUser: {
    id: number
    name: string
    avatar?: string
  }
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
}

export interface Message {
  id: number
  conversationId: number
  senderId: number
  content: string
  createdAt: Date
  isRead: boolean
}

// Charger les conversations de l'utilisateur connecté
export async function getConversations(userId: number): Promise<Conversation[]> {
  try {
    // Récupérer les conversations où l'utilisateur est acheteur ou vendeur
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("last_message_at", { ascending: false })

    if (error) {
      console.error("Erreur lors du chargement des conversations:", error)
      return []
    }

    if (!conversations || conversations.length === 0) {
      return []
    }

    // Récupérer les détails pour chaque conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        // Récupérer l'annonce
        const { data: listing } = await supabase
          .from("listings")
          .select("id, title")
          .eq("id", conv.listing_id)
          .single()

        // Déterminer l'ID de l'autre utilisateur
        const otherUserId = conv.buyer_id === userId ? conv.seller_id : conv.buyer_id

        // Récupérer les informations de l'autre utilisateur
        const { data: otherUser } = await supabase
          .from("users")
          .select("id, first_name, last_name, avatar_url")
          .eq("id", otherUserId)
          .single()

        // Récupérer la première image de l'annonce
        const { data: listingImages } = await supabase
          .from("listing_images")
          .select("image_url")
          .eq("listing_id", conv.listing_id)
          .order("display_order", { ascending: true })
          .limit(1)

        // Récupérer le dernier message
        const { data: lastMessage } = await supabase
          .from("messages")
          .select("content, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        // Compter les messages non lus
        const { count: unreadCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("is_read", false)
          .neq("sender_id", userId)

        return {
          id: conv.id,
          listingId: conv.listing_id,
          listingTitle: listing?.title || "",
          listingImage: listingImages?.[0]?.image_url || undefined,
          otherUser: {
            id: otherUser?.id || 0,
            name: `${otherUser?.first_name || ""} ${otherUser?.last_name || ""}`.trim() || "Utilisateur",
            avatar: otherUser?.avatar_url || undefined,
          },
          lastMessage: lastMessage?.content || undefined,
          lastMessageTime: lastMessage?.created_at ? new Date(lastMessage.created_at) : new Date(conv.last_message_at),
          unreadCount: unreadCount || 0,
        }
      })
    )

    return conversationsWithDetails
  } catch (error) {
    console.error("Erreur getConversations:", error)
    return []
  }
}

// Charger les messages d'une conversation
export async function getMessages(conversationId: number): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Erreur lors du chargement des messages:", error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    return data.map((msg) => ({
      id: msg.id,
      conversationId: msg.conversation_id,
      senderId: msg.sender_id,
      content: msg.content,
      createdAt: new Date(msg.created_at),
      isRead: msg.is_read || false,
    }))
  } catch (error) {
    console.error("Erreur getMessages:", error)
    return []
  }
}

// Envoyer un message
export async function sendMessage(
  conversationId: number,
  senderId: number,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: content.trim(),
      is_read: false,
    })

    if (error) {
      console.error("Erreur lors de l'envoi du message:", error)
      return { success: false, error: error.message }
    }

    // Mettre à jour last_message_at de la conversation
    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId)

    return { success: true }
  } catch (error: any) {
    console.error("Erreur sendMessage:", error)
    return { success: false, error: error.message }
  }
}

// Créer ou récupérer une conversation
export async function getOrCreateConversation(
  listingId: number,
  buyerId: number,
  sellerId: number
): Promise<{ success: boolean; conversationId?: number; error?: string }> {
  try {
    // Vérifier si une conversation existe déjà
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("listing_id", listingId)
      .eq("buyer_id", buyerId)
      .eq("seller_id", sellerId)
      .single()

    if (existing) {
      return { success: true, conversationId: existing.id }
    }

    // Créer une nouvelle conversation
    const { data: newConversation, error } = await supabase
      .from("conversations")
      .insert({
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Erreur lors de la création de la conversation:", error)
      return { success: false, error: error.message }
    }

    return { success: true, conversationId: newConversation.id }
  } catch (error: any) {
    console.error("Erreur getOrCreateConversation:", error)
    return { success: false, error: error.message }
  }
}

// Marquer les messages comme lus
export async function markMessagesAsRead(
  conversationId: number,
  userId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId)
      .eq("is_read", false)

    if (error) {
      console.error("Erreur lors du marquage des messages comme lus:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Erreur markMessagesAsRead:", error)
    return { success: false, error: error.message }
  }
}

