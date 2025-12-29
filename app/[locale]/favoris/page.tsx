import { redirect } from "@/lib/navigation"
import { HeaderClient } from "@/components/header-client"
import { ListingCard } from "@/components/listing-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { getFavorites } from "@/lib/favorites"
import { getListings } from "@/lib/data-store"
import { Heart } from "lucide-react"
import { Link } from "@/lib/navigation"
import { getTranslations } from "next-intl/server"

export const dynamic = 'force-dynamic'

export default async function FavoritesPage() {
  const t = await getTranslations("favorites")
  const user = await getCurrentUser()

  if (!user) {
    redirect("/connexion")
  }

  const [favoriteIds, allListings] = await Promise.all([getFavorites(), getListings({ status: "active" })])
  const favoriteListings = allListings.filter((listing) => favoriteIds.includes(listing.id))

  return (
    <div className="min-h-screen bg-background">
      <HeaderClient />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("count", { count: favoriteListings.length })}
          </p>
        </div>

        {favoriteListings.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} showFavorite={true} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">{t("emptyTitle")}</h2>
              <p className="mb-6 text-muted-foreground">
                {t("emptyDescription")}
              </p>
              <Button asChild>
                <Link href="/annonces">{t("browseListings")}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
