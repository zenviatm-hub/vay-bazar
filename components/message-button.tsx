"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle } from "lucide-react"

interface MessageButtonProps {
  listingId: number
  listingTitle: string
  sellerId: number
  sellerName: string
  currentUserId?: number
}

export function MessageButton({ listingId, listingTitle, sellerId, sellerName, currentUserId }: MessageButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUserId) return

    setLoading(true)

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          sellerId,
          message: message.trim(),
        }),
      })

      const data = await response.json()

      if (!data.success) {
        console.error("Erreur lors de l'envoi du message:", data.error)
        alert(data.error || "Erreur lors de l'envoi du message")
        setLoading(false)
        return
      }

      // Rediriger vers la page des messages avec la conversation
      router.push(`/messages`)
      setIsOpen(false)
    } catch (error) {
      console.error("Erreur handleSendMessage:", error)
      alert("Une erreur est survenue lors de l'envoi du message")
      setLoading(false)
    }
  }

  if (!currentUserId) {
    return (
      <Button asChild className="w-full">
        <a href="/connexion">
          <MessageCircle className="mr-2 h-4 w-4" />
          Se connecter pour contacter
        </a>
      </Button>
    )
  }

  if (currentUserId === sellerId) {
    return null
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <MessageCircle className="mr-2 h-4 w-4" />
        Envoyer un message
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contacter {sellerName}</DialogTitle>
            <DialogDescription>
              À propos de : <span className="font-medium text-foreground">{listingTitle}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder="Bonjour, je suis intéressé(e) par votre annonce..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
              Annuler
            </Button>
            <Button onClick={handleSendMessage} disabled={loading || !message.trim()}>
              {loading ? "Envoi..." : "Envoyer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
