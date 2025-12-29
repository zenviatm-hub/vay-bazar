"use client"

import { useEffect, useState } from "react"
import { Link } from "@/lib/navigation"
import { useTranslations } from "next-intl"
import { Plus, MessageSquare, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/auth"
import { LanguageSelector } from "@/components/language-selector"
import type { User } from "@/lib/auth"

export function HeaderClient() {
  const t = useTranslations("header")
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/user")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b border-white/30 bg-white/80 backdrop-blur-[12px]"
      style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.04)' }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20">
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 md:h-12 md:w-12">
              <span className="text-xl font-black text-white md:text-2xl">VB</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-extrabold leading-tight tracking-tight text-foreground">{t("title")}</h1>
              <p className="text-xs font-medium text-muted-foreground">{t("subtitle")}</p>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
          <LanguageSelector />
          {!loading && user ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden rounded-xl transition-all hover:bg-primary/10 md:flex"
              >
                <Link href="/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {t("messages")}
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden rounded-xl transition-all hover:bg-primary/10 md:flex"
              >
                <Link href="/favoris">
                  <Heart className="mr-2 h-4 w-4" />
                  {t("favorites")}
                </Link>
              </Button>
              <Button
                asChild
                variant="default"
                size="sm"
                className="rounded-2xl gradient-primary border-0 font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                <Link href="/annonces/nouvelle">
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{t("deposit")}</span>
                  <span className="sm:hidden">{t("publish")}</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-2xl border-2 font-semibold transition-all hover:border-primary hover:bg-primary/5 bg-transparent"
                  >
                    <User className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">
                      {user.firstName} {user.lastName[0]}.
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-2xl">
                  <DropdownMenuItem asChild>
                    <Link href="/profil">{t("profile")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mes-annonces">{t("myListings")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="md:hidden">
                    <Link href="/messages">{t("messages")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="md:hidden">
                    <Link href="/favoris">{t("favorites")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={signOut}>
                      <button type="submit" className="w-full text-left">
                        {t("signOut")}
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : !loading ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-2xl font-semibold transition-all hover:bg-primary/10"
              >
                <Link href="/connexion">{t("signIn")}</Link>
              </Button>
              <Button
                asChild
                variant="default"
                size="sm"
                className="rounded-2xl gradient-primary border-0 font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                <Link href="/inscription">{t("signUp")}</Link>
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}


