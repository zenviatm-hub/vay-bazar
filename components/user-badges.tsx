import { ShieldCheck, Award, Star, Users, TrendingUp } from "lucide-react"
import type { Badge } from "@/lib/reviews"
import { Badge as UIBadge } from "@/components/ui/badge"

interface UserBadgesProps {
  badges: Badge[]
  limit?: number
}

const badgeConfig: Record<Badge["badgeType"], { name: string; icon: typeof ShieldCheck; color: string }> = {
  verified: {
    name: "Vérifié",
    icon: ShieldCheck,
    color: "bg-blue-500",
  },
  trusted: {
    name: "Fiable",
    icon: Award,
    color: "bg-green-500",
  },
  top_seller: {
    name: "Top Vendeur",
    icon: Star,
    color: "bg-yellow-500",
  },
  helpful: {
    name: "Serviable",
    icon: Users,
    color: "bg-purple-500",
  },
  active: {
    name: "Actif",
    icon: TrendingUp,
    color: "bg-orange-500",
  },
}

export function UserBadges({ badges, limit }: UserBadgesProps) {
  const displayBadges = limit ? badges.slice(0, limit) : badges

  if (displayBadges.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {displayBadges.map((badge) => {
        const config = badgeConfig[badge.badgeType]
        const Icon = config.icon
        return (
          <UIBadge key={badge.id} variant="secondary" className="flex items-center gap-1 bg-primary/10 text-primary">
            <Icon className="h-3 w-3" />
            <span>{config.name}</span>
          </UIBadge>
        )
      })}
    </div>
  )
}
