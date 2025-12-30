import { Suspense } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { AboutContentClient } from "./about-content-client"

// Forcer le rendu dynamique et empêcher le pré-rendu statique
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamicParams = true
export const runtime = 'nodejs'

// Empêcher le pré-rendu statique
noStore()

function AboutContent() {
  return <AboutContentClient />
}

export default function AboutPage() {
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
      <AboutContent />
    </Suspense>
  )
}
