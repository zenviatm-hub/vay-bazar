import { getTranslations } from "next-intl/server"
import { Link } from "@/lib/navigation"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default async function NotFound() {
  const t = await getTranslations("notFound")

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <h1 className="mb-2 text-6xl font-bold text-foreground">404</h1>
          <h2 className="mb-4 text-2xl font-semibold text-foreground">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {t("backToHome")}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/annonces">
              <Search className="mr-2 h-4 w-4" />
              {t("browseListings")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

