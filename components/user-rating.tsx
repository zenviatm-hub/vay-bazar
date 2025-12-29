import { Star } from "lucide-react"

interface UserRatingProps {
  rating: number
  totalReviews: number
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function UserRating({ rating, totalReviews, showText = true, size = "md" }: UserRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  if (totalReviews === 0) {
    return (
      <div className={`flex items-center gap-1 text-muted-foreground ${textSizeClasses[size]}`}>
        <Star className={sizeClasses[size]} />
        <span>Aucun avis</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1 ${textSizeClasses[size]}`}>
      <Star className={`${sizeClasses[size]} fill-accent text-accent`} />
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      {showText && <span className="text-muted-foreground">({totalReviews} avis)</span>}
    </div>
  )
}
