import { Link } from "@/lib/navigation"
import { Facebook, Instagram, MessageCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"

export async function Footer() {
  const t = await getTranslations("footer")
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* À propos */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">{t("about")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/a-propos" className="hover:text-foreground">
                  {t("whoWeAre")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  {t("contactUs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations légales */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">{t("legal")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/cgu" className="hover:text-foreground">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="hover:text-foreground">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="hover:text-foreground">
                  {t("legalNotice")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">{t("help")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/aide" className="hover:text-foreground">
                  {t("helpCenter")}
                </Link>
              </li>
              <li>
                <Link href="/conseils-securite" className="hover:text-foreground">
                  {t("safetyTips")}
                </Link>
              </li>
              <li>
                <Link href="/signaler" className="hover:text-foreground">
                  {t("report")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Suivez-nous */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">{t("followUs")}</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/vaybazar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Telegram"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  )
}
