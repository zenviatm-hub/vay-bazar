import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Forcer le rendu dynamique pour toutes les routes
  // Cela empêche Next.js de tenter le pré-rendu statique
  output: 'standalone',
}

export default withNextIntl(nextConfig)
