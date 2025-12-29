import { Suspense } from "react"
import { Link } from "@/lib/navigation"
import { HeaderClient } from "@/components/header-client"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { LeaveReviewForm } from "@/components/leave-review-form"

export const dynamic = 'force-dynamic'

export default async function LeaveReviewPage() {
  const t = await getTranslations("leaveReview")
  
  return (
    <div className="min-h-screen bg-background">
      <HeaderClient />

      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/annonces">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("back")}
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>{t("loading")}</div>}>
              <LeaveReviewForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
