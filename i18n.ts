import { getRequestConfig } from "next-intl/server"
import { notFound } from "next/navigation"

export const locales = ["fr", "ru", "ce"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "fr"

// Forcer le rendu dynamique pour toutes les routes utilisant next-intl
export const dynamic = 'force-dynamic'

export default getRequestConfig(async ({ requestLocale }) => {
  // La locale est automatiquement fournie par le middleware
  let locale = await requestLocale

  // Si pas de locale ou locale invalide, utiliser la locale par défaut
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})

