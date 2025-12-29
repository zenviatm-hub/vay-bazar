"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "@/lib/navigation"
import { HeaderClient } from "@/components/header-client"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Mail, MessageSquare, Phone } from "lucide-react"

export default function ContactPage() {
  const t = useTranslations("contact")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler l'envoi
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert(t("successMessage"))
    setIsSubmitting(false)
    ;(e.target as HTMLFormElement).reset()
  }

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
          <p className="text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("form.title")}</CardTitle>
                <CardDescription>
                  {t("form.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">{t("form.firstName")}</Label>
                      <Input id="firstName" name="firstName" required className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t("form.lastName")}</Label>
                      <Input id="lastName" name="lastName" required className="mt-2" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{t("form.email")}</Label>
                    <Input id="email" name="email" type="email" required className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="subject">{t("form.subject")}</Label>
                    <Input id="subject" name="subject" required className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="message">{t("form.message")}</Label>
                    <Textarea id="message" name="message" required className="mt-2 min-h-[150px]" />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? t("form.sending") : t("form.submit")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{t("contactInfo.email.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("contactInfo.email.value")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{t("contactInfo.phone.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("contactInfo.phone.value")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{t("contactInfo.social.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("contactInfo.social.description")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
