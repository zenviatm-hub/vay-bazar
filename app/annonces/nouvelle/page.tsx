"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

export default function NewListingPage() {
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
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    const selectedCategory = categories.find((cat) => cat.id.toString() === formData.categoryId)

    if (selectedCategory?.specialType === "transport" && (!formData.departureCity || !formData.arrivalCity)) {
      setError("Veuillez remplir les villes de départ et d'arrivée pour cette catégorie")
      return
    }

    if (selectedCategory?.specialType === "btp" && (!formData.skills || !formData.experience)) {
      setError("Veuillez remplir les compétences et l'expérience pour cette catégorie")
      return
    }

    if (formData.whatsappNumber && !validatePhoneNumber(formData.whatsappNumber)) {
      setError("Le numéro WhatsApp n'est pas valide. Format attendu : +33 6 12 34 56 78 ou 06 12 34 56 78")
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
        setError(data.error || "Erreur lors de la création de l'annonce")
        setLoading(false)
        return
      }

      // Rediriger vers la page des annonces
      router.push("/mes-annonces")
    } catch (error: any) {
      console.error("Erreur lors de la création de l'annonce:", error)
      setError("Une erreur est survenue lors de la création de l'annonce")
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
      setError("Erreur lors du traitement des images")
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
          <h1 className="mb-2 text-3xl font-bold text-foreground">Déposer une annonce</h1>
          <p className="text-muted-foreground">Partagez vos biens ou services avec la communauté</p>
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
              <CardTitle>Informations de base</CardTitle>
              <CardDescription>Décrivez votre annonce en détail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Titre de l&apos;annonce <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Ex: Renault Clio 2018 en excellent état"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  maxLength={100}
                  required
                />
                <p className="text-xs text-muted-foreground">{formData.title.length}/100 caractères</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Catégorie <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
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
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre annonce en détail : état, caractéristiques, raison de la vente..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={8}
                  maxLength={2000}
                  required
                />
                <p className="text-xs text-muted-foreground">{formData.description.length}/2000 caractères</p>
              </div>
            </CardContent>
          </Card>

          {/* Informations de transport */}
          {isTransportCategory && (
            <Card className="border-2 border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Informations de transport
                </CardTitle>
                <CardDescription>Précisez les villes de départ et d&apos;arrivée</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="departureCity">
                      Ville de départ <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="departureCity"
                      placeholder="Ex: Paris"
                      value={formData.departureCity}
                      onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                      required={isTransportCategory}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arrivalCity">
                      Ville d&apos;arrivée <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="arrivalCity"
                      placeholder="Ex: Grozny"
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
                  Compétences et expérience
                </CardTitle>
                <CardDescription>Mettez en avant votre savoir-faire professionnel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skills">
                    Compétences <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="skills"
                    placeholder="Ex: Plomberie, Électricité, Maçonnerie..."
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    required={isBtpCategory}
                  />
                  <p className="text-xs text-muted-foreground">Séparez les compétences par des virgules</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">
                    Années d&apos;expérience <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="experience"
                    placeholder="Ex: 15 ans d'expérience professionnelle"
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
                Cette catégorie est réservée aux dons gratuits (Sadaqa). Le prix sera automatiquement à 0€.
              </AlertDescription>
            </Alert>
          )}

          {/* Prix et état */}
          <Card>
            <CardHeader>
              <CardTitle>Prix et état</CardTitle>
              <CardDescription>Indiquez le prix et l&apos;état de l&apos;article</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (€)</Label>
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
                    {isSadaqaCategory ? "Gratuit pour les dons (Sadaqa)" : "Laissez vide si le prix n'est pas fixé"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">État</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData({ ...formData, condition: value })}
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Sélectionnez l'état" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neuf">Neuf</SelectItem>
                      <SelectItem value="comme_neuf">Comme neuf</SelectItem>
                      <SelectItem value="bon_etat">Bon état</SelectItem>
                      <SelectItem value="usage_normal">Usage normal</SelectItem>
                      <SelectItem value="pour_pieces">Pour pièces</SelectItem>
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
                  Prix négociable
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Localisation et contact */}
          <Card>
            <CardHeader>
              <CardTitle>Localisation et contact</CardTitle>
              <CardDescription>Comment vous contacter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">
                  Ville <span className="text-destructive">*</span>
                </Label>
                {loadingCities ? (
                  <Input id="location" placeholder="Chargement des villes..." disabled required />
                ) : cities.length === 0 ? (
                  <Input 
                    id="location" 
                    placeholder="Entrez votre ville (ex: Paris)" 
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
                      <SelectValue placeholder="Sélectionnez votre ville" />
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
                <Label htmlFor="whatsapp">Numéro WhatsApp (recommandé)</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+33 6 12 34 56 78 ou 06 12 34 56 78"
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
              <CardTitle>Photos</CardTitle>
              <CardDescription>Ajoutez jusqu&apos;à 6 photos (recommandé)</CardDescription>
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
                      <span className="text-sm font-medium text-foreground">Cliquez pour ajouter des photos</span>
                      <span className="mt-1 text-xs text-muted-foreground">
                        PNG, JPG jusqu&apos;à 10MB ({6 - formData.images.length} restantes)
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
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="sm:w-auto">
              {loading ? "Publication..." : "Publier l'annonce"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
