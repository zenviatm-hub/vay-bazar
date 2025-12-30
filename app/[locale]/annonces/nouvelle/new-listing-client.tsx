"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "@/lib/navigation"
import { useTranslations } from "next-intl"
import { HeaderClient } from "@/components/header-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { getCategories, type Category } from "@/lib/data-store"
import { getCities, formatPhoneNumber, validatePhoneNumber, type City } from "@/lib/cities"
import { Upload, X, AlertCircle, Truck, Heart, HardHat } from "lucide-react"
import imageCompression from "browser-image-compression"

export function NewListingClient() {
  const t = useTranslations("newListing")
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [cities, setCities] = useState<City[]>([])
  const [loadingCities, setLoadingCities] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    price: "",
    priceNegotiable: false,
    condition: "",
    location: "",
    images: [] as string[], // URLs pour prévisualisation
    imageFiles: [] as File[], // Fichiers originaux pour upload
    departureCity: "",
    arrivalCity: "",
    skills: "",
    experience: "",
    whatsappNumber: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Charger les catégories depuis Supabase
  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error)
      } finally {
        setLoadingCategories(false)
      }
    }
    loadCategories()
  }, [])

  // Charger les villes depuis Supabase
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

  // Nettoyer les URLs d'objets lors du démontage du composant
  useEffect(() => {
    const images = formData.images
    return () => {
      images.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [formData.images])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title || !formData.description || !formData.categoryId || !formData.location) {
      setError(t("errors.fillRequired"))
      return
    }

    const selectedCategory = categories.find((cat) => cat.id.toString() === formData.categoryId)

    if (selectedCategory?.specialType === "transport" && (!formData.departureCity || !formData.arrivalCity)) {
      setError(t("errors.fillTransportCities"))
      return
    }

    if (selectedCategory?.specialType === "btp" && (!formData.skills || !formData.experience)) {
      setError(t("errors.fillBtpFields"))
      return
    }

    if (formData.whatsappNumber && !validatePhoneNumber(formData.whatsappNumber)) {
      setError(t("errors.invalidWhatsApp"))
      return
    }

    setLoading(true)

    try {
      // Convertir les images en base64
      const imageBase64Promises = formData.imageFiles.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result as string
            resolve(result)
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      })

      const imageBase64Array = await Promise.all(imageBase64Promises)

      // Appeler l'API pour créer l'annonce
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          categoryId: formData.categoryId,
          price: formData.price || null,
          priceNegotiable: formData.priceNegotiable,
          condition: formData.condition || null,
          location: formData.location,
          images: imageBase64Array,
          departureCity: formData.departureCity || null,
          arrivalCity: formData.arrivalCity || null,
          skills: formData.skills || null,
          experience: formData.experience || null,
          whatsappNumber: formData.whatsappNumber || null,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || t("errors.createFailed"))
        setLoading(false)
        return
      }

      // Rediriger vers la page des annonces
      router.push("/mes-annonces")
    } catch (error: any) {
      console.error("Erreur lors de la création de l'annonce:", error)
      setError(t("errors.createError"))
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const remainingSlots = 6 - formData.images.length
    const filesToProcess = fileArray.slice(0, remainingSlots)

    try {
      const processedImages: string[] = []
      const processedFiles: File[] = []

      for (const file of filesToProcess) {
        // Options de compression
        const options = {
          maxSizeMB: 1, // Taille maximale de 1MB
          maxWidthOrHeight: 1920, // Largeur/hauteur maximale
          useWebWorker: true,
          fileType: "image/jpeg", // Convertir en JPEG pour meilleure compression
        }

        // Compresser l'image
        const compressedFile = await imageCompression(file, options)
        processedFiles.push(compressedFile)

        // Créer une URL pour la prévisualisation
        const previewUrl = URL.createObjectURL(compressedFile)
        processedImages.push(previewUrl)
      }

      setFormData({
        ...formData,
        images: [...formData.images, ...processedImages].slice(0, 6),
        imageFiles: [...formData.imageFiles, ...processedFiles].slice(0, 6),
      })
    } catch (error) {
      console.error("Erreur lors de la compression des images:", error)
      setError(t("errors.imageProcessing"))
    }
  }

  const removeImage = (index: number) => {
    // Libérer l'URL de l'image supprimée
    URL.revokeObjectURL(formData.images[index])
    
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
      imageFiles: formData.imageFiles.filter((_, i) => i !== index),
    })
  }

  const selectedCategory = categories.find((cat) => cat.id.toString() === formData.categoryId)
  const isTransportCategory = selectedCategory?.specialType === "transport"
  const isBtpCategory = selectedCategory?.specialType === "btp"
  const isSadaqaCategory = selectedCategory?.specialType === "sadaqa"

  return (
    <div className="min-h-screen bg-background">
      <HeaderClient />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle>{t("basicInfo.title")}</CardTitle>
              <CardDescription>{t("basicInfo.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  {t("basicInfo.titleLabel")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder={t("basicInfo.titlePlaceholder")}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  maxLength={100}
                  required
                />
                <p className="text-xs text-muted-foreground">{formData.title.length}/100 {t("basicInfo.characters")}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  {t("basicInfo.categoryLabel")} <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t("basicInfo.categoryPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {t("basicInfo.descriptionLabel")} <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder={t("basicInfo.descriptionPlaceholder")}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={8}
                  maxLength={2000}
                  required
                />
                <p className="text-xs text-muted-foreground">{formData.description.length}/2000 {t("basicInfo.characters")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informations de transport */}
          {isTransportCategory && (
            <Card className="border-2 border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  {t("transport.title")}
                </CardTitle>
                <CardDescription>{t("transport.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="departureCity">
                      {t("transport.departureCity")} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="departureCity"
                      placeholder={t("transport.departurePlaceholder")}
                      value={formData.departureCity}
                      onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                      required={isTransportCategory}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arrivalCity">
                      {t("transport.arrivalCity")} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="arrivalCity"
                      placeholder={t("transport.arrivalPlaceholder")}
                      value={formData.arrivalCity}
                      onChange={(e) => setFormData({ ...formData, arrivalCity: e.target.value })}
                      required={isTransportCategory}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Compétences et expérience */}
          {isBtpCategory && (
            <Card className="border-2 border-orange-200 bg-orange-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardHat className="h-5 w-5 text-orange-600" />
                  {t("btp.title")}
                </CardTitle>
                <CardDescription>{t("btp.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skills">
                    {t("btp.skillsLabel")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="skills"
                    placeholder={t("btp.skillsPlaceholder")}
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    required={isBtpCategory}
                  />
                  <p className="text-xs text-muted-foreground">{t("btp.skillsHint")}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">
                    {t("btp.experienceLabel")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="experience"
                    placeholder={t("btp.experiencePlaceholder")}
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    required={isBtpCategory}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {isSadaqaCategory && (
            <Alert className="border-blue-300 bg-blue-50">
              <Heart className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                {t("sadaqa.message")}
              </AlertDescription>
            </Alert>
          )}

          {/* Prix et état */}
          <Card>
            <CardHeader>
              <CardTitle>{t("price.title")}</CardTitle>
              <CardDescription>{t("price.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">{t("price.priceLabel")}</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    disabled={isSadaqaCategory}
                  />
                  <p className="text-xs text-muted-foreground">
                    {isSadaqaCategory ? t("price.sadaqaFree") : t("price.priceHint")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">{t("price.conditionLabel")}</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData({ ...formData, condition: value })}
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder={t("price.conditionPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neuf">{t("price.condition.new")}</SelectItem>
                      <SelectItem value="comme_neuf">{t("price.condition.likeNew")}</SelectItem>
                      <SelectItem value="bon_etat">{t("price.condition.good")}</SelectItem>
                      <SelectItem value="usage_normal">{t("price.condition.normal")}</SelectItem>
                      <SelectItem value="pour_pieces">{t("price.condition.parts")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="negotiable"
                  checked={formData.priceNegotiable}
                  onCheckedChange={(checked) => setFormData({ ...formData, priceNegotiable: checked as boolean })}
                  disabled={isSadaqaCategory}
                />
                <Label htmlFor="negotiable" className="cursor-pointer font-normal">
                  {t("price.negotiable")}
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Localisation et contact */}
          <Card>
            <CardHeader>
              <CardTitle>{t("location.title")}</CardTitle>
              <CardDescription>{t("location.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">
                  {t("location.cityLabel")} <span className="text-destructive">*</span>
                </Label>
                {loadingCities ? (
                  <Input id="location" placeholder={t("location.loadingCities")} disabled required />
                ) : cities.length === 0 ? (
                  <Input 
                    id="location" 
                    placeholder={t("location.cityPlaceholder")} 
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                ) : (
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                    required
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder={t("location.selectCity")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
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

              <div className="space-y-2">
                <Label htmlFor="whatsapp">{t("location.whatsappLabel")}</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder={t("location.whatsappPlaceholder")}
                  value={formData.whatsappNumber}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    setFormData({ ...formData, whatsappNumber: formatted })
                  }}
                  maxLength={17}
                />
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle>{t("photos.title")}</CardTitle>
              <CardDescription>{t("photos.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.images.length < 6 && (
                  <div className="relative">
                    <input
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Label
                      htmlFor="images"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary hover:bg-primary/5"
                    >
                      <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{t("photos.clickToAdd")}</span>
                      <span className="mt-1 text-xs text-muted-foreground">
                        {t("photos.formatHint", { remaining: 6 - formData.images.length })}
                      </span>
                    </Label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              {t("actions.cancel")}
            </Button>
            <Button type="submit" disabled={loading} className="sm:w-auto">
              {loading ? t("actions.publishing") : t("actions.publish")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


