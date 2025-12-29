"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { HeaderClient } from "@/components/header-client"
import { ListingCard } from "@/components/listing-card"
import { getListings, getCategories, type Listing, type Category } from "@/lib/data-store"
import { getCities, type City } from "@/lib/cities"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, SlidersHorizontal, X } from "lucide-react"

export default function AnnoncesPage() {
  const t = useTranslations("listings")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [showNegotiable, setShowNegotiable] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loadingCities, setLoadingCities] = useState(true)
  const [loading, setLoading] = useState(true)

  // Charger les villes
  useEffect(() => {
    async function loadCities() {
      try {
        const citiesData = await getCities()
        setCities(citiesData)
      } catch (error) {
        console.error("Erreur lors du chargement des villes:", error)
      } finally {
        setLoadingCities(false)
      }
    }
    loadCities()
  }, [])

  // Charger les données depuis Supabase
  useEffect(() => {
    async function loadData() {
      try {
        // Charger d'abord les catégories pour pouvoir trouver l'ID
        const categoriesData = await getCategories()
        setCategories(categoriesData)
        
        // Charger les annonces avec filtres initiaux depuis l'URL
        const urlParams = new URLSearchParams(window.location.search)
        const locationParam = urlParams.get("location")
        const categoryParam = urlParams.get("category")
        const searchParam = urlParams.get("q")
        
        const category = categoriesData.find((cat) => cat.slug === categoryParam)
        
        const listingsData = await getListings({ 
          status: "active",
          location: locationParam || undefined,
          categoryId: category?.id,
          search: searchParam || undefined,
        })
        setListings(listingsData)
        
        // Mettre à jour les états avec les paramètres de l'URL
        if (searchParam) setSearchQuery(searchParam)
        if (categoryParam) setSelectedCategory(categoryParam)
        if (locationParam) setSelectedLocation(locationParam)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Les annonces sont déjà filtrées côté serveur (recherche, catégorie, ville)
  // On applique les filtres supplémentaires côté client (prix, conditions, etc.)
  let filteredListings = listings

  // Filtrer par prix
  filteredListings = filteredListings.filter(
    (listing) => listing.price >= priceRange[0] && listing.price <= priceRange[1],
  )

  // Filtrer par condition
  if (selectedConditions.length > 0) {
    filteredListings = filteredListings.filter(
      (listing) => listing.condition && selectedConditions.includes(listing.condition),
    )
  }

  // Filtrer par négociable
  if (showNegotiable) {
    filteredListings = filteredListings.filter((listing) => listing.priceNegotiable)
  }

  // Trier les annonces
  if (sortBy === "price-asc") {
    filteredListings.sort((a, b) => a.price - b.price)
  } else if (sortBy === "price-desc") {
    filteredListings.sort((a, b) => b.price - a.price)
  } else if (sortBy === "views") {
    filteredListings.sort((a, b) => b.viewsCount - a.viewsCount)
  } else {
    // Par défaut : plus récent en premier
    filteredListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const categoryName = selectedCategory ? categories.find((cat) => cat.slug === selectedCategory)?.name : null

  const conditionOptions = [
    { value: "neuf", label: t("conditions.new") },
    { value: "comme_neuf", label: t("conditions.likeNew") },
    { value: "bon_etat", label: t("conditions.good") },
    { value: "usage_normal", label: t("conditions.normal") },
    { value: "pour_pieces", label: t("conditions.parts") },
  ]

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    )
  }

  // Recharger les annonces quand les filtres principaux changent (recherche, catégorie, ville)
  useEffect(() => {
    // Ne pas recharger pendant le chargement initial (géré par le premier useEffect)
    if (categories.length === 0) return
    
    let isMounted = true
    setLoading(true)
    
    async function reloadListings() {
      try {
        const category = categories.find((cat) => cat.slug === selectedCategory)
        const listingsData = await getListings({
          status: "active",
          location: selectedLocation && selectedLocation.trim() !== "" ? selectedLocation.trim() : undefined,
          categoryId: category?.id,
          search: searchQuery || undefined,
        })
        
        if (isMounted) {
          setListings(listingsData)
        }
      } catch (error) {
        console.error("Erreur lors du rechargement des annonces:", error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    reloadListings()
    
    return () => {
      isMounted = false
    }
  }, [selectedCategory, selectedLocation, searchQuery, categories])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedLocation("")
    setSortBy("recent")
    setPriceRange([0, 50000])
    setSelectedConditions([])
    setShowNegotiable(false)
  }

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedLocation ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== 50000 ? 1 : 0) +
    selectedConditions.length +
    (showNegotiable ? 1 : 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderClient />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">{t("loading")}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderClient />

      <div className="container mx-auto px-4 py-8">
        {/* Header de la page */}
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            {categoryName ? `${categoryName}` : t("allListings")}
          </h1>
          <p className="text-muted-foreground">
            {t("foundCount", { count: filteredListings.length })}
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
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

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t("sortPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">{t("sort.recent")}</SelectItem>
              <SelectItem value="price-asc">{t("sort.priceAsc")}</SelectItem>
              <SelectItem value="price-desc">{t("sort.priceDesc")}</SelectItem>
              <SelectItem value="views">{t("sort.popular")}</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative bg-transparent">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {t("filters")}
                {activeFiltersCount > 0 && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full overflow-y-auto sm:max-w-md">
              <SheetHeader>
                <SheetTitle>{t("advancedFilters.title")}</SheetTitle>
                <SheetDescription>{t("advancedFilters.description")}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Localisation */}
                <div className="space-y-2">
                  <Label htmlFor="location-filter">{t("advancedFilters.location")}</Label>
                  {loadingCities ? (
                    <Input id="location-filter" placeholder={t("advancedFilters.loadingCities")} disabled />
                  ) : cities.length === 0 ? (
                    <Input
                      id="location-filter"
                      placeholder={t("advancedFilters.locationPlaceholder")}
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    />
                  ) : (
                    <Select value={selectedLocation || "all"} onValueChange={(value) => setSelectedLocation(value === "all" ? "" : value)}>
                      <SelectTrigger id="location-filter">
                        <SelectValue placeholder={t("advancedFilters.allCities")} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="all">{t("advancedFilters.allCities")}</SelectItem>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.name}>
                            {city.name}
                            {city.postalCode && ` (${city.postalCode})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Prix */}
                <div className="space-y-4">
                  <Label>{t("advancedFilters.price")}</Label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={50000}
                      step={100}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{priceRange[0].toLocaleString()} €</span>
                    <span>{priceRange[1].toLocaleString()} €</span>
                  </div>
                </div>

                {/* État */}
                <div className="space-y-3">
                  <Label>{t("advancedFilters.condition")}</Label>
                  <div className="space-y-2">
                    {conditionOptions.map((option) => (
                      <div key={option.value} className="flex items-center gap-2">
                        <Checkbox
                          id={`condition-${option.value}`}
                          checked={selectedConditions.includes(option.value)}
                          onCheckedChange={() => handleConditionToggle(option.value)}
                        />
                        <Label htmlFor={`condition-${option.value}`} className="cursor-pointer font-normal">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prix négociable */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="negotiable"
                    checked={showNegotiable}
                    onCheckedChange={(checked) => setShowNegotiable(checked as boolean)}
                  />
                  <Label htmlFor="negotiable" className="cursor-pointer font-normal">
                    {t("advancedFilters.negotiableOnly")}
                  </Label>
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t pt-4">
                  <Button variant="outline" onClick={clearFilters} className="flex-1 bg-transparent">
                    <X className="mr-2 h-4 w-4" />
                    {t("advancedFilters.clear")}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Filtres actifs */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">{t("activeFilters")}:</span>
            {selectedCategory !== "all" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className="h-7 gap-1 text-xs"
              >
                {categories.find((c) => c.slug === selectedCategory)?.name}
                <X className="h-3 w-3" />
              </Button>
            )}
            {selectedLocation && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedLocation("")}
                className="h-7 gap-1 text-xs"
              >
                {selectedLocation}
                <X className="h-3 w-3" />
              </Button>
            )}
            {(priceRange[0] !== 0 || priceRange[1] !== 50000) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPriceRange([0, 50000])}
                className="h-7 gap-1 text-xs"
              >
                {priceRange[0]} € - {priceRange[1]} €
                <X className="h-3 w-3" />
              </Button>
            )}
            {selectedConditions.map((condition) => (
              <Button
                key={condition}
                variant="secondary"
                size="sm"
                onClick={() => handleConditionToggle(condition)}
                className="h-7 gap-1 text-xs"
              >
                {conditionOptions.find((c) => c.value === condition)?.label}
                <X className="h-3 w-3" />
              </Button>
            ))}
            {showNegotiable && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowNegotiable(false)}
                className="h-7 gap-1 text-xs"
              >
                {t("negotiable")}
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
              {t("clearAll")}
            </Button>
          </div>
        )}

        {/* Liste des annonces */}
        {filteredListings.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="mb-2 text-lg text-muted-foreground">{t("noResults.title")}</p>
              <p className="mb-4 text-sm text-muted-foreground">{t("noResults.description")}</p>
              <Button onClick={clearFilters}>{t("noResults.clearFilters")}</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
