import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

// Layout racine minimal requis par Next.js
// Le layout [locale] gère le contenu et l'attribut lang sera mis à jour dynamiquement
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${geist.className} ${geistMono.className} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
