"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "@/components/favorite-button"
import type { Listing } from "@/lib/data-store"
import { cn } from "@/lib/utils"

interface ListingCardProps {
  listing: Listing
  showFavorite?: boolean
  initialIsFavorite?: boolean
}

export function ListingCard({ listing, showFavorite = true, initialIsFavorite = false }: ListingCardProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return "Gratuit"
    if (!price || isNaN(price)) {
      return "Prix non disponible"
    }
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "Date invalide"
    }
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Hier"
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  }

  const imageUrl = listing.images[0] || "/placeholder.svg?height=200&width=300"

  const isSadaqa =
    listing.categoryName?.toLowerCase().includes("sadaqa") || listing.categoryName?.toLowerCase().includes("don")

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:-translate-y-2",
        isSadaqa
          ? "border-sadaqa/40 bg-gradient-to-br from-sadaqa/5 to-transparent"
          : "border-transparent bg-card",
      )}
      style={{
        boxShadow: isSadaqa 
          ? '0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.04)'
          : '0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
      onMouseEnter={(e) => {
        if (!isSadaqa) {
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.04), 0 12px 32px rgba(0, 0, 0, 0.1)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSadaqa) {
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.04)'
        }
      }}
    >
      <Link href={`/annonces/${listing.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={listing.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {showFavorite && (
            <div className="absolute right-3 top-3 transition-all duration-300 group-hover:scale-110">
              <FavoriteButton
                listingId={listing.id}
                initialIsFavorite={initialIsFavorite}
                variant="ghost"
                size="icon"
                className="bg-white/80 backdrop-blur-[12px] border border-white/30 rounded-full"
              />
            </div>
          )}

          {isSadaqa && (
            <Badge className="absolute left-3 top-3 gradient-sadaqa border-0 text-white shadow-lg">
              🎁 Sadaqa (Don)
            </Badge>
          )}
          {listing.priceNegotiable && !isSadaqa && (
            <Badge className="absolute left-3 top-3 gradient-accent border-0 text-white shadow-lg">💬 Négociable</Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-5">
        <Link href={`/annonces/${listing.id}`}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 flex-1 text-[16px] font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
              {listing.title}
            </h3>
            <span
              className={cn(
                "shrink-0 text-xl font-extrabold tracking-tight",
                isSadaqa ? "text-sadaqa" : "text-primary",
              )}
            >
              {formatPrice(listing.price)}
            </span>
          </div>

          <div className="mb-4 flex items-center gap-3 text-[13px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary/60" />
              <span className="font-medium">{listing.location}</span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground/60" />
              <span>{formatDate(listing.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-bold text-white shadow-sm">
              {(listing.userFirstName?.[0] || '') + (listing.userLastName?.[0] || '') || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className="truncate">
                  {listing.userFirstName} {listing.userLastName}
                </span>
                {listing.userId && listing.userId <= 3 && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-verified-badge px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                    <ShieldCheck className="h-3 w-3" />
                    Amana
                  </span>
                )}
              </p>
            </div>
            {listing.categoryName && (
              <Badge variant="secondary" className="shrink-0 rounded-lg text-xs font-semibold">
                {listing.categoryName}
              </Badge>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
