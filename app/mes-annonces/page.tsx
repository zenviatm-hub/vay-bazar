import { Header } from "@/components/header"
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
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"

export default async function MyListingsPage() {
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
    if (price === 0) return "Prix non spécifié"
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

  const ListingRow = ({ listing }: { listing: (typeof listings)[0] }) => (
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
                        Voir l&apos;annonce
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/annonces/${listing.id}/modifier`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    {listing.status === "active" && (
                      <DropdownMenuItem>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Désactiver
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
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
                  {listing.viewsCount} vues
                </div>
              </div>
              <Badge variant={listing.status === "active" ? "default" : "secondary"} className="shrink-0">
                {listing.status === "active" && "Active"}
                {listing.status === "sold" && "Vendue"}
                {listing.status === "expired" && "Expirée"}
                {listing.status === "draft" && "Brouillon"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Mes annonces</h1>
            <p className="text-muted-foreground">Gérez vos annonces et suivez leurs performances</p>
          </div>
          <Button asChild>
            <Link href="/annonces/nouvelle">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle annonce
            </Link>
          </Button>
        </div>

        {/* Statistiques */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">{activeListings.length}</div>
              <p className="text-sm text-muted-foreground">Annonces actives</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">
                {myListings.reduce((sum, l) => sum + l.viewsCount, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Vues totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">{soldListings.length}</div>
              <p className="text-sm text-muted-foreground">Annonces vendues</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">{draftListings.length}</div>
              <p className="text-sm text-muted-foreground">Brouillons</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des annonces */}
        <Tabs defaultValue="active">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Actives ({activeListings.length})</TabsTrigger>
            <TabsTrigger value="sold">Vendues ({soldListings.length})</TabsTrigger>
            <TabsTrigger value="expired">Expirées ({expiredListings.length})</TabsTrigger>
            <TabsTrigger value="drafts">Brouillons ({draftListings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeListings.length > 0 ? (
              activeListings.map((listing) => <ListingRow key={listing.id} listing={listing} />)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="mb-4 text-lg text-muted-foreground">Aucune annonce active</p>
                  <Button asChild>
                    <Link href="/annonces/nouvelle">
                      <Plus className="mr-2 h-4 w-4" />
                      Créer votre première annonce
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
                  <p className="text-lg text-muted-foreground">Aucune annonce vendue</p>
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
                  <p className="text-lg text-muted-foreground">Aucune annonce expirée</p>
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
                  <p className="text-lg text-muted-foreground">Aucun brouillon</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
