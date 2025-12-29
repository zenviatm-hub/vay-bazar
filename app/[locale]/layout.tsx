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

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamicParams = true

// Ne pas définir generateStaticParams() - cela force Next.js à tenter le pré-rendu statique

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
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/c69a072d-ed96-46c0-9622-bcd79aba2572',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/[locale]/layout.tsx:49',message:'LocaleLayout entry',data:{phase:process.env.NEXT_PHASE||'unknown',nodeEnv:process.env.NODE_ENV},timestamp:Date.now(),sessionId:'debug-session',runId:'build-debug',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const { locale } = await params

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/c69a072d-ed96-46c0-9622-bcd79aba2572',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/[locale]/layout.tsx:56',message:'Locale extracted',data:{locale},timestamp:Date.now(),sessionId:'debug-session',runId:'build-debug',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  // Valider que la locale est supportée
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // IMPORTANT : Définir la locale AVANT getMessages()
  setRequestLocale(locale)

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/c69a072d-ed96-46c0-9622-bcd79aba2572',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/[locale]/layout.tsx:64',message:'Before getMessages()',data:{locale},timestamp:Date.now(),sessionId:'debug-session',runId:'build-debug',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  // Charger les messages pour cette locale
  const messages = await getMessages()

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/c69a072d-ed96-46c0-9622-bcd79aba2572',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/[locale]/layout.tsx:67',message:'After getMessages()',data:{hasMessages:!!messages,messageKeys:Object.keys(messages||{}).length},timestamp:Date.now(),sessionId:'debug-session',runId:'build-debug',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

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
