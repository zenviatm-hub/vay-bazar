import { HeaderClient } from "@/components/header-client"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { getListings } from "@/lib/data-store"
import { Plus } from "lucide-react"
import { Link } from "@/lib/navigation"
import { redirect } from "@/lib/navigation"
import { getTranslations } from "next-intl/server"
import { MyListingsClient } from "./my-listings-client"

export const dynamic = 'force-dynamic'

export default async function MyListingsPage() {
  const t = await getTranslations("myListings")
  const user = await getCurrentUser()

  if (!user) {
    redirect("/connexion")
  }

  // Charger les annonces de l'utilisateur depuis Supabase
  const myListings = await getListings({ userId: user.id })

  return (
    <div className="min-h-screen bg-background">
      <HeaderClient />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Button asChild>
            <Link href="/annonces/nouvelle">
              <Plus className="mr-2 h-4 w-4" />
              {t("newListing")}
            </Link>
          </Button>
        </div>

        <MyListingsClient initialListings={myListings} />
      </div>
    </div>
  )
}
