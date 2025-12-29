"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { X, Cookie, Shield, Settings, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [essentialCookies, setEssentialCookies] = useState(true) // Toujours activé
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Afficher le bandeau après un court délai pour une meilleure UX
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Charger les préférences sauvegardées
      const savedAnalytics = localStorage.getItem("analytics-consent")
      if (savedAnalytics === "false") {
        setAnalyticsEnabled(false)
      }
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    localStorage.setItem("analytics-consent", "true")
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    setShowBanner(false)
  }

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected")
    localStorage.setItem("analytics-consent", "false")
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    setShowBanner(false)
    setAnalyticsEnabled(false)
  }

  const handleSaveCustom = () => {
    localStorage.setItem("cookie-consent", "custom")
    localStorage.setItem("analytics-consent", analyticsEnabled ? "true" : "false")
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    setShowBanner(false)
    setShowCustomize(false)
  }

  const handleClose = () => {
    // Fermer sans enregistrer de choix (l'utilisateur peut revenir plus tard)
    setShowBanner(false)
    setShowCustomize(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom">
      <div className="container mx-auto max-w-7xl px-4 pb-4">
        <div className="relative rounded-xl border-2 border-primary/20 bg-card p-6 shadow-2xl backdrop-blur-sm">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>

          {!showCustomize ? (
            // Vue principale
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Cookie className="h-6 w-6 text-primary" />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Gestion des cookies et traceurs
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground">
                  Nous utilisons des <strong>cookies essentiels</strong> pour le fonctionnement du site (authentification, session) 
                  et <strong>Vercel Analytics</strong> pour mesurer l'audience de manière anonyme (sans cookies).
                </p>

                <p className="text-xs text-muted-foreground">
                  En continuant à naviguer, vous acceptez l'utilisation de ces services. 
                  Vous pouvez modifier vos préférences à tout moment.{" "}
                  <Link
                    href="/politique-confidentialite"
                    className="text-primary underline hover:no-underline"
                  >
                    En savoir plus
                  </Link>
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button onClick={handleAccept} size="sm" className="gradient-primary">
                    Tout accepter
                  </Button>
                  <Button onClick={handleReject} variant="outline" size="sm">
                    Refuser les analytics
                  </Button>
                  <Button 
                    onClick={() => setShowCustomize(true)} 
                    variant="ghost" 
                    size="sm"
                    className="gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Personnaliser
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Vue de personnalisation
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Personnaliser vos préférences
                </h3>
              </div>

              <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                {/* Cookies essentiels */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Label htmlFor="essential" className="text-base font-semibold text-foreground">
                      Cookies essentiels
                    </Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Nécessaires au fonctionnement du site (authentification, session). Ces cookies ne peuvent pas être désactivés.
                    </p>
                  </div>
                  <Switch
                    id="essential"
                    checked={essentialCookies}
                    disabled
                    className="opacity-50"
                  />
                </div>

                <div className="h-px bg-border" />

                {/* Analytics */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Label htmlFor="analytics" className="text-base font-semibold text-foreground">
                      Mesure d'audience (Vercel Analytics)
                    </Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Collecte anonyme de données pour améliorer le site (pages visitées, durée de visite, etc.). 
                      <strong className="text-foreground"> N'utilise pas de cookies.</strong>
                    </p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={analyticsEnabled}
                    onCheckedChange={setAnalyticsEnabled}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button onClick={handleSaveCustom} size="sm" className="gradient-primary">
                  Enregistrer mes préférences
                </Button>
                <Button 
                  onClick={() => setShowCustomize(false)} 
                  variant="outline" 
                  size="sm"
                >
                  Retour
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

