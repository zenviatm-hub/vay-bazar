import { Suspense } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { LeaveReviewForm } from "@/components/leave-review-form"

export default function LeaveReviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/annonces">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Laisser un avis</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Chargement...</div>}>
              <LeaveReviewForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
