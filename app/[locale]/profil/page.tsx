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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Phone, MapPin, Upload, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { updateProfile, updatePassword } from "@/lib/auth"
import { getCities, formatPhoneNumber, validatePhoneNumber, type City } from "@/lib/cities"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProfilePage() {
  const t = useTranslations("profile")
  const router = useRouter()
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    avatarUrl: "",
  })
  const [cities, setCities] = useState<City[]>([])
  const [loadingCities, setLoadingCities] = useState(true)
  const [loading, setLoading] = useState(true)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [updating, setUpdating] = useState(false)

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

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/user")
        if (!response.ok) {
          router.push("/connexion")
          return
        }
        const user = await response.json()
        
        // Formater le téléphone s'il existe
        const formattedPhone = user.phone ? formatPhoneNumber(user.phone) : ""
        
        // Trouver la ville correspondante dans la liste si elle existe
        let locationValue = user.location || ""
        if (locationValue && cities.length > 0) {
          // Normaliser la valeur (trim)
          const normalizedLocation = locationValue.trim()
          
          // Chercher une correspondance exacte (insensible à la casse)
          const matchingCity = cities.find(
            (city) => city.name.trim().toLowerCase() === normalizedLocation.toLowerCase()
          )
          
          if (matchingCity) {
            locationValue = matchingCity.name
          } else {
            // Si aucune correspondance, garder la valeur originale
            // Le Select ne pourra pas l'afficher mais on la garde pour référence
            locationValue = normalizedLocation
          }
        }
        
        setProfile({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: formattedPhone,
          location: locationValue,
          bio: user.bio || "",
          avatarUrl: user.avatarUrl || "",
        })
      } catch (err) {
        router.push("/connexion")
      } finally {
        setLoading(false)
      }
    }
    // Attendre que les villes soient chargées avant de charger l'utilisateur
    if (!loadingCities) {
      loadUser()
    }
  }, [router, cities, loadingCities])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    if (profile.phone && !validatePhoneNumber(profile.phone)) {
      setError(t("errors.invalidPhone"))
      return
    }
    
    setUpdating(true)

    const result = await updateProfile(
      profile.firstName,
      profile.lastName,
      profile.phone,
      profile.location,
      profile.bio,
      profile.avatarUrl,
    )

    if (result.success) {
      setSuccess(t("success.profileUpdated"))
      router.refresh()
    } else {
      setError(result.error || t("errors.generic"))
    }
    setUpdating(false)
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (passwords.new !== passwords.confirm) {
      setError(t("errors.passwordMismatch"))
      return
    }

    if (passwords.new.length < 6) {
      setError(t("errors.passwordTooShort"))
      return
    }

    setUpdating(true)

    const result = await updatePassword(passwords.current, passwords.new)

    if (result.success) {
      setSuccess(t("success.passwordUpdated"))
      setPasswords({ current: "", new: "", confirm: "" })
      router.refresh()
    } else {
      setError(result.error || t("errors.generic"))
    }
    setUpdating(false)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setProfile({ ...profile, avatarUrl: url })
    }
  }

  const initials = `${profile.firstName[0] || ""}${profile.lastName[0] || ""}` || "?"

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderClient />
        <div className="container mx-auto max-w-4xl px-4 py-8">
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

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">{t("tabs.profile")}</TabsTrigger>
            <TabsTrigger value="security">{t("tabs.security")}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-6">
                {success && (
                  <Alert className="border-primary/20 bg-primary/5">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-primary">{success}</AlertDescription>
                  </Alert>
                )}

                {/* Avatar */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("avatar.title")}</CardTitle>
                    <CardDescription>{t("avatar.description")}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={profile.avatarUrl || "/placeholder.svg"}
                        alt={`${profile.firstName} ${profile.lastName}`}
                      />
                      <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <Label htmlFor="avatar">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            {t("avatar.changePhoto")}
                          </span>
                        </Button>
                      </Label>
                      <p className="mt-2 text-xs text-muted-foreground">{t("avatar.formatHint")}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Informations personnelles */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("personalInfo.title")}</CardTitle>
                    <CardDescription>{t("personalInfo.description")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t("personalInfo.firstName")}</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="firstName"
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t("personalInfo.lastName")}</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="lastName"
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t("personalInfo.email")}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("personalInfo.phone")}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={t("personalInfo.phonePlaceholder")}
                          value={profile.phone}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value)
                            setProfile({ ...profile, phone: formatted })
                          }}
                          className="pl-10"
                          maxLength={17}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">{t("personalInfo.location")}</Label>
                      {loadingCities ? (
                        <Input id="location" placeholder={t("personalInfo.loadingCities")} disabled className="pl-10" />
                      ) : cities.length === 0 ? (
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                          <Input 
                            id="location" 
                            placeholder={t("personalInfo.locationPlaceholder")} 
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                          <Select
                            value={profile.location && cities.some(c => c.name === profile.location) ? profile.location : ""}
                            onValueChange={(value) => setProfile({ ...profile, location: value })}
                          >
                            <SelectTrigger id="location" className="pl-10">
                              <SelectValue placeholder={profile.location || t("personalInfo.selectCity")}>
                                {profile.location && cities.some(c => c.name === profile.location) 
                                  ? profile.location 
                                  : profile.location || t("personalInfo.selectCity")}
                              </SelectValue>
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
                          {profile.location && !cities.some(c => c.name === profile.location) && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {t("personalInfo.currentCityNotFound", { city: profile.location })}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">{t("personalInfo.bio")}</Label>
                      <Textarea
                        id="bio"
                        placeholder={t("personalInfo.bioPlaceholder")}
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={4}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground">{profile.bio.length}/500 {t("personalInfo.characters")}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    {t("cancel")}
                  </Button>
                  <Button type="submit" disabled={updating}>
                    {updating ? t("saving") : t("saveChanges")}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="security">
            <form onSubmit={handlePasswordUpdate}>
              <div className="space-y-6">
                {success && (
                  <Alert className="border-primary/20 bg-primary/5">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-primary">{success}</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>{t("password.title")}</CardTitle>
                    <CardDescription>{t("password.description")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t("password.currentLabel")}</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          className="pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPasswords.current ? t("password.hidePassword") : t("password.showPassword")}
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t("password.newLabel")}</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwords.new}
                          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                          className="pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPasswords.new ? t("password.hidePassword") : t("password.showPassword")}
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t("password.confirmLabel")}</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwords.confirm}
                          onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                          className="pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPasswords.confirm ? t("password.hidePassword") : t("password.showPassword")}
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPasswords({ current: "", new: "", confirm: "" })}
                  >
                    {t("cancel")}
                  </Button>
                  <Button type="submit" disabled={updating}>
                    {updating ? t("password.updating") : t("password.update")}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
