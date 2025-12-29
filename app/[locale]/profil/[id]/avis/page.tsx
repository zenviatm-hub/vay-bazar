import { notFound } from "next/navigation"
import { Link } from "@/lib/navigation"
import { HeaderClient } from "@/components/header-client"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import { getReviews, getUserStats } from "@/lib/reviews"
import { ReviewCard } from "@/components/review-card"

export default async function UserReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations("userReviews")
  const { id } = await params
  const userId = Number.parseInt(id)
  
  const stats = await getUserStats(userId)
  const userReviews = await getReviews(userId)

  return (
    <div className="min-h-screen bg-background">
      <HeaderClient />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href={`/profil/${userId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToProfile")}
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-foreground">{t("title")}</h1>
          <div className="flex items-center gap-6 rounded-lg border bg-card p-6">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-foreground">
                {stats.totalReviews > 0 ? stats.averageRating.toFixed(1) : "0.0"}
              </div>
              <div className="mb-2 flex justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(stats.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{t("reviewsCount", { count: stats.totalReviews })}</p>
            </div>
            <div className="h-16 w-px bg-border" />
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = userReviews.filter((r) => r.rating === rating).length
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="w-8 text-sm text-muted-foreground">{rating} ★</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="w-8 text-right text-sm text-muted-foreground">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {userReviews.length === 0 ? (
            <div className="rounded-lg border bg-card p-12 text-center">
              <Star className="mx-auto mb-4 h-12 w-12 text-muted" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">{t("noReviews.title")}</h3>
              <p className="text-muted-foreground">{t("noReviews.description")}</p>
            </div>
          ) : (
            userReviews.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </div>
      </div>
    </div>
  )
}
