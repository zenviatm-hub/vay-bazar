import { Link } from "@/lib/navigation"
import {
  Home,
  Car,
  Briefcase,
  Wrench,
  Smartphone,
  Sofa,
  Shirt,
  Gamepad2,
  Baby,
  UtensilsCrossed,
  Calendar,
  GraduationCap,
  Users,
  Package,
  Truck,
  Heart,
  HardHat,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { getCategories } from "@/lib/data-store"
import { getTranslations, getLocale } from "next-intl/server"
import { translateCategoryName } from "@/lib/category-translations"

const iconMap: Record<string, any> = {
  Home,
  Car,
  Briefcase,
  Wrench,
  Smartphone,
  Sofa,
  Shirt,
  Gamepad2,
  Baby,
  UtensilsCrossed,
  Calendar,
  GraduationCap,
  Users,
  Package,
  Truck,
  Heart,
  HardHat,
}

export async function CategoryGrid() {
  const categories = await getCategories()
  const t = await getTranslations("categories")
  const locale = await getLocale()

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || Package
        const isSadaqa = category.specialType === "sadaqa"
        const translatedName = translateCategoryName(category.name, locale)

        return (
          <Link key={category.id} href={`/annonces?category=${category.slug}`}>
            <Card
              className={`group flex h-full flex-col items-center gap-3 p-4 transition-all hover:shadow-md ${
                isSadaqa
                  ? "border-blue-300 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-50"
                  : "hover:border-primary"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                  isSadaqa
                    ? "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                    : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-center text-sm font-medium leading-tight text-foreground">{translatedName}</span>
              {isSadaqa && <span className="text-xs text-blue-600 font-medium">{t("free")}</span>}
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
