import createMiddleware from "next-intl/middleware"
import { locales, defaultLocale } from "./i18n"

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always", // Force /fr, /ru, /ce dans l'URL
})

export const config = {
  // Matcher pour toutes les routes sauf les fichiers statiques et API
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}




