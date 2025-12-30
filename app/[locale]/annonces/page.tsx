import { unstable_noStore as noStore } from "next/cache"
import { AnnoncesContentClient } from "./annonces-content-client"

// Forcer le rendu dynamique et empêcher le pré-rendu statique
export const dynamic = 'error'
export const revalidate = 0
export const dynamicParams = true
export const runtime = 'nodejs'

// Empêcher le pré-rendu statique
noStore()

export default function AnnoncesPage() {
  return <AnnoncesContentClient />
}
