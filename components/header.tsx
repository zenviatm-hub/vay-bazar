import Link from "next/link"
import { Plus, MessageSquare, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getCurrentUser, signOut } from "@/lib/auth"

export async function Header() {
  const user = await getCurrentUser()

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
              <h1 className="text-xl font-extrabold leading-tight tracking-tight text-foreground">Vay Bazar</h1>
              <p className="text-xs font-medium text-muted-foreground">Petites annonces</p>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
          {user ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden rounded-xl transition-all hover:bg-primary/10 md:flex"
              >
                <Link href="/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
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
                  Favoris
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
                  <span className="hidden sm:inline">Déposer</span>
                  <span className="sm:hidden">Publier</span>
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
                    <Link href="/profil">Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mes-annonces">Mes annonces</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="md:hidden">
                    <Link href="/messages">Messages</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="md:hidden">
                    <Link href="/favoris">Favoris</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={signOut}>
                      <button type="submit" className="w-full text-left">
                        Se déconnecter
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-2xl font-semibold transition-all hover:bg-primary/10"
              >
                <Link href="/connexion">Se connecter</Link>
              </Button>
              <Button
                asChild
                variant="default"
                size="sm"
                className="rounded-2xl gradient-primary border-0 font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                <Link href="/inscription">S'inscrire</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
