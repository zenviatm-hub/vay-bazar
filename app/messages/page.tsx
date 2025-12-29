"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { HeaderClient } from "@/components/header-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, MoreVertical, ArrowLeft, ImageIcon, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"
import { getConversations, getMessages, sendMessage, markMessagesAsRead, type Conversation, type Message } from "@/lib/messages"
import { getCurrentUser } from "@/lib/auth"

export default function MessagesPage() {
  const router = useRouter()
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  // Charger l'utilisateur connecté et les conversations
  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push("/connexion")
          return
        }

        setCurrentUserId(user.id)
        const conversationsData = await getConversations(user.id)
        setConversations(conversationsData)
        
        // Sélectionner la première conversation si disponible
        if (conversationsData.length > 0) {
          setSelectedConversation(conversationsData[0].id)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        router.push("/connexion")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router])

  // Charger les messages quand une conversation est sélectionnée
  useEffect(() => {
    async function loadMessages() {
      if (!selectedConversation || !currentUserId) return

      try {
        const messagesData = await getMessages(selectedConversation)
        setMessages(messagesData)
        
        // Marquer les messages comme lus
        await markMessagesAsRead(selectedConversation, currentUserId)
        
        // Mettre à jour le nombre de messages non lus dans la liste
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversation ? { ...conv, unreadCount: 0 } : conv
          )
        )
      } catch (error) {
        console.error("Erreur lors du chargement des messages:", error)
      }
    }
    loadMessages()
  }, [selectedConversation, currentUserId])

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedConv = conversations.find((c) => c.id === selectedConversation)
  const conversationMessages = messages

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConversation || !currentUserId || sending) return

    setSending(true)
    try {
      const result = await sendMessage(selectedConversation, currentUserId, messageText)
      if (result.success) {
        setMessageText("")
        // Recharger les messages
        const updatedMessages = await getMessages(selectedConversation)
        setMessages(updatedMessages)
        
        // Recharger les conversations pour mettre à jour le dernier message
        if (currentUserId) {
          const updatedConversations = await getConversations(currentUserId)
          setConversations(updatedConversations)
        }
      } else {
        console.error("Erreur lors de l'envoi:", result.error)
      }
    } catch (error) {
      console.error("Erreur handleSendMessage:", error)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 7 * 24) {
      return date.toLocaleDateString("fr-FR", { weekday: "short" })
    } else {
      return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <HeaderClient />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Chargement des messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <HeaderClient />

      <div className="container mx-auto flex flex-1 overflow-hidden px-4 py-4">
        <div className="flex w-full overflow-hidden rounded-xl border bg-card shadow-sm">
          {/* Liste des conversations */}
          <div className={cn("flex w-full flex-col border-r md:w-96", selectedConversation && "hidden md:flex")}>
            <div className="border-b p-4">
              <h1 className="mb-4 text-2xl font-bold text-foreground">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une conversation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={cn(
                        "mb-1 flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent",
                        selectedConversation === conv.id && "bg-accent",
                      )}
                    >
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarImage src={conv.otherUser.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{conv.otherUser.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span className="truncate font-semibold text-foreground">{conv.otherUser.name}</span>
                          {conv.lastMessageTime && (
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {formatTime(conv.lastMessageTime)}
                            </span>
                          )}
                        </div>
                        <p className="mb-1 truncate text-sm text-muted-foreground">{conv.listingTitle}</p>
                        <div className="flex items-center justify-between gap-2">
                          <p className="flex-1 truncate text-sm text-muted-foreground">{conv.lastMessage}</p>
                          {conv.unreadCount > 0 && (
                            <Badge className="h-5 min-w-5 shrink-0 px-1.5 text-xs">{conv.unreadCount}</Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">Aucune conversation trouvée</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Zone de conversation */}
          <div className={cn("flex flex-1 flex-col", !selectedConversation && "hidden md:flex")}>
            {selectedConv ? (
              <>
                {/* En-tête de conversation */}
                <div className="flex items-center gap-3 border-b p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConv.otherUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{selectedConv.otherUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="font-semibold text-foreground">{selectedConv.otherUser.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedConv.listingTitle}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>

                {/* Annonce liée */}
                <div className="border-b bg-muted/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={selectedConv.listingImage || "/placeholder.svg"}
                        alt={selectedConv.listingTitle}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{selectedConv.listingTitle}</p>
                      <p className="text-xs text-muted-foreground">Voir l&apos;annonce complète</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {conversationMessages.map((message) => {
                      const isOwn = message.senderId === (currentUserId || 0)
                      return (
                        <div key={message.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
                          <div className={cn("flex max-w-[70%] gap-2", isOwn && "flex-row-reverse")}>
                            {!isOwn && (
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={selectedConv.otherUser.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">{selectedConv.otherUser.name[0]}</AvatarFallback>
                              </Avatar>
                            )}
                            <div className="space-y-1">
                              <div
                                className={cn(
                                  "rounded-2xl px-4 py-2",
                                  isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                                )}
                              >
                                <p className="text-sm leading-relaxed">{message.content}</p>
                              </div>
                              <p className={cn("px-2 text-xs text-muted-foreground", isOwn && "text-right")}>
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>

                {/* Zone de saisie */}
                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <div className="flex flex-1 items-center gap-2 rounded-full border bg-background px-4 py-2">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Écrivez votre message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="border-0 p-0 focus-visible:ring-0"
                      />
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-full" disabled={sending || !messageText.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Sélectionnez une conversation</h3>
                  <p className="text-sm text-muted-foreground">Choisissez une conversation pour commencer à discuter</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
