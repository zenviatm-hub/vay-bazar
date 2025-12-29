import { getListings } from "@/lib/data-store"
import { ListingCard } from "@/components/listing-card"
import { getTranslations } from "next-intl/server"

export async function RecentListings() {
  const t = await getTranslations("home")
  // Charger les annonces depuis Supabase
  const listings = await getListings({ status: "active" })
  
  // Trier par date de création (plus récent en premier)
  const sortedListings = [...listings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{t("recentListings")}</h2>
        <p className="text-sm text-muted-foreground">{t("availableListingsSimple", { count: listings.length })}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedListings.slice(0, 8).map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  )
}
