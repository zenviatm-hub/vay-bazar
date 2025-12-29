import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageButton } from "@/components/message-button"
import { FavoriteButton } from "@/components/favorite-button"
import { getListings, getCategories } from "@/lib/data-store"
import { getCurrentUser } from "@/lib/auth"
import {
  MapPin,
  Clock,
  Eye,
  Heart,
  Share2,
  Flag,
  Phone,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Wrench,
} from "lucide-react"

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listingId = parseInt(id, 10)
  
  if (isNaN(listingId)) {
    notFound()
  }
  
  const [listings, categories] = await Promise.all([getListings(), getCategories()])
  const listing = listings.find((l) => l.id === listingId)

  if (!listing) {
    notFound()
  }

  const user = await getCurrentUser()
  const isOwner = user?.id === listing.userId
  const category = categories.find((cat) => cat.id === listing.categoryId)
  const isSadaqa = category?.specialType === "sadaqa"
  const isTransport = category?.specialType === "transport"
  const isBtp = category?.specialType === "btp"

  const formatPrice = (price: number) => {
    if (price === 0) return isSadaqa ? "Gratuit (Don)" : "Prix non spécifié"
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const conditionLabels: Record<string, string> = {
    neuf: "Neuf",
    comme_neuf: "Comme neuf",
    bon_etat: "Bon état",
    usage_normal: "Usage normal",
    pour_pieces: "Pour pièces",
  }

  const whatsappNumber = listing.whatsappNumber || "+33612345678"
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Bonjour, je suis intéressé par votre annonce: ${listing.title}`)}`

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Accueil
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/annonces" className="hover:text-foreground">
            Annonces
          </Link>
          {category && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/annonces?category=${category.slug}`} className="hover:text-foreground">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{listing.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Colonne principale */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="mb-6 overflow-hidden rounded-xl border bg-card">
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={listing.images[0] || "/placeholder.svg?height=600&width=800"}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
              {listing.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-2">
                  {listing.images.slice(1).map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${listing.title} ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Titre et prix */}
            <div className="mb-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="mb-2 text-3xl font-bold leading-tight text-foreground">{listing.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(listing.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{listing.viewsCount} vues</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`mb-2 text-4xl font-bold ${isSadaqa ? "text-sadaqa" : "text-primary"}`}>
                    {formatPrice(listing.price)}
                  </div>
                  {listing.priceNegotiable && !isSadaqa && (
                    <Badge variant="secondary" className="text-xs">
                      Prix négociable
                    </Badge>
                  )}
                  {isSadaqa && <Badge className="bg-sadaqa text-sadaqa-foreground">Sadaqa (Don)</Badge>}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {category && (
                  <Badge variant="outline" className="gap-1">
                    {category.name}
                  </Badge>
                )}
                {listing.condition && (
                  <Badge variant="outline" className="gap-1">
                    {conditionLabels[listing.condition] || listing.condition}
                  </Badge>
                )}
              </div>
            </div>

            {isTransport && listing.departureCity && listing.arrivalCity && (
              <Card className="mb-6 border-blue-200 bg-blue-50/30">
                <CardContent className="p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                    Itinéraire
                  </h2>
                  <div className="flex items-center gap-4 text-lg">
                    <span className="font-semibold text-blue-900">{listing.departureCity}</span>
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">{listing.arrivalCity}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {isBtp && (listing.skills || listing.experience) && (
              <Card className="mb-6 border-orange-200 bg-orange-50/30">
                <CardContent className="p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                    <Wrench className="h-5 w-5 text-orange-600" />
                    Compétences et expérience
                  </h2>
                  {listing.skills && (
                    <div className="mb-3">
                      <p className="mb-2 text-sm font-medium text-muted-foreground">Compétences</p>
                      <div className="flex flex-wrap gap-2">
                        {listing.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-900">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {listing.experience && (
                    <div>
                      <p className="mb-1 text-sm font-medium text-muted-foreground">Expérience</p>
                      <p className="text-lg font-semibold text-orange-900">{listing.experience}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold text-foreground">Description</h2>
                <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{listing.description}</p>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <div className="flex flex-wrap gap-2">
              <FavoriteButton
                listingId={listing.id}
                variant="outline"
                size="sm"
                showText={true}
              />
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Partager
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="mr-2 h-4 w-4" />
                Signaler
              </Button>
            </div>
          </div>

          {/* Colonne latérale - Vendeur */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Carte vendeur */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Vendeur</h2>
                  <Link href={`/profil/${listing.userId}`} className="mb-4 flex items-center gap-3 hover:opacity-80">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-medium text-primary">
                      {listing.userFirstName?.[0]}
                      {listing.userLastName?.[0]}
                    </div>
                    <div className="flex-1">
                      <p className="flex items-center gap-2 font-semibold text-foreground">
                        {listing.userFirstName} {listing.userLastName}
                        {listing.userId && listing.userId <= 3 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-verified-badge px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                            <ShieldCheck className="h-3 w-3" />
                            Amana
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">Membre de la communauté</p>
                    </div>
                  </Link>

                  <Separator className="my-4" />

                  {isOwner ? (
                    <div className="space-y-2">
                      <Button asChild className="w-full bg-transparent" variant="outline">
                        <Link href={`/annonces/${listing.id}/modifier`}>Modifier l&apos;annonce</Link>
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">C&apos;est votre annonce</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        asChild
                        className="w-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BA59] hover:shadow-xl"
                        size="lg"
                      >
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                          <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                          Contacter via WhatsApp
                        </a>
                      </Button>
                      <MessageButton
                        listingId={listing.id}
                        listingTitle={listing.title}
                        sellerId={listing.userId}
                        sellerName={`${listing.userFirstName} ${listing.userLastName}`}
                        currentUserId={user?.id}
                      />
                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <Link href={`tel:${whatsappNumber}`}>
                          <Phone className="mr-2 h-4 w-4" />
                          Appeler
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Conseils de sécurité */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Conseils de sécurité</h3>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Rencontrez-vous dans un lieu public</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Vérifiez l&apos;article avant de payer</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Ne payez jamais à l&apos;avance</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Signalez les comportements suspects</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
