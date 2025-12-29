import { Link } from "@/lib/navigation"
import { HeaderClient } from "@/components/header-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart, Users, Shield, Handshake } from "lucide-react"
import { getTranslations } from "next-intl/server"

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamicParams = true

export default async function AboutPage() {
  const t = await getTranslations("about")
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
          <p className="text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="mb-12 rounded-lg border bg-card p-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">{t("mission.title")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("mission.description")}
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{t("values.community.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("values.community.description")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{t("values.secure.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("values.secure.description")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{t("values.accessible.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("values.accessible.description")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Handshake className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{t("values.trust.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("values.trust.description")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12 rounded-lg border bg-card p-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">{t("history.title")}</h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            {t("history.paragraph1")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("history.paragraph2")}
          </p>
        </div>

        <div className="rounded-lg border bg-primary/5 p-8 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">{t("join.title")}</h2>
          <p className="mb-6 text-muted-foreground">
            {t("join.description")}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/inscription">{t("join.createAccount")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/annonces">{t("join.browseListings")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
