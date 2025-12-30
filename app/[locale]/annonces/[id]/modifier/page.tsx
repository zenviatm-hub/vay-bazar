import { notFound } from "next/navigation"
import { Suspense } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { getListings, getCategories } from "@/lib/data-store"
import { getCurrentUser } from "@/lib/auth"
import { EditListingClient } from "./edit-listing-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamicParams = true
export const runtime = 'nodejs'

noStore()

async function EditListingContent({ listingId }: { listingId: number }) {
  const user = await getCurrentUser()
  if (!user) {
    notFound()
  }

  const [listings, categories] = await Promise.all([getListings(), getCategories()])
  const listing = listings.find((l) => l.id === listingId)

  if (!listing) {
    notFound()
  }

  // Vérifier que l'utilisateur est le propriétaire de l'annonce
  if (listing.userId !== user.id) {
    notFound()
  }

  // Charger les données supplémentaires si nécessaire
  // Pour l'instant, on utilise les données de base
  // Si departureCity, arrivalCity, skills, experience, whatsappNumber sont dans d'autres tables,
  // il faudra les charger ici

  return <EditListingClient listing={listing} />
}

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listingId = parseInt(id, 10)

  if (isNaN(listingId)) {
    notFound()
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    }>
      <EditListingContent listingId={listingId} />
    </Suspense>
  )
}

