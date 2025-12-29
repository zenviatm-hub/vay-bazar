"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Mail, MessageSquare, Phone } from "lucide-react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler l'envoi
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert("Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.")
    setIsSubmitting(false)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Nous contacter</h1>
          <p className="text-lg text-muted-foreground">
            Une question, une suggestion ou besoin d'aide ? N'hésitez pas à nous contacter.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envoyer un message</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" name="firstName" required className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" name="lastName" required className="mt-2" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="subject">Sujet</Label>
                    <Input id="subject" name="subject" required className="mt-2" />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" required className="mt-2 min-h-[150px]" />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
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
                <h3 className="mb-2 font-semibold text-foreground">Email</h3>
                <p className="text-sm text-muted-foreground">contact@vaybazar.fr</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Téléphone</h3>
                <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Réseaux sociaux</h3>
                <p className="text-sm text-muted-foreground">Suivez-nous sur nos réseaux pour rester informé.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
