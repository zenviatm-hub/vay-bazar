import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart, Users, Shield, Handshake } from "lucide-react"

export const metadata = {
  title: "À propos - Vay Bazar",
  description: "Découvrez Vay Bazar, la plateforme d'échange de la communauté tchétchène",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-foreground">À propos de Vay Bazar</h1>
          <p className="text-lg text-muted-foreground">
            La plateforme d'échange créée par et pour la communauté tchétchène
          </p>
        </div>

        <div className="mb-12 rounded-lg border bg-card p-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Notre mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vay Bazar a été créé avec une vision simple mais puissante : faciliter les échanges et renforcer les liens
            au sein de notre communauté. Dans un monde où la confiance est précieuse, nous offrons un espace sûr où les
            membres de la communauté tchétchène peuvent acheter, vendre et échanger des biens et services en toute
            confiance.
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Communautaire</h3>
              <p className="text-sm text-muted-foreground">
                Créé par et pour notre communauté, Vay Bazar renforce les liens entre ses membres et favorise
                l'entraide.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Sécurisé</h3>
              <p className="text-sm text-muted-foreground">
                Système d'avis et de badges pour identifier les membres fiables. Votre sécurité est notre priorité.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Accessible</h3>
              <p className="text-sm text-muted-foreground">
                Plateforme gratuite et facile à utiliser. Tout le monde peut publier des annonces et participer.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Handshake className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Confiance</h3>
              <p className="text-sm text-muted-foreground">
                Les transactions se font entre membres de confiance, avec transparence et respect mutuel.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12 rounded-lg border bg-card p-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Notre histoire</h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Vay Bazar est né du constat que notre communauté avait besoin d'un espace dédié pour échanger. Les
            plateformes généralistes ne répondaient pas à nos besoins spécifiques : la confiance communautaire, la
            facilité de communication, et la compréhension de nos valeurs.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Aujourd'hui, Vay Bazar rassemble des centaines de membres qui partagent, achètent et vendent en toute
            confiance. De l'immobilier aux services, en passant par l'emploi et les événements, notre plateforme couvre
            tous les besoins du quotidien.
          </p>
        </div>

        <div className="rounded-lg border bg-primary/5 p-8 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Rejoignez la communauté</h2>
          <p className="mb-6 text-muted-foreground">
            Que vous souhaitiez vendre, acheter ou simplement découvrir ce que notre communauté a à offrir, Vay Bazar
            est là pour vous.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/inscription">Créer un compte</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/annonces">Parcourir les annonces</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
