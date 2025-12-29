"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleFavorite } from "@/lib/favorites"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  listingId: number
  initialIsFavorite?: boolean
  variant?: "default" | "ghost"
  size?: "default" | "sm" | "icon"
  showText?: boolean
}

export function FavoriteButton({
  listingId,
  initialIsFavorite = false,
  variant = "ghost",
  size = "icon",
  showText = false,
}: FavoriteButtonProps) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isPending, startTransition] = useTransition()

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    startTransition(async () => {
      const result = await toggleFavorite(listingId)
      if (result.success) {
        setIsFavorite(result.isFavorite)
      } else {
        // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        router.push("/connexion")
      }
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={isPending}
      className={cn(variant === "ghost" && "hover:bg-background/80 backdrop-blur")}
    >
      <Heart className={cn("h-4 w-4", isFavorite && "fill-red-500 text-red-500", showText && "mr-2")} />
      {showText && (isFavorite ? "Retirer des favoris" : "Ajouter aux favoris")}
    </Button>
  )
}
