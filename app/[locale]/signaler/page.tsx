"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "@/lib/navigation"
import { HeaderClient } from "@/components/header-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import { useTranslations } from "next-intl"

export default function ReportPage() {
  const t = useTranslations("report")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler l'envoi
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSubmitted(true)
    setIsSubmitting(false)
    ;(e.target as HTMLFormElement).reset()
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderClient />

        <div className="container mx-auto max-w-2xl px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">{t("success.title")}</h2>
              <p className="mb-6 text-muted-foreground">{t("success.description")}</p>
              <Button asChild>
                <Link href="/">{t("success.backToHome")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderClient />

      <div className="container mx-auto max-w-2xl px-4 py-8">
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

        <Alert className="mb-6 border-primary/20 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription>{t("notice")}</AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>{t("form.title")}</CardTitle>
            <CardDescription>{t("form.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="reportType">{t("form.reportType")}</Label>
                <Select name="reportType" required>
                  <SelectTrigger id="reportType" className="mt-2">
                    <SelectValue placeholder={t("form.reportTypePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fraud">{t("form.types.fraud")}</SelectItem>
                    <SelectItem value="spam">{t("form.types.spam")}</SelectItem>
                    <SelectItem value="inappropriate">{t("form.types.inappropriate")}</SelectItem>
                    <SelectItem value="harassment">{t("form.types.harassment")}</SelectItem>
                    <SelectItem value="other">{t("form.types.other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="listingId">{t("form.listingId")}</Label>
                <Input
                  id="listingId"
                  name="listingId"
                  type="text"
                  placeholder={t("form.listingIdPlaceholder")}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="userEmail">{t("form.email")}</Label>
                <Input
                  id="userEmail"
                  name="userEmail"
                  type="email"
                  placeholder={t("form.emailPlaceholder")}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">{t("form.descriptionLabel")}</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder={t("form.descriptionPlaceholder")}
                  required
                  className="mt-2 min-h-[150px]"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? t("form.submitting") : t("form.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

