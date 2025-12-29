import { Link } from "@/lib/navigation"
import { HeaderClient } from "@/components/header-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Shield, Users, Eye, AlertTriangle, Phone } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function SafetyTipsPage() {
  const t = await getTranslations("safetyTips")

  const tips = [
    {
      icon: Users,
      title: t("tips.meetPublic.title"),
      description: t("tips.meetPublic.description"),
    },
    {
      icon: Eye,
      title: t("tips.verifyBeforePay.title"),
      description: t("tips.verifyBeforePay.description"),
    },
    {
      icon: AlertTriangle,
      title: t("tips.neverPayAdvance.title"),
      description: t("tips.neverPayAdvance.description"),
    },
    {
      icon: Phone,
      title: t("tips.communicateSafely.title"),
      description: t("tips.communicateSafely.description"),
    },
    {
      icon: Shield,
      title: t("tips.checkProfile.title"),
      description: t("tips.checkProfile.description"),
    },
    {
      icon: AlertTriangle,
      title: t("tips.reportSuspicious.title"),
      description: t("tips.reportSuspicious.description"),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <HeaderClient />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToHome")}
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-6">
          <p className="text-sm text-muted-foreground">{t("important")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {tips.map((tip, index) => {
            const Icon = tip.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">{t("needHelp.title")}</h2>
              <p className="mb-4 text-muted-foreground">{t("needHelp.description")}</p>
              <div className="flex gap-3">
                <Button asChild variant="outline">
                  <Link href="/contact">{t("needHelp.contact")}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/signaler">{t("needHelp.report")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

