import { notFound } from "next/navigation"
import { Link } from "@/lib/navigation"
import { HeaderClient } from "@/components/header-client"
import { getTranslations } from "next-intl/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getListings } from "@/lib/data-store"
import { getUserStats } from "@/lib/reviews"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { ListingCard } from "@/components/listing-card"
import { UserRating } from "@/components/user-rating"
import { UserBadges } from "@/components/user-badges"
import { LeaveReviewForm } from "@/components/leave-review-form"
import { getCurrentUser } from "@/lib/auth"
import { MapPin, Calendar, Package, TrendingUp, MessageSquare } from "lucide-react"

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations("userProfile")
  const { id } = await params
  const userId = Number.parseInt(id)

  // Charger l'utilisateur depuis Supabase
  const { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", userId)
    .single()

  if (userError || !user) {
    notFound()
  }

  const allListings = await getListings({ userId, status: "active" })
  const userListings = allListings
  const initials = `${user.first_name[0]}${user.last_name[0]}`
  const stats = await getUserStats(userId)
  const currentUser = await getCurrentUser()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    })
  }

  const userName = `${user.first_name} ${user.last_name}`

  return (
    <div className="min-h-screen bg-background">
      <HeaderClient />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-8 lg:grid-cols-3">
          {/* Profil utilisateur */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="mb-6 flex flex-col items-center text-center">
                  <Avatar className="mb-4 h-24 w-24">
                    <AvatarImage
                      src={user.avatar_url || "/placeholder.svg"}
                      alt={userName}
                    />
                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                  </Avatar>
                  <h1 className="mb-1 text-2xl font-bold text-foreground">{userName}</h1>
                  <Badge variant="secondary">{t("member")}</Badge>
                </div>

                <div className="mb-4 flex justify-center">
                  <UserRating rating={stats.averageRating} totalReviews={stats.totalReviews} size="md" />
                </div>
                {stats.totalReviews > 0 && (
                  <Button asChild variant="outline" size="sm" className="mb-4 w-full bg-transparent">
                    <Link href={`/profil/${userId}/avis`}>{t("viewAllReviews")}</Link>
                  </Button>
                )}
                {stats.badges.length > 0 && (
                  <div className="mb-4">
                    <UserBadges badges={stats.badges} />
                  </div>
                )}

                {/* Bouton pour laisser un avis (si l'utilisateur n'est pas le propriétaire) */}
                {currentUser && currentUser.id !== userId && (
                  <div className="mb-4">
                    <LeaveReviewForm
                      reviewedUserId={userId}
                      reviewedUserName={userName}
                    />
                  </div>
                )}

                <Separator className="my-6" />

                <div className="space-y-4">
                  {user.bio && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-foreground">{t("about")}</h3>
                      <p className="text-sm text-muted-foreground">{user.bio}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {user.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{t("memberSince", { date: formatDate(user.created_at) })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>{t("activeListings", { count: userListings.length })}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Annonces de l'utilisateur */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-bold text-foreground">{t("userListings", { name: user.first_name })}</h2>
              <p className="text-muted-foreground">
                {t("listingsCount", { count: userListings.length })}
              </p>
            </div>

            {userListings.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {userListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} showFavorite={false} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-lg text-muted-foreground">{t("noActiveListings")}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
