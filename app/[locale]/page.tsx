import { HeaderClient } from "@/components/header-client"
import { SearchBar } from "@/components/search-bar"
import { CategoryGrid } from "@/components/category-grid"
import { RecentListings } from "@/components/recent-listings"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, MessageCircle, Sparkles, TrendingUp, Users } from "lucide-react"
import { Link } from "@/lib/navigation"
import { getTranslations } from "next-intl/server"

export default async function HomePage() {
  const t = await getTranslations("home")

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <HeaderClient />

      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
        {/* Decorative elements */}
        <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              {t("badge")}
            </div>

            <h1 className="mb-6 text-balance text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
              {t("title")}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                {t("titleHighlight")}
              </span>
            </h1>

            <p className="mb-10 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("subtitle")}
            </p>

            <div className="mx-auto max-w-3xl">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card-modern flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-white shadow-lg">
                <Shield className="h-7 w-7" />
              </div>
              <div>
                <p className="mb-1 text-lg font-bold text-foreground">{t("securePlatform")}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("secureDescription")}
                </p>
              </div>
            </div>

            <div className="card-modern flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/70 text-white shadow-lg">
                <MessageCircle className="h-7 w-7" />
              </div>
              <div>
                <p className="mb-1 text-lg font-bold text-foreground">{t("directCommunication")}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("directDescription")}
                </p>
              </div>
            </div>

            <div className="card-modern flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 to-accent/80 text-white shadow-lg">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <p className="mb-1 text-lg font-bold text-foreground">{t("communitySpirit")}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{t("communityDescription")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-4xl font-extrabold tracking-tight text-foreground">{t("browseCategories")}</h2>
            <p className="text-lg text-muted-foreground">{t("browseDescription")}</p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <RecentListings />
          <div className="mt-10 text-center">
            <Button
              asChild
              size="lg"
              className="group rounded-2xl px-8 py-6 text-base font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              <Link href="/annonces">
                {t("viewAllListings")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/5 to-transparent" />

        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-sm font-semibold text-primary">
              <TrendingUp className="h-4 w-4" />
              {t("freeAndFast")}
            </div>

            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              {t("readyToPost")}
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              {t("readyDescription")}
            </p>

            <Button
              asChild
              size="lg"
              className="group rounded-2xl px-10 py-7 text-lg font-bold shadow-xl transition-all hover:shadow-2xl hover:scale-105"
            >
              <Link href="/annonces/nouvelle">
                {t("postFree")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
