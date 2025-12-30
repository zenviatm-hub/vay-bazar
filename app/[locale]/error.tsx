"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Home } from "lucide-react"
import { Link } from "@/lib/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log l'erreur pour le débogage
    console.error("Error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Une erreur est survenue</AlertTitle>
          <AlertDescription className="mt-2">
            {error.message || "Une erreur inattendue s'est produite. Veuillez réessayer."}
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-3">
          <Button onClick={reset} variant="outline">
            Réessayer
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}




