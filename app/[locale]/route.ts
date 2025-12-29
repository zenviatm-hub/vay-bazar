// Force dynamic rendering for all routes under [locale]
// This prevents Next.js from trying to statically prerender pages that use cookies()
export const dynamic = 'force-dynamic'
export const revalidate = 0

