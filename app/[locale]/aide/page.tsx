import { Link } from "@/lib/navigation"
import { HeaderClient } from "@/components/header-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, HelpCircle, MessageSquare, Book, Shield } from "lucide-react"
import { getTranslations } from "next-intl/server"

export const dynamic = 'force-dynamic'

export default async function HelpPage() {
  const t = await getTranslations("help")

  const faqItems = [
    {
      question: t("faq.howToPost.question"),
      answer: t("faq.howToPost.answer"),
    },
    {
      question: t("faq.howToContact.question"),
      answer: t("faq.howToContact.answer"),
    },
    {
      question: t("faq.howToDelete.question"),
      answer: t("faq.howToDelete.answer"),
    },
    {
      question: t("faq.howToReport.question"),
      answer: t("faq.howToReport.answer"),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <HeaderClient />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToHome")}
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t("sections.guide.title")}</CardTitle>
              <CardDescription>{t("sections.guide.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/annonces/nouvelle">{t("sections.guide.button")}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t("sections.safety.title")}</CardTitle>
              <CardDescription>{t("sections.safety.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/conseils-securite">{t("sections.safety.button")}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t("sections.contact.title")}</CardTitle>
              <CardDescription>{t("sections.contact.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/contact">{t("sections.contact.button")}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t("sections.report.title")}</CardTitle>
              <CardDescription>{t("sections.report.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/signaler">{t("sections.report.button")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">{t("faq.title")}</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

