"use client"

import { Link, usePathname } from "@/lib/navigation"
import { useTranslations } from "next-intl"
import { Home, Plus, MessageSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()
  const t = useTranslations("mobileNav")

  const navItems = [
    {
      href: "/",
      label: t("home"),
      icon: Home,
    },
    {
      href: "/annonces/nouvelle",
      label: t("publish"),
      icon: Plus,
    },
    {
      href: "/messages",
      label: t("messages"),
      icon: MessageSquare,
    },
    {
      href: "/profil",
      label: t("profile"),
      icon: User,
    },
  ]

  return (
    <div className="mobile-nav-bar">
      <nav className="flex items-center">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} className={cn("mobile-nav-item", isActive && "active")}>
              <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
              <span className={cn(isActive ? "text-primary" : "text-muted-foreground")}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
