"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "@/lib/navigation"
import { Link } from "@/lib/navigation"
import { useTranslations } from "next-intl"
import { signUp } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { getCities, formatPhoneNumber, validatePhoneNumber, type City } from "@/lib/cities"

export default function SignUpPage() {
  const t = useTranslations("signup")
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
  })
  const [cities, setCities] = useState<City[]>([])
  const [loadingCities, setLoadingCities] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError(t("errors.passwordMismatch"))
      return
    }

    if (formData.password.length < 6) {
      setError(t("errors.passwordTooShort"))
      return
    }

    if (formData.phone && !validatePhoneNumber(formData.phone)) {
      setError(t("errors.invalidPhone"))
      return
    }

    setLoading(true)

    const result = await signUp(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.phone,
      formData.location,
    )

    if (result.success) {
      router.push("/")
      router.refresh()
    } else {
      setError(result.error || t("errors.generic"))
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <span className="text-2xl font-bold">AC</span>
            </div>
          </div>
          <CardTitle className="text-center text-2xl">{t("title")}</CardTitle>
          <CardDescription className="text-center">{t("description")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("firstNameLabel")} *</Label>
                <Input
                  id="firstName"
                  placeholder={t("firstNamePlaceholder")}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("lastNameLabel")} *</Label>
                <Input
                  id="lastName"
                  placeholder={t("lastNamePlaceholder")}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("emailLabel")} *</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("phoneLabel")}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t("phonePlaceholder")}
                value={formData.phone}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value)
                  setFormData({ ...formData, phone: formatted })
                }}
                maxLength={17}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t("locationLabel")}</Label>
              {loadingCities ? (
                <Input id="location" placeholder={t("loadingCities")} disabled />
              ) : cities.length === 0 ? (
                <Input 
                  id="location" 
                  placeholder={t("locationPlaceholder")} 
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              ) : (
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder={t("selectCity")} />
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
              <Label htmlFor="password">{t("passwordLabel")} *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPasswordLabel")} *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("signingUp") : t("submit")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("alreadyRegistered")}{" "}
              <Link href="/connexion" className="font-medium text-primary hover:underline">
                {t("signIn")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
