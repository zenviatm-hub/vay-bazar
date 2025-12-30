"use client"

import { useState, useEffect } from "react"
import { useRouter } from "@/lib/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "@/lib/navigation"
import { Plus } from "lucide-react"
import { ListingRowClient } from "./listing-row-client"
import type { Listing } from "@/lib/data-store"

interface MyListingsClientProps {
  initialListings: Listing[]
}

export function MyListingsClient({ initialListings }: MyListingsClientProps) {
  const t = useTranslations("myListings")
  const router = useRouter()
  const [listings, setListings] = useState(initialListings)

  // Recharger les annonces après suppression
  const handleListingDeleted = (deletedListingId: number) => {
    // Mettre à jour l'état local en retirant l'annonce supprimée immédiatement
    setListings((prevListings) => prevListings.filter((listing) => listing.id !== deletedListingId))
    
    // Recharger les données depuis le serveur pour synchroniser
    router.refresh()
  }

  // Filtrer les annonces par statut
  const activeListings = listings.filter((l) => l.status === "active")
  const soldListings = listings.filter((l) => l.status === "sold")
  const expiredListings = listings.filter((l) => l.status === "expired")
  const draftListings = listings.filter((l) => l.status === "draft")

  return (
    <>
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
              {listings.reduce((sum, l) => sum + l.viewsCount, 0)}
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
            activeListings.map((listing) => (
              <ListingRowClient key={listing.id} listing={listing} onDeleted={(id) => handleListingDeleted(id)} />
            ))
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
            soldListings.map((listing) => (
              <ListingRowClient key={listing.id} listing={listing} onDeleted={(id) => handleListingDeleted(id)} />
            ))
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
            expiredListings.map((listing) => (
              <ListingRowClient key={listing.id} listing={listing} onDeleted={(id) => handleListingDeleted(id)} />
            ))
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
            draftListings.map((listing) => (
              <ListingRowClient key={listing.id} listing={listing} onDeleted={(id) => handleListingDeleted(id)} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-lg text-muted-foreground">{t("empty.drafts")}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}

