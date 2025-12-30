"use client"

import { useState } from "react"
import { useRouter } from "@/lib/navigation"
import { useTranslations } from "next-intl"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Trash2 } from "lucide-react"

interface DeleteListingButtonProps {
  listingId: number
  listingTitle: string
  onDeleted?: (listingId: number) => void
}

export function DeleteListingButton({ listingId, listingTitle, onDeleted }: DeleteListingButtonProps) {
  const t = useTranslations("myListings")
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || "Erreur lors de la suppression")
        setLoading(false)
        return
      }

      // Fermer le dialogue
      setOpen(false)

      // Appeler le callback si fourni
      if (onDeleted) {
        onDeleted(listingId)
      } else {
        // Sinon, recharger la page
        router.refresh()
      }
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'annonce:", error)
      setError("Une erreur est survenue lors de la suppression")
      setLoading(false)
    }
  }

  return (
    <>
      <DropdownMenuItem
        className="text-destructive"
        onClick={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {t("actions.delete")}
      </DropdownMenuItem>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;annonce &quot;{listingTitle}&quot; ? Cette action est irréversible et supprimera définitivement l&apos;annonce de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

