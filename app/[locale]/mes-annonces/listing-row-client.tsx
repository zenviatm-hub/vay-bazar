"use client"

import { useState } from "react"
import { Link } from "@/lib/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreVertical, Edit, Eye, EyeOff, MapPin, Clock } from "lucide-react"
import Image from "next/image"
import { DeleteListingButton } from "./delete-listing-button"
import type { Listing } from "@/lib/data-store"

interface ListingRowClientProps {
  listing: Listing
  onDeleted?: (listingId: number) => void
}

export function ListingRowClient({ listing, onDeleted }: ListingRowClientProps) {
  const t = useTranslations("myListings")

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

  return (
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
                    <DeleteListingButton
                      listingId={listing.id}
                      listingTitle={listing.title}
                      onDeleted={(deletedId) => onDeleted?.(deletedId)}
                    />
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
}

