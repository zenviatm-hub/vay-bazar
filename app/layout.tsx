import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

// Layout racine minimal requis par Next.js
// Le layout [locale] gère le contenu et l'attribut lang sera mis à jour dynamiquement

// Forcer le rendu dynamique pour toutes les routes
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamicParams = true

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geist.className} ${geistMono.className} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
