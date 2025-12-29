"use client"

import type React from "react"

import { useState, useMemo, useRef, useEffect } from "react"
import { useRouter } from "@/lib/navigation"
import { useTranslations } from "next-intl"
import { Search, MapPin, X, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCategories, getListings, type Category, type Listing } from "@/lib/data-store"
import { cn } from "@/lib/utils"

export function SearchBar() {
  const t = useTranslations("searchBar")
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [location, setLocation] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focusedField, setFocusedField] = useState<"search" | "location" | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Charger les données depuis Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesData, listingsData] = await Promise.all([
          getCategories(),
          getListings({ status: "active" }),
        ])
        setCategories(categoriesData)
        setListings(listingsData)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      }
    }
    loadData()
  }, [])

  // Suggestions de recherche basées sur les annonces existantes
  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return []
    
    const query = searchQuery.toLowerCase()
    const matchingListings = listings
      .filter((listing) => 
        listing.title.toLowerCase().includes(query) || 
        listing.description.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map((listing) => listing.title)
    
    // Suggestions de catégories
    const matchingCategories = categories
      .filter((cat) => cat.name.toLowerCase().includes(query))
      .slice(0, 3)
      .map((cat) => cat.name)
    
    return [...new Set([...matchingListings, ...matchingCategories])]
  }, [searchQuery, listings, categories])

  // Suggestions de localisation
  const locationSuggestions = useMemo(() => {
    if (!location || location.length < 2) return []
    
    const query = location.toLowerCase()
    const uniqueLocations = [...new Set(listings.map((l) => l.location))]
    return uniqueLocations
      .filter((loc) => loc.toLowerCase().includes(query))
      .slice(0, 5)
  }, [location, listings])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setFocusedField(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (category && category !== "all") params.set("category", category)
    if (location) params.set("location", location)

    router.push(`/annonces?${params.toString()}`)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: string, type: "search" | "location") => {
    if (type === "search") {
      setSearchQuery(suggestion)
    } else {
      setLocation(suggestion)
    }
    setShowSuggestions(false)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setShowSuggestions(false)
  }

  const clearLocation = () => {
    setLocation("")
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch} className="w-full">
        <div 
          className={cn(
            "flex flex-col gap-4 rounded-2xl border-2 bg-card p-6 transition-all duration-300",
            "border-primary/20 shadow-lg hover:border-primary/30 hover:shadow-xl",
            "md:flex-row md:items-end"
          )}
          style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.08)' }}
        >
          {/* Champ de recherche principal */}
          <div className="relative flex-[2] min-w-0">
            <label htmlFor="search" className="mb-2 flex items-center gap-2 text-base font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("searchLabel")}
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors" />
              <Input
                id="search"
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => {
                  setFocusedField("search")
                  if (searchQuery.length >= 2) setShowSuggestions(true)
                }}
                className="h-14 pl-12 pr-10 text-base rounded-xl border-2 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {/* Suggestions de recherche */}
            {showSuggestions && focusedField === "search" && suggestions.length > 0 && (
              <div 
                className="absolute z-50 mt-2 w-full animate-in fade-in-0 zoom-in-95 rounded-xl border-2 border-primary/20 bg-card shadow-xl backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <div className="p-2">
                  <div className="mb-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("suggestions")}
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion, "search")}
                      className="w-full rounded-lg px-4 py-3 text-left text-sm transition-all hover:bg-primary/5 hover:translate-x-1"
                    >
                      <div className="flex items-center gap-3">
                        <Search className="h-4 w-4 text-primary" />
                        <span className="font-medium">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sélecteur de catégorie */}
          <div className="w-full md:w-48">
            <label htmlFor="category" className="mb-2 block text-base font-semibold text-foreground">
              {t("categoryLabel")}
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="h-14 rounded-xl border-2 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder={t("categoryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories")}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Champ de localisation */}
          <div className="relative w-full md:w-48">
            <label htmlFor="location" className="mb-2 block text-base font-semibold text-foreground">
              {t("locationLabel")}
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary transition-colors" />
              <Input
                id="location"
                type="text"
                placeholder={t("locationPlaceholder")}
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => {
                  setFocusedField("location")
                  if (location.length >= 2) setShowSuggestions(true)
                }}
                className="h-14 pl-12 pr-10 text-base rounded-xl border-2 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {location && (
                <button
                  type="button"
                  onClick={clearLocation}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {/* Suggestions de localisation */}
            {showSuggestions && focusedField === "location" && locationSuggestions.length > 0 && (
              <div className="absolute z-50 mt-2 w-full animate-in fade-in-0 zoom-in-95 rounded-xl border-2 border-primary/20 bg-card shadow-xl backdrop-blur-sm">
                <div className="p-2">
                  <div className="mb-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("locations")}
                  </div>
                  {locationSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion, "location")}
                      className="w-full rounded-lg px-4 py-3 text-left text-sm transition-all hover:bg-primary/5 hover:translate-x-1"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bouton de recherche */}
          <Button 
            type="submit" 
            size="lg" 
            className="h-14 w-full rounded-xl text-base font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl md:w-auto md:px-10 gradient-primary border-0"
          >
            <Search className="mr-2 h-5 w-5" />
            {t("searchButton")}
          </Button>
        </div>
      </form>
    </div>
  )
}
