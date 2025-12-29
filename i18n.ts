import { getRequestConfig } from "next-intl/server"
import { notFound } from "next/navigation"

export const locales = ["fr", "ru", "ce"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "fr"

export default getRequestConfig(async ({ requestLocale }) => {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/c69a072d-ed96-46c0-9622-bcd79aba2572',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'i18n.ts:8',message:'getRequestConfig entry',data:{phase:process.env.NEXT_PHASE||'unknown',hasRequestLocale:!!requestLocale},timestamp:Date.now(),sessionId:'debug-session',runId:'build-debug',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  // La locale est automatiquement fournie par le middleware
  let locale = await requestLocale

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/c69a072d-ed96-46c0-9622-bcd79aba2572',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'i18n.ts:11',message:'Locale resolved',data:{locale,isDefault:locale===defaultLocale},timestamp:Date.now(),sessionId:'debug-session',runId:'build-debug',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  // Si pas de locale ou locale invalide, utiliser la locale par défaut
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale
  }

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/c69a072d-ed96-46c0-9622-bcd79aba2572',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'i18n.ts:19',message:'Before message import',data:{locale},timestamp:Date.now(),sessionId:'debug-session',runId:'build-debug',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})

