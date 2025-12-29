import { Star, ShieldCheck } from "lucide-react"
import type { Review } from "@/lib/reviews"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.reviewerName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?"

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={review.reviewerAvatar} />
          <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">{review.reviewerName || "Utilisateur"}</p>
                {review.isVerified && (
                  <Badge variant="secondary" className="h-4 gap-1 px-1.5 text-xs">
                    <ShieldCheck className="h-3 w-3" />
                    Vérifié
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
              ))}
            </div>
          </div>
          {review.title && <p className="mb-1 font-medium text-foreground">{review.title}</p>}
          {review.listingTitle && (
            <p className="mb-2 text-xs text-muted-foreground">Annonce : {review.listingTitle}</p>
          )}
          {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
        </div>
      </div>
    </Card>
  )
}
