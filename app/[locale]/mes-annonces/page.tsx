import { HeaderClient } from "@/components/header-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getCurrentUser } from "@/lib/auth"
import { getListings } from "@/lib/data-store"
import { Plus, MoreVertical, Edit, Trash2, Eye, EyeOff, MapPin, Clock } from "lucide-react"
import { Link } from "@/lib/navigation"
import Image from "next/image"
import { redirect } from "@/lib/navigation"
import { getTranslations } from "next-intl/server"

export default async function MyListingsPage() {
  const t = await getTranslations("myListings")
  const user = await getCurrentUser()

  if (!user) {
    redirect("/connexion")
  }

  // Charger les annonces de l'utilisateur depuis Supabase
  const allListings = await getListings({ userId: user.id })
  const myListings = allListings
  const activeListings = myListings.filter((l) => l.status === "active")
  const soldListings = myListings.filter((l) => l.status === "sold")
  const expiredListings = myListings.filter((l) => l.status === "expired")
  const draftListings = myListings.filter((l) => l.status === "draft")

  const formatPrice = (price: number) => {
    if (price === 0) return t("price.notSpecified")
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  }

  const ListingRow = ({ listing }: { listing: (typeof myListings)[0] }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Link href={`/annonces/${listing.id}`} className="shrink-0">
            <div className="relative h-24 w-32 overflow-hidden rounded-lg bg-muted">
              <Image
                src={listing.images[0] || "/placeholder.svg?height=100&width=150"}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
          </Link>

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="mb-1 flex items-start justify-between gap-2">
                <Link href={`/annonces/${listing.id}`}>
                  <h3 className="line-clamp-1 font-semibold text-foreground hover:text-primary">{listing.title}</h3>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/annonces/${listing.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t("actions.view")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/annonces/${listing.id}/modifier`}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t("actions.edit")}
                      </Link>
                    </DropdownMenuItem>
                    {listing.status === "active" && (
                      <DropdownMenuItem>
                        <EyeOff className="mr-2 h-4 w-4" />
                        {t("actions.deactivate")}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("actions.delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{listing.description}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="font-semibold text-primary">{formatPrice(listing.price)}</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {listing.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(listing.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {t("views", { count: listing.viewsCount })}
                </div>
              </div>
              <Badge variant={listing.status === "active" ? "default" : "secondary"} className="shrink-0">
                {listing.status === "active" && t("status.active")}
                {listing.status === "sold" && t("status.sold")}
                {listing.status === "expired" && t("status.expired")}
                {listing.status === "draft" && t("status.draft")}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

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

        {/* Statistiques */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">{activeListings.length}</div>
              <p className="text-sm text-muted-foreground">{t("stats.active")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">
                {myListings.reduce((sum, l) => sum + l.viewsCount, 0)}
              </div>
              <p className="text-sm text-muted-foreground">{t("stats.totalViews")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">{soldListings.length}</div>
              <p className="text-sm text-muted-foreground">{t("stats.sold")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">{draftListings.length}</div>
              <p className="text-sm text-muted-foreground">{t("stats.drafts")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des annonces */}
        <Tabs defaultValue="active">
          <TabsList className="mb-6">
            <TabsTrigger value="active">{t("tabs.active", { count: activeListings.length })}</TabsTrigger>
            <TabsTrigger value="sold">{t("tabs.sold", { count: soldListings.length })}</TabsTrigger>
            <TabsTrigger value="expired">{t("tabs.expired", { count: expiredListings.length })}</TabsTrigger>
            <TabsTrigger value="drafts">{t("tabs.drafts", { count: draftListings.length })}</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeListings.length > 0 ? (
              activeListings.map((listing) => <ListingRow key={listing.id} listing={listing} />)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="mb-4 text-lg text-muted-foreground">{t("empty.active")}</p>
                  <Button asChild>
                    <Link href="/annonces/nouvelle">
                      <Plus className="mr-2 h-4 w-4" />
                      {t("empty.createFirst")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sold" className="space-y-4">
            {soldListings.length > 0 ? (
              soldListings.map((listing) => <ListingRow key={listing.id} listing={listing} />)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-lg text-muted-foreground">{t("empty.sold")}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="expired" className="space-y-4">
            {expiredListings.length > 0 ? (
              expiredListings.map((listing) => <ListingRow key={listing.id} listing={listing} />)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-lg text-muted-foreground">{t("empty.expired")}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            {draftListings.length > 0 ? (
              draftListings.map((listing) => <ListingRow key={listing.id} listing={listing} />)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-lg text-muted-foreground">{t("empty.drafts")}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
