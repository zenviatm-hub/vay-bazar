// Store de données avec Supabase (fallback sur données statiques)

import { supabase } from "@/lib/supabase"

export interface Category {
  id: number
  name: string
  slug: string
  icon: string
  description: string
  specialType?: "transport" | "sadaqa" | "btp"
}

export interface Listing {
  id: number
  userId: number
  categoryId: number
  title: string
  description: string
  price: number
  priceNegotiable: boolean
  condition?: string
  location: string
  status: "active" | "sold" | "expired" | "draft"
  viewsCount: number
  images: string[]
  createdAt: string
  updatedAt: string
  userFirstName?: string
  userLastName?: string
  userAvatar?: string
  categoryName?: string
  departureCity?: string // Pour Transport/Colis
  arrivalCity?: string // Pour Transport/Colis
  skills?: string[] // Pour BTP/Services
  experience?: string // Pour BTP/Services
  whatsappNumber?: string // Numéro WhatsApp du vendeur
}

export interface Message {
  id: number
  conversationId: number
  senderId: number
  content: string
  isRead: boolean
  createdAt: string
}

export interface Conversation {
  id: number
  listingId: number
  buyerId: number
  sellerId: number
  lastMessageAt: string
  createdAt: string
  listingTitle?: string
  otherUserName?: string
  otherUserAvatar?: string
}

export interface Review {
  id: number
  fromUserId: number
  toUserId: number
  listingId: number
  rating: number // 1-5
  comment: string
  createdAt: string
  fromUserName?: string
  fromUserAvatar?: string
  listingTitle?: string
}

export interface UserStats {
  userId: number
  totalReviews: number
  averageRating: number
  badges: Badge[]
  memberSince: string
  totalListings: number
  soldListings: number
  responseRate: number // pourcentage
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
}

// Catégories statiques (fallback)
const categoriesFallback: Category[] = [
  {
    id: 1,
    name: "Immobilier",
    slug: "immobilier",
    icon: "Home",
    description: "Vente et location de biens immobiliers",
  },
  { id: 2, name: "Véhicules", slug: "vehicules", icon: "Car", description: "Voitures, motos, et autres véhicules" },
  {
    id: 3,
    name: "Emploi",
    slug: "emploi",
    icon: "Briefcase",
    description: "Offres d'emploi et services professionnels",
  },
  {
    id: 4,
    name: "Services",
    slug: "services",
    icon: "Wrench",
    description: "Services à la personne et professionnels",
  },
  {
    id: 5,
    name: "Électronique",
    slug: "electronique",
    icon: "Smartphone",
    description: "Téléphones, ordinateurs, et électronique",
  },
  {
    id: 6,
    name: "Maison & Jardin",
    slug: "maison-jardin",
    icon: "Sofa",
    description: "Meubles, décoration, et équipement",
  },
  { id: 7, name: "Mode", slug: "mode", icon: "Shirt", description: "Vêtements, chaussures, et accessoires" },
  { id: 8, name: "Loisirs", slug: "loisirs", icon: "Gamepad2", description: "Sports, jeux, et hobbies" },
  { id: 9, name: "Famille", slug: "famille", icon: "Baby", description: "Articles pour enfants et bébés" },
  {
    id: 10,
    name: "Alimentation",
    slug: "alimentation",
    icon: "UtensilsCrossed",
    description: "Produits alimentaires et cuisine",
  },
  { id: 11, name: "Événements", slug: "evenements", icon: "Calendar", description: "Mariages, fêtes, et cérémonies" },
  { id: 12, name: "Éducation", slug: "education", icon: "GraduationCap", description: "Cours, formations, et tutorat" },
  { id: 13, name: "Communauté", slug: "communaute", icon: "Users", description: "Entraide et partage communautaire" },
  { id: 14, name: "Autres", slug: "autres", icon: "Package", description: "Divers articles et services" },
  {
    id: 15,
    name: "BTP / Services",
    slug: "btp-services",
    icon: "HardHat",
    description: "Artisans, plombiers, électriciens, maçons...",
    specialType: "btp",
  },
  {
    id: 16,
    name: "Colis Pays / Transport",
    slug: "transport-colis",
    icon: "Truck",
    description: "Envoi de colis vers le pays, covoiturage",
    specialType: "transport",
  },
  {
    id: 17,
    name: "Sadaqa (Dons)",
    slug: "sadaqa-dons",
    icon: "Heart",
    description: "Objets gratuits offerts à la communauté",
    specialType: "sadaqa",
  },
]

// Fonction pour charger les catégories depuis Supabase
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase.from("categories").select("*").order("id")

    if (error || !data) {
      console.warn("Erreur lors du chargement des catégories depuis Supabase, utilisation du fallback")
      return categoriesFallback
    }

    // Mapper les données de Supabase vers le format Category
    return data.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "",
      description: cat.description || "",
      // Note: specialType n'est pas dans la table, on le détermine par slug
      specialType:
        cat.slug === "sadaqa-dons"
          ? "sadaqa"
          : cat.slug === "transport-colis"
            ? "transport"
            : cat.slug === "btp-services"
              ? "btp"
              : undefined,
    }))
  } catch (error) {
    console.error("Erreur getCategories:", error)
    return categoriesFallback
  }
}

// Export synchronisé pour compatibilité (utilise le fallback)
export const categories: Category[] = categoriesFallback

// Fonction pour charger les annonces depuis Supabase
export async function getListings(filters?: {
  categoryId?: number
  userId?: number
  status?: string
  search?: string
  location?: string
}): Promise<Listing[]> {
  try {
    let query = supabase
      .from("listings")
      .select(
        `
        *,
        users:user_id(first_name, last_name, avatar_url),
        categories:category_id(name, slug)
      `
      )
      .order("created_at", { ascending: false })

    if (filters?.categoryId) {
      query = query.eq("category_id", filters.categoryId)
    }
    if (filters?.userId) {
      query = query.eq("user_id", filters.userId)
    }
    if (filters?.status) {
      query = query.eq("status", filters.status)
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }
    
    if (filters?.location) {
      // Recherche par ville (correspondance exacte ou partielle)
      // Normaliser la recherche pour être plus flexible
      const locationSearch = filters.location.trim()
      query = query.ilike("location", `%${locationSearch}%`)
    }

    const { data, error } = await query

    if (error || !data) {
      console.warn("Erreur lors du chargement des annonces depuis Supabase")
      return []
    }

    // Charger les images pour chaque annonce
    const listingsWithImages = await Promise.all(
      data.map(async (listing) => {
        const { data: images } = await supabase
          .from("listing_images")
          .select("image_url")
          .eq("listing_id", listing.id)
          .order("display_order")

        return {
          id: listing.id,
          userId: listing.user_id,
          categoryId: listing.category_id,
          title: listing.title,
          description: listing.description,
          price: Number(listing.price) || 0,
          priceNegotiable: listing.price_negotiable || false,
          condition: listing.condition,
          location: listing.location,
          status: listing.status as Listing["status"],
          viewsCount: listing.views_count || 0,
          images: images?.map((img) => img.image_url) || [],
          createdAt: listing.created_at,
          updatedAt: listing.updated_at,
          userFirstName: (listing.users as any)?.first_name,
          userLastName: (listing.users as any)?.last_name,
          userAvatar: (listing.users as any)?.avatar_url,
          categoryName: (listing.categories as any)?.name,
        }
      })
    )

    return listingsWithImages
  } catch (error) {
    console.error("Erreur getListings:", error)
    return []
  }
}

// Export synchronisé pour compatibilité (vide, à remplacer progressivement)
export const listings: Listing[] = []

// Messages et conversations (vides au départ)
export const conversations: Conversation[] = []
export const messages: Message[] = []

export const reviews: Review[] = []

export const userStats: Map<number, UserStats> = new Map()
