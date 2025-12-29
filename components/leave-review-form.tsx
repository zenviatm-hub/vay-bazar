"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LeaveReviewFormProps {
  reviewedUserId: number
  reviewedUserName: string
  listingId?: number
  listingTitle?: string
  onSuccess?: () => void
}

export function LeaveReviewForm({
  reviewedUserId,
  reviewedUserName,
  listingId,
  listingTitle,
  onSuccess,
}: LeaveReviewFormProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (rating === 0) {
      setError("Veuillez sélectionner une note")
      return
    }

    if (!comment.trim()) {
      setError("Veuillez écrire un commentaire")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewedUserId,
          listingId,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || "Erreur lors de la création de l'avis")
        setLoading(false)
        return
      }

      // Réinitialiser le formulaire
      setRating(0)
      setTitle("")
      setComment("")
      setIsOpen(false)
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error: any) {
      console.error("Erreur lors de la création de l'avis:", error)
      setError("Une erreur est survenue")
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
        Laisser un avis
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Laisser un avis pour {reviewedUserName}</DialogTitle>
            <DialogDescription>
              {listingTitle ? `À propos de l'annonce : ${listingTitle}` : "Partagez votre expérience avec cet utilisateur"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
            )}

            <div className="space-y-2">
              <Label>Note *</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-title">Titre (optionnel)</Label>
              <Input
                id="review-title"
                placeholder="Ex: Excellent vendeur, transaction rapide..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-comment">
                Commentaire * <span className="text-muted-foreground">({comment.length}/500)</span>
              </Label>
              <Textarea
                id="review-comment"
                placeholder="Décrivez votre expérience avec cet utilisateur..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                maxLength={500}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading || rating === 0 || !comment.trim()}>
                {loading ? "Publication..." : "Publier l'avis"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
