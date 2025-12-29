import type React from "react"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { locales } from "@/i18n"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "../globals.css"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { CookieConsent } from "@/components/cookie-consent"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vay Bazar - Plateforme de petites annonces",
  description: "Vay Bazar - Plateforme de petites annonces pour la communauté tchétchène",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Valider que la locale est supportée
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // IMPORTANT : Définir la locale AVANT getMessages()
  setRequestLocale(locale)

  // Charger les messages pour cette locale
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div className={`${geist.className} ${geistMono.className} flex min-h-screen flex-col`}>
        <main className="content-with-mobile-nav flex-1">{children}</main>
        <Footer />
      </div>
      <MobileNav />
      <CookieConsent />
      <Analytics />
    </NextIntlClientProvider>
  )
}
